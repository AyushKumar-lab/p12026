'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Star,
  Building2,
  Users,
  Clock,
  Shield
} from 'lucide-react';

const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, ''));
  
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [numericValue]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white">
                Loc<span className="text-emerald-400">Intel</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
              <Link href="/analyze" className="btn-primary text-sm">Find Best Location</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 mb-8"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">AI-Powered Location Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Find the Perfect Location
              <br />
              <span className="gradient-text">for Your Business</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              Enter your location, tell us your business type, and get AI-powered analysis 
              of the best spots with available commercial spaces.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/analyze" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Best Location
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/properties" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                List Your Property
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { value: '500', suffix: '+', label: 'Locations Analyzed' },
                { value: '200', suffix: '+', label: 'Businesses Started' },
                { value: '98', suffix: '%', label: 'Success Rate' },
                { value: '24', suffix: '/7', label: 'AI Analysis' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our platform combines AI analysis with real-time data to help you make informed decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'AI Location Intelligence', description: 'Our algorithm analyzes competition, foot traffic, demographics, and accessibility to find your perfect spot.', color: 'emerald' },
              { icon: Search, title: 'Interactive Heat Maps', description: 'Visualize location scores with color-coded zones. Green = Best, Yellow = Good, Red = Avoid.', color: 'cyan' },
              { icon: Building2, title: 'Available Properties', description: 'Browse verified commercial spaces in recommended zones with photos, prices, and contact info.', color: 'blue' },
              { icon: TrendingUp, title: 'Real-time Analysis', description: 'Get instant analysis using OpenStreetMap data for accurate, up-to-date location intelligence.', color: 'amber' },
              { icon: Shield, title: '100% Free to Use', description: 'No hidden fees, no subscriptions. Find your perfect location without spending a dime.', color: 'rose' },
              { icon: Users, title: 'Direct Owner Contact', description: 'Connect directly with property owners via WhatsApp or email to schedule visits.', color: 'violet' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:border-slate-600 transition-colors group"
              >
                <div className={`w-12 h-12 bg-${feature.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get your location analysis in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Enter Location', description: 'Search your city or use GPS to set your target area.' },
              { step: '02', title: 'Choose Business', description: 'Select your business type, budget, and target customers.' },
              { step: '03', title: 'AI Analysis', description: 'Our algorithm analyzes the area and generates scores.' },
              { step: '04', title: 'View Properties', description: 'Browse available commercial spaces in top-rated zones.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <span className="text-2xl font-bold text-emerald-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your <span className="gradient-text">Perfect Location?</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join hundreds of entrepreneurs who found their ideal business location using our AI-powered platform.
          </p>
          <Link href="/analyze" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Start Analysis Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-lg font-bold text-white">
                Loc<span className="text-emerald-400">Intel</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} LocIntel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
