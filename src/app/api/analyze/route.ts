import { NextRequest, NextResponse } from "next/server";
import { fetchOverpassData, fetchCompetitorPlaces } from "@/lib/overpass";
import { analyzeLocation, computeZoneScoreFromData } from "@/lib/analysis";

const SPOT_RADIUS_M = 500;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lat, lng, radiusKm, businessType } = body;

    if (!lat || !lng || !radiusKm || !businessType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    return NextResponse.json({
      success: true,
      data: result,
      source: "OpenStreetMap Overpass API (actual per-spot 500m radius)",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
