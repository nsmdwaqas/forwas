import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

interface SceneTimelineProps {
  onNext: () => void;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  isToday?: boolean;
}

const timelineData: TimelineEvent[] = [
  {
    date: "19 Aug | Wed | Afternoon",
    title: "The Invitation That Almost Wasn't",
    description: "My family's invitation reached our that afternoon. A few hours later, they said yes to visiting you — a small window that changed everything."
  },
  {
    date: "20 Aug | Thu | 6:00 PM",
    title: "Alhamdulillah",
    description: "Aunt showed me your photo before Maghrib — light green clothes, smiling. One word left me: Alhamdulillah."
  },
  {
    date: "20 Aug | Thu | 8:00 PM",
    title: "Too Fast to Be Ordinary",
    description: "Your father and mama came to meet me the same evening. Rare, fast, and it felt like fate was in a hurry."
  },
  {
    date: "22 Aug | Sat | 6:00 PM",
    title: "Nervous and Beautiful",
    description: "Second visit, second photo — dark green, a little nervous, still smiling. Exactly as beautiful as I'd imagined."
  },
  {
    date: "29 Aug | Sat",
    title: "The Decision Before the Knowing",
    description: "We got engaged. Before we'd even spoken, I decided to hold your hand forever — like the boy in your favorite movie Saiyara."
  },
  {
    date: "31 Aug | 5:19 PM",
    title: "Walaikum Asalam",
    description: "Our first words. I said Assalamu alaikum. You said Walaikum asalam. Then you vanished in 3-4 message"
  },
  {
    date: "1 Sept | 12:15 PM",
    title: "The Day You Came Back",
    description: "You messaged first — \"Assalamu alaikum, khairiyat?\" That's how it really began."
  },
  {
    date: "4 Sept",
    title: "First Faces",
    description: "We exchanged photos for the first time. Simple, but it felt big."
  },
  {
    date: "7 Sept",
    title: "The Promise",
    description: "We confessed — promised to stay with each other forever. Our first real vow."
  },
  {
    date: "13 Sept",
    title: "Munnar",
    description: "Away in the hills, I realized I missed you. Not the idea of you — you."
  },
  {
    date: "14 Sept",
    title: "Mehndi",
    description: "Saw our engagement mehndi still on your hand. Proof this was real."
  },
  {
    date: "15 Sept",
    title: "The First Voice",
    description: "Woke up to your voice note — \"Assalamu alaikum.\" First thing I heard that day."
  },
  {
    date: "16 Sept",
    title: "Stone, Paper, Ludo",
    description: "Our first games together. I won round one, you won round two. Both of us happy either way."
  },
  {
    date: "21 Sept",
    title: "You Missed Me",
    description: "You said it first this time — that you missed me. I read it more times than I'll admit."
  },
  {
    date: "Today",
    title: "Still Writing",
    description: "One month in, and it already feels bigger than that. More memories coming — starting with 31st December.",
    isToday: true
  }
];

export function SceneTimeline({ onNext }: SceneTimelineProps) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 min-h-full my-auto">
      <motion.div 
        className="glass-panel w-full p-4 sm:p-6 md:p-12 relative flex flex-col h-[82vh] max-h-[82vh] min-h-[400px] sm:min-h-[520px]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center shrink-0 mb-3 sm:mb-6"
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gold-light mb-2 sm:mb-3 drop-shadow-[0_0_8px_rgba(232,180,200,0.6)]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            OUR TIMELINE
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm md:text-base mt-1 tracking-wide">
            a story fate kept rewriting until it got us right
          </p>
        </motion.div>

        {/* Scrollable Timeline */}
        <div 
          className="flex-1 min-h-[180px] overflow-y-auto px-2 sm:px-4 md:px-6 custom-scrollbar scroll-smooth text-left"
        >
          <div className="py-2 sm:py-4 max-w-2xl mx-auto">
            <div className="relative border-l-2 border-white/20 pl-4 sm:pl-6 ml-3 sm:ml-4 space-y-6 sm:space-y-8 my-2">
              {timelineData.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.6 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  {event.isToday ? (
                    <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gold-light flex items-center justify-center animate-pulse drop-shadow-[0_0_8px_rgba(232,180,200,0.9)]">
                        <Heart className="w-2.5 h-2.5 text-rose-900" fill="currentColor" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute -left-[21px] sm:-left-[29px] top-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/70 ring-2 ring-white/20 group-hover:bg-gold-light group-hover:ring-gold-light/40 transition-colors" />
                  )}

                  {/* Content Card */}
                  <div className={`rounded-xl p-3.5 sm:p-5 transition-all ${
                    event.isToday 
                      ? 'bg-white/15 border border-gold-light/40 shadow-[0_0_20px_rgba(232,180,200,0.2)]' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}>
                    {/* Date Badge */}
                    <div className="mb-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-sans tracking-wider uppercase font-medium ${
                        event.isToday 
                          ? 'bg-gold-light/25 border border-gold-light/40 text-gold-light font-semibold' 
                          : 'bg-white/10 border border-white/15 text-white/90'
                      }`}>
                        {event.date}
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="font-heading text-base sm:text-lg md:text-xl text-white font-semibold tracking-wide drop-shadow-sm">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="font-sans text-sm sm:text-base text-white/85 leading-relaxed font-light mt-1.5">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-3 sm:mt-6 pt-2 sm:pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-4 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
