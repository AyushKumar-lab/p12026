'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, BarChart3, TrendingUp, CheckCircle2, AlertTriangle, Target, Star } from 'lucide-react';

const factors = [
  // Competitor saturation
  { name: 'Competitor Density (similar businesses)', weight: 20, desc: 'Count of same-type businesses within ~300m–1km. Sourced from OSM + JustDial where available.' },
  { name: 'Competition Penalty (saturation dampener)', weight: 5, desc: 'Penalizes zones with high competitor presence, adjusted per business type.' },

  // Demand signals
  { name: 'Foot Traffic Proxy (restaurants/cafes/fast food)', weight: 13, desc: 'Food outlet density in the zone as a public-demand proxy. Sourced from OSM public listings.' },
  { name: 'Transit-derived Footfall Proxy (bus/rail access)', weight: 7, desc: 'Transit availability near the zone (bus stops + rail/metro stops). Sourced from OSM transport features.' },

  // Accessibility & mobility
  { name: 'Auto-stand / Parking Proximity', weight: 6, desc: 'Accessibility signal using parking/auto-stand presence around the zone (OSM-based heuristics).' },
  { name: 'Road Access / Streets Connectivity', weight: 5, desc: 'Road connectivity proxy: proximity to main street segments and access points (OSM road network).' },
  { name: 'Schools & Colleges Proximity', weight: 4, desc: 'Presence of schools/colleges/universities to estimate predictable weekday customer flows.' },

  // Residential demand
  { name: 'Residential Buildings Density', weight: 10, desc: 'Density of residential buildings within the radius. Derived from OSM building footprint + India urban heuristics.' },
  { name: 'Household Catchment Stability', weight: 5, desc: 'Stability proxy for residential catchments (older, denser neighborhoods score higher). ' },

  // Commercial ecosystem
  { name: 'Offices & Professional Activity', weight: 5, desc: 'Office/professional premises presence (OSM offices + office buildings).' },
  { name: 'Anchor Retail (malls/supermarkets)', weight: 5, desc: 'Presence of malls/supermarkets as a proxy for established commercial activity (OSM retail listings).' },

  // Business-type differentiation & risk
  { name: 'Organised Retail Threat Radius', weight: 5, desc: 'Distance to organized retail clusters (e.g., DMart/Big Bazaar/Reliance Fresh). Used more strongly for kirana.' },
  { name: 'Festival / Pilgrimage Multiplier', weight: 5, desc: 'Proximity to pilgrimage routes and festival grounds. Odisha-specific references from ASI + Odisha Tourism.' },
  { name: 'Flood Risk Penalty', weight: 3, desc: 'Flood-risk penalty using NDMA-style hazard overlays (risk zones get deduction).' },

  // Data quality
  { name: 'Data Freshness (OSM edit recency)', weight: 2, desc: 'Recency of OSM edits in the area as a proxy for local data quality and coverage.' },
];

const scoreRanges = [
  { range: '75–100', label: 'Strong Location', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500', desc: 'High confidence. Proceed to on-ground verification. Target survival rate: 70%+' },
  { range: '50–74', label: 'Viable Location', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', desc: 'Good potential with manageable risks. Review specific weak factors before signing.' },
  { range: '30–49', label: 'Risky Location', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500', desc: 'Proceed with caution. At least 2 major factors are unfavourable for your business type.' },
  { range: 'Under 30', label: 'High-Risk Location', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500', desc: 'Multiple critical factors fail. Consider neighbouring zones or a different city area.' },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">Analyze Location <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" /> How LocIntel Scores Locations
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Our Scoring Methodology —{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Zero Black Box</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            We say "AI analyzes 15+ factors." Here's exactly what those factors are, how they're weighted, 
            and what data sources we use. Full transparency — because you're making a financial decision with this score.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" /> Current model: rule-based. XGBoost ML model in training — launching Month 2.
          </motion.div>
        </div>
      </section>

      {/* Target success metric */}
      <section className="py-12 bg-blue-50 border-y border-blue-100 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Our Success Metric Target</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">We are building toward a validated success metric. Here is our target and current backtest status.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Target, label: 'Target', value: 'Locations scoring 75+', sub: 'to show 70%+ 2-year survival rate in backtest', color: 'text-blue-700', bg: 'bg-blue-100' },
              { icon: CheckCircle2, label: 'Current Status', value: 'Backtesting in progress', sub: '20 known Bhubaneswar businesses being tested against model scores', color: 'text-amber-700', bg: 'bg-amber-100' },
              { icon: Star, label: 'Publish Date', value: 'Month 2', sub: 'Full accuracy validation study published on this page after backtest', color: 'text-green-700', bg: 'bg-green-100' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-5 text-center border border-blue-200/50`}>
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest ${s.color} mb-1`}>{s.label}</div>
                <div className="font-bold text-slate-900 mb-1">{s.value}</div>
                <div className="text-xs text-slate-600">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring factors */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-3">The 15 Scoring Factors — Full List</h2>
            <p className="text-slate-600 text-sm">
              Weights are for the general model. Business-type scoring adjusts these per niche (restaurant, pharmacy, kirana).
            </p>
          </motion.div>
          <div className="space-y-4">
            {factors.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">{f.name}</h3>
                      <span className="text-sm font-bold text-blue-600">{f.weight}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2">
                      <motion.div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        initial={{ width: 0 }} whileInView={{ width: `${f.weight * 4}%` }} viewport={{ once: true }} transition={{ delay: i * 0.07 + 0.3, duration: 0.7 }} />
                    </div>
                    <p className="text-sm text-slate-600">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-5 text-sm text-slate-600">
            <strong>Data disclaimer:</strong> All scores are based on publicly available data (OpenStreetMap, Zomato public listings, JustDial, NDMA). 
            This is a decision support tool — not a guarantee. Always verify on-ground before signing a commercial lease.
          </div>
        </div>
      </section>

      {/* Score interpretation */}
      <section className="py-16 bg-slate-50 px-4 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How to Interpret Your Score</h2>
          <div className="space-y-4">
            {scoreRanges.map((s, i) => (
              <motion.div key={s.range} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-xl border ${s.border} ${s.bg} p-5`}>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-20 text-center">
                    <div className={`text-xl font-bold ${s.color}`}>{s.range}</div>
                  </div>
                  <div className={`font-bold text-sm px-3 py-1 rounded-full ${s.bg} ${s.color} border ${s.border}`}>{s.label}</div>
                  <p className="text-sm text-slate-700 flex-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-4">See Your Location's Score — Free</h2>
            <p className="text-blue-100 mb-8">Now that you know how we score, put your location to the test.</p>
            <Link href="/analyze" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
              <TrendingUp className="w-6 h-6" /> Analyze My Location <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
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
