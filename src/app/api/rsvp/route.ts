/**
 * @file src/app/api/rsvp/route.ts
 * @description Global API Route for reading (`GET /api/rsvp`) and saving
 * (`POST /api/rsvp`) guest attendance responses in the `rsvp_responses` table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRSVPResponse, getRSVPResponses } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/rsvp?slug=omar-ayat
 * Returns RSVP responses filtered by `slug` (when provided) along with attendance summary stats.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || undefined;
    const rsvps = await getRSVPResponses(slug);

    const attendingList = rsvps.filter((r) => r.attending);
    const totalGuestsAttending = attendingList.reduce(
      (sum, r) => sum + Math.max(1, Number(r.guests_count) || 1),
      0
    );

    return NextResponse.json({
      ok: true,
      rsvps,
      stats: {
        totalResponses: rsvps.length,
        attendingCount: attendingList.length,
        notAttendingCount: rsvps.length - attendingList.length,
        totalGuestsAttending,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        rsvps: [],
        error: (error as Error).message || 'تعذر جلب تأكيدات الحضور حالياً.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rsvp
 * Body: {
 *   slug: string,
 *   guest_name?: string,
 *   name?: string,
 *   attending?: boolean,
 *   status?: 'attending' | 'not_attending' | 'maybe',
 *   guests_count?: number,
 *   guests?: number,
 *   message?: string
 * }
 * Inserts a new RSVP response into `rsvp_responses`.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || '').trim();
    const guestName = String(body?.guest_name || body?.name || '').trim();

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: 'معرف المناسبة (slug) مطلوب.' },
        { status: 400 }
      );
    }

    if (!guestName) {
      return NextResponse.json(
        { ok: false, error: 'يرجى إدخال الاسم الكريم.' },
        { status: 400 }
      );
    }

    const attending =
      body?.attending !== undefined
        ? Boolean(body.attending)
        : body?.status === 'not_attending'
        ? false
        : true;

    const rawGuests = body?.guests_count ?? body?.guests ?? 1;
    const guestsCount = attending ? Math.min(20, Math.max(1, Number(rawGuests) || 1)) : 0;

    const rsvp = await createRSVPResponse({
      slug,
      guest_name: guestName,
      attending,
      guests_count: guestsCount,
      message: body?.message ? String(body.message) : undefined,
    });

    return NextResponse.json({ ok: true, rsvp }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message || 'تعذر حفظ تأكيد الحضور حالياً.',
      },
      { status: 400 }
    );
  }
}
