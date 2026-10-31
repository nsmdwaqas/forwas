import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Flame, 
  Heart, 
  Sparkles, 
  Moon, 
  Clock, 
  Maximize2, 
  X, 
  MessageCircleHeart
} from 'lucide-react';
import dirtyTalkScreenshot from '../../assets/dirty_talk.jpeg';

interface SceneDirtyTalkProps {
  onNext: () => void;
}

export function SceneDirtyTalk({ onNext }: SceneDirtyTalkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

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

    const emojis = ['❤️', '🤗', '🙈', '💋', '✨'];
    const newItems = emojis.map((emoji, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 30 - 15),
      text: emoji
    }));

    setFloatingParticles(prev => [...prev, ...newItems]);
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(item => !newItems.some(n => n.id === item.id)));
    }, 1500);
  };

  const kissMoments = [
    { spot: 'Forehead', icon: '🕊️', desc: 'A kiss of pure protection & reverence' },
    { spot: 'Eyebrows & Eyelids', icon: '✨', desc: 'Soft whispers over your closed eyes' },
    { spot: 'Nose', icon: '🌸', desc: 'A playful, sweet touch to make you smile' },
    { spot: 'Cheeks', icon: '☺️', desc: 'Where the deepest blush slowly bloomed' },
    { spot: 'Lips', icon: '💋', desc: 'Gentle, breathless, and unforgettable' },
    { spot: 'Hand & Long Hug', icon: '🫂', desc: 'Fingers intertwined in a tight, unending embrace' },
  ];

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
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
            <Flame className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE DIRTY TALK
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Midnight Whispers • From 15 Mins to 38 Mins in Paradise
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
              <Moon className="w-4 h-4 text-purple-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Midnight Linger • 1 Nov 2026
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              00:00 Night • 38 Mins Beyond Time
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
                src={dirtyTalkScreenshot} 
                alt="Midnight Dirty Talk Screenshot"
                className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
            <div className="px-3.5 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
              <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>&ldquo;did u felt somthing.. 😉&rdquo; • Raw Chat</span>
              </span>
              <span className="text-gold-light text-[11px] flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                <Maximize2 className="w-3 h-3" />
                <span>Tap to view full chat</span>
              </span>
            </div>
          </motion.div>

          {/* The Story Card: 15 Mins to 38 Mins */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/50 to-purple-950/40 border border-rose-400/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <Clock className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                &ldquo;Can you stay for just 15 more minutes?&rdquo;
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              On the midnight of 1 November 2026 at 00:00, we tried to say our goodnights and end our conversation to sleep. But sleep was miles away from my eyes — so I asked you if you could stay for just 15 more minutes.
            </p>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              Those 15 minutes turned into something neither of us could have scripted. Our words softly drifted into tender closeness: softly kissing your forehead, lips, cheeks, eyebrows, nose, and hands, folding you into a long, quiet hug that bridged every inch of distance between us.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-purple-100 font-serif italic text-center leading-relaxed">
              <span className="text-rose-300 font-semibold block mb-0.5 not-italic">
                &ldquo;did u felt somthing.. 😉&rdquo;
              </span>
              &ldquo;bohott kuch ❤️🤗&rdquo;
              <span className="block text-[11px] font-sans text-white/80 not-italic mt-1.5">
                Though she is shy, with me her heart opened completely. Planned for 15 minutes, we lingered 38 minutes later in pure happiness.
              </span>
            </div>
          </motion.div>

          {/* The Virtual Touch Breakdown Grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-col gap-2 w-full shrink-0"
          >
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                The Anatomy of Our Midnight Kisses
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
              {kissMoments.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-black/45 border border-white/15 flex flex-col items-center text-center backdrop-blur-sm"
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="text-xs font-semibold text-rose-200">{item.spot}</span>
                  <span className="text-[10px] text-white/70 font-sans mt-0.5 leading-snug">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Poetic & Interactive Reflection Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/30 text-rose-200 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              When Screens Fade Away
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;Distance made our touch virtual, but our hearts felt every breath. That midnight wasn’t just talk — it was the sweetness of knowing that even miles apart, our souls hold each other until the break of dawn.&rdquo;
            </p>

            {/* Interactive Love Reaction */}
            <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerReaction}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/40 text-rose-100 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] font-medium' 
                    : 'bg-white/15 hover:bg-white/20 text-white border border-white/25'
                }`}
              >
                <span>bohott kuch ❤️🤗</span>
                <span className="text-[11px] text-white/80">
                  {liked ? '(felt in every heartbeat)' : '(tap to feel)'}
                </span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Floating Particles Effect */}
        {floatingParticles.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.8, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-2xl select-none"
            style={{ left: item.x, top: item.y }}
          >
            {item.text}
          </motion.div>
        ))}

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
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

      {/* Fullscreen Lightbox Modal for Dirty Talk Screenshot */}
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
                  src={dirtyTalkScreenshot} 
                  alt="Full Chat Screenshot" 
                  className="w-full h-auto max-h-[72vh] object-contain rounded-2xl block mx-auto"
                />
              </div>
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center shrink-0">
                <p className="text-white text-xs sm:text-sm font-medium">
                  &ldquo;did u felt somthing.. 😉&rdquo; • &ldquo;bohott kuch ❤️🤗&rdquo;
                </p>
                <p className="text-white/70 text-[11px] mt-0.5 font-mono">
                  1 Nov 2026, 00:00 • The Dirty Talk
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
