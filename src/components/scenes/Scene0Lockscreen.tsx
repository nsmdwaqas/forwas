import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Delete, Lock } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
}

export function Scene0Lockscreen({ onNext }: SceneProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const controls = useAnimation();

  const handlePress = async (num: string) => {
    if (pin.length >= 4 || success) return;
    
    // Haptic hover/tap
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    
    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === "2306") {
        // Success
        setSuccess(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 30, 20]);
        setTimeout(() => {
          onNext();
        }, 1200); // Show success glow before moving
      } else {
        // Error
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 50, 50]);
        setError(true);
        await controls.start({ 
          x: [-10, 10, -10, 10, 0], 
          transition: { duration: 0.4 } 
        });
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !success) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <motion.div 
        className="glass-panel w-full p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.div 
          className="mb-4 text-white/80"
          animate={success ? { scale: 1.2, color: "#D4AF37", filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))" } : {}}
          transition={{ duration: 0.5 }}
        >
          <Lock className="w-8 h-8" />
        </motion.div>

        <motion.h1 
          className="text-2xl md:text-3xl font-heading mb-2 text-white text-shadow-elegant shimmer-text text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Only you hold the key
        </motion.h1>
        
        <motion.p
          className="text-sm md:text-base font-sans text-white/80 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Enter my birthday to open (DDMM)
        </motion.p>

        {/* PIN Indicators */}
        <motion.div 
          className="flex gap-4 justify-center mb-8"
          animate={controls}
        >
          {[0, 1, 2, 3].map((index) => (
            <motion.div 
              key={index} 
              className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                error 
                  ? 'bg-[#993556] border-[#993556] shadow-[0_0_15px_rgba(153,53,86,0.8)]' // Red error state
                  : success
                    ? 'bg-gold-light border-gold-light shadow-[0_0_15px_rgba(201,166,107,0.8)]' // Gold success state
                    : index < pin.length 
                      ? 'bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' // Filled state
                      : 'bg-white/10 border-white/40' // Empty state
              }`}
              animate={index === pin.length - 1 && !error && !success ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-16 h-16 rounded-full glass-button text-white text-2xl font-sans font-medium flex items-center justify-center transition-colors hover:bg-white/30 active:bg-white/40"
              whileTap={{ scale: 0.9 }}
            >
              {num}
            </motion.button>
          ))}
          
          <div /> {/* Empty slot */}
          
          <motion.button
            onClick={() => handlePress('0')}
            className="w-16 h-16 rounded-full glass-button text-white text-2xl font-sans font-medium flex items-center justify-center transition-colors hover:bg-white/30 active:bg-white/40"
            whileTap={{ scale: 0.9 }}
          >
            0
          </motion.button>
          
          <motion.button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full glass-button text-white/70 flex items-center justify-center transition-colors hover:text-white hover:bg-white/30 active:bg-white/40"
            whileTap={{ scale: 0.9 }}
          >
            <Delete className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
