'use client';

/**
 * @file src/components/templates/designs/GraduationModern.jsx
 * @description Modern graduation celebration digital invitation template ("تخرج أحمد خالد").
 * Styled in royal navy blue (`#1E3A8A` / `#F8FAFC`) with a full-screen hero cover,
 * Quranic verse on knowledge, scroll-linked graduation cap timeline indicator,
 * live countdown timer, calendar integration, RSVP form ("تأكيد الحضور") with guest counter,
 * Wishes/Greetings wall ("كلمات المهنئين"), and VIP QR entry pass modal.
 */

// 1. React and Next.js core modules
import { useEffect, useRef, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';

// 2. Third-party libraries
import { motion, useScroll, useTransform } from 'framer-motion';
import { Minus, Phone, Plus } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Confetti from 'react-confetti';

// 3. Internal components, hooks, and utility functions
import BackgroundMusic from '../../BackgroundMusic';

// Configure Arabic calligraphy and body typography
const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

// Graduation Navy-Blue Theme Palette Constants
const ZARIA_GOLD = '#1E3A8A';
const ZARIA_CREAM_DARK = '#E2E8F0';

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
 * Decorative minimalist corner ornament SVG rendered at the four corners of the invitation frame.
 *
 * @param {import('@/types/zaria').DecorativeIconProps} props - Icon styling props.
 * @returns {JSX.Element} The SVG corner ornament.
 */
const ElegantCorner = ({ className = 'w-4 h-4', color = ZARIA_GOLD }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 12V4H12" />
    <path d="M8 8L2 2" />
    <circle cx="16" cy="4" r="1" fill={color} stroke="none" />
    <circle cx="4" cy="16" r="1" fill={color} stroke="none" />
  </svg>
);

/**
 * Graduation mortarboard cap icon used in the scroll-linked timeline track and notes list.
 *
 * @param {import('@/types/zaria').DecorativeIconProps} props - Icon styling props.
 * @returns {JSX.Element} The SVG graduation cap icon.
 */
const GradCapIcon = ({ className = 'w-4 h-4', color = ZARIA_GOLD }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={{ color }}>
    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 17.18 8.13 19 12 19C15.87 19 19 17.18 19 17.18V13.18L12 17L5 13.18Z" />
  </svg>
);

/**
 * GraduationModern Component ("تخرج أحمد خالد")
 *
 * State Variables:
 * - `timeLeft` {import('@/types/zaria').CountdownTimeLeft}: Remaining days, hours, minutes, and seconds until the graduation party.
 * - `rsvpData` {import('@/types/zaria').TemplateRSVPState}: Form state for guest name, companion count, attendance status, and greeting message.
 * - `showConfetti` {boolean}: Triggers celebratory confetti burst upon confirming attendance.
 * - `showQRModal` {boolean}: Controls visibility of the post-submission VIP QR Code modal.
 * - `windowSize` {import('@/types/zaria').ViewportSize}: Current viewport width and height for sizing the Confetti canvas.
 * - `guestbookMessages` {import('@/types/zaria').GuestbookEntry[]}: List of congratulatory messages displayed in "كلمات المهنئين".
 *
 * @returns {JSX.Element} The complete modern graduation digital invitation experience.
 */
export default function GraduationModern() {
  // Scroll-linked progress tracker for the animated graduation cap along the program timeline
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });
  const capTop = useTransform(timelineScroll, [0, 1], ['5%', '95%']);

  /**
   * Computes the remaining time until the graduation celebration date (`2026-11-29T21:00:00`).
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
      message: 'ألف مبروك 🤍 التخرج ومنها للمراتب العليا، فرحتكم فرحتنا',
      avatarColor: 'bg-[#3B82F6]',
      avatarLetter: 'أ',
    },
    {
      name: 'سارة',
      message: 'عقبال ما نفرح بيكم بأحلى المناسبات، دعوة بغاية الذوق 🤩',
      avatarColor: 'bg-[#1D4ED8]',
      avatarLetter: 'س',
    },
    {
      name: 'حيدر',
      message: 'مبارك التخرج، الله يجعل أيامك كلها نجاح وتفوق',
      avatarColor: 'bg-[#64748B]',
      avatarLetter: 'ح',
    },
    {
      name: 'نور الهدى',
      message: 'منها للأعلى إن شاء الله، ألف مبروك',
      avatarColor: 'bg-[#0F172A]',
      avatarLetter: 'ن',
    },
    {
      name: 'أبو علي',
      message: 'ما شاء الله تبارك الرحمن، فخورين جداً بنجاحك',
      avatarColor: 'bg-[#94A3B8]',
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

    // 1. Prepend new greeting to "كلمات المهنئين" if message is non-empty
    if (rsvpData.message.trim()) {
      const colors = [
        'bg-[#3B82F6]',
        'bg-[#1D4ED8]',
        'bg-[#64748B]',
        'bg-[#0F172A]',
        'bg-[#94A3B8]',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const firstLetter = rsvpData.name ? rsvpData.name.trim().charAt(0) : 'ز';

      setGuestbookMessages((prev) => [
        {
          name: rsvpData.name || 'ضيف',
          message: rsvpData.message,
          avatarColor: randomColor,
          avatarLetter: firstLetter,
        },
        ...prev,
      ]);

      // Clear the message textarea while retaining guest name for the QR pass
      setRsvpData((prev) => ({ ...prev, message: '' }));
    }

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
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('حفل تخرج أحمد خالد')}&dates=20261129T180000Z/20261129T210000Z&details=${encodeURIComponent('نتشرف بحضوركم حفل التخرج')}&location=${encodeURIComponent('فندق فور سيزونز عمان')}`;

  /**
   * Generates and downloads an `.ics` iCalendar file for Apple Calendar / Outlook.
   */
  const handleAppleCalendar = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zaria//Graduation//AR
BEGIN:VEVENT
SUMMARY:حفل تخرج أحمد خالد
DTSTART:20261129T180000Z
DTEND:20261129T210000Z
LOCATION:فندق فور سيزونز عمان
DESCRIPTION:نتشرف بحضوركم حفل التخرج
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'graduation_invitation.ics');
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
              'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80")',
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
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#1E3A8A]" />
            <b className="text-[#1E3A8A] text-xs">♦</b>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#1E3A8A]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-8 mt-4">
            أحمد خالد
          </h1>

          <p className="text-lg md:text-xl font-['Aref_Ruqaa'] opacity-90 mb-8 max-w-sm mx-auto drop-shadow-md text-[#fdf8f5]">
            أتشرف بدعوتكم لمشاركتي فرحة التخرج
          </p>

          <p className="text-sm md:text-base opacity-80 mb-4 tracking-widest font-mono">—</p>

          <p className="text-lg md:text-xl font-['Aref_Ruqaa'] text-[#1E3A8A] drop-shadow-md">
            بداية رحلة جديدة
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
      <div className="mx-auto max-w-md w-full bg-[#E2E8F0] relative text-[#0F172A] pb-24 overflow-x-hidden pt-12 px-4 shadow-2xl">
        {/* THE MAIN INVITATION FRAME */}
        <div className="relative w-full bg-[#F8FAFC] flex flex-col items-center pt-10 pb-12 px-2 shadow-sm border border-[#1E3A8A]/30">
          {/* Decorative Frame Corners */}
          <div className="absolute -top-[1px] -left-[1px] bg-[#F8FAFC] p-1">
            <ElegantCorner className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <div className="absolute -top-[1px] -right-[1px] bg-[#F8FAFC] p-1">
            <ElegantCorner className="w-5 h-5 text-[#1E3A8A] rotate-90" />
          </div>
          <div className="absolute -bottom-[1px] -left-[1px] bg-[#F8FAFC] p-1">
            <ElegantCorner className="w-5 h-5 text-[#1E3A8A] -rotate-90" />
          </div>
          <div className="absolute -bottom-[1px] -right-[1px] bg-[#F8FAFC] p-1">
            <ElegantCorner className="w-5 h-5 text-[#1E3A8A] rotate-180" />
          </div>

          {/* Framed Content Wrapper */}
          <div className="relative z-20 flex flex-col items-center w-full">
            {/* Quranic Verse on Knowledge */}
            <p className="text-[#0F172A] text-[18px] md:text-xl mb-10 leading-loose text-center px-4 font-medium">
              ﴿ يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ﴾
            </p>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A]"></div>
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
            </div>

            {/* Invitation Heading & Copy */}
            <h3 className={`text-4xl text-[#1E3A8A] mb-8 font-bold ${aref.className}`}>
              بطاقة دعوة
            </h3>

            <p className="text-[14px] leading-[2.2] mb-12 text-[#0F172A] text-center px-4 max-w-[300px]">
              بقلوبٍ مفعمةٍ بالفرح والسرور، وعطري الإنجاز والنجاح، أتشرف بدعوتكم لمشاركتي فرحة
              التخرج. حضوركم شرفٌ لي وتكتمل به فرحتي.
            </p>

            {/* Graduate Academic Details */}
            <div className="flex flex-col items-center text-[14px] font-bold w-full px-2 mb-12 mt-4 text-center">
              <p className="text-[#475569] text-[12px] mb-2 tracking-wide">تخرج ابننا</p>
              <p
                className={`text-[32px] text-[#1E3A8A] font-bold leading-tight mb-2 ${aref.className}`}
              >
                أحمد خالد
              </p>
              <div className="bg-[#E2E8F0] px-4 py-2 rounded-full mb-6">
                <p className="text-[#0F172A] text-[14px] mb-0.5 font-bold">
                  تخصص هندسة البرمجيات
                </p>
                <p className="text-[#475569] text-[12px] font-medium">الجامعة الأردنية</p>
              </div>

              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A] mb-6 opacity-60"></div>

              <p className="text-[#475569] text-[12px] mb-2 tracking-wide">الداعون</p>
              <p className="leading-relaxed text-[#0F172A] text-[14px]">
                عائلته الكريمة
                <br />
                وجميع الأهل والأصدقاء
              </p>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A]"></div>
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
            </div>

            {/* Live Countdown Timer Section */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-3xl text-[#1E3A8A] mb-8 font-bold ${aref.className}`}>
                يبدأ الاحتفال بعد
              </h3>
              <div className="flex justify-center gap-3 mb-10 w-full px-4">
                {[
                  { label: 'يم', value: timeLeft.days },
                  { label: 'ساعة', value: timeLeft.hours },
                  { label: 'دقيقة', value: timeLeft.minutes },
                  { label: 'ثانية', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-[65px] h-[75px] bg-[#F8FAFC] border border-[#1E3A8A]/30 rounded-xl flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="text-2xl font-bold font-sans text-[#1E3A8A] mb-1">
                      {toArabic(item.value.toString().padStart(2, '0'))}
                    </span>
                    <span className="text-[11px] font-bold text-[#475569]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A]"></div>
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
            </div>

            {/* Scroll-Linked Graduation Program Timeline */}
            <div className="w-full flex flex-col items-center py-10 relative">
              <h3
                className={`text-4xl text-[#1E3A8A] mb-12 font-bold z-10 ${aref.className} text-center`}
              >
                برنامج الحفل
              </h3>

              <div className="relative w-full flex flex-col px-0 max-w-sm z-10" ref={timelineRef}>
                {/* Vertical Timeline Track Line */}
                <div className="absolute right-[95px] md:right-[105px] top-6 bottom-6 w-px bg-[#1E3A8A]/30"></div>

                {/* Scroll-Animated Graduation Cap Indicator */}
                <motion.div
                  className="absolute right-[95px] md:right-[105px] translate-x-1/2 flex items-center justify-center z-20"
                  style={{ top: capTop }}
                >
                  <GradCapIcon className="w-6 h-6 text-[#1E3A8A] drop-shadow-[0_0_8px_rgba(30,58,138,0.4)]" />
                </motion.div>

                {[
                  {
                    time: '9:00',
                    event: 'استقبال الضيوف',
                    desc: 'ترحيب بالضيوف مع ضيافة خفيفة.',
                  },
                  {
                    time: '10:00',
                    event: 'فرحة الأهل 🎓',
                    desc: 'احتفال مع الأهل والأصدقاء.',
                  },
                  {
                    time: '11:00',
                    event: 'الختام 🤍',
                    desc: 'صور تذكارية وتوديع الضيوف.',
                  },
                ].map((prog, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row-reverse items-start py-8 relative z-10"
                  >
                    {/* Left Side: Event Title & Description */}
                    <div className="flex-1 text-right pr-4">
                      <h4
                        className="text-[#0F172A] text-[20px] font-bold mb-2 font-['Aref_Ruqaa']"
                        style={{ fontFamily: 'var(--font-aref-ruqaa), serif' }}
                      >
                        {prog.event}
                      </h4>
                      <p className="text-[#475569] text-[13px] leading-relaxed">{prog.desc}</p>
                    </div>

                    {/* Center: Track Node */}
                    <div className="w-[50px] shrink-0 flex flex-col items-center justify-start pt-3">
                      <div className="w-2 h-2 rounded-full bg-[#1E3A8A] opacity-30 shadow-[0_0_8px_rgba(30,58,138,0.2)]"></div>
                    </div>

                    {/* Right Side: Timestamp */}
                    <div className="w-[70px] md:w-[80px] shrink-0 text-left pt-2 pl-2">
                      <span
                        className="text-[#475569] opacity-90 text-[13px] font-bold tracking-wider font-sans"
                        dir="ltr"
                      >
                        {prog.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-14"></div>

            {/* Venue Location Section */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#1E3A8A] mb-8 font-bold ${aref.className}`}>
                الموقع
              </h3>

              <div className="text-center font-bold text-[14px] leading-relaxed mb-8 text-[#0F172A]">
                <p className="mb-3">يوم الأحد، 29 تشرين الثاني 2026</p>
                <p className="text-[#475569] mb-6 text-[12px]">الساعة التاسعة مساءً</p>
                <p className={`text-[#1E3A8A] mb-3 font-normal text-2xl ${aref.className}`}>
                  فندق فور سيزونز
                </p>
                <p className="text-[#475569] text-[13px]">عمان — الأردن</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E3A8A] text-white px-8 py-2.5 rounded-full text-[13px] font-bold shadow-md hover:bg-[#A88461] transition-all inline-block mb-4"
              >
                الخريطة
              </a>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A]"></div>
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
            </div>

            {/* Event Notes */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#1E3A8A] mb-10 font-bold ${aref.className}`}>
                ملاحظات
              </h3>
              <ul className="text-[14px] font-bold flex flex-col gap-6 text-right w-full px-6 text-[#0F172A]">
                <li className="flex items-start justify-center gap-3 text-center">
                  <GradCapIcon className="w-4 h-4 mt-1 shrink-0 text-[#1E3A8A] opacity-80" />
                  <span>يُرجى الحضور قبل الموعد بنصف ساعة</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <GradCapIcon className="w-4 h-4 mt-1 shrink-0 text-[#1E3A8A] opacity-80" />
                  <span>نتشرّف بحضوركم بأبهى حلّة</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <GradCapIcon className="w-4 h-4 mt-1 shrink-0 text-[#1E3A8A] opacity-80" />
                  <span>الدعوة تشمل حاملها العائلة الكريمة</span>
                </li>
              </ul>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A]"></div>
              <div className="h-[1px] flex-1 bg-[#1E3A8A]"></div>
            </div>

            {/* Frame Footer Contact Info */}
            <div className="w-full flex flex-col items-center">
              <div className="text-center w-full font-bold">
                <h3 className={`text-3xl mb-5 text-[#0F172A] ${aref.className}`}>
                  حضوركم يزيّن فرحتنا
                </h3>
                <p className="text-[#1E3A8A] font-sans text-[14px] mb-12 tracking-wider">
                  #أحمد_خالد
                </p>

                <p className="text-[12px] text-[#475569] mb-4">للاستفسار التأكيد</p>
                <div className="flex justify-center mb-10">
                  <a
                    href="https://wa.me/9647700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#1E3A8A]/50 rounded-full px-6 py-2 text-[13px] text-[#0F172A] bg-transparent flex items-center gap-2 hover:bg-[#E2E8F0] transition-colors"
                  >
                    أبو أحمد <Phone size={14} className="text-[#1E3A8A]" />
                  </a>
                </div>

                <p className="text-[13px] text-[#0F172A] mb-8 font-bold">عائلة الأحمد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graduation Photo Gallery Section ("ذكريات التخرج") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <h3
            className={`text-4xl text-[#1E3A8A] font-bold ${aref.className} flex flex-col items-center gap-3`}
          >
            ذكريات التخرج
          </h3>
        </div>
        <div className="px-6 mb-16 w-full">
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1592285440263-c750c19623d3?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1555009395-f12016335ebc?auto=format&fit=crop&q=80',
            ].map((src, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden shadow-sm border border-[#1E3A8A]/20 ${
                  idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'
                }`}
              >
                <img
                  src={src}
                  alt={`Graduation Memory ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save the Date Calendar Card Section ("احفظ الموعد") */}
        <div className="w-full flex flex-col items-center mt-12 mb-16 px-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl">🤍</span>
            <h3 className={`text-2xl text-[#1E3A8A] font-bold ${aref.className}`}>احفظ الموعد</h3>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl shadow-[0_10px_30px_rgba(166,124,82,0.15)] w-full max-w-sm overflow-hidden border border-[#1E3A8A]/20 relative">
            <div className="absolute top-0 left-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>
            <div className="absolute top-0 right-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>

            <div className="bg-[#1E3A8A] text-white py-3 text-center font-bold text-lg pt-4">
              تشرين الثاني 2026
            </div>

            <div className="p-6 flex flex-col items-center relative">
              <p className="text-[#1E3A8A] font-bold text-lg mb-1">الأحد</p>
              <p className="text-8xl text-[#1E3A8A] font-light mb-2 leading-none">29</p>
              <p className="text-[#0F172A] font-bold text-sm">الساعة التاسعة مساءً</p>
            </div>

            <div className="border-t border-dashed border-[#1E3A8A]/30 px-6 py-5 bg-white/50">
              <p className="text-center text-[#475569] text-xs font-bold mb-4">
                أضف الموعد إلى تقويم هاتفك بضغطة 📅
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border border-[#1E3A8A] text-[#1E3A8A] rounded-full py-2 text-xs font-bold hover:bg-[#1E3A8A] hover:text-white transition-colors block"
                >
                  تقويم جوجل
                </a>
                <button
                  onClick={handleAppleCalendar}
                  className="flex-1 border border-[#1E3A8A] text-[#1E3A8A] rounded-full py-2 text-xs font-bold hover:bg-[#1E3A8A] hover:text-white transition-colors"
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
              <div className="w-12 h-[1px] bg-[#1E3A8A]"></div>
              <span className="text-xl">🤍</span>
              <div className="w-12 h-[1px] bg-[#1E3A8A]"></div>
            </div>
            <h3 className={`text-[42px] text-[#0F172A] font-bold ${aref.className} mb-1 mt-2`}>
              تأكيد الحضور
            </h3>
            <p className="text-center text-[#475569] text-[15px] mb-2 font-bold">
              يسعدنا تأكيد حضوركم
            </p>
          </div>
        </div>

        <div className="w-full px-6 mb-24">
          <form
            onSubmit={handleRSVPSubmit}
            className="bg-[#F8FAFC] border border-[#1E3A8A]/40 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(196,154,108,0.1)] relative overflow-hidden"
          >
            {/* Guest Name Input */}
            <div className="mb-5 mt-2">
              <label className="block text-[#475569] mb-2 text-xs font-bold">الاسم الكريم</label>
              <input
                type="text"
                required
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                placeholder="أدخل اسمك هنا..."
                className="w-full border-b border-[#1E3A8A]/30 bg-transparent px-2 py-2 text-[#0F172A] text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors placeholder-[#475569]/40"
              />
            </div>

            {/* Attendance Status Radio Buttons (نعم / لا / ربما) */}
            <div className="mb-6">
              <label className="block text-[#0F172A] mb-3 text-sm font-bold text-right w-full">
                هل ستحضر؟
              </label>
              <div className="flex gap-2">
                <label
                  className={`flex-1 cursor-pointer rounded-xl border ${
                    rsvpData.status === 'attending'
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                      : 'border-[#1E3A8A]/30 bg-white text-[#0F172A] hover:border-[#1E3A8A]/60'
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
                  className={`flex-1 cursor-pointer rounded-xl border ${
                    rsvpData.status === 'not_attending'
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                      : 'border-[#1E3A8A]/30 bg-white text-[#0F172A] hover:border-[#1E3A8A]/60'
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
                  className={`flex-1 cursor-pointer rounded-xl border ${
                    rsvpData.status === 'maybe'
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                      : 'border-[#1E3A8A]/30 bg-white text-[#0F172A] hover:border-[#1E3A8A]/60'
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
                <label className="block text-[#0F172A] mb-4 text-xs font-bold text-center w-full">
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
                    className="w-10 h-10 rounded-full border border-[#1E3A8A]/40 bg-white flex items-center justify-center text-[#475569] hover:bg-[#E2E8F0] hover:text-[#1E3A8A] transition-colors"
                  >
                    <Minus size={16} strokeWidth={1.5} />
                  </button>
                  <span className="text-[#0F172A] font-bold text-lg w-4 text-center">
                    {rsvpData.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setRsvpData({ ...rsvpData, guests: (Number(rsvpData.guests) || 0) + 1 })
                    }
                    className="w-10 h-10 rounded-full border border-[#1E3A8A]/40 bg-white flex items-center justify-center text-[#475569] hover:bg-[#E2E8F0] hover:text-[#1E3A8A] transition-colors"
                  >
                    <Plus size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Congratulatory Wish Input Field */}
            <div className="mb-8">
              <label className="block text-[#0F172A] mb-2 text-xs font-bold flex items-center gap-2">
                كلمة وتهنئة 💌
              </label>
              <textarea
                value={rsvpData.message}
                onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                placeholder="اكتب تهنئتك..."
                rows="3"
                className="w-full border border-[#1E3A8A]/30 rounded-xl px-4 py-3 bg-white text-[#0F172A] text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors resize-none placeholder-[#475569]/50"
              ></textarea>
            </div>

            {/* Submit RSVP Confirmation Button */}
            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white rounded-2xl py-4 mt-2 font-bold text-[15px] shadow-md hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2"
            >
              إرسال التأكيد
            </button>
          </form>
        </div>

        {/* Wishes / Greetings Wall Section ("كلمات المهنئين") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-[#1E3A8A]/30 rounded-full px-8 py-3 shadow-sm flex items-center justify-center gap-3">
            <span className="text-[20px] drop-shadow-sm">🌹</span>
            <h3 className={`text-2xl text-[#0F172A] font-bold ${aref.className}`}>
              كلمات المهنئين
            </h3>
          </div>
        </div>

        <div className="w-full px-6 mb-24 flex flex-col gap-4">
          {guestbookMessages.map((msg, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm border border-[#1E3A8A]/20 rounded-2xl p-5 shadow-[0_4px_20px_rgba(196,154,108,0.05)] flex items-center gap-4 relative overflow-hidden"
            >
              <div
                className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold ${msg.avatarColor} shadow-inner`}
              >
                {msg.avatarLetter}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-[#0F172A] font-bold text-lg mb-1">{msg.name}</h4>
                <p className="text-[#475569] text-[13px] leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Audio Stream Player */}
      <BackgroundMusic youtubeUrl="https://www.youtube.com/watch?v=Hp8WTVqR_0U" />

      {/* Celebratory Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            colors={['#1E3A8A', '#1E3A8A', '#F8FAFC', '#3B82F6', '#475569']}
          />
        </div>
      )}

      {/* VIP QR Code Entry Pass Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-[#F8FAFC] border-2 border-[#1E3A8A] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center shadow-2xl relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-[#475569] hover:text-[#0F172A] transition-colors bg-[#E2E8F0] p-2 rounded-full"
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

            <h3 className={`text-4xl text-[#1E3A8A] font-bold mb-4 ${aref.className} mt-2`}>
              شكراً لتأكيد حضوركم!
            </h3>

            {rsvpData.status === 'attending' ? (
              <>
                <p className="text-[#0F172A] text-center mb-6 text-[14px] leading-relaxed">
                  نحن متحمسون جداً لرؤيتك في حفل التخرج. يُرجى الاحتفاظ ببطاقة الدخول الذكية (QR
                  Code) وإبرازها لموظفي الاستقبال.
                </p>

                <div className="bg-white p-2 rounded-xl shadow-[0_5px_15px_rgba(196,154,108,0.2)] border border-[#1E3A8A]/20 mb-6 flex justify-center items-center">
                  <QRCodeCanvas
                    value={`BEGIN:VCARD\nVERSION:3.0\nFN:${rsvpData.name || 'ضيف'}\nORG:بطاقة صالحة - تخرج أحمد خالد\nNOTE:عدد المرافقين: ${rsvpData.guests}\nEND:VCARD`}
                    size={180}
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <p className="text-[#475569] font-bold text-xl mb-1">{rsvpData.name || 'ضيف'}</p>
                <p className="text-[#1E3A8A] text-sm font-bold">المرافقين: {rsvpData.guests}</p>
              </>
            ) : (
              <p className="text-[#0F172A] text-center mb-6 text-[15px] leading-relaxed mt-4">
                {rsvpData.status === 'not_attending'
                  ? 'نشكرك على ردك اللطيف، نتمنى لك دوام الصحة والسعادة، سنفتقدك بالتأكيد في يومنا هذا.'
                  : 'نشكرك على ردك اللطيف، نتمنى أن تتمكن من مشاركتنا فرحتنا قريباً.'}
              </p>
            )}

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-8 bg-[#1E3A8A] text-white px-10 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#A88461] transition-all w-full"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
