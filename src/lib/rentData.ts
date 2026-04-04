/**
 * Commercial Rent Data — 99acres seed + scraper integration
 *
 * Seed data: locality-level commercial rents for 5 supported cities.
 * Real data: run `python scripts/scrape_99acres.py` to populate from 99acres.
 */

export interface CommercialRent {
  locality: string;
  city: string;
  lat: number;
  lng: number;
  /** Monthly rent per sq ft in ₹ */
  rentPerSqft: number;
  /** Average shop size in sq ft */
  avgSizeSqft: number;
  /** Monthly rent range: [min, max] in ₹ */
  rentRange: [number, number];
  /** Number of listings sampled */
  sampleSize: number;
  /** Data source */
  source: '99acres' | 'magicbricks' | 'seed';
  /** Last updated */
  updatedAt: string;
}

const COMMERCIAL_RENT_DATA: CommercialRent[] = [
  // ── Bhubaneswar ──
  { locality: 'Saheed Nagar', city: 'Bhubaneswar', lat: 20.2865, lng: 85.8455, rentPerSqft: 45, avgSizeSqft: 350, rentRange: [12000, 22000], sampleSize: 18, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Jaydev Vihar', city: 'Bhubaneswar', lat: 20.2980, lng: 85.8180, rentPerSqft: 55, avgSizeSqft: 400, rentRange: [18000, 30000], sampleSize: 12, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Patia', city: 'Bhubaneswar', lat: 20.3535, lng: 85.8190, rentPerSqft: 35, avgSizeSqft: 300, rentRange: [8000, 15000], sampleSize: 22, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Nayapalli', city: 'Bhubaneswar', lat: 20.2920, lng: 85.7985, rentPerSqft: 38, avgSizeSqft: 280, rentRange: [8500, 14000], sampleSize: 15, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Chandrasekharpur', city: 'Bhubaneswar', lat: 20.3260, lng: 85.8130, rentPerSqft: 50, avgSizeSqft: 450, rentRange: [15000, 28000], sampleSize: 10, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Rasulgarh', city: 'Bhubaneswar', lat: 20.2780, lng: 85.8620, rentPerSqft: 30, avgSizeSqft: 250, rentRange: [6000, 10000], sampleSize: 20, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Baramunda', city: 'Bhubaneswar', lat: 20.2715, lng: 85.8080, rentPerSqft: 25, avgSizeSqft: 200, rentRange: [4000, 8000], sampleSize: 25, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Unit-1 Market', city: 'Bhubaneswar', lat: 20.2685, lng: 85.8345, rentPerSqft: 60, avgSizeSqft: 300, rentRange: [15000, 25000], sampleSize: 14, source: 'seed', updatedAt: '2026-03-15' },

  // ── Cuttack ──
  { locality: 'College Square', city: 'Cuttack', lat: 20.4625, lng: 85.8830, rentPerSqft: 35, avgSizeSqft: 300, rentRange: [8000, 15000], sampleSize: 16, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Buxi Bazaar', city: 'Cuttack', lat: 20.4680, lng: 85.8790, rentPerSqft: 28, avgSizeSqft: 200, rentRange: [4500, 8000], sampleSize: 22, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Badambadi', city: 'Cuttack', lat: 20.4550, lng: 85.8750, rentPerSqft: 32, avgSizeSqft: 280, rentRange: [7000, 12000], sampleSize: 18, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Tulsipur', city: 'Cuttack', lat: 20.4720, lng: 85.8920, rentPerSqft: 30, avgSizeSqft: 320, rentRange: [7500, 13000], sampleSize: 10, source: 'seed', updatedAt: '2026-03-15' },

  // ── Berhampur ──
  { locality: 'Giri Market', city: 'Berhampur', lat: 19.3115, lng: 84.7940, rentPerSqft: 20, avgSizeSqft: 200, rentRange: [3000, 6000], sampleSize: 15, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Bada Bazaar', city: 'Berhampur', lat: 19.3050, lng: 84.7880, rentPerSqft: 22, avgSizeSqft: 180, rentRange: [3200, 5500], sampleSize: 20, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Ambapua', city: 'Berhampur', lat: 19.3240, lng: 84.8050, rentPerSqft: 18, avgSizeSqft: 250, rentRange: [3500, 6500], sampleSize: 12, source: 'seed', updatedAt: '2026-03-15' },

  // ── Sambalpur ──
  { locality: 'Khetrajpur', city: 'Sambalpur', lat: 21.4550, lng: 83.9780, rentPerSqft: 22, avgSizeSqft: 250, rentRange: [4000, 7500], sampleSize: 14, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Budharaja', city: 'Sambalpur', lat: 21.4680, lng: 83.9650, rentPerSqft: 25, avgSizeSqft: 300, rentRange: [5000, 9000], sampleSize: 10, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Ainthapali', city: 'Sambalpur', lat: 21.4720, lng: 83.9920, rentPerSqft: 20, avgSizeSqft: 280, rentRange: [4500, 7000], sampleSize: 8, source: 'seed', updatedAt: '2026-03-15' },

  // ── Raipur ──
  { locality: 'Pandri', city: 'Raipur', lat: 21.2290, lng: 81.6380, rentPerSqft: 35, avgSizeSqft: 350, rentRange: [9000, 18000], sampleSize: 20, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Malviya Nagar', city: 'Raipur', lat: 21.2480, lng: 81.6250, rentPerSqft: 40, avgSizeSqft: 400, rentRange: [12000, 22000], sampleSize: 15, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Shankar Nagar', city: 'Raipur', lat: 21.2350, lng: 81.6450, rentPerSqft: 38, avgSizeSqft: 320, rentRange: [10000, 16000], sampleSize: 18, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Telibandha', city: 'Raipur', lat: 21.2420, lng: 81.6550, rentPerSqft: 50, avgSizeSqft: 500, rentRange: [18000, 35000], sampleSize: 8, source: 'seed', updatedAt: '2026-03-15' },
  { locality: 'Tatibandh', city: 'Raipur', lat: 21.2680, lng: 81.6120, rentPerSqft: 25, avgSizeSqft: 300, rentRange: [5000, 10000], sampleSize: 12, source: 'seed', updatedAt: '2026-03-15' },
];

/**
 * Get commercial rents for a city.
 */
export function getCommercialRentsForCity(city: string): CommercialRent[] {
  return COMMERCIAL_RENT_DATA.filter((r) => r.city.toLowerCase() === city.toLowerCase().trim());
}

/**
 * Find nearest commercial rent data point to coordinates.
 */
export function findNearestRentData(lat: number, lng: number): CommercialRent | null {
  let best: CommercialRent | null = null;
  let bestDist = Infinity;

  for (const r of COMMERCIAL_RENT_DATA) {
    const d = haversine(lat, lng, r.lat, r.lng);
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }

  return bestDist <= 10000 ? best : null;
}

/**
 * Get rent affordability score (0-100).
 * Lower rents = higher score (more affordable = better for new businesses).
 */
export function getRentAffordabilityScore(lat: number, lng: number, monthlyBudget: number): {
  score: number;
  rent: CommercialRent | null;
  affordable: boolean;
  message: string;
} {
  const rent = findNearestRentData(lat, lng);
  if (!rent) {
    return { score: 50, rent: null, affordable: true, message: 'No rent data available for this area' };
  }

  const avgMonthlyRent = rent.rentPerSqft * rent.avgSizeSqft;
  const affordable = monthlyBudget >= rent.rentRange[0];
  const ratio = monthlyBudget / avgMonthlyRent;

  let score: number;
  if (ratio >= 2.0) score = 95;
  else if (ratio >= 1.5) score = 85;
  else if (ratio >= 1.0) score = 70;
  else if (ratio >= 0.7) score = 50;
  else if (ratio >= 0.5) score = 30;
  else score = 15;

  const message = affordable
    ? `₹${rent.rentRange[0].toLocaleString()}-${rent.rentRange[1].toLocaleString()}/mo in ${rent.locality} (₹${rent.rentPerSqft}/sqft)`
    : `Rent in ${rent.locality} starts at ₹${rent.rentRange[0].toLocaleString()}/mo — above your budget`;

  return { score, rent, affordable, message };
}

/**
 * Get all rent data within radius (km).
 */
export function getRentsInRadius(lat: number, lng: number, radiusKm: number): CommercialRent[] {
  const radiusM = radiusKm * 1000;
  return COMMERCIAL_RENT_DATA.filter((r) => haversine(lat, lng, r.lat, r.lng) <= radiusM);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
