/**
 * @file src/lib/googleSheets.ts
 * @description Real-time Google Sheets Backup & Two-Way Sync Service for Zaria Platform.
 *
 * Supports two zero-dependency integration modes:
 * 1. Google Apps Script Web App Webhook (`GOOGLE_SHEETS_WEBHOOK_URL` or `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`)
 *    - Appends every new wish (`guestbook_wishes`) and RSVP (`rsvp_responses`) immediately as a new row.
 *    - Reads rows back (`?action=get_wishes&slug=...`) as a resilient cloud backup if primary storage is empty.
 * 2. Direct Google Sheets API v4 Service Account (`GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`)
 *    - Signs an OAuth2 JWT using native Node.js `crypto` and appends/reads rows directly via `sheets.googleapis.com`.
 */

import crypto from 'crypto';
import type { GuestbookWishRow, RSVPResponseRow } from '@/types/zaria';

/**
 * Optional permanent webhook URL fallback (can be populated directly if provided by the project owner).
 */
const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL = '';

/**
 * Resolves the configured Google Apps Script Webhook URL.
 */
export function getGoogleSheetsWebhookUrl(): string | null {
  const url = (
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
    DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL ||
    ''
  ).trim();

  if (url && url.startsWith('https://script.google.com/')) {
    return url;
  }
  return null;
}

interface ServiceAccountConfig {
  sheetId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Resolves Google Cloud Service Account credentials for direct Google Sheets API v4 access.
 */
function getServiceAccountConfig(): ServiceAccountConfig | null {
  const sheetId = (process.env.GOOGLE_SHEET_ID || '').trim();
  const clientEmail = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '').trim();
  const rawPrivateKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  if (!sheetId || !clientEmail || !rawPrivateKey) {
    return null;
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
  return { sheetId, clientEmail, privateKey };
}

/**
 * Generates an OAuth2 access token for Google Sheets API v4 using native Node.js `crypto`.
 */
async function getGoogleAccessToken(config: ServiceAccountConfig): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: config.clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const base64UrlEncode = (obj: unknown) =>
      Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(claimSet)}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedToken);
    signer.end();

    const signature = signer
      .sign(config.privateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const assertion = `${unsignedToken}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }).toString(),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token || null;
  } catch {
    return null;
  }
}

/**
 * Formats an ISO timestamp into a readable Amman/Jordan date-time string for the spreadsheet.
 */
function formatReadableTimestamp(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('ar-JO', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Amman',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

/**
 * Appends a guestbook wish row to Google Sheets (via Webhook and/or Google Sheets API v4).
 * Never throws so the guest's submission always succeeds even if network is slow.
 */
export async function appendWishToGoogleSheet(wish: GuestbookWishRow): Promise<boolean> {
  let synced = false;

  // 1. Google Apps Script Webhook Mode
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'append_wish',
          id: wish.id,
          slug: wish.slug,
          guest_name: wish.guest_name,
          message: wish.message,
          created_at: wish.created_at,
          readable_time: formatReadableTimestamp(wish.created_at),
        }),
        cache: 'no-store',
      });
      if (res.ok) synced = true;
    } catch {
      // Ignore webhook errors
    }
  }

  // 2. Direct Google Sheets API v4 Mode
  const saConfig = getServiceAccountConfig();
  if (saConfig) {
    try {
      const token = await getGoogleAccessToken(saConfig);
      if (token) {
        const range = encodeURIComponent('A:F');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
          saConfig.sheetId
        )}/values/${range}:append?valueInputOption=USER_ENTERED`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [
              [
                formatReadableTimestamp(wish.created_at),
                wish.slug,
                wish.guest_name,
                wish.message,
                wish.id,
                wish.created_at,
              ],
            ],
          }),
          cache: 'no-store',
        });
        if (res.ok) synced = true;
      }
    } catch {
      // Ignore API errors
    }
  }

  return synced;
}

/**
 * Appends an RSVP response row to Google Sheets (via Webhook and/or Google Sheets API v4).
 */
export async function appendRSVPToGoogleSheet(rsvp: RSVPResponseRow): Promise<boolean> {
  let synced = false;

  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'append_rsvp',
          id: rsvp.id,
          slug: rsvp.slug,
          guest_name: rsvp.guest_name,
          attending: rsvp.attending,
          guests_count: rsvp.guests_count,
          created_at: rsvp.created_at,
          readable_time: formatReadableTimestamp(rsvp.created_at),
        }),
        cache: 'no-store',
      });
      if (res.ok) synced = true;
    } catch {
      // Ignore webhook errors
    }
  }

  return synced;
}

/**
 * Reads saved guestbook wishes from Google Sheets so the sheet serves as a permanent
 * backup recovery source if the server restarts or primary DB is unavailable.
 */
export async function fetchWishesFromGoogleSheet(
  slug?: string
): Promise<GuestbookWishRow[] | null> {
  // 1. Try Google Apps Script Webhook GET
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (webhookUrl) {
    try {
      const url = new URL(webhookUrl);
      url.searchParams.set('action', 'get_wishes');
      if (slug) url.searchParams.set('slug', slug);

      const res = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = (await res.json()) as { wishes?: GuestbookWishRow[] };
        if (Array.isArray(data?.wishes)) {
          return data.wishes;
        }
      }
    } catch {
      // Fall through
    }
  }

  // 2. Try Direct Google Sheets API v4 GET
  const saConfig = getServiceAccountConfig();
  if (saConfig) {
    try {
      const token = await getGoogleAccessToken(saConfig);
      if (token) {
        const range = encodeURIComponent('A2:F500');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
          saConfig.sheetId
        )}/values/${range}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (res.ok) {
          const data = (await res.json()) as { values?: string[][] };
          if (Array.isArray(data?.values)) {
            const rows: GuestbookWishRow[] = [];
            for (const row of data.values) {
              const rowSlug = String(row[1] || '').trim();
              const guestName = String(row[2] || '').trim();
              const message = String(row[3] || '').trim();
              const id = String(row[4] || `sheet-${ rows.length }`).trim();
              const createdAt = String(row[5] || row[0] || new Date().toISOString()).trim();

              if (!guestName || !message) continue;
              if (slug && rowSlug !== slug) continue;

              rows.push({
                id,
                slug: rowSlug || slug || 'omar-ayat',
                guest_name: guestName,
                message,
                created_at: createdAt,
              });
            }
            return rows.reverse();
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  return null;
}
