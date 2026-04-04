'use client';

import { useMemo } from 'react';
import { getMonsoonWarning, getCurrentMonthRisk, getMonthName, type MonsoonZone } from '@/lib/monsoonData';
import { CloudRain, AlertTriangle, ShieldAlert } from 'lucide-react';

interface MonsoonWarningProps {
  lat: number;
  lng: number;
}

const severityConfig = {
  critical: { bg: 'bg-red-500/15', border: 'border-red-500/40', text: 'text-red-300', icon: ShieldAlert, label: 'CRITICAL FLOOD RISK' },
  high: { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300', icon: AlertTriangle, label: 'HIGH FLOOD RISK' },
  moderate: { bg: 'bg-blue-500/15', border: 'border-blue-500/40', text: 'text-blue-300', icon: CloudRain, label: 'MODERATE FLOOD RISK' },
};

export default function MonsoonWarning({ lat, lng }: MonsoonWarningProps) {
  const warning = useMemo(() => getMonsoonWarning(lat, lng, 3), [lat, lng]);

  if (!warning) return null;

  const risk = getCurrentMonthRisk(warning);
  const config = severityConfig[warning.severity];
  const Icon = config.icon;

  const highMonths = warning.highRiskMonths.map(getMonthName).join(', ');
  const modMonths = warning.moderateRiskMonths.map(getMonthName).join(', ');

  return (
    <div className={`${config.bg} rounded-xl border ${config.border} p-3`}>
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold uppercase ${config.text}`}>{config.label}</span>
            {risk !== 'none' && (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                risk === 'high' ? 'bg-red-500/30 text-red-200' : 'bg-amber-500/30 text-amber-200'
              }`}>
                {risk === 'high' ? '⚠ ACTIVE NOW' : '🔶 APPROACHING'}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-white">{warning.name}</p>
          <p className="text-[10px] text-slate-300 leading-relaxed mt-1">{warning.description}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px]">
            <span className="text-red-300">🔴 High risk: {highMonths}</span>
            {modMonths && <span className="text-amber-300">🟡 Moderate: {modMonths}</span>}
          </div>
          <p className="text-[9px] text-slate-500 mt-1.5 italic">
            A broker never tells this. Source: NDMA Hazard Atlas + India-WRIS.
          </p>
        </div>
      </div>
    </div>
  );
}
