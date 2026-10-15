'use client';

import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const pathname = usePathname();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.templates'), href: '/templates' },
    { label: t('nav.pricing'), href: '/#pricing' },
    { label: t('nav.testimonials'), href: '/#testimonials' },
    { label: t('nav.contact'), href: '/#contact' },
  ];

  const handleScroll = (e, href) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Also close mobile menu if it's open
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Navbar */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-6 lg:px-16 py-8 z-50">
        
        {/* RIGHT side (physical) — Hamburger + CTA (first in RTL DOM) */}
        <div className="flex items-center gap-3 h-12">
          {/* 1. Hamburger Menu (renders far right in RTL) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-[#C49A6C] p-3 rounded-full text-white shadow-md hover:bg-[#A88461] transition-colors relative z-[60]"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* 2. CTA Button (renders to the left of Hamburger in RTL) */}
          <a href="/#contact" onClick={(e) => handleScroll(e, '/#contact')} className="hidden md:flex items-center gap-2 border border-[#C49A6C]/30 bg-[#F9F6F3]/50 backdrop-blur-md text-[#111111] px-6 py-2.5 rounded-full hover:bg-[#F9F6F3]/80 transition-colors text-sm font-medium shadow-sm">
            {t('nav.start_design')}{" "}
            <span className="text-[#C49A6C] text-lg leading-none mb-0.5">+</span>
          </a>

        </div>

        {/* CENTER — Nav Links (desktop) */}
        <div className="hidden lg:flex items-center gap-10 h-12">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group cursor-pointer">
              <Link
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`text-[15px] font-medium transition-colors duration-300 ${
                  pathname === link.href ? 'text-[#C49A6C]' : 'text-[#111111] hover:text-[#C49A6C]'
                }`}
              >
                {link.label}
              </Link>
              {pathname === link.href && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-[#C49A6C]"></div>
              )}
            </div>
          ))}
        </div>

        {/* LEFT side (physical) — Logo (last in RTL DOM) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 flex flex-col items-center lg:-mt-5 z-[60]">
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
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#F5EFEA]/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-6 bg-[#C49A6C] p-3 rounded-full text-white shadow-md hover:bg-[#A88461] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`text-2xl font-serif transition-colors duration-300 ${
                    pathname === link.href ? 'text-[#C49A6C]' : 'text-[#444444] hover:text-[#C49A6C]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-4 w-full px-8">
                <a 
                  href="/#contact" 
                  onClick={(e) => handleScroll(e, '/#contact')}
                  className="w-full text-center bg-gradient-to-r from-[#C49A6C] to-[#A88461] text-white py-4 rounded-full font-bold shadow-lg"
                >
                  {t('nav.start_design')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
