import { Amiri, Tajawal } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ScrollToTop from '@/components/ScrollToTop';
import ClientProviders from '@/components/ClientProviders';
import WelcomeConsent from '@/components/WelcomeConsent';
import Preloader from '@/components/Preloader';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-body',
});

export const metadata = {
  title: 'ZARIA - Luxury Digital Invitations',
  description: 'Every Celebration Deserves Its Own Story',
};

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
