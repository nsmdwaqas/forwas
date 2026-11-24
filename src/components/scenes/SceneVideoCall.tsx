import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Video, Heart, Sparkles, Calendar, Clock, PhoneCall, Camera, HeartHandshake } from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneVideoCallProps {
  onNext: () => void;
  onBack?: () => void;
}

const hapticTap = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([15, 30, 15]);
};

export function SceneVideoCall({ onNext, onBack }: SceneVideoCallProps) {
  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        <BackButton onBack={onBack} />
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center shrink-0 mb-2 sm:mb-3">
          <div className="relative inline-flex items-center justify-center mb-1">
            <Video className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div className="absolute -top-1 -right-2" animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.16em] uppercase">THE VIDEO CALL</h1>
          <p className="font-heading italic text-white/90 text-xs sm:text-sm mt-0.5 tracking-wide">24 November 2026 • The first time our eyes met through a screen</p>
        </motion.div>

        <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left" style={{ WebkitOverflowScrolling: 'touch' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="w-full bg-white/5 border border-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm shadow-md shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-gold-light font-medium"><Calendar className="w-4 h-4" /> A date we will keep</span>
              <span className="text-[11px] text-white/70 font-mono">24 Nov 2026</span>
            </div>
            <p className="font-sans text-sm sm:text-base text-white/95 leading-relaxed">We had planned to call, but just as the moment arrived, a guest came to your home. So we postponed it—not the wish, only the time. Later that day, when you messaged that you were free, WhatsApp finally brought us face to face.</p>
            <p className="font-sans text-sm sm:text-base text-white font-medium italic mt-2 leading-relaxed">“The wait was only a few hours. The feeling had been waiting much longer.”</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="w-full bg-white/5 border border-white/15 rounded-2xl p-3.5 sm:p-4 shrink-0">
            <div className="flex items-center gap-2 text-gold-light text-xs font-medium mb-2"><PhoneCall className="w-4 h-4" /> Three little calls, one unforgettable moment</div>
            <div className="space-y-3">
              <div className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/10 text-gold-light flex items-center justify-center text-xs font-semibold">1</span><div><h3 className="text-sm sm:text-base text-white font-semibold">A Salaam, then silence</h3><p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-0.5">Our first video call was brief. We said Salaam, and then the call disconnected—by accident, by nerves, or for a reason we still cannot explain. Two genuine souls, perhaps a little nervous, suddenly left wondering what had happened.</p></div></div>
              <div className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/10 text-gold-light flex items-center justify-center text-xs font-semibold">2</span><div><h3 className="text-sm sm:text-base text-white font-semibold">A memory worth keeping</h3><p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-0.5">We called back and captured a screenshot together. A tiny keepsake from a moment neither of us wanted to lose.</p></div></div>
              <div className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/10 text-gold-light flex items-center justify-center text-xs font-semibold">3</span><div><h3 className="text-sm sm:text-base text-white font-semibold">Just one more look</h3><p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-0.5">We called a third time, just to take one proper picture. All three calls happened within minutes. Maybe we kept finding reasons to call again because neither heart was ready to end its first chance to see the other.</p></div></div>
            </div>
          </motion.div>

          <motion.a href="https://drive.google.com/drive/folders/1zoKvEWVvr3jpErzSjI2q-vURzDzSvTz0?usp=sharing" target="_blank" rel="noreferrer" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.7 }} className="w-full rounded-2xl border border-white/20 bg-black/35 p-5 sm:p-7 flex flex-col items-center justify-center gap-3 text-center shadow-2xl shrink-0 hover:bg-white/10 transition-colors">
            <Camera className="w-9 h-9 sm:w-11 sm:h-11 text-gold-light" />
            <span className="font-heading text-base sm:text-lg text-white font-semibold">The original call-log memory</span>
            <span className="text-xs sm:text-sm text-white/75 leading-relaxed">Open the shared folder to see the real screenshot and keep this moment just as it happened.</span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-gold-light underline underline-offset-4">View the memory folder <ArrowRight className="w-4 h-4" /></span>
          </motion.a>
          <p className="text-[11px] sm:text-xs text-white/60 text-center italic">Three video calls. One ordinary call. A whole world inside a few minutes.</p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="w-full bg-gradient-to-br from-rose-500/15 to-white/5 border border-gold-light/25 rounded-2xl p-4 sm:p-5 text-center shrink-0">
            <HeartHandshake className="w-6 h-6 text-gold-light mx-auto mb-2" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-gold-light font-semibold mb-2">The moment I will replay forever</p>
            <p className="font-heading text-base sm:text-lg text-white leading-relaxed">And then, on that third call, looking into each other's eyes, we said those three words for the first time face to face: “I love you.”</p>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed mt-3">You started blushing. I acted as though I hadn't heard you—not because I missed a word, but because I wanted to hear your voice say it once again. So you said it twice. I heard you the first time, jaan. I just wanted to live that little moment twice.</p>
            <p className="font-heading italic text-white mt-3">Some firsts are not measured in minutes. They are measured in how often the heart returns to them. <Heart className="inline w-4 h-4 text-rose-300" fill="currentColor" /></p>
          </motion.div>
        </div>

        <motion.div className="shrink-0 mt-2 sm:mt-3 pt-2 border-t border-white/10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
          <motion.button onClick={() => { hapticTap(); onNext(); }} className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]" whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }} whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}>
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
