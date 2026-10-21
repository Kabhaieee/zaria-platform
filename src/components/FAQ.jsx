/**
 * @file src/components/FAQ.jsx
 * @description Frequently Asked Questions (FAQ) accordion section on the ZARIA landing page.
 * Renders expandable `<details>` items with localized questions and answers.
 */

// 1. Third-party libraries
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// 2. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * FAQ Component
 *
 * @returns {JSX.Element} The rendered FAQ accordion section.
 */
export default function FAQ() {
  const { t } = useLanguage();

  // Localized question-and-answer pairs
  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
  ];

  return (
    <>
      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="py-12 md:py-8 bg-gradient-to-b from-transparent to-[#F9F4F0]/60 w-full">
        <div className="px-5 md:px-10 max-w-3xl mx-auto">
          {/* Section Heading */}
          <motion.div
            className="text-center mb-14 md:mb-20"
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
              {t('faq.title')}
            </h2>
          </motion.div>

          {/* Expandable FAQ Accordion List */}
          <div className="space-y-4 text-right">
            {faqItems.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white/50 backdrop-blur-sm rounded-2xl border border-[#C49A6C]/25 shadow-sm overflow-hidden cursor-pointer transition-all"
              >
                <summary className="px-6 py-5 font-bold text-[#111111] flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#C49A6C] transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[#C49A6C] font-light leading-[1.9] text-sm md:text-base">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
