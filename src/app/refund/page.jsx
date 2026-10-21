/**
 * @file src/app/refund/page.jsx
 * @description Server route page for the ZARIA Refund & Cancellation Policy ("سياسة الاسترجاع والإلغاء").
 * Delegates layout and bilingual legal text rendering to `LegalPageLayout`.
 */

import LegalPageLayout from '@/components/LegalPageLayout';

/**
 * Page-level SEO metadata for the Refund & Cancellation Policy page.
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'سياسة الاسترجاع والإلغاء | ZARIA',
  description: 'سياسة الاسترجاع والإلغاء لمنصة ZARIA للدعوات الإلكترونية في الأردن.',
};

/**
 * RefundPage Server Component
 *
 * @returns {JSX.Element} The rendered Refund Policy page.
 */
export default function RefundPage() {
  return <LegalPageLayout contentKey="refund" />;
}
