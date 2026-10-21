'use client';

/**
 * @file src/components/Navbar.jsx
 * @description Floating responsive navigation bar and full-screen mobile menu overlay
 * for the ZARIA platform. Supports smooth anchor scrolling on the landing page and
 * direct route navigation across `/`, `/templates`, and `/about`.
 */

// 1. React and Next.js core modules
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 2. Third-party libraries
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Navbar Component
 *
 * State Variables:
 * - `isMobileMenuOpen` {boolean}: Controls visibility of the full-screen mobile drawer.
 *
 * @returns {JSX.Element} The floating top navigation bar and mobile menu overlay.
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  // Primary navigation items
  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.templates'), href: '/templates' },
    { label: t('nav.pricing'), href: '/#pricing' },
    { label: t('nav.testimonials'), href: '/#testimonials' },
    { label: t('footer.link_about'), href: '/about' },
    { label: t('nav.contact'), href: '/#contact' },
  ];

  /**
   * Smoothly scrolls to an in-page section anchor when already on the home route (`/`),
   * and closes the mobile navigation drawer if open.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - Click event object.
   * @param {string} href - Target link destination.
   */
  const handleScroll = (e, href) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Top Navigation Bar */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-6 lg:px-16 py-8 z-50">
        {/* Physical Right (First in RTL DOM): Mobile Menu Trigger + Start Design CTA */}
        <div className="flex items-center gap-3 h-12">
          {/* 1. Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-[#C49A6C] p-3 rounded-full text-white shadow-md hover:bg-[#A88461] transition-colors relative z-[60]"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* 2. Desktop Start Design CTA Button */}
          <a
            href="/#contact"
            onClick={(e) => handleScroll(e, '/#contact')}
            className="hidden md:flex items-center gap-2 border border-[#C49A6C]/30 bg-[#F9F6F3]/50 backdrop-blur-md text-[#111111] px-6 py-2.5 rounded-full hover:bg-[#F9F6F3]/80 transition-colors text-sm font-medium shadow-sm"
          >
            {t('nav.start_design')}{' '}
            <span className="text-[#C49A6C] text-lg leading-none mb-0.5">+</span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-10 h-12">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group cursor-pointer">
              <Link
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`text-[15px] font-medium transition-colors duration-300 ${
                  pathname === link.href
                    ? 'text-[#C49A6C]'
                    : 'text-[#111111] hover:text-[#C49A6C]'
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

        {/* Physical Left (Last in RTL DOM): ZARIA Brand Logo with Crown */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 flex flex-col items-center lg:-mt-5 z-[60]">
          {/* Top Decorative Line with Golden Crown */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-[1px] bg-[#C49A6C]"></div>
            <svg width="13" height="11" viewBox="0 0 24 20" fill="#C49A6C" stroke="none">
              <path d="M2 15L4.5 6L9.5 11L12 3L14.5 11L19.5 6L22 15H2ZM3 17H21V18.5H3V17Z" />
              <circle cx="12" cy="1.5" r="1.5" />
              <circle cx="4" cy="4.5" r="1.2" />
              <circle cx="20" cy="4.5" r="1.2" />
            </svg>
            <div className="w-5 h-[1px] bg-[#C49A6C]"></div>
          </div>

          {/* Main ZARIA Wordmark */}
          <div
            className="font-serif text-[#C49A6C] text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] font-normal"
            dir="ltr"
          >
            ZARIA
          </div>

          {/* Subtitle */}
          <div className="text-[#C49A6C] text-[7px] md:text-[9px] font-medium tracking-[0.4em] uppercase mt-1">
            &lrm;E-INVITATIONS&lrm;
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#F5EFEA]/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Close Drawer Button */}
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
                    pathname === link.href
                      ? 'text-[#C49A6C]'
                      : 'text-[#444444] hover:text-[#C49A6C]'
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
