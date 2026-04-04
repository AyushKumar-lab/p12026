'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, MapPin, CheckCircle2, XCircle, Sparkles, TrendingUp, DollarSign, Clock } from 'lucide-react';

const comparisons = [
  { feature: 'AI location scoring (0–100)', locintel: true, broker: false, note: 'Brokers give opinions based on commission, not data' },
  { feature: 'Competitor density map', locintel: true, broker: false, note: 'Brokers rarely disclose how many competitors are nearby' },
  { feature: 'Festival foot traffic data', locintel: true, broker: false, note: 'Brokers have no systematic seasonal data' },
  { feature: 'Flood risk layer', locintel: true, broker: false, note: 'Brokers never mention flood risk — it affects lease closure' },
  { feature: 'Pilgrimage corridor scoring', locintel: true, broker: false, note: 'Only LocIntel maps pilgrim routes as demand signals' },
  { feature: 'Auto stand proximity', locintel: true, broker: false, note: 'Brokers don\'t measure last-mile accessibility data' },
  { feature: 'Zomato foot traffic proxy', locintel: true, broker: false, note: 'Review density is the best free footfall proxy in Tier-2' },
  { feature: 'Cost to the business owner', locintel: 'Free', broker: 'Rs 25,000–2,00,000', note: '' },
  { feature: 'Financial incentive to find best location', locintel: true, broker: false, note: 'A broker earns commission on closure — not on your success' },
  { feature: 'Available 24/7', locintel: true, broker: false, note: 'Analysis on demand, no appointment needed' },
  { feature: 'Covers Tier-2/3 cities', locintel: true, broker: false, note: 'Most professional brokers focus on Tier-1 metro demand' },
  { feature: 'Unbiased recommendation', locintel: true, broker: false, note: 'Brokers earn more from higher-rent properties' },
];

const savings = [
  { label: 'Typical broker commission (Tier-1)', value: 'Rs 1,00,000–2,00,000' },
  { label: 'Typical broker commission (Tier-2/3)', value: 'Rs 25,000–75,000' },
  { label: 'LocIntel basic analysis', value: 'Free' },
  { label: 'LocIntel premium PDF report', value: 'Rs 299' },
];

export default function WhyLocIntelPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all">Analyze for Free <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            <DollarSign className="w-4 h-4" /> Save Rs 25,000–2,00,000
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Why LocIntel Beats a{' '}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Property Broker</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            A broker charges Rs 25,000–2,00,000 to recommend a location. Their incentive is to close a deal — not to find 
            you the best location. LocIntel is free, unbiased, and powered by data a broker doesn't have.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-xl transition-all shadow-lg">
              <Sparkles className="w-5 h-5" /> Analyze Free — Skip the Broker <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The core problem */}
      <section className="py-16 px-4 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl border border-red-200 p-6">
              <h3 className="font-bold text-red-700 text-lg mb-3">⚠️ The Broker Problem</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Earns commission on lease closure — incentivised to close, not to find best location</li>
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />No systematic competitor density data — gives subjective opinion</li>
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Never mentions flood risk or monsoon inaccessibility — it could kill the deal</li>
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />No festival or seasonal foot traffic data — doesn't know about Diwali multipliers</li>
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Earns more from higher-rent properties — recommends what benefits them</li>
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />Charges Rs 25,000–2,00,000 for advice that may be wrong</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl border border-green-200 p-6">
              <h3 className="font-bold text-green-700 text-lg mb-3">✅ The LocIntel Solution</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Zero commission — we earn nothing from your lease decision</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Competitor density mapped within 300m/500m/1km with exact counts</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Flood risk from NDMA data — know before you sign</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Festival foot traffic multipliers for Diwali, Rath Yatra, Durga Puja zones</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Algorithm has no financial preference — low-rent zones score the same as high-rent</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Free basic analysis. Rs 299 for full PDF report.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Feature-by-Feature Comparison</h2>
            <p className="text-slate-600">LocIntel vs a traditional property broker</p>
          </motion.div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-slate-900 text-white text-sm font-semibold px-6 py-4">
              <div>Feature</div>
              <div className="text-center text-green-400">LocIntel</div>
              <div className="text-center text-red-400">Property Broker</div>
            </div>
            {comparisons.map((row, i) => (
              <motion.div key={row.feature} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-3 px-6 py-4 border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div>
                  <p className="text-sm font-medium text-slate-900">{row.feature}</p>
                  {row.note && <p className="text-xs text-slate-500 mt-0.5">{row.note}</p>}
                </div>
                <div className="flex items-center justify-center">
                  {typeof row.locintel === 'boolean'
                    ? row.locintel ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />
                    : <span className="text-sm font-bold text-green-600">{row.locintel}</span>}
                </div>
                <div className="flex items-center justify-center">
                  {typeof row.broker === 'boolean'
                    ? row.broker ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />
                    : <span className="text-sm font-bold text-red-600">{row.broker}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="py-16 bg-green-50 px-4 border-y border-green-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">What You Save</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {savings.map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-green-200 p-5">
                <div className="text-sm text-slate-600 mb-1">{s.label}</div>
                <div className={`text-xl font-bold ${s.value === 'Free' ? 'text-green-600' : s.value.startsWith('Rs 299') ? 'text-blue-600' : 'text-red-600'}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-6">Based on industry-standard broker commission rates in India (MSME sector, 2025).</p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Make a Data-Driven Decision. Free.</h2>
            <p className="text-green-100 mb-8">Skip the Rs 1 lakh broker fee. Get AI location intelligence instantly.</p>
            <Link href="/analyze" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-green-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
              <TrendingUp className="w-6 h-6" /> Analyze My Location Free <ArrowRight className="w-6 h-6" />
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
