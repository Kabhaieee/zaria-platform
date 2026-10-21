'use client';

/**
 * @file src/app/templates/TemplatesClient.jsx
 * @description Interactive client component for the ZARIA Templates Collection page.
 * Allows visitors to filter invitation templates by occasion category (Wedding, Graduation,
 * Engagement, Special Events) and navigate directly to each live interactive demo.
 */

// 1. React and Next.js core modules
import { useState } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * TemplatesClient Component
 *
 * State Variables:
 * - `activeFilter` {import('@/types/zaria').TemplateCategory}: Currently selected category filter tab.
 *
 * @returns {JSX.Element} The rendered filterable template gallery page.
 */
export default function TemplatesClient() {
  const { t, language } = useLanguage();

  /** @type {[import('@/types/zaria').TemplateCategory, React.Dispatch<React.SetStateAction<import('@/types/zaria').TemplateCategory>>]} */
  const [activeFilter, setActiveFilter] = useState('all');

  // Category filter definitions localized via translation keys
  const filters = [
    { id: 'all', label: t('templates_page.filters.all') },
    { id: 'wedding', label: t('templates_page.filters.wedding') },
    { id: 'graduation', label: t('templates_page.filters.graduation') },
    { id: 'engagement', label: t('templates_page.filters.engagement') },
    { id: 'special', label: t('templates_page.filters.special') },
  ];

  /**
   * Catalog of available digital invitation templates with visual card styling.
   * @type {import('@/types/zaria').TemplateCardItem[]}
   */
  const templates = [
    {
      id: 'wedding-classic',
      category: ['wedding', 'engagement'],
      name: 'كلاسيكي',
      style: 'bg-gradient-to-br from-[#FDFBF9] to-[#F5EFEA] text-[#111111] border-[#C49A6C]',
      innerStyle: 'border-[#C49A6C]/40',
      icon: '🤍',
    },
    {
      id: 'wedding-royal',
      category: ['wedding', 'engagement'],
      name: 'الملكي',
      style: 'bg-gradient-to-br from-[#1A1A1A] to-[#111111] text-[#C49A6C] border-[#C49A6C]',
      innerStyle: 'border-[#C49A6C]/30',
      icon: '♔',
    },
    {
      id: 'engagement-floral',
      category: ['engagement', 'wedding'],
      name: 'خطوبة وردية',
      style: 'bg-gradient-to-br from-[#FDFBF9] to-[#F3EEF5] text-[#8B6CA8] border-[#9A7EAC]',
      innerStyle: 'border-[#9A7EAC]/40',
      icon: '❀',
    },
    {
      id: 'graduation-notebook',
      category: 'graduation',
      name: 'دفتر الذكريات',
      style: 'bg-[#FFFFFF] text-[#1E3A8A] border-[#E5E7EB]',
      innerStyle: 'border-[#1E3A8A]/20',
      icon: '📓',
    },
    {
      id: 'graduation-modern',
      category: 'graduation',
      name: 'تخرج',
      style: 'bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-[#F8FAFC] border-[#1E3A8A]',
      innerStyle: 'border-[#1E3A8A]/40',
      icon: '🎓',
    },
    {
      id: 'birthday-fun',
      category: 'special',
      name: 'ميلاد (سينمائي)',
      style: 'bg-gradient-to-br from-[#FCE7F3] to-[#FDF2F8] text-[#831843] border-[#EC4899]',
      innerStyle: 'border-[#EC4899]/40',
      icon: '🎈',
    },
    {
      id: 'newborn-cute',
      category: 'special',
      name: 'مولود (سينمائي)',
      style: 'bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] text-[#0C4A6E] border-[#0EA5E9]',
      innerStyle: 'border-[#0EA5E9]/40',
      icon: '🍼',
    },
  ];

  // Filter templates based on the active category tab (supports single or multi-category items)
  const filteredTemplates =
    activeFilter === 'all'
      ? templates
      : templates.filter((item) =>
          Array.isArray(item.category)
            ? item.category.includes(activeFilter)
            : item.category === activeFilter
        );

  return (
    <main className="min-h-screen bg-[#FDFBF9] font-sans" dir="rtl">
      <Navbar />

      {/* Hero Header Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C49A6C]/10 rounded-full blur-[100px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-[#C49A6C]/30 text-sm font-medium text-[#81462a]">
              <span className="w-2 h-2 rounded-full bg-[#C49A6C] animate-pulse" />
              ZARIA Collection 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#111111] font-bold mb-6 leading-tight">
              {t('templates_page.title')}
            </h1>
            <p className="text-[#666666] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('templates_page.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Tabs & Template Cards Grid Section */}
      <section className="pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-10">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 border ${
                activeFilter === filter.id
                  ? 'bg-[#111111] text-[#F5EFEA] border-[#111111] shadow-lg scale-105'
                  : 'bg-white text-[#666666] border-[#EAD1C6]/50 hover:border-[#C49A6C] hover:text-[#111111]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Animated Template Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative"
              >
                <Link
                  href={`/demo/${template.id}`}
                  className="block w-full h-full"
                >
                  {/* Luxury Preview Card */}
                  <div
                    className={`w-full aspect-[3/4] rounded-[2rem] p-4 shadow-xl border ${template.style} transition-transform duration-500 group-hover:-translate-y-3 cursor-pointer overflow-hidden relative`}
                  >
                    {/* Subtle Shimmer Highlight on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full" />

                    <div
                      className={`w-full h-full rounded-[1.5rem] border-[1.5px] ${template.innerStyle} flex flex-col items-center justify-center p-8 text-center relative`}
                    >
                      <div className="text-4xl mb-6 opacity-80">{template.icon}</div>

                      <h3 className="font-serif text-3xl font-bold mb-3 z-10 leading-tight">
                        {template.name}
                      </h3>

                      <p className="text-sm font-medium opacity-60 tracking-widest uppercase mt-4">
                        {Array.isArray(template.category)
                          ? template.category.map((c) => t(`templates_page.filters.${c}`)).join(' و ')
                          : t(`templates_page.filters.${template.category}`)}
                      </p>
                    </div>
                  </div>

                  {/* Hover Action Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-white text-[#111111] px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 pointer-events-auto">
                      {t('templates_page.preview_btn')}
                      {language === 'ar' ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Back to Home Call-to-Action */}
      <section className="py-20 text-center border-t border-[#EAD1C6]/30">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-[#111111] font-bold text-lg hover:text-[#C49A6C] transition-colors group"
        >
          {language === 'ar' ? (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          ) : (
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          )}
          {t('nav.home')}
        </Link>
      </section>

      <Footer />
    </main>
  );
}
