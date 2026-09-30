import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  BellRing, 
  Heart, 
  Sparkles, 
  Clock, 
  Sunrise, 
  MessageCircleHeart,
  Maximize2,
  X
} from 'lucide-react';
import notiImg from '../../assets/noti.jpeg';

interface SceneNotificationProps {
  onNext: () => void;
}

export function SceneNotification({ onNext }: SceneNotificationProps) {
  const [liked, setLiked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
  };

  const handleOpenModal = () => {
    hapticTap('light');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    hapticTap('light');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <BellRing className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE NOTIFICATION
          </h1>
          <p className="font-heading italic text-white/90 text-xs sm:text-sm mt-0.5 tracking-wide">
            5:11 AM • 19 Missed Calls • My favorite notification in the world
          </p>
        </motion.div>

        {/* Scrollable Container with Smooth Mobile Touch Scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Subtitle / Context Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-between text-xs sm:text-sm text-gold-light/95 border-b border-white/10 pb-2 flex-wrap gap-2 shrink-0"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sunrise className="w-4 h-4 text-amber-300" />
              The Wake-Up Routine
            </span>
            <span className="text-[11px] sm:text-xs text-white/70 font-mono">
              5:11 AM • Lockscreen Memory
            </span>
          </motion.div>

          {/* Mobile-Friendly Raw Image Showcase Card (shrink-0 + explicit min-height prevents collapsing) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="shrink-0 w-full max-w-[340px] sm:max-w-sm mx-auto relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/35 bg-black/80 backdrop-blur-xl group cursor-pointer"
            onClick={handleOpenModal}
          >
            {/* The Raw Uploaded Notification Image */}
            <div className="relative w-full min-h-[300px] sm:min-h-[330px] rounded-3xl bg-zinc-950 flex flex-col items-center justify-center p-1.5">
              <img 
                src={notiImg} 
                alt="Notification Screenshot - 19 Missed Calls from ruhi.. ❤️"
                className="w-full h-auto max-h-[360px] object-contain rounded-2xl block mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/assets/noti.jpeg') {
                    target.src = '/assets/noti.jpeg';
                  } else {
                    target.src = '/noti.jpeg';
                  }
                }}
              />

              {/* Tap to expand prompt */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white/90 border border-white/20 flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3 h-3 text-gold-light" />
                <span>Tap to view</span>
              </div>

              {/* Bottom pill tag */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] sm:text-xs text-white/95 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 shadow-lg">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>19 missed calls • 5:11 AM</span>
                </span>
                <span className="text-gold-light font-medium italic">ruhi.. ❤️</span>
              </div>
            </div>
          </motion.div>

          {/* The Raw Story Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="shrink-0 w-full bg-white/5 border border-white/15 rounded-2xl p-3.5 sm:p-4.5 backdrop-blur-md shadow-md flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-xs sm:text-sm text-gold-light font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                The Morning Routine
              </span>
              <span className="text-[11px] text-white/60 font-mono">
                5:11 AM
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
              She used to give me a call to wake me up. My day begins with her <span className="text-rose-200 font-semibold">Good Morning</span> and softly ends with her <span className="text-rose-200 font-semibold">Good Night</span>.
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/90 italic leading-relaxed">
              &ldquo;I woke up to 19 notifications on my lockscreen from her. Anyone else would see 19 missed calls, but all I see is how deeply she cared to make sure I woke up on time.&rdquo;
            </div>
          </motion.div>

          {/* Poetic Reflection: My Favorite Notification */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-rose-500/15 border border-rose-300/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide">
              My Favorite Notification
            </h3>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;Out of every message, ring, and ping I have ever received on my phone, this will always be my absolute favorite notification in the entire world.&rdquo;
            </p>

            {/* Interactive Heart Reaction */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerHeartEffect}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                    : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/15'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{liked ? 'Forever Loved' : 'Cherish this memory'}</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Floating Heart Effect */}
        {floatingHeart && (
          <motion.div
            key={floatingHeart.id}
            initial={{ opacity: 1, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.6, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-rose-400"
            style={{ left: floatingHeart.x, top: floatingHeart.y }}
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </motion.div>
        )}

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
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

      </div>

      {/* Fullscreen Mobile-Friendly Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 touch-none"
            onClick={handleCloseModal}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-sm sm:max-w-md w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={notiImg} 
                alt="Notification Fullscreen View" 
                className="w-full h-auto max-h-[75vh] object-contain rounded-3xl block mx-auto"
              />
              <div className="p-3 bg-black/80 text-center">
                <p className="text-white text-sm font-medium">
                  &ldquo;My favorite notification in the world&rdquo;
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  19 Missed Calls • 5:11 AM
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
