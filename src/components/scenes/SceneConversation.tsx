import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  PhoneCall, 
  Heart, 
  Sparkles, 
  Clock, 
  Maximize2, 
  X, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Calendar,
  CheckCircle2,
  Lock,
  Flame,
  MessageCircleHeart
} from 'lucide-react';

interface SceneConversationProps {
  onNext: () => void;
}

export function SceneConversation({ onNext }: SceneConversationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <PhoneCall className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <PhoneCall className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE CONVERSATION
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            1 Hour 6 Minutes • When Two Shy Souls Forgot Time
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
              <Clock className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Duration: 1 Hour 6 Minutes • 9:22 AM
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Friday Morning • ruhi.. ♡
            </div>
          </motion.div>

          {/* Screenshot Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="shrink-0 w-full rounded-2xl overflow-hidden shadow-xl border border-white/25 bg-black/85 backdrop-blur-md group cursor-pointer"
            onClick={() => {
              hapticTap('light');
              setIsModalOpen(true);
            }}
          >
            {/* Header of Screenshot Card */}
            <div className="px-3.5 py-2.5 bg-white/10 flex items-center justify-between border-b border-white/10 text-xs text-white/90">
              <span className="font-mono text-gold-light font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Actual Call Log Screenshot
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-white/75 group-hover:text-white transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                Tap to View Raw
              </span>
            </div>

            {/* Image Preview with Subtle Crop */}
            <div className="relative max-h-72 sm:max-h-80 overflow-hidden flex items-center justify-center bg-black/90">
              <img 
                src="/assets/aistudio/HCall_ca6cd1d2.jpeg" 
                alt="Call Log History showing 1 hour 6 minutes call" 
                className="w-full max-w-sm object-contain rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <span className="font-semibold text-rose-200">ruhi.. ♡ Call History</span>
                <span className="font-mono font-bold text-emerald-300">1 hour 6 minutes</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Contrast Transformation Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-full grid grid-cols-2 gap-2.5 shrink-0"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/60 block mb-0.5">
                Before Today
              </span>
              <span className="text-xs sm:text-sm font-semibold text-rose-200 block">
                9 to 36 Seconds
              </span>
              <p className="text-[11px] text-white/75 mt-1 leading-snug">
                Strict boundaries, missed rings, and shy dawn salaams.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 backdrop-blur-sm shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gold-light block mb-0.5">
                Today at 9:22 AM
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                1 Hour 6 Minutes
              </span>
              <p className="text-[11px] text-white/90 mt-1 leading-snug">
                Our very first long talk in history.
              </p>
            </div>
          </motion.div>

          {/* Raw Emotional Narrative Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="w-full rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl border border-rose-300/25 bg-gradient-to-br from-[#240c21]/95 via-[#2f132c]/85 to-[#19061a]/95 text-left shrink-0"
          >
            {/* Header of Narrative */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-white">
                    The Miracle of One Hour
                  </h3>
                  <p className="font-sans text-[11px] text-rose-200/80">
                    When shyness turned into pure comfort
                  </p>
                </div>
              </div>

              {/* Heart Reaction */}
              <button
                onClick={triggerHeartEffect}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title="Treasure this memory"
              >
                <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Narrative Story */}
            <div className="space-y-3 text-xs sm:text-sm text-white/95 leading-relaxed font-sans font-light">
              <p>
                For months, we held on to an intentional silence before marriage. We deliberately kept our distance — guarding our hearts with quiet respect. Our entire call history was nothing but missed rings, brief nine-second check-ins, or thirty-six seconds of waking each other up for prayer.
              </p>

              <p>
                Then came this Friday morning.
              </p>

              <div className="p-3.5 rounded-xl bg-black/45 border border-rose-300/20 my-2">
                <p className="italic text-rose-100 font-normal text-xs sm:text-[13px] leading-relaxed">
                  &ldquo;She is the shyest person I have ever known. She holds back, she hesitates, she blushes before she even speaks. I still don&apos;t know how she felt so comfortable with me... but for the first time in history, the seconds melted into sixty-six unbroken minutes.&rdquo;
                </p>
              </div>

              <p>
                Around 9:22 AM, the conversation started simply, and neither of us wanted to hang up. Words flowed with an effortless peace, like two souls who had known each other for eternity. We laughed, we shared, we listened to the quiet rhythm of each other&apos;s breathing.
              </p>

              <p>
                Seeing <span className="text-gold-light font-semibold">&ldquo;1 hour 6 minutes&rdquo;</span> on that call screen didn&apos;t just mark a call; it marked the moment our distance vanished forever. Shajer, being comfortable with you is the greatest gift my heart has ever received.
              </p>

              <div className="pt-2 text-right">
                <span className="font-heading italic text-white/90 text-xs sm:text-sm block">
                  Holding every second of your voice close,
                </span>
                <span className="font-heading font-semibold text-gold-light text-sm sm:text-base">
                  Waqas ♡
                </span>
              </div>
            </div>
          </motion.div>

          {/* Poetic Quote Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-black/30 border border-white/10 text-center shrink-0 mb-1"
          >
            <p className="font-heading italic text-xs sm:text-sm text-white/90 leading-relaxed">
              &ldquo;An hour passed like a heartbeat, yet it gave me memories to cherish for a lifetime.&rdquo;
            </p>
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

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap('light');
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

      {/* Raw Screenshot Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-3 sm:p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative w-full max-w-md flex flex-col items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="absolute -top-11 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                src="/assets/aistudio/HCall_ca6cd1d2.jpeg"
                alt="Call Log Fullscreen Screenshot"
                className="w-full max-h-[82vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-white/70 text-xs sm:text-sm mt-3 font-mono tracking-wide">
                Tap anywhere outside or close button to dismiss
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
