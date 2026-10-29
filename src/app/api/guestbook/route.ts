/**
 * @file src/app/api/guestbook/route.ts
 * @description Global API Route for reading (`GET /api/guestbook`) and saving
 * (`POST /api/guestbook`) congratulatory wishes in the `guestbook_wishes` table.
 * Supports both the standalone Wedding Day Entrance QR page (`/guestbook/[slug]`)
 * and inline invitation wish sections across the Zaria Platform.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGuestbookWish, getGuestbookWishes } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/guestbook?slug=omar-ayat
 * Returns guestbook wishes ordered by `created_at` descending, filtered by `slug` when provided.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || undefined;
    const wishes = await getGuestbookWishes(slug);

    return NextResponse.json({
      ok: true,
      wishes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        wishes: [],
        error: (error as Error).message || 'تعذر جلب التهاني حالياً.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/guestbook
 * Body: { slug: string, guest_name?: string, name?: string, message: string }
 * Inserts a new wish into `guestbook_wishes`.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || '').trim();
    const guestName = String(body?.guest_name || body?.name || '').trim();
    const message = String(body?.message || '').trim();

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

    if (!message) {
      return NextResponse.json(
        { ok: false, error: 'يرجى كتابة كلمتكم أو تهنئتكم للعروسين.' },
        { status: 400 }
      );
    }

    const wish = await createGuestbookWish({
      slug,
      guest_name: guestName,
      message,
    });

    return NextResponse.json({ ok: true, wish }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message || 'تعذر حفظ الكلمة حالياً، يرجى المحاولة مرة أخرى.',
      },
      { status: 400 }
    );
  }
}
