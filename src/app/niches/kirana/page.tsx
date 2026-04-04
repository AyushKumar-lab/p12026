'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ShoppingBasket, ArrowRight, ArrowLeft, MapPin, Home, Store, Bus, Calendar, AlertTriangle, CheckCircle2, TrendingUp, ShoppingCart } from 'lucide-react';

const factors = [
  { weight: 35, icon: Home, title: 'Residential Density (300m)', description: 'Households within 300m = your core catchment. This is the most important single factor for kirana stores — they live and die by hyper-local residential density.', india: 'In Tier-2 cities, kirana stores that sit at the entrance of a colony of 200+ households rarely need to advertise. Walk-in demand is automatic and recurring.' },
  { weight: 25, icon: ShoppingCart, title: 'Organised Retail Threat Radius', description: 'Distance to DMart, Big Bazaar, Reliance Fresh, and SPAR. Within 500m of these stores, kirana margins collapse on branded goods. Within 200m, footfall shifts permanently.', india: 'When a DMart opened in Patia, Bhubaneswar, kiranas within 400m saw 30–40% revenue drops within 6 months. This is the single biggest existential risk.' },
  { weight: 18, icon: Store, title: 'Competitor Kirana Count (300m)', description: 'Too many kiranas = price competition and thin margins. Zero kiranas in a residential area = blue ocean. Optimal is 1-2 kiranas serving a colony of 200+ households.', india: 'Colony-scale economics: 200 households × Rs 3,000/month household grocery spend = Rs 600K/month addressable market per colony.' },
  { weight: 12, icon: Bus, title: 'Morning Commuter Access', description: 'Bus stops and main roads within 100m. Morning commuters buy bread, eggs, and snacks before work. This habit alone can drive 20–30% of a kirana\'s daily revenue.', india: 'In Odisha, the 6–9am window accounts for 35% of daily kirana sales. Being on the commute route (not inside the colony lane) captures this window.' },
  { weight: 6, icon: Calendar, title: 'Weekly Haat Market Proximity', description: 'Nearby haat (weekly market) on fixed days creates temporary competition + opportunity. Customers buy bulk staples at haats — but come to kiranas for daily top-ups.', india: 'In Sambalpur and Berhampur, weekly haats draw 80% of rural shoppers on haat days. Kiranas within 500m see a 20% weekly spike from haat visitors.' },
  { weight: 4, icon: Home, title: 'Colony Age & Stability', description: 'Established colonies (pre-2010 construction) have loyal, habitual customers. New developments have high churn and no established shopping habits yet.', india: 'In Bhubaneswar, older colonies like Saheed Nagar and Jayadev Vihar produce 3x higher kirana revenue per household vs newer satellite townships.' },
];

const risks = [
  { icon: AlertTriangle, label: 'DMart within 500m', detail: 'This is the #1 kirana killer. Branded goods margins vanish. You must differentiate on fresh produce, credit, and hyper-local convenience — not on price.' },
  { icon: AlertTriangle, label: 'New residential development', detail: 'Empty apartments = no customers for 12–24 months. Check construction completion timelines before betting on a location in a developing zone.' },
  { icon: CheckCircle2, label: 'Colony entry point positioning', detail: 'A kirana at the main entry/exit of a residential colony intercepts 80% of foot traffic passively. Corner plots on colony gates are gold.' },
  { icon: CheckCircle2, label: 'Credit relationship moat', detail: 'Offering monthly credit to residents is a kirana\'s deepest competitive moat. An organised retail store cannot do this. Location + credit = very hard to displace.' },
];

export default function KiranaNichePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/niches" className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"><ArrowLeft className="w-4 h-4" /> All Niches</Link>
            <Link href="/analyze?type=kirana" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md hover:shadow-lg transition-all">Analyze Kirana <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <ShoppingBasket className="w-4 h-4" /> Kirana Intelligence
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Your Catchment is 300 Metres.{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Make It Count.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            A kirana's entire business model is hyper-local. The right 300m radius makes you a colony institution. The wrong one makes you a slow closure. Our model is built for this reality.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze?type=kirana" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all shadow-lg">
              <MapPin className="w-5 h-5" /> Analyze a Kirana Location <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/niches" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 transition-all">
              <ArrowLeft className="w-5 h-5" /> See Other Niches
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-blue-50 border-y border-blue-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: '300m', label: 'Core kirana catchment radius' }, { value: '63M', label: 'Kirana stores across India' }, { value: '500m', label: 'DMart danger radius for margins' }, { value: '35%', label: 'Daily revenue in 6–9am window' }].map((s) => (
            <div key={s.label}><div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{s.value}</div><div className="text-xs text-slate-600">{s.label}</div></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4"><TrendingUp className="w-4 h-4" /> 6-Factor Kirana Scoring Model</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Measure — and Why</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Weighted for the hyper-local economics of Indian kirana retail.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {factors.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md"><f.icon className="w-6 h-6 text-white" /></div>
                  <span className="text-2xl font-bold text-blue-600">{f.weight}%</span>
                </div>
                <div className="h-1.5 w-full bg-blue-100 rounded-full mb-4">
                  <motion.div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${f.weight * 2.86}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{f.description}</p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3"><p className="text-xs text-blue-800 leading-relaxed"><span className="font-semibold">India context:</span> {f.india}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">India-Specific Risks & Opportunities</h2>
            <p className="text-slate-600 text-sm">What determines whether a kirana thrives or gets squeezed out in 12 months.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {risks.map((r, i) => (
              <motion.div key={r.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex gap-3 p-5 rounded-xl border ${r.icon === AlertTriangle ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                <r.icon className={`w-5 h-5 mt-0.5 shrink-0 ${r.icon === AlertTriangle ? 'text-red-500' : 'text-green-600'}`} />
                <div>
                  <p className={`font-semibold text-sm mb-1 ${r.icon === AlertTriangle ? 'text-red-800' : 'text-green-800'}`}>{r.label}</p>
                  <p className={`text-xs leading-relaxed ${r.icon === AlertTriangle ? 'text-red-700' : 'text-green-700'}`}>{r.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Analyze Your Kirana Location Now</h2>
            <p className="text-blue-100 mb-8 text-lg">Free. No signup. 2 minutes. See the DMart threat, residential density, and colony catchment before you sign.</p>
            <Link href="/analyze?type=kirana" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
              <ShoppingBasket className="w-6 h-6" /> Start Kirana Analysis <ArrowRight className="w-6 h-6" />
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
