'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Building2, TrendingUp, ArrowRight, Sparkles, Star, Activity } from 'lucide-react';

// Scroll to section helper
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Particle component for background effect
const Particle = ({ delay }: { delay: number }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 15 + Math.random() * 10;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-primary-400/40 rounded-full"
      initial={{ x: `${randomX}%`, y: '100%', opacity: 0 }}
      animate={{ 
        y: '-10%', 
        opacity: [0, 1, 1, 0],
      }}
      transition={{ 
        duration: randomDuration, 
        repeat: Infinity, 
        delay,
        ease: "linear"
      }}
      style={{
        left: `${Math.random() * 100}%`,
      }}
    />
  );
};

// Cursor trail dot
const CursorTrail = ({ x, y, index }: { x: number; y: number; index: number }) => {
  return (
    <motion.div
      className="fixed w-3 h-3 rounded-full pointer-events-none z-50 mix-blend-screen"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ 
        x: x - 6, 
        y: y - 6,
        scale: 0,
        opacity: 0,
      }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.03,
      }}
      style={{
        background: `hsl(${200 + index * 10}, 70%, 60%)`,
        boxShadow: `0 0 10px hsl(${200 + index * 10}, 70%, 60%)`,
      }}
    />
  );
};

// Animated counter component
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

// Magnetic button component
const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(position.x, springConfig);
  const y = useSpring(position.y, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.3;
    const distY = (e.clientY - centerY) * 0.3;
    setPosition({ x: distX, y: distY });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const stats = [
  { value: '50', suffix: 'K+', label: 'Business Locations Analyzed', icon: MapPin },
  { value: '12', suffix: 'K+', label: 'Properties Listed', icon: Building2 },
  { value: '98', suffix: '%', label: 'Success Rate', icon: TrendingUp },
];

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<{ x: number; y: number }[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setCursorTrail(prev => [...prev.slice(-15), { x: e.clientX, y: e.clientY }]);
    };
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Text animation - split headline into letters
  const headline1 = "Find the";
  const headline2 = "Perfect Location";
  const headline3 = "for Your Business";

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Cursor Trail */}
      {isClient && cursorTrail.map((pos, index) => (
        <CursorTrail key={`${pos.x}-${pos.y}-${index}`} x={pos.x} y={pos.y} index={cursorTrail.length - index} />
      ))}

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/30 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-400/25 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-success-400/10 to-warning-400/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Particle system */}
        {isClient && Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
        
        {/* Grid Pattern with animation */}
        <motion.div 
          className="absolute inset-0 opacity-[0.04]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2 }}
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Floating Elements with parallax */}
        {isClient && (
          <>
            <motion.div
              className="absolute top-20 left-[10%] w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ 
                x: (mousePosition.x - windowSize.width/2) * 0.02,
              }}
            >
              <MapPin className="w-8 h-8 text-primary-600" />
            </motion.div>
            
            <motion.div
              className="absolute top-40 right-[15%] w-16 h-16 bg-success-100/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
              animate={{
                y: [0, -15, 0],
                rotate: [0, -5, 0],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1 
              }}
              style={{ 
                x: (mousePosition.x - windowSize.width/2) * -0.015,
              }}
            >
              <TrendingUp className="w-7 h-7 text-success-600" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-32 left-[20%] w-14 h-14 bg-warning-100/80 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center"
              animate={{
                y: [0, -25, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2 
              }}
              style={{ 
                x: (mousePosition.x - windowSize.width/2) * 0.01,
              }}
            >
              <Building2 className="w-6 h-6 text-warning-600" />
            </motion.div>

            {/* Additional floating elements */}
            <motion.div
              className="absolute top-[60%] right-[25%] w-12 h-12 bg-purple-100/80 rounded-xl shadow-md flex items-center justify-center"
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360, 0],
              }}
              transition={{ 
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            >
              <Star className="w-5 h-5 text-purple-600" />
            </motion.div>

            <motion.div
              className="absolute top-[30%] left-[5%] w-10 h-10 bg-rose-100/80 rounded-lg shadow-sm flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Activity className="w-4 h-4 text-rose-600" />
            </motion.div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge with pulse animation */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Sparkles className="w-4 h-4 text-primary-600 relative z-10" />
              <span className="text-sm font-medium text-primary-700 relative z-10">AI-Powered Location Intelligence</span>
            </motion.div>
          </motion.div>

          {/* Animated Headline - Letter by letter */}
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            <span className="block overflow-hidden">
              {headline1.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </span>
            <span className="relative inline-block overflow-hidden">
              {headline2.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + headline1.length}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block gradient-text"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              >
                <motion.path
                  d="M2 10C50 2 100 2 150 6C200 10 250 10 298 2"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
              </motion.svg>
            </span>
            <br />
            <span className="block overflow-hidden">
              {headline3.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + headline1.length + headline2.length}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Typing animation for subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Transform gut-feeling decisions into data-driven strategies. 
            Our AI analyzes 15+ factors to find your optimal business location 
            and connects you with available commercial spaces instantly.
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <MagneticButton 
              className="btn-primary text-lg px-8 py-4 group relative overflow-hidden"
              onClick={() => scrollToSection('location-intelligence')}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Find Your Location
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
            
            <MagneticButton 
              className="btn-secondary text-lg px-8 py-4 relative overflow-hidden"
              onClick={() => scrollToSection('property-listings')}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-slate-100 via-white to-slate-100 opacity-0 group-hover:opacity-100"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                List Your Space
              </span>
            </MagneticButton>
          </motion.div>

          {/* Stats with animated counters */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center relative"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 1.2 + index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-primary-400/20 rounded-2xl blur-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                />
                <div className="relative">
                  <motion.div 
                    className="flex justify-center mb-2"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-lg">
                      <stat.icon className="w-7 h-7 text-primary-600" />
                    </div>
                  </motion.div>
                  <div className="text-4xl font-bold text-slate-900">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Dashboard Preview with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.8,
            type: "spring",
            stiffness: 50
          }}
          className="mt-20 relative"
        >
          <div className="relative max-w-5xl mx-auto" style={{ perspective: '1000px' }}>
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/20 border border-slate-200/50"
              whileHover={{ 
                y: -10,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 z-10 pointer-events-none"
                initial={{ x: '-200%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
              
              <div className="bg-white p-4">
                {/* Mock Dashboard Preview */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-danger-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-warning-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-success-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <div className="flex-1 h-8 bg-white rounded-lg shadow-sm ml-4 flex items-center px-4">
                      <Search className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-400">Search locations...</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* Map Preview with animated heat spots */}
                    <div className="col-span-2 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0">
                        <motion.div 
                          className="absolute top-1/4 left-1/4 w-32 h-32 bg-success-400/40 rounded-full blur-2xl"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 0.7, 0.4],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute top-1/2 right-1/4 w-40 h-40 bg-primary-400/40 rounded-full blur-2xl"
                          animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        />
                        <motion.div 
                          className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-warning-400/40 rounded-full blur-2xl"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.7, 0.4],
                          }}
                          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
                        />
                      </div>
                      <motion.div 
                        className="relative z-10 text-center"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                        <p className="text-slate-600 font-medium">Interactive Heat Map</p>
                      </motion.div>
                    </div>
                    
                    {/* Stats Preview with animated bars */}
                    <div className="space-y-3">
                      <motion.div 
                        className="bg-white p-4 rounded-xl shadow-sm"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="text-xs text-slate-500 mb-1">Location Score</div>
                        <div className="text-2xl font-bold text-success-600">87/100</div>
                        <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            className="h-full bg-success-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '87%' }}
                            transition={{ duration: 1.5, delay: 1 }}
                          />
                        </div>
                      </motion.div>
                      <motion.div 
                        className="bg-white p-4 rounded-xl shadow-sm"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="text-xs text-slate-500 mb-1">Foot Traffic</div>
                        <div className="text-2xl font-bold text-primary-600">2.4K</div>
                        <div className="text-xs text-success-600 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> +12% this week
                        </div>
                      </motion.div>
                      <motion.div 
                        className="bg-white p-4 rounded-xl shadow-sm"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="text-xs text-slate-500 mb-1">Competition</div>
                        <div className="text-2xl font-bold text-warning-600">Low</div>
                        <div className="text-xs text-slate-400">3 similar businesses</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative Elements with enhanced animations */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg flex items-center justify-center"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Additional floating badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 px-4 py-2 bg-success-500 text-white rounded-full shadow-lg flex items-center gap-2"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">4.9 Rating</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

