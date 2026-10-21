/**
 * @file src/app/[slug]/page.jsx
 * @description Dynamic server route page for rendering customized client invitations
 * stored in `src/data/invitations.json`. Displays event details, optional love story,
 * countdown placeholder, and RSVP section with GSAP scroll-reveal animations.
 */

// 1. React and Next.js core modules
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 2. Third-party libraries
import { ArrowRight } from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import GSAPAnimations from '@/components/GSAPAnimations';
import invitations from '@/data/invitations.json';

/**
 * InvitationPage Async Server Component
 *
 * @param {Object} props - Next.js dynamic route props.
 * @param {Promise<{ slug: string }>} props.params - Route parameters promise resolving to the invitation `slug`.
 * @returns {Promise<JSX.Element>} The rendered event invitation page or a 404 NotFound response.
 */
export default async function InvitationPage({ params }) {
  const { slug } = await params;

  /** @type {import('@/types/zaria').InvitationRecord | undefined} */
  const event = invitations.find((inv) => inv.id === slug);

  // Trigger Next.js 404 page if the invitation slug does not exist in the dataset
  if (!event) {
    notFound();
  }

  // Format the event date and time into localized Arabic (Saudi/Levant) readable strings
  const eventDate = new Date(event.eventDate);
  const formattedDate = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(eventDate);

  const formattedTime = new Intl.DateTimeFormat('ar-SA', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(eventDate);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-[#d4af37] selection:text-black overflow-hidden"
    >
      {/* Initialize GSAP ScrollTrigger reveal animations for elements with `.gs-reveal` */}
      <GSAPAnimations />

      {/* Floating Back Navigation Button */}
      <Link
        href="/templates"
        aria-label="رجوع"
        className="fixed top-5 right-5 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/75 hover:bg-black/90 text-white backdrop-blur-md border border-[#C49A6C]/50 shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:border-[#C49A6C] group"
      >
        <ArrowRight className="w-4 h-4 text-[#C49A6C] transition-transform duration-300 group-hover:translate-x-1" />
        <span className="text-sm font-medium tracking-wide">رجوع</span>
      </Link>

      {/* Hero Cover Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Cover Image */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.coverImage})` }}
        />
        {/* Vertical Vignette Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

        <div className="relative z-10 text-center px-4 gs-reveal">
          <p className="text-[#d4af37] text-xl tracking-widest mb-6 font-light">
            نتشرف بدعوتكم لحضور حفل زفاف
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-6 tracking-wide drop-shadow-lg">
            {event.groomName} <span className="text-[#d4af37] mx-2">&</span> {event.brideName}
          </h1>
          <p className="text-xl text-gray-300 tracking-wider">{formattedDate}</p>
        </div>
      </section>

      {/* Event Time, Venue, and Dress Code Details Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center gs-reveal">
        <h2 className="text-4xl font-serif text-[#d4af37] mb-12">تفاصيل الحفل</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#141414] p-8 rounded-2xl border border-[#2a2a2a] gs-reveal">
            <h3 className="text-2xl text-white mb-4">الزمان</h3>
            <p className="text-lg text-gray-400 mb-2">{formattedDate}</p>
            <p className="text-lg text-gray-400">الساعة {formattedTime}</p>
          </div>

          <div className="bg-[#141414] p-8 rounded-2xl border border-[#2a2a2a] gs-reveal">
            <h3 className="text-2xl text-white mb-4">المكان</h3>
            <p className="text-lg text-gray-400 mb-4">{event.location.venueName}</p>
            <a
              href={event.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#d4af37] text-[#d4af37] px-6 py-2 rounded-full hover:bg-[#d4af37] hover:text-black transition-all duration-300"
            >
              عرض الموقع على الخريطة
            </a>
          </div>
        </div>

        {event.dressCode && (
          <div className="mt-12 gs-reveal">
            <h3 className="text-xl text-[#d4af37] mb-2">قواعد اللباس</h3>
            <p className="text-gray-400">{event.dressCode}</p>
          </div>
        )}
      </section>

      {/* Optional Couple Story Section */}
      {event.features.showStory && (
        <section className="py-24 bg-[#0d0d0d] relative gs-reveal">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-serif text-[#d4af37] mb-8">قصتنا</h2>
            <p className="text-xl leading-relaxed text-gray-300 font-light">{event.story}</p>
          </div>
        </section>
      )}

      {/* Optional Countdown Timer Display Section */}
      {event.features.showCountdown && (
        <section className="py-20 text-center border-t border-[#1a1a1a] gs-reveal">
          <h3 className="text-2xl text-white mb-8">نعد الأيام للقائكم</h3>
          <div className="flex justify-center gap-4 text-[#d4af37]">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif mb-2">--</span>
              <span className="text-sm text-gray-500 uppercase tracking-widest">يوم</span>
            </div>
            <span className="text-4xl md:text-5xl font-serif">:</span>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif mb-2">--</span>
              <span className="text-sm text-gray-500 uppercase tracking-widest">ساعة</span>
            </div>
          </div>
        </section>
      )}

      {/* Optional RSVP Confirmation Form Section ("تأكيد الحضور") */}
      {event.features.enableRSVP && (
        <section className="py-32 px-6 max-w-xl mx-auto text-center gs-reveal">
          <h2 className="text-4xl font-serif text-[#d4af37] mb-6">تأكيد الحضور</h2>
          <p className="text-gray-400 mb-10">نرجو منكم تأكيد حضوركم قبل موعد الحفل بأسبوعين</p>

          <form className="space-y-6 text-right">
            <div>
              <label className="block text-sm text-gray-400 mb-2">الاسم الكريم</label>
              <input
                type="text"
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder="الاسم"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">عدد المرافقين</label>
              <select className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors">
                <option value="0">بدون مرافقين</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <button
              type="button"
              className="w-full bg-[#d4af37] text-black font-bold text-lg py-4 rounded-xl hover:bg-[#eadd87] transition-colors mt-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              تأكيد الحضور
            </button>
          </form>
        </section>
      )}

      {/* Invitation Footer Branding */}
      <footer className="py-10 text-center border-t border-[#1a1a1a]">
        <p className="text-gray-600 text-sm">
          Powered by <span className="text-[#d4af37]">ZARIA</span> Concierge
        </p>
      </footer>
    </div>
  );
}
