import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'سياسة الخصوصية | ZARIA',
  description: 'سياسة الخصوصية لمنصة ZARIA لحماية بياناتك وصورك بسرية تامة.',
};

export default function PrivacyPage() {
  return <LegalPageLayout contentKey="privacy" />;
}
