/**
 * @file src/components/TemplateGallery.jsx
 * @description Landing page horizontal marquee gallery showcasing featured ZARIA
 * invitation templates (Weddings, Engagements, Graduations, Birthdays, Special Events)
 * with direct links to live interactive demos and the full `/templates` catalog.
 */

// 1. React and Next.js core modules
import Link from 'next/link';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * TemplateGallery Component
 *
 * @returns {JSX.Element} The animated template marquee showcase section.
 */
export default function TemplateGallery() {
  const { t } = useLanguage();

  return (
    <>
      {/* TEMPLATE GALLERY MARQUEE SECTION */}
      <section
        id="templates"
        dir="rtl"
        className="relative pt-16 pb-16 overflow-hidden bg-gradient-to-b from-transparent via-[#FDFBF9] to-transparent"
      >
        {/* Section Header */}
        <motion.div
          className="relative z-10 text-center px-5 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6 opacity-90">
            <div className="w-24 md:w-40 h-[1px] bg-gradient-to-l from-transparent to-[#C49A6C]" />
            <div className="w-2.5 h-2.5 bg-[#C49A6C] rotate-45 shrink-0" />
            <div className="w-24 md:w-40 h-[1px] bg-gradient-to-l from-[#C49A6C] to-transparent" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-serif text-[#111111] font-bold mb-4"
            dir="auto"
          >
            {t('gallery.title')}
          </h2>
          <p className="text-[#444444] mt-4 text-base md:text-lg font-medium" dir="auto">
            {t('gallery.desc')}
          </p>
        </motion.div>

        {/* Infinite RTL Marquee Container */}
        <div className="relative w-full overflow-hidden py-8">
          <style>{`
            @keyframes marquee-rtl {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
            .animate-marquee-rtl {
              display: flex;
              width: max-content;
              animation: marquee-rtl 25s linear infinite;
            }
            .animate-marquee-rtl:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="animate-marquee-rtl items-center">
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-6 pl-6">
                {/* Card 1: Classic Wedding */}
                <Link
                  href="/demo/wedding-classic"
                  className="relative w-[220px] lg:w-[260px] aspect-[9/16] rounded-[2.5rem] p-3 shrink-0 cursor-pointer group shadow-xl bg-gradient-to-br from-[#F5E5DC] to-[#EAD1C6] border border-white/50 hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[2rem] border-[1.5px] border-[#C49A6C]/30 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-white/20">
                    <div className="absolute inset-2 border-[1px] border-[#C49A6C]/20 rounded-[1.8rem]"></div>
                    <h3 className="font-serif text-3xl font-bold text-[#81462a] mb-3 z-10">
                      {t('gallery.wedding')}
                    </h3>
                    <p className="text-[#81462a] font-medium text-sm z-10">
                      {t('gallery.wedding_names')}
                    </p>
                    <p className="text-[#81462a]/70 text-[10px] tracking-widest mt-4 z-10">
                      24 . 05 . 2025
                    </p>
                  </div>
                </Link>

                {/* Card 2: Floral Engagement */}
                <Link
                  href="/demo/engagement-floral"
                  className="relative w-[220px] lg:w-[260px] aspect-[9/16] rounded-[2.5rem] p-3 shrink-0 cursor-pointer group shadow-xl bg-white border border-[#C49A6C]/20 hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[2rem] border-[1.5px] border-[#A88461]/30 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-white/20">
                    <div className="absolute inset-4 border-[1px] border-[#A88461]/20 rounded-full"></div>
                    <h3 className="font-serif text-3xl font-bold text-[#81462a] mb-3 z-10">
                      {t('gallery.engagement')}
                    </h3>
                    <p className="text-[#81462a] font-medium text-sm z-10">
                      {t('gallery.engagement_names')}
                    </p>
                    <p className="text-[#81462a]/70 text-[10px] tracking-widest mt-4 z-10">
                      18 . 07 . 2025
                    </p>
                  </div>
                </Link>

                {/* Card 3: Modern Graduation */}
                <Link
                  href="/demo/graduation-modern"
                  className="relative w-[240px] lg:w-[280px] aspect-[9/16] rounded-[2.5rem] p-3 shrink-0 cursor-pointer group shadow-2xl bg-[#EBE0D6] border border-white/60 hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[2rem] border-[2px] border-[#C49A6C]/40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-[#EADBD1]/50 shadow-inner">
                    <div className="absolute inset-0 m-3 border-[1.5px] border-[#C49A6C]/30 rounded-[1.5rem] rounded-t-[6rem]"></div>
                    <h3 className="font-serif text-3xl font-bold text-[#81462a] mb-3 z-10">
                      {t('gallery.graduation')}
                    </h3>
                    <div className="text-[#81462a] mb-2 z-10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <p className="text-[#81462a] font-medium text-sm z-10 mt-1">
                      {t('gallery.graduation_desc')}
                    </p>
                    <p className="text-[#81462a] font-serif text-lg tracking-widest mt-1 z-10">
                      2025
                    </p>
                  </div>
                </Link>

                {/* Card 4: Birthday Celebration */}
                <Link
                  href="/demo/birthday-fun"
                  className="relative w-[220px] lg:w-[260px] aspect-[9/16] rounded-[2.5rem] p-3 shrink-0 cursor-pointer group shadow-xl bg-[#1A1A1A] border border-[#333] hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[2rem] border-[1.5px] border-[#C49A6C] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-[#111] to-[#000]">
                    <div className="absolute inset-0 m-2 border-[1px] border-[#C49A6C]/40 rounded-[1.5rem] rounded-t-[5rem]"></div>
                    <div className="absolute top-8 left-8 text-[#C49A6C] opacity-60">✦</div>
                    <div className="absolute top-16 right-6 text-[#C49A6C] opacity-40 text-xs">
                      ✦
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-[#EADBD1] mb-2 z-10 mt-12">
                      {t('gallery.birthday')}
                    </h3>
                    <p className="text-[#C49A6C] font-serif italic text-[15px] z-10 mt-2">
                      {t('gallery.birthday_desc')}
                    </p>
                    <p className="text-[#EADBD1]/50 text-sm mt-4 z-10">♡</p>
                  </div>
                </Link>

                {/* Card 5: Special Occasion */}
                <Link
                  href="/demo/dinner-elegant"
                  className="relative w-[220px] lg:w-[260px] aspect-[9/16] rounded-[2.5rem] p-3 shrink-0 cursor-pointer group shadow-xl bg-gradient-to-bl from-[#F4E3DD] to-[#F5EBE1] border border-white/50 hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[2rem] border-[1.5px] border-[#C49A6C]/30 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-white/30">
                    <div className="absolute inset-3 border-[1px] border-[#C49A6C]/20 rounded-full"></div>
                    <h3 className="font-serif text-2xl font-bold text-[#81462a] mb-4 z-10">
                      {t('gallery.special')}
                    </h3>
                    <p className="text-[#81462a] font-serif italic text-sm z-10 border-b border-[#81462a]/30 pb-1">
                      {t('gallery.special_desc')}
                    </p>
                    <p className="text-[#81462a]/50 text-xs mt-6 z-10">♡</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* View All Templates Link */}
        <div className="mt-16 text-center z-10 relative">
          <Link href="/templates" className="inline-flex items-center gap-2 group cursor-pointer">
            <span className="font-serif text-[#81462a] text-[17px] font-bold">
              {t('gallery.view_all')}
            </span>
            <ArrowLeft className="w-5 h-5 text-[#81462a] group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
