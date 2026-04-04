'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import type {
  FestivalZone,
  PilgrimageCorridor,
  TemplePoint,
  FloodRiskZone,
  HaatMarket,
  AutoStand,
} from '@/data/indiaLayers';
import { dayLabel } from '@/data/indiaLayers';

export interface Zone {
  id: number;
  lat: number;
  lng: number;
  score: number;
  color: string;
  reasoning: string;
  competitors?: number;
  transitPoints?: number;
  /** 1–10 for "best place" rank; shown as big number on marker */
  rank?: number;
  /** Boundary radius in metres (e.g. 500); drawn as circle on map */
  radiusM?: number;
}

interface LocationMapProps {
  center: [number, number];
  radius: number;
  zones?: Zone[];
  showZones?: boolean;
  /** When set, map flies to this position (e.g. "View on map" for a recommendation) */
  flyToPosition?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  onZoneClick?: (zone: Zone) => void;
  /** GeoJSON URL (polygons/points): commercial asking rent or rent-index zones */
  commercialRentGeoJsonUrl?: string;
  /** GeoJSON URL: residential listing heat or neighborhood zones */
  residentialGeoJsonUrl?: string;
  showCommercialRentLayer?: boolean;
  showResidentialLayer?: boolean;

  /* ── India Intelligence Layers ── */
  festivalData?: FestivalZone[];
  showFestivalLayer?: boolean;
  pilgrimageCorridors?: PilgrimageCorridor[];
  templePoints?: TemplePoint[];
  showPilgrimageLayer?: boolean;
  floodData?: FloodRiskZone[];
  showFloodLayer?: boolean;
  haatData?: HaatMarket[];
  showHaatLayer?: boolean;
  autoStandData?: AutoStand[];
  showAutoStandLayer?: boolean;
  /** When true, clicking on the map draws a 500m circle and counts same-type competitors */
  competitorDensityMode?: boolean;
  onCompetitorDensityResult?: (count: number, lat: number, lng: number) => void;
  /** Mapbox geocoder bbox [west, south, east, north] — fits map to city instead of default world zoom */
  cityBounds?: [number, number, number, number] | null;
  /** Score heatmap (Mapbox heatmap layer; green 75+, yellow 45–74, red below 45) */
  showScoreHeatmap?: boolean;
}

const OV_COMM_PREFIX = 'locintel-ov-commercial';
const OV_RES_PREFIX = 'locintel-ov-residential';
const OV_FESTIVAL = 'locintel-ov-festival';
const OV_PILGRIMAGE = 'locintel-ov-pilgrimage';
const OV_TEMPLE = 'locintel-ov-temple';
const OV_FLOOD = 'locintel-ov-flood';
const OV_HAAT = 'locintel-ov-haat';
const OV_AUTO = 'locintel-ov-auto';
const OV_COMP_DENSITY = 'locintel-comp-density';

/** Mapbox GL heatmap + cluster sources (replaces Leaflet heat + markercluster in checklist) */
const ZONES_HEAT_SRC = 'locintel-zones-heat-src';
const ZONES_CLUSTER_SRC = 'locintel-zones-cluster-src';
const ZONES_HEAT_LAYER = 'locintel-zones-heatmap';
const ZONES_CLUSTER_CIRCLES = 'locintel-zones-clusters';
const ZONES_UNCLUSTERED = 'locintel-zones-unclustered';

type LngLat = [number, number]; // [lng, lat]

const EARTH_RADIUS_M = 6378137;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

function destinationPoint(lat: number, lng: number, bearingDeg: number, distanceM: number) {
  const δ = distanceM / EARTH_RADIUS_M;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(lat);
  const λ1 = toRad(lng);

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return { lat: toDeg(φ2), lng: toDeg(λ2) };
}

function createCirclePolygon(centerLat: number, centerLng: number, radiusM: number, steps = 48) {
  const coords: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i * 360) / steps;
    const p = destinationPoint(centerLat, centerLng, bearing, radiusM);
    coords.push([p.lng, p.lat]);
  }
  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [coords],
    },
    properties: {},
  };
}

function getZoneColor(zoneColor: string) {
  if (zoneColor === 'green') return '#10b981';
  if (zoneColor === 'yellow') return '#f59e0b';
  return '#ef4444';
}

export default function LocationMap({
  center,
  radius,
  zones = [],
  showZones = false,
  flyToPosition = null,
  onLocationSelect,
  onZoneClick,
  commercialRentGeoJsonUrl,
  residentialGeoJsonUrl,
  showCommercialRentLayer = true,
  showResidentialLayer = true,
  festivalData = [],
  showFestivalLayer = false,
  pilgrimageCorridors = [],
  templePoints = [],
  showPilgrimageLayer = false,
  floodData = [],
  showFloodLayer = false,
  haatData = [],
  showHaatLayer = false,
  autoStandData = [],
  showAutoStandLayer = false,
  competitorDensityMode = false,
  onCompetitorDensityResult,
  cityBounds = null,
  showScoreHeatmap = true,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<any>(null);
  const mapboxRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(14);

  const centerMarkerRef = useRef<any>(null);
  const popupRef = useRef<any>(null);

  const circleSourceId = useMemo(() => 'locintel-radius-source', []);
  const circleFillLayerId = useMemo(() => 'locintel-radius-fill', []);
  const circleLineLayerId = useMemo(() => 'locintel-radius-line', []);

  const zoneLabelSourceId = useMemo(() => 'locintel-zone-labels-source', []);
  const zoneLabelLayerId = useMemo(() => 'locintel-zone-labels', []);

  const zoneCirclesSourceId = useMemo(() => 'locintel-zone-circles-source', []);
  const zoneCirclesFillLayerId = useMemo(() => 'locintel-zone-circles-fill', []);
  const zoneCirclesLineLayerId = useMemo(() => 'locintel-zone-circles-line', []);

  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_API_KEY || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  // Satellite + street labels typically looks closest to "Google-like" detail.
  const mapboxStyleEnv =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox/satellite-streets-v12';
  const mapboxStyleUrl = mapboxStyleEnv.includes('://')
    ? mapboxStyleEnv
    : `mapbox://styles/${mapboxStyleEnv}`;

  const preferredPitch = is3D ? 60 : 0;

  const fitBoundsForPolygon = (map: any, polygon: any) => {
    const ring: LngLat[] = polygon?.geometry?.coordinates?.[0] ?? [];
    if (ring.length === 0) return;

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    for (const [lng, lat] of ring) {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }

    map.fitBounds(
      new mapboxRef.current.LngLatBounds([minLng, minLat], [maxLng, maxLat]),
      { padding: 50, duration: 800 }
    );
  };

  const updateRadiusCircle = () => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return;

    const polygon = createCirclePolygon(center[0], center[1], radius * 1000);

    const src = map.getSource(circleSourceId);
    if (src) {
      src.setData(polygon);
    } else {
      map.addSource(circleSourceId, { type: 'geojson', data: polygon });
      map.addLayer({
        id: circleFillLayerId,
        type: 'fill',
        source: circleSourceId,
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.14,
        },
      });
      map.addLayer({
        id: circleLineLayerId,
        type: 'line',
        source: circleSourceId,
        paint: {
          'line-color': '#10b981',
          'line-width': 3,
          'line-dasharray': [6, 12],
        },
      });
    }

    fitBoundsForPolygon(map, polygon);
  };

  const ensureZoneCirclesLayers = () => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return;

    const empty = { type: 'FeatureCollection', features: [] as any[] };

    if (!map.getSource(zoneCirclesSourceId)) {
      map.addSource(zoneCirclesSourceId, { type: 'geojson', data: empty });
    }

    if (!map.getLayer(zoneCirclesFillLayerId)) {
      map.addLayer({
        id: zoneCirclesFillLayerId,
        type: 'fill',
        source: zoneCirclesSourceId,
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.14,
        },
      });
    }

    if (!map.getLayer(zoneCirclesLineLayerId)) {
      map.addLayer({
        id: zoneCirclesLineLayerId,
        type: 'line',
        source: zoneCirclesSourceId,
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-dasharray': [6, 8],
        },
      });
    }
  };

  const updateZoneCircles = () => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return;
    if (!showZones || zones.length === 0) {
      const src = map.getSource(zoneCirclesSourceId);
      if (src) src.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    ensureZoneCirclesLayers();

    const features: any[] = [];
    zones.forEach((zone) => {
      const radiusM = zone.radiusM ?? 0;
      if (radiusM <= 0) return;
      const color = getZoneColor(zone.color);
      const circle = createCirclePolygon(zone.lat, zone.lng, radiusM);
      circle.properties = { color };
      features.push(circle);
    });

    const src = map.getSource(zoneCirclesSourceId);
    if (src) src.setData({ type: 'FeatureCollection', features });
  };

  const ensureZoneLabelLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return;

    const empty = { type: 'FeatureCollection', features: [] as any[] };

    if (!map.getSource(zoneLabelSourceId)) {
      map.addSource(zoneLabelSourceId, { type: 'geojson', data: empty });
    }

    if (!map.getLayer(zoneLabelLayerId)) {
      map.addLayer({
        id: zoneLabelLayerId,
        type: 'symbol',
        source: zoneLabelSourceId,
        layout: {
          'text-field': ['get', 'text'],
          'text-size': 12,
          // Center the label inside the zone circles (matches expected UI).
          'text-anchor': 'center',
          'text-offset': [0, 0],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          // Use white text so it remains visible over colored circles.
          'text-color': '#FFFFFF',
          'text-halo-color': 'rgba(0,0,0,0.65)',
          'text-halo-width': 1.5,
        },
      });
    }
  };

  const updateZoneLabels = () => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return;

    if (!showZones || zones.length === 0) {
      const src = map.getSource(zoneLabelSourceId);
      if (src) src.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    ensureZoneLabelLayer();

    const features: any[] = zones.map((zone) => {
      const color = getZoneColor(zone.color);
      const isRanked = zone.rank != null && zone.rank >= 1 && zone.rank <= 10;
      const rankText = isRanked ? `${zone.rank}` : '';
      const labelText = isRanked
        ? `${rankText}\n${zone.score}/100`
        : `${zone.score}/100\n${zone.color === 'green' ? 'Recommended' : zone.color === 'yellow' ? 'Moderate' : 'Avoid'}`;

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [zone.lng, zone.lat] },
        properties: { text: labelText, color },
      };
    });

    const src = map.getSource(zoneLabelSourceId);
    if (src) src.setData({ type: 'FeatureCollection', features });
  };

  const showZonePopup = (lngLat: LngLat, zone: Zone) => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;

    popupRef.current?.remove?.();

    const color = getZoneColor(zone.color);
    const comp = zone.competitors ?? '—';
    const transit = zone.transitPoints ?? '—';
    const isRanked = zone.rank != null && zone.rank >= 1 && zone.rank <= 10;
    const label = zone.color === 'green' ? 'Recommended' : zone.color === 'yellow' ? 'Moderate' : 'Avoid';
    const rankTitle = isRanked
      ? `#${zone.rank} Best place`
      : zone.color === 'green'
        ? '✅ Recommended'
        : zone.color === 'yellow'
          ? '⚡ Moderate'
          : '⚠️ Avoid';

    const html = `
      <div style="font-family:Inter,sans-serif;padding:14px;min-width:220px">
        <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;color:${color}">${rankTitle}</h3>
        <p style="margin:0 0 10px;font-size:12px;color:#cbd5e1;line-height:1.45">${zone.reasoning}</p>
        <div style="font-size:20px;font-weight:800;color:${color}">Score: ${zone.score}/100</div>
        <div style="margin-top:8px;font-size:11px;color:#94a3b8">${comp} competitors · ${transit} transit</div>
        <div style="margin-top:8px;font-size:10px;color:#94a3b8">${label}</div>
      </div>
    `;

    popupRef.current = new mapboxgl.Popup({ offset: 25, closeButton: true })
      .setLngLat(lngLat)
      .setHTML(html)
      .addTo(map);
  };

  // Initialize map ONCE (guard against React Strict Mode double-mount)
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const init = async () => {
      const mapboxglModule: any = await import('mapbox-gl');
      const mapboxgl = mapboxglModule.default ?? mapboxglModule;
      mapboxRef.current = mapboxgl;

      if (!mapboxToken) {
        console.error(
          'Missing Mapbox token: set NEXT_PUBLIC_MAPBOX_API_KEY (or NEXT_PUBLIC_MAPBOX_TOKEN) in .env or .env.local — not in .env.example. Restart npm run dev after saving.'
        );
        return;
      }

      mapboxgl.accessToken = mapboxToken;

      const map = new mapboxgl.Map({
        container: containerRef.current as HTMLDivElement,
        style: mapboxStyleUrl,
        center: [center[1], center[0]],
        zoom: 14,
        minZoom: 3,
        maxZoom: 22,
        pitch: preferredPitch,
        bearing: 0,
        antialias: true,
      });

      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');
      map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');
      map.on('zoom', () => setCurrentZoom(Number(map.getZoom().toFixed(1))));
      map.on('error', (e: any) => {
        console.error('Mapbox error:', e);
      });

      map.on('load', () => {
        // Ensure the rest of the map UI (radius circle + draggable marker)
        // is enabled even if some style-specific layers fail to add.
        try {
          // Add "true 3D" buildings layer (extrusions) when the style provides composite/building data.
          const layers = map.getStyle().layers ?? [];
          const labelLayerId = layers.find(
            (l: any) => l.type === 'symbol' && l.layout && l.layout['text-field']
          )?.id;

          if (!map.getLayer('locintel-3d-buildings')) {
            // Some Mapbox styles don't expose `composite`/`building` sources.
            // Wrap in try/catch so it doesn't break `setMapReady(true)`.
            try {
              map.addLayer(
                {
                  id: 'locintel-3d-buildings',
                  source: 'composite',
                  'source-layer': 'building',
                  filter: ['==', ['get', 'extrude'], 'true'],
                  type: 'fill-extrusion',
                  minzoom: 14,
                  paint: {
                    'fill-extrusion-color': '#d1d5db',
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 0.6,
                  },
                },
                labelLayerId
              );
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('[LocIntel] 3D buildings layer not available for this style:', e);
            }
          }

          updateRadiusCircle();
          updateZoneCircles();
          updateZoneLabels();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[LocIntel] Map load handler failed:', e);
        } finally {
          setMapReady(true);
        }
      });
    };

    init();

    return () => {
      setMapReady(false);
      try {
        const m = mapRef.current;
        if (m) {
          // Remove all event listeners before destroy to prevent errorCb crash
          m.off('zoom', () => { });
          m.off('error', () => { });
          m.remove();
        }
      } catch (_) {
        // Mapbox may throw during cleanup — safe to ignore
      }
      mapRef.current = null;
      mapboxRef.current = null;
      centerMarkerRef.current = null;
      popupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredPitch]);

  // Update center + radius when they change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const lngLat: LngLat = [center[1], center[0]];

    centerMarkerRef.current?.setLngLat?.(lngLat);

    // Keep the map pitched for 3D view when updating location.
    map.easeTo({
      center: lngLat,
      zoom: map.getZoom(),
      pitch: preferredPitch,
      duration: 300,
    });

    updateRadiusCircle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], preferredPitch]);

  useEffect(() => {
    if (!mapRef.current) return;
    updateRadiusCircle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius]);

  // Fly to a specific position
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToPosition) return;
    map.easeTo({
      center: [flyToPosition[1], flyToPosition[0]],
      zoom: 17,
      pitch: preferredPitch,
      duration: 800,
    });
  }, [flyToPosition?.[0], flyToPosition?.[1], preferredPitch]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      pitch: preferredPitch,
      duration: 450,
    });
  }, [preferredPitch]);

  const recenterMap = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      center: [center[1], center[0]],
      zoom: showZones ? Math.max(map.getZoom(), 13) : 14,
      pitch: preferredPitch,
      duration: 550,
    });
  };

  // Update zone circles (boundary rings)
  useEffect(() => {
    if (!mapRef.current) return;
    updateZoneCircles();
    updateZoneLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showZones, zones]);

  // Zone heatmap + clustered circles (Mapbox native — checklist: heat colours + clusterRadius 50)
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) return;

    // Add score layers above most basemap content (especially 3D buildings).
    // By not providing `beforeId`, Mapbox will append these layers on top.
    const beforeId: string | undefined = undefined;

    const removeZoneScoreLayers = () => {
      for (const id of [ZONES_UNCLUSTERED, ZONES_CLUSTER_CIRCLES, ZONES_HEAT_LAYER]) {
        try {
          if (map.getLayer(id)) map.removeLayer(id);
        } catch {
          // ignore
        }
      }
      for (const sid of [ZONES_CLUSTER_SRC, ZONES_HEAT_SRC]) {
        try {
          if (map.getSource(sid)) map.removeSource(sid);
        } catch {
          // ignore
        }
      }
    };

    if (!showZones || zones.length === 0) {
      removeZoneScoreLayers();
      return;
    }

    const features = zones.map((z) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [z.lng, z.lat] as LngLat },
      properties: {
        id: z.id,
        score: Math.max(0, Math.min(100, Math.round(Number(z.score) || 0))),
        rank: z.rank ?? 0,
        color: z.color,
        reasoning: String(z.reasoning || '').slice(0, 280),
        competitors: z.competitors != null ? String(z.competitors) : '',
        transitPoints: z.transitPoints != null ? String(z.transitPoints) : '',
      },
    }));

    const fc = { type: 'FeatureCollection' as const, features };

    if (!map.getSource(ZONES_HEAT_SRC)) {
      map.addSource(ZONES_HEAT_SRC, { type: 'geojson', data: fc });
    } else {
      (map.getSource(ZONES_HEAT_SRC) as { setData: (d: unknown) => void }).setData(fc);
    }

    if (!map.getSource(ZONES_CLUSTER_SRC)) {
      map.addSource(ZONES_CLUSTER_SRC, {
        type: 'geojson',
        data: fc,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
    } else {
      (map.getSource(ZONES_CLUSTER_SRC) as { setData: (d: unknown) => void }).setData(fc);
    }

    if (showScoreHeatmap) {
      if (!map.getLayer(ZONES_HEAT_LAYER)) {
        map.addLayer(
          {
            id: ZONES_HEAT_LAYER,
            type: 'heatmap',
            source: ZONES_HEAT_SRC,
            // Allow visibility at high zooms too (user often flies to zoom ~17).
            maxzoom: 20,
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'score'],
                0,
                0,
                45,
                0.35,
                75,
                0.75,
                100,
                1,
              ],
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 0.45, 14, 1.6],
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 14, 14, 26],
              // Fade in with zoom (currently it was inverted and hid the heatmap at high zoom).
              // Keep heatmap subtle so circle markers + labels stay readable.
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 10, 0.35, 14, 0.5, 18, 0.55],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(230, 57, 70, 0)',
                0.2,
                '#E63946',
                0.5,
                '#FFD60A',
                0.75,
                '#06D6A0',
                1,
                '#06D6A0',
              ],
            },
          },
          beforeId
        );
      }
    } else if (map.getLayer(ZONES_HEAT_LAYER)) {
      map.removeLayer(ZONES_HEAT_LAYER);
    }

    if (!map.getLayer(ZONES_CLUSTER_CIRCLES)) {
      map.addLayer(
        {
          id: ZONES_CLUSTER_CIRCLES,
          type: 'circle',
          source: ZONES_CLUSTER_SRC,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': 'rgba(99, 102, 241, 0.92)',
            'circle-radius': ['step', ['get', 'point_count'], 20, 10, 24, 50, 30, 200, 38],
            'circle-opacity': 0.9,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        },
        beforeId
      );
    }

    if (!map.getLayer(ZONES_UNCLUSTERED)) {
      map.addLayer(
        {
          id: ZONES_UNCLUSTERED,
          type: 'circle',
          source: ZONES_CLUSTER_SRC,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': 14,
            'circle-color': ['step', ['get', 'score'], '#E63946', 45, '#FFD60A', 75, '#06D6A0'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.95,
          },
        },
        beforeId
      );
    }

    const onClusterClick = (e: any) => {
      const feats = map.queryRenderedFeatures(e.point, { layers: [ZONES_CLUSTER_CIRCLES] });
      if (!feats.length) return;
      const clId = feats[0].properties?.cluster_id;
      const coords = (feats[0].geometry as { type: string; coordinates: number[] }).coordinates as LngLat;
      const src = map.getSource(ZONES_CLUSTER_SRC) as {
        getClusterExpansionZoom: (id: number, cb: (err: Error | null, zoom: number) => void) => void;
      };
      src.getClusterExpansionZoom(Number(clId), (err, zoom) => {
        if (err) return;
        map.easeTo({ center: coords, zoom: zoom + 0.5, duration: 450 });
      });
    };

    const onPointClick = (e: any) => {
      const f = e.features?.[0];
      if (!f?.geometry || f.geometry.type !== 'Point') return;
      const coords = f.geometry.coordinates as LngLat;
      const p = f.properties || {};
      const z: Zone = {
        id: Number(p.id),
        lng: coords[0],
        lat: coords[1],
        score: Number(p.score),
        color: String(p.color || 'yellow'),
        reasoning: String(p.reasoning || ''),
        rank: p.rank ? Number(p.rank) : undefined,
        competitors: p.competitors !== '' && p.competitors != null ? Number(p.competitors) : undefined,
        transitPoints:
          p.transitPoints !== '' && p.transitPoints != null ? Number(p.transitPoints) : undefined,
      };
      onZoneClick?.(z);
      showZonePopup(coords, z);
    };

    const cursorPointer = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const cursorDefault = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', ZONES_CLUSTER_CIRCLES, onClusterClick);
    map.on('click', ZONES_UNCLUSTERED, onPointClick);
    map.on('mouseenter', ZONES_CLUSTER_CIRCLES, cursorPointer);
    map.on('mouseleave', ZONES_CLUSTER_CIRCLES, cursorDefault);
    map.on('mouseenter', ZONES_UNCLUSTERED, cursorPointer);
    map.on('mouseleave', ZONES_UNCLUSTERED, cursorDefault);

    popupRef.current?.remove?.();
    popupRef.current = null;

    return () => {
      map.off('click', ZONES_CLUSTER_CIRCLES, onClusterClick);
      map.off('click', ZONES_UNCLUSTERED, onPointClick);
      map.off('mouseenter', ZONES_CLUSTER_CIRCLES, cursorPointer);
      map.off('mouseleave', ZONES_CLUSTER_CIRCLES, cursorDefault);
      map.off('mouseenter', ZONES_UNCLUSTERED, cursorPointer);
      map.off('mouseleave', ZONES_UNCLUSTERED, cursorDefault);
      removeZoneScoreLayers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, showZones, zones, showScoreHeatmap, onZoneClick]);

  // Fit map to searched place bbox (city / district), not a world view
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl || !mapReady || !cityBounds) return;
    const [w, s, e, n] = cityBounds;
    if (!(Number.isFinite(w) && Number.isFinite(s) && Number.isFinite(e) && Number.isFinite(n))) return;
    if (e <= w || n <= s) return;
    try {
      map.fitBounds(
        new mapboxgl.LngLatBounds([w, s], [e, n]),
        { padding: 52, duration: 650, maxZoom: 13.2 }
      );
    } catch {
      // ignore
    }
  }, [mapReady, cityBounds?.[0], cityBounds?.[1], cityBounds?.[2], cityBounds?.[3]]);

  // Center marker (draggable) - set after map init.
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;

    if (centerMarkerRef.current) return;

    const centerEl = document.createElement('div');
    centerEl.style.position = 'relative';
    centerEl.style.width = '28px';
    centerEl.style.height = '28px';

    centerEl.innerHTML = `
      <div style="position:absolute;inset:0;background:#10b981;border:3px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(16,185,129,0.6)"></div>
      <div style="position:absolute;inset:-6px;background:rgba(16,185,129,0.25);border-radius:50%;animation:pulse-ring 1.8s ease-out infinite"></div>
    `;

    const marker = new mapboxgl.Marker({
      element: centerEl,
      draggable: !!onLocationSelect,
    })
      .setLngLat([center[1], center[0]])
      .addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      onLocationSelect?.(lngLat.lat, lngLat.lng);
    });

    centerMarkerRef.current = marker;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, onLocationSelect, center]);

  // Commercial rent + residential zone GeoJSON overlays (optional)
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map || typeof map.isStyleLoaded !== 'function' || !map.isStyleLoaded()) return;

    const beforeId = map.getLayer(zoneCirclesFillLayerId)
      ? zoneCirclesFillLayerId
      : map.getLayer(circleLineLayerId)
        ? circleLineLayerId
        : undefined;

    const polyFilter: unknown[] = ['match', ['geometry-type'], ['Polygon', 'MultiPolygon'], true, false];
    const pointFilter: unknown[] = ['==', ['geometry-type'], 'Point'];

    const ac = new AbortController();
    let cancelled = false;

    const stripOverlay = (prefix: string) => {
      const ids = [`${prefix}-line`, `${prefix}-fill`, `${prefix}-circle`];
      for (const id of ids) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      const srcId = `${prefix}-src`;
      if (map.getSource(srcId)) map.removeSource(srcId);
    };

    const wireOverlay = async (
      prefix: string,
      url: string | undefined,
      show: boolean,
      colors: { fill: string; line: string }
    ) => {
      const fillId = `${prefix}-fill`;
      const lineId = `${prefix}-line`;
      const circleId = `${prefix}-circle`;
      const srcId = `${prefix}-src`;

      if (!url) {
        stripOverlay(prefix);
        return;
      }

      if (!map.getSource(srcId)) {
        map.addSource(srcId, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      }

      if (!map.getLayer(fillId)) {
        map.addLayer(
          {
            id: fillId,
            type: 'fill',
            source: srcId,
            filter: polyFilter as any,
            paint: { 'fill-color': colors.fill, 'fill-opacity': 0.34 },
          },
          beforeId
        );
      }
      if (!map.getLayer(lineId)) {
        map.addLayer(
          {
            id: lineId,
            type: 'line',
            source: srcId,
            filter: polyFilter as any,
            paint: { 'line-color': colors.line, 'line-width': 2 },
          },
          beforeId
        );
      }
      if (!map.getLayer(circleId)) {
        map.addLayer(
          {
            id: circleId,
            type: 'circle',
            source: srcId,
            filter: pointFilter as any,
            paint: {
              'circle-radius': 9,
              'circle-color': colors.fill,
              'circle-opacity': 0.42,
              'circle-stroke-width': 1,
              'circle-stroke-color': colors.line,
            },
          },
          beforeId
        );
      }

      const vis = show ? 'visible' : 'none';
      map.setLayoutProperty(fillId, 'visibility', vis);
      map.setLayoutProperty(lineId, 'visibility', vis);
      map.setLayoutProperty(circleId, 'visibility', vis);

      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const src = map.getSource(srcId) as { setData?: (d: unknown) => void } | undefined;
        if (!cancelled && src?.setData) src.setData(data);
      } catch (e) {
        if (!ac.signal.aborted && !cancelled) console.warn('[LocIntel] Map overlay fetch failed:', url, e);
      }
    };

    void (async () => {
      await wireOverlay(OV_COMM_PREFIX, commercialRentGeoJsonUrl, showCommercialRentLayer, {
        fill: '#1d4ed8',
        line: '#93c5fd',
      });
      await wireOverlay(OV_RES_PREFIX, residentialGeoJsonUrl, showResidentialLayer, {
        fill: '#b45309',
        line: '#fcd34d',
      });
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [
    mapReady,
    commercialRentGeoJsonUrl,
    residentialGeoJsonUrl,
    showCommercialRentLayer,
    showResidentialLayer,
    zoneCirclesFillLayerId,
    circleLineLayerId,
  ]);

  // ── India Intelligence Layers ──────────────────────────────
  const compDensityMarkersRef = useRef<any[]>([]);
  const rankedMarkersRef = useRef<any[]>([]);

  const clearRankedMarkers = useCallback(() => {
    rankedMarkersRef.current.forEach((m) => {
      try {
        m.remove();
      } catch {
        // ignore
      }
    });
    rankedMarkersRef.current = [];
  }, []);

  const clearCompDensity = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    try {
      if (!map.getStyle?.()) return;
      if (map.getLayer(`${OV_COMP_DENSITY}-fill`)) map.removeLayer(`${OV_COMP_DENSITY}-fill`);
      if (map.getLayer(`${OV_COMP_DENSITY}-line`)) map.removeLayer(`${OV_COMP_DENSITY}-line`);
      if (map.getSource(`${OV_COMP_DENSITY}-src`)) map.removeSource(`${OV_COMP_DENSITY}-src`);
    } catch {
      // Map may already be destroyed
    }
    compDensityMarkersRef.current.forEach((m) => m.remove());
    compDensityMarkersRef.current = [];
  }, []);

  // Rank markers (#1–#10) as DOM markers (most reliable visual)
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl || !mapReady) return;
    if (!showZones || zones.length === 0) return;

    let cancelled = false;

    const placeMarkers = () => {
      if (cancelled) return;
      clearRankedMarkers();

      console.log('[LocIntel] Placing ranked markers for', zones.length, 'zones');

      // Always show "top 10" even if `rank` isn't set by the backend.
      const top10 = zones.slice(0, 10).map((z, idx) => ({
        zone: z,
        rank: z.rank != null && Number.isFinite(Number(z.rank)) ? Number(z.rank) : idx + 1,
      }));

      top10.forEach(({ zone: z, rank: displayRank }) => {
        const lat = Number(z.lat);
        const lng = Number(z.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const color = getZoneColor(z.color);

        // Simple flat circle — no position/transform tricks that conflict with Mapbox
        const el = document.createElement('div');
        el.style.width = '48px';
        el.style.height = '48px';
        el.style.borderRadius = '50%';
        el.style.background = color;
        el.style.border = '3px solid rgba(255,255,255,0.95)';
        el.style.boxShadow = `0 2px 10px rgba(0,0,0,0.4)`;
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.cursor = 'pointer';
        el.style.userSelect = 'none';

        // Rank number
        const rankEl = document.createElement('span');
        rankEl.textContent = String(displayRank);
        rankEl.style.fontFamily = 'Inter, system-ui, sans-serif';
        rankEl.style.fontSize = '16px';
        rankEl.style.lineHeight = '1';
        rankEl.style.fontWeight = '900';
        rankEl.style.color = '#fff';

        // Score
        const scoreEl = document.createElement('span');
        scoreEl.textContent = `${Math.round(Number(z.score) || 0)}`;
        scoreEl.style.fontFamily = 'Inter, system-ui, sans-serif';
        scoreEl.style.fontSize = '10px';
        scoreEl.style.lineHeight = '1';
        scoreEl.style.marginTop = '1px';
        scoreEl.style.fontWeight = '700';
        scoreEl.style.color = 'rgba(255,255,255,0.85)';

        el.appendChild(rankEl);
        el.appendChild(scoreEl);

        el.addEventListener('click', () => {
          onZoneClick?.(z);
          showZonePopup([lng, lat], z);
        });

        try {
          const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([lng, lat])
            .addTo(map);
          rankedMarkersRef.current.push(marker);
        } catch (e) {
          console.warn('[LocIntel] Failed to add marker:', e);
        }
      });

      console.log('[LocIntel] Placed', rankedMarkersRef.current.length, 'markers on map');

      // Fit map to show all markers
      try {
        const coords = top10
          .map(({ zone }) => ({ lat: Number(zone.lat), lng: Number(zone.lng) }))
          .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng));
        const lats = coords.map((c) => c.lat);
        const lngs = coords.map((c) => c.lng);
        if (lats.length && lngs.length) {
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          if (Number.isFinite(minLat) && Number.isFinite(maxLat) && Number.isFinite(minLng) && Number.isFinite(maxLng)) {
            map.fitBounds(new mapboxgl.LngLatBounds([minLng, minLat], [maxLng, maxLat]), {
              padding: 80,
              duration: 600,
              maxZoom: 15,
              pitch: preferredPitch,
            });
          }
        }
      } catch {
        // ignore
      }
    };

    // If style is already loaded, render immediately.
    // Otherwise, wait for it and also poll as a safety net.
    const styleReady = typeof map.isStyleLoaded !== 'function' || map.isStyleLoaded();

    if (styleReady) {
      placeMarkers();
    } else {
      console.log('[LocIntel] Style not loaded yet, waiting...');

      const onStyleLoad = () => {
        if (!cancelled) placeMarkers();
      };
      map.once('style.load', onStyleLoad);

      // Safety-net polling in case style.load event was already missed
      const pollId = setInterval(() => {
        if (cancelled) { clearInterval(pollId); return; }
        try {
          if (typeof map.isStyleLoaded === 'function' && map.isStyleLoaded()) {
            clearInterval(pollId);
            map.off('style.load', onStyleLoad);
            placeMarkers();
          }
        } catch { clearInterval(pollId); }
      }, 500);

      return () => {
        cancelled = true;
        clearInterval(pollId);
        try { map.off('style.load', onStyleLoad); } catch {}
        clearRankedMarkers();
      };
    }

    return () => {
      cancelled = true;
      clearRankedMarkers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, showZones, zones, clearRankedMarkers, onZoneClick]);

  // Competitor density click handler
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl || !mapReady) return;

    if (!competitorDensityMode) {
      clearCompDensity();
      map.getCanvas().style.cursor = '';
      return;
    }

    map.getCanvas().style.cursor = 'crosshair';

    const handleClick = (e: any) => {
      if (!competitorDensityMode) return;
      const { lng, lat } = e.lngLat;
      clearCompDensity();

      const circlePolygon = createCirclePolygon(lat, lng, 500);
      map.addSource(`${OV_COMP_DENSITY}-src`, { type: 'geojson', data: circlePolygon });
      map.addLayer({
        id: `${OV_COMP_DENSITY}-fill`,
        type: 'fill',
        source: `${OV_COMP_DENSITY}-src`,
        paint: { 'fill-color': '#f59e0b', 'fill-opacity': 0.18 },
      });
      map.addLayer({
        id: `${OV_COMP_DENSITY}-line`,
        type: 'line',
        source: `${OV_COMP_DENSITY}-src`,
        paint: { 'line-color': '#f59e0b', 'line-width': 3, 'line-dasharray': [4, 4] },
      });

      // Count zones inside 500m
      let count = 0;
      zones.forEach((z) => {
        const dLat = z.lat - lat;
        const dLng = z.lng - lng;
        const approxM = Math.sqrt(dLat * dLat + dLng * dLng) * 111320;
        if (approxM <= 500) count++;
      });

      const color = count < 3 ? '#10b981' : count <= 7 ? '#f59e0b' : '#ef4444';
      const label = count < 3 ? 'Low' : count <= 7 ? 'Medium' : 'High';

      const popup = new mapboxgl.Popup({ offset: 10, closeButton: true })
        .setLngLat([lng, lat])
        .setHTML(`
          <div style="font-family:Inter,sans-serif;padding:12px;min-width:180px">
            <h4 style="margin:0 0 6px;font-size:14px;font-weight:700;color:${color}">Competitor Density: ${label}</h4>
            <div style="font-size:24px;font-weight:800;color:${color}">${count}</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px">competitors within 500m radius</div>
          </div>
        `)
        .addTo(map);

      compDensityMarkersRef.current.push(popup);
      onCompetitorDensityResult?.(count, lat, lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
      map.getCanvas().style.cursor = '';
    };
  }, [mapReady, competitorDensityMode, zones, clearCompDensity, onCompetitorDensityResult]);

  // Intel layer markers (managed outside Mapbox sources for simplicity)
  const intelMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl || !mapReady) return;

    // Clear all previous intel markers
    intelMarkersRef.current.forEach((m) => m.remove());
    intelMarkersRef.current = [];

    // Clean old sources/layers
    const cleanLayer = (prefix: string) => {
      try {
        if (!map || !map.getStyle?.()) return;
        [`${prefix}-fill`, `${prefix}-line`, `${prefix}-circle`, `${prefix}-label`].forEach((id) => {
          if (map.getLayer(id)) map.removeLayer(id);
        });
        if (map.getSource(`${prefix}-src`)) map.removeSource(`${prefix}-src`);
      } catch {
        // Map may already be destroyed during React cleanup
      }
    };
    [OV_FESTIVAL, OV_PILGRIMAGE, OV_TEMPLE, OV_FLOOD, OV_HAAT, OV_AUTO].forEach(cleanLayer);

    // ── Festival Zones ──
    if (showFestivalLayer && festivalData.length > 0) {
      const features = festivalData.map((f) => {
        const circle = createCirclePolygon(f.lat, f.lng, f.radiusM);
        circle.properties = { name: f.name, multiplier: f.multiplier };
        return circle;
      });
      map.addSource(`${OV_FESTIVAL}-src`, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });
      map.addLayer({
        id: `${OV_FESTIVAL}-fill`,
        type: 'fill',
        source: `${OV_FESTIVAL}-src`,
        paint: { 'fill-color': '#f59e0b', 'fill-opacity': 0.2 },
      });
      map.addLayer({
        id: `${OV_FESTIVAL}-line`,
        type: 'line',
        source: `${OV_FESTIVAL}-src`,
        paint: { 'line-color': '#f59e0b', 'line-width': 2, 'line-dasharray': [4, 4] },
      });

      // Festival marker labels
      festivalData.forEach((f) => {
        const el = document.createElement('div');
        el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;';
        el.innerHTML = `
          <div style="background:#f59e0b;color:#000;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;white-space:nowrap;">
            🎉 ${f.multiplier}x traffic
          </div>
          <div style="font-size:9px;color:#fbbf24;margin-top:2px;text-shadow:0 1px 3px rgba(0,0,0,0.7);white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;">
            ${f.name}
          </div>
        `;
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([f.lng, f.lat]).addTo(map);
        intelMarkersRef.current.push(marker);
      });
    }

    // ── Pilgrimage Corridors ──
    if (showPilgrimageLayer) {
      if (pilgrimageCorridors.length > 0) {
        const features = pilgrimageCorridors.map((c) => ({
          type: 'Feature' as const,
          geometry: { type: 'LineString' as const, coordinates: c.coordinates },
          properties: { name: c.name },
        }));
        map.addSource(`${OV_PILGRIMAGE}-src`, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        });
        map.addLayer({
          id: `${OV_PILGRIMAGE}-line`,
          type: 'line',
          source: `${OV_PILGRIMAGE}-src`,
          paint: {
            'line-color': '#ec4899',
            'line-width': 4,
            'line-dasharray': [6, 4],
            'line-opacity': 0.8,
          },
        });
      }

      // Temple markers
      if (templePoints.length > 0) {
        templePoints.forEach((t) => {
          const el = document.createElement('div');
          el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;';
          el.innerHTML = `
            <div style="font-size:22px">🛕</div>
            <div style="background:#ec4899;color:#fff;font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;margin-top:2px;white-space:nowrap;">
              ${t.name.split(',')[0]}
            </div>
            <div style="font-size:8px;color:#f9a8d4;text-shadow:0 1px 3px rgba(0,0,0,0.7);">${t.visitorsPerYear}/yr</div>
          `;
          const marker = new mapboxgl.Marker({ element: el }).setLngLat([t.lng, t.lat]).addTo(map);
          intelMarkersRef.current.push(marker);
        });
      }
    }

    // ── Flood Risk Zones ──
    if (showFloodLayer && floodData.length > 0) {
      const features = floodData.map((f) => {
        const circle = createCirclePolygon(f.lat, f.lng, f.radiusM);
        circle.properties = { name: f.name, risk: f.riskLevel };
        return circle;
      });
      map.addSource(`${OV_FLOOD}-src`, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });
      map.addLayer({
        id: `${OV_FLOOD}-fill`,
        type: 'fill',
        source: `${OV_FLOOD}-src`,
        paint: {
          'fill-color': ['match', ['get', 'risk'], 'high', '#ef4444', '#f97316'],
          'fill-opacity': 0.25,
        },
      });
      map.addLayer({
        id: `${OV_FLOOD}-line`,
        type: 'line',
        source: `${OV_FLOOD}-src`,
        paint: {
          'line-color': ['match', ['get', 'risk'], 'high', '#ef4444', '#f97316'],
          'line-width': 2,
        },
      });

      floodData.forEach((f) => {
        const el = document.createElement('div');
        const bgColor = f.riskLevel === 'high' ? '#ef4444' : '#f97316';
        el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;';
        el.innerHTML = `
          <div style="background:${bgColor};color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;white-space:nowrap;">
            ⚠️ ${f.riskLevel === 'high' ? 'HIGH' : 'MEDIUM'} Flood Risk
          </div>
          <div style="font-size:8px;color:#fca5a5;margin-top:1px;text-shadow:0 1px 3px rgba(0,0,0,0.7);white-space:nowrap;">
            Jul–Sep monsoon zone
          </div>
        `;
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([f.lng, f.lat]).addTo(map);
        intelMarkersRef.current.push(marker);
      });
    }

    // ── Haat Markets ──
    if (showHaatLayer && haatData.length > 0) {
      haatData.forEach((h) => {
        const el = document.createElement('div');
        el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;';
        el.innerHTML = `
          <div style="width:28px;height:28px;background:#14b8a6;border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">
            🏪
          </div>
          <div style="background:#14b8a6;color:#fff;font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;margin-top:2px;white-space:nowrap;">
            ${dayLabel[h.dayOfWeek]}
          </div>
        `;
        el.title = `${h.name} — Every ${dayLabel[h.dayOfWeek]}`;
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([h.lng, h.lat]).addTo(map);

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          new mapboxgl.Popup({ offset: 15, closeButton: true })
            .setLngLat([h.lng, h.lat])
            .setHTML(`
              <div style="font-family:Inter,sans-serif;padding:10px;min-width:160px">
                <h4 style="margin:0 0 4px;font-size:13px;font-weight:700;color:#14b8a6">🏪 ${h.name}</h4>
                <div style="font-size:11px;color:#94a3b8">Every <b>${dayLabel[h.dayOfWeek]}</b> · ${h.city}</div>
                <div style="font-size:10px;color:#64748b;margin-top:6px">Haat days bring 40–60% more foot traffic to surrounding 500m radius</div>
              </div>
            `)
            .addTo(map);
        });

        intelMarkersRef.current.push(marker);
      });
    }

    // ── Auto Stands ──
    if (showAutoStandLayer && autoStandData.length > 0) {
      autoStandData.forEach((a) => {
        const el = document.createElement('div');
        el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;';
        el.innerHTML = `
          <div style="width:24px;height:24px;background:#84cc16;border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">
            🛺
          </div>
        `;
        el.title = a.name;
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([a.lng, a.lat]).addTo(map);

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          new mapboxgl.Popup({ offset: 12, closeButton: true })
            .setLngLat([a.lng, a.lat])
            .setHTML(`
              <div style="font-family:Inter,sans-serif;padding:8px;min-width:140px">
                <h4 style="margin:0 0 4px;font-size:12px;font-weight:700;color:#84cc16">🛺 ${a.name}</h4>
                <div style="font-size:10px;color:#94a3b8">${a.city} · Last-mile connectivity hub</div>
              </div>
            `)
            .addTo(map);
        });

        intelMarkersRef.current.push(marker);
      });
    }

    return () => {
      intelMarkersRef.current.forEach((m) => m.remove());
      intelMarkersRef.current = [];
      [OV_FESTIVAL, OV_PILGRIMAGE, OV_TEMPLE, OV_FLOOD, OV_HAAT, OV_AUTO].forEach(cleanLayer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapReady,
    showFestivalLayer, festivalData,
    showPilgrimageLayer, pilgrimageCorridors, templePoints,
    showFloodLayer, floodData,
    showHaatLayer, haatData,
    showAutoStandLayer, autoStandData,
  ]);

  const hasMarketOverlays = Boolean(commercialRentGeoJsonUrl || residentialGeoJsonUrl);
  const hasIntelLayers = showFestivalLayer || showPilgrimageLayer || showFloodLayer || showHaatLayer || showAutoStandLayer;

  return (
    <div
      ref={containerRef}
      className="locintel-map relative w-full h-full"
      style={{ background: '#0f172a', minHeight: '300px' }}
    >
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-black/60">
          <div className="text-white text-sm">
            Missing Mapbox API key. Add <span className="font-mono">NEXT_PUBLIC_MAPBOX_API_KEY</span> to <span className="font-mono">.env.local</span>.
          </div>
        </div>
      )}

      {mapboxToken && (
        <>
          <div className="absolute top-3 right-3 z-[520] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIs3D((prev) => !prev)}
              className="min-h-[44px] min-w-[44px] rounded-lg border border-white/20 bg-slate-900/85 px-3 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-slate-800/90"
            >
              {is3D ? 'Switch to 2D' : 'Switch to 3D'}
            </button>
            <button
              type="button"
              onClick={recenterMap}
              className="min-h-[44px] min-w-[44px] rounded-lg border border-white/20 bg-slate-900/85 px-3 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-slate-800/90"
            >
              Recenter
            </button>
          </div>

          <div className="absolute top-3 left-3 z-[520] rounded-lg border border-white/15 bg-slate-950/75 px-3 py-2 text-[11px] text-slate-100 backdrop-blur">
            Zoom {currentZoom.toFixed(1)}x
          </div>

          {onLocationSelect && (
            <div className="absolute left-3 bottom-3 z-[520] max-w-[260px] rounded-lg border border-emerald-400/25 bg-slate-950/85 px-3 py-2 text-[11px] text-emerald-100 backdrop-blur pointer-events-none">
              Drag the green marker to fine-tune your selected point.
            </div>
          )}

          {(showZones && zones.length > 0) || hasMarketOverlays ? (
            <div className="absolute left-3 top-14 z-[520] max-w-[220px] rounded-lg border border-white/15 bg-slate-950/75 px-3 py-2 text-[11px] text-slate-200 backdrop-blur space-y-2">
              {showZones && zones.length > 0 && (
                <div>
                  <div className="mb-1.5 font-semibold text-white">Zone Legend</div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Recommended
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Moderate
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Avoid
                  </div>
                  {showScoreHeatmap && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="mb-1 font-medium text-slate-300">Score heat</div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#06D6A0]" /> 75+ (strong)
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#FFD60A]" /> 45–74
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#E63946]" /> Under 45
                      </div>
                      <div className="text-[10px] text-slate-500">Clusters: tap to expand (50px)</div>
                    </div>
                  )}
                </div>
              )}
              {hasMarketOverlays && (
                <div className={showZones && zones.length > 0 ? 'pt-2 border-t border-white/10' : ''}>
                  <div className="mb-1 font-semibold text-white">Market layers</div>
                  {commercialRentGeoJsonUrl && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-2.5 w-2.5 rounded-sm bg-blue-600/80 border border-blue-300" /> Commercial rent
                    </div>
                  )}
                  {residentialGeoJsonUrl && (
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-amber-700/80 border border-amber-300" /> Residential zones
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
