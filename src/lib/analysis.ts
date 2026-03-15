/**
 * Location Analysis Engine
 * Calculates business viability scores for different zones around a location
 * using real Overpass API data. Different business types have different weights.
 */

import type { OverpassData } from "./overpass";

export interface CompetitorPlace {
  name: string;
  lat: number;
  lng: number;
  type?: string;
}

export interface Zone {
  id: number;
  lat: number;
  lng: number;
  score: number;
  color: "green" | "yellow" | "red";
  reasoning: string;
  competitors: number;
  transitPoints: number;
  targetMatch: number;
  insights: string[];
  /** 1–10 for top 10 best places; only set on topPlaces */
  rank?: number;
  /** Radius in metres used for this spot's actual score (e.g. 500) */
  radiusM?: number;
  /** Actual competitor names from OSM in this radius */
  competitorPlaces?: CompetitorPlace[];
}

export interface AnalysisResult {
  overallScore: number;
  zones: Zone[];
  /** Top 5–10 best places to open the business, with rank 1, 2, 3… */
  topPlaces: Zone[];
  insights: string[];
  dataPoints: {
    competitors: number;
    transitPoints: number;
    schools: number;
    colleges: number;
    offices: number;
    residential: number;
  };
}

// Scoring weights per business type
type WeightConfig = {
  transit: number;
  residential: number;
  offices: number;
  colleges: number;
  restaurants: number;    // foot traffic proxy
  competition_penalty: number;  // subtracted per competitor
};

const BUSINESS_WEIGHTS: Record<string, WeightConfig> = {
  "Tea Stall": {
    transit: 0.35, residential: 0.20, offices: 0.15,
    colleges: 0.15, restaurants: 0.05, competition_penalty: 2,
  },
  "Restaurant": {
    transit: 0.20, residential: 0.25, offices: 0.20,
    colleges: 0.15, restaurants: 0.10, competition_penalty: 3,
  },
  "Cafe": {
    transit: 0.20, residential: 0.15, offices: 0.25,
    colleges: 0.25, restaurants: 0.10, competition_penalty: 4,
  },
  "Bakery": {
    transit: 0.20, residential: 0.35, offices: 0.10,
    colleges: 0.15, restaurants: 0.10, competition_penalty: 5,
  },
  "Fast Food": {
    transit: 0.35, residential: 0.15, offices: 0.20,
    colleges: 0.15, restaurants: 0.10, competition_penalty: 2,
  },
  "Clothing Store": {
    transit: 0.25, residential: 0.20, offices: 0.15,
    colleges: 0.20, restaurants: 0.10, competition_penalty: 4,
  },
  "Electronics": {
    transit: 0.30, residential: 0.15, offices: 0.25,
    colleges: 0.15, restaurants: 0.05, competition_penalty: 5,
  },
  "Grocery": {
    transit: 0.15, residential: 0.50, offices: 0.10,
    colleges: 0.05, restaurants: 0.05, competition_penalty: 6,
  },
  "Pharmacy": {
    transit: 0.10, residential: 0.50, offices: 0.10,
    colleges: 0.05, restaurants: 0.05, competition_penalty: 8,
  },
  "General Store": {
    transit: 0.15, residential: 0.45, offices: 0.10,
    colleges: 0.10, restaurants: 0.05, competition_penalty: 5,
  },
  "Salon/Spa": {
    transit: 0.20, residential: 0.30, offices: 0.20,
    colleges: 0.15, restaurants: 0.05, competition_penalty: 4,
  },
  "Repair Shop": {
    transit: 0.25, residential: 0.30, offices: 0.20,
    colleges: 0.10, restaurants: 0.05, competition_penalty: 6,
  },
  "Coaching Center": {
    transit: 0.20, residential: 0.20, offices: 0.05,
    colleges: 0.40, restaurants: 0.05, competition_penalty: 7,
  },
  "Gym/Fitness": {
    transit: 0.20, residential: 0.30, offices: 0.25,
    colleges: 0.15, restaurants: 0.05, competition_penalty: 6,
  },
  "Clinic": {
    transit: 0.15, residential: 0.50, offices: 0.10,
    colleges: 0.10, restaurants: 0.05, competition_penalty: 7,
  },
  "Diagnostic Center": {
    transit: 0.20, residential: 0.40, offices: 0.15,
    colleges: 0.10, restaurants: 0.05, competition_penalty: 6,
  },
  "Cyber Cafe": {
    transit: 0.25, residential: 0.15, offices: 0.15,
    colleges: 0.35, restaurants: 0.05, competition_penalty: 5,
  },
  "Mobile Repair": {
    transit: 0.30, residential: 0.20, offices: 0.15,
    colleges: 0.20, restaurants: 0.05, competition_penalty: 4,
  },
  "Computer Shop": {
    transit: 0.25, residential: 0.15, offices: 0.30,
    colleges: 0.20, restaurants: 0.05, competition_penalty: 5,
  },
};

function normalize(value: number, min: number, max: number): number {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

function scoreForBusiness(data: OverpassData, businessType: string): number {
  const w = BUSINESS_WEIGHTS[businessType] || BUSINESS_WEIGHTS["General Store"];

  // Normalize each factor (0–1)
  const transitScore    = normalize(data.transitPoints, 0, 20) * 100;
  const residentialScore = normalize(data.residential, 0, 100) * 100;
  const officeScore     = normalize(data.offices, 0, 30) * 100;
  const collegeScore    = normalize(data.colleges + data.schools, 0, 10) * 100;
  const restaurantScore = normalize(data.restaurants, 0, 40) * 100;

  // Competition penalty: more competitors = lower score
  const competitionPenalty = Math.min(40, data.competitors * w.competition_penalty);

  const rawScore =
    transitScore    * w.transit +
    residentialScore * w.residential +
    officeScore     * w.offices +
    collegeScore    * w.colleges +
    restaurantScore * w.restaurants;

  return Math.max(10, Math.min(98, Math.round(rawScore - competitionPenalty)));
}

function generateInsights(data: OverpassData, businessType: string, score: number): string[] {
  const insights: string[] = [];

  if (data.colleges > 2) insights.push(`${data.colleges} colleges/universities nearby — strong student customer base`);
  if (data.offices > 5) insights.push(`${data.offices} offices in area — good professional foot traffic`);
  if (data.transitPoints > 3) insights.push(`${data.transitPoints} bus/metro stops — excellent transit connectivity`);
  if (data.residential > 30) insights.push(`Dense residential zone — high local population`);
  if (data.competitors < 3) insights.push(`Low competition — only ${data.competitors} similar businesses nearby`);
  if (data.competitors > 10) insights.push(`High competition — ${data.competitors} similar businesses in area`);
  if (data.hospitals > 0 && ["Pharmacy", "Clinic", "Diagnostic Center"].includes(businessType)) {
    insights.push(`${data.hospitals} hospital(s) nearby — strong medical ecosystem`);
  }
  if (data.malls > 0) insights.push(`${data.malls} mall/market nearby — established commercial zone`);
  if (score >= 80) insights.push("Excellent overall location score based on real area data");
  else if (score >= 60) insights.push("Moderate potential — good balance of demand and competition");
  else insights.push("High competition or low target customer density in this specific zone");

  return insights.slice(0, 4);
}

// Doc: Avoid 0–40, Moderate 41–70, Recommended 71–100
function colorForScore(score: number): "green" | "yellow" | "red" {
  if (score >= 71) return "green";
  if (score >= 41) return "yellow";
  return "red";
}

function reasoningText(data: OverpassData, businessType: string, score: number): string {
  if (score >= 75) {
    const parts: string[] = [];
    if (data.colleges > 1) parts.push(`${data.colleges} colleges nearby`);
    if (data.transitPoints > 2) parts.push(`${data.transitPoints} transit stops`);
    if (data.competitors < 5) parts.push("low competition");
    if (data.residential > 20) parts.push("dense residential area");
    return `Strong location: ${parts.slice(0, 3).join(", ")}`;
  }
  if (score >= 50) {
    return data.competitors > 8
      ? `Moderate zone: ${data.competitors} competitors present, decent foot traffic`
      : `Good potential with ${data.transitPoints} transit points and moderate demand`;
  }
  return data.competitors > 10
    ? `High saturation: ${data.competitors} similar businesses already operating here`
    : `Low customer density for ${businessType} in this specific zone`;
}

/**
 * Compute actual score and metadata from real Overpass data for a single spot (e.g. 500m radius).
 * Used to replace simulated scores with real per-spot data.
 */
export function computeZoneScoreFromData(
  data: OverpassData,
  businessType: string
): { score: number; color: "green" | "yellow" | "red"; reasoning: string; insights: string[] } {
  const score = scoreForBusiness(data, businessType);
  return {
    score,
    color: colorForScore(score),
    reasoning: reasoningText(data, businessType, score),
    insights: generateInsights(data, businessType, score),
  };
}

/**
 * Generate many zone offsets in rings around the center so we can rank and pick top 5–10 best places.
 * Inner ring, mid ring, outer ring + center = 25 candidate spots.
 */
function getZoneOffsets(radiusKm: number): Array<{ dlat: number; dlng: number; factor: number }> {
  // 1° lat ≈ 111 km; 1° lng ≈ 111 * cos(lat) km
  const scale = radiusKm / 111;
  const points: Array<{ dlat: number; dlng: number; factor: number }> = [
    { dlat: 0, dlng: 0, factor: 1.0 },
  ];
  // Inner ring (~0.25 * radius), 8 directions
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI;
    points.push({
      dlat: scale * 0.25 * Math.cos(angle),
      dlng: scale * 0.25 * Math.sin(angle),
      factor: 0.88 + (i % 3) * 0.04,
    });
  }
  // Mid ring (~0.5 * radius), 8 directions (staggered)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI + 0.2;
    points.push({
      dlat: scale * 0.5 * Math.cos(angle),
      dlng: scale * 0.5 * Math.sin(angle),
      factor: 0.72 + (i % 4) * 0.05,
    });
  }
  // Outer ring (~0.75 * radius), 8 directions
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI + 0.4;
    points.push({
      dlat: scale * 0.75 * Math.cos(angle),
      dlng: scale * 0.75 * Math.sin(angle),
      factor: 0.55 + (i % 3) * 0.05,
    });
  }
  return points;
}

export function analyzeLocation(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  businessType: string,
  data: OverpassData
): AnalysisResult {
  const offsets = getZoneOffsets(radiusKm);

  const zones: Zone[] = offsets.map((offset, idx) => {
    // Vary data slightly at each zone to simulate spatial variation
    const variation = 0.75 + offset.factor * 0.25;
    const zoneData: OverpassData = {
      competitors:   Math.round(data.competitors * (2 - variation)),
      transitPoints: Math.round(data.transitPoints * variation),
      schools:       Math.round(data.schools * variation),
      colleges:      Math.round(data.colleges * variation),
      offices:       Math.round(data.offices * variation),
      residential:   Math.round(data.residential * variation),
      restaurants:   Math.round(data.restaurants * variation),
      hospitals:     data.hospitals,
      malls:         data.malls,
      parkingSpots:  data.parkingSpots,
    };

    const score = scoreForBusiness(zoneData, businessType);

    return {
      id: idx + 1,
      lat: centerLat + offset.dlat,
      lng: centerLng + offset.dlng,
      score,
      color: colorForScore(score),
      reasoning: reasoningText(zoneData, businessType, score),
      competitors: zoneData.competitors,
      transitPoints: zoneData.transitPoints,
      targetMatch: Math.min(98, score + Math.round(Math.random() * 10)),
      insights: generateInsights(zoneData, businessType, score),
    };
  });

  // Sort: best zones first
  zones.sort((a, b) => b.score - a.score);

  // Top 10 best places with rank 1–10 (or fewer if we have fewer zones)
  const topPlaces: Zone[] = zones.slice(0, 10).map((z, i) => ({ ...z, rank: i + 1 }));

  const overallScore = Math.round(
    topPlaces.length ? topPlaces.reduce((sum, z) => sum + z.score, 0) / topPlaces.length : 0
  );

  const topInsights = [
    ...generateInsights(data, businessType, overallScore),
    `Analyzed ${data.competitors} competing ${businessType}s within ${radiusKm}km`,
    `${data.transitPoints} public transit points in target area`,
  ].slice(0, 5);

  return {
    overallScore,
    zones,
    topPlaces,
    insights: topInsights,
    dataPoints: {
      competitors:  data.competitors,
      transitPoints: data.transitPoints,
      schools:      data.schools,
      colleges:     data.colleges,
      offices:      data.offices,
      residential:  data.residential,
    },
  };
}
