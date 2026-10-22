import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  HeartHandshake, 
  Heart, 
  Sparkles, 
  Moon, 
  Maximize2, 
  X, 
  ShieldCheck,
  MessageCircleHeart
} from 'lucide-react';
import egoScreenshot from '../../assets/the_ego.jpeg';

interface SceneEgoProps {
  onNext: () => void;
}

export function SceneEgo({ onNext }: SceneEgoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const triggerHeartEffect = (e: React.MouseEvent) => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFloatingHeart({ id: Date.now(), x, y });
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Heart Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <HeartHandshake className="w-80 h-80 text-white" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <HeartHandshake className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE EGO
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Our Sacred Pact • Never Go to Sleep with a Fight
          </p>
        </motion.div>

        {/* Scrollable Container with Smooth Mobile Scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left relative z-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Context Badges Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-between border-b border-white/15 pb-2.5 flex-wrap gap-2 shrink-0"
          >
            <div className="inline-flex items-center gap-2 bg-rose-500/25 px-3 py-1.5 rounded-full border border-rose-400/50 shadow-sm">
              <Moon className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Before We Sleep • No Ego
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              21 Oct 2026 • 11:00 PM IST
            </div>
          </motion.div>

          {/* Screenshot Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="shrink-0 w-full rounded-2xl overflow-hidden shadow-xl border border-white/25 bg-black/85 backdrop-blur-md group cursor-pointer"
            onClick={() => {
              hapticTap('light');
              setIsModalOpen(true);
            }}
          >
            <div className="p-2 sm:p-3 bg-zinc-950 flex flex-col items-center justify-center">
              <img 
                src={egoScreenshot} 
                alt="The Ego Promise Chat Screenshot"
                className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
            <div className="px-3.5 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
              <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>The Unbroken Promise</span>
              </span>
              <span className="text-gold-light text-[11px] flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                <Maximize2 className="w-3 h-3" />
                <span>Tap to view full chat</span>
              </span>
            </div>
          </motion.div>

          {/* The Sacred Words Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/50 to-purple-950/40 border border-rose-400/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs sm:text-sm text-amber-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Her Pure Heart • &ldquo;I Seriously Can&apos;t Take That&rdquo;
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              On the night of October 21 at 11:00 PM, Shajer put forward the most sacred condition of their journey: whenever there is an argument, no matter how heated or heavy, they must sort it out before sleeping. No cold silences, no walking away, and no letting anger survive through the night.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-purple-100/95 italic font-serif leading-relaxed text-center">
              &ldquo;In our story, ego will always bow down to love.&rdquo;
            </div>
          </motion.div>

          {/* Poetic & Interactive Reflection Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/30 text-rose-200 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Peace Before Dawn
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;Anger is easy, but love is conscious. When two souls promise never to let ego build walls between them, every night ends in forgiveness, and every morning begins in gratitude.&rdquo;
            </p>

            {/* Interactive Heart Reaction */}
            <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerHeartEffect}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/40 text-rose-100 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] font-medium' 
                    : 'bg-white/15 hover:bg-white/20 text-white border border-white/25'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{liked ? 'Love > Ego 🤍' : 'Hold this promise'}</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Floating Heart Effect */}
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

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>

      </div>

      {/* Fullscreen Lightbox Modal for Chat Screenshot */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 touch-none"
            onClick={() => {
              hapticTap('light');
              setIsModalOpen(false);
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                hapticTap('light');
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-sm sm:max-w-md w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 bg-black flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2">
                <img 
                  src={egoScreenshot} 
                  alt="Full Chat Screenshot" 
                  className="w-full h-auto max-h-[72vh] object-contain rounded-2xl block mx-auto"
                />
              </div>
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center shrink-0">
                <p className="text-white text-xs sm:text-sm font-medium">
                  &ldquo;jaana kabhi agar we&apos;d an argument toh please sone se pehle we will sort out haan&rdquo;
                </p>
                <p className="text-white/70 text-[11px] mt-0.5 font-mono">
                  21 Oct 2026, 11:00 PM IST • Our Sacred Pact
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
