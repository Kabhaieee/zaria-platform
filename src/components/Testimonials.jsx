import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();
  return (
    <>
      {/* TESTIMONIALS — WhatsApp-Style Marquee */}
      <section id="testimonials" className="py-12 md:py-8 overflow-hidden bg-gradient-to-b from-transparent to-[#FAF6F3]/80">
      {/* Header */}
      <motion.div
        className="text-center mb-14 md:mb-20 px-5"
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
        <h2 className="text-3xl md:text-4xl font-bold text-[#111111] font-serif mb-3" dir="auto">
          {t('testimonials.title')}
        </h2>
        <p className="text-[#C49A6C] font-light text-base md:text-lg" dir="auto">
          {t('testimonials.desc')}
        </p>
      </motion.div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-[#F5EFEA] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-[#F5EFEA] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex gap-6 w-max">
          {[...Array(2)].map((_, dupeIdx) => (
            <div key={dupeIdx} className="flex gap-6">
              {[
                { phone: '+962 79 *** ****', text: t('testimonials.t1'), time: t('testimonials.time1') },
                { phone: '+962 77 *** ****', text: t('testimonials.t2'), time: t('testimonials.time2') },
                { phone: '+966 55 *** ****', text: t('testimonials.t3'), time: t('testimonials.time3') },
                { phone: '+962 78 *** ****', text: t('testimonials.t4'), time: t('testimonials.time4') },
              ].map((card, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 shrink-0">
                  <div className="rounded-2xl w-[280px] sm:w-[300px] md:w-[350px] overflow-hidden flex flex-col shadow-lg border border-[#202C33]/20 bg-[#0B141A]">
                    {/* WA Dark Header */}
                    <div className="bg-[#202C33] px-3 py-3 flex items-center gap-3">
                      <ArrowLeft className="w-5 h-5 text-[#8696A0] shrink-0" />
                      <div className="w-10 h-10 rounded-full bg-[#6b7280] flex items-center justify-center shrink-0 overflow-hidden">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#CFD4D6] mt-2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#E9EDEF] text-[15px] font-medium truncate" dir="ltr">{card.phone}</p>
                        <p className="text-[#8696A0] text-xs mt-0.5">{t('testimonials.last_seen')}</p>
                      </div>
                    </div>

                    {/* WA Dark Body */}
                    <div className="bg-[#0B141A] p-4 flex flex-col relative min-h-[180px]">
                      {/* Date Badge */}
                      <div className="flex justify-center mb-6 relative z-10">
                        <span className="bg-[#182229] text-[#8696A0] text-[11px] px-3 py-1 rounded-lg shadow-sm">{t('testimonials.today')}</span>
                      </div>

                      {/* Received Message Bubble */}
                      <div className="relative z-10 self-start max-w-[85%]">
                        <div className="bg-[#202C33] text-[#E9EDEF] p-3 pb-7 rounded-xl rounded-tr-none text-[14.5px] leading-relaxed shadow-sm relative">
                          <p>{card.text}</p>
                          
                          {/* Time */}
                          <div className="absolute bottom-1.5 left-3 text-[10px] text-[#8696A0]">
                            {card.time}
                          </div>
                        </div>
                        
                        {/* Heart Reaction */}
                        <div className="absolute -bottom-3 -left-2 bg-[#202C33] rounded-full p-1 border-[2px] border-[#0B141A] flex items-center justify-center shadow-sm">
                          <span className="text-xs leading-none">❤️</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
