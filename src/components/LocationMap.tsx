'use client';

import { useEffect, useRef } from 'react';

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

export default function LocationMap({
  center,
  radius,
  zones = [],
  showZones = false,
  flyToPosition = null,
  onLocationSelect,
  onZoneClick,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);
  const leafletRef = useRef<{
    map: any;
    circle: any;
    marker: any;
    zoneMarkers: any[];
    zoneCircles: any[];
    L: any;
    initialized: boolean;
  }>({ map: null, circle: null, marker: null, zoneMarkers: [], zoneCircles: [], L: null, initialized: false });

  // ── Initialize map ONCE (guard against React Strict Mode double-mount) ────
  useEffect(() => {
    if (initializingRef.current || leafletRef.current.initialized || !mapRef.current) return;
    initializingRef.current = true;

    const init = async () => {
      const L = (await import('leaflet')).default;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const container = mapRef.current;
      if (!container) {
        initializingRef.current = false;
        return;
      }
      // If container was reused and still has a map (e.g. from previous mount), don't init again
      if ((container as any)._leaflet_id) {
        initializingRef.current = false;
        return;
      }

      const map = L.map(container, {
        center,
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      // OpenStreetMap standard tiles — full street names, labels, and detail (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Center marker (draggable)
      const centerIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:28px;height:28px">
            <div style="position:absolute;inset:0;background:#10b981;border:3px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(16,185,129,0.6)"></div>
            <div style="position:absolute;inset:-6px;background:rgba(16,185,129,0.25);border-radius:50%;animation:pulse-ring 1.8s ease-out infinite"></div>
          </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(center, { icon: centerIcon, draggable: !!onLocationSelect }).addTo(map);

      marker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        if (onLocationSelect) onLocationSelect(lat, lng);
      });

      // Radius circle
      const circle = L.circle(center, {
        radius: radius * 1000,
        fillColor: '#10b981',
        fillOpacity: 0.08,
        color: '#10b981',
        weight: 2,
        dashArray: '6 12',
      }).addTo(map);

      map.fitBounds(circle.getBounds(), { padding: [50, 50] });

      leafletRef.current = { map, circle, marker, zoneMarkers: [], zoneCircles: [], L, initialized: true };
      initializingRef.current = false;
    };

    init();

    return () => {
      initializingRef.current = false;
      if (leafletRef.current.initialized && leafletRef.current.map) {
        leafletRef.current.map.remove();
        leafletRef.current.initialized = false;
      }
    };
  }, []);

  // ── Update center when it changes ─────────────────────────────────────────
  useEffect(() => {
    const { map, circle, marker, initialized } = leafletRef.current;
    if (!initialized || !map) return;

    map.flyTo(center, map.getZoom(), { animate: true, duration: 1 });
    circle.setLatLng(center);
    marker.setLatLng(center);
    map.fitBounds(circle.getBounds(), { padding: [50, 50] });
  }, [center[0], center[1]]); // eslint-disable-line

  // ── Update radius circle ──────────────────────────────────────────────────
  useEffect(() => {
    const { circle, map, initialized } = leafletRef.current;
    if (!initialized || !circle) return;

    circle.setRadius(radius * 1000);
    map.fitBounds(circle.getBounds(), { padding: [50, 50] });
  }, [radius]);

  // ── Fly to a specific position (e.g. "View on map" for recommendation #3)
  useEffect(() => {
    const { map, initialized } = leafletRef.current;
    if (!initialized || !map || !flyToPosition) return;
    map.flyTo(flyToPosition, 17, { animate: true, duration: 1 });
  }, [flyToPosition?.[0], flyToPosition?.[1]]);

  // ── Add/update zone markers and boundary circles (ranked 1–10 when zone.rank is set)
  useEffect(() => {
    const { map, zoneMarkers, zoneCircles, L, initialized } = leafletRef.current;
    if (!initialized || !map || !L) return;

    zoneMarkers.forEach(m => m.remove());
    zoneCircles.forEach(c => c.remove());
    leafletRef.current.zoneMarkers = [];
    leafletRef.current.zoneCircles = [];

    if (!showZones || zones.length === 0) return;

    const newCircles: any[] = [];
    const newMarkers: any[] = [];

    zones.forEach((zone) => {
      const radiusM = zone.radiusM ?? 0;
      if (radiusM > 0) {
        const color =
          zone.color === 'green'  ? '#10b981' :
          zone.color === 'yellow' ? '#f59e0b' : '#ef4444';
        const circle = L.circle([zone.lat, zone.lng], {
          radius: radiusM,
          fillColor: color,
          fillOpacity: 0.08,
          color,
          weight: 2,
          dashArray: '6 8',
        }).addTo(map);
        newCircles.push(circle);
      }

      const color =
        zone.color === 'green'  ? '#10b981' :
        zone.color === 'yellow' ? '#f59e0b' : '#ef4444';

      const label =
        zone.color === 'green'  ? 'Recommended' :
        zone.color === 'yellow' ? 'Moderate' : 'Avoid';

      const isRanked = zone.rank != null && zone.rank >= 1 && zone.rank <= 10;
      const size = isRanked ? 56 : 64;
      const rankBadge = isRanked
        ? `<div style="position:relative;z-index:2;font-size:22px;font-weight:900;line-height:1;color:#fff;text-shadow:0 0 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5);">${zone.rank === 1 ? '👑 ' : ''}${zone.rank}</div>
           <div style="font-size:10px;font-weight:700;opacity:0.95;margin-top:2px">${zone.score}</div>`
        : `<div style="font-size:15px;font-weight:800;line-height:1">${zone.score}</div>
           <div style="font-size:9px;font-weight:600;opacity:0.9;margin-top:2px">${label}</div>`;

      const zoneIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            position:relative;
            width:${size}px;height:${size}px;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            cursor:pointer;
          ">
            <div style="
              position:absolute;inset:0;
              background:${color}${isRanked ? 'dd' : '30'};
              border:3px solid ${color};
              border-radius:50%;
              box-shadow:0 0 20px ${color}80, 0 4px 12px rgba(0,0,0,0.3);
            "></div>
            <div style="position:relative;z-index:1;text-align:center;color:#fff;">
              ${rankBadge}
            </div>
          </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const m = L.marker([zone.lat, zone.lng], { icon: zoneIcon }).addTo(map);

      const comp = zone.competitors ?? '—';
      const transit = zone.transitPoints ?? '—';
      const rankTitle = isRanked ? `#${zone.rank} Best place` : (zone.color === 'green' ? '✅ Recommended' : zone.color === 'yellow' ? '⚡ Moderate' : '⚠️ Avoid');
      m.bindPopup(`
        <div style="font-family:Inter,sans-serif;padding:14px;min-width:220px">
          <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;color:${color}">${rankTitle}</h3>
          <p style="margin:0 0 10px;font-size:12px;color:#cbd5e1;line-height:1.45">${zone.reasoning}</p>
          <div style="font-size:20px;font-weight:800;color:${color}">Score: ${zone.score}/100</div>
          <div style="margin-top:8px;font-size:11px;color:#94a3b8">${comp} competitors · ${transit} transit</div>
        </div>
      `);

      m.on('click', () => {
        if (onZoneClick) onZoneClick(zone);
      });

      newMarkers.push(m);
    });

    leafletRef.current.zoneMarkers = newMarkers;
    leafletRef.current.zoneCircles = newCircles;
  }, [showZones, zones, onZoneClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{ background: '#0f172a', minHeight: '300px' }}
    />
  );
}
