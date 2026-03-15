'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
}

export function AnimatedLogo({ size = 40, className = '' }: LogoProps) {
  const scale = size / 40;
  
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.08 }}
    >
      <svg viewBox="0 0 40 40" className="w-full h-full" style={{ transform: `scale(${scale})` }}>
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feFlood floodColor="#3b82f6" floodOpacity="0.3" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer ring - ultra smooth slow rotation */}
        <motion.g
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ 
            opacity: { duration: 0.5, delay: 0.1 },
            rotate: { duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }
          }}
        >
          <motion.circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="url(#logoGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="95 5"
            filter="url(#glow)"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ transformOrigin: '20px 20px' }}
          />
        </motion.g>
        
        {/* Inner L shape - smooth draw */}
        <motion.path
          d="M14 12 L14 26 L26 26"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            pathLength: { duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 },
            opacity: { duration: 0.4, delay: 0.4 }
          }}
        />
        
        {/* Accent dot - smooth scale */}
        <motion.circle
          cx="28"
          cy="14"
          r="2.5"
          fill="#2563eb"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 1.2, 
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />
        
        {/* Subtle pulse ring on init */}
        <motion.circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ 
            delay: 1.5,
            duration: 1.5,
            ease: "easeOut"
          }}
        />
      </svg>
    </motion.div>
  );
}
