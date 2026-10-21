/**
 * @file src/app/privacy/page.jsx
 * @description Server route page for the ZARIA Privacy Policy ("سياسة الخصوصية").
 * Delegates layout and bilingual legal text rendering to `LegalPageLayout`.
 */

import LegalPageLayout from '@/components/LegalPageLayout';

/**
 * Page-level SEO metadata for the Privacy Policy page.
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'سياسة الخصوصية | ZARIA',
  description: 'سياسة الخصوصية لمنصة ZARIA لحماية بياناتك وصورك بسرية تامة.',
};

/**
 * PrivacyPage Server Component
 *
 * @returns {JSX.Element} The rendered Privacy Policy page.
 */
export default function PrivacyPage() {
  return <LegalPageLayout contentKey="privacy" />;
}
