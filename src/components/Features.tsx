'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Brain, 
  MapPin, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap,
  BarChart3,
  Target,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Location Intelligence',
    description: 'Our algorithm analyzes 15+ data points including demographics, foot traffic, competition density, and growth potential to recommend optimal locations.',
    color: 'primary',
    stats: '98% accuracy',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MapPin,
    title: 'Interactive Heat Maps',
    description: 'Visualize location scores with color-coded heat maps. Green zones indicate high potential, yellow for moderate, and red areas to avoid.',
    color: 'success',
    stats: '50K+ locations',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Potential Estimator',
    description: 'Get accurate revenue projections based on similar businesses in the area, local spending patterns, and market trends.',
    color: 'warning',
    stats: 'Real-time data',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Demographic Analysis',
    description: 'Deep insights into local population - age distribution, income levels, education, and lifestyle preferences matched to your business type.',
    color: 'primary',
    stats: 'Census data',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Shield,
    title: 'Verified Property Listings',
    description: 'All commercial spaces are verified with photo documentation, ownership proof, and real-time availability status.',
    color: 'success',
    stats: '100% verified',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Smart algorithm instantly matches your business profile with suitable properties based on budget, size, and location preferences.',
    color: 'warning',
    stats: '< 2 seconds',
    gradient: 'from-rose-500 to-pink-600',
  },
];

// 3D Tilt Card Component
const TiltCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600 border-blue-200',
    success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-100 text-amber-600 border-amber-200',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className="group relative h-full"
    >
      <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200/60 h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl">
        {/* Animated gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.05 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
          initial={{ x: '-200%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Glow effect */}
        <motion.div
          className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
          style={{ transform: 'translateZ(-1px)' }}
        />
        
        {/* Icon with floating animation */}
        <motion.div 
          className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]} border-2`}
          animate={isHovered ? {
            y: [0, -8, 0],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <feature.icon className="w-8 h-8" />
          
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-current"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={isHovered ? {
              scale: [1, 1.2, 1.4],
              opacity: [0.5, 0.2, 0],
            } : {}}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          {feature.description}
        </p>

        {/* Stats Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${colorClasses[feature.color as keyof typeof colorClasses]} bg-opacity-50`}>
          <Target className="w-3 h-3" />
          {feature.stats}
        </div>

        {/* Arrow indicator */}
        <motion.div
          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10, y: 10 }}
          whileHover={{ x: 0, y: 0 }}
        >
          <ArrowUpRight className="w-5 h-5 text-slate-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Animated number for stats
const AnimatedNumber = ({ value, label, icon: Icon, delay }: { value: string; label: string; icon: any; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center relative group"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-primary-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <motion.div 
          className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-primary-400" />
        </motion.div>
        <motion.div 
          className="text-3xl lg:text-4xl font-bold text-white mb-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2 }}
        >
          {value}
        </motion.div>
        <div className="text-primary-200 text-sm">{label}</div>
      </div>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-success-50 rounded-full blur-3xl opacity-50"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-200 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6 border border-primary-100"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
            </motion.div>
            <span className="text-sm font-medium text-primary-700">Powerful Features</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Everything You Need to Find the{' '}
            <span className="gradient-text">Perfect Location</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Our comprehensive platform combines cutting-edge AI with real-time market data 
            to help you make informed business location decisions.
          </motion.p>
        </motion.div>

        {/* Features Grid with 3D Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          {features.map((feature, index) => (
            <TiltCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-transparent to-success-600/20"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedNumber value="15+" label="Data Points Analyzed" icon={Brain} delay={0.6} />
            <AnimatedNumber value="50K+" label="Locations Mapped" icon={MapPin} delay={0.7} />
            <AnimatedNumber value="12K+" label="Active Listings" icon={Target} delay={0.8} />
            <AnimatedNumber value="<2s" label="Match Response Time" icon={Clock} delay={0.9} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
