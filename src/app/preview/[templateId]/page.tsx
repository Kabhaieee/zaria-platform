/**
 * @file src/app/preview/[templateId]/page.tsx
 * @description Standalone Master Template Preview route (`/preview/[templateId]`).
 * Renders any of the 7 original ZARIA master templates in full-screen using its
 * read-only default showcase data (without the main landing page navbar/switcher),
 * and includes a floating one-click button to copy the preview URL for prospective customers.
 */

// 1. React and Next.js core modules
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 3. Internal components, hooks, and utility functions
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { getMasterTemplate, VALID_TEMPLATE_IDS } from '@/lib/masterTemplates';

// 4. TypeScript types
import type { TemplateSlug } from '@/types/zaria';

interface PreviewPageProps {
  params: Promise<{ templateId: string }>;
}

/**
 * Generates dynamic OpenGraph / WhatsApp metadata for the standalone template preview.
 */
export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { templateId } = await params;
  const master = getMasterTemplate(templateId);

  if (!master) {
    return {
      title: 'ZARIA — معاينة القالب',
    };
  }

  return {
    title: `معاينة قالب ${master.nameAr} (${master.defaultHostNames}) | ZARIA`,
    description: `${master.defaultWelcomeMessage} — معاينة حية لقالب "${master.nameAr}" من منصة زاريا للدعوات الرقمية الفاخرة.`,
    openGraph: {
      title: `معاينة قالب ${master.nameAr} | ZARIA`,
      description: `${master.categoryAr} — ${master.defaultHostNames}`,
      type: 'website',
    },
  };
}

/**
 * Renders the immutable master template in full-screen mode with a floating Copy Preview Link button.
 */
export default async function MasterTemplatePreviewPage({ params }: PreviewPageProps) {
  const { templateId } = await params;

  if (!VALID_TEMPLATE_IDS.includes(templateId as TemplateSlug)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black w-full" dir="rtl">
      <TemplateRenderer
        templateId={templateId as TemplateSlug}
        showCopyPreviewButton={true}
      />
    </div>
  );
}
