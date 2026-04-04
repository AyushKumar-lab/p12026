'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import { ArrowRight, ChevronDown, HelpCircle, Shield, MapPin, BarChart3, Building2, Zap } from 'lucide-react';

const faqs = [
  {
    category: 'Accuracy',
    icon: BarChart3,
    color: 'blue',
    questions: [
      {
        q: 'How accurate is the location score?',
        a: "Our current model is rule-based using 15 publicly available data signals from OpenStreetMap, Zomato listings, transport layer data, and India-specific heuristics. It is directionally accurate — meaning zones that score 75+ are genuinely better positioned than zones scoring 40. However, it is not validated against outcome data yet. A full 20-business backtest in Bhubaneswar is underway. Results will be published on the Methodology page by Month 2. Treat the score as a serious starting point, not a final answer — always verify on-ground before signing a lease.",
      },
      {
        q: "Why doesn't the score match what I see on the ground?",
        a: 'OSM coverage in Tier-2/3 India is approximately 50–70% complete. If your zone has new construction, a recently opened market, or amenities that haven\'t been mapped on OpenStreetMap yet, the score will underestimate it. Conversely, closed businesses that still appear on OSM will inflate it. We are actively integrating Google Places API (free $200/month credit) to patch these gaps. Until then, treat low coverage areas with this caveat in mind.',
      },
    ],
  },
  {
    category: 'Cities & Coverage',
    icon: MapPin,
    color: 'emerald',
    questions: [
      {
        q: 'Which cities does LocIntel currently support?',
        a: 'We have validated data coverage for: Bhubaneswar, Cuttack, Berhampur, Sambalpur (all Odisha), and Raipur (Chhattisgarh). These 5 cities are our current live cities. You can technically run an analysis for any location, but data quality outside these 5 cities is lower and less tested. We publish our expansion roadmap at /cities — next cities are Visakhapatnam and Vijayawada (Month 3 target).',
      },
      {
        q: 'Can I use this for Mumbai, Delhi, or other metros?',
        a: "You can run an analysis, but we don't recommend making decisions based on it yet. OSM coverage in metros is better, but our scoring weights were calibrated for Tier-2/3 India markets. Metro-specific calibration (higher rent affordability weight, different competition thresholds) is on the roadmap for Year 2 when we have backtest data from those cities.",
      },
    ],
  },
  {
    category: 'Data & Privacy',
    icon: Shield,
    color: 'violet',
    questions: [
      {
        q: 'What data do you collect about me?',
        a: "Minimal. We collect the location you search and the business type you select — this is required to run the analysis. We also log anonymous usage (page views, analysis runs) for product improvement. We do not sell your data to any third party. We do not require account creation. Your search history is not stored permanently. We use Vercel's infrastructure which processes requests in the EU/US — we are working on India-region configuration for DPDP compliance.",
      },
      {
        q: 'Is my data safe when I use the analysis tool?',
        a: 'The location you search is sent to our Next.js API route (hosted on Vercel) which calls OpenStreetMap\'s Overpass API and our scoring model. No personally identifying information is transmitted. We do not store individual location search records permanently. We use HTTPS everywhere. For complete details, a formal privacy policy is in progress at /privacy.',
      },
    ],
  },
  {
    category: 'vs Competitors',
    icon: Building2,
    color: 'amber',
    questions: [
      {
        q: 'How is LocIntel different from 99acres or MagicBricks?',
        a: "Completely different purpose. 99acres and MagicBricks are property listing platforms — they help you find available spaces to rent or buy. LocIntel is a location intelligence platform — it tells you whether a given area is a good fit for your business type based on 15 demand, competition, accessibility, and risk signals. We answer 'Is this a good zone for a kirana store?' not 'What properties are for rent here?' — though we're building the property feature too.",
      },
      {
        q: 'Why not just use Google Maps?',
        a: "Google Maps shows you what is in an area — it doesn't score or rank it for your specific business type. LocIntel takes 15 factors specific to your business (competition density for that type, foot traffic proxies, residential catchment, accessibility) and produces a single weighted score. It also surfaces India-specific intelligence Google Maps never will: which zones get a festival traffic multiplier, flood risk zones, pilgrimage corridor proximity, haat market days. Google Maps is a tool. LocIntel is a decision engine.",
      },
      {
        q: 'Why not just hire a local broker?',
        a: "A broker charges ₹25,000–2,00,000. They know their city well — but they have a financial incentive to close the deal, not find you the optimal location. They don't use structured data. They don't compare 10 zones side by side against 15 quantified factors. LocIntel is free, unbiased, and shows you the data behind every recommendation. Use both if you can — use LocIntel to shortlist 2–3 zones, then use a broker to negotiate the actual lease.",
      },
    ],
  },
  {
    category: 'Pricing & Limits',
    icon: Zap,
    color: 'rose',
    questions: [
      {
        q: 'Is LocIntel really free? What is the catch?',
        a: "Yes — the core analysis tool is and will remain free for individual business owners. The honest answer on sustainability: we plan to launch a premium PDF report (₹99–299) for users who want a shareable, formatted analysis to show investors or partners. We also have a B2B plan for franchise chains and property developers who need bulk analysis. The free tool is not a bait-and-switch — it funds itself through B2B, not through paywalling the individual user.",
      },
    ],
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  violet: 'bg-violet-100 text-violet-700 border-violet-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
};

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={`rounded-xl border ${open ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-white'} overflow-hidden transition-colors duration-200`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-start justify-between gap-3 p-5"
      >
        <span className={`font-semibold text-sm leading-snug ${open ? 'text-blue-700' : 'text-slate-900'}`}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5"
        >
          <ChevronDown className={`w-4 h-4 ${open ? 'text-blue-500' : 'text-slate-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
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
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" /> Honest Answers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-slate-600 text-lg"
          >
            No marketing speak. Straight answers about accuracy, data, pricing, and how we compare to alternatives.
          </motion.p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((category, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.05 }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold mb-5 ${colorMap[category.color]}`}>
                <category.icon className="w-4 h-4" />
                {category.category}
              </div>
              <div className="space-y-3">
                {category.questions.map((item, qi) => (
                  <FAQItem key={qi} q={item.q} a={item.a} defaultOpen={ci === 0 && qi === 0} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <HelpCircle className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Still have a question?</h2>
            <p className="text-slate-600 mb-6 text-sm">
              The founder reads every email. No support ticket queues. No chatbot.
            </p>
            <a
              href="mailto:locintel.in@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:shadow-lg transition-all shadow-md"
            >
              Email locintel.in@gmail.com
            </a>
            <p className="text-xs text-slate-400 mt-4">
              You can also read the full scoring methodology at{' '}
              <Link href="/methodology" className="underline underline-offset-4 hover:text-slate-600">
                /methodology
              </Link>
            </p>
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
            <Link href="/about" className="hover:text-slate-700">About</Link>
            <Link href="/methodology" className="hover:text-slate-700">Methodology</Link>
            <a href="mailto:locintel.in@gmail.com" className="hover:text-slate-700">locintel.in@gmail.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
