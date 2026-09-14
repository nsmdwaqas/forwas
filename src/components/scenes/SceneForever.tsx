import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Infinity as InfinityIcon } from 'lucide-react';

interface SceneForeverProps {
  onNext: () => void;
}

const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
  <motion.div 
    className="flex flex-col items-center justify-center glass-panel p-3 w-[80px] sm:w-[90px]"
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
  >
    <span className="text-2xl sm:text-3xl font-sans font-semibold text-white drop-shadow-md">
      {value}
    </span>
    <span className="text-[10px] sm:text-xs font-heading tracking-widest text-white/80 uppercase mt-1 text-center">
      {label}
    </span>
  </motion.div>
);

export function SceneForever({ onNext }: SceneForeverProps) {
  const [timeElapsed, setTimeElapsed] = useState({ years: 0, months: 0, days: 0 });

  useEffect(() => {
    const calculateElapsed = () => {
      // Confession date
      const startDate = new Date('2026-09-07T00:00:00');
      const now = new Date();
      
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      // Adjust for negative days
      if (days < 0) {
        months -= 1;
        // Number of days in the previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      
      // Adjust for negative months
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      
      // Safety bounds if somehow current date is before start date
      if (years < 0) {
        years = 0;
        months = 0;
        days = 0;
      }

      setTimeElapsed({ years, months, days });
    };

    calculateElapsed();
    // Update every hour since it's just counting days
    const interval = setInterval(calculateElapsed, 1000 * 60 * 60); 
    return () => clearInterval(interval);
  }, []);

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4">
      <motion.div 
        className="glass-panel w-full p-8 md:p-12 relative overflow-hidden"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="flex justify-center mb-4 text-white/90"
        >
          <InfinityIcon className="w-10 h-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </motion.div>

        <motion.h1 
          className="text-3xl md:text-4xl font-heading mb-2 text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          The Forever
        </motion.h1>

        <motion.p
          className="text-sm md:text-base font-sans text-white/80 mb-10 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          In love since September 7, 2026...
        </motion.p>

        <div className="flex justify-center gap-3 sm:gap-6 mb-12">
          <TimeUnit value={timeElapsed.years} label={timeElapsed.years === 1 ? "Year" : "Years"} delay={0.8} />
          <TimeUnit value={timeElapsed.months} label={timeElapsed.months === 1 ? "Month" : "Months"} delay={1.0} />
          <TimeUnit value={timeElapsed.days} label={timeElapsed.days === 1 ? "Day" : "Days"} delay={1.2} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-8 py-4 glass-button text-white rounded-full font-medium text-lg transition-all inline-flex items-center gap-2"
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
