'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

let isInitialLoad = true;

export default function Preloader() {
  const pathname = usePathname();
  const isMarketingRoute = ['/', '/templates', '/privacy', '/terms', '/refund'].includes(pathname);
  const [isLoading, setIsLoading] = useState(isInitialLoad);
  const [shouldRender, setShouldRender] = useState(isInitialLoad);

  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(false);
      setShouldRender(false);
      return;
    }

    // Disable scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      isInitialLoad = false;
      document.body.style.overflow = 'unset';
      
      // Give time for exit animation to finish before removing from DOM
      setTimeout(() => setShouldRender(false), 1000);
    }, 4000); // 4 seconds total loading time

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!shouldRender || !isMarketingRoute) return null;

  const letterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.3
      }
    }
  };

  const letterAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111]"
        >
          {/* Main ZARIA Text */}
          <motion.div
            variants={letterContainer}
            initial="hidden"
            animate="show"
            dir="ltr"
            className="font-serif text-[#C49A6C] text-4xl md:text-5xl tracking-[0.3em] font-normal relative flex drop-shadow-[0_0_30px_rgba(196,154,108,0.4)]"
          >
            {'ZARIA'.split('').map((letter, index) => (
              <motion.span key={index} variants={letterAnim}>
                {letter}
              </motion.span>
            ))}
            
            {/* Animated Golden Sparkle */}
            <motion.svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="#C49A6C" 
              stroke="none"
              className="absolute -top-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 1.8, type: "spring" }}
            >
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </motion.svg>
          </motion.div>
          
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="text-[#C49A6C]/70 text-[10px] md:text-[12px] font-medium tracking-[0.5em] uppercase mt-4"
          >
            E-INVITATIONS
          </motion.div>

          {/* Golden Loading Line */}
          <motion.div 
            className="absolute bottom-16 w-32 h-[1px] bg-white/10 overflow-hidden"
          >
            <motion.div 
              className="w-full h-full bg-gradient-to-r from-transparent via-[#C49A6C] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
