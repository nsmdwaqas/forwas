import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  PhoneCall,
  Heart,
  Sparkles,
  Clock,
  Maximize2,
  X,
  Moon,
  PhoneIncoming,
  PhoneOutgoing
} from 'lucide-react';

import { BackButton } from '../BackButton';

interface SceneMidnightCallProps {
  onNext: () => void;
  onBack?: () => void;
}

export function SceneMidnightCall({ onNext, onBack }: SceneMidnightCallProps) {
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
    setLiked((prev) => !prev);

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        <BackButton onBack={onBack} />
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Moon className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Moon className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE MIDNIGHT CALL
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            More Than 3 Hours Into the Night • When Silence Turned Into Forever
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
              <Clock className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                10:20 PM to Past 1:27 AM • 3+ Hours
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              08 Nov 2026 • ruhi.. ♡
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
            {/* Header of Screenshot Card */}
            <div className="px-3.5 py-2.5 bg-white/10 flex items-center justify-between border-b border-white/10 text-xs text-white/90">
              <span className="font-mono text-gold-light font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Actual Midnight Call Log Screenshot
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-white/75 group-hover:text-white transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                Tap to View Raw
              </span>
            </div>

            {/* Image Preview */}
            <div className="relative max-h-72 sm:max-h-80 overflow-hidden flex items-center justify-center bg-black/90">
              <img
                src="/assets/aistudio/Midnight_Call_383f7ad3.jpeg"
                alt="Midnight Call History showing 3+ hours of calls with ruhi.. ♡"
                className="w-full max-w-sm object-contain rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <span className="font-semibold text-rose-200">ruhi.. ♡ Midnight History</span>
                <span className="font-mono font-bold text-emerald-300">3+ Hours Unbroken Night</span>
              </div>
            </div>
          </motion.div>

          {/* Call Breakdown Pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-full grid grid-cols-2 gap-2.5 shrink-0"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/70 mb-0.5">
                <PhoneOutgoing className="w-3.5 h-3.5 text-rose-300" />
                <span>10:20 PM – 12:02 AM</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-rose-200 block">
                5m • 13m • 1 hr 11 mins
              </span>
              <p className="text-[11px] text-white/75 mt-1 leading-snug">
                Each time the line paused, neither heart was ready to say goodnight.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 backdrop-blur-sm shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gold-light mb-0.5">
                <PhoneIncoming className="w-3.5 h-3.5 text-emerald-300" />
                <span>12:06 AM Incoming</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                1 Hour 21 Minutes
              </span>
              <p className="text-[11px] text-white/90 mt-1 leading-snug">
                Past midnight, she called back herself and stayed till 1:27 AM.
              </p>
            </div>
          </motion.div>

          {/* Raw Emotional Narrative Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="w-full rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl border border-rose-300/25 bg-gradient-to-br from-[#240c21]/95 via-[#2f132c]/85 to-[#19061a]/95 text-left shrink-0"
          >
            {/* Header of Narrative */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-white">
                    When Midnight Forgot the Clock
                  </h3>
                  <p className="font-sans text-[11px] text-rose-200/80">
                    The first late-night marathon in our history
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

            {/* Narrative Story */}
            <div className="space-y-3 text-xs sm:text-sm text-white/95 leading-relaxed font-sans font-light">
              <p>
                From the very beginning, we had intentionally avoided talking before marriage. For months, our call logs held only missed rings for Fajr and shy greetings measured in single-digit seconds. We guarded that boundary gently, never imagining what would happen when the night finally opened its door.
              </p>

              <p>
                On the night of 8th November, a five-minute call at 10:20 PM turned into thirteen minutes at 10:26 PM. By 10:51 PM, we were lost in an hour and eleven minutes of quiet laughter and warmth. And when that call ended just after midnight, the most beautiful thing happened at <span className="text-gold-light font-semibold">12:06 AM</span> — my phone lit up with an <span className="text-emerald-300 font-semibold">Incoming Call from ruhi.. ♡</span> that lasted another one hour and twenty-one minutes.
              </p>

              <div className="p-3.5 rounded-xl bg-black/45 border border-rose-300/20 my-2">
                <p className="italic text-rose-100 font-normal text-xs sm:text-[13px] leading-relaxed">
                  &ldquo;She is the shyest person I have ever known. A girl who once hesitated to stay on a call for ten seconds was suddenly talking to me for more than three hours in the middle of the night. I still don&apos;t know how she felt so safe and comfortable with me — I only know that hearing her voice past midnight felt like home.&rdquo;
                </p>
              </div>

              <p>
                The house was asleep, the world outside was silent, and across the dark, two shy souls talked as if they had been waiting their whole lives to share the quiet of the night. Three hours passed like three heartbeats.
              </p>

              <div className="pt-2 text-right">
                <span className="font-heading italic text-white/90 text-xs sm:text-sm block">
                  Awake in your voice, always,
                </span>
                <span className="font-heading font-semibold text-gold-light text-sm sm:text-base">
                  Waqas ♡
                </span>
              </div>
            </div>
          </motion.div>

          {/* Poetic Quote Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-black/30 border border-white/10 text-center shrink-0 mb-1"
          >
            <p className="font-heading italic text-xs sm:text-sm text-white/90 leading-relaxed">
              &ldquo;When a shy heart calls you back at 12:06 AM and stays for hours, you know your soul has become her safest place.&rdquo;
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
            transition={{ duration: 1, ease: 'easeOut' }}
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
              hapticTap('light');
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,255,255,0.4)' }}
            whileTap={{ scale: 0.98, boxShadow: '0 0 40px rgba(255,255,255,0.8)' }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Raw Screenshot Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-3 sm:p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative w-full max-w-md flex flex-col items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="absolute -top-11 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                src="/assets/aistudio/Midnight_Call_383f7ad3.jpeg"
                alt="Midnight Call Log Fullscreen Screenshot"
                className="w-full max-h-[82vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-white/70 text-xs sm:text-sm mt-3 font-mono tracking-wide">
                Tap anywhere outside or close button to dismiss
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
