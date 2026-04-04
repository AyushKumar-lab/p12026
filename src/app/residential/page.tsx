'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { scoreResidentialListings, getAverageRents, type ResidentialScore } from '@/lib/residentialData';
import { ArrowRight, MapPin, Building2, Home, Clock, IndianRupee, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';

const TYPES = ['All', '1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room'] as const;
const FURNISHED = ['All', 'furnished', 'semi-furnished', 'unfurnished'] as const;

export default function ResidentialPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <ResidentialContent />
    </Suspense>
  );
}

function ResidentialContent() {
  const params = useSearchParams();
  const lat = parseFloat(params.get('lat') || '0');
  const lng = parseFloat(params.get('lng') || '0');
  const city = params.get('city') || '';
  const budgetParam = parseInt(params.get('budget') || '15000', 10);

  const hasLocation = lat !== 0 && lng !== 0;

  const [budget, setBudget] = useState(budgetParam);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [furnishedFilter, setFurnishedFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const scores = useMemo(() => {
    if (!hasLocation) return [];
    return scoreResidentialListings(lat, lng, budget, 15);
  }, [lat, lng, budget, hasLocation]);

  const filtered = useMemo(() => {
    let result = scores;
    if (typeFilter !== 'All') result = result.filter((s) => s.listing.type === typeFilter);
    if (furnishedFilter !== 'All') result = result.filter((s) => s.listing.furnished === furnishedFilter);
    return result;
  }, [scores, typeFilter, furnishedFilter]);

  const avgRents = useMemo(() => {
    if (!city) return {};
    return getAverageRents(city);
  }, [city]);

  // No location — show landing page
  if (!hasLocation) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
            <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all">Find Location <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </nav>

        <section className="pt-32 pb-20 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
          <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <Home className="w-4 h-4" /> Residential Intelligence
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Find Your Business Location.{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">Then Your Home.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Run a business location analysis first. Then click &quot;Find Homes&quot; to see scored residential listings near your chosen commercial zone — with commute time, affordability, and neighbourhood quality.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl hover:shadow-xl transition-all shadow-lg">
                <MapPin className="w-5 h-5" /> Analyze a Location First <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/list-property" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-300 transition-all">
                <Building2 className="w-5 h-5" /> List a Residential Property
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Rent ranges */}
        <section className="py-16 bg-slate-50 px-4 border-y border-slate-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Rent Ranges — All Cities</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: '1BHK', range: '₹2,500–₹7,500/mo', emoji: '🏠' },
                { type: '2BHK', range: '₹4,000–₹15,000/mo', emoji: '🏡' },
                { type: '3BHK', range: '₹7,000–₹22,000/mo', emoji: '🏘️' },
                { type: 'PG/Room', range: '₹1,800–₹4,500/mo', emoji: '🛏️' },
              ].map((r) => (
                <div key={r.type} className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
                  <div className="text-2xl mb-2">{r.emoji}</div>
                  <div className="font-bold text-slate-900">{r.type}</div>
                  <div className="text-sm text-indigo-600 font-semibold mt-1">{r.range}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-8 bg-white">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={32} /><span className="font-bold text-slate-900">LocIntel</span></Link>
            <p className="text-slate-500 text-sm">Based on public data. Verify on-ground before signing a lease.</p>
          </div>
        </footer>
      </main>
    );
  }

  // ── Has location: show scored residential results ──
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <AnimatedLogo size={28} />
            <span className="text-base font-bold text-white">Loc<span className="text-blue-400">Intel</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/analyze" className="text-slate-400 hover:text-blue-400 text-xs flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Analysis
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16 pb-8 px-3 sm:px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold">Homes Near Your Business Zone</h1>
          </div>
          <p className="text-xs text-slate-400">
            {filtered.length} listings within 15km of ({lat.toFixed(4)}, {lng.toFixed(4)}) · Sorted by residential score
          </p>
        </div>

        {/* Budget slider */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300">Monthly budget</span>
            <span className="text-sm font-bold text-indigo-400">₹{budget.toLocaleString()}</span>
          </div>
          <input type="range" min={2000} max={30000} step={500} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>₹2K</span><span>₹30K</span></div>
        </div>

        {/* Filters toggle */}
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 mb-3 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" /> {showFilters ? 'Hide filters' : 'Show filters'}
        </button>

        {showFilters && (
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 mb-4 space-y-3">
            <div>
              <span className="text-[10px] text-slate-500 mb-1.5 block">Type</span>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${typeFilter === t ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 mb-1.5 block">Furnished</span>
              <div className="flex flex-wrap gap-1.5">
                {FURNISHED.map((f) => (
                  <button key={f} onClick={() => setFurnishedFilter(f)}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all capitalize ${furnishedFilter === f ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No listings match your filters. Try adjusting budget or filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.slice(0, 30).map((s, idx) => (
              <motion.div key={s.listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                className="bg-slate-900/50 border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-white">{s.listing.locality}</span>
                      {s.listing.verified && <VerifiedBadge />}
                    </div>
                    <p className="text-[10px] text-slate-500">{s.listing.city} · {s.listing.type} · {s.listing.areaSqft} sqft · {s.listing.furnished}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-lg font-bold ${s.total >= 70 ? 'text-emerald-400' : s.total >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {s.total}
                    </div>
                    <div className="text-[9px] text-slate-500">/100</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <IndianRupee className="w-3 h-3 text-indigo-400 mx-auto mb-0.5" />
                    <div className="text-xs font-bold text-white">₹{s.listing.monthlyRent.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">/month</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <Clock className="w-3 h-3 text-emerald-400 mx-auto mb-0.5" />
                    <div className="text-xs font-bold text-white">{s.commuteMinutes} min</div>
                    <div className="text-[9px] text-slate-500">commute</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <IndianRupee className="w-3 h-3 text-amber-400 mx-auto mb-0.5" />
                    <div className="text-xs font-bold text-white">₹{s.listing.deposit.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">deposit</div>
                  </div>
                </div>

                {/* Score breakdown mini-bar */}
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-800">
                  <div className="bg-indigo-500 rounded-full" style={{ width: `${s.commuteScore * 0.3}%` }} title={`Commute: ${s.commuteScore}`} />
                  <div className="bg-emerald-500 rounded-full" style={{ width: `${s.affordabilityScore * 0.2}%` }} title={`Affordability: ${s.affordabilityScore}`} />
                  <div className="bg-amber-500 rounded-full" style={{ width: `${(s.groceryScore + s.transportScore + s.safetyScore + s.medicalScore + s.internetScore) * 0.1}%` }} title="Infrastructure" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-slate-500">Commute {s.commuteScore} · Afford {s.affordabilityScore} · Infra {Math.round((s.groceryScore + s.transportScore) / 2)}</span>
                  {s.listing.monthlyRent <= budget && <span className="text-[9px] text-emerald-400 font-medium">Within budget ✓</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 flex gap-3">
          <Link href="/list-property" className="flex-1 py-3 text-center text-sm font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-colors">
            List Your Property
          </Link>
          <Link href="/analyze" className="flex-1 py-3 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">
            New Analysis
          </Link>
        </div>
      </div>
    </main>
  );
}
