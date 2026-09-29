import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  PhoneCall, 
  Heart, 
  Sparkles, 
  Calendar, 
  Clock, 
  Sunrise, 
  PhoneIncoming, 
  Info, 
  Search, 
  Mic, 
  SlidersHorizontal,
  Wifi,
  Battery
} from 'lucide-react';

interface SceneCallProps {
  onNext: () => void;
}

export function SceneCall({ onNext }: SceneCallProps) {
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
            <PhoneCall className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE CALL
          </h1>
          <p className="font-heading italic text-white/90 text-xs sm:text-sm mt-0.5 tracking-wide">
            5:01 AM • When your voice woke me for Fajr
          </p>
        </motion.div>

        {/* Scrollable Container with Guaranteed Mobile Touch Scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Poetic Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="w-full bg-white/5 border border-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm shadow-md shrink-0"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-gold-light font-medium">
                <Sunrise className="w-4 h-4 text-amber-300" />
                The First Call Ever
              </span>
              <span className="text-[11px] text-white/70 font-mono">
                28 Sept 2026 • 5:01 AM (Monday)
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-white/95 leading-relaxed">
              Out of every call a heart can ever receive, the most precious one is the one that calls you to stand before Allah.
            </p>
            <p className="font-sans text-xs sm:text-sm text-white font-medium italic mt-2 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              &ldquo;You didn&apos;t call for the world. You called for my prayers.&rdquo;
            </p>
          </motion.div>

          {/* Authentic High-Fidelity iOS Call Log Screenshot Replica */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#f2f2f7] text-[#1c1c1e] shrink-0"
          >
            {/* iOS Status Bar */}
            <div className="px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-black/90 tracking-tight">
              <span>12:06</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-1 bg-black rounded-xs" />
                  <span className="w-0.5 h-1.5 bg-black rounded-xs" />
                  <span className="w-0.5 h-2 bg-black rounded-xs" />
                  <span className="w-0.5 h-2.5 bg-black rounded-xs" />
                </div>
                <span className="text-[10px] font-bold">4G</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold">74</span>
                  <div className="w-5 h-2.5 border border-black/80 rounded-xs p-0.5 flex items-center">
                    <div className="w-3.5 h-full bg-black rounded-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* iOS Nav Bar */}
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-normal text-[#007aff] cursor-default">Edit</span>
              
              {/* Segmented Control */}
              <div className="flex items-center bg-[#e3e3e8] p-0.5 rounded-lg text-xs font-medium">
                <span className="px-3 py-1 bg-white text-black rounded-md shadow-xs font-semibold">
                  All
                </span>
                <span className="px-3 py-1 text-black/60">
                  Missed
                </span>
              </div>

              <div className="w-6 flex justify-end">
                <SlidersHorizontal className="w-4 h-4 text-black/70" />
              </div>
            </div>

            {/* Recents Large Title */}
            <div className="px-4 pt-1 pb-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                Recents
              </h2>
            </div>

            {/* iOS Search Bar */}
            <div className="px-4 pb-3">
              <div className="w-full bg-[#e3e3e8]/75 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[#8e8e93]">
                <Search className="w-3.5 h-3.5 text-[#8e8e93]" />
                <span className="text-xs text-[#8e8e93] font-normal flex-1 text-left">Search</span>
                <Mic className="w-3.5 h-3.5 text-[#8e8e93]" />
              </div>
            </div>

            {/* Call Log Entry */}
            <div className="bg-white border-t border-b border-[#c6c6c8]/50 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Contact Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#8f9eb9] flex items-center justify-center text-white font-bold text-base shadow-xs">
                  R
                </div>

                {/* Contact & Call Direction */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-semibold text-black tracking-tight">
                      ruhi..
                    </span>
                    <span className="text-sm">❤️</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#8e8e93] font-normal">
                    <span className="text-[#8e8e93] font-bold">↙</span>
                    <span>mobile (3)</span>
                  </div>
                </div>
              </div>

              {/* Timestamp & Info Icon */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8e8e93] font-normal">
                  5:01 AM
                </span>
                <div className="w-5 h-5 rounded-full border border-[#007aff] flex items-center justify-center text-[#007aff]">
                  <span className="text-[11px] font-serif font-bold italic">i</span>
                </div>
              </div>
            </div>

            {/* Screenshot Detail Footer Badge */}
            <div className="px-4 py-2 bg-[#f9f9fb] flex items-center justify-between text-[11px] text-[#636366]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Actual Call Log • 28 Sept 2026
              </span>
              <span className="font-medium text-[#1c1c1e]">
                3 Missed Rings for Fajr
              </span>
            </div>
          </motion.div>

          {/* Narrative & Raw Emotional Letter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="w-full rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl border border-rose-300/25 bg-gradient-to-br from-[#240c21]/95 via-[#2f132c]/85 to-[#19061a]/95 text-left shrink-0"
          >
            {/* Header of Reflection */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                  <PhoneIncoming className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-white">
                    The Awakening at 5:01 AM
                  </h3>
                  <p className="font-sans text-[11px] text-rose-200/80">
                    A first call wrapped in prayer
                  </p>
                </div>
              </div>

              {/* Heart Reaction */}
              <button
                onClick={triggerHeartEffect}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title="Treasure this memory"
              >
                <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Raw Story Words */}
            <div className="space-y-2.5 text-xs sm:text-sm text-white/95 leading-relaxed font-sans font-light">
              <p>
                In the stillness before the sun rose on Monday morning, my screen lit up. Three missed calls from the person saved as <span className="text-white font-semibold">&ldquo;ruhi.. ❤️&rdquo;</span>.
              </p>
              
              <p>
                You had never called my phone before. And when you finally did, it wasn&apos;t to ask for anything in this dunya. It was at exactly 5:01 AM, gently calling to make sure I opened my eyes in time for Fajr.
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-rose-300/20 my-2">
                <p className="italic text-rose-100 font-normal text-xs sm:text-[13px] leading-relaxed">
                  &ldquo;A woman who wakes you up for Fajr loves your soul far more than she loves the world. In that moment, I realized my heart was in the purest hands.&rdquo;
                </p>
              </div>

              <p>
                You didn&apos;t just step into my life, Shajer; you brought barakah into my mornings. Waking up to you calling me for prayer is something I will thank Allah for every single day.
              </p>

              <div className="pt-2 text-right">
                <span className="font-heading italic text-white/90 text-xs sm:text-sm block">
                  Forever grateful for your dawn calls,
                </span>
                <span className="font-heading font-semibold text-gold-light text-sm sm:text-base">
                  Waqas ♡
                </span>
              </div>
            </div>
          </motion.div>

          {/* Spiritual Dua Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-black/25 border border-white/10 text-center shrink-0 mb-1"
          >
            <p className="font-heading italic text-xs sm:text-sm text-white/90 leading-relaxed">
              &ldquo;May Allah keep our hands united in prayer, in this dunya and all the way into Jannah.&rdquo;
            </p>
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

        {/* Bottom Navigation */}
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
    </div>
  );
}
