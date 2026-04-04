/**
 * Census 2011 Ward-Level Demographics
 *
 * Seed data for the 5 supported cities based on Census 2011 + MSME Ministry data.
 * Real data: download CSVs from censusindia.gov.in and import via scripts/import_census.py.
 *
 * Each ward has: population density, literacy rate, age distribution,
 * household count, working population %, and spending power proxy.
 */

export interface WardDemographics {
  wardName: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  /** People per sq km */
  populationDensity: number;
  /** Total population in ward */
  totalPopulation: number;
  /** Literacy rate 0-100 */
  literacyRate: number;
  /** % of population aged 18-35 */
  youthPercent: number;
  /** % of population aged 36-60 */
  workingAgePercent: number;
  /** Number of households */
  households: number;
  /** % of population in workforce */
  workforcePercent: number;
  /** Spending power index 0-100 (derived from occupation + education data) */
  spendingPowerIndex: number;
  /** Sex ratio (females per 1000 males) */
  sexRatio: number;
}

// Ward-level data for 5 supported cities (Census 2011 + estimates)
const CENSUS_DATA: WardDemographics[] = [
  // ── Bhubaneswar, Odisha ──
  { wardName: 'Unit-1 (Market Area)', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2685, lng: 85.8345, populationDensity: 18500, totalPopulation: 42000, literacyRate: 89.5, youthPercent: 32, workingAgePercent: 38, households: 9800, workforcePercent: 48, spendingPowerIndex: 72, sexRatio: 918 },
  { wardName: 'Saheed Nagar', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2865, lng: 85.8455, populationDensity: 16200, totalPopulation: 38000, literacyRate: 91.2, youthPercent: 35, workingAgePercent: 36, households: 8900, workforcePercent: 52, spendingPowerIndex: 78, sexRatio: 925 },
  { wardName: 'Jaydev Vihar', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2980, lng: 85.8180, populationDensity: 14800, totalPopulation: 35000, literacyRate: 92.8, youthPercent: 38, workingAgePercent: 34, households: 8200, workforcePercent: 55, spendingPowerIndex: 82, sexRatio: 930 },
  { wardName: 'Patia', city: 'Bhubaneswar', state: 'Odisha', lat: 20.3535, lng: 85.8190, populationDensity: 12500, totalPopulation: 28000, literacyRate: 90.5, youthPercent: 42, workingAgePercent: 30, households: 6500, workforcePercent: 50, spendingPowerIndex: 68, sexRatio: 910 },
  { wardName: 'Nayapalli', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2920, lng: 85.7985, populationDensity: 15800, totalPopulation: 36000, literacyRate: 88.2, youthPercent: 30, workingAgePercent: 40, households: 8400, workforcePercent: 46, spendingPowerIndex: 65, sexRatio: 922 },
  { wardName: 'Chandrasekharpur', city: 'Bhubaneswar', state: 'Odisha', lat: 20.3260, lng: 85.8130, populationDensity: 11200, totalPopulation: 25000, literacyRate: 93.5, youthPercent: 36, workingAgePercent: 35, households: 6000, workforcePercent: 54, spendingPowerIndex: 85, sexRatio: 935 },
  { wardName: 'Rasulgarh', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2780, lng: 85.8620, populationDensity: 17200, totalPopulation: 40000, literacyRate: 86.8, youthPercent: 28, workingAgePercent: 42, households: 9200, workforcePercent: 44, spendingPowerIndex: 58, sexRatio: 908 },
  { wardName: 'Baramunda', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2715, lng: 85.8080, populationDensity: 19800, totalPopulation: 45000, literacyRate: 84.5, youthPercent: 26, workingAgePercent: 44, households: 10500, workforcePercent: 42, spendingPowerIndex: 52, sexRatio: 900 },

  // ── Cuttack, Odisha ──
  { wardName: 'College Square', city: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8830, populationDensity: 22500, totalPopulation: 48000, literacyRate: 85.2, youthPercent: 30, workingAgePercent: 40, households: 11000, workforcePercent: 43, spendingPowerIndex: 60, sexRatio: 915 },
  { wardName: 'Buxi Bazaar', city: 'Cuttack', state: 'Odisha', lat: 20.4680, lng: 85.8790, populationDensity: 25800, totalPopulation: 52000, literacyRate: 82.5, youthPercent: 28, workingAgePercent: 42, households: 12500, workforcePercent: 40, spendingPowerIndex: 55, sexRatio: 905 },
  { wardName: 'Badambadi', city: 'Cuttack', state: 'Odisha', lat: 20.4550, lng: 85.8750, populationDensity: 20200, totalPopulation: 44000, literacyRate: 86.8, youthPercent: 32, workingAgePercent: 38, households: 10200, workforcePercent: 45, spendingPowerIndex: 62, sexRatio: 910 },
  { wardName: 'Tulsipur', city: 'Cuttack', state: 'Odisha', lat: 20.4720, lng: 85.8920, populationDensity: 18500, totalPopulation: 38000, literacyRate: 88.0, youthPercent: 34, workingAgePercent: 36, households: 8800, workforcePercent: 47, spendingPowerIndex: 65, sexRatio: 920 },
  { wardName: 'Naya Bazaar', city: 'Cuttack', state: 'Odisha', lat: 20.4590, lng: 85.8680, populationDensity: 24000, totalPopulation: 50000, literacyRate: 80.5, youthPercent: 26, workingAgePercent: 44, households: 11800, workforcePercent: 38, spendingPowerIndex: 48, sexRatio: 895 },

  // ── Berhampur, Odisha ──
  { wardName: 'Giri Market', city: 'Berhampur', state: 'Odisha', lat: 19.3115, lng: 84.7940, populationDensity: 16500, totalPopulation: 32000, literacyRate: 78.5, youthPercent: 28, workingAgePercent: 42, households: 7200, workforcePercent: 38, spendingPowerIndex: 45, sexRatio: 988 },
  { wardName: 'Bada Bazaar', city: 'Berhampur', state: 'Odisha', lat: 19.3050, lng: 84.7880, populationDensity: 19200, totalPopulation: 38000, literacyRate: 76.2, youthPercent: 26, workingAgePercent: 44, households: 8500, workforcePercent: 36, spendingPowerIndex: 42, sexRatio: 992 },
  { wardName: 'Ambapua', city: 'Berhampur', state: 'Odisha', lat: 19.3240, lng: 84.8050, populationDensity: 12800, totalPopulation: 25000, literacyRate: 80.5, youthPercent: 32, workingAgePercent: 38, households: 5800, workforcePercent: 42, spendingPowerIndex: 50, sexRatio: 985 },
  { wardName: 'Gopalpur Road', city: 'Berhampur', state: 'Odisha', lat: 19.2880, lng: 84.7720, populationDensity: 10500, totalPopulation: 20000, literacyRate: 82.0, youthPercent: 34, workingAgePercent: 36, households: 4600, workforcePercent: 44, spendingPowerIndex: 55, sexRatio: 980 },

  // ── Sambalpur, Odisha ──
  { wardName: 'Khetrajpur', city: 'Sambalpur', state: 'Odisha', lat: 21.4550, lng: 83.9780, populationDensity: 14200, totalPopulation: 28000, literacyRate: 80.5, youthPercent: 30, workingAgePercent: 40, households: 6500, workforcePercent: 42, spendingPowerIndex: 52, sexRatio: 960 },
  { wardName: 'Budharaja', city: 'Sambalpur', state: 'Odisha', lat: 21.4680, lng: 83.9650, populationDensity: 12800, totalPopulation: 24000, literacyRate: 82.2, youthPercent: 32, workingAgePercent: 38, households: 5600, workforcePercent: 45, spendingPowerIndex: 58, sexRatio: 955 },
  { wardName: 'Ainthapali', city: 'Sambalpur', state: 'Odisha', lat: 21.4720, lng: 83.9920, populationDensity: 11500, totalPopulation: 22000, literacyRate: 84.0, youthPercent: 36, workingAgePercent: 34, households: 5200, workforcePercent: 48, spendingPowerIndex: 62, sexRatio: 950 },
  { wardName: 'Dhanupali', city: 'Sambalpur', state: 'Odisha', lat: 21.4480, lng: 83.9550, populationDensity: 9800, totalPopulation: 18000, literacyRate: 78.5, youthPercent: 28, workingAgePercent: 42, households: 4200, workforcePercent: 40, spendingPowerIndex: 48, sexRatio: 965 },

  // ── Raipur, Chhattisgarh ──
  { wardName: 'Pandri', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2290, lng: 81.6380, populationDensity: 20500, totalPopulation: 45000, literacyRate: 82.5, youthPercent: 30, workingAgePercent: 40, households: 10500, workforcePercent: 44, spendingPowerIndex: 60, sexRatio: 925 },
  { wardName: 'Malviya Nagar', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2480, lng: 81.6250, populationDensity: 15200, totalPopulation: 35000, literacyRate: 86.8, youthPercent: 34, workingAgePercent: 36, households: 8200, workforcePercent: 50, spendingPowerIndex: 72, sexRatio: 930 },
  { wardName: 'Shankar Nagar', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2350, lng: 81.6450, populationDensity: 18800, totalPopulation: 42000, literacyRate: 84.0, youthPercent: 32, workingAgePercent: 38, households: 9800, workforcePercent: 46, spendingPowerIndex: 65, sexRatio: 920 },
  { wardName: 'Telibandha', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2420, lng: 81.6550, populationDensity: 12500, totalPopulation: 28000, literacyRate: 90.2, youthPercent: 38, workingAgePercent: 32, households: 6500, workforcePercent: 55, spendingPowerIndex: 82, sexRatio: 935 },
  { wardName: 'Tatibandh', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2680, lng: 81.6120, populationDensity: 8500, totalPopulation: 18000, literacyRate: 80.0, youthPercent: 36, workingAgePercent: 34, households: 4200, workforcePercent: 42, spendingPowerIndex: 55, sexRatio: 915 },
];

/**
 * Get ward demographics for a city.
 */
export function getCensusDataForCity(city: string): WardDemographics[] {
  const normalized = city.toLowerCase().trim();
  return CENSUS_DATA.filter((w) => w.city.toLowerCase() === normalized);
}

/**
 * Find the nearest ward to given coordinates.
 * Returns the closest ward within 10km, or null.
 */
export function findNearestWard(lat: number, lng: number): WardDemographics | null {
  let best: WardDemographics | null = null;
  let bestDist = Infinity;

  for (const ward of CENSUS_DATA) {
    const d = haversine(lat, lng, ward.lat, ward.lng);
    if (d < bestDist) {
      bestDist = d;
      best = ward;
    }
  }

  // Max 10km radius
  return bestDist <= 10000 ? best : null;
}

/**
 * Get demographics score (0-100) for a location.
 * Combines population density, literacy, youth %, and spending power.
 */
export function getDemographicsScore(lat: number, lng: number): {
  score: number;
  ward: WardDemographics | null;
  factors: { label: string; value: string; impact: 'positive' | 'neutral' | 'negative' }[];
} {
  const ward = findNearestWard(lat, lng);
  if (!ward) {
    return { score: 50, ward: null, factors: [{ label: 'Demographics', value: 'No ward data available', impact: 'neutral' }] };
  }

  const factors: { label: string; value: string; impact: 'positive' | 'neutral' | 'negative' }[] = [];

  // Population density score (0-30 pts)
  const densityScore = Math.min(30, (ward.populationDensity / 25000) * 30);
  factors.push({
    label: 'Population density',
    value: `${ward.populationDensity.toLocaleString()}/km²`,
    impact: densityScore > 20 ? 'positive' : densityScore > 10 ? 'neutral' : 'negative',
  });

  // Literacy score (0-15 pts)
  const literacyScore = (ward.literacyRate / 100) * 15;
  factors.push({
    label: 'Literacy rate',
    value: `${ward.literacyRate}%`,
    impact: ward.literacyRate > 85 ? 'positive' : 'neutral',
  });

  // Youth score — young population = more demand (0-20 pts)
  const youthScore = Math.min(20, (ward.youthPercent / 40) * 20);
  factors.push({
    label: 'Youth population (18-35)',
    value: `${ward.youthPercent}%`,
    impact: ward.youthPercent > 30 ? 'positive' : 'neutral',
  });

  // Spending power (0-25 pts)
  const spendingScore = (ward.spendingPowerIndex / 100) * 25;
  factors.push({
    label: 'Spending power index',
    value: `${ward.spendingPowerIndex}/100`,
    impact: ward.spendingPowerIndex > 65 ? 'positive' : ward.spendingPowerIndex > 45 ? 'neutral' : 'negative',
  });

  // Workforce participation (0-10 pts)
  const workforceScore = Math.min(10, (ward.workforcePercent / 55) * 10);
  factors.push({
    label: 'Workforce participation',
    value: `${ward.workforcePercent}%`,
    impact: ward.workforcePercent > 45 ? 'positive' : 'neutral',
  });

  const totalScore = Math.round(densityScore + literacyScore + youthScore + spendingScore + workforceScore);

  return { score: Math.min(100, totalScore), ward, factors };
}

/**
 * Get all wards within a radius (km) of a point.
 */
export function getWardsInRadius(lat: number, lng: number, radiusKm: number): WardDemographics[] {
  const radiusM = radiusKm * 1000;
  return CENSUS_DATA.filter((w) => haversine(lat, lng, w.lat, w.lng) <= radiusM);
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
