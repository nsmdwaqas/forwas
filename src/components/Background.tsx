import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Random number generator between min and max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate static initial hearts
    const initialHearts: Heart[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: random(0, 100), // percentage
      y: random(0, 100), // percentage
      size: random(10, 40),
      duration: random(10, 25),
      delay: random(0, 10),
      opacity: random(0.15, 0.4),
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blush to-wine opacity-90" />
      
      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, random(-30, 30), 0],
            rotate: [0, random(-20, 20), 0],
            scale: [1, random(1.1, 1.3), 1],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: heart.delay,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
      
      {/* Gold Accent Particles */}
      {hearts.slice(0, 5).map((particle, i) => (
         <motion.div
         key={`gold-${i}`}
         className="absolute rounded-full bg-gold-light/50 blur-[2px]"
         style={{
           left: `${(particle.x + 20) % 100}%`,
           top: `${(particle.y + 30) % 100}%`,
           width: particle.size * 0.3,
           height: particle.size * 0.3,
         }}
         animate={{
           y: [0, -50, 0],
           opacity: [0.2, 0.6, 0.2],
         }}
         transition={{
           duration: particle.duration * 0.8,
           repeat: Infinity,
           ease: "easeInOut",
           delay: particle.delay,
         }}
       />
      ))}
    </div>
  );
}
