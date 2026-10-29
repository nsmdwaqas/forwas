import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Smile, 
  Heart, 
  Sparkles, 
  Maximize2, 
  X, 
  MessageCircleHeart,
  Send
} from 'lucide-react';
import emojiScreenshot from '../../assets/k.jpeg';

interface SceneEmojiProps {
  onNext: () => void;
}

export function SceneEmoji({ onNext }: SceneEmojiProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; x: number; y: number }[]>([]);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const triggerEmojiEffect = (e: React.MouseEvent) => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newItems = Array.from({ length: 4 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() * 40 - 20),
      y: y + (Math.random() * 20 - 10)
    }));

    setFloatingEmojis(prev => [...prev, ...newItems]);
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => !newItems.some(n => n.id === item.id)));
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Smile className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <span className="text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] select-none">
              😘
            </span>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE EMOJI
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Our First Kiss Emojis • A Feeling of Intimacy Far Apart
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
              <span className="text-sm">😘</span>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                First Kiss Emoji • 190 KM Apart
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              29 Oct 2026 • 11:00 AM IST
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
            <div className="p-2 sm:p-3 bg-zinc-950 flex flex-col items-center justify-center">
              <img 
                src={emojiScreenshot} 
                alt="First Kiss Emoji Chat Screenshot"
                className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
            <div className="px-3.5 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
              <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>&ldquo;😘😘&rdquo; • Raw Chat</span>
              </span>
              <span className="text-gold-light text-[11px] flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                <Maximize2 className="w-3 h-3" />
                <span>Tap to view full chat</span>
              </span>
            </div>
          </motion.div>

          {/* The Intimacy Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/50 to-purple-950/40 border border-rose-400/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <Send className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                The 11:00 AM Kiss Across The Distance
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              On 29 October 2026 at 11:00 AM, in the quiet warmth of late morning, we sent each other the blowing kiss emoji for the very first time. Separated by 190 kilometers, an unspoken intimacy wrapped around both our hearts — sudden, sweet, and wonderfully real.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-purple-100 font-serif italic text-center leading-relaxed">
              <span className="text-xl sm:text-2xl not-italic block mb-1">
                😘😘 ❤️
              </span>
              &ldquo;Sometimes a tiny symbol carries the weight of a million unsaid touches.&rdquo;
            </div>
          </motion.div>

          {/* Poetic & Interactive Reflection Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/30 text-rose-200 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Intimacy Beyond Distance
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;Miles apart, yet close enough for our screens to blush. Every kiss emoji sent was a promise that one day soon, distance will only be a memory we look back on together.&rdquo;
            </p>

            {/* Interactive Emoji Reaction Button */}
            <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerEmojiEffect}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/40 text-rose-100 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] font-medium' 
                    : 'bg-white/15 hover:bg-white/20 text-white border border-white/25'
                }`}
              >
                <span>😘</span>
                <span>{liked ? 'Sent with Love 😘🤍' : 'Send a Kiss Across 190 KM'}</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Floating Emojis Burst */}
        {floatingEmojis.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.8, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-2xl select-none"
            style={{ left: item.x, top: item.y }}
          >
            😘
          </motion.div>
        ))}

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
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

      </div>

      {/* Fullscreen Lightbox Modal for Emoji Screenshot */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 touch-none"
            onClick={() => {
              hapticTap('light');
              setIsModalOpen(false);
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                hapticTap('light');
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Close screenshot preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-sm sm:max-w-md w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 bg-black flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2">
                <img 
                  src={emojiScreenshot} 
                  alt="Full Chat Screenshot" 
                  className="w-full h-auto max-h-[72vh] object-contain rounded-2xl block mx-auto"
                />
              </div>
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center shrink-0">
                <p className="text-white text-xs sm:text-sm font-medium">
                  &ldquo;😘😘&rdquo; • Our First Kiss Emojis
                </p>
                <p className="text-white/70 text-[11px] mt-0.5 font-mono">
                  29 Oct 2026, 11:00 AM IST • The Emoji
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
