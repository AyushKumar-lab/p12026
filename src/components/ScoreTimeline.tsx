'use client';

import { useMemo } from 'react';
import { type ScoreEntry, getScoreTrend } from '@/lib/scoreHistory';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreTimelineProps {
  entries: ScoreEntry[];
  locationName: string;
}

export default function ScoreTimeline({ entries, locationName }: ScoreTimelineProps) {
  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [entries]
  );

  const trend = useMemo(() => getScoreTrend(sorted), [sorted]);

  if (sorted.length === 0) return null;

  // Chart dimensions
  const W = 280;
  const H = 100;
  const padX = 20;
  const padTop = 30; // extra room so score labels above dots aren't clipped
  const padBottom = 20;
  const chartW = W - padX * 2;
  const chartH = H - padTop - padBottom;

  // Scale values
  const scores = sorted.map((e) => e.score);
  const minS = Math.max(Math.min(...scores) - 10, 0);
  const maxS = Math.min(Math.max(...scores) + 10, 100);
  const range = maxS - minS || 1;

  const pts = sorted.map((e, i) => ({
    x: padX + (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW),
    y: padTop + chartH - ((e.score - minS) / range) * chartH,
    score: e.score,
    date: new Date(e.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padTop + chartH} L ${pts[0].x} ${padTop + chartH} Z`;

  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? '#10b981' : trend.direction === 'down' ? '#ef4444' : '#94a3b8';

  return (
    <div className="bg-slate-800/60 rounded-xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">📈</span>
          Score History
        </h4>
        <div className="flex items-center gap-1" style={{ color: trendColor }}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">
            {trend.direction === 'stable' ? '—' : `${trend.direction === 'up' ? '+' : '-'}${trend.change}`}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mb-2">{trend.message}</p>

      {sorted.length > 1 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Grid lines */}
          {[0, 0.5, 1].map((f, i) => (
            <line
              key={i}
              x1={padX}
              y1={padTop + chartH * (1 - f)}
              x2={padX + chartW}
              y2={padTop + chartH * (1 - f)}
              stroke="rgba(148,163,184,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#scoreGrad)" opacity="0.3" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              {/* clamp label so it never goes above y=10 */}
              <text x={p.x} y={Math.max(p.y - 8, 10)} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="700">
                {p.score}
              </text>
            </g>
          ))}

          {/* Date labels for first and last */}
          {pts.length >= 2 && (
            <>
              <text x={pts[0].x} y={H - 3} textAnchor="start" fill="#64748b" fontSize="7">{pts[0].date}</text>
              <text x={pts[pts.length - 1].x} y={H - 3} textAnchor="end" fill="#64748b" fontSize="7">{pts[pts.length - 1].date}</text>
            </>
          )}

          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}

      <p className="text-[10px] text-slate-500 mt-1">
        {sorted.length} analysis{sorted.length !== 1 ? 'es' : ''} recorded for {locationName}
      </p>
    </div>
  );
}
