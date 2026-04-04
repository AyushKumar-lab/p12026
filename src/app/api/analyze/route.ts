import { NextRequest, NextResponse } from "next/server";
import { fetchOverpassData, fetchCompetitorPlaces } from "@/lib/overpass";
import { analyzeLocation, computeZoneScoreFromData } from "@/lib/analysis";
import { applyMobilityBlend, resolveMetaMobility } from "@/lib/metaMobility";
import {
  withCache,
  buildAnalysisCacheKey,
  CACHE_TTL,
  getCacheMode,
} from "@/lib/cache";
import { saveAnalysisToPostGIS } from "@/lib/geo";

const SPOT_RADIUS_M = 500;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── A/B Test Configuration ─────────────────────────────────────────── */

const ML_BACKEND_URL = process.env.LOCINTEL_ML_BACKEND_URL || "";
const AB_ML_PERCENT = Math.min(100, Math.max(0,
  parseInt(process.env.LOCINTEL_AB_ML_PERCENT || "80", 10) || 80
));

/**
 * Deterministic arm assignment: hash(lat+lng+type) → 0–99.
 * Same location + type always gets the same arm (no flicker).
 */
function assignAbArm(lat: number, lng: number, businessType: string): "ml" | "rule_based" {
  const key = `${lat.toFixed(5)}:${lng.toFixed(5)}:${businessType}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  const bucket = Math.abs(hash) % 100;
  return bucket < AB_ML_PERCENT ? "ml" : "rule_based";
}

/**
 * Try to get ML score from the Flask backend.
 * Returns null if ML backend is unavailable or fails.
 */
async function fetchMlScore(
  lat: number,
  lng: number,
  businessType: string,
  overpassData: Record<string, number>
): Promise<{ score: number; probabilities?: number[]; modelVersion: string } | null> {
  if (!ML_BACKEND_URL) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const features: Record<string, number> = {
      latitude: lat,
      longitude: lng,
      ...overpassData,
    };

    const resp = await fetch(`${ML_BACKEND_URL}/predict/tabular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) return null;

    const data = await resp.json();
    if (data.error) return null;

    // Convert ML prediction (0/1 binary or probability) to a 0-100 score
    let score: number;
    if (data.task === "classification" && data.probabilities?.length >= 2) {
      // Probability of success class → scale to 0-100
      score = Math.round(data.probabilities[1] * 100);
    } else if (typeof data.prediction === "number") {
      score = Math.round(Math.min(100, Math.max(0, data.prediction)));
    } else {
      return null;
    }

    return {
      score: Math.max(10, Math.min(98, score)),
      probabilities: data.probabilities,
      modelVersion: data.model_version || "unknown",
    };
  } catch {
    // ML backend unavailable — silent fallback
    return null;
  }
}

/**
 * Log A/B test outcome for later analysis.
 * Writes to artifacts/ab_test_log.jsonl (server-side only).
 */
async function logAbResult(entry: Record<string, unknown>): Promise<void> {
  // In serverless (Vercel), we can't write to disk reliably.
  // Log to console in structured format for log aggregation (Vercel Logs / Datadog).
  console.log(
    JSON.stringify({
      _type: "ab_test",
      ...entry,
      timestamp: new Date().toISOString(),
    })
  );
}

/* ── Main Handler ───────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lat, lng, radiusKm, businessType, locationLabel } = body as {
      lat: number;
      lng: number;
      radiusKm: number;
      businessType: string;
      locationLabel?: string;
    };

    if (!lat || !lng || !radiusKm || !businessType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── A/B arm assignment ──
    const abArm = assignAbArm(lat, lng, businessType);
    const startTime = Date.now();

    // Check cache first (Redis or in-memory)
    const cacheKey = buildAnalysisCacheKey(lat, lng, businessType, radiusKm);

    const { data: analysisResult, cached } = await withCache(
      cacheKey,
      CACHE_TTL.ANALYSIS,
      async () => {
        // --- Cache miss: run full analysis ---
        const overpassData = await fetchOverpassData(lat, lng, radiusKm, businessType);
        const result = analyzeLocation(lat, lng, radiusKm, businessType, overpassData);

        // Replace each top-10 spot with ACTUAL score from 500m radius Overpass query + competitor names
        const topPlaces = result.topPlaces;
        for (let i = 0; i < topPlaces.length; i++) {
          const zone = topPlaces[i];
          try {
            const spotData = await fetchOverpassData(zone.lat, zone.lng, SPOT_RADIUS_M / 1000, businessType);
            const computed = computeZoneScoreFromData(spotData, businessType);
            const competitorPlaces = await fetchCompetitorPlaces(zone.lat, zone.lng, SPOT_RADIUS_M, businessType);
            zone.score = computed.score;
            zone.color = computed.color;
            zone.reasoning = computed.reasoning;
            zone.insights = computed.insights;
            zone.competitors = spotData.competitors;
            zone.transitPoints = spotData.transitPoints;
            zone.radiusM = SPOT_RADIUS_M;
            zone.competitorPlaces = competitorPlaces;
          } catch (_) {
            zone.radiusM = SPOT_RADIUS_M;
            zone.competitorPlaces = [];
          }
          await delay(400);
        }

        topPlaces.sort((a, b) => b.score - a.score);
        topPlaces.forEach((z, i) => {
          z.rank = i + 1;
        });

        // ── A/B: Try ML scoring if assigned to ML arm ──
        let mlResult: { score: number; probabilities?: number[]; modelVersion: string } | null = null;
        let scoringMethod: "rule_based" | "ml_model" | "ml_fallback" = "rule_based";

        if (abArm === "ml") {
          mlResult = await fetchMlScore(lat, lng, businessType, {
            competitors: overpassData.competitors,
            transitPoints: overpassData.transitPoints,
            schools: overpassData.schools,
            colleges: overpassData.colleges,
            offices: overpassData.offices,
            residential: overpassData.residential,
            restaurants: overpassData.restaurants,
            hospitals: overpassData.hospitals,
            malls: overpassData.malls,
            parkingSpots: overpassData.parkingSpots,
          });

          if (mlResult) {
            // Use ML overall score, keep rule-based zone scores (ML is location-level)
            result.overallScore = mlResult.score;
            scoringMethod = "ml_model";
          } else {
            // ML backend failed — fallback to rule-based (already computed)
            scoringMethod = "ml_fallback";
          }
        }

        const metaMobility = await resolveMetaMobility(lat, lng, locationLabel);
        if (metaMobility) {
          applyMobilityBlend(result, metaMobility.mobilityIndex0_100);
          result.insights.unshift(
            `Meta Movement Distribution (${metaMobility.gadmName}, ${metaMobility.ds}): mobility index ${metaMobility.mobilityIndex0_100}/100 (${metaMobility.matchedBy} match). Admin-level signal — not store-level foot traffic.`
          );
        }

        return {
          data: result,
          metaMobility,
          confidenceRange: result.confidenceRange,
          seasonalMultiplier: result.seasonalMultiplier,
          seasonLabel: result.seasonLabel,
          source: "OpenStreetMap Overpass API (actual per-spot 500m radius)",
          metaMobilitySource: metaMobility
            ? `Meta Movement Distribution (HDX), district ${metaMobility.gadmId}`
            : undefined,
          abTest: {
            arm: abArm,
            scoringMethod,
            mlBackendUsed: scoringMethod === "ml_model",
            mlModelVersion: mlResult?.modelVersion || null,
            mlTrafficPercent: AB_ML_PERCENT,
          },
        };
      }
    );

    // Persist to PostGIS (fire-and-forget, don't block response)
    if (!cached && analysisResult.data) {
      saveAnalysisToPostGIS(
        lat,
        lng,
        locationLabel ?? null,
        businessType,
        radiusKm,
        analysisResult.data.overallScore,
        analysisResult.data as unknown as Record<string, unknown>
      ).catch(() => {});
    }

    // ── Log A/B result ──
    const responseTimeMs = Date.now() - startTime;
    logAbResult({
      arm: analysisResult.abTest?.arm || abArm,
      scoring_method: analysisResult.abTest?.scoringMethod || "rule_based",
      ml_backend_used: analysisResult.abTest?.mlBackendUsed || false,
      overall_score: analysisResult.data?.overallScore,
      lat,
      lng,
      business_type: businessType,
      response_time_ms: responseTimeMs,
      cached,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      ...analysisResult,
      cached,
      cacheMode: getCacheMode(),
      fetchedAt: cached ? undefined : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
