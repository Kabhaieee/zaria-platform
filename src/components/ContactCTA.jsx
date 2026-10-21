/**
 * @file src/components/ContactCTA.jsx
 * @description Final call-to-action banner and local Jordanian payment methods showcase
 * (CliQ, Zain Cash, Bank Transfer) displayed near the bottom of the landing page.
 */

// 1. Third-party libraries
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// 2. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * ContactCTA Component
 *
 * @returns {JSX.Element} The final order CTA card and local trust/payment badges section.
 */
export default function ContactCTA() {
  const { t } = useLanguage();

  /**
   * Handles clicks on the primary CTA button and displays a confirmation toast notification.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - Click event object.
   */
  const handleOrderClick = (e) => {
    e.preventDefault();
    toast.success('تم استلام طلبك بنجاح! سنتواصل معك قريباً.', {
      description: 'Your request has been received successfully!',
      icon: '✨',
    });
  };

  return (
    <>
      {/* FINAL CALL-TO-ACTION BANNER */}
      <section id="contact" className="px-5 md:px-10 py-8 md:py-12 max-w-5xl mx-auto">
        <motion.div
          className="relative bg-[#111111] text-[#F5EFEA] rounded-[2.5rem] px-8 md:px-16 py-10 md:py-12 text-center overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Ambient Gold Blur Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A88461]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C49A6C]/15 rounded-full blur-[80px]" />

          <div className="gold-line mx-auto mb-8 relative z-10" />

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-[1.4] relative z-10"
            dir="auto"
          >
            {t('contact.title_start')}
            <span className="text-[#C49A6C]">{t('contact.title_highlight')}</span>
          </h2>
          <p
            className="text-[#F5EFEA]/60 font-light text-base md:text-lg mb-10 max-w-xl mx-auto leading-[1.8] relative z-10"
            dir="auto"
          >
            {t('contact.desc')}
          </p>
          <button
            onClick={handleOrderClick}
            className="inline-flex items-center gap-3 bg-[#C49A6C] text-white px-9 py-4 rounded-full font-bold shadow-lg hover:bg-white hover:text-[#111111] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base relative z-10 cursor-pointer border-none"
          >
            {t('contact.cta')}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* LOCAL TRUST & PAYMENT METHODS SECTION */}
      <section className="py-10 md:py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm rounded-[2.5rem] shadow-sm border border-[#C49A6C]/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-right flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-[#111111] font-serif mb-3">
              {t('payment_title')}
            </h3>
            <p className="text-[#C49A6C] text-base leading-relaxed">{t('payment_desc')}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 shrink-0">
            {[t('pay1'), t('pay2'), t('pay3')].map((label) => (
              <div
                key={label}
                className="bg-[#F5EFEA] border border-[#EAD1C6] text-[#111111] font-bold px-6 py-3 rounded-full flex items-center gap-2 text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#A88461] shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
