'use client';

import { useMemo } from 'react';

interface CompetitorRadarProps {
  /** competitors within different radii */
  competitors300m: number;
  competitors500m: number;
  competitors1km: number;
  businessType?: string;
}

function densityColor(count: number): string {
  if (count < 3) return '#10b981'; // green
  if (count <= 7) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

function densityLabel(count: number): string {
  if (count < 3) return 'Low';
  if (count <= 7) return 'Moderate';
  return 'High';
}

export default function CompetitorRadar({
  competitors300m,
  competitors500m,
  competitors1km,
  businessType = 'business',
}: CompetitorRadarProps) {
  const maxVal = useMemo(() => Math.max(competitors1km, 15), [competitors1km]);

  // Normalize values to 0-1 for the radar
  const r300 = Math.min(competitors300m / maxVal, 1);
  const r500 = Math.min(competitors500m / maxVal, 1);
  const r1k = Math.min(competitors1km / maxVal, 1);

  // SVG center and radius
  const cx = 120;
  const cy = 120;
  const R = 90;

  // 3 axes at 120° apart (top, bottom-left, bottom-right)
  const axes = [
    { angle: -90, label: '300m', value: competitors300m, norm: r300 },
    { angle: 150, label: '1km', value: competitors1km, norm: r1k },
    { angle: 30, label: '500m', value: competitors500m, norm: r500 },
  ];

  const points = axes.map((a) => {
    const rad = (a.angle * Math.PI) / 180;
    const r = R * a.norm;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad), ...a };
  });

  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid circles
  const gridLevels = [0.33, 0.66, 1];

  return (
    <div className="bg-slate-800/60 rounded-xl border border-white/10 p-4">
      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">📡</span>
        Competitor Radar
      </h4>
      <p className="text-[10px] text-slate-400 mb-3">
        Same-type {businessType} competitors by distance
      </p>

      <div className="flex justify-center">
        <svg width="240" height="240" viewBox="0 0 240 240">
          {/* Grid circles */}
          {gridLevels.map((level, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={R * level}
              fill="none"
              stroke="rgba(148,163,184,0.15)"
              strokeWidth="1"
              strokeDasharray={i < 2 ? '4 4' : '0'}
            />
          ))}

          {/* Axis lines */}
          {axes.map((a, i) => {
            const rad = (a.angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + R * Math.cos(rad)}
                y2={cy + R * Math.sin(rad)}
                stroke="rgba(148,163,184,0.2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polyPoints}
            fill="rgba(59,130,246,0.15)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill={densityColor(p.value)} stroke="#fff" strokeWidth="2" />
              {/* Label */}
              <text
                x={cx + (R + 18) * Math.cos((p.angle * Math.PI) / 180)}
                y={cy + (R + 18) * Math.sin((p.angle * Math.PI) / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="10"
                fontWeight="600"
              >
                {p.label}
              </text>
              {/* Count */}
              <text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fill="#fff"
                fontSize="11"
                fontWeight="700"
              >
                {p.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { label: '300m', count: competitors300m },
          { label: '500m', count: competitors500m },
          { label: '1km', count: competitors1km },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div
              className="text-xs font-bold"
              style={{ color: densityColor(item.count) }}
            >
              {item.count} — {densityLabel(item.count)}
            </div>
            <div className="text-[10px] text-slate-500">{item.label} radius</div>
          </div>
        ))}
      </div>
    </div>
  );
}
