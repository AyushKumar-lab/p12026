'use client';

import { motion } from 'framer-motion';

export default function FloatingOrbs() {
  const orbs = [
    { color: 'from-blue-500/20 to-cyan-500/20', size: 'w-96 h-96', x: '10%', y: '20%', delay: 0 },
    { color: 'from-purple-500/20 to-pink-500/20', size: 'w-80 h-80', x: '70%', y: '10%', delay: 2 },
    { color: 'from-emerald-500/20 to-teal-500/20', size: 'w-72 h-72', x: '60%', y: '60%', delay: 4 },
    { color: 'from-amber-500/20 to-orange-500/20', size: 'w-64 h-64', x: '20%', y: '70%', delay: 6 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl ${orb.size}`}
          style={{
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Additional animated rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border border-blue-500/10"
          style={{
            width: 300 + i * 200,
            height: 300 + i * 200,
            left: '50%',
            top: '50%',
            marginLeft: -(150 + i * 100),
            marginTop: -(150 + i * 100),
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
