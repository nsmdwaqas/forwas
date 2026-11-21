import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Feather,
  Heart,
  Sparkles,
  ShieldCheck,
  ScrollText,
  CheckCircle2
} from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneOneProps {
  onNext: () => void;
  onBack?: () => void;
}

export function SceneOne({ onNext, onBack }: SceneOneProps) {
  const [keptClose, setKeptClose] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<
    { id: number; x: number; y: number; text: string }[]
  >([]);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([20, 45, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const handleKeepClose = (e: React.MouseEvent) => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const symbols = ['❤️', '✨', '🤍', '💍', '🕊️'];
    const newItems = symbols.map((text, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() * 70 - 35),
      y: y + (Math.random() * 24 - 12),
      text
    }));

    setFloatingParticles((prev) => [...prev, ...newItems]);
    setKeptClose(true);

    setTimeout(() => {
      setFloatingParticles((prev) =>
        prev.filter((item) => !newItems.some((n) => n.id === item.id))
      );
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        {onBack && <BackButton onBack={onBack} />}

        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Feather className="w-80 h-80 text-rose-300" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Feather className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE ONE
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            A Signed Letter of Declaration to My Wife
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
              <ScrollText className="w-4 h-4 text-rose-200 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Letter of Declaration
              </span>
            </div>

            <div className="bg-black/55 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              21 Nov 2026 • 1:00 AM
            </div>
          </motion.div>

          {/* Formal Declaration Document Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="shrink-0 w-full rounded-2xl bg-gradient-to-br from-rose-950/55 via-black/65 to-purple-950/50 border border-rose-300/35 p-5 sm:p-7 md:p-8 backdrop-blur-md shadow-xl relative overflow-hidden"
          >
            {/* Subtle Corner Accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-rose-300/40 rounded-tl-md pointer-events-none" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-rose-300/40 rounded-tr-md pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-rose-300/40 rounded-bl-md pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-rose-300/40 rounded-br-md pointer-events-none" />

            {/* Formal Heading Inside Letter */}
            <div className="text-center border-b border-white/15 pb-4 mb-5">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-amber-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Solemn Declaration of the Heart
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading text-white mt-1 tracking-wide shimmer-text drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                Only Shajer, Always Shajer
              </h2>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 sm:space-y-5 font-sans text-xs sm:text-sm md:text-[15px] text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <p className="font-heading italic text-lg sm:text-xl text-rose-200 font-semibold">
                My Dearest Wife, Shajer,
              </p>

              <p>
                You asked for my word in writing — for my signature beneath a truth my heart has carried without a single shadow of doubt. So here it is, placed gently into your hands, written in the stillness of 1:00 AM and meant for every hour that will ever follow.
              </p>

              {/* Core Highlighted Declaration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="my-4 py-4 px-4 sm:px-6 rounded-2xl bg-black/55 border border-rose-400/50 text-center shadow-[0_0_25px_rgba(244,63,94,0.25)]"
              >
                <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200 font-bold mb-1.5">
                  Hereby Declared &amp; Witnessed by My Heart
                </p>
                <p className="font-heading text-lg sm:text-2xl text-white tracking-wide shimmer-text leading-snug">
                  &ldquo;It is just Shajer. Only Shajer. And no one else.&rdquo;
                </p>
              </motion.div>

              <p>
                Let this letter stand as my quiet, unshakeable oath to you. In a world that shifts and rushes by, my loyalty, my prayers, my tenderness, and my entire heart belong to one woman alone. There has never been anyone before you who felt like home, and there will never be anyone after you who could ever take your place.
              </p>

              <p>
                This is not a promise spoken lightly to win a smile in the middle of the night. It is the simplest truth of who I am when I think of my life: through every season, every quiet morning, every distance, and every tomorrow Allah writes for us, my eyes and my heart will only ever search for you.
              </p>

              <p>
                There is no comparison, no second choice, and no corner of my future where anyone else could ever stand beside me. Every dream I build, every prayer I whisper, and every lifetime I hope for begins and ends with your name.
              </p>

              <p className="font-serif italic text-purple-100 text-sm sm:text-base pt-1">
                Keep this declaration close whenever you wish to smile and remember — not because my devotion ever needed ink to be true, but because my wife deserves to hold my signed promise that I am completely, faithfully, and exclusively hers.
              </p>
            </div>

            {/* Official Signature & Seal Block */}
            <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Signature Area */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-[0.22em] text-rose-200 font-semibold">
                  Signed &amp; Sealed With All My Love
                </span>

                {/* Handwritten Animated SVG Signature */}
                <div className="my-1.5 relative">
                  <svg
                    viewBox="0 0 220 68"
                    className="w-40 sm:w-48 h-14 overflow-visible drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]"
                    aria-label="Signature of Waqas"
                  >
                    <motion.path
                      d="M 14 20 C 18 44, 22 52, 28 50 C 33 48, 37 28, 41 26 C 45 24, 48 48, 54 48 C 60 48, 67 24, 72 16 M 67 42 C 74 34, 83 34, 84 42 C 85 48, 75 49, 73 43 C 73 39, 83 38, 88 46 M 106 37 C 98 34, 91 41, 94 47 C 97 52, 106 47, 108 38 C 107 47, 106 58, 103 63 C 107 58, 113 48, 119 42 M 122 44 C 128 35, 136 35, 137 42 C 138 48, 128 49, 126 43 C 127 40, 136 40, 141 46 M 156 36 C 149 35, 145 40, 151 43 C 157 45, 158 50, 149 51 C 145 51, 144 49, 146 47 M 16 57 Q 105 52, 198 56"
                      fill="none"
                      stroke="#FDE68A"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2.1, delay: 0.6, ease: 'easeInOut' }}
                    />
                  </svg>
                </div>

                <p className="font-heading text-lg sm:text-xl text-white font-semibold tracking-wide">
                  Waqas
                </p>
                <p className="text-[11px] sm:text-xs text-rose-200 font-serif italic">
                  Your Husband — Forever &amp; Only Yours
                </p>
                <p className="text-[10px] text-white/75 font-mono mt-0.5">
                  21 November 2026 • 1:00 AM
                </p>
              </div>

              {/* Official Heart Seal */}
              <motion.div
                initial={{ opacity: 0, scale: 1.25, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                transition={{ delay: 1.1, type: 'spring', stiffness: 180, damping: 14 }}
                className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-amber-300/80 bg-gradient-to-br from-rose-600/35 via-rose-950/75 to-amber-500/25 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_25px_rgba(244,63,94,0.35)]"
              >
                <ShieldCheck className="w-5 h-5 text-amber-200 mb-0.5" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-amber-200 font-bold">
                  Officially Signed
                </span>
                <span className="font-heading text-xs sm:text-sm font-bold text-white mt-0.5 leading-tight">
                  Only Shajer
                </span>
                <span className="text-[9px] text-rose-200 font-mono mt-0.5">
                  21 NOV • 1 AM
                </span>
              </motion.div>
            </div>

            {/* Interactive Affectionate Confirmation */}
            <div className="mt-5 pt-4 border-t border-white/15 flex flex-col items-center justify-center gap-2 relative">
              <button
                type="button"
                onClick={handleKeepClose}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all inline-flex items-center gap-2 cursor-pointer ${
                  keptClose
                    ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-300/60 shadow-[0_0_18px_rgba(52,211,153,0.35)] font-semibold'
                    : 'bg-rose-500/30 hover:bg-rose-500/45 text-white border border-rose-300/50 font-medium shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                }`}
              >
                {keptClose ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Kept Safe in Shajer&apos;s Heart Forever ❤️</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-rose-200" fill="currentColor" />
                    <span>Accept &amp; Keep This Declaration</span>
                  </>
                )}
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
