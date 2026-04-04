/**
 * OSRM Routing Integration — Free, no auth required.
 * Uses router.project-osrm.org (public demo server).
 * Provides commute time between any two points.
 */

const OSRM_BASE = 'https://router.project-osrm.org';

export interface CommuteResult {
  durationMinutes: number;
  distanceKm: number;
  profile: 'driving' | 'foot';
}

/**
 * Get driving commute time between two coordinates.
 */
export async function getDriveTime(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<CommuteResult | null> {
  return getCommuteTime(fromLat, fromLng, toLat, toLng, 'driving');
}

/**
 * Get walking commute time between two coordinates.
 */
export async function getWalkTime(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<CommuteResult | null> {
  return getCommuteTime(fromLat, fromLng, toLat, toLng, 'foot');
}

/**
 * Core OSRM routing call.
 * OSRM expects coordinates as lng,lat (not lat,lng).
 */
async function getCommuteTime(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  profile: 'driving' | 'foot'
): Promise<CommuteResult | null> {
  const url = `${OSRM_BASE}/route/v1/${profile}/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!resp.ok) return null;

    const data = await resp.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;

    const route = data.routes[0];
    return {
      durationMinutes: Math.round(route.duration / 60),
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
      profile,
    };
  } catch {
    return null;
  }
}

/**
 * Batch commute times from one origin to multiple destinations.
 * Adds 200ms delay between requests to be polite to the public server.
 */
export async function batchDriveTimes(
  fromLat: number,
  fromLng: number,
  destinations: Array<{ lat: number; lng: number; id: string }>
): Promise<Map<string, CommuteResult | null>> {
  const results = new Map<string, CommuteResult | null>();

  for (const dest of destinations) {
    const result = await getDriveTime(fromLat, fromLng, dest.lat, dest.lng);
    results.set(dest.id, result);
    // Polite delay for public OSRM server
    await new Promise((r) => setTimeout(r, 200));
  }

  return results;
}

/**
 * Estimate commute time without API call (Haversine + average speed).
 * Fallback when OSRM is unreachable.
 */
export function estimateCommuteMinutes(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  profile: 'driving' | 'foot' = 'driving'
): number {
  const R = 6371;
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLon = ((toLng - fromLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Average speeds for Indian Tier-2/3 cities
  const avgSpeedKmh = profile === 'driving' ? 25 : 5;
  return Math.max(1, Math.round((distKm / avgSpeedKmh) * 60));
}
