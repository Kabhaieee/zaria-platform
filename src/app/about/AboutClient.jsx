'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutClient() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FAF6F3] font-sans relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C49A6C]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 -left-32 w-80 h-80 bg-[#EAD1C6]/30 rounded-full blur-[100px] pointer-events-none" />

      <section className="pt-36 pb-24 px-5 relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Back to Home Button */}
        <div className="w-full flex justify-start mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#C49A6C] hover:text-[#A88461] transition-colors font-medium text-sm group">
            <span className="bg-[#C49A6C]/10 p-2 rounded-full border border-[#C49A6C]/30 group-hover:bg-[#C49A6C]/20 transition-colors">
              {language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </span>
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-[1px] bg-[#C49A6C]" />
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#C49A6C" stroke="none">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
            </svg>
            <div className="w-6 h-[1px] bg-[#C49A6C]" />
          </div>

          <div className="font-serif text-[#C49A6C] text-2xl md:text-3xl tracking-[0.25em] font-normal" dir="ltr">
            ZARIA
          </div>

          <div className="text-[#C49A6C] text-[8px] md:text-[9px] font-medium tracking-[0.4em] uppercase mt-1" dir="ltr">
            E-INVITATIONS
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-[#2D2A3B] text-4xl md:text-5xl lg:text-6xl font-black font-serif leading-tight">
            من نحن — <span className="text-[#C49A6C]" dir="ltr">ZARIA</span>
          </h1>
        </motion.div>

        {/* Main Luxury Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-[#EAD1C6]/40 w-full relative overflow-hidden"
        >
          {/* Top Gold Line Accent */}
          <div className="w-16 h-1 bg-gradient-to-r from-[#C49A6C] to-[#EAD1C6] rounded-full mx-auto mb-10" />

          <div className="space-y-8 text-center md:text-right max-w-3xl mx-auto">
            <p className="text-[#2D2A3B] text-lg md:text-xl lg:text-2xl leading-[2] font-medium">
              في زاريا (<span className="text-[#C49A6C] font-serif font-bold">ZARIA</span>)، نؤمن بأن كل مناسبة سعيدة تبدأ من لحظة الدعوة. نحن منصة متخصصة في تصميم وابتكار الدعوات الإلكترونية الفاخرة، نسعى لتحويل تفاصيل فرحتكم إلى تجربة رقمية استثنائية تبقى في الذاكرة.
            </p>

            <div className="flex items-center justify-center gap-3 py-2 opacity-60">
              <div className="w-12 h-[1px] bg-[#C49A6C]/50" />
              <Sparkles className="w-4 h-4 text-[#C49A6C]" />
              <div className="w-12 h-[1px] bg-[#C49A6C]/50" />
            </div>

            <p className="text-[#555555] text-base md:text-lg lg:text-xl leading-[2.1] font-light">
              نمزج بين أصالة الضيافة العربية وأناقة التصميم العصري، لنمنحكم دعوة تعبّر عن ذوقكم الرفيع وتصل إلى قلوب ضيوفكم قبل هواتفهم. من تنظيم تأكيد الحضور بكل سلاسة، إلى توثيق كلمات المهنئين ومشاعرهم الصادقة في مكان واحد؛ نحن هنا لنجعل التحضير لمناسبتكم أكثر سهولة، وأناقة، وبهجة.
            </p>
          </div>

          {/* CTA inside card */}
          <div className="mt-12 pt-8 border-t border-[#EAD1C6]/30 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 bg-[#C49A6C] text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-base shadow-md hover:bg-[#A88461] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>استكشف تصاميمنا</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 bg-[#FAF6F3] text-[#2D2A3B] border border-[#EAD1C6] px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:border-[#C49A6C] hover:text-[#C49A6C] transition-all duration-300"
            >
              <span>الباقات والأسعار</span>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
