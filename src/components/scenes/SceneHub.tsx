import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Heart, Clock, Lock, Infinity as InfinityIcon, PenTool } from 'lucide-react';

interface SceneHubProps {
  onConfession: () => void;
  onCountdown: () => void;
  onForever: () => void;
  onLetter: () => void;
}

export function SceneHub({ onConfession, onCountdown, onForever, onLetter }: SceneHubProps) {
  const [lockedShake, setLockedShake] = useState(false);
  const controls = useAnimation();

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const handleLockedTap = async () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]); // Error/Locked vibration
    }
    setLockedShake(true);
    await controls.start({ 
      x: [-10, 10, -10, 10, 0], 
      transition: { duration: 0.4 } 
    });
    setLockedShake(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center px-4">
      <motion.div 
        className="glass-panel w-full p-8 md:p-12 relative overflow-hidden flex flex-col gap-4 md:gap-5"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-heading mb-2 text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Choose a Chapter
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onConfession();
            }}
            className="w-full px-6 py-4 glass-button text-white rounded-2xl font-medium text-lg transition-all flex items-center justify-between group"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Confession</span>
            <Heart className="w-5 h-5 text-gold-light group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(232,180,200,0.8)]" fill="currentColor" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onCountdown();
            }}
            className="w-full px-6 py-4 glass-button text-white rounded-2xl font-medium text-lg transition-all flex items-center justify-between group"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Big Day</span>
            <Clock className="w-5 h-5 text-white/90 group-hover:rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onForever();
            }}
            className="w-full px-6 py-4 glass-button text-white rounded-2xl font-medium text-lg transition-all flex items-center justify-between group"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Forever</span>
            <InfinityIcon className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onLetter();
            }}
            className="w-full px-6 py-4 glass-button text-white rounded-2xl font-medium text-lg transition-all flex items-center justify-between group"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Letter</span>
            <PenTool className="w-5 h-5 text-white/90 group-hover:-rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
        >
          <motion.button
            onClick={handleLockedTap}
            animate={controls}
            className={`w-full px-6 py-4 bg-white/5 border border-white/10 text-white/50 rounded-2xl font-medium text-lg transition-all flex items-center justify-between ${lockedShake ? 'bg-white/10 text-white/80' : ''}`}
            whileTap={{ scale: 0.98 }}
          >
            <span>Locked Chapter</span>
            <Lock className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
