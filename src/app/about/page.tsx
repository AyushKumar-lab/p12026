'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedLogo } from '@/components/Logo';
import {
  ArrowRight,
  MapPin,
  Mail,
  Github,
  Linkedin,
  MessageCircle,
  Zap,
  Target,
  Heart,
  FlaskConical,
  Database,
  Map,
  Brain,
  Users,
  Building2,
} from 'lucide-react';

const timeline = [
  {
    year: 'The Problem',
    title: 'Why LocIntel Exists',
    desc: '40% of Indian MSMEs fail within 2 years — and wrong location is the #1 cause. A broker charges ₹25,000–2,00,000 and has a financial incentive to close, not to find you the best spot. I wanted to change that.',
  },
  {
    year: 'The Data',
    title: 'Building the Intelligence Layer',
    desc: 'I spent months mapping OpenStreetMap data, Zomato signals, transport layers, residential density, and India-specific factors like pilgrimage corridors and festival traffic multipliers — data no broker ever uses.',
  },
  {
    year: 'The Mission',
    title: 'Free for Every Indian MSME',
    desc: 'LocIntel is and will remain free for individual business owners. Our model is B2B (franchise chains, property aggregators) — which means the tool that helps you most stays free.',
  },
];

const values = [
  { icon: Target, title: 'Radical Transparency', desc: 'Every score factor is published. No black box. You should always know WHY a location scores what it does.' },
  { icon: Zap, title: 'India-First Intelligence', desc: 'Festival traffic. Pilgrimage corridors. Haat markets. Auto-stand proximity. Data that matters in Bhubaneswar, not San Francisco.' },
  { icon: Heart, title: 'Founder-Level Accountability', desc: 'One person, one mission. No VC pressure. No dark patterns. If the data quality is poor, I say so — right on the results page.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={34} />
            <span className="font-bold text-slate-900">LocIntel</span>
          </Link>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md"
          >
            Analyze Location <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6"
          >
            <MapPin className="w-4 h-4" /> The Person Behind LocIntel
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          >
            Built by someone who{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              saw the problem
            </span>{' '}
            firsthand
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            LocIntel is a solo founder project from Bhubaneswar, Odisha — built on the belief that India's 63 million small business owners deserve the same data intelligence that large retail chains use.
          </motion.p>
        </div>
      </section>

      {/* Founder Card */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 h-28 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
              />
            </div>
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 mb-6">
                <div className="relative w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src="/founder-avatar.png"
                    alt="Ayush — Founder of LocIntel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-slate-900">Ayush</h2>
                  <p className="text-slate-500 text-sm">Founder &amp; Solo Developer · Bhubaneswar, Odisha</p>
                  <div className="flex items-center gap-3 mt-2">
                    <a
                      href="mailto:locintel.in@gmail.com"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> locintel.in@gmail.com
                    </a>
                    <a
                      href="https://wa.me/91XXXXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">
                I&apos;m Ayush — a developer from Bhubaneswar building tools that combine open data, AI, and India-specific intelligence to help small business owners make better decisions. LocIntel started as a personal project after seeing a family friend lose their savings on a wrong location decision — one that a broker had highly recommended.
              </p>
              <p className="text-slate-700 leading-relaxed">
                I&apos;m not a data scientist or a VC-backed startup. I&apos;m one person with a laptop, a Vercel account, and a conviction that the 63 million MSMEs in India deserve better tools than gut feeling and expensive brokers.
              </p>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800 font-medium">⚠️ Honest Disclaimer</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  LocIntel uses rule-based scoring with public OSM data, augmented by an XGBoost model trained on 300+ labeled examples across 5 cities. Scores are a decision support tool, not a guarantee. Always verify on-ground before signing a lease.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What I've Built */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            What I&apos;ve Built{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">So Far</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Map, value: '5', label: 'Cities Covered', sub: 'Odisha + Chhattisgarh' },
              { icon: Database, value: '250+', label: 'Residential Listings', sub: 'Seed data across 5 cities' },
              { icon: Brain, value: '15+', label: 'AI Scoring Factors', sub: 'Competition, transit, rent, risk' },
              { icon: FlaskConical, value: '95%', label: 'Backtest Accuracy', sub: '20-business validation' },
              { icon: Building2, value: '20', label: 'Business Types', sub: 'Restaurant to coaching center' },
              { icon: MapPin, value: '14', label: 'India-Unique Layers', sub: 'Festivals, floods, haats, autos' },
              { icon: Users, value: '0', label: 'VC Dollars Raised', sub: 'Bootstrapped, not VC-backed' },
              { icon: Target, value: '₹0', label: 'Cost to You', sub: 'Free for individual MSMEs' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center"
              >
                <stat.icon className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs font-medium text-slate-700 mt-0.5">{stat.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-8">
            <Link
              href="/backtest"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <FlaskConical className="w-4 h-4" /> See Backtest Study
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Target className="w-4 h-4" /> See Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Why it exists — Timeline */}
      <section className="py-16 bg-slate-50 px-4 border-y border-slate-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            The Story in{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">3 Chapters</span>
          </h2>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-blue-500/25">
                    {i + 1}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2" />}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">{item.year}</p>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">What This Project Stands For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-4">Have a question or feedback?</h2>
            <p className="text-blue-100 mb-8 text-sm max-w-xl mx-auto">
              I personally read every email. If you tried the tool and found something wrong, or if you want to share a success story — I want to hear it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:locintel.in@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-blue-700 bg-white rounded-xl hover:shadow-xl transition-all shadow-lg"
              >
                <Mail className="w-5 h-5" /> Email Ayush
              </a>
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white border-2 border-white/40 rounded-xl hover:border-white/70 transition-all"
              >
                Try the Tool <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={32} />
            <span className="font-bold text-slate-900">LocIntel</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/backtest" className="hover:text-slate-700">Backtest Study</Link>
            <Link href="/faq" className="hover:text-slate-700">FAQ</Link>
            <Link href="/methodology" className="hover:text-slate-700">Methodology</Link>
            <a href="mailto:locintel.in@gmail.com" className="hover:text-slate-700">locintel.in@gmail.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
