'use client';

/**
 * @file src/hooks/useInvitationRSVPs.ts
 * @description Custom React hook that isolates guest RSVPs ("تأكيد الحضور") and
 * Wishes ("كلمات المهنئين") per client invitation `slug`.
 * - When `slug` is undefined (Master Preview `/preview/[templateId]` or `/demo/[slug]`):
 *   Uses the master template's default demo wishes in local memory only.
 * - When `slug` is defined (Client Invitation `/invite/[slug]`):
 *   Loads and displays ONLY the wishes submitted by that client's guests, and persists
 *   new RSVPs and wishes to `/api/invitations/[slug]/rsvps` (with `localStorage` backup).
 */

import { useCallback, useEffect, useState } from 'react';
import type { ClientRSVPEntry, GuestbookEntry, RSVPAttendanceStatus } from '@/types/zaria';

const LOCAL_RSVPS_KEY_PREFIX = 'zaria_client_rsvps_';

/**
 * Converts a `ClientRSVPEntry` record into a UI `GuestbookEntry` item.
 */
function toGuestbookEntry(
  entry: ClientRSVPEntry,
  palette: string[],
  index: number
): GuestbookEntry {
  const cleanName = (entry.name || 'ضيف').trim();
  const firstLetter = cleanName.charAt(0) || 'ز';
  const avatarColor = palette[index % palette.length] || 'bg-[#C49A6C]';
  return {
    name: cleanName,
    message: entry.message,
    avatarColor,
    avatarLetter: firstLetter,
  };
}

/**
 * Hook for managing isolated guestbook wishes and RSVP submissions.
 *
 * @param {string | undefined} slug - Client invitation slug (undefined in master previews).
 * @param {GuestbookEntry[]} defaultDemoWishes - Immutable showcase wishes for master preview mode.
 * @param {string[]} avatarColors - Template-specific Tailwind background classes for wish avatars.
 */
export function useInvitationRSVPs(
  slug: string | undefined,
  defaultDemoWishes: GuestbookEntry[],
  avatarColors: string[],
  initialWishes?: { name: string; message: string }[]
) {
  const isClientInvitation = Boolean(slug && slug.trim());
  const cleanSlug = slug?.trim().toLowerCase() || '';

  // Permanent seed wishes defined in the client's config (`initialWishes`), shown below real guest wishes.
  const seedWishes: GuestbookEntry[] = (initialWishes || []).map((w, idx) =>
    toGuestbookEntry(
      { id: `seed-${idx}`, slug: cleanSlug, name: w.name, message: w.message, status: 'attending', guests: 0, createdAt: '' },
      avatarColors,
      idx
    )
  );
  const seedKey = JSON.stringify(initialWishes || []);

  // For client invitations, start with their seed wishes until isolated wishes load;
  // for master previews, start with the default demo wishes.
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookEntry[]>(() =>
    isClientInvitation ? seedWishes : defaultDemoWishes
  );

  // Load isolated wishes for client invitations on mount
  useEffect(() => {
    if (!isClientInvitation) {
      setGuestbookMessages(defaultDemoWishes);
      return;
    }

    let isMounted = true;

    async function fetchClientWishes() {
      let localEntries: ClientRSVPEntry[] = [];
      try {
        const rawLocal = localStorage.getItem(`${LOCAL_RSVPS_KEY_PREFIX}${cleanSlug}`);
        if (rawLocal) {
          localEntries = JSON.parse(rawLocal) as ClientRSVPEntry[];
        }
      } catch {
        // Ignore storage read errors
      }

      try {
        const res = await fetch(`/api/invitations/${encodeURIComponent(cleanSlug)}/rsvps`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          const serverEntries: ClientRSVPEntry[] = Array.isArray(data?.rsvps) ? data.rsvps : [];

          // Merge server and local entries by ID
          const seenIds = new Set(serverEntries.map((e) => e.id));
          const merged = [
            ...serverEntries,
            ...localEntries.filter((e) => !seenIds.has(e.id)),
          ];

          const wishesOnly = merged
            .filter((e) => e.message && e.message.trim().length > 0)
            .map((e, idx) => toGuestbookEntry(e, avatarColors, idx));

          if (isMounted) {
            setGuestbookMessages([...wishesOnly, ...seedWishes]);
          }
          return;
        }
      } catch {
        // Fallback to localStorage entries if offline
      }

      if (isMounted) {
        const fallbackWishes = localEntries
          .filter((e) => e.message && e.message.trim().length > 0)
          .map((e, idx) => toGuestbookEntry(e, avatarColors, idx));
        setGuestbookMessages([...fallbackWishes, ...seedWishes]);
      }
    }

    fetchClientWishes();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClientInvitation, cleanSlug, seedKey]);

  /**
   * Submits an RSVP and optional wish.
   * - In master preview mode: only updates in-memory component state.
   * - In client invitation mode (`/invite/[slug]`): persists to the server & localStorage under `slug`.
   */
  const submitRSVP = useCallback(
    async (input: {
      name: string;
      status: RSVPAttendanceStatus;
      guests: number;
      message: string;
    }) => {
      const sanitizedName = input.name.trim().slice(0, 80);
      const sanitizedMessage = input.message.trim().slice(0, 500);
      const boundedGuests =
        input.status === 'not_attending'
          ? 0
          : Math.min(20, Math.max(0, Number(input.guests) || 0));

      if (!sanitizedName) return;

      const randomColor =
        avatarColors[Math.floor(Math.random() * avatarColors.length)] || 'bg-[#C49A6C]';
      const firstLetter = sanitizedName.charAt(0) || 'ز';

      if (sanitizedMessage) {
        setGuestbookMessages((prev) => [
          {
            name: sanitizedName,
            message: sanitizedMessage,
            avatarColor: randomColor,
            avatarLetter: firstLetter,
          },
          ...prev,
        ]);
      }

      // If this is a real client invitation, persist the RSVP under `cleanSlug`
      if (isClientInvitation) {
        const optimisticEntry: ClientRSVPEntry = {
          id: `rsvp-${Date.now()}`,
          slug: cleanSlug,
          name: sanitizedName,
          status: input.status,
          guests: boundedGuests,
          message: sanitizedMessage,
          createdAt: new Date().toISOString(),
        };

        try {
          const storageKey = `${LOCAL_RSVPS_KEY_PREFIX}${cleanSlug}`;
          const existingRaw = localStorage.getItem(storageKey);
          const existingList: ClientRSVPEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
          localStorage.setItem(
            storageKey,
            JSON.stringify([optimisticEntry, ...existingList])
          );
        } catch {
          // Ignore localStorage quota errors
        }

        try {
          await fetch(`/api/invitations/${encodeURIComponent(cleanSlug)}/rsvps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: sanitizedName,
              status: input.status,
              guests: boundedGuests,
              message: sanitizedMessage,
            }),
          });
        } catch {
          // Local backup already saved
        }
      }
    },
    [avatarColors, cleanSlug, isClientInvitation]
  );

  return {
    guestbookMessages,
    submitRSVP,
    isClientInvitation,
  };
}
