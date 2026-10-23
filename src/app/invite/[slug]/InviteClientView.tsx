'use client';

/**
 * @file src/app/invite/[slug]/InviteClientView.tsx
 * @description Client-side wrapper for rendering a custom client invitation (`/invite/[slug]`).
 * Uses server-fetched invitation data immediately when available, and falls back to
 * checking the API / browser storage if the invitation was created locally in a read-only environment.
 */

// 1. React and Next.js core modules
import { useEffect, useState } from 'react';
import Link from 'next/link';

// 3. Internal components, hooks, and utility functions
import TemplateRenderer from '@/components/templates/TemplateRenderer';

// 4. TypeScript types
import type { CustomInvitationData } from '@/types/zaria';

const LOCAL_INVITATIONS_STORAGE_KEY = 'zaria_custom_invitations_v1';

interface InviteClientViewProps {
  slug: string;
  initialInvitation: CustomInvitationData | null;
}

/**
 * Renders the client's customized template or a polite Arabic "Invitation Not Found" screen.
 */
export default function InviteClientView({ slug, initialInvitation }: InviteClientViewProps) {
  const [invitation, setInvitation] = useState<CustomInvitationData | null>(initialInvitation);
  const [loading, setLoading] = useState<boolean>(!initialInvitation);

  useEffect(() => {
    let active = true;

    async function resolveInvitation() {
      // Check localStorage override/fallback first in case admin edited in browser
      try {
        const raw = window.localStorage.getItem(LOCAL_INVITATIONS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, CustomInvitationData>;
          if (parsed && parsed[slug]) {
            if (active) {
              setInvitation(parsed[slug]);
              setLoading(false);
            }
          }
        }
      } catch {
        // Ignore storage errors
      }

      // Fetch latest from API to ensure fresh data
      try {
        const res = await fetch(`/api/invitations/${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (active && data?.invitation) {
            setInvitation(data.invitation);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Ignore network errors and rely on initialInvitation / localStorage
      }

      if (active) {
        setLoading(false);
      }
    }

    resolveInvitation();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#111111] text-[#F5EFEA] flex flex-col items-center justify-center p-6 text-center"
        dir="rtl"
      >
        <div className="w-10 h-10 border-2 border-[#C49A6C] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#C49A6C] font-medium">جاري فتح بطاقة الدعوة الخاصة بكم...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div
        className="min-h-screen bg-[#111111] text-[#F5EFEA] flex flex-col items-center justify-center p-6 text-center"
        dir="rtl"
      >
        <div className="max-w-md w-full bg-[#1A1A1A] border border-[#C49A6C]/30 rounded-3xl p-8 shadow-2xl">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-[#C49A6C] mb-3">عذراً، لم يتم العثور على الدعوة</h1>
          <p className="text-sm text-[#EAD1C6]/80 leading-relaxed mb-6">
            الرابط الذي قمت بفتحه غير متوفر حالياً أو تم تغيير معرف الدعوة ({slug}).
          </p>
          <Link
            href="/"
            className="inline-block bg-[#C49A6C] text-[#111111] font-bold text-sm px-8 py-3 rounded-full hover:bg-[#b0885a] transition-colors"
          >
            العودة إلى منصة زاريا
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black w-full" dir="rtl">
      <TemplateRenderer
        templateId={invitation.templateId}
        customData={invitation}
        hideBackButton={true}
      />
    </div>
  );
}
