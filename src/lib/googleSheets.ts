/**
 * @file src/lib/googleSheets.ts
 * @description Real-time Google Sheets Backup, Cloud Stream Persistence & Two-Way Sync Service.
 *
 * Provides multi-layered backup for every guestbook wish and RSVP:
 * 1. Zero-Config Cloud Event Stream (`CLOUD_STREAM_BASE`) so wishes persist across serverless cold starts automatically.
 * 2. Google Apps Script Web App Webhook (`GOOGLE_SHEETS_WEBHOOK_URL` or runtime-configured URL).
 * 3. Direct Google Sheets API v4 Service Account (`GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`).
 * 4. Live CSV / `=IMPORTDATA(...)` feed at `/api/guestbook/export?slug=omar-ayat` for direct Google Sheets linking.
 */

import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { GuestbookWishRow, RSVPResponseRow } from '@/types/zaria';

const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL = '';
const SHEETS_CONFIG_FILE = path.join(os.tmpdir(), 'zaria-sheets-config.json');
const CLOUD_STREAM_TOPIC_PREFIX = 'zaria_gb_v2_9f8a7b6c_';

const globalForSheets = globalThis as unknown as {
  __zariaSheetsWebhookUrl?: string;
};

function getCloudStreamTopic(slug: string): string {
  const safe = String(slug || 'omar-ayat')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  return `${CLOUD_STREAM_TOPIC_PREFIX}${safe}`;
}

/**
 * Saves a Google Apps Script Webhook URL at runtime (from `/guestbook/sheet` UI).
 */
export function setRuntimeGoogleSheetsWebhookUrl(url: string): void {
  const clean = String(url || '').trim();
  globalForSheets.__zariaSheetsWebhookUrl = clean;
  try {
    fs.writeFileSync(SHEETS_CONFIG_FILE, JSON.stringify({ webhookUrl: clean }), 'utf-8');
  } catch {
    // Ignore /tmp write errors
  }
}

/**
 * Resolves the configured Google Apps Script Webhook URL.
 */
export function getGoogleSheetsWebhookUrl(): string | null {
  let runtimeUrl = globalForSheets.__zariaSheetsWebhookUrl || '';
  if (!runtimeUrl) {
    try {
      if (fs.existsSync(SHEETS_CONFIG_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(SHEETS_CONFIG_FILE, 'utf-8')) as {
          webhookUrl?: string;
        };
        if (parsed?.webhookUrl) {
          runtimeUrl = parsed.webhookUrl;
          globalForSheets.__zariaSheetsWebhookUrl = runtimeUrl;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  const url = (
    runtimeUrl ||
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
 * Appends a guestbook wish row to the Zero-Config Cloud Stream, Google Apps Script Webhook,
 * and/or Google Sheets API v4.
 */
export async function appendWishToGoogleSheet(wish: GuestbookWishRow): Promise<boolean> {
  let synced = false;

  // 0. Zero-Config Cloud Stream Backup (persists across serverless cold starts automatically)
  try {
    const topic = getCloudStreamTopic(wish.slug);
    const streamRes = await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ op: 'add', wish }),
      cache: 'no-store',
    });
    if (streamRes.ok) synced = true;
  } catch {
    // Ignore cloud stream errors
  }

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
 * Records a delete event in the Zero-Config Cloud Stream so deleted test wishes do not reappear.
 */
export async function recordDeleteInCloudBackup(options: {
  slug?: string;
  id?: string;
}): Promise<void> {
  try {
    const topic = getCloudStreamTopic(options.slug || 'omar-ayat');
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        op: options.id ? 'delete_id' : 'clear_slug',
        id: options.id,
        slug: options.slug || 'omar-ayat',
      }),
      cache: 'no-store',
    });
  } catch {
    // Ignore errors
  }
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
 * Reads saved guestbook wishes from the Cloud Stream Backup, Google Apps Script Webhook,
 * or Google Sheets API v4 so zero wishes are ever lost across serverless cold starts.
 */
export async function fetchWishesFromGoogleSheet(
  slug?: string
): Promise<GuestbookWishRow[] | null> {
  const recoveredMap = new Map<string, GuestbookWishRow>();

  // 0. Recover from Zero-Config Cloud Stream Backup
  try {
    const topic = getCloudStreamTopic(slug || 'omar-ayat');
    const streamRes = await fetch(`https://ntfy.sh/${topic}/json?poll=1&since=all`, {
      cache: 'no-store',
    });
    if (streamRes.ok) {
      const text = await streamRes.text();
      const lines = text.split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const envelope = JSON.parse(line) as { event?: string; message?: string };
          if (envelope.event !== 'message' || !envelope.message) continue;
          const payload = JSON.parse(envelope.message) as {
            op?: string;
            wish?: GuestbookWishRow;
            id?: string;
          };
          if (payload.op === 'add' && payload.wish?.id) {
            recoveredMap.set(payload.wish.id, payload.wish);
          } else if (payload.op === 'delete_id' && payload.id) {
            recoveredMap.delete(payload.id);
          } else if (payload.op === 'clear_slug') {
            recoveredMap.clear();
          }
        } catch {
          // Ignore malformed line
        }
      }
    }
  } catch {
    // Fall through
  }

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
          for (const w of data.wishes) {
            if (w?.id && w?.guest_name && w?.message) {
              recoveredMap.set(w.id, w);
            }
          }
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
            for (let i = 0; i < data.values.length; i++) {
              const row = data.values[i];
              const rowSlug = String(row[1] || '').trim();
              const guestName = String(row[2] || '').trim();
              const message = String(row[3] || '').trim();
              const id = String(row[4] || `sheet-${i}`).trim();
              const createdAt = String(row[5] || row[0] || new Date().toISOString()).trim();

              if (!guestName || !message) continue;
              if (slug && rowSlug !== slug) continue;

              recoveredMap.set(id, {
                id,
                slug: rowSlug || slug || 'omar-ayat',
                guest_name: guestName,
                message,
                created_at: createdAt,
              });
            }
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  return Array.from(recoveredMap.values());
}
