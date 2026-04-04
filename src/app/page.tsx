'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import {
  MapPin,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  List,
  Zap,
  Target,
  Compass,
  BarChart3,
  Users,
  Shield,
  Play,
  Quote,
  Star,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';

function MagneticButton({ children, className = '', href = '' }: { children: React.ReactNode; className?: string; href?: string }) {
  const ButtonWrapper = (
    <motion.span
      className={`inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{ButtonWrapper}</Link>;
  }
  return ButtonWrapper;
}

function GlowCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-40 blur-lg transition-all duration-500" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
      <div className="relative bg-white rounded-2xl border border-slate-200 p-6 overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        {children}
      </div>
    </motion.div>
  );
}

function StepCard({ step, title, description, icon: Icon, delay = 0 }: { step: string; title: string; description: string; icon: React.ElementType; delay?: number }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div className="relative" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
            <Icon className="w-7 h-7 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">{step}</span>
            </div>
          </div>
        </motion.div>
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm max-w-xs">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Parallax only — do not fade the whole hero with scroll; in embedded browsers /
  // odd layout timing, `scrollYProgress` can jump so opacity hits 0 and the page looks "blank".
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <main className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating gradient orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              background: `radial-gradient(circle, ${['rgba(59,130,246,0.15)', 'rgba(139,92,246,0.15)', 'rgba(6,182,212,0.15)', 'rgba(16,185,129,0.15)'][i]} 0%, transparent 70%)`,
              left: `${10 + i * 25}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <AnimatedLogo size={36} />
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">LocIntel</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {['How It Works', 'Features', 'Locations', 'Pricing'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link href="/niches" className="text-sm text-slate-600 hover:text-blue-600 transition-colors relative group">
                  Niches
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Link href="/franchise" className="text-sm text-slate-600 hover:text-blue-600 transition-colors relative group">
                  Franchise
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <MagneticButton href="/properties">
                <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm">
                  <List className="w-4 h-4" />
                  List Property
                </span>
              </MagneticButton>
              <MagneticButton href="/analyze">
                <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center z-10"
        style={{ y: heroY }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
              style={{
                width: 60 + i * 20,
                height: 60 + i * 20,
                left: `${10 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-600 text-sm font-medium mb-8 shadow-sm"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            AI-Powered Location Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Find the{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Perfect Location
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
              >
                <motion.path
                  d="M0 8 Q75 0, 150 8 T300 8"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
            <br />
            for Your Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Transform gut-feeling decisions into data-driven strategies.
            Our AI analyzes 15+ factors to find your optimal business location.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton href="/analyze">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all shadow-lg group">
                <Search className="w-5 h-5" />
                Find Your Location
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </MagneticButton>
            <MagneticButton href="/properties">
              <span className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all group">
                <Building2 className="w-5 h-5" />
                List Your Space
              </span>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <p className="text-sm text-slate-500">
              Supported cities:{' '}
              <Link href="/cities" className="underline underline-offset-4 hover:text-slate-700">
                Bhubaneswar, Cuttack, Berhampur, Sambalpur, Raipur
              </Link>
            </p>
          </motion.div>

        </div>
      </motion.section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50/50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-4 h-4" />
              </motion.span>
              Powerful Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Our platform combines AI analysis with real-time data to help you make informed decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'AI Location Intelligence', description: 'Our algorithm analyzes competition, foot traffic, demographics, and accessibility to find your perfect spot.', color: 'blue' },
              { icon: Compass, title: 'Interactive Heat Maps', description: 'Visualize location scores with color-coded zones. Green = Best, Yellow = Good, Red = Avoid.', color: 'cyan' },
              { icon: Building2, title: 'Available Properties', description: 'Browse verified commercial spaces in recommended zones with photos, prices, and contact info.', color: 'indigo' },
              { icon: BarChart3, title: 'Real-time Analysis', description: 'Get instant analysis using OpenStreetMap data for accurate, up-to-date location intelligence.', color: 'emerald' },
              { icon: Shield, title: '100% Free to Use', description: 'No hidden fees, no subscriptions. Find your perfect location without spending a dime.', color: 'rose' },
              { icon: Users, title: 'Direct Owner Contact', description: 'Connect directly with property owners via WhatsApp or email to schedule visits.', color: 'violet' },
            ].map((feature, i) => (
              <GlowCard key={feature.title} delay={i * 0.1}>
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Niches Section */}
      <section id="niches" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              🎯 Restaurants & Pharmacies First — Deep Beats Broad
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Not Generic.{' '}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Niche-Specific.
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              We go deep on restaurants, pharmacies, and kirana stores first — with India-specific factors no generic tool has. More niches coming after we master these three.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { slug: 'restaurant', emoji: '🍽️', label: 'Restaurant', tagline: 'Fill Tables, Not Just Space', color: 'amber', border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', btn: 'from-amber-500 to-orange-500', factors: ['Zomato foot traffic proxy', 'Office lunch-rush proximity', 'Festival zone multiplier'] },
              { slug: 'pharmacy', emoji: '💊', label: 'Pharmacy', tagline: 'Proximity is Everything', color: 'emerald', border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', btn: 'from-emerald-500 to-teal-500', factors: ['Hospital & clinic distance', 'Residential prescription demand', '24hr emergency zones'] },
              { slug: 'kirana', emoji: '🛒', label: 'Kirana Store', tagline: '300m Catchment. Make It Count.', color: 'blue', border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', btn: 'from-blue-500 to-indigo-500', factors: ['Residential density (300m)', 'DMart threat radius', 'Colony age & loyalty'] },
            ].map((n, i) => (
              <motion.div
                key={n.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group"
              >
                <div className={`bg-white rounded-2xl border ${n.border} p-7 h-full flex flex-col shadow-sm group-hover:shadow-lg transition-shadow`}>
                  <div className="text-4xl mb-4">{n.emoji}</div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${n.text} mb-1`}>{n.label}</span>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{n.tagline}</h3>
                  <ul className="space-y-1.5 mb-6 flex-1">
                    {n.factors.map((f) => (
                      <li key={f} className={`text-sm ${n.text} flex items-center gap-2`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <span className="text-slate-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/niches/${n.slug}`} className={`inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${n.btn} text-white text-sm font-semibold hover:shadow-md transition-all`}>
                    See {n.label} Factors <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/niches" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
              View all niche guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Get your location analysis in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Enter Location', description: 'Search your city or use GPS to set your target area.', icon: MapPin },
              { step: '2', title: 'Choose Business', description: 'Select your business type, budget, and target customers.', icon: Building2 },
              { step: '3', title: 'AI Analysis', description: 'Our algorithm analyzes the area and generates scores.', icon: BarChart3 },
              { step: '4', title: 'View Properties', description: 'Browse available commercial spaces in top-rated zones.', icon: Search },
            ].map((item, i) => (
              <StepCard key={item.step} {...item} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        </div>

        {/* Floating elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 rounded-full border border-white/10"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        <motion.div
          className="max-w-4xl mx-auto px-4 text-center relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Free for Indian MSMEs — always</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Find Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Location?
            </span>
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
            Join hundreds of entrepreneurs who found their ideal business location using our AI-powered platform.
          </p>
          <MagneticButton href="/analyze">
            <motion.span
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-slate-900 bg-white rounded-xl hover:shadow-2xl hover:shadow-white/25 transition-all shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6 text-blue-500" />
              Start Analysis Now
              <ArrowRight className="w-6 h-6" />
            </motion.span>
          </MagneticButton>
        </motion.div>
      </section>

      {/* Sample Analysis Preview */}
      <section id="sample-analysis" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Sample Analysis Preview</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Example report for <span className="font-semibold text-slate-900">MG Road, Bhubaneswar</span> (preview styling only).
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-slate-500 text-sm">Overall Score</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-5xl font-bold text-blue-600">85</span>
                <span className="text-slate-500 text-sm">/100</span>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { rank: 1, name: 'MG Road', score: 88, reason: 'High foot traffic + strong transit access' },
                  { rank: 2, name: 'Station Road', score: 80, reason: 'Balanced demand with manageable competition' },
                  { rank: 3, name: 'Lingaraj Temple Belt', score: 74, reason: 'Festival/pilgrimage multiplier improves conversion' },
                ].map((z) => (
                  <div key={z.rank} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Rank #{z.rank}</p>
                        <p className="text-sm font-semibold text-slate-900">{z.name}</p>
                      </div>
                      <p className="text-sm font-bold text-blue-600">{z.score}/100</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{z.reason}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-slate-500">
                Preview only: your real analysis is generated for your exact location and business type.
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-emerald-500/10" />
              <div className="relative">
                <p className="text-slate-300 text-sm">Map + ranked zones</p>
                <div className="mt-4 h-56 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 text-sm text-center px-3">
                  Heat map + ranked zones appear after analysis
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-white">You&apos;ll get</h3>
                  <ul className="mt-2 text-sm text-slate-300 list-disc pl-5">
                    <li>Top locations with scores</li>
                    <li>Why each zone ranks (reasoning)</li>
                    <li>Property leads in recommended zones</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors text-sm font-semibold"
                  >
                    Run analysis
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              <Play className="w-4 h-4" /> Watch It Work
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              See the{' '}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Full Flow
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              A 2-minute walkthrough of the 4-step analysis — from location search to ranked zone results.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xl aspect-video flex items-center justify-center"
          >
            {/* Placeholder — swap the div below with an <iframe> once you have the URL */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900 to-slate-900" />
            <div className="relative text-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </motion.div>
              <p className="text-white font-semibold text-lg">Demo video coming soon</p>
              <p className="text-slate-400 text-sm mt-1">Full 4-step walkthrough — Bhubaneswar analysis</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Validated by Data — Trust Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-blue-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              <FlaskConical className="w-4 h-4" /> Validated, Not Just Claimed
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              We Tested Against{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Real Outcomes
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              20 real businesses across 5 cities. We compared our predicted scores with actual 1-2 year survival outcomes. 95% accuracy.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Target, value: '95%', label: 'Backtest Accuracy', desc: '19/20 predictions correct' },
              { icon: CheckCircle2, value: '100%', label: 'Score ≥70 Survival', desc: 'High-score locations all thriving/stable' },
              { icon: Shield, value: '5', label: 'Cities Tested', desc: 'BBSR, Cuttack, Berhampur, Sambalpur, Raipur' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm"
              >
                <stat.icon className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-700">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.desc}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <MagneticButton href="/backtest">
              <span className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl shadow-md hover:shadow-lg transition-all">
                <FlaskConical className="w-4 h-4" />
                Read the Full Backtest Study
                <ArrowRight className="w-4 h-4" />
              </span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-emerald-500" /> Early Adopters
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              What{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Entrepreneurs Say
              </span>
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Real feedback from our first users — business owners who used LocIntel before signing a lease.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'I was about to pay a broker ₹40,000 to find a location for my pharmacy. LocIntel gave me better data in 2 minutes — for free.',
                name: 'Ravi Mishra',
                role: 'Pharmacy Owner',
                city: 'Bhubaneswar',
                stars: 5,
                placeholder: true,
              },
              {
                quote: 'The competitor density map showed me 7 restaurants in 300m of my target spot. I moved 500m away — much better zone. Saved my business.',
                name: 'Priya Das',
                role: 'Restaurant Owner',
                city: 'Cuttack',
                stars: 5,
                placeholder: true,
              },
              {
                quote: 'As a first-time kirana owner I had no idea about foot traffic zones. The scoring made it simple — green zone, good score, I went for it.',
                name: 'Suresh Patel',
                role: 'Kirana Store Owner',
                city: 'Raipur',
                stars: 5,
                placeholder: true,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative"
              >
                {t.placeholder && (
                  <span className="absolute top-3 right-3 text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                    Placeholder
                  </span>
                )}
                <Quote className="w-7 h-7 text-blue-200 mb-3" />
                <p className="text-slate-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} · {t.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">
            ⚠️ Testimonials above are illustrative placeholders. Replace with real user quotes once collected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <AnimatedLogo size={40} />
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">LocIntel</span>
          </motion.div>
          <div className="text-center sm:text-right">
            <p className="text-slate-600 text-sm font-medium">
              Be among our first 50 early adopters
            </p>
            <p className="text-slate-500 text-sm">
              Founder: Ayush · <a className="underline underline-offset-4 hover:text-slate-700" href="mailto:locintel.in@gmail.com">locintel.in@gmail.com</a>
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-3 mt-1 flex-wrap">
              <Link href="/about" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">About</Link>
              <Link href="/backtest" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">Backtest Study</Link>
              <Link href="/faq" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">FAQ</Link>
              <Link href="/residential" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">Find Homes</Link>
              <Link href="/franchise" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">Franchise</Link>
              <Link href="/india-intelligence" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">India Intelligence</Link>
              <Link href="/methodology" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">Methodology</Link>
              <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4">Privacy</Link>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              © {new Date().getFullYear()} LocIntel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
