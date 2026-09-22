import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircleHeart, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';

interface SceneMessageProps {
  onNext: () => void;
}

export function SceneMessage({ onNext }: SceneMessageProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lovenama_message_screenshot');
    }
    return null;
  });

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImage(result);
        try {
          localStorage.setItem('lovenama_message_screenshot', result);
        } catch {
          // Ignore quota exceeded
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 min-h-full my-auto">
      <motion.div 
        className="glass-panel w-full p-4 sm:p-6 md:p-10 relative flex flex-col h-[85vh] max-h-[85vh] min-h-[420px] sm:min-h-[520px]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center shrink-0 mb-3 sm:mb-5"
        >
          <MessageCircleHeart className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light mb-2 drop-shadow-[0_0_10px_rgba(232,180,200,0.7)]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE MESSAGE
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm md:text-base mt-1 tracking-wide">
            the very first words that started our forever
          </p>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-[200px] overflow-y-auto px-2 sm:px-4 custom-scrollbar scroll-smooth flex flex-col items-center gap-5 sm:gap-6 py-2">
          
          {/* Poetic Context Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-xl bg-white/5 border border-white/15 rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed font-light">
              The first words we ever spoke. Two days after our engagement, still strangers in every way that mattered — except one.
            </p>
            <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed font-light mt-2.5">
              I asked if we even knew each other. You answered in one single word that made the question feel unnecessary:
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-light" />
              <span className="font-heading text-lg sm:text-xl text-gold-light italic font-semibold tracking-wider">
                &ldquo;absolutely&rdquo;
              </span>
              <Sparkles className="w-4 h-4 text-gold-light" />
            </div>
          </motion.div>

          {/* Screenshot Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-md"
          >
            {uploadedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/60 group">
                <img 
                  src={uploadedImage} 
                  alt="First Message Screenshot" 
                  className="w-full h-auto object-contain max-h-[380px] mx-auto rounded-2xl"
                />
                <label className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black/90 border border-white/20 rounded-full text-xs text-white/80 cursor-pointer flex items-center gap-1.5 backdrop-blur-sm transition-all opacity-80 hover:opacity-100">
                  <Upload className="w-3.5 h-3.5" /> Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            ) : (
              /* High-fidelity WhatsApp/Instagram Dark Mode Chat Recreation */
              <div className="rounded-2xl border border-white/20 bg-[#0d0d11]/90 p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md relative text-left">
                {/* Timestamp Header */}
                <div className="text-center mb-4 sm:mb-5">
                  <span className="text-[11px] sm:text-xs font-sans font-medium tracking-wider text-white/50 uppercase">
                    31 AUG AT 5:19 PM
                  </span>
                </div>

                {/* Sent Bubble (Him - Purple on Right) */}
                <motion.div 
                  className="flex justify-end mb-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <div className="max-w-[85%] sm:max-w-[80%] bg-gradient-to-r from-[#8a2be2] to-[#9933ee] text-white rounded-3xl rounded-tr-xs px-4 py-3 sm:px-5 sm:py-3.5 shadow-md">
                    <p className="text-sm sm:text-[15px] leading-snug font-sans font-normal">
                      Assalamu alaikum.. 😊 i'm texting you assuming we know each other.. is that true..? 😇
                    </p>
                  </div>
                </motion.div>

                {/* Replied Bubble (Her - Dark with quote on Left) */}
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  <div className="max-w-[85%] sm:max-w-[80%] bg-[#232328] text-white rounded-3xl rounded-tl-xs px-4 py-3 sm:px-5 sm:py-3.5 shadow-md border border-white/5">
                    {/* Reply Quote Block */}
                    <div className="bg-black/35 border-l-[3px] border-[#9933ee] rounded-md px-3 py-1.5 mb-2.5">
                      <p className="text-[11px] text-white/60 font-medium mb-0.5">
                        Replied to you
                      </p>
                      <p className="text-xs text-white/80 line-clamp-2 leading-tight">
                        Assalamu alaikum.. 😊 i'm texting you assuming we know each other.. is that true..? 😇
                      </p>
                    </div>

                    {/* Actual Reply */}
                    <p className="text-sm sm:text-[15px] font-sans text-white font-normal">
                      walaikumassalam, absolutely
                    </p>
                  </div>
                </motion.div>

                {/* Optional Upload Button for custom screenshot file */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-gold-light" /> Original Chat View
                  </span>
                  <label className="hover:text-white cursor-pointer flex items-center gap-1 transition-colors">
                    <Upload className="w-3 h-3" /> Upload screenshot
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            )}
          </motion.div>

        </div>

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-3 sm:mt-5 pt-2"
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
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
