import React from 'react';
import { motion } from 'motion/react';

export const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  out: { opacity: 0, y: -40, scale: 1.05, filter: 'blur(8px)' }
};

export const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], // cinematic cubic-bezier
  duration: 1.2
};

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className={`relative z-10 w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 ${className}`}
  >
    {children}
  </motion.div>
);
