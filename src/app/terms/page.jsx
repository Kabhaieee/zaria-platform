/**
 * @file src/app/terms/page.jsx
 * @description Server route page for the ZARIA Terms & Conditions ("الشروط والأحكام").
 * Delegates layout and bilingual legal text rendering to `LegalPageLayout`.
 */

import LegalPageLayout from '@/components/LegalPageLayout';

/**
 * Page-level SEO metadata for the Terms & Conditions page.
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'الشروط والأحكام | ZARIA',
  description: 'الشروط والأحكام لاستخدام خدمات منصة ZARIA للدعوات الإلكترونية.',
};

/**
 * TermsPage Server Component
 *
 * @returns {JSX.Element} The rendered Terms & Conditions page.
 */
export default function TermsPage() {
  return <LegalPageLayout contentKey="terms" />;
}
