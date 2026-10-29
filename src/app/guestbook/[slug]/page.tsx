/**
 * @file src/app/guestbook/[slug]/page.tsx
 * @description Standalone Wedding Day Entrance QR Guestbook route (`/guestbook/[slug]`).
 * Completely separate from the main invitation UI so guests scanning the QR code
 * at the hall entrance load a fast, dedicated luxury form to leave their wishes.
 */

import type { Metadata } from 'next';
import GuestbookClient from './GuestbookClient';
import { getStaticInvitationBySlug } from '@/data/clientInvitations';
import { getGuestbookWishes } from '@/lib/db';
import { getClientInvitationBySlug, sanitizeSlug } from '@/lib/invitationStore';

export const dynamic = 'force-dynamic';

interface GuestbookPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Resolves the display title for the couple or event hosts given a `slug`.
 */
async function resolveGuestbookEventMeta(rawSlug: string) {
  const cleanSlug = sanitizeSlug(rawSlug) || rawSlug;
  const invitation =
    getStaticInvitationBySlug(cleanSlug) ?? (await getClientInvitationBySlug(cleanSlug));

  if (cleanSlug === 'omar-ayat') {
    return {
      cleanSlug,
      coupleTitle: 'المهندس عمر و الدكتورة آيات',
      familySignature: invitation?.familyNames || 'عائلة السخن و عائلة قبها',
    };
  }

  const rawHosts = invitation?.coupleNames || invitation?.hostNames || cleanSlug;
  const coupleTitle = rawHosts.replace(/\s*&\s*/g, ' و ');

  return {
    cleanSlug,
    coupleTitle,
    familySignature: invitation?.familyNames?.replace(/\s*&\s*/g, ' و '),
  };
}

export async function generateMetadata({ params }: GuestbookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { coupleTitle } = await resolveGuestbookEventMeta(slug);

  const title = `دفتر الذكريات والتهاني — ${coupleTitle} | ZARIA`;
  const description = `شاركوا ${coupleTitle} فرحة العمر واكتبوا تهنئتكم في سجل الذكريات الخاص بالحفل.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function StandaloneGuestbookPage({ params }: GuestbookPageProps) {
  const { slug } = await params;
  const { cleanSlug, coupleTitle, familySignature } = await resolveGuestbookEventMeta(slug);
  const initialWishes = await getGuestbookWishes(cleanSlug);

  return (
    <GuestbookClient
      slug={cleanSlug}
      coupleTitle={coupleTitle}
      familySignature={familySignature}
      initialWishes={initialWishes}
    />
  );
}
