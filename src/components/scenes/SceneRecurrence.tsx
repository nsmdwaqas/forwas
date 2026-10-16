import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  ArrowRight, 
  RotateCw, 
  Sparkles, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Hourglass, 
  History, 
  X,
  Heart,
  Infinity as InfinityIcon
} from 'lucide-react';

interface SceneRecurrenceProps {
  onNext: () => void;
}

interface RecurrenceEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  originalDateStr: string;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23 in IST
  minute: number; // 0-59 in IST
  startYear: number;
  icon: string;
}

const RECURRENCE_EVENTS: RecurrenceEvent[] = [
  {
    id: 'first-knowing',
    title: 'First Knowing',
    subtitle: '19th Aug, 2:00 PM IST',
    description: 'First time I knew her existence — the afternoon that changed destiny.',
    originalDateStr: 'Wednesday, August 19, 2026 • 2:00 PM IST',
    month: 8,
    day: 19,
    hour: 14,
    minute: 0,
    startYear: 2026,
    icon: '✨'
  },
  {
    id: 'engagement',
    title: 'We Got Engaged',
    subtitle: '29th Aug, 6:00 PM IST',
    description: 'We got engaged & I decided to hold your hand forever like Saiyara.',
    originalDateStr: 'Saturday, August 29, 2026 • 6:00 PM IST',
    month: 8,
    day: 29,
    hour: 18,
    minute: 0,
    startYear: 2026,
    icon: '💍'
  },
  {
    id: 'i-proposed',
    title: 'I Proposed',
    subtitle: '23rd Sept, 3:07 PM IST',
    description: 'At 03:07 PM: "I LOVE YOU till infinity... Inshallah that will be my dua."',
    originalDateStr: 'Wednesday, September 23, 2026 • 3:07 PM IST',
    month: 9,
    day: 23,
    hour: 15,
    minute: 7,
    startYear: 2026,
    icon: '💌'
  },
  {
    id: 'she-proposed',
    title: 'She Proposed',
    subtitle: '27th Sept, 12:51 PM IST',
    description: 'At 12:51 PM: "I LOVE YOU SOOOOOO DAMMNNN MUCH... jaan bhi lagadun aap pe."',
    originalDateStr: 'Sunday, September 27, 2026 • 12:51 PM IST',
    month: 9,
    day: 27,
    hour: 12,
    minute: 51,
    startYear: 2026,
    icon: '💖'
  },
  {
    id: 'marriage',
    title: 'Our Marriage',
    subtitle: '31st Dec, 00:00 (Midnight) IST',
    description: 'The Big Day • Bound together in love, peace, and faith for eternity.',
    originalDateStr: 'Thursday, December 31, 2026 • 12:00 AM IST',
    month: 12,
    day: 31,
    hour: 0,
    minute: 0,
    startYear: 2026,
    icon: '🏰'
  }
];

// Helper to convert IST date components to UTC Timestamp
function getISTTimestamp(year: number, month: number, day: number, hour: number, minute: number): number {
  return Date.UTC(year, month - 1, day, hour - 5, minute - 30);
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function SceneRecurrence({ onNext }: SceneRecurrenceProps) {
  const [now, setNow] = useState(() => Date.now());
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  // Compute recurrence metrics
  const computedEvents = useMemo(() => {
    return RECURRENCE_EVENTS.map(event => {
      const currentYear = new Date(now).getUTCFullYear();
      let nextYear = currentYear;
      let nextTimestamp = getISTTimestamp(nextYear, event.month, event.day, event.hour, event.minute);

      if (nextTimestamp <= now) {
        nextYear = currentYear + 1;
        nextTimestamp = getISTTimestamp(nextYear, event.month, event.day, event.hour, event.minute);
      }

      const prevYear = nextYear - 1;
      const prevTimestamp = getISTTimestamp(prevYear, event.month, event.day, event.hour, event.minute);

      const diffNext = Math.max(0, nextTimestamp - now);
      const diffPrev = Math.max(0, now - prevTimestamp);

      const totalSeconds = Math.floor(diffNext / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const approxMonths = Math.floor(days / 30);
      const remDays = days % 30;

      const passedDays = Math.floor(diffPrev / (1000 * 86400));
      const occurrenceNum = Math.max(1, nextYear - event.startYear + 1);

      const nextDate = new Date(nextTimestamp);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      };
      const formattedNextDate = new Intl.DateTimeFormat('en-US', options).format(nextDate);

      return {
        ...event,
        nextTimestamp,
        prevTimestamp,
        diffNext,
        diffPrev,
        days,
        hours,
        minutes,
        seconds,
        approxMonths,
        remDays,
        passedDays,
        occurrenceNum,
        formattedNextDate
      };
    });
  }, [now]);

  // Closest upcoming event
  const upNextEvent = useMemo(() => {
    return [...computedEvents].sort((a, b) => a.diffNext - b.diffNext)[0];
  }, [computedEvents]);

  const activeEvent = computedEvents[activeIndex] || computedEvents[0];

  const handlePrev = () => {
    hapticTap();
    setActiveIndex(prev => (prev === 0 ? computedEvents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    hapticTap();
    setActiveIndex(prev => (prev === computedEvents.length - 1 ? 0 : prev + 1));
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  const handleOpenMemories = () => {
    hapticTap();
    setIsMemoriesOpen(true);
  };

  const handleCloseMemories = () => {
    hapticTap();
    setIsMemoriesOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-4 sm:p-6 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Heart Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Heart className="w-80 h-80 text-white" fill="currentColor" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <RotateCw className="w-7 h-7 sm:w-8 sm:h-8 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE RECURRENCE
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Tracking our favorite moments across eternity
          </p>
        </motion.div>

        {/* Main Content Container - Compact & perfectly framed for mobile without long scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 custom-scrollbar scroll-smooth flex flex-col gap-3 sm:gap-4 py-1 touch-pan-y overscroll-contain relative z-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* ============================================================
              BLOCK 1: UP NEXT COUNTDOWN (Hero Section)
              ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="shrink-0 w-full rounded-3xl bg-white/10 border border-white/25 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col items-center relative overflow-hidden"
          >
            {/* Ambient Pink Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* UP NEXT Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full border border-white/30 mb-2 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                UP NEXT
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-wide">
              {upNextEvent.title}
            </h2>

            {/* Date Subtitle */}
            <p className="text-xs sm:text-sm text-gold-light font-sans font-medium mt-1 mb-3 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <Calendar className="w-3.5 h-3.5" />
              {upNextEvent.formattedNextDate}
            </p>

            {/* 5 Live Countdown Blocks (MOS, DAYS, HRS, MIN, SEC) */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 w-full max-w-md my-1">
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/15 border border-white/25 shadow-md backdrop-blur-sm">
                <span className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {String(upNextEvent.approxMonths).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/75 tracking-wider mt-0.5">
                  MOS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/15 border border-white/25 shadow-md backdrop-blur-sm">
                <span className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {String(upNextEvent.remDays).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/75 tracking-wider mt-0.5">
                  DAYS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/15 border border-white/25 shadow-md backdrop-blur-sm">
                <span className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {String(upNextEvent.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/75 tracking-wider mt-0.5">
                  HRS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/15 border border-white/25 shadow-md backdrop-blur-sm">
                <span className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {String(upNextEvent.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/75 tracking-wider mt-0.5">
                  MIN
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/15 border border-white/25 shadow-md backdrop-blur-sm">
                <span className="text-lg sm:text-2xl font-bold font-mono text-gold-light tracking-tight">
                  {String(upNextEvent.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/75 tracking-wider mt-0.5">
                  SEC
                </span>
              </div>
            </div>

            {/* High-Contrast, Crystal Clear Ordinal Badge */}
            <div className="mt-3 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/25 text-[11px] sm:text-xs text-white shadow-md flex items-center gap-1.5 flex-wrap justify-center">
              <span>This will be the</span>
              <span className="bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm px-2 py-0.5 rounded-md shadow-sm">
                {getOrdinal(upNextEvent.occurrenceNum)}
              </span>
              <span>time since our journey began.</span>
            </div>
          </motion.div>

          {/* ============================================================
              POETIC WEIGHT & MEANING CARD (Without the chips, clean & deep)
              ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="shrink-0 w-full rounded-2xl bg-white/10 border border-white/20 p-4 sm:p-5 text-center backdrop-blur-md shadow-md"
          >
            <p className="text-xs sm:text-sm text-white/95 italic font-serif leading-relaxed max-w-lg mx-auto">
              &ldquo;Some moments are too sacred to belong to only one date. In our story, love doesn&apos;t fade with the calendar — it recurs, deeper and brighter, with every turn of time.&rdquo;
            </p>
          </motion.div>

        </div>

        {/* ============================================================
            BOTTOM ACTIONS: THEMED BUTTONS (100% Consistent with App UX)
            ============================================================ */}
        <div className="shrink-0 mt-2 sm:mt-3 pt-2 border-t border-white/10 flex flex-col gap-2 relative z-10">
          
          {/* Featured Action: Open Memories Swipe for Infinity Button */}
          <motion.button
            onClick={handleOpenMemories}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px] cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-light group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <span className="font-sans font-medium text-white tracking-wide">
                Our Anniversaries ∞
              </span>
            </div>
            <InfinityIcon className="w-5 h-5 text-white/90 group-hover:rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>

          {/* Continue to Promise Button */}
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 glass-button text-white rounded-full font-medium text-xs sm:text-sm md:text-base transition-all inline-flex items-center justify-center gap-2 min-h-[42px] mx-auto"
            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

        </div>

      </div>

      {/* ============================================================
          POP-UP MODAL: OUR MEMORIES (SWIPE FOR INFINITY)
          Consistent with entire App: Blush Pink background, Glass Panel,
          Floating particles, elegant Cormorant typography, and smooth touch drag
          ============================================================ */}
      <AnimatePresence>
        {isMemoriesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-rose-950/45 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-5"
            onClick={handleCloseMemories}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseMemories}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full glass-button text-white hover:scale-105 transition-all cursor-pointer"
              aria-label="Close memories pop-up"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Glass Panel Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="glass-panel relative max-w-sm sm:max-w-md w-full max-h-[88vh] p-5 sm:p-7 flex flex-col items-center text-center shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Ambient Halos matching App */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="w-full flex items-center justify-between mb-2 pb-2 border-b border-white/20 relative z-10">
                <div className="text-left">
                  <h3 className="text-xl sm:text-2xl font-heading text-white text-shadow-elegant shimmer-text">
                    Our Anniversaries
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gold-light uppercase tracking-widest font-semibold flex items-center gap-1">
                    <InfinityIcon className="w-3.5 h-3.5" />
                    Swipe for Infinity
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 rounded-full glass-button text-white hover:scale-105 transition-all cursor-pointer"
                    aria-label="Previous Memory"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 rounded-full glass-button text-white hover:scale-105 transition-all cursor-pointer"
                    aria-label="Next Memory"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Swipable Card Body with Touch Drag & Spring Transitions */}
              <div className="flex-1 w-full overflow-hidden flex flex-col items-center justify-center py-2 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeEvent.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.95, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -30 }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    className="w-full flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* Event Icon with Halo */}
                    <div className="w-16 h-16 rounded-3xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-inner mb-2.5 backdrop-blur-md">
                      {activeEvent.icon}
                    </div>

                    {/* Title */}
                    <h4 className="text-2xl sm:text-3xl font-heading text-white text-shadow-elegant shimmer-text">
                      {activeEvent.title}
                    </h4>

                    {/* Subtitle / Time */}
                    <p className="text-xs sm:text-sm text-gold-light font-medium mt-0.5 mb-1 font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {activeEvent.subtitle}
                    </p>

                    <p className="text-xs text-white/90 max-w-xs italic mb-3.5 leading-relaxed font-serif">
                      &ldquo;{activeEvent.description}&rdquo;
                    </p>

                    {/* Highlighted COUNTDOWN Banner */}
                    <div className="w-full rounded-2xl bg-white/15 border border-white/30 p-3.5 sm:p-4 mb-3 shadow-md backdrop-blur-md">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-gold-light mb-0.5">
                        <Hourglass className="w-3.5 h-3.5 animate-pulse" />
                        <span>COUNTDOWN</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide text-shadow-elegant">
                        {activeEvent.days} <span className="text-xs sm:text-sm font-sans font-medium text-white/85">Days to go</span>
                      </div>
                      <div className="text-[11px] text-white/80 font-mono mt-0.5">
                        {String(activeEvent.hours).padStart(2, '0')}h : {String(activeEvent.minutes).padStart(2, '0')}m : {String(activeEvent.seconds).padStart(2, '0')}s
                      </div>
                    </div>

                    {/* Dual Stat Pills: PASSED and OCCURRED */}
                    <div className="grid grid-cols-2 gap-2 w-full mb-2.5">
                      <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/70 tracking-wider">
                          <History className="w-3 h-3 text-gold-light" />
                          <span>PASSED</span>
                        </div>
                        <span className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
                          {activeEvent.passedDays}
                        </span>
                        <span className="text-[10px] text-white/80">days ago</span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/70 tracking-wider">
                          <RotateCw className="w-3 h-3 text-gold-light" />
                          <span>OCCURRED</span>
                        </div>
                        <span className="text-base sm:text-lg font-bold font-mono text-amber-200 mt-0.5">
                          {getOrdinal(activeEvent.occurrenceNum)}
                        </span>
                        <span className="text-[10px] text-white/80">time</span>
                      </div>
                    </div>

                    {/* Bottom Note */}
                    <div className="text-[11px] text-white/75 font-sans flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gold-light" />
                      <span>Next: {activeEvent.formattedNextDate}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-white/15 w-full relative z-10">
                {computedEvents.map((evt, idx) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => {
                      hapticTap();
                      setActiveIndex(idx);
                    }}
                    className={`transition-all rounded-full cursor-pointer ${
                      activeIndex === idx 
                        ? 'w-7 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to ${evt.title}`}
                  />
                ))}
              </div>

              {/* Modal Close CTA */}
              <button
                type="button"
                onClick={handleCloseMemories}
                className="w-full mt-3 py-2.5 glass-button text-white rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer relative z-10"
              >
                Close Anniversaries
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
