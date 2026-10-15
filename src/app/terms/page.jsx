import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'الشروط والأحكام | ZARIA',
  description: 'الشروط والأحكام لاستخدام خدمات منصة ZARIA للدعوات الإلكترونية.',
};

export default function TermsPage() {
  return <LegalPageLayout contentKey="terms" />;
}
