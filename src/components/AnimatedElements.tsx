'use client';

import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = '', duration = 2 }: AnimatedCounterProps) {
  const numericValue = parseInt(value.replace(/\D/g, ''));
  
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {numericValue.toLocaleString()}{suffix}
      </motion.span>
    </motion.span>
  );
}

export function MagneticButton({ 
  children, 
  className = '',
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

export function GlowCard({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
      <div className="relative bg-white rounded-xl border border-slate-200 p-6 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

export function GradientText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <span className={`bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient ${className}`}>
      {children}
    </span>
  );
}
