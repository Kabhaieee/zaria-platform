/**
 * @file src/lib/db.ts
 * @description Global Cloud Database Service for the Zaria Platform.
 * Supports:
 * 1. Supabase (PostgreSQL REST API via `NEXT_PUBLIC_SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
 * 2. Vercel Postgres / Neon Serverless HTTP SQL (`POSTGRES_URL` / `DATABASE_URL`)
 * 3. Graceful Local & Serverless `/tmp` JSON persistence fallback when cloud credentials are not yet configured.
 *
 * Provides typed CRUD operations for:
 * - `guestbook_wishes` (id, slug, guest_name, message, created_at)
 * - `rsvp_responses` (id, slug, guest_name, attending, guests_count, created_at)
 */

import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  appendRSVPToGoogleSheet,
  appendWishToGoogleSheet,
  fetchWishesFromGoogleSheet,
  recordDeleteInCloudBackup,
} from '@/lib/googleSheets';
import { addRSVPForSlug, getRSVPsBySlug, sanitizeSlug } from '@/lib/invitationStore';
import type { GuestbookWishRow, RSVPResponseRow } from '@/types/zaria';

interface CloudDbFallbackSchema {
  guestbook_wishes: GuestbookWishRow[];
  rsvp_responses: RSVPResponseRow[];
}

const LOCAL_DB_FILE = path.join(process.cwd(), 'src', 'data', 'cloudDbRuntime.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'zaria-cloud-db-v2.json');

const globalForCloudDb = globalThis as unknown as {
  __zariaCloudDbV2?: CloudDbFallbackSchema;
  __zariaNeonTablesInitialized?: boolean;
  __zariaV1TestWishesPurged?: boolean;
};

/**
 * Generates a valid RFC 4122 v4 UUID tagged with the current schema generation (`4a2b`)
 * so pre-reset test entries are cleanly excluded.
 */
function generateUUID(): string {
  const base =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
  const parts = base.split('-');
  if (parts.length === 5) {
    parts[2] = '4a2b';
    return parts.join('-');
  }
  return base;
}

function isPostResetId(id?: string): boolean {
  return typeof id === 'string' && id.includes('-4a2b-');
}

/**
 * Reads the local/tmp fallback store.
 */
function readFallbackDb(): CloudDbFallbackSchema {
  if (globalForCloudDb.__zariaCloudDbV2) {
    return globalForCloudDb.__zariaCloudDbV2;
  }

  for (const filePath of [TMP_DB_FILE, LOCAL_DB_FILE]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw) as CloudDbFallbackSchema;
        if (
          Array.isArray(parsed?.guestbook_wishes) &&
          Array.isArray(parsed?.rsvp_responses)
        ) {
          parsed.guestbook_wishes = parsed.guestbook_wishes.filter((w) =>
            isPostResetId(w.id)
          );
          globalForCloudDb.__zariaCloudDbV2 = parsed;
          return parsed;
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  globalForCloudDb.__zariaCloudDbV2 = {
    guestbook_wishes: [],
    rsvp_responses: [],
  };
  return globalForCloudDb.__zariaCloudDbV2;
}

/**
 * Persists the fallback store to memory, `/tmp`, and local disk when writable.
 */
function writeFallbackDb(db: CloudDbFallbackSchema): void {
  globalForCloudDb.__zariaCloudDbV2 = db;
  const serialized = JSON.stringify(db, null, 2);
  try {
    fs.writeFileSync(TMP_DB_FILE, serialized, 'utf-8');
  } catch {
    // Ignore /tmp write errors
  }
  try {
    fs.writeFileSync(LOCAL_DB_FILE, serialized, 'utf-8');
  } catch {
    // Ignore read-only filesystem errors in production serverless
  }
}

/**
 * Resolves Supabase REST configuration from environment variables.
 */
function getSupabaseConfig(): { url: string; key: string } | null {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  if (url && key && url.startsWith('https://')) {
    return { url: url.replace(/\/$/, ''), key };
  }
  return null;
}

/**
 * Resolves Neon / Vercel Postgres HTTP SQL endpoint from `POSTGRES_URL` or `DATABASE_URL`.
 */
function getNeonHttpConfig(): { endpoint: string; connectionString: string } | null {
  const conn = (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ''
  ).trim();

  if (!conn || (!conn.startsWith('postgres://') && !conn.startsWith('postgresql://'))) {
    return null;
  }

  try {
    const parsed = new URL(conn);
    if (!parsed.hostname) return null;
    return {
      endpoint: `https://${parsed.hostname}/sql`,
      connectionString: conn,
    };
  } catch {
    return null;
  }
}

/**
 * Executes a parameterized SQL query over Neon / Vercel Postgres HTTPS endpoint.
 */
async function executeNeonSql<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<T[] | null> {
  const neon = getNeonHttpConfig();
  if (!neon) return null;

  try {
    if (!globalForCloudDb.__zariaNeonTablesInitialized) {
      await fetch(neon.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': neon.connectionString,
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS guestbook_wishes (
              id UUID PRIMARY KEY,
              slug VARCHAR(120) NOT NULL,
              guest_name TEXT NOT NULL,
              message TEXT NOT NULL,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_guestbook_wishes_slug_created_at ON guestbook_wishes (slug, created_at DESC);
            CREATE TABLE IF NOT EXISTS rsvp_responses (
              id UUID PRIMARY KEY,
              slug VARCHAR(120) NOT NULL,
              guest_name TEXT NOT NULL,
              attending BOOLEAN NOT NULL DEFAULT TRUE,
              guests_count INTEGER NOT NULL DEFAULT 1,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_rsvp_responses_slug_created_at ON rsvp_responses (slug, created_at DESC);
          `,
          params: [],
        }),
        cache: 'no-store',
      });
      globalForCloudDb.__zariaNeonTablesInitialized = true;
    }

    const res = await fetch(neon.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': neon.connectionString,
      },
      body: JSON.stringify({ query, params }),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { rows?: T[] };
    return Array.isArray(data?.rows) ? data.rows : null;
  } catch {
    return null;
  }
}

// =============================================================================
// 1. GUESTBOOK WISHES (`guestbook_wishes` Table)
// =============================================================================

/**
 * Fetches congratulatory wishes from `guestbook_wishes`, optionally filtered by `slug`.
 */
export async function getGuestbookWishes(slug?: string): Promise<GuestbookWishRow[]> {
  const cleanSlug = slug ? sanitizeSlug(slug) : '';

  // 1. Try Supabase `guestbook_wishes` table
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const filterQuery = cleanSlug
        ? `slug=eq.${encodeURIComponent(cleanSlug)}&select=*&order=created_at.desc`
        : `select=*&order=created_at.desc`;
      const res = await fetch(`${supabase.url}/rest/v1/guestbook_wishes?${filterQuery}`, {
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const rows = (await res.json()) as GuestbookWishRow[];
        const staleRows = rows.filter((r) => !isPostResetId(r.id));
        if (staleRows.length > 0) {
          for (const stale of staleRows) {
            fetch(
              `${supabase.url}/rest/v1/guestbook_wishes?id=eq.${encodeURIComponent(stale.id)}`,
              {
                method: 'DELETE',
                headers: {
                  apikey: supabase.key,
                  Authorization: `Bearer ${supabase.key}`,
                },
              }
            ).catch(() => {});
          }
        }
        return rows.filter((r) => isPostResetId(r.id));
      }
    } catch {
      // Fall through to next provider
    }
  }

  // 2. Try Neon / Vercel Postgres HTTP SQL
  if (getNeonHttpConfig()) {
    if (!globalForCloudDb.__zariaV1TestWishesPurged) {
      await executeNeonSql(
        "DELETE FROM guestbook_wishes WHERE CAST(id AS TEXT) NOT LIKE '%-4a2b-%'"
      );
      globalForCloudDb.__zariaV1TestWishesPurged = true;
    }
    const rows = cleanSlug
      ? await executeNeonSql<GuestbookWishRow>(
          'SELECT id, slug, guest_name, message, created_at FROM guestbook_wishes WHERE slug = $1 ORDER BY created_at DESC',
          [cleanSlug]
        )
      : await executeNeonSql<GuestbookWishRow>(
          'SELECT id, slug, guest_name, message, created_at FROM guestbook_wishes ORDER BY created_at DESC'
        );
    if (rows) return rows.filter((r) => isPostResetId(r.id));
  }

  // 3. Fallback: Local / `/tmp` store + Google Sheets backup recovery
  const db = readFallbackDb();
  const directWishes = cleanSlug
    ? db.guestbook_wishes.filter((w) => w.slug === cleanSlug && isPostResetId(w.id))
    : db.guestbook_wishes.filter((w) => isPostResetId(w.id));

  // 4. Merge any wishes stored in Google Sheets backup (in case of server restart or DB error)
  try {
    const sheetWishes = await fetchWishesFromGoogleSheet(cleanSlug || undefined);
    if (Array.isArray(sheetWishes) && sheetWishes.length > 0) {
      const seenIds = new Set(directWishes.map((w) => w.id));
      for (const sw of sheetWishes) {
        if (sw.guest_name && sw.message && !seenIds.has(sw.id)) {
          directWishes.push(sw);
          seenIds.add(sw.id);
        }
      }
    }
  } catch {
    // Ignore Google Sheets recovery errors
  }

  return directWishes.sort((a, b) =>
    (b.created_at || '').localeCompare(a.created_at || '')
  );
}

/**
 * Deletes wishes from `guestbook_wishes` by `id` or by `slug`.
 */
export async function deleteGuestbookWishes(options: {
  slug?: string;
  id?: string;
}): Promise<number> {
  const cleanSlug = options.slug ? sanitizeSlug(options.slug) : '';
  const targetId = (options.id || '').trim();

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const filter = targetId
        ? `id=eq.${encodeURIComponent(targetId)}`
        : cleanSlug
          ? `slug=eq.${encodeURIComponent(cleanSlug)}`
          : '';
      if (filter) {
        await fetch(`${supabase.url}/rest/v1/guestbook_wishes?${filter}`, {
          method: 'DELETE',
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
        });
      }
    } catch {
      // Ignore
    }
  }

  if (getNeonHttpConfig()) {
    if (targetId) {
      await executeNeonSql('DELETE FROM guestbook_wishes WHERE id = $1', [targetId]);
    } else if (cleanSlug) {
      await executeNeonSql('DELETE FROM guestbook_wishes WHERE slug = $1', [cleanSlug]);
    }
  }

  const db = readFallbackDb();
  const beforeCount = db.guestbook_wishes.length;
  if (targetId) {
    db.guestbook_wishes = db.guestbook_wishes.filter((w) => w.id !== targetId);
  } else if (cleanSlug) {
    db.guestbook_wishes = db.guestbook_wishes.filter((w) => w.slug !== cleanSlug);
  } else {
    db.guestbook_wishes = [];
  }
  writeFallbackDb(db);
  await recordDeleteInCloudBackup({ slug: cleanSlug, id: targetId });
  return Math.max(0, beforeCount - db.guestbook_wishes.length);
}

/**
 * Inserts a new wish into `guestbook_wishes` and synchronizes with the platform store.
 */
export async function createGuestbookWish(input: {
  slug: string;
  guest_name: string;
  message: string;
}): Promise<GuestbookWishRow> {
  const cleanSlug = sanitizeSlug(input.slug);
  if (!cleanSlug) {
    throw new Error('معرف المناسبة (slug) غير صالح.');
  }

  const sanitizedName = String(input.guest_name || '')
    .trim()
    .slice(0, 100);
  if (!sanitizedName) {
    throw new Error('يرجى إدخال الاسم الكريم.');
  }

  const sanitizedMessage = String(input.message || '')
    .trim()
    .slice(0, 1000);
  if (!sanitizedMessage) {
    throw new Error('يرجى كتابة كلمتكم أو تهنئتكم للعروسين.');
  }

  const row: GuestbookWishRow = {
    id: generateUUID(),
    slug: cleanSlug,
    guest_name: sanitizedName,
    message: sanitizedMessage,
    created_at: new Date().toISOString(),
  };

  // 1. Save to Supabase `guestbook_wishes` if configured
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      await fetch(`${supabase.url}/rest/v1/guestbook_wishes`, {
        method: 'POST',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(row),
      });
    } catch {
      // Continue to local fallback
    }
  }

  // 2. Save to Neon / Vercel Postgres if configured
  if (getNeonHttpConfig()) {
    await executeNeonSql(
      'INSERT INTO guestbook_wishes (id, slug, guest_name, message, created_at) VALUES ($1, $2, $3, $4, $5)',
      [row.id, row.slug, row.guest_name, row.message, row.created_at]
    );
  }

  // 3. Always persist to local/tmp fallback & sync with invitationStore so Admin & Templates see it
  const db = readFallbackDb();
  db.guestbook_wishes.unshift(row);
  writeFallbackDb(db);

  // 4. Backup immediately to Google Sheets (so every comment has a safe copy in Google Sheets)
  await appendWishToGoogleSheet(row);

  try {
    await addRSVPForSlug(cleanSlug, {
      name: sanitizedName,
      status: 'attending',
      guests: 1,
      message: sanitizedMessage,
    });
  } catch {
    // Ignore secondary store sync errors
  }

  return row;
}

// =============================================================================
// 2. RSVP RESPONSES (`rsvp_responses` Table)
// =============================================================================

/**
 * Fetches RSVP responses from `rsvp_responses`, optionally filtered by `slug`.
 */
export async function getRSVPResponses(slug?: string): Promise<RSVPResponseRow[]> {
  const cleanSlug = slug ? sanitizeSlug(slug) : '';

  // 1. Try Supabase `rsvp_responses` table
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const filterQuery = cleanSlug
        ? `slug=eq.${encodeURIComponent(cleanSlug)}&select=*&order=created_at.desc`
        : `select=*&order=created_at.desc`;
      const res = await fetch(`${supabase.url}/rest/v1/rsvp_responses?${filterQuery}`, {
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const rows = (await res.json()) as RSVPResponseRow[];
        return rows;
      }
    } catch {
      // Fall through to next provider
    }
  }

  // 2. Try Neon / Vercel Postgres HTTP SQL
  if (getNeonHttpConfig()) {
    const rows = cleanSlug
      ? await executeNeonSql<RSVPResponseRow>(
          'SELECT id, slug, guest_name, attending, guests_count, created_at FROM rsvp_responses WHERE slug = $1 ORDER BY created_at DESC',
          [cleanSlug]
        )
      : await executeNeonSql<RSVPResponseRow>(
          'SELECT id, slug, guest_name, attending, guests_count, created_at FROM rsvp_responses ORDER BY created_at DESC'
        );
    if (rows) return rows;
  }

  // 3. Fallback: Local / `/tmp` store + synchronize from `invitationStore`
  const db = readFallbackDb();
  const directRsvps = cleanSlug
    ? db.rsvp_responses.filter((r) => r.slug === cleanSlug)
    : [...db.rsvp_responses];

  if (cleanSlug) {
    try {
      const legacyEntries = await getRSVPsBySlug(cleanSlug);
      const seenIds = new Set(directRsvps.map((r) => r.id));
      for (const entry of legacyEntries) {
        if (!seenIds.has(entry.id)) {
          directRsvps.push({
            id: entry.id,
            slug: entry.slug,
            guest_name: entry.name,
            attending: entry.status !== 'not_attending',
            guests_count: entry.status === 'not_attending' ? 0 : Math.max(1, entry.guests || 1),
            created_at: entry.createdAt,
          });
        }
      }
    } catch {
      // Ignore legacy sync errors
    }
  }

  return directRsvps.sort((a, b) =>
    (b.created_at || '').localeCompare(a.created_at || '')
  );
}

/**
 * Inserts a new RSVP response into `rsvp_responses` (and optionally saves a wish to `guestbook_wishes`).
 */
export async function createRSVPResponse(input: {
  slug: string;
  guest_name: string;
  attending?: boolean;
  guests_count?: number;
  message?: string;
}): Promise<RSVPResponseRow> {
  const cleanSlug = sanitizeSlug(input.slug);
  if (!cleanSlug) {
    throw new Error('معرف المناسبة (slug) غير صالح.');
  }

  const sanitizedName = String(input.guest_name || '')
    .trim()
    .slice(0, 100);
  if (!sanitizedName) {
    throw new Error('يرجى إدخال الاسم الكريم.');
  }

  const isAttending = input.attending !== undefined ? Boolean(input.attending) : true;
  const guestsCount = isAttending
    ? Math.min(20, Math.max(1, Number(input.guests_count) || 1))
    : 0;

  const row: RSVPResponseRow = {
    id: generateUUID(),
    slug: cleanSlug,
    guest_name: sanitizedName,
    attending: isAttending,
    guests_count: guestsCount,
    created_at: new Date().toISOString(),
  };

  // 1. Save to Supabase `rsvp_responses` if configured
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      await fetch(`${supabase.url}/rest/v1/rsvp_responses`, {
        method: 'POST',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(row),
      });
    } catch {
      // Continue to fallback
    }
  }

  // 2. Save to Neon / Vercel Postgres if configured
  if (getNeonHttpConfig()) {
    await executeNeonSql(
      'INSERT INTO rsvp_responses (id, slug, guest_name, attending, guests_count, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [row.id, row.slug, row.guest_name, row.attending, row.guests_count, row.created_at]
    );
  }

  // 3. Always persist to local/tmp fallback & sync with invitationStore
  const db = readFallbackDb();
  db.rsvp_responses.unshift(row);
  writeFallbackDb(db);

  // If the guest also wrote a congratulatory message, save it to `guestbook_wishes`
  const cleanMessage = String(input.message || '').trim().slice(0, 1000);
  if (cleanMessage) {
    const wishRow: GuestbookWishRow = {
      id: generateUUID(),
      slug: cleanSlug,
      guest_name: sanitizedName,
      message: cleanMessage,
      created_at: row.created_at,
    };
    if (supabase) {
      try {
        await fetch(`${supabase.url}/rest/v1/guestbook_wishes`, {
          method: 'POST',
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(wishRow),
        });
      } catch {
        // Ignore
      }
    }
    if (getNeonHttpConfig()) {
      await executeNeonSql(
        'INSERT INTO guestbook_wishes (id, slug, guest_name, message, created_at) VALUES ($1, $2, $3, $4, $5)',
        [wishRow.id, wishRow.slug, wishRow.guest_name, wishRow.message, wishRow.created_at]
      );
    }
    db.guestbook_wishes.unshift(wishRow);
    writeFallbackDb(db);
    await appendWishToGoogleSheet(wishRow);
  }

  // Backup RSVP to Google Sheets
  await appendRSVPToGoogleSheet(row);

  try {
    await addRSVPForSlug(cleanSlug, {
      name: sanitizedName,
      status: isAttending ? 'attending' : 'not_attending',
      guests: guestsCount,
      message: cleanMessage,
    });
  } catch {
    // Ignore secondary sync errors
  }

  return row;
}
