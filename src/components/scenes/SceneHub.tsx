import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Lock, 
  Gift,
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
  ArrowLeft,
  BellRing,
  ShieldCheck,
  Video,
  RotateCw,
  Compass,
  Flame,
  Smile,
  Fingerprint,
  HeartPulse
} from 'lucide-react';
import { PWAAndNotifyBar } from '../PWAAndNotifyBar';

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
  onNotification?: () => void;
  onThePromise: () => void;
  onFacetime: () => void;
  onRecurrence: () => void;
  onApart: () => void;
  onEgo: () => void;
  onShameless: () => void;
  onTalk: () => void;
  onEmoji: () => void;
  onCommitment: () => void;
  onDirtyTalk: () => void;
  onLoveU: () => void;
  onMissCounter: () => void;
  onConversation: () => void;
  onMidnightCall: () => void;
  onOpenGiftBook?: () => void;
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
  onLovenama,
  onNotification,
  onThePromise,
  onFacetime,
  onRecurrence,
  onApart,
  onEgo,
  onShameless,
  onTalk,
  onEmoji,
  onCommitment,
  onDirtyTalk,
  onLoveU,
  onMissCounter,
  onConversation,
  onMidnightCall,
  onOpenGiftBook
}: SceneHubProps) {
  const [activeCategory, setActiveCategoryState] = useState<CategoryType>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('ws_hub_category');
      if (saved === 'story' || saved === 'words' || saved === 'promises' || saved === 'extras') {
        return saved;
      }
    }
    return null;
  });

  const setActiveCategory = (cat: CategoryType) => {
    setActiveCategoryState(cat);
    if (typeof window !== 'undefined') {
      if (cat) {
        sessionStorage.setItem('ws_hub_category', cat);
      } else {
        sessionStorage.removeItem('ws_hub_category');
      }
    }
  };
  const [lockedShake, setLockedShake] = useState(false);
  const [giftLockedShake, setGiftLockedShake] = useState(false);
  const [showGiftLockedHint, setShowGiftLockedHint] = useState(false);
  const [isGiftUnlocked] = useState(true);
  const [giftTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const controls = useAnimation();
  const giftControls = useAnimation();

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

  const handleGiftLockedClick = async () => {
    hapticTap('locked');
    setGiftLockedShake(true);
    setShowGiftLockedHint(true);

    await giftControls.start({
      x: [-8, 8, -6, 6, -3, 3, 0],
      rotate: [-4, 4, -3, 3, 0],
      transition: { duration: 0.45, ease: "easeInOut" }
    });
    setGiftLockedShake(false);
  };

  useEffect(() => {
    if (!showGiftLockedHint) return;
    const timeout = setTimeout(() => setShowGiftLockedHint(false), 3200);
    return () => clearTimeout(timeout);
  }, [showGiftLockedHint]);

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

              {/* Install App & Partner Notification Bar */}
              <div className="pt-2 border-t border-white/10">
                <PWAAndNotifyBar compact />
              </div>
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

                    {/* The Facetime */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onFacetime();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Facetime</span>
                      <Video className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Apart */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onApart();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Apart</span>
                      <Compass className="w-5 h-5 text-white/90 group-hover:rotate-45 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Shameless */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onShameless();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Shameless</span>
                      <Flame className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>

                    {/* The Talk */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onTalk();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Talk</span>
                      <PhoneCall className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>

                    {/* The Midnight Call */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onMidnightCall();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Midnight Call</span>
                      <PhoneCall className="w-5 h-5 text-gold-light group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(232,180,200,0.8)]" />
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

                    {/* The Dirty Talk */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onDirtyTalk();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Dirty Talk</span>
                      <Flame className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>

                    {/* The Love U */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onLoveU();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Love U</span>
                      <AudioLines className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>

                    {/* The Conversation */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onConversation();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Conversation</span>
                      <PhoneCall className="w-5 h-5 text-gold-light group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(232,180,200,0.8)]" />
                    </motion.button>
                  </>
                )}

                {/* ---------- OUR PROMISES ---------- */}
                {activeCategory === 'promises' && (
                  <>
                    {/* The Promise */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onThePromise();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Promise</span>
                      <ShieldCheck className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Commitment */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onCommitment();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Commitment</span>
                      <Fingerprint className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>

                    {/* The Ego */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onEgo();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Ego</span>
                      <HeartHandshake className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

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

                    {/* The Notification */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        if (onNotification) onNotification();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Notification</span>
                      <BellRing className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Recurrence */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onRecurrence();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Recurrence</span>
                      <RotateCw className="w-5 h-5 text-white/90 group-hover:rotate-180 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </motion.button>

                    {/* The Emoji */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onEmoji();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Emoji</span>
                      <Smile className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>

                    {/* The Miss Counter */}
                    <motion.button
                      onClick={() => {
                        hapticTap();
                        onMissCounter();
                      }}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
                      whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
                    >
                      <span>The Miss Counter</span>
                      <HeartPulse className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    </motion.button>
                  </>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Gift Button — Locked until 9 Nov 11:30 AM IST, then unlocks automatically */}
      <AnimatePresence>
        {activeCategory === null && (
          <motion.div
            key="floating-gift-container"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2"
          >
            {/* Subtle Locked Message Popover on Click (when locked) */}
            <AnimatePresence>
              {!isGiftUnlocked && showGiftLockedHint && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="px-3.5 py-2 rounded-2xl bg-black/65 backdrop-blur-md border border-rose-300/40 text-white shadow-[0_8px_28px_rgba(244,63,94,0.35)] text-right max-w-[245px]"
                >
                  <div className="flex items-center justify-end gap-1.5 text-rose-200 text-xs font-medium">
                    <Lock className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                    <span>Surprise Gift Locked</span>
                  </div>
                  <p className="text-[11px] text-white/85 mt-0.5 leading-snug">
                    Unlocks on <span className="text-gold-light font-semibold">9 Nov at 11:30 AM</span> ✨
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {isGiftUnlocked ? (
              /* UNLOCKED STATE: Opens More Than Salaam Book Reader */
              <motion.button
                type="button"
                onClick={() => {
                  hapticTap();
                  if (onOpenGiftBook) onOpenGiftBook();
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(232,180,200,0.55)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-2xl backdrop-blur-xl transition-all cursor-pointer select-none bg-gradient-to-r from-rose-500/35 via-pink-500/25 to-amber-400/25 hover:from-rose-500/45 hover:to-amber-400/35 border border-gold-light/60 shadow-[0_8px_32px_rgba(244,63,94,0.38)]"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-400/40 to-amber-300/30 border border-gold-light/50 shrink-0 shadow-inner"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light drop-shadow-[0_0_10px_rgba(232,180,200,0.95)]" />
                  <motion.span
                    animate={{ scale: [1, 1.18, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border border-white/60 flex items-center justify-center shadow-md"
                  >
                    <BookOpen className="w-2.5 h-2.5 text-white" />
                  </motion.span>
                </motion.div>

                <div className="flex flex-col items-start text-left pr-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-gold-light flex items-center gap-1">
                      Gift Unlocked
                      <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
                    </span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-sm flex items-center gap-1.5">
                    <span>More Than Salaam</span>
                    <span className="text-[11px] font-sans font-normal text-rose-100/90">• Read 📖</span>
                  </div>
                </div>
              </motion.button>
            ) : (
              /* LOCKED STATE: Live Countdown to 9 Nov 11:30 AM IST */
              <motion.button
                type="button"
                onClick={handleGiftLockedClick}
                animate={giftControls}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl backdrop-blur-xl transition-all cursor-pointer select-none ${
                  giftLockedShake
                    ? 'bg-rose-500/30 border border-rose-300/80 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                    : 'bg-white/15 hover:bg-white/20 border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.28)]'
                }`}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-400/30 to-amber-200/20 border border-white/25 shrink-0"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light drop-shadow-[0_0_8px_rgba(232,180,200,0.8)]" />
                  <motion.span
                    animate={
                      giftLockedShake
                        ? { rotate: [-20, 20, -15, 15, 0], scale: [1, 1.25, 1] }
                        : { scale: [1, 1.08, 1] }
                    }
                    transition={{ duration: giftLockedShake ? 0.4 : 2, repeat: giftLockedShake ? 0 : Infinity }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600/90 border border-white/40 flex items-center justify-center shadow-md"
                  >
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </motion.span>
                </motion.div>

                <div className="flex flex-col items-start text-left pr-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-gold-light">
                      Locked Gift
                    </span>
                    <span className="text-[9px] text-white/60">• 9 Nov, 11:30 AM</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-white tracking-tight tabular-nums drop-shadow-sm">
                    {String(giftTimeLeft.days).padStart(2, '0')}d : {String(giftTimeLeft.hours).padStart(2, '0')}h : {String(giftTimeLeft.minutes).padStart(2, '0')}m : {String(giftTimeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
