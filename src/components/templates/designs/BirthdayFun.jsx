'use client';

/**
 * @file src/components/templates/designs/BirthdayFun.jsx
 * @description Interactive cinematic birthday celebration invitation template ("ميلاد سارة").
 * Styled in vibrant rose-pink (`#EC4899` / `#FDF2F8`) with a full-screen hero cover,
 * live countdown timer, event timeline, embedded Google Map, calendar integration,
 * RSVP form ("تأكيد الحضور") with guest counter, Wishes/Greetings wall ("كلمات المهنئين"),
 * and VIP QR entry pass modal.
 */

// 1. React and Next.js core modules
import { useEffect, useState } from 'react';
import { Baloo_Bhaijaan_2, Cairo } from 'next/font/google';
import Image from 'next/image';

// 2. Third-party libraries
import { MapPin, Minus, Phone, Plus } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Confetti from 'react-confetti';

// 3. Internal components, hooks, and utility functions
import BackgroundMusic from '../../BackgroundMusic';

// Configure playful Arabic display and body typography
const aref = Baloo_Bhaijaan_2({ subsets: ['arabic'], weight: ['400', '700', '800'] });
const amiri = Cairo({ subsets: ['arabic'], weight: ['400', '700', '900'] });

// Birthday Rose-Pink Theme Palette Constants
const ZARIA_GOLD = '#EC4899';
const ZARIA_CREAM_DARK = '#FCE7F3';

/**
 * Converts a numeric or string value into its string representation for display.
 *
 * @param {number | string} num - Number or padded numeric string.
 * @returns {string} Formatted string representation.
 */
const toArabic = (num) => {
  return String(num);
};

/**
 * Decorative star corner ornament rendered at the four corners of the invitation frame.
 *
 * @param {import('@/types/zaria').DecorativeIconProps} props - Icon styling props.
 * @returns {JSX.Element} The SVG star corner ornament.
 */
const ElegantCorner = ({ className = 'w-4 h-4', color = ZARIA_GOLD }) => (
  <svg viewBox="0 0 24 24" fill={color} stroke="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

/**
 * Decorative 4-point star/flower bullet icon used in the invitation notes list.
 *
 * @param {import('@/types/zaria').DecorativeIconProps} props - Icon styling props.
 * @returns {JSX.Element} The SVG bullet icon.
 */
const FlowerBullet = ({ className = 'w-3 h-3', color = ZARIA_GOLD }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5Z" />
  </svg>
);

/**
 * BirthdayFun Component ("ميلاد سارة")
 *
 * State Variables:
 * - `timeLeft` {import('@/types/zaria').CountdownTimeLeft}: Remaining days, hours, minutes, and seconds until the celebration.
 * - `rsvpData` {import('@/types/zaria').TemplateRSVPState}: Form state for guest name, companion count, attendance status, and greeting message.
 * - `showConfetti` {boolean}: Triggers celebratory confetti burst upon confirming attendance.
 * - `showQRModal` {boolean}: Controls visibility of the post-submission VIP QR Code modal.
 * - `windowSize` {import('@/types/zaria').ViewportSize}: Current viewport width and height for sizing the Confetti canvas.
 * - `guestbookMessages` {import('@/types/zaria').GuestbookEntry[]}: List of congratulatory messages displayed in "كلمات المهنئين".
 *
 * @returns {JSX.Element} The complete birthday celebration digital invitation experience.
 */
export default function BirthdayFun() {
  /**
   * Computes the remaining time until the celebration date (`2026-11-29T21:00:00`).
   *
   * @returns {import('@/types/zaria').CountdownTimeLeft} Remaining time breakdown.
   */
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-11-29T21:00:00') - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  // Real-time countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP form state ("تأكيد الحضور")
  const [rsvpData, setRsvpData] = useState({
    name: '',
    guests: 0,
    status: 'attending',
    message: '',
  });

  // UI feedback states (confetti & QR pass modal)
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Wishes & Greetings state ("كلمات المهنئين")
  const [guestbookMessages, setGuestbookMessages] = useState([
    {
      name: 'أم محمد',
      message: 'ألف مبروك 🤍 بالرفاه والبنين إن شاء الله، فرحتكم فرحتنا',
      avatarColor: 'bg-[#F472B6]',
      avatarLetter: 'أ',
    },
    {
      name: 'سارة',
      message: 'عقبال ما نفرح بيكم بأحلى المناسبات، دعوة بغاية الذوق 🤩',
      avatarColor: 'bg-[#E879F9]',
      avatarLetter: 'س',
    },
    {
      name: 'حيدر',
      message: 'مبارك الزواج، الله يجعل أيامكم كلها أفراح',
      avatarColor: 'bg-[#A78BFA]',
      avatarLetter: 'ح',
    },
    {
      name: 'نور الهدى',
      message: 'بيت جديد عامر بالمحبة إن شاء الله، ألف مبروك',
      avatarColor: 'bg-[#FBBF24]',
      avatarLetter: 'ن',
    },
    {
      name: 'أبو علي',
      message: 'الله يبارك لكما ويبارك عليكما ويجمع بينكما في خير',
      avatarColor: 'bg-[#34D399]',
      avatarLetter: 'أ',
    },
  ]);

  /**
   * Handles submission of the RSVP form ("تأكيد الحضور"):
   * 1. Prepends any congratulatory wish to the "كلمات المهنئين" guestbook list.
   * 2. Triggers an 8-second confetti celebration when attending.
   * 3. Opens the VIP QR Code entry pass modal.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   */
  const handleRSVPSubmit = (e) => {
    e.preventDefault();

    const sanitizedName = rsvpData.name.trim().slice(0, 80);
    const sanitizedMessage = rsvpData.message.trim().slice(0, 500);
    const boundedGuests = Math.min(20, Math.max(0, Number(rsvpData.guests) || 0));

    if (!sanitizedName) return;

    // 1. Prepend new greeting to "كلمات المهنئين" if message is non-empty
    if (sanitizedMessage) {
      const colors = [
        'bg-[#F472B6]',
        'bg-[#E879F9]',
        'bg-[#A78BFA]',
        'bg-[#FBBF24]',
        'bg-[#34D399]',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const firstLetter = sanitizedName.charAt(0) || 'ز';

      setGuestbookMessages((prev) => [
        {
          name: sanitizedName || 'ضيف',
          message: sanitizedMessage,
          avatarColor: randomColor,
          avatarLetter: firstLetter,
        },
        ...prev,
      ]);
    }

    // Store sanitized values in state while clearing the message textarea
    setRsvpData((prev) => ({
      ...prev,
      name: sanitizedName,
      guests: boundedGuests,
      message: '',
    }));

    // 2. Launch celebratory confetti if attending and display the QR modal
    if (rsvpData.status === 'attending') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
    setShowQRModal(true);
  };

  // Initialize viewport size and 1-second countdown interval on mount
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pre-encoded Google Calendar event template URL
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('حفلة عيد ميلاد سارة')}&dates=20261129T180000Z/20261129T210000Z&details=${encodeURIComponent('نتشرف بحضوركم حفلة الميلاد')}&location=${encodeURIComponent('فندق فور سيزونز عمان')}`;

  /**
   * Generates and downloads an `.ics` iCalendar file for Apple Calendar / Outlook.
   */
  const handleAppleCalendar = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Zaria//Wedding//AR\nBEGIN:VEVENT\nSUMMARY:حفلة عيد ميلاد سارة\nDTSTART:20261129T180000Z\nDTEND:20261129T210000Z\nLOCATION:فندق فور سيزونز عمان\nDESCRIPTION:نتشرف بحضوركم حفلة الميلاد\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding_invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full min-h-screen bg-[${ZARIA_CREAM_DARK}] overflow-x-hidden ${amiri.className}`}
      dir="rtl"
    >
      {/* HERO INTRO SECTION */}
      <section className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black text-[#fdf8f5]">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1530103862676-de8892bf30b5?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark Contrast Overlays */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full">
          <p className="text-sm md:text-base mb-6 font-['Noto_Naskh_Arabic'] opacity-90 drop-shadow-md">
            بسم الله الرحمن الرحيم
          </p>

          <div className="flex items-center gap-2 mb-8 opacity-70">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#EC4899]" />
            <b className="text-[#EC4899] text-xs">♦</b>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#EC4899]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-4">
            سارة
          </h1>

          <div className="text-2xl md:text-3xl font-light text-[#EC4899] mb-4 drop-shadow-md">
            &
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-12"></h1>

          <p className="text-lg md:text-xl font-black opacity-90 mb-8 max-w-sm mx-auto drop-shadow-md text-[#fdf8f5]">
            تتشرف بدعوتكم لمشاركتها فرحة الميلاد
          </p>

          <p className="text-sm md:text-base opacity-80 mb-4 tracking-wider font-bold">—</p>

          <p className="text-lg md:text-xl font-black text-[#EC4899] drop-shadow-md">
            عام جديد من الفرح
          </p>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 z-20 flex flex-col items-center gap-2 text-white/80">
          <span className="text-[11px] font-medium tracking-widest bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
            مرّر للأسفل
          </span>
          <svg
            className="w-5 h-5 drop-shadow-md"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* MAIN INVITATION CONTENT CONTAINER */}
      <div className="mx-auto max-w-md w-full bg-[#FCE7F3] relative text-[#831843] pb-24 overflow-x-hidden pt-12 px-4 shadow-2xl">
        {/* THE MAIN INVITATION FRAME */}
        <div className="relative w-full bg-[#FDF2F8] flex flex-col items-center pt-10 pb-12 px-2 shadow-sm border border-[#EC4899]/30">
          {/* Decorative Frame Corners */}
          <div className="absolute -top-[1px] -left-[1px] bg-[#FDF2F8] p-1">
            <ElegantCorner className="w-5 h-5 text-[#EC4899]" />
          </div>
          <div className="absolute -top-[1px] -right-[1px] bg-[#FDF2F8] p-1">
            <ElegantCorner className="w-5 h-5 text-[#EC4899] rotate-90" />
          </div>
          <div className="absolute -bottom-[1px] -left-[1px] bg-[#FDF2F8] p-1">
            <ElegantCorner className="w-5 h-5 text-[#EC4899] -rotate-90" />
          </div>
          <div className="absolute -bottom-[1px] -right-[1px] bg-[#FDF2F8] p-1">
            <ElegantCorner className="w-5 h-5 text-[#EC4899] rotate-180" />
          </div>

          {/* Framed Content Wrapper */}
          <div className="relative z-20 flex flex-col items-center w-full">
            {/* Opening Prayer / Blessing */}
            <p className="text-[#831843] text-[18px] md:text-xl mb-10 leading-loose text-center px-4 font-medium">
              اللّهُمَّ بارِكْ لهُما وبارِكْ عليهِما واجمَعْ بينهُما في خَيْرٍ
            </p>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
            </div>

            {/* Invitation Heading & Copy */}
            <h3 className={`text-4xl text-[#EC4899] mb-8 font-bold ${aref.className}`}>
              بطاقة دعوة
            </h3>

            <p className="text-[14px] leading-[2.2] mb-12 text-[#831843] text-center px-4 max-w-[300px]">
              بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل
              زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.
            </p>

            {/* Hosting Families & Celebrant Info */}
            <div className="flex justify-between items-start text-[14px] font-bold w-full px-2 mb-12 mt-4">
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-[#BE185D] text-[11px] mb-3">والد العريس</p>
                <p className="leading-relaxed text-[#831843] mb-5">
                  الدكتور سهيل أبو سارة
                  <br />
                  وعائلته الكريمة
                </p>
                <p
                  className={`text-[22px] text-[#EC4899] font-bold leading-tight ${aref.className}`}
                >
                  الأميرة
                  <br />
                  سارة
                </p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#EC4899] mt-7 mx-2 opacity-60"></div>
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-[#BE185D] text-[11px] mb-3">والد العروس</p>
                <p className="leading-relaxed text-[#831843] mb-5">
                  المهندس علي أبو نضال
                  <br />
                  وعائلته الكريمة
                </p>
                <p
                  className={`text-[22px] text-[#EC4899] font-bold leading-tight ${aref.className}`}
                ></p>
              </div>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
            </div>

            {/* Live Countdown Timer Section */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-3xl text-[#EC4899] mb-8 font-bold ${aref.className}`}>
                يبدأ الاحتفال بعد
              </h3>
              <div className="flex justify-center gap-3 mb-10 w-full px-4">
                {[
                  { label: 'يوم', value: timeLeft.days },
                  { label: 'ساعة', value: timeLeft.hours },
                  { label: 'دقيقة', value: timeLeft.minutes },
                  { label: 'ثانية', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-[65px] h-[75px] bg-[#FDF2F8] border border-[#EC4899]/30 rounded-[2rem] flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="text-2xl font-bold font-sans text-[#EC4899] mb-1">
                      {toArabic(item.value.toString().padStart(2, '0'))}
                    </span>
                    <span className="text-[11px] font-bold text-[#BE185D]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
            </div>

            {/* Celebration Program Timeline */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#EC4899] mb-10 font-bold ${aref.className}`}>
                برنامج الحفل
              </h3>
              <div className="w-full flex flex-col px-4 max-w-sm">
                {[
                  {
                    time: '9:00 – 9:20',
                    event: 'استقبال الضيوف',
                    desc: 'استقبال وترحيب بالضيوف مع موسيقى هادئة وضيافة خفيفة.',
                  },
                  {
                    time: '9:20 – 9:35',
                    event: 'دخول العروسين 🤍',
                    desc: 'دخول العروسين وسط أجواء احتفالية وموسيقى خاصة.',
                  },
                  {
                    time: '9:35 – 9:50',
                    event: 'الرقصة الأولى',
                    desc: 'لحظة رومانسية خاصة للعروسين.',
                  },
                  {
                    time: '9:50 – 10:10',
                    event: 'فرحة الأهل',
                    desc: 'رقص واحتفال مع الأهل والمقرّبين.',
                  },
                  {
                    time: '10:10 – 10:40',
                    event: 'أجواء الحفل 💃🏻🕺🏻',
                    desc: 'موسيقى ورقص واحتفال مع جميع الحضور.',
                  },
                  {
                    time: '10:40 – 10:50',
                    event: 'ضيافة ومشروبات ☕️',
                    desc: 'تقديم الضيافة والمشروبات للضيوف.',
                  },
                  {
                    time: '10:50 – 11:00',
                    event: 'الختام 🤍',
                    desc: 'آخر لحظات الاحتفال، صور جماعية، وتوديع الضيوف.',
                  },
                ].map((prog, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-5 border-b border-dashed border-[#EC4899]/30"
                  >
                    <div className="flex-1 text-right">
                      <span className="text-[#831843] text-[15px] font-bold block">
                        {prog.event}
                      </span>
                      <span className="text-[#BE185D] text-[11px] block mt-1 leading-relaxed pl-2">
                        {prog.desc}
                      </span>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#EC4899] border-[2px] border-[#FDF2F8] mx-3 shrink-0 shadow-[0_0_0_1px_#EC4899]"></div>
                    <span
                      className="text-[#BE185D] text-[12px] font-bold shrink-0 min-w-[75px] text-left font-sans"
                      dir="ltr"
                    >
                      {prog.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-14"></div>

            {/* Venue Location & Embedded Google Map */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#EC4899] mb-8 font-bold ${aref.className}`}>
                الموقع
              </h3>
              <div className="w-full max-w-[300px] h-48 bg-[#FCE7F3] rounded-[2rem] mb-6 border border-[#EC4899]/30 shadow-sm relative overflow-hidden group">
                <iframe
                  title="موقع الحفل - فندق فور سيزونز عمان"
                  src="https://maps.google.com/maps?q=Four%20Seasons%20Hotel%20Amman&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فتح في خرائط جوجل"
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-105 transition-all"
                >
                  <MapPin size={18} className="text-[#EC4899]" />
                </a>
              </div>
              <div className="text-center font-bold text-[14px] leading-relaxed mb-8 text-[#831843]">
                <p className="mb-3">يوم الأحد، 29 تشرين الثاني 2026</p>
                <p className="text-[#BE185D] mb-6 text-[12px]">الساعة التاسعة مساءً</p>
                <p className={`text-[#EC4899] mb-3 font-normal text-2xl ${aref.className}`}>
                  فندق فور سيزونز
                </p>
                <p className="text-[#BE185D] text-[13px]">عمان — الأردن</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EC4899] text-white px-8 py-2.5 rounded-full text-[13px] font-bold shadow-md hover:bg-[#A88461] transition-all inline-block mb-4"
              >
                الخريطة
              </a>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
            </div>

            {/* Event Notes */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#EC4899] mb-10 font-bold ${aref.className}`}>
                ملاحظات
              </h3>
              <ul className="text-[14px] font-bold flex flex-col gap-6 text-right w-full px-6 text-[#831843]">
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#EC4899] opacity-70" />
                  <span>يُرجى الحضور قبل الموعد بنصف ساعة</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#EC4899] opacity-70" />
                  <span>نتشرّف بحضوركم بأبهى حلّة</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#EC4899] opacity-70" />
                  <span>الدعوة تشمل حاملها والعائلة الكريمة</span>
                </li>
              </ul>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
              <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
              <div className="h-[1px] flex-1 bg-[#EC4899]"></div>
            </div>

            {/* Frame Footer Contact Info */}
            <div className="w-full flex flex-col items-center">
              <div className="text-center w-full font-bold">
                <h3 className={`text-3xl mb-5 text-[#831843] ${aref.className}`}>
                  حضوركم يزيّن فرحتنا
                </h3>
                <p className="text-[#EC4899] font-sans text-[14px] mb-12 tracking-wider">
                  #ميلاد_سارة
                </p>

                <p className="text-[12px] text-[#BE185D] mb-4">للاستفسار والتأكيد</p>
                <div className="flex justify-center mb-10">
                  <a
                    href="https://wa.me/9647700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#EC4899]/50 rounded-full px-6 py-2 text-[13px] text-[#831843] bg-transparent flex items-center gap-2 hover:bg-[#FCE7F3] transition-colors"
                  >
                    أبو سارة <Phone size={14} className="text-[#EC4899]" />
                  </a>
                </div>

                <p className="text-[13px] text-[#831843] mb-8">عائلة العمري & عائلة الخطيب</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Section ("بداية الحكاية") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <h3
            className={`text-4xl text-[#EC4899] font-bold ${aref.className} flex flex-col items-center gap-3`}
          >
            بداية الحكاية
          </h3>
        </div>
        <div className="px-6 mb-16 w-full">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i, idx) => (
              <div
                key={i}
                className={`relative rounded-[2rem] overflow-hidden shadow-sm border border-[#EC4899]/20 ${
                  idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'
                }`}
              >
                <Image
                  src={`/gallery-${i}.jpg`}
                  alt={`Memory ${i}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save the Date Calendar Card Section ("احفظ الموعد") */}
        <div className="w-full flex flex-col items-center mt-12 mb-16 px-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl">🤍</span>
            <h3 className={`text-2xl text-[#EC4899] font-bold ${aref.className}`}>احفظ الموعد</h3>
          </div>

          <div className="bg-[#FDF2F8] rounded-[3rem] shadow-[0_10px_30px_rgba(166,124,82,0.15)] w-full max-w-sm overflow-hidden border border-[#EC4899]/20 relative">
            <div className="absolute top-0 left-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>
            <div className="absolute top-0 right-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>

            <div className="bg-[#EC4899] text-white py-3 text-center font-bold text-lg pt-4">
              تشرين الثاني 2026
            </div>

            <div className="p-6 flex flex-col items-center relative">
              <p className="text-[#EC4899] font-bold text-lg mb-1">الأحد</p>
              <p className="text-8xl text-[#EC4899] font-light mb-2 leading-none">29</p>
              <p className="text-[#831843] font-bold text-sm">الساعة التاسعة مساءً</p>
            </div>

            <div className="border-t border-dashed border-[#EC4899]/30 px-6 py-5 bg-white/50">
              <p className="text-center text-[#BE185D] text-xs font-bold mb-4">
                أضف الموعد إلى تقويم هاتفك بضغطة 📅
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border border-[#EC4899] text-[#EC4899] rounded-full py-2 text-xs font-bold hover:bg-[#EC4899] hover:text-white transition-colors block"
                >
                  تقويم جوجل
                </a>
                <button
                  onClick={handleAppleCalendar}
                  className="flex-1 border border-[#EC4899] text-[#EC4899] rounded-full py-2 text-xs font-bold hover:bg-[#EC4899] hover:text-white transition-colors"
                >
                  تقويم آيفون
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form Section ("تأكيد الحضور") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <div className="text-center w-full relative z-10 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-2 opacity-80">
              <div className="w-12 h-[1px] bg-[#EC4899]"></div>
              <span className="text-xl">🤍</span>
              <div className="w-12 h-[1px] bg-[#EC4899]"></div>
            </div>
            <h3 className={`text-[42px] text-[#831843] font-bold ${aref.className} mb-1 mt-2`}>
              تأكيد الحضور
            </h3>
            <p className="text-center text-[#BE185D] text-[15px] mb-2 font-bold">
              يسعدنا تأكيد حضوركم
            </p>
          </div>
        </div>

        <div className="w-full px-6 mb-24">
          <form
            onSubmit={handleRSVPSubmit}
            className="bg-[#FDF2F8] border border-[#EC4899]/40 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(196,154,108,0.1)] relative overflow-hidden"
          >
            {/* Guest Name Input */}
            <div className="mb-5 mt-2">
              <label className="block text-[#BE185D] mb-2 text-xs font-bold">الاسم الكريم</label>
              <input
                type="text"
                required
                maxLength={80}
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                placeholder="أدخل اسمك هنا..."
                className="w-full border-b border-[#EC4899]/30 bg-transparent px-2 py-2 text-[#831843] text-sm focus:outline-none focus:border-[#EC4899] transition-colors placeholder-[#BE185D]/40"
              />
            </div>

            {/* Attendance Status Radio Buttons (نعم / لا / ربما) */}
            <div className="mb-6">
              <label className="block text-[#831843] mb-3 text-sm font-bold text-right w-full">
                هل ستحضر؟
              </label>
              <div className="flex gap-2">
                <label
                  className={`flex-1 cursor-pointer rounded-[2rem] border ${
                    rsvpData.status === 'attending'
                      ? 'bg-[#EC4899] border-[#EC4899] text-white'
                      : 'border-[#EC4899]/30 bg-white text-[#831843] hover:border-[#EC4899]/60'
                  } py-2.5 text-center transition-colors text-[13px] font-bold`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="attending"
                    checked={rsvpData.status === 'attending'}
                    onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })}
                    className="hidden"
                  />
                  نعم
                </label>
                <label
                  className={`flex-1 cursor-pointer rounded-[2rem] border ${
                    rsvpData.status === 'not_attending'
                      ? 'bg-[#EC4899] border-[#EC4899] text-white'
                      : 'border-[#EC4899]/30 bg-white text-[#831843] hover:border-[#EC4899]/60'
                  } py-2.5 text-center transition-colors text-[13px] font-bold`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="not_attending"
                    checked={rsvpData.status === 'not_attending'}
                    onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })}
                    className="hidden"
                  />
                  لا
                </label>
                <label
                  className={`flex-1 cursor-pointer rounded-[2rem] border ${
                    rsvpData.status === 'maybe'
                      ? 'bg-[#EC4899] border-[#EC4899] text-white'
                      : 'border-[#EC4899]/30 bg-white text-[#831843] hover:border-[#EC4899]/60'
                  } py-2.5 text-center transition-colors text-[13px] font-bold`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="maybe"
                    checked={rsvpData.status === 'maybe'}
                    onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })}
                    className="hidden"
                  />
                  ربما
                </label>
              </div>
            </div>

            {/* Companion Counter Increment/Decrement Controls (Hidden if not attending) */}
            {rsvpData.status !== 'not_attending' && (
              <div className="mb-8">
                <label className="block text-[#831843] mb-4 text-xs font-bold text-center w-full">
                  عدد المرافقين (عدا حضورك - 0 إن كنت وحدك)
                </label>
                <div className="flex items-center justify-center gap-6 w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setRsvpData({
                        ...rsvpData,
                        guests: Math.max(0, (Number(rsvpData.guests) || 0) - 1),
                      })
                    }
                    className="w-10 h-10 rounded-full border border-[#EC4899]/40 bg-white flex items-center justify-center text-[#BE185D] hover:bg-[#FCE7F3] hover:text-[#EC4899] transition-colors"
                  >
                    <Minus size={16} strokeWidth={1.5} />
                  </button>
                  <span className="text-[#831843] font-bold text-lg w-4 text-center">
                    {rsvpData.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setRsvpData({
                        ...rsvpData,
                        guests: Math.min(20, (Number(rsvpData.guests) || 0) + 1),
                      })
                    }
                    className="w-10 h-10 rounded-full border border-[#EC4899]/40 bg-white flex items-center justify-center text-[#BE185D] hover:bg-[#FCE7F3] hover:text-[#EC4899] transition-colors"
                  >
                    <Plus size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Congratulatory Wish Input Field */}
            <div className="mb-8">
              <label className="block text-[#831843] mb-2 text-xs font-bold flex items-center gap-2">
                كلمة للعروسين 💌
              </label>
              <textarea
                maxLength={500}
                value={rsvpData.message}
                onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                placeholder="اكتب تهنئتك للعروسين..."
                rows="3"
                className="w-full border border-[#EC4899]/30 rounded-[2rem] px-4 py-3 bg-white text-[#831843] text-sm focus:outline-none focus:border-[#EC4899] transition-colors resize-none placeholder-[#BE185D]/50"
              ></textarea>
            </div>

            {/* Submit RSVP Confirmation Button */}
            <button
              type="submit"
              className="w-full bg-[#EC4899] text-white rounded-[3rem] py-4 mt-2 font-bold text-[15px] shadow-md hover:bg-[#DB2777] transition-colors flex items-center justify-center gap-2"
            >
              إرسال التأكيد
            </button>
          </form>
        </div>

        {/* Wishes / Greetings Wall Section ("كلمات المهنئين") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-[#EC4899]/30 rounded-full px-8 py-3 shadow-sm flex items-center justify-center gap-3">
            <span className="text-[20px] drop-shadow-sm">🌹</span>
            <h3 className={`text-2xl text-[#831843] font-bold ${aref.className}`}>
              كلمات المهنئين
            </h3>
          </div>
        </div>

        <div className="w-full px-6 mb-24 flex flex-col gap-4">
          {guestbookMessages.map((msg, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm border border-[#EC4899]/20 rounded-[3rem] p-5 shadow-[0_4px_20px_rgba(196,154,108,0.05)] flex items-center gap-4 relative overflow-hidden"
            >
              <div
                className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold ${msg.avatarColor} shadow-inner`}
              >
                {msg.avatarLetter}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-[#831843] font-bold text-lg mb-1">{msg.name}</h4>
                <p className="text-[#BE185D] text-[13px] leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Audio Stream Player (Happy Birthday - Sana Helwa Ya Gamil) */}
      <BackgroundMusic youtubeUrl="https://www.youtube.com/watch?v=UHP2ECjbTWM" autoPlay={true} />

      {/* Celebratory Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            colors={['#EC4899', '#EC4899', '#FDF2F8', '#F472B6', '#BE185D']}
          />
        </div>
      )}

      {/* VIP QR Code Entry Pass Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-[#FDF2F8] border-2 border-[#EC4899] rounded-[3rem] p-8 max-w-sm w-full flex flex-col items-center shadow-2xl relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-[#BE185D] hover:text-[#831843] transition-colors bg-[#FCE7F3] p-2 rounded-full"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h3 className={`text-4xl text-[#EC4899] font-bold mb-4 ${aref.className} mt-2`}>
              شكراً لتأكيد حضورك!
            </h3>

            {rsvpData.status === 'attending' ? (
              <>
                <p className="text-[#831843] text-center mb-6 text-[14px] leading-relaxed">
                  نحن متحمسون جداً لرؤيتك في حفل زفافنا. يُرجى الاحتفاظ ببطاقة الدخول الذكية (QR
                  Code) وإبرازها لموظفي الاستقبال.
                </p>

                <div className="bg-white p-2 rounded-[2rem] shadow-[0_5px_15px_rgba(196,154,108,0.2)] border border-[#EC4899]/20 mb-6 flex justify-center items-center">
                  <QRCodeCanvas
                    value={`BEGIN:VCARD\nVERSION:3.0\nFN:${rsvpData.name || 'ضيف'}\nORG:بطاقة دعوة - ميلاد سارة\nNOTE:عدد المرافقين: ${rsvpData.guests}\nEND:VCARD`}
                    size={180}
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <p className="text-[#BE185D] font-bold text-xl mb-1">{rsvpData.name || 'ضيف'}</p>
                <p className="text-[#EC4899] text-sm font-bold">المرافقين: {rsvpData.guests}</p>
              </>
            ) : (
              <p className="text-[#831843] text-center mb-6 text-[15px] leading-relaxed mt-4">
                {rsvpData.status === 'not_attending'
                  ? 'نشكرك على ردك اللطيف، ونتمنى لك دوام الصحة والسعادة، وسنفتقدك بالتأكيد في يومنا هذا.'
                  : 'نشكرك على ردك اللطيف، ونتمنى أن تتمكن من مشاركتنا فرحتنا قريباً.'}
              </p>
            )}

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-8 bg-[#EC4899] text-white px-10 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#A88461] transition-all w-full"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
