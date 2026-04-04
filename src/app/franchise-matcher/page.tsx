'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import {
  Building2,
  MapPin,
  FileText,
  Download,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  SlidersHorizontal,
  Loader2,
  Printer,
} from 'lucide-react';

/* ── Simulated commercial property database ── */
interface CommercialProperty {
  id: string;
  name: string;
  city: string;
  locality: string;
  lat: number;
  lng: number;
  areaSqFt: number;
  monthlyRent: number;
  frontageM: number;
  floorLevel: string;
  nearbyFootfall: number; // 0-100
  competitorDensity: number; // 0-100 (lower = better)
  transitScore: number; // 0-100
  parkingAvailable: boolean;
  matchScore?: number;
}

const SAMPLE_PROPERTIES: CommercialProperty[] = [
  { id: 'p1', name: 'Saheed Nagar Shop #12', city: 'Bhubaneswar', locality: 'Saheed Nagar', lat: 20.2890, lng: 85.8440, areaSqFt: 800, monthlyRent: 35000, frontageM: 8, floorLevel: 'Ground', nearbyFootfall: 82, competitorDensity: 45, transitScore: 78, parkingAvailable: true },
  { id: 'p2', name: 'Master Canteen Complex Unit', city: 'Bhubaneswar', locality: 'Master Canteen', lat: 20.2720, lng: 85.8390, areaSqFt: 600, monthlyRent: 45000, frontageM: 6, floorLevel: 'Ground', nearbyFootfall: 92, competitorDensity: 65, transitScore: 90, parkingAvailable: false },
  { id: 'p3', name: 'Patia Main Road Shop', city: 'Bhubaneswar', locality: 'Patia', lat: 20.3530, lng: 85.8190, areaSqFt: 1200, monthlyRent: 25000, frontageM: 12, floorLevel: 'Ground', nearbyFootfall: 65, competitorDensity: 30, transitScore: 60, parkingAvailable: true },
  { id: 'p4', name: 'Rasulgarh Market Space', city: 'Bhubaneswar', locality: 'Rasulgarh', lat: 20.2862, lng: 85.8530, areaSqFt: 500, monthlyRent: 30000, frontageM: 5, floorLevel: 'Ground', nearbyFootfall: 85, competitorDensity: 55, transitScore: 75, parkingAvailable: true },
  { id: 'p5', name: 'Choudhury Bazar Shop', city: 'Cuttack', locality: 'Choudhury Bazar', lat: 20.4625, lng: 85.8830, areaSqFt: 700, monthlyRent: 28000, frontageM: 7, floorLevel: 'Ground', nearbyFootfall: 90, competitorDensity: 70, transitScore: 80, parkingAvailable: false },
  { id: 'p6', name: 'Badambadi Complex Unit', city: 'Cuttack', locality: 'Badambadi', lat: 20.4690, lng: 85.8780, areaSqFt: 900, monthlyRent: 22000, frontageM: 9, floorLevel: '1st Floor', nearbyFootfall: 75, competitorDensity: 40, transitScore: 82, parkingAvailable: true },
  { id: 'p7', name: 'Gol Bazar Heritage Shop', city: 'Berhampur', locality: 'Gol Bazar', lat: 19.3150, lng: 84.7940, areaSqFt: 550, monthlyRent: 15000, frontageM: 6, floorLevel: 'Ground', nearbyFootfall: 80, competitorDensity: 50, transitScore: 70, parkingAvailable: false },
  { id: 'p8', name: 'Pandri Market Shop', city: 'Raipur', locality: 'Pandri', lat: 21.2370, lng: 81.6350, areaSqFt: 650, monthlyRent: 20000, frontageM: 7, floorLevel: 'Ground', nearbyFootfall: 88, competitorDensity: 55, transitScore: 85, parkingAvailable: true },
  { id: 'p9', name: 'Telibandha Road Commercial', city: 'Raipur', locality: 'Telibandha', lat: 21.2410, lng: 81.6530, areaSqFt: 1000, monthlyRent: 32000, frontageM: 10, floorLevel: 'Ground', nearbyFootfall: 75, competitorDensity: 35, transitScore: 78, parkingAvailable: true },
  { id: 'p10', name: 'Town Hall Road Shop', city: 'Sambalpur', locality: 'Town Hall', lat: 21.4669, lng: 83.9756, areaSqFt: 450, monthlyRent: 12000, frontageM: 5, floorLevel: 'Ground', nearbyFootfall: 78, competitorDensity: 35, transitScore: 72, parkingAvailable: true },
];

interface FranchiseCriteria {
  brandName: string;
  businessType: string;
  minAreaSqFt: number;
  maxRent: number;
  minFrontageM: number;
  requireGround: boolean;
  requireParking: boolean;
  targetCities: string[];
  priorityWeights: {
    footfall: number;
    lowCompetition: number;
    transit: number;
    affordability: number;
  };
}

const CITIES = ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Sambalpur', 'Raipur'];
const BIZ_TYPES = ['Restaurant', 'Pharmacy', 'Kirana', 'Clothing', 'Electronics', 'Salon', 'Gym', 'Coaching Center'];

function computeMatchScore(prop: CommercialProperty, criteria: FranchiseCriteria): number {
  const w = criteria.priorityWeights;
  const totalW = w.footfall + w.lowCompetition + w.transit + w.affordability;
  if (totalW === 0) return 50;

  const footfallScore = prop.nearbyFootfall;
  const compScore = 100 - prop.competitorDensity;
  const transitScore = prop.transitScore;
  const affordScore = criteria.maxRent > 0
    ? Math.min(100, ((criteria.maxRent - prop.monthlyRent) / criteria.maxRent) * 100 + 50)
    : 50;

  const weighted =
    (footfallScore * w.footfall +
      compScore * w.lowCompetition +
      transitScore * w.transit +
      affordScore * w.affordability) /
    totalW;

  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export default function FranchiseMatcherPage() {
  const [step, setStep] = useState(1);
  const [criteria, setCriteria] = useState<FranchiseCriteria>({
    brandName: '',
    businessType: '',
    minAreaSqFt: 400,
    maxRent: 50000,
    minFrontageM: 4,
    requireGround: true,
    requireParking: false,
    targetCities: [],
    priorityWeights: { footfall: 30, lowCompetition: 25, transit: 25, affordability: 20 },
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const rankedResults = useMemo(() => {
    let filtered = SAMPLE_PROPERTIES.filter((p) => {
      if (criteria.targetCities.length > 0 && !criteria.targetCities.includes(p.city)) return false;
      if (p.areaSqFt < criteria.minAreaSqFt) return false;
      if (p.monthlyRent > criteria.maxRent) return false;
      if (p.frontageM < criteria.minFrontageM) return false;
      if (criteria.requireGround && p.floorLevel !== 'Ground') return false;
      if (criteria.requireParking && !p.parkingAvailable) return false;
      return true;
    });

    return filtered
      .map((p) => ({ ...p, matchScore: computeMatchScore(p, criteria) }))
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }, [criteria]);

  const handleAnalyze = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 1500);
  }, []);

  const generatePDF = useCallback(() => {
    const brand = criteria.brandName || 'Franchise';
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
<!DOCTYPE html>
<html><head>
<title>LocIntel Franchise Report — ${brand}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Inter, system-ui, sans-serif; background: #fff; color: #1e293b; padding: 32px; max-width: 800px; margin: 0 auto; }
  .header { border-bottom: 3px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { font-size: 22px; color: #0f172a; }
  .header p { font-size: 13px; color: #64748b; margin-top: 4px; }
  .badge { display: inline-block; background: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 4px 10px; font-size: 11px; color: #3b82f6; font-weight: 600; margin: 4px 4px 4px 0; }
  .criteria { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 12px; }
  .criteria h3 { font-size: 14px; margin-bottom: 8px; }
  .criteria .row { display: flex; gap: 16px; flex-wrap: wrap; }
  .criteria .row span { background: #fff; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 4px; }
  h2 { font-size: 16px; margin: 24px 0 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .prop { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; page-break-inside: avoid; }
  .prop .rank { display: inline-block; background: #3b82f6; color: #fff; width: 24px; height: 24px; border-radius: 4px; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 8px; }
  .prop .rank.top { background: #10b981; }
  .prop .name { font-weight: 600; font-size: 13px; }
  .prop .score { color: #3b82f6; font-weight: 700; font-size: 14px; float: right; }
  .prop .meta { font-size: 11px; color: #64748b; margin-top: 6px; line-height: 1.5; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 16px; } .no-print { display: none; } }
</style>
</head><body>
<div class="header">
  <h1>🏢 LocIntel Franchise Location Report</h1>
  <p>${brand} · ${criteria.businessType} · Generated ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>

<div class="criteria">
  <h3>Search Criteria</h3>
  <div class="row">
    <span><b>Min Area:</b> ${criteria.minAreaSqFt} sqft</span>
    <span><b>Max Rent:</b> ₹${criteria.maxRent.toLocaleString()}</span>
    <span><b>Min Frontage:</b> ${criteria.minFrontageM}m</span>
    <span><b>Ground Floor:</b> ${criteria.requireGround ? 'Yes' : 'Any'}</span>
    <span><b>Parking:</b> ${criteria.requireParking ? 'Required' : 'Optional'}</span>
  </div>
  <div style="margin-top:8px">
    <b>Cities:</b> ${criteria.targetCities.length ? criteria.targetCities.join(', ') : 'All'}
  </div>
</div>

<h2>${rankedResults.length} Matching Locations (Ranked)</h2>
${rankedResults.map((p, i) => `
<div class="prop">
  <span class="rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
  <span class="name">${p.name}</span>
  <span class="score">${p.matchScore}/100</span>
  <div class="meta">
    📍 ${p.locality}, ${p.city} · ${p.areaSqFt} sqft · ₹${p.monthlyRent.toLocaleString()}/mo · ${p.frontageM}m frontage · ${p.floorLevel}
    ${p.parkingAvailable ? ' · 🅿️ Parking' : ''}<br/>
    👥 Footfall: ${p.nearbyFootfall}/100 · 🏪 Competition: ${p.competitorDensity}/100 · 🚌 Transit: ${p.transitScore}/100
  </div>
</div>`).join('')}

<div class="footer">
  Generated by LocIntel Franchise Intelligence · ${new Date().toLocaleString('en-IN')} · locintel.in<br/>
  <span class="no-print" style="font-size:12px;color:#3b82f6;cursor:pointer" onclick="window.print()">🖨 Click to Print / Save PDF</span>
</div>
</body></html>`);
    printWin.document.close();
  }, [criteria, rankedResults]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={28} />
            <span className="text-lg font-bold text-white">Loc<span className="text-blue-400">Intel</span></span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 className="w-4 h-4" />
            Franchise Matcher
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto relative z-10">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { n: 1, label: 'Criteria' },
            { n: 2, label: 'Priorities' },
            { n: 3, label: 'Results' },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                s.n === step ? 'bg-blue-500 text-white' : s.n < step ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {s.n < step ? <CheckCircle2 className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-xs hidden sm:inline ${s.n === step ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
              {s.n < 3 && <div className="w-8 h-px bg-slate-700" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Criteria */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold mb-2">🏢 Franchise Location Matcher</h1>
              <p className="text-sm text-slate-400 mb-6">Input your ideal franchise criteria — LocIntel ranks all available commercial properties.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand / Chain Name</label>
                  <input type="text" value={criteria.brandName} onChange={(e) => setCriteria({ ...criteria, brandName: e.target.value })}
                    placeholder="e.g. Domino's, Apollo Pharmacy, More Supermarket"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BIZ_TYPES.map((t) => (
                      <button key={t} onClick={() => setCriteria({ ...criteria, businessType: t })}
                        className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                          criteria.businessType === t ? 'bg-blue-500/15 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-white/10 text-slate-300 hover:border-white/20'
                        }`}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Min Area (sqft): <span className="text-blue-400">{criteria.minAreaSqFt}</span></label>
                    <input type="range" min={200} max={5000} step={50} value={criteria.minAreaSqFt}
                      onChange={(e) => setCriteria({ ...criteria, minAreaSqFt: +e.target.value })}
                      className="w-full accent-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Max Rent: <span className="text-blue-400">₹{criteria.maxRent.toLocaleString()}</span></label>
                    <input type="range" min={5000} max={200000} step={1000} value={criteria.maxRent}
                      onChange={(e) => setCriteria({ ...criteria, maxRent: +e.target.value })}
                      className="w-full accent-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Min Frontage: <span className="text-blue-400">{criteria.minFrontageM}m</span></label>
                  <input type="range" min={2} max={20} step={1} value={criteria.minFrontageM}
                    onChange={(e) => setCriteria({ ...criteria, minFrontageM: +e.target.value })}
                    className="w-full accent-blue-500" />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={criteria.requireGround}
                      onChange={(e) => setCriteria({ ...criteria, requireGround: e.target.checked })}
                      className="rounded border-slate-500 text-blue-500" />
                    Ground floor only
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={criteria.requireParking}
                      onChange={(e) => setCriteria({ ...criteria, requireParking: e.target.checked })}
                      className="rounded border-slate-500 text-blue-500" />
                    Parking required
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Cities</label>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map((c) => (
                      <button key={c} onClick={() => {
                        const has = criteria.targetCities.includes(c);
                        setCriteria({ ...criteria, targetCities: has ? criteria.targetCities.filter((x) => x !== c) : [...criteria.targetCities, c] });
                      }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          criteria.targetCities.includes(c) ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 border border-white/10'
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!criteria.businessType}
                className="w-full mt-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all">
                Next: Set Priorities <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Priorities */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-400" /> Priority Weights
              </h2>
              <p className="text-xs text-slate-400 mb-6">Adjust how important each factor is for your franchise decisions. Total weight determines ranking.</p>

              <div className="space-y-4">
                {[
                  { key: 'footfall' as const, label: '👥 Foot Traffic', desc: 'High pedestrian traffic near the location' },
                  { key: 'lowCompetition' as const, label: '🏪 Low Competition', desc: 'Few same-type businesses nearby' },
                  { key: 'transit' as const, label: '🚌 Transit Access', desc: 'Bus stops, auto stands, station proximity' },
                  { key: 'affordability' as const, label: '💰 Affordability', desc: 'Rent within budget with good value' },
                ].map((item) => (
                  <div key={item.key} className="bg-slate-800/50 rounded-lg border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      <span className="text-sm font-bold text-blue-400">{criteria.priorityWeights[item.key]}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">{item.desc}</p>
                    <input type="range" min={0} max={100} step={5} value={criteria.priorityWeights[item.key]}
                      onChange={(e) => setCriteria({
                        ...criteria,
                        priorityWeights: { ...criteria.priorityWeights, [item.key]: +e.target.value },
                      })}
                      className="w-full accent-blue-500" />
                  </div>
                ))}
              </div>

              <button onClick={handleAnalyze} disabled={isGenerating}
                className="w-full mt-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Ranking locations...</> : <>Find Best Locations <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Adjust Criteria
              </button>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{rankedResults.length} Locations Found</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{criteria.brandName || 'Franchise'} · {criteria.businessType}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={generatePDF}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
                    <Printer className="w-3.5 h-3.5" /> Generate PDF Report
                  </button>
                </div>
              </div>

              {rankedResults.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No properties match your criteria. Try adjusting filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankedResults.map((prop, idx) => (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`rounded-xl border p-4 transition-all ${
                        idx < 3 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-800/50 border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                          idx < 3 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-white text-sm truncate">{prop.name}</h3>
                            <span className="text-lg font-bold text-blue-400 shrink-0">{prop.matchScore}/100</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">📍 {prop.locality}, {prop.city}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-[10px] text-slate-300">{prop.areaSqFt} sqft</span>
                            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-[10px] text-slate-300">₹{prop.monthlyRent.toLocaleString()}/mo</span>
                            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-[10px] text-slate-300">{prop.frontageM}m frontage</span>
                            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-[10px] text-slate-300">{prop.floorLevel}</span>
                            {prop.parkingAvailable && <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[10px] text-emerald-400">🅿️ Parking</span>}
                          </div>
                          <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
                            <span>👥 Footfall: <span className="font-semibold text-white">{prop.nearbyFootfall}</span></span>
                            <span>🏪 Competition: <span className="font-semibold text-white">{prop.competitorDensity}</span></span>
                            <span>🚌 Transit: <span className="font-semibold text-white">{prop.transitScore}</span></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-8 bg-slate-800/30 rounded-xl border border-white/10 p-4">
                <h3 className="text-sm font-bold text-white mb-1">💼 Enterprise Reports</h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  Need a comprehensive franchise expansion report with 50+ locations across multiple cities?
                  Contact us for custom B2B reports starting at ₹5,000.
                </p>
                <Link href="/franchise" className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
                  View B2B franchise pricing →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
