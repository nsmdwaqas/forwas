import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, PenTool } from 'lucide-react';

interface SceneLetterProps {
  onNext: () => void;
}

export function SceneLetter({ onNext }: SceneLetterProps) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const letterLines = [
    "Shajer (My Future Wife),",
    "I've never written a letter before. I'm not good with words like this. But I wanted to give you something today, so I'm just going to say it plainly.",
    "29th August, 5 in the evening. We got engaged that morning. By that evening, I had already decided something — I wasn't letting go of your hand. Whatever happens. I decided this before we'd even spoken. You hadn't said a word to me yet. So whatever this is, it didn't start because of anything you did. It started because I chose it.",
    "Then that night, 30th August, midnight, I sent you a follow request. I kept checking if you'd accepted it. You did, the next day. I was way too happy about that for a grown man.",
    "Then you said \"Walaikum asalam absolutely\" and disappeared three messages later. I won't lie, I panicked a little. You came back the next morning at 11. We've been talking since. It's only been a few weeks. Feels longer.",
    "Now, about Sunday.",
    "You joked about marrying someone else. I said go ahead. I know how that sounded. Like I didn't care. That's not what it was. I just never want to be someone who holds you back by force. If you ever want to leave, I want that door open, always. Not because I don't love you. Because I do.",
    "But I think what you actually wanted to hear was something else. You wanted to know — if one day you forgot me, forgot all of this, would I still stay. Like in Saiyara. Not because you owe me anything. Just because I chose to.",
    "So here's my answer, simply:",
    "Yes.",
    "I chose you on the 29th, before you even knew me. That's not going anywhere. If you ever forget everything — this letter, this day, my name — I'll still be here. I'll remind you. I'll wait. Not because I have to. Because I still will have chosen you, all over again.",
    "You don't need to sign anything. I already meant it, from the 29th.",
    "I read your favorite story, and I wanted to be him.",
    "Yours, still, always, even in the parts you won't remember",
    "- Your Future Husband"
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center px-4 md:px-8 py-6 h-full">
      <motion.div 
        className="glass-panel w-full p-6 md:p-12 relative flex flex-col h-full max-h-[85vh]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center shrink-0 mb-6"
        >
          <PenTool className="w-8 h-8 text-gold-light mb-4 drop-shadow-[0_0_8px_rgba(232,180,200,0.6)]" />
          <h1 className="text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text">
            The Letter
          </h1>
        </motion.div>

        {/* Scrollable Letter Body */}
        <div 
          className="flex-1 overflow-y-auto text-left px-2 md:px-6 custom-scrollbar scroll-smooth space-y-4 md:space-y-6"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}
        >
          <div className="py-4">
            {letterLines.map((line, index) => (
              <motion.p
                key={index}
                className={`font-heading text-white/90 leading-relaxed ${
                  index === 0 || index >= letterLines.length - 2 ? "italic text-xl md:text-2xl" : "text-lg md:text-xl"
                } ${index === 0 ? "mb-6" : ""} ${index >= letterLines.length - 4 ? "text-gold-light" : ""}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.2), duration: 0.8, ease: "easeOut" }}
              >
                {line}
              </motion.p>
            ))}
            
            <motion.div
              className="mt-8 pt-6 border-t border-white/10 text-right space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + (letterLines.length * 0.2) + 0.5, duration: 1 }}
            >
              <p className="font-sans text-xs md:text-sm text-white/60 tracking-widest uppercase">
                Date 17 September 2026
              </p>
              <p className="font-sans text-xs md:text-sm text-white/60 tracking-widest uppercase">
                Time 10:00 PM IST
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="shrink-0 mt-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-3 md:px-8 md:py-4 glass-button text-white rounded-full font-medium text-base md:text-lg transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
