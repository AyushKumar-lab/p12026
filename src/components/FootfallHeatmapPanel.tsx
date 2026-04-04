'use client';

import { useMemo, useState } from 'react';
import { type FootfallTimeSlot, getFootfallNearby, getTimeMultiplier } from '@/lib/footfallData';

interface FootfallHeatmapPanelProps {
  lat: number;
  lng: number;
  radiusKm: number;
}

const SLOTS: { id: FootfallTimeSlot; label: string; icon: string }[] = [
  { id: 'morning', label: 'Morning', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { id: 'evening', label: 'Evening', icon: '🌆' },
  { id: 'weekend', label: 'Weekend', icon: '📅' },
];

function intensityColor(v: number): string {
  if (v >= 80) return '#10b981';
  if (v >= 50) return '#f59e0b';
  return '#ef4444';
}

function intensityLabel(v: number): string {
  if (v >= 80) return 'Very High';
  if (v >= 60) return 'High';
  if (v >= 40) return 'Moderate';
  if (v >= 20) return 'Low';
  return 'Very Low';
}

export default function FootfallHeatmapPanel({ lat, lng, radiusKm }: FootfallHeatmapPanelProps) {
  const [activeSlot, setActiveSlot] = useState<FootfallTimeSlot>('afternoon');

  const cells = useMemo(
    () => getFootfallNearby(lat, lng, radiusKm, activeSlot),
    [lat, lng, radiusKm, activeSlot]
  );

  const avgIntensity = cells.length > 0
    ? Math.round(cells.reduce((s, c) => s + c.adjustedIntensity, 0) / cells.length)
    : 0;

  const multiplier = getTimeMultiplier(activeSlot);

  return (
    <div className="bg-slate-800/60 rounded-xl border border-white/10 p-4">
      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px]">🔥</span>
        Footfall Heatmap
      </h4>
      <p className="text-[10px] text-slate-400 mb-3">
        Trip density proxy · {cells.length} grid cells within {radiusKm}km
      </p>

      {/* Time slot toggles */}
      <div className="flex gap-1 mb-3">
        {SLOTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSlot(s.id)}
            className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-all ${
              activeSlot === s.id
                ? 'bg-orange-500/20 border border-orange-500 text-orange-300'
                : 'bg-slate-800/50 border border-white/5 text-slate-400 hover:text-slate-300'
            }`}
          >
            <div>{s.icon}</div>
            <div>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Average intensity */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] text-slate-400">Average footfall</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold" style={{ color: intensityColor(avgIntensity) }}>
            {avgIntensity}/100
          </span>
          <span className="text-[10px]" style={{ color: intensityColor(avgIntensity) }}>
            {intensityLabel(avgIntensity)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3 px-1">
        <span className={`text-[10px] font-bold ${multiplier >= 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {multiplier}x traffic multiplier
        </span>
        <span className="text-[10px] text-slate-500">for {activeSlot}</span>
      </div>

      {/* Top cells */}
      {cells.length > 0 && (
        <div className="space-y-1">
          {cells.slice(0, 5).map((c, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-900/40 rounded px-2 py-1.5">
              <div className="min-w-0">
                <p className="text-[10px] text-white truncate">{c.city}</p>
                <p className="text-[9px] text-slate-500">{c.distanceKm}km away</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(c.adjustedIntensity, 100)}%`,
                      backgroundColor: intensityColor(c.adjustedIntensity),
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white w-6 text-right">
                  {c.adjustedIntensity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {cells.length === 0 && (
        <p className="text-[10px] text-slate-500 text-center py-3">
          No footfall data available for this area yet.
          <br />⏳ Needs OLA Maps API registration.
        </p>
      )}

      <p className="text-[9px] text-slate-600 mt-2 text-center">
        Data source: Simulated OLA Maps Mobility API · Grid cell ~200m²
      </p>
    </div>
  );
}
