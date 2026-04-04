'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import {
  UtensilsCrossed, ArrowRight, ArrowLeft, MapPin, Users, Building2,
  Star, Calendar, Car, AlertTriangle, CheckCircle2, TrendingUp
} from 'lucide-react';

const factors = [
  {
    weight: 30,
    icon: Users,
    title: 'Competitor Density',
    description: 'How many restaurants exist within 300m / 500m / 1km of your location. High saturation = price wars and thin margins, especially for new entrants.',
    india: 'Street food zones near colleges in Bhubaneswar can have 40+ food stalls in 300m. A sit-down restaurant here competes differently than a QSR.',
    score: 'green',
  },
  {
    weight: 25,
    icon: Star,
    title: 'Foot Traffic Proxy',
    description: 'Zomato review count density in the zone is the best free proxy for foot traffic in Indian Tier-2/3 cities. High reviews = high footfall zone.',
    india: 'Zomato data for Cuttack is 3x more complete than Google Maps data in the same zones. We prioritise it.',
    score: 'blue',
  },
  {
    weight: 18,
    icon: Building2,
    title: 'Office Cluster Proximity',
    description: 'IT parks, government offices, and business districts within 500m are the primary driver of the high-value weekday lunch rush.',
    india: 'Office workers in Odisha rarely cross 400m for lunch. Being the closest restaurant to a cluster is more valuable than being 600m away from two clusters.',
    score: 'indigo',
  },
  {
    weight: 12,
    icon: Users,
    title: 'Residential Population (1km)',
    description: 'Households within 1km drive dinner and weekend demand. 1BHK/2BHK density = family dinners. PG colonies = daily demand at low price points.',
    india: 'Satellite townships around Bhubaneswar (Patia, Nayapalli) have residential density 3x the city average — high dinner demand, underserved by restaurants.',
    score: 'cyan',
  },
  {
    weight: 10,
    icon: Calendar,
    title: 'Festival Zone Multiplier',
    description: 'Zones on pilgrimage corridors (Puri, Lingaraj, Konark) or near festival grounds see 5-8x foot traffic spikes during Rath Yatra, Durga Puja, Diwali.',
    india: 'A restaurant near Lingaraj Temple, Bhubaneswar is essentially two businesses: a regular restaurant 10 months/year and a high-volume food stall during Shivratri week.',
    score: 'amber',
  },
  {
    weight: 5,
    icon: Car,
    title: 'Parking & Auto Access',
    description: 'Auto stand proximity (from OSM) and main road frontage. Restaurants on narrow lanes lose 30-40% of potential walk-in customers in Tier-2 cities.',
    india: "Auto stands within 200m = last-mile accessibility for non-bike users. Essential in cities where two-wheelers don't dominate.",
    score: 'slate',
  },
];

const risks = [
  { icon: AlertTriangle, label: 'Monsoon months (July–September)', detail: 'Odisha zones flood. Footfall drops 50–70% in low-lying areas. Check NDMA flood maps before signing.' },
  { icon: AlertTriangle, label: 'Student colony seasonality', detail: 'College areas go dead in May–June. Annual revenue calculation must account for 2-month dip.' },
  { icon: AlertTriangle, label: 'Ghost kitchen vs dine-in mix', detail: 'High Swiggy/Zomato delivery zones score differently. A ghost kitchen in a residential area can outperform a dine-in in a busy street.' },
  { icon: CheckCircle2, label: 'Festival corridor opportunity', detail: 'Puri–Bhubaneswar–Konark triangle. 30M+ annual pilgrims. Restaurants within 500m of the route capture significant spillover demand.' },
];

function FactorCard({ factor, i }: { factor: typeof factors[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
          <factor.icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-amber-500">{factor.weight}%</span>
      </div>
      {/* Weight bar */}
      <div className="h-1.5 w-full bg-amber-100 rounded-full mb-4">
        <motion.div
          className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${factor.weight * 3.33}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
        />
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{factor.title}</h3>
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{factor.description}</p>
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
        <p className="text-xs text-amber-800 leading-relaxed"><span className="font-semibold">India context:</span> {factor.india}</p>
      </div>
    </motion.div>
  );
}

export default function RestaurantNichePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={34} />
            <span className="font-bold text-slate-900">LocIntel</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/niches" className="hidden sm:inline-flex items-center gap-1 text-sm text-slate-600 hover:text-amber-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Niches
            </Link>
            <Link href="/analyze?type=restaurant" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all shadow-md">
              Analyze Restaurant Location <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full blur-2xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6"
          >
            <UtensilsCrossed className="w-4 h-4" /> Restaurant Intelligence
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
          >
            Find a Restaurant Location That{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Fills Tables, Not Just Space
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Restaurants fail at a 60% rate in India in the first 2 years. The #1 reason is wrong location. 
            Our 6-factor restaurant scoring model is built specifically for Indian food business dynamics.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/analyze?type=restaurant"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:shadow-xl hover:shadow-amber-500/30 transition-all shadow-lg"
            >
              <MapPin className="w-5 h-5" /> Analyze a Restaurant Location <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/niches"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-amber-300 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> See Other Niches
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="py-10 bg-amber-50 border-y border-amber-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '60%', label: 'Restaurant failure rate in India (2yr)' },
            { value: '#1', label: 'Cause: wrong location choice' },
            { value: '5–8×', label: 'Festival foot traffic multiplier' },
            { value: '400m', label: 'Max lunch walk distance (office workers)' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-1">{s.value}</div>
              <div className="text-xs text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring Factors */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" /> Our 6-Factor Restaurant Scoring Model
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Measure — and Why</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Each factor is weighted based on its real-world impact on restaurant revenue in Tier-2/3 Indian cities.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {factors.map((f, i) => <FactorCard key={f.title} factor={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* India-specific risks */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">India-Specific Risks & Opportunities</h2>
            <p className="text-slate-600 text-sm">What no generic tool will tell you — but what decides whether your restaurant survives.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {risks.map((r, i) => (
              <motion.div key={r.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex gap-3 p-5 rounded-xl border ${r.icon === AlertTriangle ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}
              >
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Analyze Your Restaurant Location Now</h2>
            <p className="text-amber-100 mb-8 text-lg">Free. No signup. Takes 2 minutes. Based on 15+ real data factors — not a broker's opinion.</p>
            <Link href="/analyze?type=restaurant"
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-amber-700 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl"
            >
              <UtensilsCrossed className="w-6 h-6" /> Start Restaurant Analysis <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={32} /><span className="font-bold text-slate-900">LocIntel</span>
          </Link>
          <p className="text-slate-500 text-sm">Based on public data. Verify on-ground before signing a lease.</p>
        </div>
      </footer>
    </main>
  );
}
