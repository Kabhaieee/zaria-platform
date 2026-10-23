'use client';

/**
 * @file src/components/templates/designs/GraduationNotebook.jsx
 * @description Interactive 3D flip-book graduation memory notebook template ("دفتر الذكريات").
 * Features a burgundy & gold hardcover front/back, an interactive greeting & photo upload form
 * ("أضف تهنئتك"), and multi-page memory feed spreads ("سجل الذكريات").
 * Supports optional `customData` overrides while keeping default showcase data immutable.
 */

// 1. React and Next.js core modules
import { useEffect, useRef, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';

// 2. Third-party libraries
import { Camera, ChevronLeft, ChevronRight, Send } from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import BackgroundMusic from '../../BackgroundMusic';
import {
  resolveSingleHostName,
  resolveWelcomeMessage,
  resolveYoutubeUrl,
} from '@/lib/masterTemplates';

// Configure Arabic typography fonts
const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

/**
 * Initial pre-populated graduation memory notebook entries for master preview mode.
 * @type {import('@/types/zaria').NotebookEntry[]}
 */
const INITIAL_ENTRIES = [
  {
    id: 1,
    name: 'سارة خالد',
    message:
      'فخورة جداً فيك يا أجمل خريجة! أيام الجامعة كانت أحلى بوجودك، ومنها للأعلى يا رب 🎓🤍',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
    date: '2026-11-20',
  },
  {
    id: 2,
    name: 'محمد علي',
    message: 'ألف مبروك التخرج يا صديقتي، مسيرة مليئة بالنجاحات بانتظارك إن شاء الله.',
    image: null,
    date: '2026-11-21',
  },
];

/**
 * GraduationNotebook Component ("دفتر الذكريات")
 *
 * @param {Object} [props] - Component props.
 * @param {import('@/types/zaria').CustomInvitationData} [props.customData] - Optional client invitation overrides.
 * @returns {JSX.Element} The rendered 3D interactive graduation memory book.
 */
export default function GraduationNotebook({ customData } = {}) {
  const isClientInvitation = Boolean(customData?.slug);
  const cleanSlug = customData?.slug?.trim().toLowerCase() || '';

  // Resolve customizable fields with fallback to immutable master showcase defaults
  const graduateName = resolveSingleHostName(customData, 'شهد الزوايدة');
  const welcomeMessage = resolveWelcomeMessage(
    customData,
    'في كتاب ذكريات تخرجي. وجودكم وكلماتكم تعني لي الكثير. تصفحوا الكتاب وشاركوني لحظاتكم وتهانيكم!'
  );
  const customSubtitle = customData?.customNote?.trim() || 'المحاسبة';
  const customClassYear = customData?.eventDate?.trim()
    ? `CLASS OF ${customData.eventDate.trim().slice(0, 4)}`
    : 'CLASS OF 2026';
  const youtubeUrl = resolveYoutubeUrl(
    customData?.youtubeVideoId,
    'https://www.youtube.com/watch?v=ZCg3kKN7VQs'
  );

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3; // 0: Cover, 1: Spread 1, 2: Spread 2, 3: Back Cover

  /** @type {[import('@/types/zaria').NotebookEntry[], React.Dispatch<React.SetStateAction<import('@/types/zaria').NotebookEntry[]>>]} */
  const [entries, setEntries] = useState(() => (isClientInvitation ? [] : INITIAL_ENTRIES));
  const [formData, setFormData] = useState({ name: '', message: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Load isolated wishes/entries when rendering a client invitation (`/invite/[slug]`)
  useEffect(() => {
    if (!isClientInvitation) {
      setEntries(INITIAL_ENTRIES);
      return;
    }

    let isMounted = true;
    async function loadClientEntries() {
      try {
        const res = await fetch(`/api/invitations/${encodeURIComponent(cleanSlug)}/rsvps`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          const serverRsvps = Array.isArray(data?.rsvps) ? data.rsvps : [];
          const mapped = serverRsvps
            .filter((r) => r.message && r.message.trim())
            .map((r, idx) => ({
              id: idx + 1,
              name: r.name,
              message: r.message,
              image: r.image || null,
              date: (r.createdAt || new Date().toISOString()).split('T')[0],
            }));
          if (isMounted) setEntries(mapped);
        }
      } catch {
        // Ignore network errors
      }
    }
    loadClientEntries();
    return () => {
      isMounted = false;
    };
  }, [isClientInvitation, cleanSlug]);

  /**
   * Advances the 3D notebook to the next page spread.
   */
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((c) => c + 1);
  };

  /**
   * Returns the 3D notebook to the previous page spread.
   */
  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((c) => c - 1);
  };

  /**
   * Handles local photo file selection, validates image MIME type and size (max 5MB),
   * and creates an in-memory Object URL for preview.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event.
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  /**
   * Handles submission of a new graduation wish/photo entry, validates and trims inputs,
   * prepends the entry to the notebook feed, persists to the client's `slug` if applicable,
   * resets the form, and flips open to the first spread if needed.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedName = formData.name.trim().slice(0, 80);
    const sanitizedMessage = formData.message.trim().slice(0, 500);
    if (!sanitizedName || !sanitizedMessage) return;

    const newEntry = {
      id: Date.now(),
      name: sanitizedName,
      message: sanitizedMessage,
      image: formData.image,
      date: new Date().toISOString().split('T')[0],
    };

    setEntries([newEntry, ...entries]);
    setFormData({ name: '', message: '', image: null });
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Automatically open to the memory feed spread
    if (currentPage < 1) setCurrentPage(1);

    if (isClientInvitation) {
      try {
        await fetch(`/api/invitations/${encodeURIComponent(cleanSlug)}/rsvps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: sanitizedName,
            status: 'attending',
            guests: 0,
            message: sanitizedMessage,
            image: formData.image || null,
          }),
        });
      } catch {
        // Ignore network errors
      }
    }
  };

  // ---------------- SUB-COMPONENTS FOR 3D BOOK PAGES ----------------

  /**
   * Renders decorative corner borders and a graduation cap motif on inner white pages.
   *
   * @returns {JSX.Element} Decorative page frame elements.
   */
  const CornerOrnaments = () => (
    <>
      <div className="absolute top-2 left-2 md:top-4 md:left-4 w-6 h-6 md:w-12 md:h-12 border-t-2 border-l-2 border-[#0F172A] rounded-tl-lg md:rounded-tl-xl opacity-80 pointer-events-none"></div>
      <div className="absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-12 md:h-12 border-t-2 border-r-2 border-[#0F172A] rounded-tr-lg md:rounded-tr-xl opacity-80 pointer-events-none"></div>
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-6 h-6 md:w-12 md:h-12 border-b-2 border-l-2 border-[#0F172A] rounded-bl-lg md:rounded-bl-xl opacity-80 pointer-events-none"></div>
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 md:w-12 md:h-12 border-b-2 border-r-2 border-[#0F172A] rounded-br-lg md:rounded-br-xl opacity-80 pointer-events-none"></div>
      <div className="absolute bottom-3 left-4 md:bottom-6 md:left-6 text-xl md:text-3xl opacity-90 pointer-events-none">
        🎓
      </div>
    </>
  );

  /**
   * Front Hardcover Page: Graduate name, portrait arch, major, and graduation class year.
   *
   * @returns {JSX.Element} The front cover face.
   */
  const CoverFront = () => (
    <div className="w-full h-full bg-[#5B1E2B] rounded-l-md md:rounded-l-lg shadow-[inset_-3px_0_10px_rgba(0,0,0,0.3),_3px_3px_10px_rgba(0,0,0,0.4)] border-r-2 md:border-r-4 border-[#3a131b] flex flex-col items-center justify-center p-2 md:p-8 text-white relative">
      <div className="absolute top-2 left-2 right-2 bottom-2 md:top-4 md:left-4 md:right-4 md:bottom-4 border border-[#d4af37]/40 rounded-sm pointer-events-none"></div>

      <h1
        className={`text-3xl md:text-7xl font-bold mb-4 md:mb-8 text-[#d4af37] text-center ${aref.className} drop-shadow-md leading-tight`}
      >
        {graduateName}
      </h1>

      <div className="w-full max-w-[100px] md:max-w-[200px] aspect-[3/4] relative mb-4 md:mb-8 overflow-hidden rounded-t-full border md:border-2 border-[#d4af37]/50">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
          alt="Graduate"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#5B1E2B]/20 mix-blend-multiply pointer-events-none"></div>
      </div>

      <div className="text-center font-serif tracking-widest uppercase">
        <p className="text-sm md:text-2xl text-[#d4af37] mb-1">{customSubtitle}</p>
        <p className="text-[8px] md:text-xs text-white/70">{customClassYear}</p>
      </div>
    </div>
  );

  /**
   * Inner Front Cover (Right page of Spread 1): Welcome note from the graduate.
   *
   * @returns {JSX.Element} The inner front cover face.
   */
  const CoverBack = () => (
    <div className="w-full h-full bg-white rounded-r-md md:rounded-r-lg shadow-[inset_3px_0_10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-4 md:p-8 relative">
      <CornerOrnaments />
      <div className="text-center w-full max-w-sm relative z-10 px-2">
        <h2 className={`text-xl md:text-4xl text-[#0F172A] mb-2 md:mb-6 ${aref.className}`}>
          مرحباً بكم
        </h2>
        <p className="text-[#475569] text-xs md:text-lg leading-relaxed md:leading-loose">
          {welcomeMessage}
        </p>
        {customData?.venueName && (
          <p className="text-[#5B1E2B] text-[10px] md:text-sm font-bold mt-3">
            📍 {customData.venueName}
          </p>
        )}
      </div>
    </div>
  );

  /**
   * Page 1 Front (Left page of Spread 1): Interactive "أضف تهنئتك" wish & photo submission form.
   *
   * @returns {JSX.Element} The greeting submission form page.
   */
  const Page1Front = () => (
    <div className="w-full h-full bg-white rounded-l-md md:rounded-l-lg shadow-[inset_-2px_0_10px_rgba(0,0,0,0.05)] border-l border-gray-200 p-2 md:p-6 flex flex-col justify-center relative">
      <CornerOrnaments />

      <h3
        className={`text-lg md:text-3xl text-[#0F172A] font-bold mb-2 md:mb-6 text-center ${aref.className} relative z-10`}
      >
        أضف تهنئتك
      </h3>

      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm mx-auto relative z-10 flex flex-col gap-1 md:gap-4 px-2"
      >
        <input
          type="text"
          placeholder="اسمك..."
          required
          maxLength={80}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-50/50 border-b md:border-b-2 border-gray-300 px-2 md:px-4 py-1 md:py-3 text-[10px] md:text-base focus:outline-none focus:border-[#5B1E2B] transition-colors rounded-t-lg"
        />

        <textarea
          placeholder="اكتب رسالة..."
          required
          maxLength={500}
          rows="3"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-gray-50/50 border-b md:border-b-2 border-gray-300 px-2 md:px-4 py-1 md:py-3 text-[10px] md:text-base focus:outline-none focus:border-[#5B1E2B] transition-colors resize-none rounded-t-lg leading-relaxed"
        ></textarea>

        <div className="flex flex-col mt-1 md:mt-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="flex items-center justify-center gap-1 md:gap-2 w-full py-1.5 md:py-3 border md:border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-600 font-bold text-[9px] md:text-sm"
          >
            <Camera size={12} className="md:w-4 md:h-4" />
            {previewImage ? 'تم' : 'أضف صورة'}
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#5B1E2B] text-white py-1.5 md:py-3 mt-1 md:mt-4 rounded-lg font-bold flex items-center justify-center gap-1 md:gap-2 hover:bg-[#3a131b] transition-colors shadow-md text-[10px] md:text-base"
        >
          <Send size={12} className="md:w-4 md:h-4" />
          حفظ
        </button>
      </form>
    </div>
  );

  /**
   * Page 1 Back (Right page of Spread 2): First two entries in the "سجل الذكريات" memory feed.
   *
   * @returns {JSX.Element} The first memory feed page.
   */
  const Page1Back = () => (
    <div className="w-full h-full bg-white rounded-r-md md:rounded-r-lg shadow-[inset_2px_0_10px_rgba(0,0,0,0.05)] border-r border-gray-200 p-4 md:p-8 flex flex-col overflow-y-auto overflow-x-hidden relative">
      <CornerOrnaments />

      <div className="relative z-10 w-full h-full flex flex-col gap-3 md:gap-8 pb-4 md:pb-10 pt-2 md:pt-4 custom-scrollbar">
        <h3
          className={`text-lg md:text-3xl text-[#0F172A] mb-1 md:mb-4 text-center ${aref.className}`}
        >
          سجل الذكريات
        </h3>

        {entries.length === 0 && (
          <p className="text-center text-gray-400 text-[10px] md:text-base my-auto">
            كن أول من يكتب تهنئة في دفتر الذكريات 🎓🤍
          </p>
        )}

        {entries.slice(0, 2).map((entry) => (
          <div key={entry.id} className="border-b border-gray-100 pb-2 md:pb-6">
            <div className="flex items-baseline gap-1 md:gap-3 mb-0.5 md:mb-2">
              <h4 className="font-bold text-[11px] md:text-lg text-[#0F172A]">{entry.name}</h4>
              <span className="text-[8px] md:text-xs text-gray-400">{entry.date}</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-[10px] md:text-base mb-2 md:mb-4">
              {entry.message}
            </p>

            {entry.image && (
              <div className="w-full max-w-[80px] md:max-w-[200px] bg-white p-1 md:p-2 shadow-md border border-gray-100 transform -rotate-2 mx-auto mt-1 md:mt-2">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
            )}
          </div>
        ))}

        {entries.length > 2 && (
          <p className="text-center text-gray-400 text-[9px] md:text-sm mt-auto pb-2">
            اقلب الصفحة للمزيد...
          </p>
        )}
      </div>
    </div>
  );

  /**
   * Page 2 Front (Left page of Spread 2): Additional entries (`entries[2..3]`) in the memory feed.
   *
   * @returns {JSX.Element} The second memory feed page.
   */
  const Page2Front = () => (
    <div className="w-full h-full bg-white rounded-l-md md:rounded-l-lg shadow-[inset_-2px_0_10px_rgba(0,0,0,0.05)] border-l border-gray-200 p-4 md:p-8 flex flex-col overflow-y-auto overflow-x-hidden relative">
      <CornerOrnaments />

      <div className="relative z-10 w-full h-full flex flex-col gap-3 md:gap-8 pb-4 md:pb-10 pt-2 md:pt-4 custom-scrollbar">
        {entries.slice(2, 4).map((entry) => (
          <div key={entry.id} className="border-b border-gray-100 pb-2 md:pb-6">
            <div className="flex items-baseline gap-1 md:gap-3 mb-0.5 md:mb-2">
              <h4 className="font-bold text-[11px] md:text-lg text-[#0F172A]">{entry.name}</h4>
              <span className="text-[8px] md:text-xs text-gray-400">{entry.date}</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-[10px] md:text-base mb-2 md:mb-4">
              {entry.message}
            </p>

            {entry.image && (
              <div className="w-full max-w-[80px] md:max-w-[200px] bg-white p-1 md:p-2 shadow-md border border-gray-100 transform rotate-2 mx-auto mt-1 md:mt-2">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
            )}
          </div>
        ))}

        {entries.length <= 2 && (
          <div className="flex-1 flex items-center justify-center text-gray-300 text-[10px] md:text-lg">
            لا يوجد المزيد
          </div>
        )}
      </div>
    </div>
  );

  /**
   * Back Hardcover Page: Closing "تم بحمد الله" and ZARIA branding.
   *
   * @returns {JSX.Element} The outer back cover face.
   */
  const Page2Back = () => (
    <div className="w-full h-full bg-[#5B1E2B] rounded-r-md md:rounded-r-lg shadow-[inset_5px_0_15px_rgba(0,0,0,0.3)] border-l-2 md:border-l-4 border-[#3a131b] flex flex-col items-center justify-center p-4 md:p-8 text-white relative">
      <div className="absolute top-2 left-2 right-2 bottom-2 md:top-4 md:left-4 md:right-4 md:bottom-4 border border-[#d4af37]/40 rounded-sm pointer-events-none"></div>
      <h1 className={`text-xl md:text-5xl text-[#d4af37] mb-2 md:mb-6 ${aref.className}`}>
        تم بحمد الله
      </h1>
      <div className="w-8 md:w-12 h-[1px] bg-[#d4af37]/50 mb-2 md:mb-6"></div>
      <p className="text-white/60 text-[8px] md:text-sm tracking-widest font-sans">
        ZARIA INTERACTIVE
      </p>
    </div>
  );

  return (
    <div
      className={`w-full min-h-[100svh] bg-[#f0f0f0] flex flex-col items-center justify-center overflow-hidden font-sans ${amiri.className}`}
      dir="rtl"
    >
      {/* Ambient Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fff8e7] via-[#f0f0f0] to-[#e0e0e0] z-0 pointer-events-none"></div>

      {/* 3D Interactive Book Stage */}
      <div className="relative z-10 w-full max-w-5xl h-[350px] sm:h-[450px] md:h-[650px] flex items-center justify-center perspective-[2000px] md:perspective-[2500px]">
        <div
          className="relative w-[95%] max-w-[900px] h-full flex transform-style-3d transition-transform duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)]"
          style={{
            transform:
              currentPage === 0
                ? 'translateX(25%)'
                : currentPage === totalPages
                  ? 'translateX(-25%)'
                  : 'translateX(0)',
          }}
        >
          {/* Leaf 0: Front Cover & Welcome Note */}
          <div
            className="absolute left-0 w-1/2 h-full transform-style-3d origin-right transition-transform duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] cursor-pointer"
            style={{
              transform: currentPage > 0 ? 'rotateY(180deg)' : 'rotateY(0deg)',
              zIndex: currentPage > 0 ? 1 : 10,
            }}
            onClick={() => {
              if (currentPage === 0) nextPage();
              else if (currentPage === 1) prevPage();
            }}
          >
            <div className="absolute inset-0 backface-hidden">
              <CoverFront />
            </div>
            <div
              className="absolute inset-0 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <CoverBack />
            </div>
          </div>

          {/* Leaf 1: Greeting Form & First Memory Feed Page */}
          <div
            className="absolute left-0 w-1/2 h-full transform-style-3d origin-right transition-transform duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] cursor-pointer"
            style={{
              transform: currentPage > 1 ? 'rotateY(180deg)' : 'rotateY(0deg)',
              zIndex: currentPage > 1 ? 2 : 9,
            }}
            onClick={() => {
              if (currentPage === 1) nextPage();
              else if (currentPage === 2) prevPage();
            }}
          >
            <div className="absolute inset-0 backface-hidden">
              <Page1Front />
            </div>
            <div
              className="absolute inset-0 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <Page1Back />
            </div>
          </div>

          {/* Leaf 2: Second Memory Feed Page & Back Hardcover */}
          <div
            className="absolute left-0 w-1/2 h-full transform-style-3d origin-right transition-transform duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] cursor-pointer"
            style={{
              transform: currentPage > 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
              zIndex: currentPage > 2 ? 3 : 8,
            }}
            onClick={() => {
              if (currentPage === 2) nextPage();
              else if (currentPage === 3) prevPage();
            }}
          >
            <div className="absolute inset-0 backface-hidden">
              <Page2Front />
            </div>
            <div
              className="absolute inset-0 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <Page2Back />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page-Turn Navigation Buttons */}
      <div className="fixed bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-4 md:gap-6 z-50 pointer-events-auto">
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white text-[#5B1E2B] shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all border border-gray-200"
        >
          <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white text-[#5B1E2B] shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      </div>

      {/* Background Audio Stream Player */}
      <BackgroundMusic youtubeUrl={youtubeUrl} autoPlay={true} />

      {/* Scoped 3D Perspective & Custom Scrollbar Utilities */}
      <style>{`
        .perspective-[2000px] { perspective: 2000px; }
        .perspective-[2500px] { perspective: 2500px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  );
}
