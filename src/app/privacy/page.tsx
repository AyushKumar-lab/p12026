'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, Shield, AlertTriangle, Clock, Mail } from 'lucide-react';

const lastUpdated = '27 March 2026';

const sections = [
  {
    id: 'what-we-collect',
    title: '1. What We Collect',
    content: (
      <>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          LocIntel collects the minimum data required to provide the location analysis service. We do not require account creation, login, or any personal identification.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold text-slate-700 border border-slate-200">Data</th>
                <th className="text-left p-3 font-semibold text-slate-700 border border-slate-200">When Collected</th>
                <th className="text-left p-3 font-semibold text-slate-700 border border-slate-200">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Location searched (city/area name, coordinates)', 'When you run an analysis', 'To query location data and generate the score'],
                ['Business type selected', 'When you run an analysis', 'To apply business-type-specific scoring weights'],
                ['IP address', 'Automatically on every request', 'Server logs, abuse prevention, approximate region'],
                ['Device type, browser name, OS', 'Automatically via server headers', 'Performance optimization, error debugging'],
                ['Pages visited and time on page', 'Automatically via analytics', 'Understanding how users use the product'],
              ].map(([data, when, why], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-3 text-slate-700 border border-slate-200">{data}</td>
                  <td className="p-3 text-slate-600 border border-slate-200">{when}</td>
                  <td className="p-3 text-slate-600 border border-slate-200">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-800 font-medium">✅ What we do NOT collect</p>
          <p className="text-xs text-green-700 mt-1">Your name, phone number, email address, Aadhaar, PAN, or any identity document. We have no login system — no account is required to use LocIntel.</p>
        </div>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Data',
    content: (
      <ul className="space-y-3 text-sm text-slate-600">
        {[
          'To run the location analysis you requested — your search query and business type are sent to our scoring model.',
          'To improve the product — anonymous usage patterns help us understand which features are working.',
          'To prevent abuse — IP addresses are used to rate-limit excessive automated requests.',
          'We do NOT use your data for advertising, profiling, or sale to any third party — ever.',
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'third-parties',
    title: '3. Third-Party Services',
    content: (
      <>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          LocIntel uses the following third-party services to operate. When you use LocIntel, these services may also process data about your request:
        </p>
        <div className="space-y-3">
          {[
            { name: 'Vercel', purpose: 'Web hosting and serverless API functions. Your requests are processed on Vercel infrastructure (EU/US servers).', link: 'https://vercel.com/legal/privacy-policy' },
            { name: 'Mapbox', purpose: 'Geocoding (converting location names to coordinates) and map tile rendering.', link: 'https://www.mapbox.com/legal/privacy' },
            { name: 'OpenStreetMap / Overpass API', purpose: 'Free, open-source map data used to identify POIs (businesses, transport, roads) near your location.', link: 'https://wiki.osmfoundation.org/wiki/Privacy_Policy' },
            { name: 'Google Places API', purpose: 'Used to enrich POI data for supported cities (when available). Google\'s Privacy Policy applies to this data.', link: 'https://policies.google.com/privacy' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 underline underline-offset-4">Privacy Policy ↗</a>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{s.purpose}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'retention',
    title: '4. Data Retention',
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>We retain data for the minimum time necessary:</p>
        <ul className="space-y-2">
          {[
            'Search queries (location + business type): Not stored permanently. Processed in-memory and discarded after the analysis is returned.',
            'Server logs (IP address, request path, timestamp): Retained for up to 30 days for debugging and security purposes, then deleted automatically by Vercel.',
            'Anonymous analytics data (page views, feature usage): Retained for up to 12 months in aggregate, anonymized form.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-400 shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'your-rights',
    title: '5. Your Rights (IT Act 2000 & DPDP Act 2023)',
    content: (
      <div className="space-y-4 text-sm text-slate-600">
        <p>Under Indian law, you have the following rights regarding your personal data:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { right: 'Right to Know', desc: 'You can ask what data we have collected about you.' },
            { right: 'Right to Correction', desc: 'You can ask us to correct inaccurate data.' },
            { right: 'Right to Deletion', desc: 'You can request deletion of your data from our systems.' },
            { right: 'Right to Grievance Redressal', desc: 'You can raise a complaint and receive a response within 30 days.' },
          ].map((r, i) => (
            <div key={i} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-semibold text-slate-800 mb-1">{r.right}</p>
              <p className="text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        <p>To exercise any of these rights, email us at <a href="mailto:locintel.in@gmail.com" className="text-blue-600 underline underline-offset-4">locintel.in@gmail.com</a>. We will respond within 30 days.</p>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: '6. Cookies',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed">
        LocIntel uses essential cookies only — session state and authentication tokens if you are using a logged-in feature. We do not use advertising cookies, third-party tracking cookies, or remarketing pixels. Mapbox and Vercel may set performance cookies via their infrastructure; see their respective privacy policies linked in Section 3.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '7. Changes to This Policy',
    content: (
      <p className="text-sm text-slate-600 leading-relaxed">
        We will update this page if our data practices change meaningfully. The "Last Updated" date at the top will always reflect the most recent version. For significant changes, we will post a notice on the homepage. Continued use of LocIntel after updates constitutes acceptance of the revised policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '8. Contact',
    content: (
      <div className="text-sm text-slate-600 space-y-2">
        <p>For any privacy-related questions, data requests, or complaints:</p>
        <p><strong>Data Controller:</strong> Ayush (Sole Proprietor, LocIntel)</p>
        <p><strong>Location:</strong> Bhubaneswar, Odisha, India</p>
        <p><strong>Email:</strong> <a href="mailto:locintel.in@gmail.com" className="text-blue-600 underline underline-offset-4">locintel.in@gmail.com</a></p>
        <p className="text-xs text-slate-500 mt-3">Response time: within 30 days as required under the DPDP Act 2023.</p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
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
      <section className="pt-32 pb-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6"
          >
            <Shield className="w-4 h-4" /> Privacy Policy
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-3"
          >
            Privacy Policy
          </motion.h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" /> Last updated: {lastUpdated}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> IT Act 2000 · DPDP Act 2023 · IT Rules 2011
            </span>
          </div>
          <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-2xl">
            LocIntel is a free, solo-founder product. This policy is written in plain language — not legalese — because you deserve to know exactly what happens to your data when you use this tool.
          </p>

          {/* Formal policy placeholder */}
          <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-semibold text-blue-800 mb-1">📋 Formal Policy (Paste Here)</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Visit <a href="https://www.privacypolicies.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">privacypolicies.com</a>, generate your free policy for LocIntel, and replace this block with the output. The plain-language sections below remain as a human-readable supplement.
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-6 border-y border-slate-100 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Contents</p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="scroll-mt-20"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{s.title}</h2>
              {s.content}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-slate-50 border-t border-slate-200 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Privacy question?</h2>
          <p className="text-slate-500 text-sm mb-5">The founder reads every email personally — no support ticket queue.</p>
          <a
            href="mailto:locintel.in@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Mail className="w-4 h-4" /> locintel.in@gmail.com
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={32} />
            <span className="font-bold text-slate-900">LocIntel</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/about" className="hover:text-slate-700">About</Link>
            <Link href="/faq" className="hover:text-slate-700">FAQ</Link>
            <Link href="/methodology" className="hover:text-slate-700">Methodology</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
