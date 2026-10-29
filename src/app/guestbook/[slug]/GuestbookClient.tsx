'use client';

/**
 * @file src/app/guestbook/[slug]/GuestbookClient.tsx
 * @description Standalone Wedding Day Entrance QR Guestbook UI (`/guestbook/[slug]`).
 * Styled in the signature Zaria Royal Burgundy, Cream, and Champagne Gold palette.
 * Allows venue guests scanning the entrance QR code to submit heartfelt wishes
 * directly to `POST /api/guestbook`.
 */

import React, { useEffect, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';
import type { GuestbookWishRow } from '@/types/zaria';

const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

interface GuestbookClientProps {
  slug: string;
  coupleTitle: string;
  familySignature?: string;
  initialWishes: GuestbookWishRow[];
}

/**
 * Minimalist corner ornament SVG in Champagne Gold.
 */
function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E6C79C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 pointer-events-none opacity-80 ${className}`}
    >
      <path d="M4 12V4H12" />
      <path d="M8 8L2 2" />
      <circle cx="16" cy="4" r="1" fill="#E6C79C" stroke="none" />
      <circle cx="4" cy="16" r="1" fill="#E6C79C" stroke="none" />
    </svg>
  );
}

export default function GuestbookClient({
  slug,
  coupleTitle,
  familySignature,
  initialWishes,
}: GuestbookClientProps) {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [wishes, setWishes] = useState<GuestbookWishRow[]>(initialWishes);

  // Fetch latest wishes on mount to ensure real-time freshness
  useEffect(() => {
    let active = true;
    async function refreshWishes() {
      try {
        const res = await fetch(`/api/guestbook?slug=${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data?.wishes)) {
            setWishes(data.wishes);
          }
        }
      } catch {
        // Keep initialWishes on network error
      }
    }
    refreshWishes();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = guestName.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMsg('يرجى إدخال الاسم الكريم.');
      return;
    }
    if (!trimmedMessage) {
      setErrorMsg('يرجى كتابة كلمتكم للعروسين.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          guest_name: trimmedName,
          message: trimmedMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'تعذر إرسال الكلمة، يرجى المحاولة مرة أخرى.');
      }

      const savedWish: GuestbookWishRow = data.wish || {
        id: `wish-${Date.now()}`,
        slug,
        guest_name: trimmedName,
        message: trimmedMessage,
        created_at: new Date().toISOString(),
      };

      setWishes((prev) => [savedWish, ...prev.filter((w) => w.id !== savedWish.id)]);
      setGuestName('');
      setMessage('');
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMsg((err as Error).message || 'حدث خطأ غير متوقع، يرجى المحاولة مجدداً.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className={`min-h-screen w-full bg-gradient-to-b from-[#2D070D] via-[#4A0E17] to-[#2D070D] text-[#F7E7CE] flex flex-col items-center py-8 px-4 sm:px-6 ${amiri.className}`}
    >
      {/* Main Mobile Container */}
      <div className="w-full max-w-md relative bg-[#3B0A11]/70 border border-[#E6C79C]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md p-6 sm:p-8 overflow-hidden">
        {/* Decorative Gold Corners */}
        <div className="absolute top-3 left-3">
          <CornerOrnament />
        </div>
        <div className="absolute top-3 right-3">
          <CornerOrnament className="rotate-90" />
        </div>
        <div className="absolute bottom-3 left-3">
          <CornerOrnament className="-rotate-90" />
        </div>
        <div className="absolute bottom-3 right-3">
          <CornerOrnament className="rotate-180" />
        </div>

        {/* Header Section */}
        <header className="text-center flex flex-col items-center mb-6 pt-2">
          <p className="text-xs sm:text-sm text-[#E6C79C]/90 tracking-widest mb-3">
            بسم الله الرحمن الرحيم
          </p>

          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#2D070D]/80 border border-[#E6C79C]/40 text-[#E6C79C] text-xs font-bold mb-5 shadow-sm">
            <span>دفتر الذكريات والتهاني</span>
            <span>🤍</span>
          </span>

          <h1
            className={`text-3xl sm:text-4xl text-[#FDFBF7] font-bold leading-relaxed mb-3 ${aref.className}`}
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
          >
            {coupleTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#F7E7CE]/90 leading-relaxed max-w-xs mx-auto">
            أهلاً بكم في ليلة فرحنا.. كلماتكم ودعواتكم تخلّد أجمل ذكرى في قلوبنا
          </p>
        </header>

        {/* Gold Diamond Divider: ─── ◆ ─── */}
        <div className="flex items-center justify-center gap-3 my-6 w-3/4 mx-auto opacity-80">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E6C79C] to-[#E6C79C]" />
          <span className="text-[#E6C79C] text-xs select-none">◆</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E6C79C] to-[#E6C79C]" />
        </div>

        {/* Cream & Gold Luxury Guestbook Card */}
        <section className="bg-[#FAF6F0] text-[#4A0E17] border border-[#E6C79C] rounded-2xl p-5 sm:p-6 shadow-lg">
          {submittedSuccess ? (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#63121E]/10 border border-[#63121E]/30 flex items-center justify-center text-2xl mb-4">
                🤍
              </div>
              <h2 className={`text-2xl text-[#63121E] font-bold mb-2 ${aref.className}`}>
                شكراً لمحبتكم وحضوركم
              </h2>
              <p className="text-sm sm:text-base text-[#4A0E17]/85 mb-6 leading-relaxed">
                تم حفظ كلمتكم الغالية في سجل ذكريات العروسين بنجاح.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedSuccess(false)}
                className="py-2.5 px-6 rounded-full text-xs sm:text-sm font-bold border border-[#63121E] text-[#63121E] hover:bg-[#63121E] hover:text-[#FAF6F0] transition-all cursor-pointer"
              >
                كتابة كلمة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Guest Name Input */}
              <div>
                <label
                  htmlFor="guest_name"
                  className="block text-sm sm:text-base font-bold text-[#63121E] mb-2"
                >
                  الاسم الكريم
                </label>
                <input
                  id="guest_name"
                  type="text"
                  required
                  maxLength={100}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="اكتب اسمك الكريم هنا..."
                  className="w-full rounded-xl bg-white border border-[#E6C79C] px-4 py-3 text-sm sm:text-base text-[#2D070D] placeholder:text-[#8A7968]/70 focus:outline-none focus:ring-2 focus:ring-[#63121E] transition-all"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="guest_message"
                  className="block text-sm sm:text-base font-bold text-[#63121E] mb-2"
                >
                  كلمتكم للعروسين
                </label>
                <textarea
                  id="guest_message"
                  required
                  rows={4}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتبوا تهنئتكم أو أمنيتكم الجميلة للعروسين..."
                  className="w-full rounded-xl bg-white border border-[#E6C79C] px-4 py-3 text-sm sm:text-base text-[#2D070D] placeholder:text-[#8A7968]/70 focus:outline-none focus:ring-2 focus:ring-[#63121E] transition-all resize-none leading-relaxed"
                />
              </div>

              {errorMsg && (
                <p className="text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center font-semibold">
                  {errorMsg}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-[#63121E] via-[#4A0E17] to-[#63121E] text-[#F7E7CE] border border-[#E6C79C]/60 hover:shadow-[0_6px_20px_rgba(90,24,33,0.35)] disabled:opacity-60 cursor-pointer"
              >
                <span>{submitting ? 'جاري الإرسال...' : 'إرسال الكلمة 🤍'}</span>
              </button>
            </form>
          )}
        </section>

        {/* Submitted Wishes Feed */}
        {wishes.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-center gap-3 mb-5 w-3/4 mx-auto opacity-80">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E6C79C] to-[#E6C79C]" />
              <span className="text-[#E6C79C] text-xs select-none">◆</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E6C79C] to-[#E6C79C]" />
            </div>

            <h2
              className={`text-2xl text-[#E6C79C] text-center font-bold mb-5 ${aref.className}`}
            >
              كلمات المحبين ({wishes.length})
            </h2>

            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-[#2D070D]/75 border border-[#E6C79C]/35 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E6C79C]/20 border border-[#E6C79C]/50 flex items-center justify-center text-xs font-bold text-[#E6C79C] shrink-0">
                      {(w.guest_name || 'ض').trim().charAt(0)}
                    </div>
                    <span className="font-bold text-sm sm:text-base text-[#E6C79C]">
                      {w.guest_name}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#F7E7CE]/95 leading-relaxed pr-1">
                    {w.message}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Signature */}
        <footer className="mt-8 pt-4 border-t border-[#E6C79C]/20 text-center">
          {familySignature && (
            <p className="text-sm font-bold text-[#E6C79C] mb-1">{familySignature}</p>
          )}
          <p className="text-[11px] text-[#F7E7CE]/60 tracking-widest uppercase">
            ZARIA Luxury Invitations
          </p>
        </footer>
      </div>
    </main>
  );
}
