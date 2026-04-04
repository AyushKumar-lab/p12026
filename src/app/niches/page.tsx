'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, UtensilsCrossed, Pill, ShoppingBasket, List, MapPin, TrendingUp, ChevronRight } from 'lucide-react';

const niches = [
  {
    slug: 'restaurant',
    icon: UtensilsCrossed,
    label: 'Restaurant',
    tagline: 'Fill Tables, Not Just Space',
    description:
      'Foot traffic timing, competitor saturation, office cluster proximity, and festival-zone multipliers — every factor that actually matters for food businesses in India.',
    bullets: ['Zomato review density as footfall proxy', 'Festival & pilgrimage corridor scoring', 'Office lunch-rush proximity analysis'],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50',
    lightBorder: 'border-amber-200',
    lightText: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    slug: 'pharmacy',
    icon: Pill,
    label: 'Pharmacy',
    tagline: 'Proximity is Everything in Healthcare',
    description:
      'Hospital distance, residential prescription demand, transport connectivity, and competitor pharmacy density — built for the unique dynamics of Indian medical retail.',
    bullets: ['Hospital & clinic proximity scoring', 'Residential prescription demand', '24hr emergency demand zones'],
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-200',
    lightText: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    slug: 'kirana',
    icon: ShoppingBasket,
    label: 'Kirana Store',
    tagline: 'Your Catchment is 300 Metres. Make it Count.',
    description:
      'Residential density within 300m, organised retail threat radius, colony age, and weekly haat proximity — the hyper-local intelligence kirana owners actually need.',
    bullets: ['300m catchment residential density', 'DMart / Big Bazaar threat scoring', 'Weekly haat market competition layer'],
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    lightBg: 'bg-blue-50',
    lightBorder: 'border-blue-200',
    lightText: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
];

export default function NichesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <AnimatedLogo size={36} />
              <span className="text-xl font-bold text-slate-900">LocIntel</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/properties" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <List className="w-4 h-4" /> List Property
              </Link>
              <Link href="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md">
                Analyze Location <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6"
          >
            <MapPin className="w-4 h-4" /> Niche Intelligence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
          >
            Built for Your Business Type,{' '}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Not Just Any Business
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Generic location advice kills specific businesses. Choose your niche — we show you exactly what 
            the data says for <em>your</em> business model in Tier-2/3 India.
          </motion.p>
        </div>
      </section>

      {/* Niche Cards */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {niches.map((niche, i) => (
            <motion.div
              key={niche.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              className="group relative"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${niche.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`} />
              <div className={`relative bg-white rounded-2xl border ${niche.lightBorder} p-8 h-full flex flex-col shadow-sm group-hover:shadow-xl transition-shadow duration-300`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${niche.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <niche.icon className="w-7 h-7 text-white" />
                </div>

                {/* Label */}
                <span className={`inline-block text-xs font-bold uppercase tracking-widest ${niche.lightText} mb-1`}>{niche.label}</span>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{niche.tagline}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{niche.description}</p>

                {/* Bullets */}
                <ul className="space-y-2 mb-8 flex-1">
                  {niche.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                      <TrendingUp className={`w-4 h-4 mt-0.5 shrink-0 ${niche.lightText}`} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/niches/${niche.slug}`}
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-gradient-to-r ${niche.gradient} text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all group/btn`}
                >
                  Explore {niche.label} Intelligence
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Location?</h2>
          <p className="text-slate-400 mb-8">Skip the generic results. Go straight to a niche-filtered analysis for your business type.</p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-slate-900 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl"
          >
            <MapPin className="w-5 h-5 text-blue-500" />
            Start Your Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AnimatedLogo size={32} />
            <span className="font-bold text-slate-900">LocIntel</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} LocIntel. Based on public data. Verify on-ground before signing a lease.</p>
        </div>
      </footer>
    </main>
  );
}
