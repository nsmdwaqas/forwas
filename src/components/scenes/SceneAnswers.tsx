import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  MessageSquareHeart, 
  Sparkles, 
  Layers, 
  List, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Heart
} from 'lucide-react';

interface SceneAnswersProps {
  onNext: () => void;
}

interface QAItem {
  id: number;
  question: string;
  theme: string;
  shajer: string;
  waqas: string;
}

const qaList: QAItem[] = [
  {
    id: 1,
    question: "My Name In Your Phone",
    theme: "The names we gave to each other",
    shajer: "Jaana ♡",
    waqas: "ruhi ♡"
  },
  {
    id: 2,
    question: "One Word For Me",
    theme: "Our entire universe captured in a syllable",
    shajer: "dunya",
    waqas: "Life"
  },
  {
    id: 3,
    question: "I Am Your",
    theme: "Who we were destined to become",
    shajer: "everything",
    waqas: "Special person jo fate ne milaya hai"
  },
  {
    id: 4,
    question: "Your First Impression Of Me",
    theme: "When the universe first introduced us",
    shajer: "you are the first person i said yes to.. so obviously someone i like to spend my life wid",
    waqas: "Mashallah.. So that's the person i have been looking for.. Allah has created for me."
  },
  {
    id: 5,
    question: "My Best Quality",
    theme: "What shines the brightest inside",
    shajer: "understanding",
    waqas: "Caring just like my Ammi. ( Probably the only 2 women in this world i have been attached this much )"
  },
  {
    id: 6,
    question: "My Biggest Weakness",
    theme: "Where love becomes an unyielding shield",
    shajer: "idk",
    waqas: "None. Agar kuch hoga tobhi i'm there to be your strength all the time."
  },
  {
    id: 7,
    question: "One Thing You Like About Me",
    theme: "What matters the most in this entire world",
    shajer: "the way u make me understand everything with patience",
    waqas: "Nek ( Tahajjud , Roza , Namaaz ) the only thing which matters to me the most in this entire world."
  },
  {
    id: 8,
    question: "One Thing You Want To Change In Me",
    theme: "Honesty and gentle acceptance",
    shajer: "your overthinking",
    waqas: "Nothing for now.."
  },
  {
    id: 9,
    question: "Our Relationship Is...?",
    theme: "How two souls define their bond",
    shajer: "bestiee for life",
    waqas: "Twin Flame"
  },
  {
    id: 10,
    question: "One Promise For Me",
    theme: "The vows etched before forever",
    shajer: "my feelings for u will always be the same NO MATTER WHAT",
    waqas: "i will never leave your side.."
  },
  {
    id: 11,
    question: "One Message For Me",
    theme: "The words that guide us to the end",
    shajer: "be like this wid me the way you are now",
    waqas: "Chalo last tak pyaar karte hain.."
  }
];

export function SceneAnswers({ onNext }: SceneAnswersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const touchStartX = useRef<number | null>(null);

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const handleNext = () => {
    if (currentIndex < qaList.length - 1) {
      setDirection('right');
      setCurrentIndex((prev) => prev + 1);
      hapticTap();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setCurrentIndex((prev) => prev - 1);
      hapticTap();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next
        handleNext();
      } else {
        // Swiped right -> prev
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const currentQA = qaList[currentIndex];

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 min-h-full my-auto">
      <motion.div 
        className="glass-panel w-full p-4 sm:p-6 md:p-8 relative flex flex-col h-[85vh] max-h-[85vh] min-h-[440px] sm:min-h-[540px]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareHeart className="w-6 h-6 sm:w-8 sm:h-8 text-gold-light drop-shadow-[0_0_10px_rgba(232,180,200,0.7)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE ANSWERS
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm md:text-base tracking-wide">
            our first Q&A • the raw truth of two hearts
          </p>

          {/* Mode Switcher */}
          <div className="mt-2.5 inline-flex items-center bg-black/25 p-1 rounded-full border border-white/15 backdrop-blur-md">
            <button
              onClick={() => {
                hapticTap();
                setViewMode('card');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'card' 
                  ? 'bg-white/25 text-white shadow-sm font-semibold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards ({currentIndex + 1}/11)</span>
            </button>
            <button
              onClick={() => {
                hapticTap();
                setViewMode('list');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'list' 
                  ? 'bg-white/25 text-white shadow-sm font-semibold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>All 11</span>
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        {viewMode === 'card' ? (
          <div 
            className="flex-1 flex flex-col justify-between overflow-hidden relative px-1 sm:px-4 py-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Quick-Jump Question Selector Pills */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 py-1 overflow-x-auto max-w-full custom-scrollbar shrink-0 mb-2">
              {qaList.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 'right' : 'left');
                    setCurrentIndex(idx);
                    hapticTap();
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center shrink-0 ${
                    currentIndex === idx 
                      ? 'bg-white text-wine font-bold shadow-[0_0_12px_rgba(255,255,255,0.6)] scale-110' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  aria-label={`Jump to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Question Animated Card */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentQA.id}
                  initial={{ 
                    opacity: 0, 
                    x: direction === 'right' ? 35 : -35,
                    scale: 0.97
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: direction === 'right' ? -35 : 35,
                    scale: 0.97
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full max-w-xl flex flex-col justify-center gap-2.5 sm:gap-3.5"
                >
                  {/* Question Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 border border-white/20 text-gold-light text-xs font-semibold mb-1.5 tracking-wider uppercase shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-gold-light" />
                      <span>Question {currentQA.id} of 11</span>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-heading text-white font-medium tracking-wide">
                      {currentQA.question}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 font-sans italic mt-0.5">
                      {currentQA.theme}
                    </p>
                  </div>

                  {/* Answers Container - Dual Side-by-Side or Stacked on Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 text-left">
                    
                    {/* Shajer's Answer - Dark sleek glass matching (Cards/All 11) */}
                    <div className="relative bg-black/35 border border-white/20 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col justify-between group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                            S
                          </div>
                          <span className="font-heading tracking-wider text-sm font-semibold text-white">
                            Shajer
                          </span>
                        </div>
                        <Quote className="w-3.5 h-3.5 text-white/40" />
                      </div>
                      
                      <p className="font-sans text-sm sm:text-[15px] text-white leading-relaxed font-normal py-1">
                        &ldquo;{currentQA.shajer}&rdquo;
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
                        <Heart className="w-2.5 h-2.5 text-pink-300" /> her answer
                      </div>
                    </div>

                    {/* Waqas's Answer - Soft frosted glass (previous Shajer's pod style) */}
                    <div className="relative bg-gradient-to-br from-white/15 to-white/5 border border-white/25 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col justify-between group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-bold text-white">
                            W
                          </div>
                          <span className="font-heading tracking-wider text-sm font-semibold text-white">
                            Waqas
                          </span>
                        </div>
                        <Quote className="w-3.5 h-3.5 text-white/40" />
                      </div>

                      <p className="font-sans text-sm sm:text-[15px] text-white leading-relaxed font-normal py-1">
                        &ldquo;{currentQA.waqas}&rdquo;
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
                        <Sparkles className="w-2.5 h-2.5 text-gold-light" /> his answer
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step Controls (< Prev / Next >) */}
            <div className="flex items-center justify-between shrink-0 pt-2 px-2 max-w-xl mx-auto w-full">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentIndex === 0 
                    ? 'opacity-30 cursor-not-allowed text-white/40' 
                    : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-[11px] text-white/50 italic hidden sm:inline">
                swipe or tap to explore
              </span>

              <button
                onClick={handleNext}
                disabled={currentIndex === qaList.length - 1}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentIndex === qaList.length - 1 
                    ? 'opacity-30 cursor-not-allowed text-white/40' 
                    : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* List View (All 11 with custom scrollbar) */
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 custom-scrollbar scroll-smooth flex flex-col gap-4 py-2">
            {qaList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 sm:p-4 text-left backdrop-blur-sm shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 text-[11px] font-bold text-white flex items-center justify-center shrink-0">
                    {item.id}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-heading font-medium text-white tracking-wide leading-tight">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="bg-black/35 border border-white/20 rounded-xl p-2.5 text-xs sm:text-sm">
                    <span className="text-white font-heading font-semibold text-[11px] uppercase tracking-wider block mb-0.5">
                      Shajer
                    </span>
                    <p className="text-white/95 leading-snug font-sans">
                      &ldquo;{item.shajer}&rdquo;
                    </p>
                  </div>
                  <div className="bg-white/15 border border-white/25 rounded-xl p-2.5 text-xs sm:text-sm">
                    <span className="text-gold-light font-heading font-semibold text-[11px] uppercase tracking-wider block mb-0.5">
                      Waqas
                    </span>
                    <p className="text-white/95 leading-snug font-sans">
                      &ldquo;{item.waqas}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-2"
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
      </motion.div>
    </div>
  );
}
