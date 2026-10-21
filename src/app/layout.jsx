/**
 * @file layout.jsx
 * @description Root Next.js App Router layout for the ZARIA platform.
 * Configures Arabic Google Fonts (`Amiri` for serif headings and `Tajawal` for body copy),
 * global metadata, localization context, smooth scrolling, preloader, and cookie consent banner.
 */

// 1. React and Next.js core modules
import { Amiri, Tajawal } from 'next/font/google';

// 3. Internal components, hooks, and utility functions
import ClientProviders from '@/components/ClientProviders';
import Preloader from '@/components/Preloader';
import ScrollToTop from '@/components/ScrollToTop';
import WelcomeConsent from '@/components/WelcomeConsent';
import { LanguageProvider } from '@/contexts/LanguageContext';

// 4. Style imports
import './globals.css';

// Configure Amiri serif font for luxury Arabic headings
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

// Configure Tajawal sans-serif font for body copy and UI controls
const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-body',
});

/**
 * Default SEO metadata for the ZARIA platform.
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'ZARIA - Luxury Digital Invitations',
  description: 'Every Celebration Deserves Its Own Story',
};

/**
 * Root application layout component wrapping all routes.
 *
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Active route page content.
 * @returns {JSX.Element} The root HTML and body structure.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${amiri.variable} ${tajawal.variable} font-sans`}>
        <LanguageProvider>
          <ClientProviders>
            <Preloader />
            <ScrollToTop />
            {children}
            <WelcomeConsent />
          </ClientProviders>
        </LanguageProvider>
      </body>
    </html>
  );
}
