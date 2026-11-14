import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  Heart,
  Sparkles,
  MapPin,
  Wifi,
  WifiOff,
  Sun,
  Utensils,
  ShieldCheck,
  Navigation,
  Calendar
} from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneOfficeVisitProps {
  onNext: () => void;
  onBack?: () => void;
}

export function SceneOfficeVisit({ onNext, onBack }: SceneOfficeVisitProps) {
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
          <Briefcase className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Briefcase className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE OFFICE VISIT
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            From 190 KM to 620 KM • Chasing Signal Just for a Glimpse of You
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
              <MapPin className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                190 KM → 620 KM • Hyderabad Visit
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <Calendar className="w-3.5 h-3.5 text-gold-light shrink-0" />
              <span>11 Nov – 14 Nov 2026</span>
            </div>
          </motion.div>

          {/* Distance & Signal Journey Visual Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/60 via-black/65 to-amber-950/45 border border-rose-300/35 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Left: 190 KM Origin */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest text-white/60 font-mono">
                  Usual Distance
                </span>
                <span className="text-lg sm:text-xl font-heading font-bold text-white mt-0.5">
                  190 KM Apart
                </span>
                <span className="text-[11px] text-white/80 font-sans">
                  Ambur ↔ Chennai
                </span>
              </div>

              {/* Center Animated Route */}
              <div className="flex flex-col items-center justify-center flex-1 w-full sm:w-auto px-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gold-light font-mono uppercase tracking-wider mb-1">
                  <Navigation className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                  <span>First Office Trip Apart</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-400 via-gold-light to-amber-300 rounded-full"
                    initial={{ width: '25%' }}
                    animate={{ width: ['25%', '100%', '25%'] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                  />
                </div>
                <span className="text-[10px] text-white/70 font-sans mt-1 italic">
                  11 Nov (Hyderabad) → Returned 14 Nov (Chennai)
                </span>
              </div>

              {/* Right: 620 KM Peak */}
              <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                <span className="text-[10px] uppercase tracking-widest text-amber-300/90 font-mono">
                  Farthest Yet
                </span>
                <span className="text-xl sm:text-2xl font-heading font-bold text-gold-light mt-0.5 drop-shadow-[0_0_10px_rgba(232,180,200,0.6)]">
                  620 KM Apart
                </span>
                <span className="text-[11px] text-white/85 font-sans">
                  Ambur ↔ Hyderabad
                </span>
              </div>
            </div>
          </motion.div>

          {/* 4 Moments Grid: Signal Hunting & Care Like Ammi */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.65 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 shrink-0"
          >
            {/* Card 1: Hunting for Signal */}
            <div className="bg-black/45 border border-white/15 rounded-2xl p-3.5 flex items-start gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <div className="relative">
                  <WifiOff className="w-4 h-4 text-white/40 absolute -top-1 -left-1 opacity-50" />
                  <Wifi className="w-5 h-5 text-rose-300 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-rose-300">
                  Dead Zone Inside Office
                </div>
                <div className="text-sm sm:text-base font-heading font-semibold text-white mt-0.5">
                  Hopping Around for Signal
                </div>
                <div className="text-xs text-white/80 mt-0.5 leading-relaxed">
                  My office had zero network—so between work, I kept wandering from corner to corner just to catch a bar of signal for one glimpse of you.
                </div>
              </div>
            </div>

            {/* Card 2: Morning Wake-Up Calls */}
            <div className="bg-black/45 border border-white/15 rounded-2xl p-3.5 flex items-start gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <Sun className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
                  Every Single Morning
                </div>
                <div className="text-sm sm:text-base font-heading font-semibold text-white mt-0.5">
                  Waking Me Up for Office
                </div>
                <div className="text-xs text-white/80 mt-0.5 leading-relaxed">
                  Even 620 KM away, you made sure I woke up early every morning so I could get ready for the office on time.
                </div>
              </div>
            </div>

            {/* Card 3: Worried About My Food */}
            <div className="bg-black/45 border border-white/15 rounded-2xl p-3.5 flex items-start gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <Utensils className="w-5 h-5 text-gold-light" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-gold-light">
                  Purest Maternal Warmth
                </div>
                <div className="text-sm sm:text-base font-heading font-semibold text-white mt-0.5">
                  &ldquo;Did You Eat on Time?&rdquo;
                </div>
                <div className="text-xs text-white/80 mt-0.5 leading-relaxed">
                  Worrying if I had my meals on time amidst busy work hours—caring for me with the exact same selfless love as my Ammi.
                </div>
              </div>
            </div>

            {/* Card 4: Restless Until I'm Safe */}
            <div className="bg-black/45 border border-white/15 rounded-2xl p-3.5 flex items-start gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
                  Guarding Me From Afar
                </div>
                <div className="text-sm sm:text-base font-heading font-semibold text-white mt-0.5">
                  Restless Until I Reached Safe
                </div>
                <div className="text-xs text-white/80 mt-0.5 leading-relaxed">
                  Growing restless until you knew I had reached the office or back home safely—just like my Ammi watching over every step I take.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Romantic Story Reflection Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            onClick={triggerHeartEffect}
            className="shrink-0 w-full bg-black/55 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl relative overflow-hidden cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] uppercase tracking-widest text-gold-light font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                Fewer Words, Deeper Love • 11 – 14 Nov 2026
              </span>
              <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                  liked ? 'text-rose-400 fill-rose-400 scale-125' : 'text-white/50 group-hover:text-rose-300'
                }`}
              />
            </div>

            <div className="space-y-3 text-xs sm:text-sm md:text-base text-white/95 font-sans leading-relaxed">
              <p>
                On <strong className="text-gold-light">11 November 2026</strong>, I left for Hyderabad for an office visit and returned to Chennai on <strong className="text-gold-light">14 November</strong>. Suddenly, the distance between us stretched far beyond our usual <strong className="text-white">190 kilometers</strong>—all the way to <strong className="text-rose-200">620 kilometers</strong>. It was the very first time I had gone on an office trip since you became mine.
              </p>

              <p>
                My days were packed with schedules and work, and you were missing me just as deeply as I was aching for you. Inside my office building, there was no network signal at all—yet in the middle of busy hours, my heart refused to stay still. I kept stepping out and hopping from spot to spot around the office area, searching for a single bar of signal just to catch a glimpse of you.
              </p>

              <p>
                What touched my soul the most was the way you held me from 620 kilometers away. You woke me up early every morning so I wouldn&apos;t be late for the office. You worried if I had eaten my food on time, and you grew restless until you knew I had reached the office or back to my room safely—<em className="text-rose-200 font-serif">just like my Ammi</em>.
              </p>

              <p className="italic text-rose-200/95 font-serif text-sm sm:text-base border-l-2 border-rose-400/60 pl-3 py-1 bg-white/5 rounded-r-xl">
                &ldquo;During those four days, our conversations had to be shorter—but in every missed moment, every signal search, and every worried question of yours, the love between us quietly grew deeper than ever before.&rdquo;
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60 font-mono">
              <span>Hyderabad ↔ Ambur • 620 KM</span>
              <span className="text-rose-300/90">Tap card to send love ❤️</span>
            </div>

            {/* Floating Heart on Tap */}
            {floatingHeart && (
              <motion.div
                key={floatingHeart.id}
                initial={{ opacity: 1, scale: 0.5, y: 0 }}
                animate={{ opacity: 0, scale: 1.8, y: -60 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute pointer-events-none z-50 text-2xl select-none"
                style={{ left: floatingHeart.x, top: floatingHeart.y }}
              >
                ❤️
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
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
    </div>
  );
}
