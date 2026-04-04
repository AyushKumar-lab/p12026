/**
 * Optional GeoJSON overlays for commercial rent & residential heat/zones.
 * Set NEXT_PUBLIC_LOCINTEL_* to your own URLs (HTTPS or same-origin).
 * If unset, sample polygons under /public/data/map-layers load for demo (Bengaluru area).
 * Set NEXT_PUBLIC_LOCINTEL_DISABLE_SAMPLE_MAP_LAYERS=true to show no overlay until you add URLs.
 */

function disableSamples(): boolean {
  return process.env.NEXT_PUBLIC_LOCINTEL_DISABLE_SAMPLE_MAP_LAYERS === 'true';
}

export function getCommercialRentGeoJsonUrl(): string | undefined {
  const custom = process.env.NEXT_PUBLIC_LOCINTEL_COMMERCIAL_RENT_GEOJSON_URL?.trim();
  if (custom) return custom;
  if (disableSamples()) return undefined;
  return '/data/map-layers/sample-commercial-rent.geojson';
}

export function getResidentialGeoJsonUrl(): string | undefined {
  const custom = process.env.NEXT_PUBLIC_LOCINTEL_RESIDENTIAL_ZONES_GEOJSON_URL?.trim();
  if (custom) return custom;
  if (disableSamples()) return undefined;
  return '/data/map-layers/sample-residential-zones.geojson';
}
