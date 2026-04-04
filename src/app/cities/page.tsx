'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, MapPin, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const cities = [
  { name: 'Bhubaneswar', state: 'Odisha', status: 'live', tier: 'HQ City', coverage: '95%', details: 'Full OSM + Google Places coverage. Pilgrimage corridor data. Festival calendar active.' },
  { name: 'Cuttack', state: 'Odisha', status: 'live', tier: 'Tier-2', coverage: '85%', details: 'Adjacent to Bhubaneswar. Dense commercial zones. High MSME density.' },
  { name: 'Berhampur', state: 'Odisha', status: 'live', tier: 'Tier-2', coverage: '75%', details: 'South Odisha commercial hub. Strong textile and retail market.' },
  { name: 'Sambalpur', state: 'Odisha', status: 'live', tier: 'Tier-2', coverage: '75%', details: 'Industrial and commercial hub. Growing MSME base.' },
  { name: 'Raipur', state: 'Chhattisgarh', status: 'live', tier: 'State Capital', coverage: '70%', details: 'High MSME density. Fastest-growing city in central India.' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', status: 'month3', tier: 'Tier-1', coverage: '—', details: 'Port city. Large commercial zones. Fast growth trajectory.' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', status: 'month3', tier: 'Tier-1', coverage: '—', details: 'Commercial hub. River market. High MSME activity.' },
  { name: 'Patna', state: 'Bihar', status: 'month4', tier: 'State Capital', coverage: '—', details: 'Massive MSME density. Severely underserved by location tools.' },
  { name: 'Ranchi', state: 'Jharkhand', status: 'month4', tier: 'State Capital', coverage: '—', details: 'Growing commercial zones. Mining economy MSME base.' },
  { name: 'Nagpur', state: 'Maharashtra', status: 'month6', tier: 'Tier-2', coverage: '—', details: 'Geographic centre of India. Major logistics and MSME hub.' },
  { name: 'Indore', state: 'Madhya Pradesh', status: 'month6', tier: 'Tier-2', coverage: '—', details: 'Fastest growing Tier-2 city. Cleanest city in India 7 years running.' },
  { name: 'Surat', state: 'Gujarat', status: 'month6', tier: 'Tier-2', coverage: '—', details: 'Diamond and textile hub. Huge MSME density.' },
  { name: 'Coimbatore', state: 'Tamil Nadu', status: 'month8', tier: 'Tier-2', coverage: '—', details: 'Manufacturing MSME capital of South India.' },
  { name: 'Lucknow', state: 'Uttar Pradesh', status: 'month8', tier: 'Tier-1', coverage: '—', details: 'North India gateway city. Large commercial zone.' },
  { name: 'Pune', state: 'Maharashtra', status: 'year2', tier: 'Metro', coverage: '—', details: 'Large enough for LocIntel premium tier.' },
  { name: 'Chennai', state: 'Tamil Nadu', status: 'year2', tier: 'Metro', coverage: '—', details: 'Large enough for LocIntel premium tier.' },
  { name: 'Hyderabad', state: 'Telangana', status: 'year2', tier: 'Metro', coverage: '—', details: 'Tech + MSME overlap. Premium market.' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  live:    { label: 'Live Now',   color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200', dot: 'bg-green-500' },
  month3:  { label: 'Month 3',   color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200',  dot: 'bg-blue-500' },
  month4:  { label: 'Month 4',   color: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-200',dot: 'bg-indigo-500' },
  month6:  { label: 'Month 6',   color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200', dot: 'bg-amber-500' },
  month8:  { label: 'Month 8',   color: 'text-orange-700', bg: 'bg-orange-50',  border: 'border-orange-200',dot: 'bg-orange-500' },
  year2:   { label: 'Year 2',    color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200', dot: 'bg-slate-400' },
};

export default function CitiesPage() {
  const liveCities = cities.filter(c => c.status === 'live');
  const comingCities = cities.filter(c => c.status !== 'live');

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
            <MapPin className="w-4 h-4" /> City Coverage & Roadmap
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Which Cities Does{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">LocIntel Cover?</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            We start deep — not broad. 5 cities with high-quality data beats 50 cities with thin data. 
            Here is exactly where we are live, and where we are going.
          </motion.p>
        </div>
      </section>

      <section className="py-10 bg-blue-50 border-y border-blue-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: '5', label: 'Cities live now' }, { value: '17', label: 'Cities on roadmap' }, { value: '4,000+', label: 'Tier-2/3 towns in India' }, { value: 'Depth', label: 'Our strategy — not breadth' }].map(s => (
            <div key={s.label}><div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{s.value}</div><div className="text-xs text-slate-600">{s.label}</div></div>
          ))}
        </div>
      </section>

      {/* Live cities */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Live Now — 5 Cities
          </h2>
          <p className="text-slate-600 text-sm mb-8">Full AI scoring, competitor density, and map analysis available.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {liveCities.map((city, i) => {
              const cfg = statusConfig[city.status];
              return (
                <motion.div key={city.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border ${cfg.border} ${cfg.bg} p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{city.name}</h3>
                      <p className="text-xs text-slate-500">{city.state} · {city.tier}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mb-3">{city.details}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Data coverage</span>
                    <span className="text-sm font-bold text-green-600">{city.coverage}</span>
                  </div>
                  <div className="h-1.5 w-full bg-green-100 rounded-full mt-1">
                    <div className="h-1.5 bg-green-500 rounded-full" style={{ width: city.coverage }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Roadmap */}
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" /> Coming Soon — 12 More Cities
          </h2>
          <p className="text-slate-600 text-sm mb-8">Expanding depth-first. Each city requires 200+ labeled data points before launch.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingCities.map((city, i) => {
              const cfg = statusConfig[city.status];
              return (
                <motion.div key={city.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{city.name}</h3>
                      <p className="text-xs text-slate-500">{city.state} · {city.tier}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-slate-600">{city.details}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-amber-50 border-y border-amber-100 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-amber-800 mb-2">Don't See Your City?</h3>
          <p className="text-amber-700 text-sm mb-4">We're expanding based on user demand. WhatsApp us your city name and business type — we'll prioritize cities with the most requests.</p>
          <a href="https://wa.me/91XXXXXXXXXX?text=Hi+I+want+LocIntel+in+my+city" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors">
            Request My City on WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your City is Live. Analyze Now.</h2>
            <p className="text-blue-100 mb-8">Free analysis for Bhubaneswar, Cuttack, Berhampur, Sambalpur, and Raipur.</p>
            <Link href="/analyze" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
              <MapPin className="w-6 h-6" /> Analyze My Location <ArrowRight className="w-6 h-6" />
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
