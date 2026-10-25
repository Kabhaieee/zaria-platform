/**
 * @file src/app/api/invitations/route.ts
 * @description API route handler for listing all custom client invitations (`GET`)
 * and creating/updating a client invitation (`POST`).
 */

import { NextRequest, NextResponse } from 'next/server';
import { lockedWriteResponse } from '@/lib/adminApiGuard';
import {
  getAllClientInvitations,
  getAllRSVPs,
  upsertClientInvitation,
} from '@/lib/invitationStore';
import type { TemplateSlug } from '@/types/zaria';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invitations
 * Returns all custom client invitations and their RSVP records for the Admin Dashboard.
 */
export async function GET() {
  const locked = lockedWriteResponse();
  if (locked) return locked;
  try {
    const [invitations, rsvps] = await Promise.all([
      getAllClientInvitations(),
      getAllRSVPs(),
    ]);
    return NextResponse.json({ invitations, rsvps });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'حدث خطأ أثناء جلب الدعوات.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invitations
 * Creates or updates a client invitation record.
 */
export async function POST(req: NextRequest) {
  const locked = lockedWriteResponse();
  if (locked) return locked;
  try {
    const body = await req.json();
    if (!body?.slug || !body?.templateId) {
      return NextResponse.json(
        { error: 'حقل الرابط المخصص (slug) ونوع القالب (templateId) مطلوبان.' },
        { status: 400 }
      );
    }

    const saved = await upsertClientInvitation({
      slug: String(body.slug),
      templateId: body.templateId as TemplateSlug,
      hostNames: body.hostNames,
      coupleNames: body.coupleNames,
      welcomeMessage: body.welcomeMessage,
      invitationText: body.invitationText,
      eventDate: body.eventDate,
      eventTime: body.eventTime,
      venueName: body.venueName,
      locationUrl: body.locationUrl,
      youtubeVideoId: body.youtubeVideoId,
      customNote: body.customNote,
    });

    return NextResponse.json({ invitation: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'تعذر حفظ الدعوة.' },
      { status: 400 }
    );
  }
}
