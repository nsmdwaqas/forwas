import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface PromiseSceneProps {
  onNext: () => void;
  title: string;
  lines: string[];
  timestamp?: string;
}

export function PromiseScene({ onNext, title, lines, timestamp }: PromiseSceneProps) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4">
      <motion.div 
        className="glass-panel w-full p-6 md:p-12 relative overflow-hidden"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Subtle glowing heartbeat behind text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-64 h-64 text-white" fill="currentColor" />
        </motion.div>

        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-heading mb-4 md:mb-8 text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
        >
          {title}
        </motion.h1>

        <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-6 md:mb-12 relative z-10">
          {lines.map((line, index) => (
            <motion.p
              key={index}
              className="text-[15px] sm:text-lg md:text-xl font-sans text-white/95 leading-snug md:leading-relaxed"
              initial={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1 + index * 1.5, duration: 1.2, ease: "easeOut" }}
            >
              {line}
            </motion.p>
          ))}
          
          {timestamp && (
            <motion.div
              className="pt-3 md:pt-6 text-xs sm:text-sm md:text-base font-sans text-white/70 italic text-right"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1 + lines.length * 1.5 + 0.2, duration: 1.5, ease: "easeOut" }}
            >
              {timestamp}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1 + lines.length * 1.5 + 0.5, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-3 md:px-8 md:py-4 glass-button text-white rounded-full font-medium text-base md:text-lg transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue <span className="text-xl">💞</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
