'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { Pill, ArrowRight, ArrowLeft, MapPin, Heart, Users, Bus, Clock, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

const factors = [
  { weight: 35, icon: Heart, title: 'Hospital & Clinic Proximity', description: 'Distance to nearest hospital, clinic, and diagnostic centre. This single factor predicts more than 35% of a pharmacy\'s foot traffic.', india: 'In Bhubaneswar, pharmacies within 200m of AIIMS or Capital Hospital run on near-zero marketing budgets — patients are referred automatically.' },
  { weight: 25, icon: Users, title: 'Residential Density (500m)', description: 'Households within 500m with chronic prescription demand. Senior housing and established colonies = recurring monthly revenue.', india: 'Colonies built before 2005 in Tier-2 cities have higher prescription drug demand — older residents, more chronic conditions.' },
  { weight: 18, icon: Pill, title: 'Competitor Pharmacy Count', description: 'Pharmacy is a proximity-sensitive business. Saturation within 300m matters more than saturation within 1km. Patients rarely cross the road for medicine.', india: 'Unlike restaurants, pharmacy customers don\'t "choose" — they go to the nearest open pharmacy. Being 50m closer than a competitor doubles your catchment.' },
  { weight: 12, icon: Bus, title: 'Transport Connectivity', description: 'Bus stops, auto stands within 300m. Many patients travel on foot or auto — poor transport access cuts walk-in potential sharply.', india: 'Auto stands are the key accessibility signal in Tier-2/3 cities. We use OSM data as a transit-access proxy.' },
  { weight: 6, icon: Clock, title: '24hr Emergency Demand', description: 'Proximity to ICU facilities and emergency departments. These generate night-time demand that most pharmacies miss entirely.', india: 'Only 12% of Indian pharmacies operate 24 hours. A 24hr pharmacy near an emergency ward has near-zero walk-in competition at night.' },
  { weight: 4, icon: ShieldCheck, title: 'Safety & Visibility', description: 'Well-lit, visible frontage on a main road. Patients visiting after dark need well-lit storefronts. Narrow lanes = lost customers.', india: 'Women patients prefer pharmacies on main roads they already use. Side-street locations underperform by 20–30% in comparable areas.' },
];

const risks = [
  { icon: AlertTriangle, label: 'Monsoon inaccessibility', detail: 'Low-lying zones in Cuttack and Puri district flood July–September. A flooded pharmacy loses 2–3 months of revenue annually.' },
  { icon: AlertTriangle, label: 'Jan Aushadhi Kendra threat', detail: 'Govt generic stores within 300m can undercut by 60–70% on generic drugs. Map these before choosing your location.' },
  { icon: CheckCircle2, label: 'Pilgrimage route opportunity', detail: 'Pilgrim corridors (Puri, Lingaraj) see huge spike in OTC medicine demand — pain killers, diarrhoea meds. Near these routes = double-season business.' },
  { icon: CheckCircle2, label: 'Private hospital referrals', detail: 'Private hospitals informally refer patients to nearby pharmacies. Being the closest reputable pharmacy to a private hospital = steady referral revenue.' },
];

export default function PharmacyNichePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/niches" className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-600 hover:text-emerald-600 transition-colors"><ArrowLeft className="w-4 h-4" /> All Niches</Link>
            <Link href="/analyze?type=pharmacy" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-md hover:shadow-lg transition-all">Analyze Pharmacy <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <Pill className="w-4 h-4" /> Pharmacy Intelligence
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Pharmacies Succeed in{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Proximity, Not Discovery</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Patients don't search for pharmacies — they walk to the nearest one. Our 6-factor model is built around the proximity economics of Indian medical retail.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze?type=pharmacy" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all shadow-lg">
              <MapPin className="w-5 h-5" /> Analyze a Pharmacy Location <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/niches" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 transition-all">
              <ArrowLeft className="w-5 h-5" /> See Other Niches
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: '200m', label: 'Max patient walk for medicine' }, { value: '35%', label: 'Revenue predicted by hospital proximity' }, { value: '12%', label: 'Pharmacies open 24 hours in India' }, { value: '60–70%', label: 'Generic undercut by Jan Aushadhi' }].map((s) => (
            <div key={s.label}><div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">{s.value}</div><div className="text-xs text-slate-600">{s.label}</div></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4"><TrendingUp className="w-4 h-4" /> 6-Factor Pharmacy Scoring Model</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Measure — and Why</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Weighted for the proximity-first economics of Indian pharmacy retail.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {factors.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md"><f.icon className="w-6 h-6 text-white" /></div>
                  <span className="text-2xl font-bold text-emerald-600">{f.weight}%</span>
                </div>
                <div className="h-1.5 w-full bg-emerald-100 rounded-full mb-4">
                  <motion.div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${f.weight * 2.86}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{f.description}</p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3"><p className="text-xs text-emerald-800 leading-relaxed"><span className="font-semibold">India context:</span> {f.india}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">India-Specific Risks & Opportunities</h2>
            <p className="text-slate-600 text-sm">What a generic tool will never surface — but what determines pharmacy viability.</p>
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

      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Analyze Your Pharmacy Location Now</h2>
            <p className="text-emerald-100 mb-8 text-lg">Free. No signup. 2 minutes. 15+ real data factors.</p>
            <Link href="/analyze?type=pharmacy" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-emerald-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
              <Pill className="w-6 h-6" /> Start Pharmacy Analysis <ArrowRight className="w-6 h-6" />
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
