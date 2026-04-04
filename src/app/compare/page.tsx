'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, CheckCircle2, XCircle, MapPin, BarChart3, TrendingUp } from 'lucide-react';

const competitors = ['99acres', 'MagicBricks', 'JustDial', 'Broker'];

const rows = [
  { feature: 'AI location score (0–100)', locintel: true, c: [false, false, false, false], note: '' },
  { feature: 'Competitor density map', locintel: true, c: [false, false, false, false], note: 'No competitor shows how many rivals surround a location' },
  { feature: 'Festival foot traffic layer', locintel: true, c: [false, false, false, false], note: 'Unique to India — zero tools have this' },
  { feature: 'Pilgrimage corridor data', locintel: true, c: [false, false, false, false], note: 'First in India' },
  { feature: 'Flood risk layer (NDMA)', locintel: true, c: [false, false, false, false], note: 'Critical for Odisha/Bihar/Bengal' },
  { feature: 'Auto-stand proximity scoring', locintel: true, c: [false, false, false, false], note: 'Last-mile accessibility for Tier-2/3' },
  { feature: 'Haat market proximity', locintel: true, c: [false, false, false, false], note: 'Crowdsourced dataset — being built now' },
  { feature: 'Business type–specific scoring', locintel: true, c: [false, false, false, false], note: 'Restaurant ≠ Pharmacy ≠ Kirana' },
  { feature: 'Covers Tier-2/3 cities', locintel: true, c: [false, false, true, false], note: '99acres/MagicBricks focus on metro supply' },
  { feature: 'Shows commercial listings', locintel: true, c: [true, true, true, true], note: '' },
  { feature: 'Basic use is free', locintel: true, c: [false, false, true, false], note: 'JustDial is free but not a location intelligence tool' },
  { feature: 'Unbiased (no commission)', locintel: true, c: [false, false, false, false], note: 'All others earn from listings or deals' },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">Analyze Free <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" /> LocIntel vs Competitors
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            LocIntel Wins on Every Metric.{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Users Just Don't Know It Yet.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            99acres lists properties. MagicBricks lists properties. JustDial lists businesses. None of them answer the real question: 
            <strong> "Will my business succeed at this location?"</strong> LocIntel does.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-xl transition-all shadow-lg">
              <MapPin className="w-5 h-5" /> Try the Difference Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-5 py-4 min-w-[200px]">Feature</th>
                  <th className="text-center px-4 py-4 bg-blue-600 min-w-[100px]">LocIntel ✦</th>
                  {competitors.map(c => <th key={c} className="text-center px-4 py-4 min-w-[90px]">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr key={row.feature} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{row.feature}</p>
                      {row.note && <p className="text-xs text-slate-500 mt-0.5">{row.note}</p>}
                    </td>
                    <td className="px-4 py-3 text-center bg-blue-50/50">
                      {typeof row.locintel === 'boolean'
                        ? <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto" />
                        : <span className="font-bold text-blue-600">{row.locintel}</span>}
                    </td>
                    {row.c.map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        {val ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-red-300 mx-auto" />}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">Comparison based on publicly available feature sets. Last reviewed March 2026.</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">What Each Tool is Actually For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '99acres', purpose: 'Property listings for buyers and tenants', gap: 'Doesn\'t answer: "Will my business work here?"' },
              { name: 'MagicBricks', purpose: 'Property search and price trends', gap: 'No competitor density, no AI scoring' },
              { name: 'JustDial', purpose: 'Business directory — who is near you', gap: 'Shows competitors. Doesn\'t say if you can beat them.' },
              { name: 'LocIntel', purpose: 'AI location intelligence for business decisions', gap: 'Answers the question the others avoid.' },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-5 ${t.name === 'LocIntel' ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <h3 className={`font-bold mb-2 ${t.name === 'LocIntel' ? 'text-blue-700' : 'text-slate-900'}`}>{t.name}</h3>
                <p className="text-xs text-slate-700 mb-2">{t.purpose}</p>
                <p className={`text-xs italic ${t.name === 'LocIntel' ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>{t.gap}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Others List Properties. We Score Locations.</h2>
            <p className="text-blue-100 mb-8">Try LocIntel free — no signup, 2 minutes, real data.</p>
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
