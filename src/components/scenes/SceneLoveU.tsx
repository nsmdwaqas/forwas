import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  AudioLines, 
  Heart, 
  Sparkles, 
  PhoneCall, 
  Maximize2, 
  X, 
  MessageCircleHeart,
  Volume2
} from 'lucide-react';
import callsScreenshot from '../../assets/love_u_calls.jpeg';
import chatScreenshot from '../../assets/love_u_chat.jpeg';

interface SceneLoveUProps {
  onNext: () => void;
}

export function SceneLoveU({ onNext }: SceneLoveUProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([20, 45, 30, 60]);
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

    const emojis = ['❤️', '🙈', '✨', '🤍', '🌸'];
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

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <AudioLines className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <AudioLines className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE LOVE U
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Her First Voice &ldquo;I Love You&rdquo; • 14 Seconds That Touched My Soul
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
              <PhoneCall className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Fajr to Morning Call • 1 Nov 2026
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              7:10 AM • 14 Seconds of Magic
            </div>
          </motion.div>

          {/* The Story Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/50 to-purple-950/40 border border-rose-400/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <Volume2 className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                The Morning Her Heart Spoke in Voice
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              Every morning, she wakes me for Fajr around 5:00 AM. For weeks, our calls were brief — a gentle &ldquo;Salaaam&rdquo; that ended in under 10 seconds. But this morning, after her 5:35 AM call, I added a few extra words in my own voice: <span className="text-rose-300 font-semibold">&ldquo;I LOVE U&rdquo;</span>.
            </p>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              We texted briefly, said our goodbyes, and I drifted back into sleep. Then at 7:10 AM, my phone buzzed. Still half-asleep, I saw her name on my screen — <span className="text-purple-200 font-medium">&ldquo;ruhi.. 🤍&rdquo;</span>. Puzzled, I picked up.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-purple-100 font-serif italic text-center leading-relaxed">
              <span className="text-rose-300 font-semibold block mb-1 text-sm sm:text-base not-italic">
                &ldquo;Assalamu alaikum... I Love You...&rdquo;
              </span>
              &ldquo;As she finished her sentence, I could hear her blushing with a smile before she hung up. A 14-second call that jolted me awake from half-sleep — it felt like her voice reached in and touched my very soul.&rdquo;
              <span className="block text-[11px] font-sans text-rose-200 not-italic mt-2">
                &ldquo;I felt... I had to say it to you and then sleep, so I did.&rdquo; ❤️🙈
              </span>
            </div>
          </motion.div>

          {/* Raw Screenshots Showcase Section (Side-by-Side on desktop, Stacked on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="shrink-0 w-full flex flex-col gap-2"
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  The Unfiltered Evidence (Raw Memories)
                </span>
              </div>
              <span className="text-[11px] text-white/60">Tap to expand</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* Call History Card */}
              <div 
                className="rounded-2xl overflow-hidden border border-white/20 bg-black/85 backdrop-blur-md group cursor-pointer shadow-lg hover:border-rose-400/40 transition-all"
                onClick={() => {
                  hapticTap('light');
                  setSelectedImage(callsScreenshot);
                }}
              >
                <div className="p-2 sm:p-2.5 bg-zinc-950 flex flex-col items-center justify-center">
                  <img 
                    src={callsScreenshot} 
                    alt="Incoming Call Log" 
                    className="w-full h-auto max-h-[180px] sm:max-h-[200px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="px-3 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
                  <span className="text-rose-300 font-medium flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    <span>7:10 AM • 14 Seconds Call</span>
                  </span>
                  <span className="text-gold-light text-[11px] flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                    <Maximize2 className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Chat Aftermath Card */}
              <div 
                className="rounded-2xl overflow-hidden border border-white/20 bg-black/85 backdrop-blur-md group cursor-pointer shadow-lg hover:border-rose-400/40 transition-all"
                onClick={() => {
                  hapticTap('light');
                  setSelectedImage(chatScreenshot);
                }}
              >
                <div className="p-2 sm:p-2.5 bg-zinc-950 flex flex-col items-center justify-center">
                  <img 
                    src={chatScreenshot} 
                    alt="WhatsApp Chat Conversation" 
                    className="w-full h-auto max-h-[180px] sm:max-h-[200px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="px-3 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
                  <span className="text-rose-300 font-medium flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>&ldquo;jaaan i&apos;m just blushing..&rdquo;</span>
                  </span>
                  <span className="text-gold-light text-[11px] flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                    <Maximize2 className="w-3 h-3" />
                  </span>
                </div>
              </div>
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
              The Shyest Heart, The Bravest Whisper
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;She is the shyest soul I know, yet her love found the courage to dial my number, whisper those three sacred words, and smile into the phone before sleeping. Those 14 seconds will ring in my heart for eternity.&rdquo;
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
                <span>woh bas... I wanted to say it.. ❤️🙈</span>
                <span className="text-[11px] text-white/80">
                  {liked ? '(treasured forever)' : '(tap to feel)'}
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

      {/* Fullscreen Lightbox Modal for Screenshots */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 touch-none"
            onClick={() => {
              hapticTap('light');
              setSelectedImage(null);
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                hapticTap('light');
                setSelectedImage(null);
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
                  src={selectedImage} 
                  alt="Raw Evidence Screenshot" 
                  className="w-full h-auto max-h-[72vh] object-contain rounded-2xl block mx-auto"
                />
              </div>
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center shrink-0">
                <p className="text-white text-xs sm:text-sm font-medium">
                  &ldquo;Assalamu alaikum... I Love You...&rdquo;
                </p>
                <p className="text-white/70 text-[11px] mt-0.5 font-mono">
                  1 Nov 2026 • The Love U
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
