import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Lock, 
  Infinity as InfinityIcon, 
  PenTool, 
  Feather, 
  Sparkles, 
  MessageCircleHeart, 
  MessageSquareQuote, 
  AudioLines, 
  HeartHandshake, 
  Music, 
  PhoneCall, 
  CalendarHeart,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface SceneHubProps {
  onConfession: () => void;
  onCountdown?: () => void;
  onForever: () => void;
  onLetter: () => void;
  onTimeline: () => void;
  onMessage: () => void;
  onProposal: () => void;
  onAnswers: () => void;
  onVoices: () => void;
  onSong: () => void;
  onCall: () => void;
  onLovenama: () => void;
  onOneMonth?: () => void;
}

type CategoryType = 'story' | 'words' | 'promises' | 'extras' | null;

export function SceneHub({ 
  onConfession, 
  onCountdown,
  onForever, 
  onLetter, 
  onTimeline, 
  onMessage, 
  onProposal, 
  onAnswers, 
  onVoices, 
  onSong, 
  onCall,
  onLovenama 
}: SceneHubProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(null);
  const [lockedShake, setLockedShake] = useState(false);
  const controls = useAnimation();

  const hapticTap = (type: 'default' | 'locked' = 'default') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'locked') {
        navigator.vibrate([40, 50, 40]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const handleLockedClick = async () => {
    hapticTap('locked');
    setLockedShake(true);

    await controls.start({ 
      x: [-12, 12, -9, 9, -5, 5, 0], 
      transition: { duration: 0.45, ease: "easeInOut" } 
    });
    setLockedShake(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md mx-auto text-center px-4 my-auto">
      <motion.div 
        className="glass-panel w-full p-6 sm:p-8 md:p-10 relative overflow-y-auto max-h-[88vh] flex flex-col gap-3 sm:gap-4 custom-scrollbar"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {activeCategory === null ? (
            /* ========================================================
               MAIN CATEGORIZED CHOOSE CHAPTER VIEW
               (Exact typography, colors & button styling from original)
               ======================================================== */
            <motion.div
              key="main-categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full flex flex-col gap-3 sm:gap-4"
            >
              {/* Title - exactly as original */}
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl font-heading mb-1 sm:mb-2 text-white text-shadow-elegant shimmer-text shrink-0"
                initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                Our Chapter
              </motion.h1>

              {/* 1. TOP ROW: Lovenama (1 Row) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
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
                  <span>Lovenama</span>
                  <Feather className="w-5 h-5 text-white/90 group-hover:-rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </motion.button>
              </motion.div>

              {/* 2. ROW 1: Story / Promises (2 in 1 Row) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  onClick={() => {
                    hapticTap();
                    setActiveCategory('story');
                  }}
                  className="w-full px-3.5 py-3.5 sm:px-4 sm:py-4 glass-button text-white rounded-2xl font-medium text-sm sm:text-base md:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                  whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                >
                  <span className="truncate">Story</span>
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] shrink-0 ml-1.5" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.8 }}
                  onClick={() => {
                    hapticTap();
                    setActiveCategory('promises');
                  }}
                  className="w-full px-3.5 py-3.5 sm:px-4 sm:py-4 glass-button text-white rounded-2xl font-medium text-sm sm:text-base md:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                  whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                >
                  <span className="truncate">Promises</span>
                  <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] shrink-0 ml-1.5" />
                </motion.button>
              </div>

              {/* 3. ROW 2: Words / Extra (2 in 1 Row) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.8 }}
                  onClick={() => {
                    hapticTap();
                    setActiveCategory('words');
                  }}
                  className="w-full px-3.5 py-3.5 sm:px-4 sm:py-4 glass-button text-white rounded-2xl font-medium text-sm sm:text-base md:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                  whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                >
                  <span className="truncate">Words</span>
                  <MessageCircleHeart className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] shrink-0 ml-1.5" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.8 }}
                  onClick={() => {
                    hapticTap();
                    setActiveCategory('extras');
                  }}
                  className="w-full px-3.5 py-3.5 sm:px-4 sm:py-4 glass-button text-white rounded-2xl font-medium text-sm sm:text-base md:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                  whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                >
                  <span className="truncate">Extra</span>
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] shrink-0 ml-1.5" />
                </motion.button>
              </div>

              {/* 4. BOTTOM ROW: Locked (1 Row) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
              >
                <motion.button
                  onClick={handleLockedClick}
                  animate={controls}
                  className={`w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
                    lockedShake 
                      ? 'bg-rose-500/20 border border-rose-400/80 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                      : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Locked</span>
                  <motion.div
                    animate={lockedShake ? { rotate: [-15, 15, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Lock className="w-5 h-5 text-white/60" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            /* ========================================================
               CATEGORY SUB-WINDOW
               (Exact button styles, fonts, and icons from original)
               ======================================================== */
            <motion.div
              key={`category-${activeCategory}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full flex flex-col gap-3 sm:gap-4"
            >
              {/* Back Button */}
              <div className="flex items-center justify-start mb-1">
                <motion.button
                  onClick={() => {
                    hapticTap();
                    setActiveCategory(null);
                  }}
                  className="px-4 py-1.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Our Chapter</span>
                </motion.button>
              </div>

              {/* Category Title */}
              <h1 className="text-2xl sm:text-3xl font-heading mb-1 text-white text-shadow-elegant shimmer-text">
                {activeCategory === 'story' && 'Story'}
                {activeCategory === 'words' && 'Words'}
                {activeCategory === 'promises' && 'Promises'}
                {activeCategory === 'extras' && 'Extra'}
              </h1>

              {/* Chapters in this Category */}
              <div className="flex flex-col gap-3 sm:gap-4">
                
                {/* ---------- OUR STORY ---------- */}
                {activeCategory === 'story' && (
                  <>
                    {/* The Timeline */}
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

                    {/* The Message */}
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

                    {/* The Voices */}
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

                    {/* The Call */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onCall();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Call</span>
                      <PhoneCall className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>
                  </>
                )}

                {/* ---------- OUR WORDS ---------- */}
                {activeCategory === 'words' && (
                  <>
                    {/* The Letter */}
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
                      <PenTool className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Confession */}
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

                    {/* The Answers */}
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
                  </>
                )}

                {/* ---------- OUR PROMISES ---------- */}
                {activeCategory === 'promises' && (
                  <>
                    {/* The Forever */}
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

                    {/* The Big Day */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        if (onCountdown) onCountdown();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Big Day</span>
                      <CalendarHeart className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Proposal */}
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
                  </>
                )}

                {/* ---------- OUR EXTRAS ---------- */}
                {activeCategory === 'extras' && (
                  <>
                    {/* The Song */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onSong();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Song</span>
                      <Music className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>
                  </>
                )}

                {/* Category Sub-window Locked Button */}
                <motion.button
                  onClick={handleLockedClick}
                  animate={controls}
                  className={`w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
                    lockedShake 
                      ? 'bg-rose-500/20 border border-rose-400/80 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                      : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Locked</span>
                  <motion.div
                    animate={lockedShake ? { rotate: [-15, 15, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Lock className="w-5 h-5 text-white/60" />
                  </motion.div>
                </motion.button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
