import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export function Scene7Finale({ onRestart }: { onRestart: () => void }) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center px-4 relative">
      
      <motion.div 
        className="glass-panel p-10 md:p-16 flex flex-col items-center justify-center w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Central merging hearts animation */}
        <div className="relative w-48 h-48 mb-12">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ x: -70, opacity: 0, rotate: -20 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }} // Cinematic ease
          >
            <svg viewBox="0 0 24 24" className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" fill="currentColor">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ x: 70, opacity: 0, rotate: 20 }}
            animate={{ x: 0, opacity: 0.9, rotate: 0 }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <svg viewBox="0 0 24 24" className="w-24 h-24 text-gold-light drop-shadow-[0_0_15px_rgba(201,166,107,0.8)]" fill="currentColor">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
          
          {/* Super Glow after merge */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full mix-blend-overlay blur-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 3] }}
            transition={{ delay: 2, duration: 2.5, ease: "easeOut" }}
          />
        </div>

        <motion.h1 
          className="text-4xl md:text-5xl font-heading mb-4 text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
        >
          Two promises. One heart.
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-heading italic text-white/95 mb-12 text-shadow-elegant"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 4, duration: 1.2, ease: "easeOut" }}
        >
          Waqas <span className="text-white text-shadow-elegant mx-2">🤍</span> Shajer
        </motion.h2>

        <motion.p
          className="text-2xl md:text-3xl font-sans font-medium text-white text-shadow-elegant"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 5.5, duration: 1.5, ease: "easeOut" }}
        >
          I love you. Here's to forever.
        </motion.p>
      </motion.div>

      {/* Confetti particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-white/80' : 'bg-gold-light/80'} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
          style={{
            left: '50%',
            top: '40%',
            opacity: 0,
            filter: 'blur(1px)'
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ 
            x: (Math.random() - 0.5) * window.innerWidth * 0.9, 
            y: (Math.random() - 0.2) * window.innerHeight * 1.2,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            rotate: Math.random() * 360
          }}
          transition={{ delay: 2, duration: 4 + Math.random() * 3, ease: "easeOut" }}
        />
      ))}

      <motion.button
        onClick={() => {
          hapticTap();
          onRestart();
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 glass-button text-white/90 hover:text-white transition-all text-sm font-medium rounded-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 8.5, duration: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-4 h-4" />
        Replay
      </motion.button>
    </div>
  );
}
