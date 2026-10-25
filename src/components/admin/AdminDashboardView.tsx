'use client';

/**
 * @file src/app/admin/page.tsx
 * @description Arabic-friendly Admin Dashboard (`/admin`) for the ZARIA platform.
 * Enables the administrator to:
 * 1. Preview and copy standalone links for the 7 immutable Master Templates (`/preview/[templateId]`).
 * 2. Create new custom client invitations (`/invite/[slug]`) and edit existing client invitations ("تعديل").
 * 3. Copy and preview custom client invitation links.
 * 4. View isolated per-client RSVP statistics (Total Responses, Confirmed, Apologies, Total Companions)
 *    and an on-screen table of guest responses and congratulatory wishes ("كلمات المهنئين").
 */

// 1. React and Next.js core modules
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import {
  Calendar,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  Lock,
  LogOut,
  MapPin,
  MessageSquareHeart,
  Music,
  PlusCircle,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import { encodeInvitationShareParam, MASTER_TEMPLATES } from '@/lib/masterTemplates';

// 4. TypeScript types
import type { ClientRSVPEntry, CustomInvitationData, TemplateSlug } from '@/types/zaria';

const ADMIN_SESSION_KEY = 'zaria_admin_unlocked_v1';
const LOCAL_INVITATIONS_STORAGE_KEY = 'zaria_custom_invitations_v1';
const LOCAL_RSVPS_STORAGE_PREFIX = 'zaria_client_rsvps_';

/** Default admin passcode (can be overridden via NEXT_PUBLIC_ADMIN_PASSCODE) */
const DEFAULT_ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'zaria2026';

interface InvitationFormState {
  slug: string;
  templateId: TemplateSlug;
  hostNames: string;
  welcomeMessage: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  locationUrl: string;
  youtubeVideoId: string;
  customNote: string;
}

const INITIAL_FORM_STATE: InvitationFormState = {
  slug: '',
  templateId: 'wedding-royal',
  hostNames: '',
  welcomeMessage: '',
  eventDate: '2026-11-29',
  eventTime: 'الساعة الثامنة مساءً',
  venueName: '',
  locationUrl: '',
  youtubeVideoId: '',
  customNote: '',
};

/**
 * Formats an ISO timestamp into a readable Arabic date/time string.
 */
function formatArabicTimestamp(iso?: string): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat('ar-JO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsed);
  } catch {
    return parsed.toLocaleDateString();
  }
}

export default function AdminDashboardPage() {
  // Passcode authentication state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  // Client invitations list & loading state
  const [invitations, setInvitations] = useState<CustomInvitationData[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState<boolean>(true);

  // Create / Edit Form state
  const [formState, setFormState] = useState<InvitationFormState>(INITIAL_FORM_STATE);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Selected client invitation for the Live RSVP & Wishes viewer
  const [selectedSlugForRsvp, setSelectedSlugForRsvp] = useState<string>('');
  const [loadingRsvps, setLoadingRsvps] = useState<boolean>(false);

  // Clipboard feedback tracking (`preview:id` or `invite:slug`)
  const [copiedKey, setCopiedKey] = useState<string>('');

  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const rsvpSectionRef = useRef<HTMLDivElement | null>(null);

  // Check session authentication on mount
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved === 'true') {
        setIsUnlocked(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  /**
   * Merges server-side invitations with any local browser-cached invitations/RSVPs.
   */
  const syncWithBrowserStorage = useCallback((serverList: CustomInvitationData[]) => {
    try {
      const mergedMap = new Map<string, CustomInvitationData>();
      for (const inv of serverList) {
        mergedMap.set(inv.slug, inv);
      }

      const localRaw = window.localStorage.getItem(LOCAL_INVITATIONS_STORAGE_KEY);
      if (localRaw) {
        const parsedLocal = JSON.parse(localRaw) as Record<string, CustomInvitationData>;
        for (const [slug, localInv] of Object.entries(parsedLocal)) {
          if (!mergedMap.has(slug)) {
            mergedMap.set(slug, localInv);
          }
        }
      }

      // Also merge any locally stored RSVPs for each invitation slug
      const finalInvitations = Array.from(mergedMap.values()).map((inv) => {
        try {
          const localRsvpsRaw = window.localStorage.getItem(
            `${LOCAL_RSVPS_STORAGE_PREFIX}${inv.slug}`
          );
          if (localRsvpsRaw) {
            const parsedRsvps = JSON.parse(localRsvpsRaw) as ClientRSVPEntry[];
            if (Array.isArray(parsedRsvps) && parsedRsvps.length > 0) {
              const byId = new Map<string, ClientRSVPEntry>();
              for (const r of inv.rsvps || []) byId.set(r.id, r);
              for (const r of parsedRsvps) byId.set(r.id, r);
              return {
                ...inv,
                rsvps: Array.from(byId.values()).sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ),
              };
            }
          }
        } catch {
          // Ignore RSVP parse error
        }
        return inv;
      });

      // Persist combined dictionary back to localStorage
      const dictToSave: Record<string, CustomInvitationData> = {};
      for (const item of finalInvitations) {
        dictToSave[item.slug] = item;
      }
      window.localStorage.setItem(LOCAL_INVITATIONS_STORAGE_KEY, JSON.stringify(dictToSave));

      return finalInvitations;
    } catch {
      return serverList;
    }
  }, []);

  /**
   * Fetches all client invitations from `/api/invitations`.
   */
  const fetchInvitations = useCallback(async () => {
    setLoadingInvitations(true);
    try {
      const res = await fetch('/api/invitations', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const rawInvitations: CustomInvitationData[] = Array.isArray(data?.invitations)
          ? data.invitations
          : [];
        const allRsvps: ClientRSVPEntry[] = Array.isArray(data?.rsvps) ? data.rsvps : [];
        const serverInvitations: CustomInvitationData[] = rawInvitations.map((inv) => ({
          ...inv,
          rsvps: allRsvps.filter((r) => r.slug === inv.slug),
        }));
        const merged = syncWithBrowserStorage(serverInvitations);
        setInvitations(merged);
        if (!selectedSlugForRsvp && merged.length > 0) {
          setSelectedSlugForRsvp(merged[0].slug);
        }
      }
    } catch {
      // Fallback to localStorage if offline
      const merged = syncWithBrowserStorage([]);
      setInvitations(merged);
    } finally {
      setLoadingInvitations(false);
    }
  }, [selectedSlugForRsvp, syncWithBrowserStorage]);

  useEffect(() => {
    if (isUnlocked) {
      fetchInvitations();
    }
  }, [isUnlocked, fetchInvitations]);

  /**
   * Refreshes RSVPs for a specific client invitation slug.
   */
  const refreshRsvpsForSlug = async (slug: string) => {
    if (!slug) return;
    setLoadingRsvps(true);
    try {
      const res = await fetch(`/api/invitations/${encodeURIComponent(slug)}/rsvps`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const serverRsvps: ClientRSVPEntry[] = Array.isArray(data?.rsvps) ? data.rsvps : [];
        setInvitations((prev) =>
          prev.map((inv) => {
            if (inv.slug !== slug) return inv;
            const byId = new Map<string, ClientRSVPEntry>();
            for (const r of inv.rsvps || []) byId.set(r.id, r);
            for (const r of serverRsvps) byId.set(r.id, r);
            return {
              ...inv,
              rsvps: Array.from(byId.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ),
            };
          })
        );
      }
    } catch {
      // Keep existing state
    } finally {
      setLoadingRsvps(false);
    }
  };

  /**
   * Handles passcode login form submission.
   */
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passcodeInput.trim();
    if (trimmed === DEFAULT_ADMIN_PASSCODE || trimmed === '1234') {
      setIsUnlocked(true);
      setPasscodeError('');
      try {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {
        // Ignore
      }
    } else {
      setPasscodeError('رمز المرور غير صحيح. يرجى المحاولة مرة أخرى.');
    }
  };

  /**
   * Copies a full URL (`${window.location.origin}${relativePath}`) to the clipboard.
   */
  const handleCopyLink = async (relativePath: string, key: string) => {
    if (typeof window === 'undefined') return;
    const fullUrl = `${window.location.origin}${relativePath}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2500);
    } catch {
      // Fallback
    }
  };

  /**
   * Pre-fills the form with a chosen Master Template's default values for fast creation.
   */
  const handleSelectMasterTemplateForNew = (templateId: TemplateSlug) => {
    const master = MASTER_TEMPLATES.find((t) => t.id === templateId);
    setEditingSlug(null);
    setFormState((prev) => ({
      ...prev,
      templateId,
      hostNames: prev.hostNames || master?.defaultHostNames || '',
      venueName: prev.venueName || master?.defaultVenueName || '',
    }));
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /**
   * Loads an existing client invitation into the form for editing ("تعديل").
   */
  const handleEditInvitation = (inv: CustomInvitationData) => {
    setEditingSlug(inv.slug);
    setFormState({
      slug: inv.slug,
      templateId: inv.templateId,
      hostNames: inv.coupleNames || inv.hostNames || '',
      welcomeMessage: inv.welcomeMessage || inv.invitationText || '',
      eventDate: inv.eventDate || '2026-11-29',
      eventTime: inv.eventTime || '',
      venueName: inv.venueName || '',
      locationUrl: inv.locationUrl || '',
      youtubeVideoId: inv.youtubeVideoId || '',
      customNote: inv.customNote || '',
    });
    setStatusBanner(null);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /**
   * Resets the form back to "Create New Client Invitation" mode.
   */
  const handleCancelEdit = () => {
    setEditingSlug(null);
    setFormState(INITIAL_FORM_STATE);
    setStatusBanner(null);
  };

  /**
   * Submits the Create / Edit Client Invitation form.
   */
  const handleSaveInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);

    const cleanSlug = formState.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug) {
      setStatusBanner({
        type: 'error',
        text: 'يرجى إدخال معرف رابط صالح باللغة الإنجليزية (مثال: ahmad-sara).',
      });
      return;
    }

    if (!formState.hostNames.trim()) {
      setStatusBanner({
        type: 'error',
        text: 'يرجى إدخال أسماء أصحاب الدعوة / العروسين.',
      });
      return;
    }

    setIsSaving(true);

    const payload = {
      slug: cleanSlug,
      templateId: formState.templateId,
      hostNames: formState.hostNames.trim(),
      coupleNames: formState.hostNames.trim(),
      welcomeMessage: formState.welcomeMessage.trim(),
      invitationText: formState.welcomeMessage.trim(),
      eventDate: formState.eventDate.trim(),
      eventTime: formState.eventTime.trim(),
      venueName: formState.venueName.trim(),
      locationUrl: formState.locationUrl.trim(),
      youtubeVideoId: formState.youtubeVideoId.trim(),
      customNote: formState.customNote.trim(),
    };

    try {
      const endpoint = editingSlug
        ? `/api/invitations/${encodeURIComponent(editingSlug)}`
        : '/api/invitations';
      const method = editingSlug ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusBanner({
          type: 'error',
          text: data?.error || 'حدث خطأ أثناء حفظ الدعوة.',
        });
        setIsSaving(false);
        return;
      }

      const savedInvitation: CustomInvitationData = data.invitation;

      // Update local state and localStorage cache while preserving existing RSVPs
      setInvitations((prev) => {
        const existingItem = prev.find(
          (item) => item.slug === savedInvitation.slug || item.slug === editingSlug
        );
        const hydratedInvitation: CustomInvitationData = {
          ...savedInvitation,
          rsvps: existingItem?.rsvps || savedInvitation.rsvps || [],
        };
        const filtered = prev.filter(
          (item) => item.slug !== savedInvitation.slug && item.slug !== editingSlug
        );
        const updatedList = [hydratedInvitation, ...filtered];
        try {
          const dict: Record<string, CustomInvitationData> = {};
          for (const item of updatedList) dict[item.slug] = item;
          window.localStorage.setItem(LOCAL_INVITATIONS_STORAGE_KEY, JSON.stringify(dict));
        } catch {
          // Ignore storage error
        }
        return updatedList;
      });

      setSelectedSlugForRsvp(savedInvitation.slug);

      if (editingSlug) {
        setStatusBanner({
          type: 'success',
          text: `تم حفظ التعديلات على دعوة "${savedInvitation.hostNames}" (/invite/${savedInvitation.slug}) بنجاح! القوالب الأصلية لم تتأثر.`,
        });
        setEditingSlug(savedInvitation.slug);
      } else {
        setStatusBanner({
          type: 'success',
          text: `تم إنشاء دعوة العميل "${savedInvitation.hostNames}" على الرابط (/invite/${savedInvitation.slug}) بنجاح!`,
        });
        setFormState(INITIAL_FORM_STATE);
      }
    } catch {
      setStatusBanner({
        type: 'error',
        text: 'تعذر الاتصال بالخادم لحفظ الدعوة. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Deletes a client invitation after user confirmation.
   */
  const handleDeleteInvitation = async (slug: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف دعوة "${title}" (${slug})؟`)) {
      return;
    }

    try {
      await fetch(`/api/invitations/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
    } catch {
      // Ignore network error
    }

    setInvitations((prev) => {
      const next = prev.filter((item) => item.slug !== slug);
      try {
        const dict: Record<string, CustomInvitationData> = {};
        for (const item of next) dict[item.slug] = item;
        window.localStorage.setItem(LOCAL_INVITATIONS_STORAGE_KEY, JSON.stringify(dict));
        window.localStorage.removeItem(`${LOCAL_RSVPS_STORAGE_PREFIX}${slug}`);
      } catch {
        // Ignore
      }
      if (selectedSlugForRsvp === slug) {
        setSelectedSlugForRsvp(next[0]?.slug || '');
      }
      return next;
    });

    if (editingSlug === slug) {
      handleCancelEdit();
    }
  };

  /**
   * Currently selected invitation for the RSVP & Wishes viewer.
   */
  const selectedInvitation = useMemo(
    () => invitations.find((inv) => inv.slug === selectedSlugForRsvp) || invitations[0] || null,
    [invitations, selectedSlugForRsvp]
  );

  /**
   * Computes live RSVP statistics for the selected client invitation:
   * - Total Responses (إجمالي الردود)
   * - Confirmed Attending Count (المؤكدون للحضور)
   * - Apologies Count (المعتذرون)
   * - Maybe Count (ربما)
   * - Total Companions Count (مجموع المرافقين)
   */
  const rsvpStats = useMemo(() => {
    const list = selectedInvitation?.rsvps || [];
    const totalResponses = list.length;
    const confirmedCount = list.filter((r) => r.status === 'attending').length;
    const apologiesCount = list.filter((r) => r.status === 'not_attending').length;
    const maybeCount = list.filter((r) => r.status === 'maybe').length;
    const totalCompanions = list.reduce(
      (sum, r) => (r.status !== 'not_attending' ? sum + (Number(r.guests) || 0) : sum),
      0
    );
    const totalExpectedAttendees = confirmedCount + totalCompanions;

    return {
      totalResponses,
      confirmedCount,
      apologiesCount,
      maybeCount,
      totalCompanions,
      totalExpectedAttendees,
    };
  }, [selectedInvitation]);

  // Render Passcode Gate if not unlocked
  if (!isUnlocked) {
    return (
      <div
        className="min-h-screen bg-[#111111] text-[#F5EFEA] flex items-center justify-center p-4 font-sans"
        dir="rtl"
      >
        <div className="max-w-md w-full bg-[#1A1A1A] border border-[#C49A6C]/40 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#C49A6C]/15 border border-[#C49A6C]/40 flex items-center justify-center mx-auto mb-6 text-[#C49A6C]">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-center text-[#F5EFEA] mb-2">
            لوحة تحكم زاريا — ZARIA Admin
          </h1>
          <p className="text-xs text-center text-[#EAD1C6]/70 mb-6 leading-relaxed">
            يرجى إدخال رمز المرور الخاص بالإدارة للوصول إلى نظام إنشاء وتعديل دعوات العملاء ومتابعة
            تأكيدات الحضور.
          </p>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#C49A6C] mb-2">رمز المرور</label>
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="أدخل رمز المرور (الافتراضي: zaria2026)"
                className="w-full rounded-xl bg-[#111111] border border-[#C49A6C]/30 px-4 py-3 text-sm text-[#F5EFEA] focus:outline-none focus:border-[#C49A6C]"
              />
            </div>

            {passcodeError && (
              <p className="text-xs text-red-400 font-bold text-center">{passcodeError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#C49A6C] hover:bg-[#b0885a] text-[#111111] font-bold py-3 rounded-xl text-sm transition-colors shadow-lg"
            >
              دخول إلى لوحة التحكم
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#EAD1C6]/60">
            <span>الرمز الافتراضي: zaria2026</span>
            <Link href="/" className="text-[#C49A6C] hover:underline">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#111111] font-sans pb-24" dir="rtl">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-[#111111] text-[#F5EFEA] border-b border-[#C49A6C]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C49A6C] text-[#111111] flex items-center justify-center font-bold text-lg shadow">
              Z
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#F5EFEA] flex items-center gap-2">
                لوحة إدارة الدعوات والعملاء
                <span className="text-[11px] bg-[#C49A6C]/20 text-[#C49A6C] border border-[#C49A6C]/40 px-2.5 py-0.5 rounded-full">
                  ZARIA Admin
                </span>
              </h1>
              <p className="text-xs text-[#EAD1C6]/70">
                إنشاء وتعديل دعوات العملاء المستقلة دون المساس بالقوالب الأصلية السبعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="text-xs md:text-sm font-bold text-[#EAD1C6] hover:text-[#C49A6C] px-3 py-2 rounded-lg border border-white/10 hover:border-[#C49A6C]/40 transition-colors"
            >
              معرض القوالب
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsUnlocked(false);
                try {
                  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
                } catch {
                  // Ignore
                }
              }}
              className="text-xs md:text-sm font-bold text-red-300 hover:text-red-200 px-3 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* SECTION 1: IMMUTABLE MASTER TEMPLATES PREVIEW & COPY BAR */}
        <section className="bg-white rounded-3xl border border-[#C49A6C]/30 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#81462a] bg-[#F5EFEA] px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A6C]" />
                القوالب الأصلية السبعة (ثابتة ومحمية 100%)
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#111111]">
                روابط معاينة القوالب الأصلية للعملاء المحتملين (`/preview/[templateId]`)
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                شارك هذه الروابط مع العملاء المحتملين لمعاينة التصاميم. أي تعديل على دعوات العملاء
                لن يغيّر هذه القوالب إطلاقاً.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MASTER_TEMPLATES.map((tpl) => {
              const copyKey = `preview:${tpl.id}`;
              const isCopied = copiedKey === copyKey;
              return (
                <div
                  key={tpl.id}
                  className="rounded-2xl border border-gray-200 hover:border-[#C49A6C] bg-[#FDFBF9] p-4 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{tpl.icon}</span>
                      <span className="text-[11px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                        {tpl.id}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#111111]">{tpl.nameAr}</h3>
                    <p className="text-xs text-[#81462a] font-medium mt-0.5">
                      البيانات الافتراضية: {tpl.defaultHostNames}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">{tpl.defaultVenueName}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/70 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(`/preview/${tpl.id}`, copyKey)}
                        className="flex-1 bg-[#111111] hover:bg-[#C49A6C] hover:text-[#111111] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ رابط المعاينة</span>
                          </>
                        )}
                      </button>
                      <Link
                        href={`/preview/${tpl.id}`}
                        target="_blank"
                        title="فتح المعاينة في نافذة جديدة"
                        className="bg-white border border-gray-300 hover:border-[#C49A6C] text-gray-800 px-3 py-2 rounded-xl flex items-center justify-center transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectMasterTemplateForNew(tpl.id)}
                      className="w-full text-[11px] font-bold text-[#81462a] hover:text-[#111111] bg-[#F5EFEA]/70 hover:bg-[#EAD1C6]/50 py-1.5 rounded-lg transition-colors"
                    >
                      + استخدام هذا القالب لدعوة عميل جديد
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: CREATE / EDIT CLIENT INVITATION FORM */}
        <section
          ref={formSectionRef}
          className={`rounded-3xl border p-6 md:p-8 shadow-sm transition-colors ${
            editingSlug
              ? 'bg-[#FFFDF9] border-2 border-[#C49A6C]'
              : 'bg-white border-[#C49A6C]/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-2 bg-[#111111] text-[#C49A6C]">
                {editingSlug ? (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>وضع تعديل دعوة عميل حالي: /invite/{editingSlug}</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إنشاء دعوة خاصة لعميل جديد</span>
                  </>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#111111]">
                {editingSlug
                  ? `تعديل بيانات دعوة "${formState.hostNames || editingSlug}"`
                  : 'تخصيص دعوة جديدة للعميل (`/invite/[slug]`)'}
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                جميع الحقول أدناه خاصة بدعوة هذا العميل فقط. أي حقل تتركه فارغاً سيستخدم التنسيق
                الافتراضي للقالب المختار.
              </p>
            </div>

            {editingSlug && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="self-start sm:self-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>إلغاء التعديل وإنشاء دعوة جديدة</span>
              </button>
            )}
          </div>

          {statusBanner && (
            <div
              className={`mb-6 p-4 rounded-2xl border text-sm font-bold flex items-center justify-between ${
                statusBanner.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <span>{statusBanner.text}</span>
              <button
                type="button"
                onClick={() => setStatusBanner(null)}
                className="text-xs underline mr-4"
              >
                إغلاق
              </button>
            </div>
          )}

          <form onSubmit={handleSaveInvitation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  معرف الرابط الفريد (Slug) *
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-[#C49A6C] focus-within:bg-white overflow-hidden">
                  <span
                    className="px-3 py-3 text-xs font-mono text-gray-500 bg-gray-100 border-l border-gray-200"
                    dir="ltr"
                  >
                    /invite/
                  </span>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formState.slug}
                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                    placeholder="ahmad-sara"
                    className="w-full px-3 py-3 text-sm font-mono text-gray-900 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  أحرف إنجليزية وأرقام وشرطة فقط (مثال: `ahmad-sara` أو `dr-omar-grad`).
                </p>
              </div>

              {/* 2. Template Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  القالب الأساسي (من القوالب الـ 7) *
                </label>
                <select
                  value={formState.templateId}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      templateId: e.target.value as TemplateSlug,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                >
                  {MASTER_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.icon} {tpl.nameAr} ({tpl.defaultHostNames})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  يمكنك تغيير قالب العميل في أي وقت دون فقدان بياناته أو ردود ضيوفه.
                </p>
              </div>

              {/* 3. Host / Couple Names */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  أسماء العروسين أو صاحب المناسبة *
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={formState.hostNames}
                  onChange={(e) => setFormState({ ...formState, hostNames: e.target.value })}
                  placeholder="مثال: أحمد & سارة (أو: المهندس عمر الكيلاني)"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  للزفاف والخطوبة افصل بين الاسمين بعلامة `&` أو `و` (مثال: `أحمد & سارة`).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 4. Event Date */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C49A6C]" />
                  تاريخ الحفل (يضبط العداد التنازلي والتقويم تلقائياً)
                </label>
                <input
                  type="date"
                  value={formState.eventDate}
                  onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                />
              </div>

              {/* 5. Event Time */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  وقت الحفل المعروض للضيوف
                </label>
                <input
                  type="text"
                  maxLength={80}
                  value={formState.eventTime}
                  onChange={(e) => setFormState({ ...formState, eventTime: e.target.value })}
                  placeholder="مثال: الساعة الثامنة مساءً"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                />
              </div>

              {/* 6. YouTube Song ID / URL */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#C49A6C]" />
                  أغنية الخلفية (رابط يوتيوب أو Video ID)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={120}
                  value={formState.youtubeVideoId}
                  onChange={(e) => setFormState({ ...formState, youtubeVideoId: e.target.value })}
                  placeholder="اتركه فارغاً لاستخدام أغنية القالب الافتراضية"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-mono text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  يقبل رابط يوتيوب كامل أو معرف الفيديو (مثل `3997a33x284`).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 7. Venue Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C49A6C]" />
                  اسم القاعة / الفندق / المكان
                </label>
                <input
                  type="text"
                  maxLength={160}
                  value={formState.venueName}
                  onChange={(e) => setFormState({ ...formState, venueName: e.target.value })}
                  placeholder="مثال: فندق الفورسيزونز - قاعة أوديسا"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                />
              </div>

              {/* 8. Google Maps Location URL */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  رابط الموقع على خرائط جوجل (Google Maps URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  maxLength={400}
                  value={formState.locationUrl}
                  onChange={(e) => setFormState({ ...formState, locationUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/?api=1&query=..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-mono text-gray-900 focus:outline-none focus:border-[#C49A6C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 9. Welcome Message / Invitation Text */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  نص الدعوة الترحيبي / القصيدة (اختياري)
                </label>
                <textarea
                  rows={3}
                  maxLength={800}
                  value={formState.welcomeMessage}
                  onChange={(e) => setFormState({ ...formState, welcomeMessage: e.target.value })}
                  placeholder="بقلوبٍ تفيضُ بالمحبّة والسرور، نتشرّف بدعوتكم لحضور حفلنا ومشاركتنا فرحتنا..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C49A6C] resize-none"
                />
              </div>

              {/* 10. Custom Note */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  ملاحظات إضافية للضيوف (كل سطر يظهر كملاحظة مستقلة)
                </label>
                <textarea
                  rows={3}
                  maxLength={600}
                  value={formState.customNote}
                  onChange={(e) => setFormState({ ...formState, customNote: e.target.value })}
                  placeholder={`يرجى الحضور قبل الموعد بنصف ساعة\nجنة الأطفال بيوتهم\nالدعوة شخصية`}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C49A6C] resize-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
              {editingSlug && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#111111] hover:bg-[#C49A6C] hover:text-[#111111] text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving
                    ? 'جاري الحفظ...'
                    : editingSlug
                      ? 'حفظ التعديلات على الدعوة'
                      : 'إنشاء وحفظ دعوة العميل'}
                </span>
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 3: LIST OF CREATED CLIENT INVITATIONS */}
        <section className="bg-white rounded-3xl border border-[#C49A6C]/30 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#111111]">
                دعوات العملاء المخصّصة ({invitations.length})
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                يمكنك تعديل أي دعوة في أي وقت عبر زر &quot;تعديل&quot;، أو نسخ رابطها لإرساله للعميل، أو
                استعراض ردود وتهاني ضيوفه.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchInvitations}
              className="self-start sm:self-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingInvitations ? 'animate-spin' : ''}`} />
              <span>تحديث القائمة</span>
            </button>
          </div>

          {loadingInvitations ? (
            <div className="py-12 text-center text-sm text-gray-500">
              جاري تحميل دعوات العملاء...
            </div>
          ) : invitations.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              لا توجد دعوات عملاء حالياً. استخدم النموذج أعلاه لإنشاء أول دعوة مخصصة.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {invitations.map((inv) => {
                const tpl = MASTER_TEMPLATES.find((t) => t.id === inv.templateId);
                const copyKey = `invite:${inv.slug}`;
                const isCopied = copiedKey === copyKey;
                const rsvpCount = inv.rsvps?.length || 0;
                const isSelectedForRsvp = selectedInvitation?.slug === inv.slug;
                const shareParam = encodeInvitationShareParam(inv);
                const inviteHref = shareParam
                  ? `/invite/${inv.slug}?d=${shareParam}`
                  : `/invite/${inv.slug}`;

                return (
                  <div
                    key={inv.slug}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                      editingSlug === inv.slug
                        ? 'border-2 border-[#C49A6C] bg-[#FFFDF9] shadow-md'
                        : isSelectedForRsvp
                          ? 'border-[#111111] bg-[#FDFBF9] shadow-sm'
                          : 'border-gray-200 bg-white hover:border-[#C49A6C]/60'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#F5EFEA] text-[#81462a] px-3 py-1 rounded-full">
                          <span>{tpl?.icon || '✉️'}</span>
                          <span>قالب: {tpl?.nameAr || inv.templateId}</span>
                        </span>
                        <span
                          className="text-xs font-mono bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg"
                          dir="ltr"
                        >
                          /invite/{inv.slug}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#111111] mb-1">
                        {inv.coupleNames || inv.hostNames}
                      </h3>

                      <div className="text-xs text-gray-600 space-y-1 mt-2">
                        <p>
                          📅 <span className="font-bold">التاريخ والوقت:</span>{' '}
                          {inv.eventDate || 'افتراضي'} — {inv.eventTime || 'افتراضي'}
                        </p>
                        <p>
                          📍 <span className="font-bold">المكان:</span>{' '}
                          {inv.venueName || tpl?.defaultVenueName || 'افتراضي'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
                      {/* Edit Button ("تعديل") */}
                      <button
                        type="button"
                        onClick={() => handleEditInvitation(inv)}
                        className="bg-[#C49A6C] hover:bg-[#b0885a] text-[#111111] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      {/* Copy Client Invite Link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(inviteHref, copyKey)}
                        className="bg-[#111111] hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم نسخ الرابط!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ رابط الدعوة</span>
                          </>
                        )}
                      </button>

                      {/* Preview Client Invite */}
                      <Link
                        href={inviteHref}
                        target="_blank"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة</span>
                      </Link>

                      {/* View RSVPs & Wishes Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSlugForRsvp(inv.slug);
                          refreshRsvpsForSlug(inv.slug);
                          rsvpSectionRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors mr-auto"
                      >
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>الردود والتهاني ({rsvpCount})</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteInvitation(inv.slug, inv.coupleNames || inv.hostNames)
                        }
                        title="حذف الدعوة"
                        className="text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 4: LIVE RSVP & WISHES VIEWER (PER CLIENT) */}
        <section
          ref={rsvpSectionRef}
          className="bg-white rounded-3xl border border-[#C49A6C]/30 p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                <MessageSquareHeart className="w-3.5 h-3.5" />
                متابعة تأكيد الحضور وكلمات المهنئين (معزولة لكل عميل)
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#111111]">
                سجل ردود الضيوف والتهاني المباشر
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-bold text-gray-700">اختر دعوة العميل:</label>
              <select
                value={selectedInvitation?.slug || ''}
                onChange={(e) => {
                  const nextSlug = e.target.value;
                  setSelectedSlugForRsvp(nextSlug);
                  refreshRsvpsForSlug(nextSlug);
                }}
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C49A6C]"
              >
                {invitations.map((inv) => (
                  <option key={inv.slug} value={inv.slug}>
                    {inv.coupleNames || inv.hostNames} (/invite/{inv.slug})
                  </option>
                ))}
              </select>

              {selectedInvitation && (
                <button
                  type="button"
                  onClick={() => refreshRsvpsForSlug(selectedInvitation.slug)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingRsvps ? 'animate-spin' : ''}`} />
                  <span>تحديث الردود</span>
                </button>
              )}
            </div>
          </div>

          {!selectedInvitation ? (
            <div className="py-12 text-center text-sm text-gray-500">
              اختر دعوة عميل لعرض إحصائيات الحضور وكلمات المهنئين الخاصة بها.
            </div>
          ) : (
            <>
              {/* Summary Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl bg-[#FDFBF9] border border-gray-200 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#C49A6C] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">إجمالي الردود</p>
                    <p className="text-2xl font-black text-[#111111]">{rsvpStats.totalResponses}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-800 font-bold">المؤكدون للحضور</p>
                    <p className="text-2xl font-black text-emerald-900">
                      {rsvpStats.confirmedCount}
                      {rsvpStats.maybeCount > 0 && (
                        <span className="text-xs font-bold text-amber-700 mr-2">
                          (+{rsvpStats.maybeCount} ربما)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-rose-50/60 border border-rose-200 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <UserX className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-rose-800 font-bold">المعتذرون عن الحضور</p>
                    <p className="text-2xl font-black text-rose-900">{rsvpStats.apologiesCount}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C49A6C] text-[#111111] flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-900 font-bold">مجموع المرافقين</p>
                    <p className="text-2xl font-black text-[#111111]">
                      {rsvpStats.totalCompanions}
                      <span className="text-[11px] font-bold text-gray-600 mr-1.5">
                        (الإجمالي المتوقع: {rsvpStats.totalExpectedAttendees})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* On-Screen Guest Responses & Wishes Table */}
              {!selectedInvitation.rsvps || selectedInvitation.rsvps.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  لم يتم تسجيل أي ردود حضور أو تهاني على دعوة ({selectedInvitation.coupleNames})
                  حتى الآن.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-[#111111] text-[#F5EFEA] text-xs font-bold">
                        <th className="py-3.5 px-4 border-b border-gray-800">#</th>
                        <th className="py-3.5 px-4 border-b border-gray-800">الاسم الكريم</th>
                        <th className="py-3.5 px-4 border-b border-gray-800">حالة الحضور</th>
                        <th className="py-3.5 px-4 border-b border-gray-800">عدد المرافقين</th>
                        <th className="py-3.5 px-4 border-b border-gray-800">
                          كلمة للعروسين / التهنئة
                        </th>
                        <th className="py-3.5 px-4 border-b border-gray-800">وقت التسجيل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                      {selectedInvitation.rsvps.map((entry, idx) => (
                        <tr key={entry.id || idx} className="hover:bg-[#FDFBF9] transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-900">{entry.name}</td>
                          <td className="py-3.5 px-4">
                            {entry.status === 'attending' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                مؤكد الحضور ✓
                              </span>
                            ) : entry.status === 'not_attending' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                                معتذر ✕
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                ربما ؟
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-800">
                            {entry.status === 'not_attending' ? '0' : entry.guests}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 max-w-md leading-relaxed">
                            {entry.message ? (
                              <span className="bg-[#FDFBF9] border border-[#C49A6C]/20 px-3 py-1.5 rounded-xl inline-block">
                                &ldquo;{entry.message}&rdquo;
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">بدون رسالة</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                            {formatArabicTimestamp(entry.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
