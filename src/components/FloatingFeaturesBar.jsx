/**
 * @file src/components/FloatingFeaturesBar.jsx
 * @description Elevated 4-pillar value proposition bar overlapping the bottom edge
 * of the Hero section (Instant Share, Exceptional Quality, Custom Design, Premium Support).
 */

// 1. Third-party libraries
import { motion } from 'framer-motion';

// 2. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * FloatingFeaturesBar Component
 *
 * @returns {JSX.Element} The animated 4-column floating highlights bar.
 */
export default function FloatingFeaturesBar() {
  const { t } = useLanguage();

  return (
    <>
      {/* FLOATING VALUE PROPOSITION BAR */}
      <motion.section
        className="relative z-30 w-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="-mt-8 lg:-mt-12 relative z-30 max-w-[95%] lg:max-w-[80%] mx-auto bg-gradient-to-r from-[#F2EAE3]/95 via-[#FFFBF8] to-[#F2EAE3]/95 backdrop-blur-xl rounded-[2rem] p-6 lg:py-8 lg:px-10 flex flex-col lg:flex-row items-center justify-between shadow-xl shadow-[#A88461]/10 border border-white/60">
          {/* 1. Instant Send & Share (Right-most in RTL) */}
          <div className="flex flex-row items-center justify-between lg:justify-center gap-4 flex-1 w-[280px] sm:w-[300px] lg:w-auto mx-auto py-4 lg:py-0">
            <div className="text-right flex-1 lg:flex-none">
              <h4 className="font-bold text-[14px] text-[#111111]">{t('floating.f1_title')}</h4>
              <p className="text-[11px] text-[#444444] mt-0.5 font-medium whitespace-nowrap">
                {t('floating.f1_desc')}
              </p>
            </div>
            <div className="text-[#C49A6C] shrink-0 w-10 flex justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 3L10 14" />
                <path d="M21 3l-6.5 18-3.5-8-8-3.5L21 3z" />
                <path d="M3 21c1.5-1.5 3-2.5 5-2.5" strokeDasharray="1 2" />
                <path
                  d="M5 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </div>
          </div>

          <div className="w-full lg:w-px h-px lg:h-12 bg-gradient-to-b from-transparent via-[#D6C5B3] to-transparent my-2 lg:my-0"></div>

          {/* 2. Exceptional Quality (Middle-right in RTL) */}
          <div className="flex flex-row items-center justify-between lg:justify-center gap-4 flex-1 w-[280px] sm:w-[300px] lg:w-auto mx-auto py-4 lg:py-0">
            <div className="text-right flex-1 lg:flex-none">
              <h4 className="font-bold text-[14px] text-[#111111]">{t('floating.f2_title')}</h4>
              <p className="text-[11px] text-[#444444] mt-0.5 font-medium whitespace-nowrap">
                {t('floating.f2_desc')}
              </p>
            </div>
            <div className="text-[#C49A6C] shrink-0 w-10 flex justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M12 20s6.5-3.5 6.5-8.5V6.5l-6.5-2.5-6.5 2.5V11.5C5.5 16.5 12 20 12 20" />
                <path d="M9 12l2 2 4-4" strokeWidth="1.2" />
              </svg>
            </div>
          </div>

          <div className="w-full lg:w-px h-px lg:h-12 bg-gradient-to-b from-transparent via-[#D6C5B3] to-transparent my-2 lg:my-0"></div>

          {/* 3. Custom Design (Middle-left in RTL) */}
          <div className="flex flex-row items-center justify-between lg:justify-center gap-4 flex-1 w-[280px] sm:w-[300px] lg:w-auto mx-auto py-4 lg:py-0">
            <div className="text-right flex-1 lg:flex-none">
              <h4 className="font-bold text-[14px] text-[#111111]">{t('floating.f3_title')}</h4>
              <p className="text-[11px] text-[#444444] mt-0.5 font-medium whitespace-nowrap">
                {t('floating.f3_desc')}
              </p>
            </div>
            <div className="text-[#C49A6C] shrink-0 w-10 flex justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                <path d="M15 5l4 4" />
                <path d="M12 8l4 4" />
                <path d="M2 22s3-3 8-1" />
                <path d="M21 11v2m-1-1h2" />
                <path d="M11 3v2m-1-1h2" />
              </svg>
            </div>
          </div>

          <div className="w-full lg:w-px h-px lg:h-12 bg-gradient-to-b from-transparent via-[#D6C5B3] to-transparent my-2 lg:my-0"></div>

          {/* 4. Premium Support (Left-most in RTL) */}
          <div className="flex flex-row items-center justify-between lg:justify-center gap-4 flex-1 w-[280px] sm:w-[300px] lg:w-auto mx-auto py-4 lg:py-0">
            <div className="text-right flex-1 lg:flex-none">
              <h4 className="font-bold text-[14px] text-[#111111]">{t('floating.f4_title')}</h4>
              <p className="text-[11px] text-[#444444] mt-0.5 font-medium whitespace-nowrap">
                {t('floating.f4_desc')}
              </p>
            </div>
            <div className="text-[#C49A6C] shrink-0 w-10 flex justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
                <rect x="2" y="14" width="4" height="6" rx="2" />
                <rect x="18" y="14" width="4" height="6" rx="2" />
                <path d="M18 19c-1.5 2.5-4 4-6 4" strokeDasharray="1 2" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
