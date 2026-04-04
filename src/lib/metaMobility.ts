import type { AnalysisResult } from '@/lib/analysis';
import mobilityIndia from '@/data/meta-mobility-india-by-gadm.json';
import { gadmAdmin1PrefixForIndianState, indianStatePrefixFromText } from '@/lib/indiaAdmin1Prefix';
import { reverseGeocodeIndia } from '@/lib/nominatim';

export type MetaMobilityDistrictRow = {
  gadm_name: string;
  ds: string;
  short_trip_share: number;
  mobility_index_0_100: number;
};

type IndiaMobilityFile = {
  dataset: string;
  note?: string;
  districtCount?: number;
  districts: Record<string, MetaMobilityDistrictRow>;
  nameIndex: Record<string, string[]>;
};

const FILE = mobilityIndia as IndiaMobilityFile;

function normToken(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function pickGadmId(
  ids: string[],
  statePrefix: string | null
): string | null {
  if (ids.length === 1) return ids[0];
  if (statePrefix) {
    const hit = ids.filter((id) => id.startsWith(statePrefix));
    if (hit.length === 1) return hit[0];
  }
  return null;
}

function matchGadmFromLabel(
  locationLabel: string,
  statePrefix: string | null
): string | null {
  const parts = locationLabel
    .split(/[,\n]/g)
    .map((p) => normToken(p))
    .filter(Boolean);
  const rev = [...parts].reverse();
  const idx = FILE.nameIndex;

  for (const part of rev) {
    if (idx[part]) {
      const id = pickGadmId(idx[part], statePrefix);
      if (id) return id;
    }
  }

  for (const part of parts) {
    for (const [key, ids] of Object.entries(idx)) {
      if (part.length < 3 || key.length < 3) continue;
      if (part.includes(key) || key.includes(part)) {
        const id = pickGadmId(ids, statePrefix);
        if (id) return id;
      }
    }
  }
  return null;
}

function rowForId(gadmId: string): MetaMobilityDistrictRow | null {
  return FILE.districts[gadmId] ?? null;
}

export type MetaMobilityMatch = {
  gadmId: string;
  gadmName: string;
  ds: string;
  shortTripShare: number;
  mobilityIndex0_100: number;
  matchedBy: 'label' | 'geocode';
};

function toMatch(gadmId: string, row: MetaMobilityDistrictRow, matchedBy: MetaMobilityMatch['matchedBy']): MetaMobilityMatch {
  return {
    gadmId,
    gadmName: row.gadm_name,
    ds: row.ds,
    shortTripShare: row.short_trip_share,
    mobilityIndex0_100: row.mobility_index_0_100,
    matchedBy,
  };
}

/**
 * Resolve Meta Movement Distribution row for a pin:
 * 1) Mapbox-style label + optional state mention → nameIndex
 * 2) Nominatim reverse district + state → nameIndex (disambiguate with admin1 prefix)
 */
export async function resolveMetaMobility(
  lat: number,
  lng: number,
  locationLabel?: string
): Promise<MetaMobilityMatch | null> {
  const hint = locationLabel?.trim() ? indianStatePrefixFromText(locationLabel) : null;

  if (locationLabel?.trim()) {
    const gid = matchGadmFromLabel(locationLabel, hint);
    if (gid) {
      const row = rowForId(gid);
      if (row) return toMatch(gid, row, 'label');
    }
  }

  const geo = await reverseGeocodeIndia(lat, lng);
  if (!geo) return null;

  const statePrefix =
    (geo.state && gadmAdmin1PrefixForIndianState(geo.state)) || null;
  const districtToken = geo.district ? normToken(geo.district) : null;

  if (districtToken && FILE.nameIndex[districtToken]) {
    const id = pickGadmId(FILE.nameIndex[districtToken], statePrefix);
    if (id) {
      const row = rowForId(id);
      if (row) return toMatch(id, row, 'geocode');
    }
  }

  if (districtToken) {
    for (const [key, ids] of Object.entries(FILE.nameIndex)) {
      if (key.length < 3 || districtToken.length < 3) continue;
      if (districtToken.includes(key) || key.includes(districtToken)) {
        const id = pickGadmId(ids, statePrefix);
        if (id) {
          const row = rowForId(id);
          if (row) return toMatch(id, row, 'geocode');
        }
      }
    }
  }

  return null;
}

/**
 * Nudge spot scores using district mobility index (50 = neutral).
 */
export function applyMobilityBlend(result: AnalysisResult, mobilityIndex0_100: number): void {
  const delta = Math.round((mobilityIndex0_100 - 50) * 0.15);
  if (delta === 0) {
    return;
  }
  for (const z of result.topPlaces) {
    z.score = Math.max(10, Math.min(98, z.score + delta));
  }
  result.topPlaces.sort((a, b) => b.score - a.score);
  result.topPlaces.forEach((z, i) => {
    z.rank = i + 1;
  });
  const sum = result.topPlaces.reduce((s, z) => s + z.score, 0);
  result.overallScore = result.topPlaces.length ? Math.round(sum / result.topPlaces.length) : result.overallScore;
}
