import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  HeartHandshake, 
  Heart, 
  Sparkles, 
  Clock, 
  MessageCircleHeart,
  Maximize2,
  X,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import promiseImg from '../../assets/promise.jpeg';

interface SceneThePromiseProps {
  onNext: () => void;
}

export function SceneThePromise({ onNext }: SceneThePromiseProps) {
  const [liked, setLiked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    hapticTap('light');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    hapticTap('light');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3"
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
            THE PROMISE
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            The First Promise Waqas made to Shajer before Marriage
          </p>
        </motion.div>

        {/* Scrollable Container with Smooth Mobile Touch Scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Subtitle / Context Tag with High Contrast Visibility */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-between border-b border-white/15 pb-2.5 flex-wrap gap-2 shrink-0"
          >
            {/* The Sacred Vow - High Contrast Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/25 px-3 py-1.5 rounded-full border border-emerald-400/50 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                The Sacred Vow
              </span>
            </div>

            {/* Timestamp Badge */}
            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              30 Sept 2026 • 11:01 PM IST
            </div>
          </motion.div>

          {/* Mobile-Friendly Raw Image Showcase Card (NO overlay blocking the text) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="shrink-0 w-full max-w-[340px] sm:max-w-sm mx-auto relative rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-400/40 bg-black/90 backdrop-blur-xl group cursor-pointer"
            onClick={handleOpenModal}
          >
            {/* The Raw Screenshot Image Display - Clean without any bottom overlap */}
            <div className="relative w-full min-h-[300px] sm:min-h-[340px] rounded-3xl bg-zinc-950 flex flex-col items-center justify-center p-2.5">
              <img 
                src={promiseImg} 
                alt="The Promise Conversation Screenshot"
                className="w-full h-auto max-h-[380px] object-contain rounded-2xl block mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/assets/promise.jpeg')) {
                    target.src = '/assets/promise.jpeg';
                  } else {
                    target.src = '/promise.svg';
                  }
                }}
              />

              {/* Tap to expand prompt - Top right only, never covers conversation text */}
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white font-medium border border-white/30 flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3 h-3 text-gold-light" />
                <span>Tap to expand</span>
              </div>
            </div>
          </motion.div>

          {/* Context pill placed OUTSIDE the image so it NEVER overlaps Shajer's response */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="shrink-0 w-full max-w-[340px] sm:max-w-sm mx-auto flex items-center justify-between text-[11px] sm:text-xs text-white/95 px-3.5 py-2 rounded-2xl bg-purple-950/60 backdrop-blur-md border border-purple-400/40 shadow-md"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>&ldquo;i Choose you.. over everything&rdquo;</span>
            </span>
            <span className="text-gold-light font-semibold italic">Waqas &amp; Shajer</span>
          </motion.div>

          {/* The Raw Conversation Message Cards with High Contrast Labels */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="shrink-0 w-full bg-black/40 border border-white/20 rounded-2xl p-3.5 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3.5"
          >
            {/* Header: The First Promise - Highly Visible */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-xs sm:text-sm text-amber-200 font-bold flex items-center gap-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                The First Promise
              </span>
              <span className="text-xs text-white/90 font-mono bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                30 Sept 2026, 11:01 PM IST
              </span>
            </div>

            {/* Waqas's Sent Bubble */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs text-purple-200 font-bold mr-1 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Waqas <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <div className="w-full sm:max-w-md rounded-2xl rounded-tr-sm bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-3.5 sm:p-4 text-white shadow-xl text-xs sm:text-sm leading-relaxed border border-purple-300/40">
                <p className="font-sans whitespace-pre-wrap select-text leading-relaxed">
                  i Choose you.. over everything.. ONLY YOU Hameshakeliye.. if life give me 1000 more time to relive i will choose you and thats a <span className="bg-white text-zinc-950 font-bold px-1.5 py-0.5 rounded text-[11px] sm:text-xs shadow-sm">promise</span> and i pray for it.. Inshallah.. ❤️💞💝💗💓💕🖤💟
                </p>
                <div className="text-right text-[10px] text-white/80 mt-1.5 font-mono">
                  11:01 PM
                </div>
              </div>
            </div>

            {/* Shajer's Reply Bubble with Bright & Prominent Label */}
            <div className="flex flex-col items-start gap-1.5 pt-1">
              <span className="text-xs text-rose-300 font-bold ml-1 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
                Shajer (Ruhi.. ❤️) replied:
              </span>
              <div className="w-full sm:max-w-md rounded-2xl rounded-tl-sm bg-zinc-900/95 p-3.5 sm:p-4 text-white shadow-xl text-xs sm:text-sm leading-relaxed border border-white/20">
                <div className="text-xs text-purple-300 bg-purple-950/70 border-l-2 border-purple-400 pl-2.5 py-1 mb-2 rounded-r line-clamp-1 italic">
                  &ldquo;i Choose you.. over everything.. ONLY YOU...&rdquo;
                </div>
                <p className="font-sans whitespace-pre-wrap select-text font-medium text-white/95">
                  so do i... inshallah... we will pray for the same ❤️💞
                </p>
              </div>
            </div>
          </motion.div>

          {/* Poetic & Aesthetic Context Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/30 text-purple-200 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Chosen in Every Lifetime
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;Before rings, before ceremonies, before the world called us one... this was the sacred promise. Out of every soul across a thousand lifetimes, I will always choose you. Again, again, and for eternity.&rdquo;
            </p>

            {/* Interactive Heart Reaction */}
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
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
                <span>{liked ? 'A Promise Sealed Forever' : 'Seal this promise'}</span>
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
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
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

      {/* Fullscreen Mobile-Friendly Image Modal - Zero overlap */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 touch-none"
            onClick={handleCloseModal}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image Container */}
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
                  src={promiseImg} 
                  alt="The Promise Screenshot Fullscreen" 
                  className="w-full h-auto max-h-[72vh] object-contain rounded-2xl block mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.endsWith('/assets/promise.jpeg')) {
                      target.src = '/assets/promise.jpeg';
                    } else {
                      target.src = '/promise.svg';
                    }
                  }}
                />
              </div>
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center shrink-0">
                <p className="text-white text-sm font-medium">
                  &ldquo;i Choose you.. over everything.. ONLY YOU Hameshakeliye..&rdquo;
                </p>
                <p className="text-white/70 text-xs mt-0.5 font-mono">
                  30 Sept 2026, 11:01 PM IST
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
