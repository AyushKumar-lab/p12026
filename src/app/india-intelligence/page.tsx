'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, Calendar, MapPin, ShoppingBasket, Car, Flame, Star, Globe } from 'lucide-react';

const layers = [
  {
    icon: Calendar,
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    lightBg: 'bg-orange-50',
    lightBorder: 'border-orange-200',
    lightText: 'text-orange-700',
    title: 'Festival Foot Traffic Calendar',
    tagline: 'Diwali week = 5–8× normal foot traffic. Does your location know that?',
    description: 'Indian business seasonality is unlike anywhere else in the world. A zone near a Durga Puja ground becomes a different market for 10 days. LocIntel maps festival-driven demand multipliers by zone so you know if your location is in a seasonal goldmine or desert.',
    facts: [
      'Diwali week foot traffic 5–8× normal in commercial zones',
      'Rath Yatra (Puri) — 1M+ visitors in 3 days along the route',
      'Durga Puja pandal zones see 4× restaurant and retail demand',
      'Makar Mela (Puri) — 500K+ pilgrims January–February',
    ],
    status: 'Planned — Month 2',
  },
  {
    icon: Globe,
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-500',
    lightBg: 'bg-amber-50',
    lightBorder: 'border-amber-200',
    lightText: 'text-amber-700',
    title: 'Pilgrimage Corridor Intelligence',
    tagline: '30M+ pilgrims/year visit Odisha. Zero mapping tools cover this demand.',
    description: 'Jagannath Puri, Konark, and Lingaraj Temple draw more visitors than most Indian cities have residents. Businesses on these corridors operate in a permanent high-demand zone. No competitor maps this. LocIntel will be the first.',
    facts: [
      'Jagannath Puri: 30M+ annual visitors — India\'s #2 pilgrimage site',
      'Puri–Bhubaneswar–Konark triangle: year-round pilgrim demand',
      'Rath Yatra corridor: 3km of route = highest single-day foot traffic in Odisha',
      'Lingaraj Temple zone (Bhubaneswar): permanent 2–3× demand multiplier',
    ],
    status: 'Planned — Month 2',
  },
  {
    icon: ShoppingBasket,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    lightBg: 'bg-blue-50',
    lightBorder: 'border-blue-200',
    lightText: 'text-blue-700',
    title: 'Weekly Haat Market Calendar',
    tagline: 'Haats move Rs 5,000 crore/week in rural India. None of it is mapped digitally.',
    description: 'Weekly markets (haats) are the economic heartbeat of Tier-2/3 India. They create predictable weekly foot traffic spikes and also act as competitive threats for kirana stores nearby. This dataset does not exist anywhere online. LocIntel will build it — crowdsourced, gamified, first-mover.',
    facts: [
      'Every district in Odisha has 10–30 weekly haats — none mapped digitally',
      'Haat days bring 40–60% more foot traffic to surrounding 500m radius',
      'Kirana stores within 300m of a haat see 20% weekly revenue spike',
      'First digital haat database = permanent data moat no competitor can replicate quickly',
    ],
    status: 'Planned — Month 3 (crowdsourced)',
  },
  {
    icon: Car,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    lightBg: 'bg-teal-50',
    lightBorder: 'border-teal-200',
    lightText: 'text-teal-700',
    title: 'Auto Stand Proximity Layer',
    tagline: 'In Tier-2 India, an auto stand within 200m doubles your accessible customer base.',
    description: 'Public transport in Tier-2/3 cities means auto-rickshaws. Auto stands are the de-facto last-mile transit hubs. A shop 300m from the nearest auto stand loses customers who simply won\'t walk that far. LocIntel maps every auto stand using OSM + JustDial data.',
    facts: [
      'Auto stands within 200m = last-mile accessibility for non-bike users',
      '60%+ of Tier-2 city shoppers use autos as primary commercial transit',
      'OSM has 70%+ auto stand coverage in Bhubaneswar, Cuttack, Berhampur',
      'JustDial fills the gap — "Auto Stand" search per city gives near-complete coverage',
    ],
    status: 'Planned — Month 1',
  },
];

export default function IndiaIntelligencePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all">Analyze Location <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
            <Flame className="w-4 h-4" /> India-Only Intelligence
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Intelligence That Only{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">India Has</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            No global tool understands festival foot traffic, pilgrimage corridors, weekly haat markets, or auto-stand proximity. 
            These are uniquely Indian signals — and no competitor has them. LocIntel is building every one.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-xl transition-all shadow-lg">
              <MapPin className="w-5 h-5" /> Analyze Your Location <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/niches" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-orange-300 transition-all">
              See Niche Intelligence
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-orange-50 border-y border-orange-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: '0', label: 'Competitors with festival traffic data' }, { value: '30M+', label: 'Annual Odisha pilgrims (unmapped)' }, { value: '4 layers', label: 'India-unique intelligence signals' }, { value: 'First', label: 'Digital haat market database in India' }].map(s => (
            <div key={s.label}><div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">{s.value}</div><div className="text-xs text-slate-600">{s.label}</div></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {layers.map((layer, i) => (
            <motion.div key={layer.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl border ${layer.lightBorder} p-8 shadow-sm`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${layer.gradient} flex items-center justify-center shadow-md`}>
                    <layer.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{layer.title}</h2>
                      <p className={`text-sm font-medium ${layer.lightText} mt-0.5`}>{layer.tagline}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${layer.lightBg} ${layer.lightText} border ${layer.lightBorder}`}>{layer.status}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{layer.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {layer.facts.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <Star className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${layer.lightText}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">No Competitor Has This. You Can.</h2>
            <p className="text-orange-100 mb-8 text-lg">These layers are being built into every LocIntel analysis. Get early access — analyze your location now.</p>
            <Link href="/analyze" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-orange-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
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
