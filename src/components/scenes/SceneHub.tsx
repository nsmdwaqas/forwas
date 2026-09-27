import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Heart, Clock, Lock, Infinity as InfinityIcon, PenTool, Feather, Sparkles, MessageCircleHeart, MessageSquareQuote, AudioLines, HeartHandshake, Hourglass } from 'lucide-react';

interface SceneHubProps {
  onConfession: () => void;
  onCountdown: () => void;
  onForever: () => void;
  onLetter: () => void;
  onTimeline: () => void;
  onMessage: () => void;
  onProposal: () => void;
  onAnswers: () => void;
  onVoices: () => void;
  onLovenama: () => void;
  onOneMonth?: () => void;
}

export function SceneHub({ onConfession, onCountdown, onForever, onLetter, onTimeline, onMessage, onProposal, onAnswers, onVoices, onLovenama, onOneMonth }: SceneHubProps) {
  const [lockedShake, setLockedShake] = useState(false);
  const [showLockedNotice, setShowLockedNotice] = useState(false);
  const [noticeTimeout, setNoticeTimeout] = useState<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  // Countdown timer for 29 Sept 2026 5:00 PM IST (+05:30)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isUnlocked: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: false });

  useEffect(() => {
    const targetDate = new Date('2026-09-29T17:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true });
        return false;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isUnlocked: false
      });
      return true;
    };

    updateCountdown();
    const interval = setInterval(() => {
      if (!updateCountdown()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hapticTap = (type: 'default' | 'locked' = 'default') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'locked') {
        navigator.vibrate([40, 50, 40]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const handleLockedChapterClick = async () => {
    if (timeLeft.isUnlocked) {
      hapticTap();
      if (onOneMonth) onOneMonth();
      return;
    }

    hapticTap('locked');
    setLockedShake(true);
    setShowLockedNotice(true);

    if (noticeTimeout) clearTimeout(noticeTimeout);
    const timeout = setTimeout(() => {
      setShowLockedNotice(false);
    }, 3500);
    setNoticeTimeout(timeout);

    await controls.start({ 
      x: [-12, 12, -9, 9, -5, 5, 0], 
      transition: { duration: 0.45, ease: "easeInOut" } 
    });
    setLockedShake(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center px-4 my-auto">
      <motion.div 
        className="glass-panel w-full p-6 sm:p-8 md:p-10 relative overflow-y-auto max-h-[88vh] flex flex-col gap-3 sm:gap-4 custom-scrollbar"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-heading mb-1 sm:mb-2 text-white text-shadow-elegant shimmer-text shrink-0"
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
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Confession</span>
            <Heart className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" fill="currentColor" />
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
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
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
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
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
          transition={{ delay: 1.05, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onLetter();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
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
          transition={{ delay: 1.15, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onTimeline();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Timeline</span>
            <Sparkles className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onMessage();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Message</span>
            <MessageCircleHeart className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.22, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onProposal();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Proposal</span>
            <HeartHandshake className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.23, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onAnswers();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Answers</span>
            <MessageSquareQuote className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.24, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onVoices();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Voices</span>
            <AudioLines className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onLovenama();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span className="tracking-[0.15em] uppercase text-sm md:text-base">The LOVENAMA</span>
            <Feather className="w-5 h-5 text-white/90 group-hover:-rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* Ticking Locked Chapter: The One Month (Unlocks 29 Sept 2026, 5:00 PM IST) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 1 }}
          className="flex flex-col gap-1.5"
        >
          <motion.button
            onClick={handleLockedChapterClick}
            animate={controls}
            className={`w-full px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl font-medium transition-all flex items-center justify-between min-h-[48px] text-left group relative overflow-hidden ${
              timeLeft.isUnlocked
                ? 'glass-button text-white border-rose-300/40 hover:border-rose-300/60 shadow-[0_0_20px_rgba(244,114,182,0.3)]'
                : `bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 ${lockedShake ? 'border-rose-400/80 bg-rose-500/15 shadow-[0_0_25px_rgba(244,63,94,0.3)]' : ''}`
            }`}
            whileHover={{ scale: timeLeft.isUnlocked ? 1.02 : 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-start gap-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-sm sm:text-base font-medium ${timeLeft.isUnlocked ? 'text-white' : 'text-white/85'}`}>
                  The One Month
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                  timeLeft.isUnlocked 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {timeLeft.isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              {/* Ticking Time Countdown */}
              {!timeLeft.isUnlocked ? (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-rose-200/90 font-mono tracking-tight">
                  <Clock className="w-3 h-3 text-rose-300 animate-pulse shrink-0" />
                  <span>
                    {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
                    {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                  <span className="text-[10px] text-white/40 font-sans hidden xs:inline">• 29 Sept, 5 PM</span>
                </div>
              ) : (
                <span className="text-[11px] text-emerald-300 font-sans">
                  Tap to open your anniversary letter ✨
                </span>
              )}
            </div>

            <div className="shrink-0 ml-2">
              {timeLeft.isUnlocked ? (
                <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
              ) : (
                <motion.div
                  animate={lockedShake ? { rotate: [-15, 15, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Lock className={`w-5 h-5 transition-colors ${lockedShake ? 'text-rose-300' : 'text-white/50 group-hover:text-white/80'}`} />
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Locked Notice / Romantic Alert on Click */}
          <AnimatePresence>
            {showLockedNotice && !timeLeft.isUnlocked && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-rose-950/80 via-black/80 to-purple-950/80 border border-rose-400/40 text-left shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold mb-0.5">
                  <Hourglass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Unlocks on 29 Sept 2026, 5:00 PM IST</span>
                </div>
                <p className="font-heading italic text-white/90 text-xs sm:text-sm leading-snug">
                  "Patience, my love... exactly one month from when it all started, your surprise will open here. 🤍"
                </p>
                <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 font-mono">
                  <span>Counting every second:</span>
                  <span className="text-rose-200 font-bold">
                    {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
                    {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
