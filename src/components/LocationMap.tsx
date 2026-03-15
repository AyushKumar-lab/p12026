'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationMapProps {
  center: [number, number];
  radius: number;
  zones?: Array<{
    id: number;
    lat: number;
    lng: number;
    score: number;
    color: string;
    reasoning: string;
  }>;
  showZones?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function LocationMap({
  center,
  radius,
  zones = [],
  showZones = false,
  onLocationSelect,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        setLeafletLoaded(true);
      } catch (err) {
        setError('Failed to load map');
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Initialize map
        const map = L.map(mapRef.current!, {
          center: center,
          zoom: 14,
          zoomControl: true,
        });

        // Add dark themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map);

        // Add center marker
        const centerIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background: #10b981;
              border: 3px solid #fff;
              border-radius: 50%;
              box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
            "></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(center, { icon: centerIcon, draggable: true }).addTo(map);

        // Handle marker drag
        marker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }
        });

        // Add radius circle
        const circle = L.circle(center, {
          radius: radius * 1000, // Convert km to meters
          fillColor: '#10b981',
          fillOpacity: 0.1,
          color: '#10b981',
          weight: 2,
          dashArray: '5, 10',
        }).addTo(map);

        // Fit bounds to show the circle
        map.fitBounds(circle.getBounds(), { padding: [50, 50] });

        mapInstanceRef.current = { map, circle, marker };

        return () => {
          map.remove();
        };
      } catch (err) {
        setError('Failed to initialize map');
      }
    };

    initMap();
  }, [leafletLoaded, center, radius, onLocationSelect]);

  // Update circle when radius changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const { circle } = mapInstanceRef.current;
      circle.setRadius(radius * 1000);
    }
  }, [radius]);

  // Update center when it changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const { map, circle, marker } = mapInstanceRef.current;
      map.setView(center, 14);
      circle.setLatLng(center);
      marker.setLatLng(center);
      map.fitBounds(circle.getBounds(), { padding: [50, 50] });
    }
  }, [center]);

  // Add zone markers when analysis is complete
  useEffect(() => {
    if (!mapInstanceRef.current || !showZones) return;

    const L = require('leaflet');
    const { map } = mapInstanceRef.current;

    // Clear existing zone markers
    map.eachLayer((layer: any) => {
      if (layer.options && layer.options.isZoneMarker) {
        map.removeLayer(layer);
      }
    });

    // Add zone markers
    zones.forEach((zone) => {
      const color = zone.color === 'green' ? '#10b981' : zone.color === 'yellow' ? '#f59e0b' : '#ef4444';
      
      const zoneIcon = L.divIcon({
        className: 'zone-marker',
        html: `
          <div style="
            width: 60px;
            height: 60px;
            background: ${color}40;
            border: 2px solid ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            box-shadow: 0 0 20px ${color}80;
          ">${zone.score}</div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });

      const marker = L.marker([zone.lat, zone.lng], {
        icon: zoneIcon,
        isZoneMarker: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: bold; color: ${color};">
            ${zone.color === 'green' ? 'Best Zone' : zone.color === 'yellow' ? 'Good Zone' : 'Avoid'}
          </h3>
          <p style="margin: 0 0 8px; font-size: 13px; color: #e2e8f0;">${zone.reasoning}</p>
          <div style="font-size: 18px; font-weight: bold; color: #10b981;">Score: ${zone.score}/100</div>
        </div>
      `);
    });
  }, [showZones, zones]);

  if (error) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{ background: '#0f172a' }}
    />
  );
}
