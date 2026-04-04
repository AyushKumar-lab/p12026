'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, Building2, BarChart3, TrendingUp, MapPin, CheckCircle2, DollarSign, Star } from 'lucide-react';

const useCases = [
  { icon: Building2, title: 'New Franchise Expansion', desc: 'You have 10+ outlets and are opening 50 more in a new region. LocIntel ranks every potential location by score — saving 3–6 months of broker visits and ground surveys.' },
  { icon: BarChart3, title: 'Location Risk Audit', desc: 'Internal audit of your existing 50 locations. Which are in flood-risk zones? Which face organised retail encroachment? Which have declining residential density?' },
  { icon: MapPin, title: 'City Entry Intelligence', desc: 'You want to enter Bhubaneswar or Raipur. LocIntel gives you the top 10 commercial zones ranked by score for your business type before a single site visit.' },
  { icon: TrendingUp, title: 'Franchisee Location Approval', desc: 'Your franchisees propose locations. LocIntel gives you an objective 0–100 score for each — reduce bad franchise approvals by using data, not gut feel.' },
];

const pricing = [
  { plan: 'Starter Report', price: 'Rs 5,000', per: 'per city', features: ['Top 10 locations ranked by AI score', 'Competitor density map', 'Foot traffic heat map', 'PDF report'], highlight: false },
  { plan: 'Expansion Package', price: 'Rs 25,000', per: 'per month', features: ['5 cities covered', 'Unlimited location queries', 'Custom business type scoring', 'Monthly data refresh', 'Dedicated account manager'], highlight: true },
  { plan: 'Enterprise Custom', price: 'Rs 50,000+', per: 'per year', features: ['All cities in our network', 'API access for your dev team', 'White-label PDF reports', 'Franchisee portal access', 'SLA + priority support'], highlight: false },
];

const brands = [
  'Restaurant chains (QSR, casual dining)',
  'Pharmacy chains (retail/franchise)',
  'Kirana / FMCG distribution networks',
  'Coaching institutes (Tier-2 expansion)',
  'Gym and wellness chains',
  'Clothing and fashion retail',
  'Electronics retail (Tier-2 rollout)',
];

export default function FranchisePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AnimatedLogo size={34} /><span className="font-bold text-slate-900">LocIntel</span></Link>
          <a href="mailto:locintel@gmail.com?subject=B2B Franchise Partnership" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-md hover:shadow-lg transition-all">Contact Us <ArrowRight className="w-4 h-4" /></a>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
            <Star className="w-4 h-4" /> B2B Franchise Intelligence
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Expand Your Franchise Network{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">With Data, Not Gut Feel</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            LocIntel gives franchise chains and multi-outlet businesses an AI-powered location intelligence layer for Tier-2/3 India. 
            Stop relying on brokers earning commission. Get ranked, data-driven location shortlists.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:locintel@gmail.com?subject=B2B Franchise Partnership"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-900 bg-white rounded-xl hover:shadow-xl transition-all shadow-lg">
              <DollarSign className="w-5 h-5" /> Get a Custom B2B Quote <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/analyze" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all">
              Try Free Analysis First
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-slate-100 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: 'Rs 50k–2L', label: 'B2B contract range per year' }, { value: '500', label: 'Franchise outlets = 1 deal' }, { value: '3–6 mo', label: 'Site visits saved per expansion cycle' }, { value: '5 cities', label: 'Live coverage for B2B today' }].map(s => (
            <div key={s.label}><div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{s.value}</div><div className="text-xs text-slate-600">{s.label}</div></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Use Cases</h2>
            <p className="text-slate-600 max-w-xl mx-auto">How franchises and multi-outlet brands use LocIntel.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((u, i) => (
              <motion.div key={u.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-4 shadow-md">
                  <u.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{u.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Who This Is Built For</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {brands.map((b, i) => (
              <motion.div key={b} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /><span className="text-sm text-slate-800">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">B2B Pricing</h2>
            <p className="text-slate-600">Custom pricing available for large chains. All plans include India-specific intelligence layers.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((p, i) => (
              <motion.div key={p.plan} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-7 ${p.highlight ? 'border-blue-400 bg-blue-50 shadow-xl shadow-blue-500/10 scale-105' : 'border-slate-200 bg-white shadow-sm'}`}>
                {p.highlight && <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Most Popular</div>}
                <h3 className="font-bold text-slate-900 text-lg mb-1">{p.plan}</h3>
                <div className="mb-1"><span className="text-3xl font-bold text-slate-900">{p.price}</span></div>
                <div className="text-xs text-slate-500 mb-5">{p.per}</div>
                <ul className="space-y-2 mb-7">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:locintel@gmail.com?subject=B2B Franchise Partnership"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all ${p.highlight ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  Contact Us <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Scale With Data?</h2>
            <p className="text-slate-400 mb-8">Email us with your chain name, current outlet count, and target cities. We'll send a custom proposal within 48 hours.</p>
            <a href="mailto:locintel@gmail.com?subject=B2B Franchise Partnership"
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-slate-900 bg-white rounded-xl hover:shadow-2xl transition-all shadow-xl">
              <Building2 className="w-6 h-6" /> Get a Custom Proposal <ArrowRight className="w-6 h-6" />
            </a>
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
