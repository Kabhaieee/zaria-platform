/**
 * @file src/app/invite/[slug]/page.tsx
 * @description Dynamic Client Invitation route (`/invite/[slug]`).
 * Fetches the client's customized invitation record by `slug`, generates custom
 * OpenGraph/WhatsApp metadata (e.g. "دعوة زفاف أحمد و سارة"), and renders the chosen
 * master template populated with the client's `customData` and isolated RSVPs/Wishes.
 */

// 1. React and Next.js core modules
import type { Metadata } from 'next';

// 3. Internal components, hooks, and utility functions
import InviteClientView from './InviteClientView';
import { getClientInvitationBySlug } from '@/lib/invitationStore';
import { getMasterTemplate } from '@/lib/masterTemplates';

export const dynamic = 'force-dynamic';

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Resolves an occasion prefix in Arabic based on the selected template ID for WhatsApp sharing.
 */
function getOccasionTitlePrefix(templateId?: string): string {
  switch (templateId) {
    case 'wedding-classic':
    case 'wedding-royal':
      return 'دعوة زفاف';
    case 'engagement-floral':
      return 'دعوة خطوبة';
    case 'graduation-modern':
    case 'graduation-notebook':
      return 'دعوة حفل تخرج';
    case 'birthday-fun':
      return 'دعوة عيد ميلاد';
    case 'newborn-cute':
      return 'دعوة استقبال المولود';
    default:
      return 'بطاقة دعوة خاصة —';
  }
}

/**
 * Generates dynamic OpenGraph / WhatsApp share metadata for each client's invitation slug.
 */
export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getClientInvitationBySlug(slug);

  if (!invitation) {
    return {
      title: `بطاقة دعوة خاصة | ZARIA`,
      description: 'نتشرف بدعوتكم لمشاركتنا فرحتنا عبر منصة زاريا للدعوات الرقمية الفاخرة.',
    };
  }

  const hosts = invitation.coupleNames || invitation.hostNames || slug;
  const prefix = getOccasionTitlePrefix(invitation.templateId);
  const fullTitle = `${prefix} ${hosts}`;
  const master = getMasterTemplate(invitation.templateId);
  const description =
    invitation.welcomeMessage ||
    invitation.invitationText ||
    `${master?.defaultWelcomeMessage || 'نتشرف بحضوركم'} — ${invitation.venueName || ''}`;

  return {
    title: `${fullTitle} | ZARIA`,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

/**
 * Server Component entry point for `/invite/[slug]`.
 */
export default async function ClientInvitationPage({ params }: InvitePageProps) {
  const { slug } = await params;
  const invitation = await getClientInvitationBySlug(slug);

  return <InviteClientView slug={slug} initialInvitation={invitation} />;
}
