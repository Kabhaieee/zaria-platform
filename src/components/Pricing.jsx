import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();
  return (
    <>
      {/* PRICING SECTION */}
      <section id="pricing" className="relative py-12 md:py-8 overflow-hidden bg-gradient-to-b from-[#FAF6F3]/80 via-[#FAF6F3] to-transparent">
      {/* Header */}
      <motion.div
        className="relative z-10 text-center px-5 mb-16"
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
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111] mb-4" dir="auto">
          {t('pricing.title')}
        </h2>
        <p className="text-[#444444] text-base md:text-lg font-medium max-w-2xl mx-auto" dir="auto">
          {t('pricing.desc')}
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center" dir="rtl">
          
          {/* Basic Package */}
          <motion.div 
            className="bg-white rounded-3xl p-8 border border-[#E8DCCB] shadow-sm relative flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-[#111111] mb-2 font-serif">{t('pricing.basic_title')}</h3>
              <p className="text-[#444444] text-sm mb-6">{t('pricing.basic_desc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                t('pricing.basic_f1'),
                t('pricing.basic_f2'),
                t('pricing.basic_f3'),
                t('pricing.basic_f4'),
                t('pricing.basic_f5')
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#444444] text-sm font-medium leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="block text-center w-full py-3 rounded-full border border-[#C49A6C] text-[#C49A6C] font-bold hover:bg-[#C49A6C] hover:text-white transition-colors">
              {t('pricing.cta')}
            </a>
          </motion.div>

          {/* Comprehensive Package (Center) */}
          <motion.div 
            className="bg-[#2A2522] rounded-3xl p-8 border border-[#C49A6C] shadow-lg relative flex flex-col h-full transform md:-translate-y-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D6B58F] to-[#C49A6C] text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <span>{t('pricing.badge')}</span>
              <span>⭐</span>
            </div>

            <div className="text-center mb-8 mt-2">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-white mb-2 font-serif">{t('pricing.comp_title')}</h3>
              <p className="text-[#D6B58F] text-sm mb-6">{t('pricing.comp_desc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                t('pricing.comp_f1'),
                t('pricing.comp_f2'),
                t('pricing.comp_f3'),
                t('pricing.comp_f5'),
                t('pricing.comp_f6'),
                t('pricing.comp_f7'),
                t('pricing.comp_f8'),
                t('pricing.comp_f9')
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#F9F6F3] text-sm font-medium leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="block text-center w-full py-3 rounded-full bg-gradient-to-r from-[#D6B58F] to-[#C49A6C] text-white font-bold shadow-md hover:opacity-90 transition-opacity">
              {t('pricing.cta')}
            </a>
          </motion.div>

          {/* Royal Package */}
          <motion.div 
            className="bg-white rounded-3xl p-8 border border-[#E8DCCB] shadow-sm relative flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-2xl font-bold text-[#111111] mb-2 font-serif">{t('pricing.royal_title')}</h3>
              <p className="text-[#444444] text-sm mb-6">{t('pricing.royal_desc')}</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                t('pricing.royal_f1'),
                t('pricing.royal_f2'),
                t('pricing.royal_f3'),
                t('pricing.royal_f4'),
                t('pricing.royal_f5'),
                t('pricing.royal_f6'),
                t('pricing.royal_f7'),
                t('pricing.royal_f8')
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#444444] text-sm font-medium leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="block text-center w-full py-3 rounded-full border border-[#C49A6C] text-[#C49A6C] font-bold hover:bg-[#C49A6C] hover:text-white transition-colors">
              {t('pricing.cta')}
            </a>
          </motion.div>

        </div>
      </div>
    </section>
    </>
  );
}
