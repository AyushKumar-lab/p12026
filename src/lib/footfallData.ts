/**
 * Innovation 7 — Real-Time Footfall Heatmap
 * Grid-cell based footfall proxy data.
 * Simulated from OLA Maps Mobility API trip origins/destinations patterns.
 * Supports morning/afternoon/evening/weekend toggles.
 */

export interface FootfallCell {
  lat: number;
  lng: number;
  /** Normalized intensity 0-100 for afternoon (base) */
  baseIntensity: number;
  city: string;
}

export type FootfallTimeSlot = 'morning' | 'afternoon' | 'evening' | 'night' | 'weekend';

const TIME_MULTIPLIERS: Record<FootfallTimeSlot, number> = {
  morning: 0.6,
  afternoon: 1.0,
  evening: 1.5,
  night: 0.1,
  weekend: 1.2,
};

export function getTimeMultiplier(slot: FootfallTimeSlot): number {
  return TIME_MULTIPLIERS[slot] ?? 1.0;
}

/**
 * Seed footfall grid cells for 5 launch cities.
 * Each cell represents ~200m x 200m area with estimated footfall intensity.
 * In production, this will be replaced with OLA Maps Mobility API data.
 */
export const FOOTFALL_GRID: FootfallCell[] = [
  // Bhubaneswar — high traffic zones
  { lat: 20.2720, lng: 85.8390, baseIntensity: 92, city: 'Bhubaneswar' }, // Master Canteen
  { lat: 20.2685, lng: 85.8340, baseIntensity: 88, city: 'Bhubaneswar' }, // Unit-1 Market
  { lat: 20.2862, lng: 85.8530, baseIntensity: 85, city: 'Bhubaneswar' }, // Rasulgarh
  { lat: 20.2890, lng: 85.8440, baseIntensity: 82, city: 'Bhubaneswar' }, // Saheed Nagar
  { lat: 20.2950, lng: 85.8170, baseIntensity: 78, city: 'Bhubaneswar' }, // Jaydev Vihar
  { lat: 20.2870, lng: 85.8210, baseIntensity: 75, city: 'Bhubaneswar' }, // Kalpana Square
  { lat: 20.2980, lng: 85.8400, baseIntensity: 72, city: 'Bhubaneswar' }, // Vani Vihar
  { lat: 20.3530, lng: 85.8190, baseIntensity: 65, city: 'Bhubaneswar' }, // Patia
  { lat: 20.2750, lng: 85.8000, baseIntensity: 70, city: 'Bhubaneswar' }, // Baramunda
  { lat: 20.2555, lng: 85.7870, baseIntensity: 60, city: 'Bhubaneswar' }, // Khandagiri
  { lat: 20.2705, lng: 85.8400, baseIntensity: 80, city: 'Bhubaneswar' }, // Station Road
  { lat: 20.2960, lng: 85.8060, baseIntensity: 55, city: 'Bhubaneswar' }, // Nayapalli
  { lat: 20.3100, lng: 85.8200, baseIntensity: 50, city: 'Bhubaneswar' }, // Chandrasekharpur
  { lat: 20.2419, lng: 85.8190, baseIntensity: 68, city: 'Bhubaneswar' }, // Lingaraj Temple area
  { lat: 20.2350, lng: 85.8400, baseIntensity: 45, city: 'Bhubaneswar' }, // Dhauli area

  // Cuttack — high traffic zones
  { lat: 20.4625, lng: 85.8830, baseIntensity: 90, city: 'Cuttack' }, // Choudhury Bazar
  { lat: 20.4680, lng: 85.8900, baseIntensity: 85, city: 'Cuttack' }, // Buxi Bazar
  { lat: 20.4690, lng: 85.8780, baseIntensity: 82, city: 'Cuttack' }, // Badambadi
  { lat: 20.4740, lng: 85.8700, baseIntensity: 70, city: 'Cuttack' }, // Madhupatna
  { lat: 20.4620, lng: 85.8740, baseIntensity: 65, city: 'Cuttack' }, // Link Road
  { lat: 20.4520, lng: 85.8650, baseIntensity: 55, city: 'Cuttack' }, // OMP area

  // Berhampur
  { lat: 19.3150, lng: 84.7940, baseIntensity: 80, city: 'Berhampur' }, // Gol Bazar
  { lat: 19.3100, lng: 84.7870, baseIntensity: 75, city: 'Berhampur' }, // Bada Bazar
  { lat: 19.3110, lng: 84.7910, baseIntensity: 78, city: 'Berhampur' }, // Bus Stand
  { lat: 19.3170, lng: 84.7960, baseIntensity: 65, city: 'Berhampur' }, // Ganjam area
  { lat: 19.2900, lng: 84.8100, baseIntensity: 50, city: 'Berhampur' }, // Gopalpur Road

  // Sambalpur
  { lat: 21.4669, lng: 83.9756, baseIntensity: 78, city: 'Sambalpur' }, // Town Hall
  { lat: 21.4610, lng: 83.9740, baseIntensity: 72, city: 'Sambalpur' }, // Station area
  { lat: 21.4550, lng: 83.9650, baseIntensity: 60, city: 'Sambalpur' }, // Dhanupali
  { lat: 21.4720, lng: 83.9870, baseIntensity: 55, city: 'Sambalpur' }, // Ainthapali

  // Raipur
  { lat: 21.2370, lng: 81.6350, baseIntensity: 88, city: 'Raipur' }, // Pandri Market
  { lat: 21.2410, lng: 81.6530, baseIntensity: 75, city: 'Raipur' }, // Telibandha
  { lat: 21.2170, lng: 81.6330, baseIntensity: 80, city: 'Raipur' }, // Station area
  { lat: 21.2450, lng: 81.6250, baseIntensity: 70, city: 'Raipur' }, // Fafadih
  { lat: 21.2200, lng: 81.6000, baseIntensity: 55, city: 'Raipur' }, // Gudhiyari
  { lat: 21.2650, lng: 81.6100, baseIntensity: 50, city: 'Raipur' }, // Tatibandh
];

/**
 * Get footfall intensity for a grid cell adjusted by time slot.
 */
export function getFootfallForSlot(cell: FootfallCell, slot: FootfallTimeSlot): number {
  return Math.round(cell.baseIntensity * getTimeMultiplier(slot));
}

/**
 * Get nearby footfall cells within a radius (in km) of a lat/lng, adjusted by time.
 */
export function getFootfallNearby(
  lat: number,
  lng: number,
  radiusKm: number,
  slot: FootfallTimeSlot = 'afternoon'
): Array<FootfallCell & { adjustedIntensity: number; distanceKm: number }> {
  return FOOTFALL_GRID
    .map((cell) => {
      const dist = haversineKm(lat, lng, cell.lat, cell.lng);
      return {
        ...cell,
        adjustedIntensity: getFootfallForSlot(cell, slot),
        distanceKm: Math.round(dist * 100) / 100,
      };
    })
    .filter((c) => c.distanceKm <= radiusKm)
    .sort((a, b) => b.adjustedIntensity - a.adjustedIntensity);
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
