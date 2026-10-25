/**
 * @file src/app/api/invitations/[slug]/route.ts
 * @description API route handler for fetching (`GET`), updating (`PUT`), and deleting (`DELETE`)
 * an individual custom client invitation by its unique `slug`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { lockedWriteResponse } from '@/lib/adminApiGuard';
import {
  deleteClientInvitation,
  getClientInvitationBySlug,
  getRSVPsBySlug,
  upsertClientInvitation,
} from '@/lib/invitationStore';
import type { TemplateSlug } from '@/types/zaria';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invitations/[slug]
 * Fetches a client invitation record and its isolated RSVPs/wishes.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const invitation = await getClientInvitationBySlug(slug);
    if (!invitation) {
      return NextResponse.json({ error: 'الدعوة غير موجودة.' }, { status: 404 });
    }
    const rsvps = await getRSVPsBySlug(slug);
    return NextResponse.json({ invitation, rsvps });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'خطأ في جلب بيانات الدعوة.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/invitations/[slug]
 * Updates an existing client invitation without modifying the master preview template.
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const locked = lockedWriteResponse();
  if (locked) return locked;
  try {
    const { slug } = await context.params;
    const body = await req.json();

    const updated = await upsertClientInvitation({
      slug: body?.slug || slug,
      templateId: (body?.templateId || 'wedding-royal') as TemplateSlug,
      hostNames: body?.hostNames,
      coupleNames: body?.coupleNames,
      welcomeMessage: body?.welcomeMessage,
      invitationText: body?.invitationText,
      eventDate: body?.eventDate,
      eventTime: body?.eventTime,
      venueName: body?.venueName,
      locationUrl: body?.locationUrl,
      youtubeVideoId: body?.youtubeVideoId,
      customNote: body?.customNote,
    });

    return NextResponse.json({ invitation: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'تعذر تحديث الدعوة.' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/invitations/[slug]
 * Deletes a client invitation and its associated RSVPs.
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const locked = lockedWriteResponse();
  if (locked) return locked;
  try {
    const { slug } = await context.params;
    const deleted = await deleteClientInvitation(slug);
    return NextResponse.json({ deleted });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'تعذر حذف الدعوة.' },
      { status: 400 }
    );
  }
}
