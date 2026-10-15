'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function WelcomeConsent() {
  const [show, setShow] = useState(false);
  const { t, language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem('zaria_consent');
    if (!hasConsented) {
      // Small delay to let the page load before showing the banner
      const timer = setTimeout(() => {
        setShow(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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
              <Link href="/terms" className="text-[#C49A6C] hover:text-[#81462a] underline font-bold transition-colors">
                {t('consent.terms')}
              </Link>
              {t('consent.and')}
              <Link href="/privacy" className="text-[#C49A6C] hover:text-[#81462a] underline font-bold transition-colors">
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
