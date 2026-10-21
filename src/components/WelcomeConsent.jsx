'use client';

/**
 * @file src/components/WelcomeConsent.jsx
 * @description Floating bottom privacy and terms consent banner displayed once per user.
 * Stores acceptance state in `localStorage` under `zaria_consent` and automatically
 * hides itself on interactive `/demo/*` template preview routes.
 */

// 1. React and Next.js core modules
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 2. Third-party libraries
import { AnimatePresence, motion } from 'framer-motion';

// 3. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * WelcomeConsent Component
 *
 * State Variables:
 * - `show` {boolean}: Controls whether the consent banner is visible.
 *
 * @returns {JSX.Element | null} The animated bottom consent banner or null if already accepted.
 */
export default function WelcomeConsent() {
  const [show, setShow] = useState(false);
  const { t, language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the visitor has previously accepted the terms and privacy notice
    const hasConsented = localStorage.getItem('zaria_consent');
    if (!hasConsented) {
      // Delay banner entry slightly to allow initial page animations to settle
      const timer = setTimeout(() => {
        setShow(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Persists user consent in `localStorage` and dismisses the banner.
   */
  const handleAgree = () => {
    localStorage.setItem('zaria_consent', 'true');
    setShow(false);
  };

  if (!show || pathname?.startsWith('/demo')) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 pointer-events-none"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-[#C49A6C]/30 p-5 md:p-6 rounded-[2rem] shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm md:text-base text-[#444444] leading-relaxed text-center md:text-start flex-1 font-medium">
              {t('consent.message')}
              <Link
                href="/terms"
                className="text-[#C49A6C] hover:text-[#81462a] underline font-bold transition-colors"
              >
                {t('consent.terms')}
              </Link>
              {t('consent.and')}
              <Link
                href="/privacy"
                className="text-[#C49A6C] hover:text-[#81462a] underline font-bold transition-colors"
              >
                {t('consent.privacy')}
              </Link>
              .
            </div>

            <button
              onClick={handleAgree}
              className="w-full md:w-auto shrink-0 bg-[#111111] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#C49A6C] hover:-translate-y-1 transition-all duration-300 shadow-md text-sm md:text-base"
            >
              {t('consent.agree')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
