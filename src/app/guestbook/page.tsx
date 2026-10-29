/**
 * @file src/app/guestbook/page.tsx
 * @description Direct standalone Guestbook route (`/guestbook`).
 * Ensures visiting `https://zaria-zov.com/guestbook` directly loads the
 * luxury Wedding Entrance Guestbook page (defaulting to `omar-ayat` or `?slug=...`)
 * instead of falling through to the top-level `/[slug]` route.
 */

import type { Metadata } from 'next';
import GuestbookClient from './[slug]/GuestbookClient';
import { getStaticInvitationBySlug } from '@/data/clientInvitations';
import { getGuestbookWishes } from '@/lib/db';
import { getClientInvitationBySlug, sanitizeSlug } from '@/lib/invitationStore';

export const dynamic = 'force-dynamic';

interface RootGuestbookPageProps {
  searchParams?: Promise<{ slug?: string }>;
}

async function resolveEventMeta(rawSlug?: string) {
  const cleanSlug = sanitizeSlug(rawSlug || 'omar-ayat') || 'omar-ayat';
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

export const metadata: Metadata = {
  title: 'دفتر الذكريات والتهاني — المهندس عمر و الدكتورة آيات | ZARIA',
  description:
    'شاركوا المهندس عمر و الدكتورة آيات فرحة العمر واكتبوا تهنئتكم في سجل الذكريات الخاص بالحفل.',
  openGraph: {
    title: 'دفتر الذكريات والتهاني — المهندس عمر و الدكتورة آيات | ZARIA',
    description:
      'شاركوا المهندس عمر و الدكتورة آيات فرحة العمر واكتبوا تهنئتكم في سجل الذكريات الخاص بالحفل.',
    type: 'website',
  },
};

export default async function RootGuestbookPage({ searchParams }: RootGuestbookPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { cleanSlug, coupleTitle, familySignature } = await resolveEventMeta(
    resolvedSearchParams?.slug
  );
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
