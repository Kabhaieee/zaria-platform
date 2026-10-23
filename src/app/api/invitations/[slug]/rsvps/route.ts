/**
 * @file src/app/api/invitations/[slug]/rsvps/route.ts
 * @description API route handler for fetching (`GET`) and submitting (`POST`)
 * guest RSVPs ("تأكيد الحضور") and wishes ("كلمات المهنئين") isolated to a specific client `slug`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { addRSVPForSlug, getRSVPsBySlug } from '@/lib/invitationStore';
import type { RSVPAttendanceStatus } from '@/types/zaria';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invitations/[slug]/rsvps
 * Returns all RSVPs and wishes submitted for the specified invitation `slug`.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const rsvps = await getRSVPsBySlug(slug);
    return NextResponse.json({ rsvps });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'تعذر جلب الردود.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invitations/[slug]/rsvps
 * Records a new guest RSVP and optional congratulatory wish under `slug`.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    const rsvp = await addRSVPForSlug(slug, {
      name: body?.name,
      status: body?.status as RSVPAttendanceStatus,
      guests: body?.guests,
      message: body?.message,
      image: body?.image || null,
    });

    return NextResponse.json({ rsvp }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'تعذر حفظ تأكيد الحضور.' },
      { status: 400 }
    );
  }
}
