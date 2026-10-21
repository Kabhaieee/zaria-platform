/**
 * @file src/components/BoutiqueProcess.jsx
 * @description Landing page section illustrating the 3-step ZARIA Boutique workflow:
 * 1. Choosing a design & submitting details, 2. Custom tailoring & preview, 3. Instant sharing.
 */

// 1. Third-party libraries
import { motion } from 'framer-motion';
import { Heart, Paintbrush, Send } from 'lucide-react';

// 2. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * BoutiqueProcess Component
 *
 * @returns {JSX.Element} The 3-step boutique process showcase section.
 */
export default function BoutiqueProcess() {
  const { t } = useLanguage();

  // Ordered workflow steps with localized titles, descriptions, and icons
  const processSteps = [
    {
      step: '٠١',
      title: t('process.step1_title'),
      desc: t('process.step1_desc'),
      Icon: Send,
    },
    {
      step: '٠٢',
      title: t('process.step2_title'),
      desc: t('process.step2_desc'),
      Icon: Paintbrush,
    },
    {
      step: '٠٣',
      title: t('process.step3_title'),
      desc: t('process.step3_desc'),
      Icon: Heart,
    },
  ];

  return (
    <>
      {/* BOUTIQUE PROCESS SECTION */}
      <section className="py-12 md:py-8 bg-gradient-to-b from-transparent to-[#FAF6F3]/60 w-full">
        <div className="px-5 md:px-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
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
              {t('process.title')}
            </h2>
            <p className="text-[#C49A6C] font-light text-base md:text-lg" dir="auto">
              {t('process.desc')}
            </p>
          </motion.div>

          {/* 3-Column Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {processSteps.map((item, idx) => (
              <motion.div
                key={idx}
                className="group flex flex-col items-center text-center bg-white/60 backdrop-blur-md p-10 md:p-12 rounded-[2.5rem] border border-[#C49A6C]/30 hover:border-[#A88461]/50 shadow-sm hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                {/* Circular Gold-Bordered Icon Badge */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#F9F6F3] to-white border border-[#C49A6C]/30 flex items-center justify-center text-[#A88461] mb-8 group-hover:scale-110 group-hover:shadow-md group-hover:bg-[#FDFBF9] transition-all duration-500">
                  <div className="absolute inset-2 border-[1px] border-[#C49A6C]/10 rounded-full"></div>
                  <item.Icon className="w-8 h-8 relative z-10" strokeWidth={1.2} />
                </div>

                <h3 className="text-xl md:text-2xl font-bold font-serif text-[#111111] mb-4">
                  {item.title}
                </h3>

                <p className="text-[#444444] font-medium leading-relaxed text-sm md:text-[15px] px-2 opacity-90">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
