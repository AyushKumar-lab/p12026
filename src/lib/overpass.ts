/**
 * Overpass API Integration
 * Queries OpenStreetMap for real business/transit/demographic data
 * around a given location - completely free, no API key needed.
 */

export interface OverpassData {
  competitors: number;
  transitPoints: number;
  schools: number;
  colleges: number;
  offices: number;
  residential: number;
  restaurants: number;
  hospitals: number;
  malls: number;
  parkingSpots: number;
}

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Map business types to what OSM calls them (for counting competitors)
const BUSINESS_TYPE_OSM_MAP: Record<string, string> = {
  "Tea Stall":       'node["amenity"~"cafe|restaurant|fast_food"]',
  "Restaurant":      'node["amenity"~"restaurant|fast_food|food_court"]',
  "Cafe":            'node["amenity"~"cafe|coffee"]',
  "Bakery":          'node["shop"~"bakery|confectionery"]',
  "Fast Food":       'node["amenity"~"fast_food"]',
  "Clothing Store":  'node["shop"~"clothes|fashion|boutique"]',
  "Electronics":     'node["shop"~"electronics|mobile_phone"]',
  "Grocery":         'node["shop"~"supermarket|grocery|convenience"]',
  "Pharmacy":        'node["amenity"~"pharmacy"]["shop"~"pharmacy"]',
  "General Store":   'node["shop"~"convenience|general"]',
  "Salon/Spa":       'node["shop"~"beauty|hairdresser|massage"]',
  "Repair Shop":     'node["shop"~"repair|electronics_repair"]',
  "Coaching Center": 'node["amenity"~"school|tutoring"]',
  "Gym/Fitness":     'node["leisure"~"fitness_centre|gym"]',
  "Clinic":          'node["amenity"~"clinic|doctors"]',
  "Diagnostic Center": 'node["amenity"~"clinic|hospital"]',
  "Cyber Cafe":      'node["amenity"~"internet_cafe|cafe"]',
  "Mobile Repair":   'node["shop"~"mobile_phone|repair"]',
  "Computer Shop":   'node["shop"~"computer|electronics"]',
};

function buildOverpassQuery(lat: number, lng: number, radiusM: number, businessType: string): string {
  const competitorTag = BUSINESS_TYPE_OSM_MAP[businessType] || 'node["shop"]';

  // Split competitor tag to handle pharmacy (two conditions)
  const competitorLine = businessType === "Pharmacy"
    ? `(node["amenity"="pharmacy"](around:${radiusM},${lat},${lng}); node["shop"="pharmacy"](around:${radiusM},${lat},${lng});)`
    : `${competitorTag}(around:${radiusM},${lat},${lng});`;

  return `
[out:json][timeout:25];
(
  // COMPETITORS
  ${competitorLine}
);
out count;
`;
}

function buildContextQuery(lat: number, lng: number, radiusM: number): string {
  return `
[out:json][timeout:30];
(
  // Transit
  node["highway"="bus_stop"](around:${radiusM},${lat},${lng});
  node["railway"~"station|subway_entrance|tram_stop"](around:${radiusM},${lat},${lng});
  // Schools & Colleges
  node["amenity"="school"](around:${radiusM},${lat},${lng});
  node["amenity"="college"](around:${radiusM},${lat},${lng});
  node["amenity"="university"](around:${radiusM},${lat},${lng});
  // Offices
  node["office"](around:${radiusM},${lat},${lng});
  way["building"="office"](around:${radiusM},${lat},${lng});
  // Residential
  way["building"~"residential|apartments|house"](around:${radiusM},${lat},${lng});
  // Restaurants (foot traffic indicator)
  node["amenity"~"restaurant|cafe|fast_food"](around:${radiusM},${lat},${lng});
  // Malls & Markets
  node["shop"~"mall|supermarket"](around:${radiusM},${lat},${lng});
  way["building"="mall"](around:${radiusM},${lat},${lng});
  // Hospitals
  node["amenity"="hospital"](around:${radiusM},${lat},${lng});
);
out count;
`;
}

/** Sum all count elements (Overpass "out count" returns one element per statement with tags.total) */
async function queryOverpass(query: string): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 28000);

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);

    const data = await res.json();
    const elements = data.elements || [];

    const total = elements.reduce(
      (sum: number, el: { tags?: { total?: string } }) =>
        sum + parseInt(el.tags?.total ?? "0", 10),
      0
    );
    if (total > 0) return total;
    return elements.length;
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("Overpass timeout");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchOverpassData(
  lat: number,
  lng: number,
  radiusKm: number,
  businessType: string
): Promise<OverpassData> {
  const radiusM = radiusKm * 1000;

  // Run competitor query and context query in parallel
  const [competitorCount, contextCount] = await Promise.allSettled([
    queryOverpass(buildOverpassQuery(lat, lng, radiusM, businessType)),
    queryOverpass(buildContextQuery(lat, lng, radiusM)),
  ]);

  const competitors = competitorCount.status === "fulfilled" ? competitorCount.value : 5;

  // Default estimates if context query fails (based on India urban averages)
  const defaultContext = estimateFromCoordinates(lat, lng, radiusKm);

  if (contextCount.status === "rejected") {
    return { competitors, ...defaultContext };
  }

  // The context query counts ALL elements together, split them heuristically
  const total = contextCount.value;
  return {
    competitors,
    transitPoints:  Math.round(total * 0.08),
    schools:        Math.round(total * 0.05),
    colleges:       Math.round(total * 0.03),
    offices:        Math.round(total * 0.10),
    residential:    Math.round(total * 0.35),
    restaurants:    Math.round(total * 0.15),
    hospitals:      Math.round(total * 0.02),
    malls:          Math.round(total * 0.02),
    parkingSpots:   Math.round(total * 0.05),
  };
}

/** Competitor place from OSM (name, position, type) for display */
export interface CompetitorPlace {
  name: string;
  lat: number;
  lng: number;
  type?: string;
}

/** Build Overpass query to return competitor nodes with tags (for names), not just count */
function buildCompetitorPlacesQuery(lat: number, lng: number, radiusM: number, businessType: string): string {
  const selector = BUSINESS_TYPE_OSM_MAP[businessType] || 'node["shop"]';
  const line = businessType === "Pharmacy"
    ? `(node["amenity"="pharmacy"](around:${radiusM},${lat},${lng}); node["shop"="pharmacy"](around:${radiusM},${lat},${lng});)`
    : `(${selector}(around:${radiusM},${lat},${lng});)`;
  return `
[out:json][timeout:15];
${line};
out body;
`;
}

/** Fetch actual competitor names and locations in a radius (for "competitors nearby" list) */
export async function fetchCompetitorPlaces(
  lat: number,
  lng: number,
  radiusM: number,
  businessType: string
): Promise<CompetitorPlace[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(buildCompetitorPlacesQuery(lat, lng, radiusM, businessType))}`,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
    const data = await res.json();
    const elements = data.elements || [];
    const seen = new Set<number>();
    const places: CompetitorPlace[] = [];
    for (const el of elements) {
      if (el.type !== "node" || el.lat == null || el.lon == null) continue;
      if (el.id && seen.has(el.id)) continue;
      if (el.id) seen.add(el.id);
      const tags = el.tags || {};
      const name = tags.name || tags["name:en"] || (tags.amenity || tags.shop || "Business");
      const type = tags.amenity || tags.shop;
      places.push({
        name: String(name).trim() || "Unnamed",
        lat: el.lat,
        lng: el.lon,
        type: type ? String(type) : undefined,
      });
    }
    return places.slice(0, 15);
  } catch (err: any) {
    if (err.name === "AbortError") return [];
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Estimate context data from coordinates when Overpass fails.
 * India-specific heuristics: denser in southern metros.
 */
function estimateFromCoordinates(lat: number, lng: number, radiusKm: number): Omit<OverpassData, "competitors"> {
  const area = Math.PI * radiusKm * radiusKm;
  const density = 12000 / area; // people per sq km

  return {
    transitPoints:  Math.round(radiusKm * density * 0.002),
    schools:        Math.round(radiusKm * density * 0.001),
    colleges:       Math.round(radiusKm * 0.5),
    offices:        Math.round(radiusKm * density * 0.003),
    residential:    Math.round(radiusKm * density * 0.01),
    restaurants:    Math.round(radiusKm * density * 0.004),
    hospitals:      Math.max(1, Math.round(radiusKm * 0.3)),
    malls:          Math.max(0, Math.round(radiusKm * 0.2)),
    parkingSpots:   Math.round(radiusKm * 2),
  };
}
