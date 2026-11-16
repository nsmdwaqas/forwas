import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Heart,
  CalendarHeart,
  MessageCircleHeart,
  Scale,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Feather,
  ArrowRight
} from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneSabKuchProps {
  onNext: () => void;
  onBack?: () => void;
}

type DictionaryChoice = 'her' | 'my' | null;

const TOTAL_SCENES = 7;

const SCENE_TITLES = [
  '1. A History of Words',
  '2. 31 December',
  '3. The Plot Twist',
  '4. Two Dictionaries',
  '5. The Official Verdict',
  '6. The Love Behind It',
  '7. Official Adoption'
];

export function SceneSabKuch({ onNext, onBack }: SceneSabKuchProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryChoice>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const goToStep = (step: number) => {
    hapticTap();
    if (step >= 1 && step <= TOTAL_SCENES) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        {onBack && <BackButton onBack={onBack} />}

        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <BookOpen className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <BookOpen className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE SAB KUCH
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            A Word With Two Meanings
          </p>

          {/* Interactive Step Progress Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2.5 px-3 py-1.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-sm">
            {Array.from({ length: TOTAL_SCENES }, (_, i) => i + 1).map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              return (
                <button
                  key={step}
                  onClick={() => goToStep(step)}
                  aria-label={SCENE_TITLES[step - 1]}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-9 bg-gradient-to-r from-rose-400 via-rose-200 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.9)]'
                      : isCompleted
                      ? 'w-3 sm:w-4 bg-rose-400/80 hover:bg-rose-300'
                      : 'w-2.5 sm:w-3 bg-white/35 hover:bg-white/60'
                  }`}
                />
              );
            })}
          </div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/95 font-semibold mt-1 font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Scene {currentStep} of {TOTAL_SCENES} • {SCENE_TITLES[currentStep - 1].split('. ')[1]}
          </p>
        </motion.div>

        {/* Scrollable Scene Stage */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto custom-scrollbar scroll-smooth px-1 sm:px-3 py-1 flex flex-col justify-between relative z-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <AnimatePresence mode="wait">
            {/* =========================================================
                SCENE 1 — THE WORDS THAT HAVE A HISTORY
                ========================================================= */}
            {currentStep === 1 && (
              <motion.div
                key="sabkuch-scene-1"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-4 gap-4 sm:gap-5 w-full"
              >
                <div className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-rose-950/45 via-black/55 to-purple-950/45 border border-rose-400/30 p-5 sm:p-7 backdrop-blur-md shadow-lg space-y-3 sm:space-y-4">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="text-sm sm:text-base text-white/95 font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    &ldquo;Some words are ordinary.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="text-sm sm:text-base text-white/95 font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    Some words become memories.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-sm sm:text-base text-rose-200 font-semibold font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    And then there are words that have a history of their own...&rdquo;
                  </motion.p>

                  {/* Dramatic Reveal */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.25, duration: 0.7, type: 'spring' }}
                    className="my-3 sm:my-4 py-4 sm:py-5 px-4 rounded-2xl bg-black/55 border border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.35)]"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        The Phrase
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-heading text-white tracking-wider shimmer-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      &ldquo;SAB KUCH.&rdquo;
                    </h2>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.75, duration: 0.6 }}
                    className="text-xs sm:text-sm md:text-base text-white/95 leading-relaxed font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    Two little words. An entire history. And one husband who can never be trusted to interpret them normally.
                  </motion.p>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.1, duration: 0.5 }}
                  onClick={() => goToStep(2)}
                  className="px-7 py-3 glass-button text-white rounded-full font-medium text-sm sm:text-base shadow-[0_0_25px_rgba(244,63,94,0.35)] inline-flex items-center gap-2 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Let&apos;s revisit this...</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* =========================================================
                SCENE 2 — DECEMBER 31
                ========================================================= */}
            {currentStep === 2 && (
              <motion.div
                key="sabkuch-scene-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-4 gap-4 sm:gap-5 w-full"
              >
                <div className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-rose-950/45 via-black/55 to-purple-950/45 border border-rose-400/30 p-5 sm:p-7 backdrop-blur-md shadow-lg space-y-4">
                  <div className="inline-flex items-center gap-2 bg-rose-500/30 px-3.5 py-1.5 rounded-full border border-rose-400/50 shadow-sm">
                    <CalendarHeart className="w-4 h-4 text-rose-200 shrink-0" />
                    <span className="text-xs font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      31 December • Our First Night
                    </span>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-base sm:text-lg font-heading text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    &ldquo;31 December. Our first night.&rdquo;
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-xs sm:text-sm md:text-base text-white/95 leading-relaxed font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    &ldquo;Somewhere between the beginning of a new year and the beginning of our forever, these two words found their own special meaning.&rdquo;
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.95, duration: 0.6, type: 'spring' }}
                    className="py-3.5 px-5 rounded-xl bg-black/55 border border-rose-400/50 shadow-[0_0_24px_rgba(244,63,94,0.3)]"
                  >
                    <span className="text-xl sm:text-3xl font-heading text-white tracking-widest shimmer-text drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      &ldquo;SAB KUCH.&rdquo;
                    </span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.35, duration: 0.6 }}
                    className="text-xs sm:text-sm md:text-base text-purple-100 font-semibold leading-relaxed pt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    &ldquo;You know what I mean. And I know that you know what I mean.&rdquo;
                  </motion.p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => goToStep(1)}
                    className="px-4 py-2.5 rounded-full bg-black/50 hover:bg-black/65 border border-white/25 text-white text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileTap={{ scale: 0.96 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  <motion.button
                    onClick={() => goToStep(3)}
                    className="px-6 py-2.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm md:text-base shadow-[0_0_25px_rgba(244,63,94,0.35)] inline-flex items-center gap-2 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Then came the plot twist...</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* =========================================================
                SCENE 3 — THE UNEXPECTED PLOT TWIST (CHAT SCENE)
                ========================================================= */}
            {currentStep === 3 && (
              <motion.div
                key="sabkuch-scene-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-3 gap-3.5 sm:gap-4 w-full"
              >
                <div className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-rose-950/50 via-black/65 to-purple-950/50 border border-rose-400/30 p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3 text-left">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-heading text-xs font-bold shadow-[0_0_12px_rgba(244,63,94,0.6)]">
                        S
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          Shajer ❤️
                        </p>
                        <p className="text-[10px] text-rose-200 font-medium">
                          The Unexpected Plot Twist
                        </p>
                      </div>
                    </div>
                    <MessageCircleHeart className="w-4 h-4 text-rose-300" />
                  </div>

                  {/* Her Message Bubble */}
                  <motion.div
                    initial={{ opacity: 0, x: -16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.45 }}
                    className="flex flex-col items-start"
                  >
                    <span className="text-[10px] text-rose-200 font-semibold ml-2 mb-0.5">
                      Shajer
                    </span>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-white/15 border border-white/30 px-4 py-2.5 text-white shadow-md">
                      <p className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        &ldquo;SAB KUCH Pyaar me.&rdquo;
                      </p>
                    </div>
                  </motion.div>

                  {/* Husband's Reaction Sequence */}
                  <motion.div
                    initial={{ opacity: 0, x: 16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.65, duration: 0.45 }}
                    className="flex flex-col items-end space-y-2 pt-1"
                  >
                    <span className="text-[10px] text-amber-300 font-semibold mr-2">
                      My Immediate Reaction
                    </span>

                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-rose-500/35 border border-rose-300/50 px-4 py-2 text-white shadow-md">
                      <p className="text-xs sm:text-sm font-bold tracking-wider text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        &ldquo;WAIT A MINUTE...&rdquo;
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.05, duration: 0.45 }}
                      className="max-w-[85%] rounded-2xl rounded-tr-xs bg-purple-500/35 border border-purple-300/40 px-4 py-2 text-white shadow-md"
                    >
                      <p className="text-xs sm:text-sm text-white/95 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        &ldquo;Did I just read what I think I read?&rdquo;
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.45, duration: 0.45 }}
                      className="max-w-[88%] rounded-2xl rounded-tr-xs bg-purple-500/35 border border-purple-300/40 px-4 py-2.5 text-white shadow-md"
                    >
                      <p className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        &ldquo;Because my dictionary has a{' '}
                        <span className="font-bold text-amber-300 underline decoration-rose-300">
                          VERY
                        </span>{' '}
                        different interpretation of those two words.&rdquo;
                      </p>
                    </motion.div>

                    {/* Playful Dramatic Pause */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.85, duration: 0.4 }}
                      className="px-3 py-1 rounded-full bg-black/50 border border-white/25 text-[10px] text-rose-200 font-semibold tracking-widest uppercase"
                    >
                      • • • dramatic pause • • •
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 14, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 2.2, duration: 0.5 }}
                      className="max-w-[90%] rounded-2xl rounded-tr-xs bg-gradient-to-r from-rose-500/50 to-purple-500/50 border border-rose-300/60 px-4 py-2.5 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    >
                      <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        &ldquo;Madam, I think you have accidentally created another chapter.&rdquo;
                      </p>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => goToStep(2)}
                    className="px-4 py-2.5 rounded-full bg-black/50 hover:bg-black/65 border border-white/25 text-white text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileTap={{ scale: 0.96 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  <motion.button
                    onClick={() => goToStep(4)}
                    className="px-6 py-2.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm md:text-base shadow-[0_0_25px_rgba(244,63,94,0.35)] inline-flex items-center gap-2 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Compare Our Dictionaries</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* =========================================================
                SCENE 4 — TWO DICTIONARIES, ONE LOVE STORY
                ========================================================= */}
            {currentStep === 4 && (
              <motion.div
                key="sabkuch-scene-4"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-3 gap-3.5 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full text-left">
                  {/* HER DICTIONARY */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="rounded-2xl bg-gradient-to-br from-rose-950/50 via-black/60 to-purple-950/45 border border-rose-400/35 p-4 sm:p-5 backdrop-blur-md flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-2.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-300/50">
                        <Heart className="w-3.5 h-3.5 text-rose-300" fill="currentColor" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          HER DICTIONARY
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-heading text-white shimmer-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        &ldquo;SAB KUCH Pyaar Me&rdquo;
                      </h3>

                      <p className="text-xs sm:text-sm font-serif italic text-rose-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        Everything in love.
                      </p>

                      <p className="text-xs sm:text-[13px] text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        The little things, the big things, affection, care, understanding, companionship, laughter, forgiveness, and choosing each other every single day.
                      </p>

                      <p className="text-xs sm:text-[13px] text-purple-100 leading-relaxed pt-2 border-t border-white/15 font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        The beautiful idea that everything becomes more meaningful when it is surrounded by love.
                      </p>
                    </div>
                  </motion.div>

                  {/* MY DICTIONARY */}
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="rounded-2xl bg-gradient-to-br from-purple-950/50 via-black/60 to-rose-950/45 border border-purple-300/35 p-4 sm:p-5 backdrop-blur-md flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-2.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-300/50">
                        <Flame className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          MY DICTIONARY
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-heading text-white shimmer-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        &ldquo;SAB KUCH&rdquo;
                      </h3>

                      <p className="text-xs sm:text-sm font-serif italic text-amber-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        A phrase with a very special history.
                      </p>

                      <ul className="text-xs sm:text-[13px] text-white/95 space-y-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        <li>• A certain December night.</li>
                        <li>• A certain tradition.</li>
                        <li>• A certain husband with a mischievous imagination.</li>
                      </ul>

                      <p className="text-xs sm:text-[13px] text-rose-200 leading-relaxed pt-2 border-t border-white/15 font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        And absolutely no ability to read those two words without remembering their original meaning.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Humorous Disclaimer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="w-full rounded-xl bg-black/55 border border-white/25 px-4 py-2.5 text-center shadow-md"
                >
                  <p className="text-[11px] sm:text-xs font-serif italic text-rose-200 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Disclaimer: Husband accepts that his interpretation may not always match the original sentence.&rdquo;
                  </p>
                </motion.div>

                <div className="flex items-center gap-3 pt-1">
                  <motion.button
                    onClick={() => goToStep(3)}
                    className="px-4 py-2.5 rounded-full bg-black/50 hover:bg-black/65 border border-white/25 text-white text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileTap={{ scale: 0.96 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  <motion.button
                    onClick={() => goToStep(5)}
                    className="px-6 py-2.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm md:text-base shadow-[0_0_25px_rgba(244,63,94,0.35)] inline-flex items-center gap-2 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Hear The Official Verdict</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* =========================================================
                SCENE 5 — THE OFFICIAL VERDICT
                ========================================================= */}
            {currentStep === 5 && (
              <motion.div
                key="sabkuch-scene-5"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-4 gap-4 w-full"
              >
                <div className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-rose-950/50 via-black/60 to-purple-950/50 border border-rose-400/35 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-3.5 relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/25 border border-amber-300/50"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-amber-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      AFTER CAREFUL INVESTIGATION...
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-sm sm:text-base font-heading tracking-[0.15em] text-rose-200 font-bold uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    THE COURT OF LOVE HAS REACHED ITS VERDICT.
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="py-3.5 px-4 rounded-xl bg-black/55 border border-rose-300/45 space-y-1"
                  >
                    <h3 className="text-xl sm:text-2xl font-heading text-white shimmer-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      SAB KUCH Pyaar Mein
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      One phrase. • Two interpretations. • One beautiful relationship.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="text-xs sm:text-sm text-white/95 font-serif italic space-y-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    <p>&ldquo;She meant everything in love.</p>
                    <p>He heard something else entirely.</p>
                    <p>And somehow, both ended up becoming another memory worth keeping.&rdquo;</p>
                  </motion.div>

                  {/* Animated Official Stamp */}
                  <motion.div
                    initial={{ opacity: 0, scale: 1.6, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3 }}
                    transition={{ delay: 1.35, type: 'spring', stiffness: 220, damping: 14 }}
                    className="mt-2 inline-block px-4 py-2 rounded-lg border-2 border-emerald-300/90 bg-emerald-950/70 shadow-[0_0_25px_rgba(52,211,153,0.4)]"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-emerald-200 font-heading text-[11px] sm:text-xs tracking-[0.18em] uppercase font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>APPROVED — A NEW CHAPTER IN OUR STORY.</span>
                    </div>
                  </motion.div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => goToStep(4)}
                    className="px-4 py-2.5 rounded-full bg-black/50 hover:bg-black/65 border border-white/25 text-white text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileTap={{ scale: 0.96 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  <motion.button
                    onClick={() => goToStep(6)}
                    className="px-6 py-2.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm md:text-base shadow-[0_0_25px_rgba(244,63,94,0.35)] inline-flex items-center gap-2 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>The Actual Love Behind It</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* =========================================================
                SCENE 6 — THE ACTUAL LOVE BEHIND THE JOKE
                ========================================================= */}
            {currentStep === 6 && (
              <motion.div
                key="sabkuch-scene-6"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-3 gap-3.5 w-full"
              >
                <div className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-rose-950/50 via-black/60 to-purple-950/50 border border-rose-400/35 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/25 border border-rose-300/45">
                    <Feather className="w-3.5 h-3.5 text-rose-200" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      From My Heart
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-serif italic text-rose-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Jokes apart, my love...&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Your version of SAB KUCH is probably the more beautiful one.&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Because when I think about everything I want in life, I don&apos;t just think about the big moments.&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-serif italic bg-black/50 rounded-xl p-3.5 border border-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;I think about your little conversations, your silly expressions, your laughter, your stubbornness, your innocence, the way you play along with my nonsense, and all the ordinary days that become extraordinary simply because you&apos;re in them.&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-rose-200 font-medium pt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;And if there is one thing I truly want...&rdquo;
                  </p>

                  <div className="py-2.5 px-5 rounded-xl bg-black/55 border border-rose-400/50 inline-block shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                    <p className="text-base sm:text-xl font-heading text-white shimmer-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      &ldquo;It&apos;s SAB KUCH Pyaar Mein.&rdquo;
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Everything with you. Everything because of you. Everything, as long as it&apos;s us.&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Thank you for accidentally giving me another chapter to write about you.&rdquo;
                  </p>

                  <p className="text-sm sm:text-base font-heading text-rose-200 font-bold pt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;Yours, in every meaning of SAB KUCH. ❤️&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => goToStep(5)}
                    className="px-4 py-2.5 rounded-full bg-black/50 hover:bg-black/65 border border-white/25 text-white text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileTap={{ scale: 0.96 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  <motion.button
                    onClick={() => goToStep(7)}
                    className="px-6 py-2.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm md:text-base shadow-[0_0_25px_rgba(244,63,94,0.35)] inline-flex items-center gap-2 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>One Important Question...</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* =========================================================
                SCENE 7 — A LITTLE INTERACTIVE SURPRISE & COMPLETION
                ========================================================= */}
            {currentStep === 7 && (
              <motion.div
                key="sabkuch-scene-7"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center my-auto py-2 sm:py-3 gap-3.5 w-full"
              >
                <div className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-rose-950/50 via-black/60 to-purple-950/50 border border-rose-400/35 p-4 sm:p-6 backdrop-blur-md shadow-xl space-y-3.5">
                  <p className="text-xs sm:text-sm font-serif italic text-rose-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    &ldquo;One important question, madam...&rdquo;
                  </p>
                  <h2 className="text-base sm:text-xl font-heading text-white shimmer-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    &ldquo;Which dictionary should we officially adopt?&rdquo;
                  </h2>

                  {/* Two Choice Buttons */}
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        setSelectedDictionary('her');
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedDictionary === 'her'
                          ? 'bg-rose-500/45 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.45)]'
                          : 'bg-black/45 border-white/25 hover:bg-black/60'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          Option A
                        </p>
                        <p className="text-xs sm:text-sm font-heading text-white font-semibold mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          HER DICTIONARY — SAB KUCH Pyaar Mein ❤️
                        </p>
                      </div>
                      <Heart
                        className={`w-5 h-5 shrink-0 ${
                          selectedDictionary === 'her' ? 'text-rose-200' : 'text-white/70'
                        }`}
                        fill={selectedDictionary === 'her' ? 'currentColor' : 'none'}
                      />
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        hapticTap();
                        setSelectedDictionary('my');
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedDictionary === 'my'
                          ? 'bg-purple-500/45 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                          : 'bg-black/45 border-white/25 hover:bg-black/60'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-amber-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          Option B
                        </p>
                        <p className="text-xs sm:text-sm font-heading text-white font-semibold mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          MY DICTIONARY — SAB KUCH 😂
                        </p>
                      </div>
                      <Sparkles
                        className={`w-5 h-5 shrink-0 ${
                          selectedDictionary === 'my' ? 'text-amber-300' : 'text-white/70'
                        }`}
                      />
                    </motion.button>
                  </div>

                  {/* Interactive Reaction Popup inside Card */}
                  <AnimatePresence mode="wait">
                    {selectedDictionary && (
                      <motion.div
                        key={selectedDictionary}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-xl bg-black/60 border border-rose-300/50 p-3.5 space-y-2 text-center shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                      >
                        {selectedDictionary === 'her' ? (
                          <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            &ldquo;Approved. But I reserve the right to misunderstand you occasionally.&rdquo;
                          </p>
                        ) : (
                          <p className="text-xs sm:text-sm font-semibold text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            &ldquo;I KNEW IT! I knew you were secretly supporting my interpretation.&rdquo;
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Final Closing Note */}
                  <div className="pt-2.5 border-t border-white/15 space-y-1.5">
                    <p className="text-xs sm:text-sm text-white/95 font-serif italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      &ldquo;Unfortunately, there is no escaping this chapter now.&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-rose-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      &ldquo;Some couples have love stories. We have an entire dictionary of our own. ❤️&rdquo;
                    </p>
                  </div>
                </div>

                {/* Navigation & Continue to Promise */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full pt-1">
                  <motion.button
                    onClick={() => goToStep(6)}
                    className="px-4 py-2 rounded-full bg-black/50 hover:bg-black/65 border border-white/25 text-white text-xs inline-flex items-center gap-1 cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileTap={{ scale: 0.96 }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous Scene</span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      hapticTap();
                      onNext();
                    }}
                    className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px] cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 25px rgba(255,255,255,0.4)'
                    }}
                    whileTap={{
                      scale: 0.98,
                      boxShadow: '0 0 40px rgba(255,255,255,0.8)'
                    }}
                  >
                    Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
