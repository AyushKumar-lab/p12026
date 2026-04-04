/**
 * Reverse geocode (district-level for India) — free Nominatim.
 * Policy: https://operations.osmfoundation.org/policies/nominatim/ — cache-friendly, low QPS.
 */

type NominatimReverse = {
  address?: {
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state_district?: string;
    suburb?: string;
  };
};

const UA = 'LocIntel/1.0 (location intelligence demo; contact: locintel.in@gmail.com)';

export type ReverseDistrictResult = {
  state: string | null;
  /** Best-effort district / L3 name */
  district: string | null;
  raw: NominatimReverse;
};

export async function reverseGeocodeIndia(lat: number, lng: number): Promise<ReverseDistrictResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('zoom', '10'); // admin area-ish

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as NominatimReverse;
    const a = json.address || {};
    const state = a.state ?? null;
    const district =
      a.state_district ??
      a.county ??
      a.city ??
      a.town ??
      a.village ??
      a.suburb ??
      null;
    return { state, district, raw: json };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
