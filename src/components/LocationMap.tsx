'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';

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
}

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
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<any>(null);
  const mapboxRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);

  const centerMarkerRef = useRef<any>(null);
  const zoneMarkersRef = useRef<any[]>([]);
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
          'text-size': 13,
          'text-anchor': 'top',
          'text-offset': [0, 1.2],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': 'rgba(0,0,0,0.55)',
          'text-halo-width': 2,
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
      const rankText = isRanked ? `#${zone.rank}` : '';
      const labelText = isRanked
        ? `${rankText}\n${zone.score}`
        : `${zone.score}\n${zone.color === 'green' ? 'Recommended' : zone.color === 'yellow' ? 'Moderate' : 'Avoid'}`;

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
        pitch: 60, // 3D perspective
        bearing: 0,
        antialias: true,
      });

      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');
      map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');
      map.on('error', (e: any) => {
        console.error('Mapbox error:', e);
      });

      map.on('load', () => {
        // Add "true 3D" buildings layer (extrusions) when the style provides composite/building data.
        const layers = map.getStyle().layers ?? [];
        const labelLayerId = layers.find(
          (l: any) => l.type === 'symbol' && l.layout && l.layout['text-field']
        )?.id;

        if (!map.getLayer('locintel-3d-buildings')) {
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
        }

        updateRadiusCircle();
        updateZoneCircles();
        updateZoneLabels();
        setMapReady(true);
      });
    };

    init();

    return () => {
      try {
        mapRef.current?.remove?.();
      } catch (_) {
        // ignore
      }
      mapRef.current = null;
      mapboxRef.current = null;
      centerMarkerRef.current = null;
      zoneMarkersRef.current = [];
      popupRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      pitch: 60,
      duration: 300,
    });

    updateRadiusCircle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]]);

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
      pitch: 60,
      duration: 800,
    });
  }, [flyToPosition?.[0], flyToPosition?.[1]]);

  // Update zone circles (boundary rings)
  useEffect(() => {
    if (!mapRef.current) return;
    updateZoneCircles();
    updateZoneLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showZones, zones]);

  // Update zone markers + popups
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!map || !mapboxgl) return;

    zoneMarkersRef.current.forEach((m) => m.remove());
    zoneMarkersRef.current = [];
    popupRef.current?.remove?.();
    popupRef.current = null;

    if (!showZones || zones.length === 0) return;

    zones.forEach((zone) => {
      const color = getZoneColor(zone.color);
      const label = zone.color === 'green' ? 'Recommended' : zone.color === 'yellow' ? 'Moderate' : 'Avoid';

      const isRanked = zone.rank != null && zone.rank >= 1 && zone.rank <= 10;
      const size = isRanked ? 56 : 64;
      const rankBadge = isRanked
        ? `<div style="position:relative;z-index:2;font-size:22px;font-weight:900;line-height:1;color:#fff;text-shadow:0 0 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5);">${zone.rank === 1 ? '👑 ' : ''}${zone.rank}</div>
           <div style="font-size:10px;font-weight:700;opacity:0.95;margin-top:2px">${zone.score}</div>`
        : `<div style="font-size:15px;font-weight:800;line-height:1">${zone.score}</div>
           <div style="font-size:9px;font-weight:600;opacity:0.9;margin-top:2px">${label}</div>`;

      const el = document.createElement('div');
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';

      el.innerHTML = `
        <div style="
          position:absolute;
          width:${size}px;height:${size}px;
          border-radius:50%;
          background:${color}${isRanked ? 'dd' : '30'};
          border:3px solid ${color};
          box-shadow:0 0 20px ${color}80, 0 4px 12px rgba(0,0,0,0.3);
        "></div>
        <div style="position:relative;z-index:1;text-align:center;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          ${rankBadge}
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el }).setLngLat([zone.lng, zone.lat]).addTo(map);

      el.addEventListener('click', (e: any) => {
        e.stopPropagation?.();
        onZoneClick?.(zone);
        showZonePopup([zone.lng, zone.lat], zone);
      });

      zoneMarkersRef.current.push(marker);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, showZones, zones, onZoneClick]);

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

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ background: '#0f172a', minHeight: '300px' }}>
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-black/60">
          <div className="text-white text-sm">
            Missing Mapbox API key. Add <span className="font-mono">NEXT_PUBLIC_MAPBOX_API_KEY</span> to <span className="font-mono">.env.local</span>.
          </div>
        </div>
      )}
    </div>
  );
}
