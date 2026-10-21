'use client';

/**
 * @file src/components/Partners.jsx
 * @description Infinite horizontal marquee section showcasing upcoming exclusive
 * partner perks and vendor discounts (wedding halls, bridal suites, photography, spa)
 * available to ZARIA clients.
 */

// 1. Third-party libraries
import { motion } from 'framer-motion';
import { Building2, Camera, Crown, HeartPulse, Sparkles } from 'lucide-react';

// 2. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Partners Component
 *
 * @returns {JSX.Element} The animated partner offers marquee section.
 */
export default function Partners() {
  const { t, language } = useLanguage();

  // Partner privilege cards displayed in the scrolling marquee
  const partners = [
    {
      name: language === 'ar' ? 'قريباً' : 'Coming Soon',
      offer: t('partners.offer_hall'),
      icon: <Building2 className="w-5 h-5 text-[#C49A6C]" />,
    },
    {
      name: language === 'ar' ? 'قريباً' : 'Coming Soon',
      offer: t('partners.offer_suite'),
      icon: <Crown className="w-5 h-5 text-[#C49A6C]" />,
    },
    {
      name: language === 'ar' ? 'قريباً' : 'Coming Soon',
      offer: t('partners.offer_photo'),
      icon: <Camera className="w-5 h-5 text-[#C49A6C]" />,
    },
    {
      name: language === 'ar' ? 'قريباً' : 'Coming Soon',
      offer: t('partners.offer_spa'),
      icon: <HeartPulse className="w-5 h-5 text-[#C49A6C]" />,
    },
    {
      name: language === 'ar' ? 'قريباً' : 'Coming Soon',
      offer: t('partners.offer_hall'),
      icon: <Building2 className="w-5 h-5 text-[#C49A6C]" />,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F5EFEA] overflow-hidden relative border-t border-[#C49A6C]/20">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-5 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#C49A6C]" />
            <h2 className="text-[#C49A6C] uppercase tracking-widest text-sm font-semibold">
              {t('partners.title')}
            </h2>
            <Sparkles className="w-5 h-5 text-[#C49A6C]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-[#111111] max-w-2xl mx-auto leading-relaxed">
            {t('partners.desc')}
          </h3>
        </motion.div>
      </div>

      {/* Continuous Horizontal Marquee Track */}
      <div className="relative flex overflow-x-hidden group" dir="rtl">
        <style>{`
          @keyframes marquee-unified-partners {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .animate-marquee-partners {
            display: flex;
            width: max-content;
            animation: marquee-unified-partners 90s linear infinite;
          }
          .animate-marquee-partners:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Left & Right Edge Soft Fade Gradients */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#F5EFEA] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#F5EFEA] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-partners items-center py-4">
          {[...Array(6)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center gap-6 md:gap-8 px-3 md:px-4">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  className="flex flex-col items-center justify-center min-w-[280px] md:min-w-[320px] bg-white rounded-3xl p-8 border border-[#C49A6C]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(196,166,146,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="bg-[#F5EFEA] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                    {partner.icon}
                  </div>
                  <h4 className="text-xl font-serif text-[#111111] font-bold mb-3 text-center">
                    {partner.name}
                  </h4>
                  <div className="bg-[#111111] text-[#F5EFEA] text-xs font-bold px-4 py-2 rounded-full w-full text-center whitespace-normal break-words leading-relaxed">
                    {partner.offer}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
