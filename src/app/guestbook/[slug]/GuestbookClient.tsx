'use client';

/**
 * @file src/app/guestbook/[slug]/GuestbookClient.tsx
 * @description Standalone Wedding Day Entrance Guestbook UI (`/guestbook` & `/guestbook/[slug]`).
 * Unified Royal Burgundy & Warm Champagne Gold palette with refined Arabic calligraphy
 * (`Aref Ruqaa` & `Amiri`) and a romantic falling rose-petals celebration effect upon submission.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';
import { AnimatePresence, motion } from 'framer-motion';
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
 * Minimalist corner ornament SVG in Champagne Gold (`#E6C79C`).
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

/**
 * Custom SVG Rose Petal / Blossom rendered inside the falling celebration shower.
 */
function RosePetalSvg({
  color,
  variant,
}: {
  color: string;
  variant: 'petal' | 'blossom' | 'bud';
}) {
  if (variant === 'blossom') {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
        <path
          d="M18 4C14 4 11 8 12 12C8 11 4 14 4 18C4 22 8 25 12 24C11 28 14 32 18 32C22 32 25 28 24 24C28 25 32 22 32 18C32 14 28 11 24 12C25 8 22 4 18 4Z"
          fill={color}
          fillOpacity="0.9"
        />
        <circle cx="18" cy="18" r="4" fill="#F7E7CE" fillOpacity="0.85" />
      </svg>
    );
  }

  if (variant === 'bud') {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">
        <path
          d="M16 3C10 7 6 14 8 21C10 26 14 29 16 29C18 29 22 26 24 21C26 14 22 7 16 3Z"
          fill={color}
          fillOpacity="0.92"
        />
        <path
          d="M16 6C13 10 12 16 14 23"
          stroke="#FDFBF7"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
      <path
        d="M16 2C9 2 4 9 5 17C6 24 12 29 16 30C20 29 26 24 27 17C28 9 23 2 16 2Z"
        fill={color}
        fillOpacity="0.88"
      />
      <path
        d="M16 5C14 12 14 20 16 27"
        stroke="#FDFBF7"
        strokeWidth="0.9"
        strokeOpacity="0.35"
        fill="none"
      />
    </svg>
  );
}

interface PetalParticle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  sway: number;
  rotateStart: number;
  rotateEnd: number;
  color: string;
  variant: 'petal' | 'blossom' | 'bud';
}

const PETAL_COLORS = [
  '#F4B8C4', // Soft Blush Rose
  '#E88D9E', // Damask Pink Rose
  '#D9657B', // Romantic Rose
  '#B82943', // Velvet Crimson Rose
  '#FAD4DC', // Light Pearl Pink
  '#E6C79C', // Champagne Gold Accent Petal
];

/**
 * Full-screen background cascade of falling pink/crimson rose petals & blossoms.
 */
function FallingRosePetals({ activeKey }: { activeKey: number }) {
  const petals = useMemo<PetalParticle[]>(() => {
    const variants: Array<'petal' | 'blossom' | 'bud'> = ['petal', 'petal', 'bud', 'blossom'];
    return Array.from({ length: 48 }, (_, i) => {
      const seed = (i * 37 + activeKey * 13) % 100;
      return {
        id: i,
        left: (i * 2.1 + (seed % 7)) % 98,
        size: 16 + (i % 5) * 4,
        delay: (i % 12) * 0.22,
        duration: 4.6 + (i % 6) * 0.65,
        sway: (i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 14),
        rotateStart: (i * 45) % 360,
        rotateEnd: ((i * 45) % 360) + (i % 2 === 0 ? 320 : -320),
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        variant: variants[i % variants.length],
      };
    });
  }, [activeKey]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    >
      {petals.map((p) => (
        <motion.div
          key={`${activeKey}-${p.id}`}
          initial={{
            y: '-10vh',
            x: 0,
            rotate: p.rotateStart,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            y: '112vh',
            x: [0, p.sway, -p.sway * 0.6, p.sway * 0.4, 0],
            rotate: p.rotateEnd,
            opacity: [0, 0.95, 0.95, 0.85, 0],
            scale: [0.85, 1.05, 0.95, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        >
          <RosePetalSvg color={p.color} variant={p.variant} />
        </motion.div>
      ))}
    </div>
  );
}

export default function GuestbookClient({
  slug,
  coupleTitle,
  initialWishes,
}: GuestbookClientProps) {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [petalBurstKey, setPetalBurstKey] = useState<number>(0);
  const [showPetals, setShowPetals] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [wishes, setWishes] = useState<GuestbookWishRow[]>(initialWishes);

  // Split couple names for graceful 2-line calligraphic display if applicable
  const coupleParts = useMemo(() => {
    if (slug === 'omar-ayat' || coupleTitle.includes('المهندس عمر')) {
      return { groom: 'المهندس عمر', bride: 'الدكتورة آيات' };
    }
    const parts = coupleTitle.split(/\s+و\s+/);
    if (parts.length === 2) {
      return { groom: parts[0].trim(), bride: parts[1].trim() };
    }
    return null;
  }, [slug, coupleTitle]);

  // Fetch latest wishes on mount
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

  // Automatically clear the petal shower after animation completes (~8.5s)
  useEffect(() => {
    if (!showPetals) return;
    const timer = setTimeout(() => {
      setShowPetals(false);
    }, 8500);
    return () => clearTimeout(timer);
  }, [showPetals, petalBurstKey]);

  const triggerRoseShower = () => {
    setPetalBurstKey((prev) => prev + 1);
    setShowPetals(true);
  };

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
      triggerRoseShower();
    } catch (err) {
      setErrorMsg((err as Error).message || 'حدث خطأ غير متوقع، يرجى المحاولة مجدداً.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className={`min-h-screen w-full bg-gradient-to-b from-[#26050A] via-[#4A0E17] to-[#26050A] text-[#F7E7CE] flex flex-col items-center justify-between py-8 px-4 sm:px-6 relative overflow-x-hidden ${amiri.className}`}
    >
      {/* Ambient Radial Gold & Rose Glow in Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-35"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(230, 199, 156, 0.18) 0%, rgba(158, 27, 50, 0.12) 45%, transparent 75%)',
        }}
      />

      {/* Falling Rose Petals Shower on Submission */}
      <AnimatePresence>
        {showPetals && <FallingRosePetals key={petalBurstKey} activeKey={petalBurstKey} />}
      </AnimatePresence>

      {/* Main Luxury Royal Burgundy Frame */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10 bg-gradient-to-b from-[#3B0A11]/90 via-[#2D070D]/95 to-[#3B0A11]/90 border border-[#E6C79C]/45 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-md p-6 sm:p-8 overflow-hidden"
      >
        {/* Decorative Champagne Gold Corners */}
        <div className="absolute top-3.5 left-3.5">
          <CornerOrnament />
        </div>
        <div className="absolute top-3.5 right-3.5">
          <CornerOrnament className="rotate-90" />
        </div>
        <div className="absolute bottom-3.5 left-3.5">
          <CornerOrnament className="-rotate-90" />
        </div>
        <div className="absolute bottom-3.5 right-3.5">
          <CornerOrnament className="rotate-180" />
        </div>

        {/* Header Section */}
        <header className="text-center flex flex-col items-center pt-2">
          <p
            className="text-sm sm:text-base text-[#F7E7CE]/90 tracking-wide mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
          >
            بسم الله الرحمن الرحيم
          </p>

          {/* Subtle Top Ornament */}
          <div className="flex items-center gap-2 mb-5 opacity-85">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#E6C79C]" />
            <span className="text-[#E6C79C] text-[10px]">♦</span>
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#E6C79C]" />
          </div>

          {/* Calligraphic Couple Names */}
          {coupleParts ? (
            <div className="flex flex-col items-center mb-4">
              <h1
                className={`text-3xl sm:text-4xl text-[#FDFBF7] font-bold leading-relaxed ${aref.className}`}
                style={{ textShadow: '0 3px 14px rgba(0,0,0,0.75)' }}
              >
                {coupleParts.groom}
              </h1>
              <span
                className="block text-xl sm:text-2xl text-[#E6C79C] my-1.5 font-normal select-none leading-none"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
              >
                و
              </span>
              <h2
                className={`text-3xl sm:text-4xl text-[#FDFBF7] font-bold leading-relaxed ${aref.className}`}
                style={{ textShadow: '0 3px 14px rgba(0,0,0,0.75)' }}
              >
                {coupleParts.bride}
              </h2>
            </div>
          ) : (
            <h1
              className={`text-3xl sm:text-4xl text-[#FDFBF7] font-bold leading-relaxed mb-4 ${aref.className}`}
              style={{ textShadow: '0 3px 14px rgba(0,0,0,0.75)' }}
            >
              {coupleTitle}
            </h1>
          )}

          <p
            className={`text-xl sm:text-2xl text-[#E6C79C] font-bold mt-1 mb-2 ${aref.className}`}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            دفتر الذكريات والتهاني
          </p>

          <p className="text-base sm:text-lg text-[#F7E7CE]/90 leading-relaxed max-w-xs mx-auto font-medium">
            أهلاً بكم في ليلة فرحنا.. كلماتكم ودعواتكم تخلّد أجمل ذكرى في قلوبنا
          </p>
        </header>

        {/* Gold Diamond Divider: ─── ◆ ─── */}
        <div className="flex items-center justify-center gap-3 my-6 w-3/4 mx-auto opacity-85">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E6C79C] to-[#E6C79C]" />
          <span className="text-[#E6C79C] text-xs select-none">◆</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E6C79C] to-[#E6C79C]" />
        </div>

        {/* Harmonious Royal Burgundy & Gold Form Card */}
        <section className="bg-[#24050A]/75 border border-[#E6C79C]/40 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(230,199,156,0.2),0_12px_30px_rgba(0,0,0,0.4)]">
          {submittedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="py-6 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#63121E] to-[#3B0A11] border border-[#E6C79C]/60 flex items-center justify-center text-2xl mb-4 shadow-[0_0_25px_rgba(232,141,158,0.35)]">
                🌸
              </div>
              <h3
                className={`text-2xl sm:text-3xl text-[#E6C79C] font-bold mb-3 ${aref.className}`}
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                شكراً لمحبتكم وحضوركم
              </h3>
              <p className="text-base sm:text-lg text-[#F7E7CE]/95 mb-6 leading-relaxed">
                تم حفظ كلمتكم الغالية في سجل ذكريات العروسين بنجاح
              </p>
              <button
                type="button"
                onClick={() => setSubmittedSuccess(false)}
                className="py-2.5 px-7 rounded-full text-sm sm:text-base font-bold border border-[#E6C79C]/60 text-[#F7E7CE] bg-[#4A0E17]/80 hover:bg-[#63121E] hover:border-[#E6C79C] transition-all shadow-md cursor-pointer"
              >
                كتابة تهنئة أخرى
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Guest Name Input */}
              <div>
                <label
                  htmlFor="guest_name"
                  className={`block text-lg sm:text-xl font-bold text-[#E6C79C] mb-2.5 ${aref.className}`}
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
                  className="w-full rounded-xl bg-[#380910]/90 border border-[#E6C79C]/45 px-4 py-3.5 text-base sm:text-lg text-[#FDFBF7] placeholder:text-[#F7E7CE]/45 focus:outline-none focus:border-[#E6C79C] focus:ring-2 focus:ring-[#E6C79C]/30 transition-all shadow-inner"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="guest_message"
                  className={`block text-lg sm:text-xl font-bold text-[#E6C79C] mb-2.5 ${aref.className}`}
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
                  className="w-full rounded-xl bg-[#380910]/90 border border-[#E6C79C]/45 px-4 py-3.5 text-base sm:text-lg text-[#FDFBF7] placeholder:text-[#F7E7CE]/45 focus:outline-none focus:border-[#E6C79C] focus:ring-2 focus:ring-[#E6C79C]/30 transition-all resize-none leading-relaxed shadow-inner"
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-[#FAD4DC] bg-[#63121E]/90 border border-[#E88D9E]/50 rounded-xl px-3 py-2.5 text-center font-semibold">
                  {errorMsg}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 px-6 rounded-full font-bold text-lg sm:text-xl shadow-[0_8px_25px_rgba(0,0,0,0.45)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-[#63121E] via-[#7A1828] to-[#63121E] text-[#FDFBF7] border border-[#E6C79C]/70 hover:border-[#E6C79C] hover:shadow-[0_8px_30px_rgba(230,199,156,0.25)] disabled:opacity-60 cursor-pointer ${aref.className}`}
              >
                <span>{submitting ? 'جاري الإرسال...' : 'إرسال الكلمة 🤍'}</span>
              </button>
            </form>
          )}
        </section>

        {/* Submitted Wishes Feed */}
        {wishes.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-center gap-3 mb-5 w-3/4 mx-auto opacity-85">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E6C79C] to-[#E6C79C]" />
              <span className="text-[#E6C79C] text-xs select-none">◆</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E6C79C] to-[#E6C79C]" />
            </div>

            <h2
              className={`text-2xl sm:text-3xl text-[#E6C79C] text-center font-bold mb-5 ${aref.className}`}
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              كلمات المحبين ({wishes.length})
            </h2>

            <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {wishes.map((w) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#24050A]/80 border border-[#E6C79C]/35 rounded-2xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-b from-[#63121E] to-[#3B0A11] border border-[#E6C79C]/55 flex items-center justify-center text-sm font-bold text-[#E6C79C] shrink-0 ${aref.className}`}
                    >
                      {(w.guest_name || 'ض').trim().charAt(0)}
                    </div>
                    <span
                      className={`font-bold text-lg sm:text-xl text-[#E6C79C] ${aref.className}`}
                    >
                      {w.guest_name}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-[#FDFBF7]/95 leading-relaxed pr-1">
                    {w.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Footer — Strictly "ZARIA" Only as Requested */}
        <footer className="mt-8 pt-5 border-t border-[#E6C79C]/25 text-center flex flex-col items-center">
          <span
            dir="ltr"
            className="text-sm sm:text-base font-serif font-semibold text-[#E6C79C] tracking-[0.35em] select-none"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            ZARIA
          </span>
        </footer>
      </motion.div>
    </main>
  );
}
