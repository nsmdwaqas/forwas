import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart, Calendar, Clock, Milestone } from 'lucide-react';

interface SceneOneMonthProps {
  onNext: () => void;
}

export function SceneOneMonth({ onNext }: SceneOneMonthProps) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 min-h-full my-auto">
      <motion.div 
        className="glass-panel w-full p-4 sm:p-6 md:p-10 relative flex flex-col h-[85vh] max-h-[85vh] min-h-[440px] sm:min-h-[540px]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center shrink-0 mb-3 sm:mb-4"
        >
          <div className="relative inline-flex items-center justify-center mb-1 sm:mb-2">
            <Milestone className="w-8 h-8 sm:w-10 sm:h-10 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE ONE MONTH
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm md:text-base mt-0.5 tracking-wide">
            30 days of late nights, soft prayers & choosing you
          </p>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-[200px] overflow-y-auto px-1 sm:px-4 custom-scrollbar scroll-smooth flex flex-col items-center gap-4 sm:gap-6 py-2">
          
          {/* Milestone Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full max-w-xl bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-pink-950/60 border border-white/20 rounded-2xl p-4 sm:p-5 text-center backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-gold-light font-sans mb-1">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 29 Aug 2026</span>
              <span>→</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 29 Sept 2026, 5:00 PM</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl text-white font-semibold mt-1">
              One Month of Waqas & Shajer 🤍
            </h3>
            <p className="font-sans text-xs sm:text-sm text-rose-200/90 italic mt-1.5 font-medium">
              A first message that quietly turned into forever.
            </p>
          </motion.div>

          {/* Letter Body */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-left backdrop-blur-sm space-y-3.5 text-white/90 font-sans text-sm sm:text-base leading-relaxed"
          >
            <p>
              <span className="font-heading text-lg sm:text-xl font-bold text-white block mb-1">Shajer,</span>
              They say time moves differently when you find your person. Just one month ago, at 5 PM on August 29th, the first words were spoken. Neither of us could have anticipated how deeply and quickly you would become the peace in my days.
            </p>

            <p>
              In just thirty days, we've shared secrets, laughter, quiet confessions, and heartfelt duas. You went from someone new to the only one I want to talk to before I close my eyes.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border-l-2 border-rose-400 my-2">
              <p className="italic text-rose-200 text-xs sm:text-sm">
                "One month down, a lifetime of love, laughter, and promises left to write."
              </p>
            </div>

            <p className="text-white/80 text-xs sm:text-sm">
              Thank you for being you, for your kindness, and for bringing so much light into my life. Here's to every month and every year ahead.
            </p>

            <div className="pt-2 text-right">
              <span className="font-heading italic text-white/90 text-sm sm:text-base block">
                Forever yours,
              </span>
              <span className="font-heading font-semibold text-gold-light text-base sm:text-lg">
                Waqas ♡
              </span>
            </div>
          </motion.div>

        </div>

        {/* Bottom Button */}
        <motion.div
          className="shrink-0 mt-3 sm:mt-4 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-4 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
