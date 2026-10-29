/**
 * @file src/app/api/guestbook/sheets-config/route.ts
 * @description API endpoint for configuring and testing the Google Sheets Webhook URL
 * directly from `/guestbook/sheet`, and syncing existing wishes to Google Sheets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGuestbookWishes } from '@/lib/db';
import {
  appendWishToGoogleSheet,
  getGoogleSheetsWebhookUrl,
  setRuntimeGoogleSheetsWebhookUrl,
} from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  const webhookUrl = getGoogleSheetsWebhookUrl() || '';
  return NextResponse.json({
    ok: true,
    connected: Boolean(webhookUrl),
    webhookUrl,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookUrl = String(body?.webhookUrl || '').trim();
    const slug = String(body?.slug || 'omar-ayat').trim();

    if (webhookUrl && !webhookUrl.startsWith('https://script.google.com/')) {
      return NextResponse.json(
        {
          ok: false,
          error: 'يرجى إدخال رابط Google Apps Script صالح يبدأ بـ https://script.google.com/',
        },
        { status: 400 }
      );
    }

    setRuntimeGoogleSheetsWebhookUrl(webhookUrl);

    // Sync existing wishes to the newly connected Google Sheet
    let syncedCount = 0;
    if (webhookUrl) {
      const wishes = await getGuestbookWishes(slug);
      for (const wish of [...wishes].reverse()) {
        const ok = await appendWishToGoogleSheet(wish);
        if (ok) syncedCount++;
      }
    }

    return NextResponse.json({
      ok: true,
      connected: Boolean(webhookUrl),
      webhookUrl,
      syncedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message || 'تعذر حفظ الرابط.' },
      { status: 500 }
    );
  }
}
