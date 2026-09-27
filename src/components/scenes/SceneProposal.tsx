import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, HeartHandshake, Sparkles, Heart, Calendar, Clock, Quote } from 'lucide-react';

interface SceneProposalProps {
  onNext: () => void;
}

export function SceneProposal({ onNext }: SceneProposalProps) {
  const [waqasLiked, setWaqasLiked] = useState(false);
  const [shajerLiked, setShajerLiked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);

  const hapticTap = (strength: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (strength === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const triggerHeartEffect = (e: React.MouseEvent, type: 'waqas' | 'shajer') => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFloatingHeart({ id: Date.now(), x, y });

    if (type === 'waqas') {
      setWaqasLiked(prev => !prev);
    } else {
      setShajerLiked(prev => !prev);
    }

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
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
            <HeartHandshake className="w-8 h-8 sm:w-10 sm:h-10 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE PROPOSAL
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm md:text-base mt-0.5 tracking-wide">
            when three words became our forever dua
          </p>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-[200px] overflow-y-auto px-1 sm:px-4 custom-scrollbar scroll-smooth flex flex-col items-center gap-4 sm:gap-6 py-2">
          
          {/* Poetic Prelude Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="w-full max-w-xl bg-white/5 border border-white/15 rounded-2xl p-4 sm:p-5 text-center backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            <p className="font-sans text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-light">
              Love doesn't wait for permission or perfection. At different moments, in different circumstances, both uttered those sacred words for the very first time.
            </p>
            <p className="font-sans text-xs sm:text-sm text-rose-200 italic mt-2 font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              No filter. No hesitation. Raw, pure, and written directly into the soul.
            </p>
          </motion.div>

          {/* Cards Container */}
          <div className="w-full max-w-xl flex flex-col gap-4 sm:gap-5">
            
            {/* Waqas's Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="relative rounded-2xl bg-gradient-to-br from-[#1c0c1b]/90 via-[#271228]/80 to-[#140615]/90 border border-rose-300/20 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md text-left overflow-hidden group hover:border-rose-300/40 transition-all"
            >
              {/* Top Accent & Speaker Info */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white font-heading font-bold text-sm shadow-md ring-2 ring-white/20">
                    W
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-semibold text-white text-base sm:text-lg tracking-wide">
                        Waqas
                      </h3>
                      <span className="text-[10px] sm:text-xs font-sans px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                        His First Confession
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/60 font-sans mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold-light" /> 23 Sept 2026
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold-light" /> 03:07 PM IST (Wed)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Like / Heart interaction */}
                <button
                  onClick={(e) => triggerHeartEffect(e, 'waqas')}
                  className={`p-2 rounded-full border transition-all ${waqasLiked ? 'bg-rose-500/30 border-rose-400 text-rose-300' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'}`}
                  title="Treasure this moment"
                >
                  <Heart className="w-4 h-4" fill={waqasLiked ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Exact Raw Message */}
              <div className="relative pl-3 sm:pl-4 border-l-2 border-rose-400/60 py-1">
                <Quote className="w-4 h-4 text-rose-300/40 absolute -top-1.5 -left-2 rotate-180" />
                <p className="font-sans text-sm sm:text-[15px] md:text-base text-white/95 leading-relaxed font-normal tracking-wide whitespace-pre-wrap select-text">
                  I LOVE YOU.. no matter what.. fovervee and ever and ever till infinity.. without any expectation till the last minute.. Inshallah.. that will be my dua..
                </p>
              </div>

              {/* Aesthetic Footnote */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] sm:text-xs text-white/60 font-sans italic">
                <span>An unconditional vow, sealed with a prayer.</span>
                <span className="font-heading text-rose-300/80 not-italic tracking-wider font-medium text-[11px]">
                  Till Infinity ∞
                </span>
              </div>
            </motion.div>

            {/* Shajer's Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="relative rounded-2xl bg-gradient-to-br from-[#240c1d]/90 via-[#2f1124]/80 to-[#1a0614]/90 border border-pink-300/20 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md text-left overflow-hidden group hover:border-pink-300/40 transition-all"
            >
              {/* Top Accent & Speaker Info */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-heading font-bold text-sm shadow-md ring-2 ring-white/20">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-semibold text-white text-base sm:text-lg tracking-wide">
                        Shajer
                      </h3>
                      <span className="text-[10px] sm:text-xs font-sans px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                        Her Heart Unbound
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/60 font-sans mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold-light" /> 27 Sept 2026
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold-light" /> 12:51 PM IST (Sun)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Like / Heart interaction */}
                <button
                  onClick={(e) => triggerHeartEffect(e, 'shajer')}
                  className={`p-2 rounded-full border transition-all ${shajerLiked ? 'bg-pink-500/30 border-pink-400 text-pink-300' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'}`}
                  title="Treasure this moment"
                >
                  <Heart className="w-4 h-4" fill={shajerLiked ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Exact Raw Message */}
              <div className="relative pl-3 sm:pl-4 border-l-2 border-pink-400/60 py-1">
                <Quote className="w-4 h-4 text-pink-300/40 absolute -top-1.5 -left-2 rotate-180" />
                <p className="font-sans text-sm sm:text-[15px] md:text-base text-white/95 leading-relaxed font-normal tracking-wide whitespace-pre-wrap select-text">
                  I LOVE YOU SOOOOOO DAMMNNN MUCH....... 🖤❤️💞ki mein apni jaan bhi lagadun aap pe.....
                </p>
              </div>

              {/* Aesthetic Footnote */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] sm:text-xs text-white/60 font-sans italic">
                <span>A fierce, boundless devotion from the depths of her being.</span>
                <span className="font-heading text-pink-300/80 not-italic tracking-wider font-medium text-[11px]">
                  Jaan Se Bhi Zyada 🖤❤💞
                </span>
              </div>
            </motion.div>

          </div>

          {/* Unified Harmony Reflection */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="w-full max-w-xl py-3 px-4 rounded-xl bg-black/20 border border-white/10 text-center"
          >
            <p className="font-heading italic text-xs sm:text-sm text-white/80 leading-relaxed">
              Four days apart, under the same sky. Two confessions that became the foundation of one unbroken promise.
            </p>
          </motion.div>

        </div>

        {/* Floating Heart Effect */}
        <AnimatePresence>
          {floatingHeart && (
            <motion.div
              key={floatingHeart.id}
              initial={{ opacity: 1, scale: 0.6, y: 0 }}
              animate={{ opacity: 0, scale: 1.6, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute pointer-events-none z-50 text-rose-400"
              style={{ left: floatingHeart.x, top: floatingHeart.y }}
            >
              <Heart className="w-8 h-8" fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-3 sm:mt-4 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
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
