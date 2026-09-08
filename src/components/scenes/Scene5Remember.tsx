import React from 'react';
import { motion } from 'motion/react';

export function Scene5Remember({ onNext }: { onNext: () => void }) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center">
      <motion.div 
        className="glass-panel w-full p-10 md:p-14"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <motion.p 
          className="text-2xl md:text-3xl font-heading text-white mb-12 text-shadow-elegant leading-snug"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Do you remember what you once promised me?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-10 py-4 glass-button text-white rounded-full font-medium text-xl transition-all"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 50px rgba(255,255,255,0.9)" }}
            animate={{
              boxShadow: ["0 8px 32px rgba(0,0,0,0.15)", "0 0 25px rgba(255,255,255,0.3)", "0 8px 32px rgba(0,0,0,0.15)"]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            Yes, I do 💞
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
