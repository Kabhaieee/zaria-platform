'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function LegalPageLayout({ contentKey }) {
  const { t, language } = useLanguage();
  
  // Safe fetch function for nested translation objects
  const getContent = () => {
    try {
      const data = t(contentKey);
      if (typeof data === 'object' && data !== null) {
        return data;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const content = getContent();

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAF6F3]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF6F3] pt-32 pb-24 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-5 relative z-10 flex flex-col items-center">
        
        {/* Back to Home Button */}
        <div className="w-full flex justify-start mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#C49A6C] hover:text-[#A88461] transition-colors font-medium text-sm group">
            <span className="bg-[#C49A6C]/10 p-2 rounded-full border border-[#C49A6C]/30 group-hover:bg-[#C49A6C]/20 transition-colors">
              {language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </span>
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          {/* Top Decorative Line with Star */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[1px] bg-[#C49A6C]"></div>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#C49A6C" stroke="none">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
            <div className="w-4 h-[1px] bg-[#C49A6C]"></div>
          </div>

          {/* Main ZARIA Text */}
          <div className="font-serif text-[#C49A6C] text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] font-normal" dir="ltr">
            ZARIA
          </div>
          
          {/* Subtitle */}
          <div className="text-[#C49A6C] text-[7px] md:text-[9px] font-medium tracking-[0.4em] uppercase mt-1">
            &lrm;E-INVITATIONS&lrm;
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-[#2D2A3B] text-4xl md:text-5xl lg:text-6xl font-black mb-4 font-serif">
            {content.title}
          </h1>
          <p className="text-[#A9A098] text-sm md:text-base font-medium mb-8">
            {content.last_updated}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#555555] text-base md:text-lg text-center max-w-3xl mx-auto leading-loose mb-12 px-4"
        >
          {content.intro}
        </motion.p>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-[#EAD1C6]/30 w-full mb-12"
        >
          {content.sections && content.sections.map((section, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h2 className="text-[#2D2A3B] font-bold text-xl md:text-2xl mb-6 font-serif">
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-4 text-[#6A6359] text-base md:text-lg leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5768B] shrink-0 mt-3 opacity-80" />
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom Quick Links & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {contentKey !== 'privacy' && (
              <a href="/privacy" className="px-6 py-2.5 bg-white border border-[#EAD1C6]/50 rounded-full text-[#2D2A3B] text-sm font-bold shadow-sm hover:border-[#C49A6C] hover:text-[#C49A6C] transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
            )}
            {contentKey !== 'terms' && (
              <a href="/terms" className="px-6 py-2.5 bg-white border border-[#EAD1C6]/50 rounded-full text-[#2D2A3B] text-sm font-bold shadow-sm hover:border-[#C49A6C] hover:text-[#C49A6C] transition-colors">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms and Conditions'}
              </a>
            )}
            {contentKey !== 'refund' && (
              <a href="/refund" className="px-6 py-2.5 bg-white border border-[#EAD1C6]/50 rounded-full text-[#2D2A3B] text-sm font-bold shadow-sm hover:border-[#C49A6C] hover:text-[#C49A6C] transition-colors">
                {language === 'ar' ? 'سياسة الاسترجاع' : 'Refund Policy'}
              </a>
            )}
          </div>
          
          <div className="text-sm font-medium text-[#A9A098]">
            {language === 'ar' ? 'عندك سؤال؟ ' : 'Have a question? '}
            <a href="https://wa.me/962700000000" target="_blank" rel="noopener noreferrer" className="text-[#C49A6C] font-bold hover:underline mx-1">
              {language === 'ar' ? 'راسلنا على واتساب' : 'Message us on WhatsApp'}
            </a>
            {' • '}
            <a href="mailto:hello@zaria.com?subject=استفسار%20عن%20منصة%20ZARIA" className="hover:text-[#C49A6C] transition-colors">
              zaria.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
