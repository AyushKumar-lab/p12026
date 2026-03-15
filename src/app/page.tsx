'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/Logo';
import {
  MapPin,
  Search,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Building2,
  List,
  Zap,
  Target,
  Compass,
  BarChart3,
  Users,
  Clock,
  Shield,
} from 'lucide-react';

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
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
}

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
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
        style={{ y: heroY, opacity: heroOpacity }}
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: '500', suffix: '+', label: 'Locations Analyzed', icon: MapPin },
              { value: '200', suffix: '+', label: 'Businesses Started', icon: Building2 },
              { value: '98', suffix: '%', label: 'Success Rate', icon: TrendingUp },
              { value: '24', suffix: '/7', label: 'AI Analysis', icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
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
            <span className="text-sm">Join 500+ successful businesses</span>
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
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} LocIntel. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
