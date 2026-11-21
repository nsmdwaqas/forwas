import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Flame,
  Heart,
  Sparkles,
  PhoneCall,
  Moon,
  Volume2,
  MessageCircleHeart
} from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneIntenseProps {
  onNext: () => void;
  onBack?: () => void;
}

export function SceneIntense({ onNext, onBack }: SceneIntenseProps) {
  const [felt, setFelt] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<
    { id: number; x: number; y: number; text: string }[]
  >([]);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([25, 45, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const triggerReaction = (e: React.MouseEvent) => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const symbols = ['❤️', '🙈', '✨', '🔥', '🌙'];
    const newItems = symbols.map((text, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() * 64 - 32),
      y: y + (Math.random() * 26 - 13),
      text
    }));

    setFloatingParticles((prev) => [...prev, ...newItems]);
    setFelt((prev) => !prev);

    setTimeout(() => {
      setFloatingParticles((prev) =>
        prev.filter((item) => !newItems.some((n) => n.id === item.id))
      );
    }, 1500);
  };

  const whisperedMoments = [
    {
      place: 'Her Eyes',
      icon: '✨',
      desc: 'Soft, reverent kisses brushed gently over closed eyelids'
    },
    {
      place: 'Her Nose & Cheeks',
      icon: '🌸',
      desc: 'Warm, lingering affection where her shyest blush bloomed'
    },
    {
      place: 'Her Neck',
      icon: '🌙',
      desc: 'Slow, breathless whispers where heartbeat met stillness'
    },
    {
      place: 'Her Back',
      icon: '🫂',
      desc: 'Tender traces of closeness, pulling her safely near'
    },
    {
      place: 'Her Stomach',
      icon: '🤍',
      desc: 'Quiet, unhurried warmth wrapped in devotion and trust'
    },
    {
      place: 'Unspoken Places',
      icon: '🔥',
      desc: 'Moments too intimate for ink — kept sacred between us alone'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        {onBack && <BackButton onBack={onBack} />}

        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Flame className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Flame className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE INTENSE
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            1:00 AM Whispers Across the Line • When Words Became Touch
          </p>
        </motion.div>

        {/* Scrollable Content */}
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
              <PhoneCall className="w-4 h-4 text-rose-200 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Late Night Call • 21 Nov 2026
              </span>
            </div>

            <div className="bg-black/55 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] inline-flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-300" />
              <span>1:00 AM • Hushed &amp; Breathless</span>
            </div>
          </motion.div>

          {/* Main Story Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="shrink-0 w-full rounded-2xl bg-gradient-to-br from-rose-950/55 via-black/65 to-purple-950/50 border border-rose-400/35 p-4 sm:p-6 backdrop-blur-md shadow-xl flex flex-col gap-3.5"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2.5">
              <Volume2 className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                The First Time My Voice Traced Every Kiss
              </span>
            </div>

            <p className="text-xs sm:text-sm md:text-[15px] text-white/95 leading-relaxed font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Almost every conversation we share carries a gentle, modest grace — soft laughter, quiet care, and shy warmth. Yet on the night of{' '}
              <span className="text-rose-200 font-semibold">21 November 2026 at 1:00 AM</span>, with the world fast asleep and only our breathing between us on a phone call, the air shifted into something deeper than we had ever crossed before.
            </p>

            <p className="text-xs sm:text-sm md:text-[15px] text-white/95 leading-relaxed font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              For the very first time, I closed my eyes and imagined you right there in my arms — and let my voice become my touch. Slowly, softly, I voiced every single kiss aloud across the line: brushing gently over your{' '}
              <span className="text-purple-100 font-semibold">eyes, nose, and cheeks</span>, lingering along your{' '}
              <span className="text-rose-200 font-semibold">neck, back, and stomach</span>, and drifting quietly into intimate places that belong only to the silence between a husband and his wife.
            </p>

            <div className="p-3.5 sm:p-4 rounded-xl bg-black/55 border border-rose-300/35 text-xs sm:text-sm text-purple-100 font-serif italic text-center leading-relaxed shadow-[0_0_20px_rgba(244,63,94,0.18)]">
              &ldquo;You didn&apos;t need to say a word. You just stayed there on the line — listening deeply, modestly, and shyly — and somehow your quiet breath made every whispered second feel more real than distance could ever hold.&rdquo;
            </div>

            <p className="text-xs sm:text-sm md:text-[15px] text-white/95 leading-relaxed font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              I know how deeply modest your heart is, Shajer — and that is what made that 1:00 AM call so breathtakingly intense. There was nothing rushed and nothing careless; only two souls bound in love, discovering how fiercely tender mere words can feel when spoken only for each other.
            </p>
          </motion.div>

          {/* The Whispers Breakdown Grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col gap-2 w-full shrink-0"
          >
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Every Whisper Spoken at 1:00 AM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 w-full">
              {whisperedMoments.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/55 border border-white/20 flex flex-col items-center text-center backdrop-blur-sm shadow-md"
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="text-xs font-bold text-rose-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {item.place}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-white/85 font-sans mt-1 leading-snug">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Poetic Closing & Interactive Heartbeat Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-purple-950/55 via-black/60 to-rose-950/55 border border-purple-300/35 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/30 border border-rose-300/40 text-rose-200 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Modest in Heart, Intense in Love
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              &ldquo;Miles stood between us, yet at 1:00 AM every kilometer dissolved into a whisper. Your shy silence spoke volumes — reminding me that the purest kind of intimacy is the one built on love, patience, and belonging completely to each other.&rdquo;
            </p>

            {/* Interactive Affection Button */}
            <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-center">
              <button
                type="button"
                onClick={triggerReaction}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  felt
                    ? 'bg-rose-500/45 text-white border border-rose-300/70 shadow-[0_0_18px_rgba(244,63,94,0.45)] font-semibold'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/25 font-medium'
                }`}
              >
                <Heart
                  className="w-3.5 h-3.5 text-rose-200"
                  fill={felt ? 'currentColor' : 'none'}
                />
                <span>{felt ? 'Every whisper felt in silence ❤️🙈' : 'Tap if you still blush thinking of 1 AM 🙈'}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Particles Effect */}
        {floatingParticles.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.8, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute pointer-events-none z-50 text-2xl select-none"
            style={{ left: item.x, top: item.y }}
          >
            {item.text}
          </motion.div>
        ))}

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1.5 border-t border-white/10 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px] cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
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
