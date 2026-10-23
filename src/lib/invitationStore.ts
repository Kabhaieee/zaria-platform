/**
 * @file src/lib/invitationStore.ts
 * @description Server-side storage manager for Custom Client Invitations and isolated RSVPs/Wishes.
 * Uses Supabase REST API when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are configured, and automatically falls back to persistent
 * JSON file storage (`src/data/clientInvitations.json`) + in-memory cache so the system works
 * out of the box with zero external configuration.
 */

import fs from 'fs';
import path from 'path';
import seedStore from '@/data/clientInvitations.json';
import { VALID_TEMPLATE_IDS } from '@/lib/masterTemplates';
import type { ClientRSVPEntry, CustomInvitationData, RSVPAttendanceStatus, TemplateSlug } from '@/types/zaria';

interface StoreSchema {
  invitations: CustomInvitationData[];
  rsvps: ClientRSVPEntry[];
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'clientInvitations.json');

// Global in-memory store singleton (persists across hot-reloads and serverless invocations)
const globalForStore = globalThis as unknown as {
  __zariaInvitationStore?: StoreSchema;
};

/**
 * Reads the current store from disk or initializes from the bundled seed data.
 */
function readLocalStore(): StoreSchema {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as StoreSchema;
      if (Array.isArray(parsed.invitations) && Array.isArray(parsed.rsvps)) {
        globalForStore.__zariaInvitationStore = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback to in-memory or seed store if filesystem is read-only
  }

  if (!globalForStore.__zariaInvitationStore) {
    globalForStore.__zariaInvitationStore = {
      invitations: (seedStore.invitations || []) as CustomInvitationData[],
      rsvps: (seedStore.rsvps || []) as ClientRSVPEntry[],
    };
  }
  return globalForStore.__zariaInvitationStore;
}

/**
 * Writes updated store state to disk (when writable) and updates the in-memory singleton.
 */
function writeLocalStore(store: StoreSchema): void {
  globalForStore.__zariaInvitationStore = store;
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Ignore write errors in read-only serverless environments; in-memory singleton remains updated
  }
}

/**
 * Checks whether Supabase environment variables are configured.
 */
function getSupabaseConfig(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  if (url && key && url.startsWith('https://')) {
    return { url: url.replace(/\/$/, ''), key };
  }
  return null;
}

/**
 * Sanitizes a URL slug to lowercase alphanumeric + hyphens (also allowing Arabic letters if desired,
 * though standard ASCII slugs like `ahmad-sara` are recommended).
 */
export function sanitizeSlug(rawSlug: string): string {
  return String(rawSlug || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0600-\u06FF-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/**
 * Retrieves all custom client invitations.
 */
export async function getAllClientInvitations(): Promise<CustomInvitationData[]> {
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(`${supabase.url}/rest/v1/invitations?select=*&order=createdAt.desc`, {
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        return (await res.json()) as CustomInvitationData[];
      }
    } catch {
      // Fallback to local store
    }
  }

  const store = readLocalStore();
  return [...store.invitations].sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || '')
  );
}

/**
 * Retrieves a single client invitation by its unique `slug`.
 */
export async function getClientInvitationBySlug(
  slug: string
): Promise<CustomInvitationData | null> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return null;

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(
        `${supabase.url}/rest/v1/invitations?slug=eq.${encodeURIComponent(cleanSlug)}&select=*&limit=1`,
        {
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
          cache: 'no-store',
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as CustomInvitationData[];
        if (rows.length > 0) return rows[0];
      }
    } catch {
      // Fallback to local store
    }
  }

  const store = readLocalStore();
  return store.invitations.find((inv) => inv.slug === cleanSlug) || null;
}

/**
 * Creates or updates a custom client invitation without modifying any master template defaults.
 */
export async function upsertClientInvitation(
  payload: Partial<CustomInvitationData> & { slug: string; templateId: TemplateSlug }
): Promise<CustomInvitationData> {
  const cleanSlug = sanitizeSlug(payload.slug);
  if (!cleanSlug) {
    throw new Error('يرجى إدخال معرف رابط (Slug) صالح للدعوة.');
  }

  const templateId = VALID_TEMPLATE_IDS.includes(payload.templateId)
    ? payload.templateId
    : 'wedding-royal';

  const now = new Date().toISOString();
  const hostOrCouple = (payload.hostNames ?? payload.coupleNames ?? '').trim().slice(0, 120);
  const welcomeOrInvite = (payload.welcomeMessage ?? payload.invitationText ?? '')
    .trim()
    .slice(0, 1000);

  const store = readLocalStore();
  const existingIndex = store.invitations.findIndex((inv) => inv.slug === cleanSlug);
  const existing = existingIndex >= 0 ? store.invitations[existingIndex] : undefined;

  const record: CustomInvitationData = {
    slug: cleanSlug,
    templateId,
    hostNames: hostOrCouple,
    coupleNames: hostOrCouple,
    welcomeMessage: welcomeOrInvite,
    invitationText: welcomeOrInvite,
    eventDate: (payload.eventDate ?? '').trim().slice(0, 60),
    eventTime: (payload.eventTime ?? '').trim().slice(0, 40),
    venueName: (payload.venueName ?? '').trim().slice(0, 160),
    locationUrl: (payload.locationUrl ?? '').trim().slice(0, 500),
    youtubeVideoId: (payload.youtubeVideoId ?? '').trim().slice(0, 200),
    customNote: (payload.customNote ?? '').trim().slice(0, 1000),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      await fetch(`${supabase.url}/rest/v1/invitations`, {
        method: 'POST',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(record),
      });
    } catch {
      // Continue saving to local store
    }
  }

  if (existingIndex >= 0) {
    store.invitations[existingIndex] = record;
  } else {
    store.invitations.unshift(record);
  }
  writeLocalStore(store);

  return record;
}

/**
 * Deletes a custom client invitation and its associated RSVPs by `slug`.
 */
export async function deleteClientInvitation(slug: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return false;

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      await fetch(
        `${supabase.url}/rest/v1/invitations?slug=eq.${encodeURIComponent(cleanSlug)}`,
        {
          method: 'DELETE',
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
        }
      );
      await fetch(
        `${supabase.url}/rest/v1/rsvps?slug=eq.${encodeURIComponent(cleanSlug)}`,
        {
          method: 'DELETE',
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
        }
      );
    } catch {
      // Continue deleting from local store
    }
  }

  const store = readLocalStore();
  const initialLen = store.invitations.length;
  store.invitations = store.invitations.filter((inv) => inv.slug !== cleanSlug);
  store.rsvps = store.rsvps.filter((r) => r.slug !== cleanSlug);
  writeLocalStore(store);

  return store.invitations.length < initialLen;
}

/**
 * Retrieves all RSVPs and wishes submitted specifically for the given client `slug`.
 */
export async function getRSVPsBySlug(slug: string): Promise<ClientRSVPEntry[]> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) return [];

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(
        `${supabase.url}/rest/v1/rsvps?slug=eq.${encodeURIComponent(cleanSlug)}&select=*&order=createdAt.desc`,
        {
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
          cache: 'no-store',
        }
      );
      if (res.ok) {
        return (await res.json()) as ClientRSVPEntry[];
      }
    } catch {
      // Fallback to local store
    }
  }

  const store = readLocalStore();
  return store.rsvps
    .filter((r) => r.slug === cleanSlug)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

/**
 * Retrieves all RSVPs across all client invitations (used by the Admin Dashboard overview).
 */
export async function getAllRSVPs(): Promise<ClientRSVPEntry[]> {
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(`${supabase.url}/rest/v1/rsvps?select=*&order=createdAt.desc`, {
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        return (await res.json()) as ClientRSVPEntry[];
      }
    } catch {
      // Fallback to local store
    }
  }

  const store = readLocalStore();
  return [...store.rsvps].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

/**
 * Adds a new guest RSVP and/or wish entry isolated to the specified client invitation `slug`.
 */
export async function addRSVPForSlug(
  slug: string,
  input: {
    name: string;
    status?: RSVPAttendanceStatus;
    guests?: number;
    message?: string;
    image?: string | null;
  }
): Promise<ClientRSVPEntry> {
  const cleanSlug = sanitizeSlug(slug);
  if (!cleanSlug) {
    throw new Error('معرف الدعوة غير صالح.');
  }

  const sanitizedName = String(input.name || '')
    .trim()
    .slice(0, 80);
  if (!sanitizedName) {
    throw new Error('يرجى إدخال الاسم الكريم.');
  }

  const validStatuses: RSVPAttendanceStatus[] = ['attending', 'not_attending', 'maybe'];
  const status: RSVPAttendanceStatus = validStatuses.includes(
    input.status as RSVPAttendanceStatus
  )
    ? (input.status as RSVPAttendanceStatus)
    : 'attending';

  const guests =
    status === 'not_attending'
      ? 0
      : Math.min(20, Math.max(0, Number(input.guests) || 0));

  const sanitizedMessage = String(input.message || '')
    .trim()
    .slice(0, 500);

  const entry: ClientRSVPEntry = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug: cleanSlug,
    name: sanitizedName,
    status,
    guests,
    message: sanitizedMessage,
    image: input.image || null,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      await fetch(`${supabase.url}/rest/v1/rsvps`, {
        method: 'POST',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch {
      // Continue saving to local store
    }
  }

  const store = readLocalStore();
  store.rsvps.unshift(entry);
  writeLocalStore(store);

  return entry;
}
