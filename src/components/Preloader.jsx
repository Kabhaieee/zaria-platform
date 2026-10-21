'use client';

/**
 * @file src/components/Preloader.jsx
 * @description Luxury full-screen initial splash screen displaying the animated
 * ZARIA wordmark, golden crown insignia, and progress shimmer line on marketing routes.
 */

// 1. React and Next.js core modules
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// 2. Third-party libraries
import { AnimatePresence, motion } from 'framer-motion';

// Module-scoped flag ensuring the splash screen plays only once per browser session load
let isInitialLoad = true;

/**
 * Preloader Component
 *
 * State Variables:
 * - `isLoading` {boolean}: Controls whether the preloader overlay is actively visible.
 * - `shouldRender` {boolean}: Retains the component in the DOM until the exit fade finishes.
 *
 * @returns {JSX.Element | null} The animated splash screen overlay or null on non-marketing routes.
 */
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

    // Lock document scrolling while the splash screen is active
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsLoading(false);
      isInitialLoad = false;
      document.body.style.overflow = 'unset';

      // Allow the 1s exit transition to complete before unmounting
      setTimeout(() => setShouldRender(false), 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!shouldRender || !isMarketingRoute) return null;

  // Staggered parent animation variants for the ZARIA letters
  const letterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.3,
      },
    },
  };

  // Individual letter reveal animation variants
  const letterAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111]"
        >
          {/* Animated ZARIA Wordmark + Golden Crown */}
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

            {/* Animated Golden Crown Above Center Letter */}
            <motion.svg
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="#C49A6C"
              stroke="none"
              className="absolute -top-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8, type: 'spring' }}
            >
              <path d="M2 15L4.5 6L9.5 11L12 3L14.5 11L19.5 6L22 15H2ZM3 17H21V18.5H3V17Z" />
              <circle cx="12" cy="1.5" r="1.5" />
              <circle cx="4" cy="4.5" r="1.2" />
              <circle cx="20" cy="4.5" r="1.2" />
            </motion.svg>
          </motion.div>

          {/* Brand Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="text-[#C49A6C]/70 text-[10px] md:text-[12px] font-medium tracking-[0.5em] uppercase mt-4"
          >
            E-INVITATIONS
          </motion.div>

          {/* Bottom Shimmering Progress Bar */}
          <motion.div className="absolute bottom-16 w-32 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-[#C49A6C] to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
