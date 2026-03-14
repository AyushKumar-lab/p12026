'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  Store, 
  Search, 
  MapPin, 
  MessageSquare, 
  HandshakeIcon,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const steps = [
  {
    icon: Store,
    title: 'Tell Us About Your Business',
    description: 'Select your business category, investment capacity, target customers, and preferred city or area.',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Search,
    title: 'AI Analyzes Optimal Locations',
    description: 'Our algorithm processes 15+ data points including demographics, foot traffic, competition, and growth potential.',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: MapPin,
    title: 'Explore Recommended Zones',
    description: 'View color-coded heat maps. Click on green zones to see detailed area reports and revenue estimates.',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: MessageSquare,
    title: 'Connect with Landlords',
    description: 'Browse verified property listings, compare options, and contact landlords directly through our platform.',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    icon: HandshakeIcon,
    title: 'Close the Deal',
    description: 'Schedule visits, negotiate terms, sign digital agreements, and pay security deposit through our secure gateway.',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
];

// Step Card Component with 3D effect
const StepCard = ({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="relative flex flex-col items-center"
    >
      {/* Connector Line (hidden on mobile, visible on lg) */}
      {!isLast && (
        <motion.div 
          className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20px)] h-1"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
          style={{ originX: 0 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-slate-200 via-primary-300 to-slate-200 rounded-full" />
          {/* Animated dot on line */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full shadow-lg"
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
          />
        </motion.div>
      )}

      {/* Step Number Badge */}
      <motion.div 
        className="relative z-10 mb-6"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className={`w-24 h-24 ${step.bgColor} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
          {/* Animated gradient background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0`}
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
          
          <step.icon className={`w-12 h-12 ${step.iconColor} relative z-10`} />
          
          {/* Step number overlay */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {index + 1}
          </div>
          
          {/* Pulse ring animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-current opacity-50"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 1.3], opacity: [0.5, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div 
        className="text-center max-w-xs bg-white/50 backdrop-blur-sm rounded-xl p-4"
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {step.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {step.description}
        </p>
      </motion.div>

      {/* Arrow for mobile */}
      {!isLast && (
        <motion.div 
          className="flex justify-center mt-6 lg:hidden"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2 }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.8) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-success-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ opacity }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
            </motion.div>
            <span className="text-sm font-medium text-slate-600">Simple Process</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            From "I want to start a business" to "Here's your keys" in 5 simple steps
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <StepCard 
              key={step.title} 
              step={step} 
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Progress Timeline (Desktop Only) */}
        <div className="hidden lg:block mt-16">
          <div className="relative">
            {/* Progress bar background */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 rounded-full -translate-y-1/2" />
            
            {/* Animated progress bar */}
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-500 via-success-500 to-warning-500 rounded-full -translate-y-1/2"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            />
            
            {/* Step dots on timeline */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
                >
                  <motion.div 
                    className={`w-4 h-4 rounded-full bg-white border-4 ${
                      index <= 2 ? 'border-primary-500' : 'border-slate-300'
                    } shadow-lg`}
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <span className="mt-2 text-xs font-medium text-slate-500">Step {index + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <motion.button
            className="btn-primary text-lg px-10 py-4 relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: '-200%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.8 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Try It Free - No Credit Card Required
            </span>
          </motion.button>
          <motion.p 
            className="mt-4 text-slate-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
          >
            Get your first location recommendation in under 2 minutes
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
