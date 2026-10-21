import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t, language } = useLanguage();
  return (
    <>
      {/* HERO SECTION — Full-bleed with pre-designed image */}
      <section className="relative min-h-[100dvh] w-full flex items-center overflow-x-hidden bg-[#e5d3c7] pb-12 md:pb-0">
      {/* Full-Screen Background Image (NO overlays) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/bg-ready.jpeg"
          alt="Zaria Background"
          fill
          priority
          quality={100}
          className="object-contain md:object-cover object-top"
        />
      </div>

      {/* Left-Edge Vertical Accent (physical left in RTL = CSS left) */}
      <div className="absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-5">
        {/* Golden Crown (Centered above Z) */}
        <div className="flex flex-col items-center justify-center w-full mb-1">
          <svg width="18" height="15" viewBox="0 0 24 20" fill="#C49A6C" stroke="none" className="opacity-100">
            <path d="M2 15L4.5 6L9.5 11L12 3L14.5 11L19.5 6L22 15H2ZM3 17H21V18.5H3V17Z" />
            <circle cx="12" cy="1.5" r="1.5" />
            <circle cx="4" cy="4.5" r="1.2" />
            <circle cx="20" cy="4.5" r="1.2" />
          </svg>
        </div>

        {/* Vertical Letters (Rich Gold) */}
        <div className="flex flex-col items-center gap-6">
          {'ZARIA'.split('').map((letter, i) => (
            <span key={i} className="font-serif font-light text-[15px] tracking-widest text-[#C49A6C] opacity-100">{letter}</span>
          ))}
        </div>
        
        {/* Vertical Line */}
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#C49A6C] to-transparent mt-4 opacity-70" />
      </div>

      <Navbar />
      {/* Hero Content */}
      <motion.div
        className={`relative z-10 w-full lg:w-[45%] h-full flex flex-col justify-center items-center md:items-start text-center md:text-right md:ml-auto pb-16 md:pb-24 lg:pb-16 px-5 md:px-16 md:mt-0 ${language === 'en' ? 'pt-[200px] sm:pt-[240px] md:pt-40 lg:pt-56 mt-0' : 'pt-16 md:pt-40 lg:pt-56 mt-8 md:mt-0'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Heading */}
        <h1 className={`font-serif leading-[1.4] md:leading-[1.2] text-[#111111] ${language === 'en' ? 'font-medium text-2xl sm:text-4xl lg:text-5xl xl:text-[3.5rem]' : 'font-bold text-[2.5rem] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]'}`} dir="auto">
          {t('hero.title_1')}<br />
          {t('hero.title_2')} <span className="text-[#A88461] italic font-normal">{t('hero.title_3')}</span>
        </h1>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] lg:text-[17px] text-[#444444] max-w-[420px] leading-[1.8] mt-4 sm:mt-6 font-medium" dir="auto">
          {t('hero.desc')}
        </p>

        {/* Decorative Golden Divider */}
        <div className="flex items-center justify-center w-full max-w-md my-6 sm:my-8 opacity-70">
          <div className="h-[1px] bg-gradient-to-l from-transparent to-[#C49A6C] flex-1"></div>
          <div className="mx-4 rotate-45 w-2 h-2 bg-[#C49A6C]"></div>
          <div className="h-[1px] bg-gradient-to-r from-transparent to-[#C49A6C] flex-1"></div>
        </div>

        {/* Categories Grid & CTA Wrapper */}
        <div className="flex flex-col items-center w-full max-w-[90%] sm:max-w-lg mx-auto md:mx-0">
          {/* Categories Horizontal Scroll */}
          <div className="w-full bg-[#333333]/40 backdrop-blur-2xl rounded-[1.5rem] p-3 sm:p-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/20">
            <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar snap-x px-1">
              
              {/* 1. Graduation */}
              <div className="flex flex-col items-center justify-center gap-1.5 min-w-[65px] snap-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e5d3c7]"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                <span className="text-[11px] font-medium tracking-wide">{t('hero.cat_graduation')}</span>
              </div>
              
              {/* Divider */}
              <div className="w-[1px] h-8 bg-white/10 shrink-0"></div>
              
              {/* 2. Birthday */}
              <div className="flex flex-col items-center justify-center gap-1.5 min-w-[65px] snap-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e5d3c7]"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4-2 2-1 2-1" /><path d="M2 21h20" /><path d="M12 7v4" /><path d="M12 3v.01" /></svg>
                <span className="text-[11px] font-medium tracking-wide">{t('hero.cat_birthday')}</span>
              </div>
              
              {/* Divider */}
              <div className="w-[1px] h-8 bg-white/10 shrink-0"></div>
              
              {/* 3. Engagement */}
              <div className="flex flex-col items-center justify-center gap-1.5 min-w-[65px] snap-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e5d3c7]"><path d="M2.7 10.3L12 22l9.3-11.7L16 3H8z" /><path d="M2 10h20" /><path d="M8 3l4 7 4-7" /><path d="M12 22L8 10" /><path d="M12 22l4-12" /></svg>
                <span className="text-[11px] font-medium tracking-wide">{t('hero.cat_engagement')}</span>
              </div>

              {/* Divider */}
              <div className="w-[1px] h-8 bg-white/10 shrink-0"></div>

              {/* 4. Wedding */}
              <div className="flex flex-col items-center justify-center gap-1.5 min-w-[65px] snap-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e5d3c7]">
                  <circle cx="12" cy="16" r="5" />
                  <path d="M12 5l-3 3 3 3 3-3-3-3z" />
                </svg>
                <span className="text-[11px] font-medium tracking-wide">{t('hero.cat_wedding')}</span>
              </div>
              
              {/* Divider */}
              <div className="w-[1px] h-8 bg-white/10 shrink-0"></div>
              
              {/* 5. Other Occasions */}
              <div className="flex flex-col items-center justify-center gap-1.5 min-w-[65px] snap-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e5d3c7]">
                  <path d="M12 4v16"/><path d="M5.5 8l13 8"/><path d="M18.5 8l-13 8"/>
                </svg>
                <span className="text-[11px] font-medium tracking-wide">{t('hero.cat_other')}</span>
              </div>

            </div>
          </div>

          {/* Centered CTA Button */}
          <a href="#contact" className="relative mt-6 sm:mt-8 bg-gradient-to-r from-[#C49A6C] to-[#d3bcab] hover:from-[#A88461] hover:to-[#C49A6C] text-white transition-all rounded-full h-[56px] w-full flex items-center shadow-lg group border border-white/20">
            {/* The Text - Centered absolutely so it ignores the icon's physical width */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-6">
               <span className="text-[16px] font-bold tracking-wide text-white">{t('hero.cta')}</span>
            </div>
            
            {/* The Icon */}
            <div className="absolute left-1.5 top-1.5 bottom-1.5 w-[44px] bg-white/90 rounded-full text-[#A88461] flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
          </a>
        </div>
      </motion.div>
    </section>
    </>
  );
}
