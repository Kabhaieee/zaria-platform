/**
 * @file src/app/api/guestbook/export/route.ts
 * @description Exports all guestbook wishes (`guestbook_wishes`) as a UTF-8 BOM CSV file
 * ready to open directly in Google Sheets or Microsoft Excel with 100% Arabic support.
 * URL: GET /api/guestbook/export?slug=omar-ayat
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGuestbookWishes } from '@/lib/db';

export const dynamic = 'force-dynamic';

function escapeCsvCell(value: string): string {
  const cleaned = String(value ?? '').replace(/\r?\n/g, ' ');
  if (cleaned.includes(',') || cleaned.includes('"') || cleaned.includes(';')) {
    return `"${cleaned.replace(/"/g, '""')}"`;
  }
  return cleaned;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || 'omar-ayat';
    const wishes = await getGuestbookWishes(slug);

    const header = ['التاريخ والوقت', 'المناسبة (Slug)', 'الاسم الكريم', 'التهنئة / الكلمة', 'المعرف (ID)'];
    const rows = wishes.map((w) => [
      escapeCsvCell(w.created_at),
      escapeCsvCell(w.slug),
      escapeCsvCell(w.guest_name),
      escapeCsvCell(w.message),
      escapeCsvCell(w.id),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Excel and Google Sheets render Arabic characters properly
    const csvContent =
      '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="zaria-guestbook-${slug}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message || 'تعذر تصدير التهاني.' },
      { status: 500 }
    );
  }
}
