'use client';

/**
 * @file src/components/templates/designs/NewbornCute.jsx
 * @description Interactive newborn baby reception invitation template ("استقبال المولود زين").
 * Styled in soft sky-blue (`#0EA5E9` / `#F0F9FF`) with a full-screen hero cover,
 * Quranic blessing verse, live countdown timer, reception schedule, embedded Google Map
 * for the family home ("بيت العائلة — دابوق، عمان"), Google/Apple calendar integration,
 * RSVP form ("تأكيد الحضور") with guest counter, Wishes/Greetings wall ("كلمات المهنئين"),
 * and VIP QR entry pass modal.
 */

// 1. React and Next.js core modules
import { useEffect, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';

// 2. Third-party libraries
import { MapPin, Minus, Phone, Plus } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Confetti from 'react-confetti';

// 3. Internal components, hooks, and utility functions
import BackgroundMusic from '../../BackgroundMusic';

// Configure Arabic calligraphy and body typography
const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

// Newborn Sky-Blue Theme Palette Constants
const ZARIA_GOLD = '#0EA5E9';
const ZARIA_CREAM_DARK = '#E0F2FE';

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
 * NewbornCute Component ("استقبال المولود زين")
 *
 * State Variables:
 * - `timeLeft` {import('@/types/zaria').CountdownTimeLeft}: Remaining days, hours, minutes, and seconds until the event.
 * - `rsvpData` {import('@/types/zaria').TemplateRSVPState}: Form state for guest name, companion count, attendance status, and greeting message.
 * - `showConfetti` {boolean}: Triggers celebratory confetti burst upon confirming attendance.
 * - `showQRModal` {boolean}: Controls visibility of the post-submission VIP QR Code modal.
 * - `windowSize` {import('@/types/zaria').ViewportSize}: Current viewport width and height for sizing the Confetti canvas.
 * - `guestbookMessages` {import('@/types/zaria').GuestbookEntry[]}: List of congratulatory messages displayed in "كلمات المهنئين".
 *
 * @returns {JSX.Element} The complete newborn reception digital invitation experience.
 */
export default function NewbornCute() {
  /**
   * Computes the remaining time until the newborn reception date (`2026-11-29T21:00:00`).
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
      message: 'ألف مبروك قدوم الغالي زين 🤍 يتربى بعزكم ودلالكم إن شاء الله',
      avatarColor: 'bg-[#38BDF8]',
      avatarLetter: 'أ',
    },
    {
      name: 'سارة',
      message: 'الحمد لله على السلامة، جعله الله من مواليد السعادة وقرة عين لوالديه 👶💙',
      avatarColor: 'bg-[#818CF8]',
      avatarLetter: 'س',
    },
    {
      name: 'حيدر',
      message: 'بورك لكم في الموهوب وشكرتم الواهب، وبلغ أشده ورزقتم بره 👶🤍',
      avatarColor: 'bg-[#A78BFA]',
      avatarLetter: 'ح',
    },
    {
      name: 'نور الهدى',
      message: 'أهلاً بقدوم أحلى زين، نورت الدنيا بوجوده، ألف مبروك للعائلة الكريمة 🍼✨',
      avatarColor: 'bg-[#F472B6]',
      avatarLetter: 'ن',
    },
    {
      name: 'أبو علي',
      message: 'اللهم أنبته نباتاً حسناً واجعله من الصالحين واحفظه من كل سوء 🤲',
      avatarColor: 'bg-[#94A3B8]',
      avatarLetter: 'أ',
    },
  ]);

  /**
   * Handles submission of the RSVP form ("تأكيد الحضور"):
   * 1. If a congratulatory message is provided, prepends it to the "كلمات المهنئين" guestbook list.
   * 2. If the guest is attending, triggers an 8-second confetti celebration.
   * 3. Opens the VIP QR Code entry pass modal.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   */
  const handleRSVPSubmit = (e) => {
    e.preventDefault();

    // 1. Prepend new greeting to "كلمات المهنئين" if message is non-empty
    if (rsvpData.message.trim()) {
      const colors = [
        'bg-[#38BDF8]',
        'bg-[#818CF8]',
        'bg-[#A78BFA]',
        'bg-[#F472B6]',
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
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('حفل استقبال المولود زين')}&dates=20261129T180000Z/20261129T210000Z&details=${encodeURIComponent('نتشرف بحضوركم حفل استقبال مولودنا زين')}&location=${encodeURIComponent('بيت العائلة - دابوق، عمان')}`;

  /**
   * Generates and downloads an `.ics` iCalendar file for Apple Calendar / Outlook.
   */
  const handleAppleCalendar = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Zaria//Newborn//AR\nBEGIN:VEVENT\nSUMMARY:حفل استقبال المولود زين\nDTSTART:20261129T180000Z\nDTEND:20261129T210000Z\nLOCATION:بيت العائلة - دابوق، عمان\nDESCRIPTION:نتشرف بحضوركم حفل استقبال مولودنا زين\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'newborn_zain_invitation.ics');
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
              'url("https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80")',
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
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#0EA5E9]" />
            <b className="text-[#0EA5E9] text-xs">♦</b>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#0EA5E9]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-8 mt-4">
            المولود زين
          </h1>

          <p className="text-lg md:text-xl font-['Aref_Ruqaa'] opacity-90 mb-8 max-w-sm mx-auto drop-shadow-md text-[#fdf8f5]">
            نتشرف بدعوتكم لمشاركتنا فرحة قدوم مولودنا
          </p>

          <p className="text-sm md:text-base opacity-80 mb-4 tracking-widest font-mono">—</p>

          <p className="text-lg md:text-xl font-['Aref_Ruqaa'] text-[#0EA5E9] drop-shadow-md">
            هبة من الرحمن
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
      <div className="mx-auto max-w-md w-full bg-[#E0F2FE] relative text-[#0C4A6E] pb-24 overflow-x-hidden pt-12 px-4 shadow-2xl">
        {/* THE MAIN INVITATION FRAME */}
        <div className="relative w-full bg-[#F0F9FF] flex flex-col items-center pt-10 pb-12 px-2 shadow-sm border border-[#0EA5E9]/30">
          {/* Decorative Frame Corners */}
          <div className="absolute -top-[1px] -left-[1px] bg-[#F0F9FF] p-1">
            <ElegantCorner className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div className="absolute -top-[1px] -right-[1px] bg-[#F0F9FF] p-1">
            <ElegantCorner className="w-5 h-5 text-[#0EA5E9] rotate-90" />
          </div>
          <div className="absolute -bottom-[1px] -left-[1px] bg-[#F0F9FF] p-1">
            <ElegantCorner className="w-5 h-5 text-[#0EA5E9] -rotate-90" />
          </div>
          <div className="absolute -bottom-[1px] -right-[1px] bg-[#F0F9FF] p-1">
            <ElegantCorner className="w-5 h-5 text-[#0EA5E9] rotate-180" />
          </div>

          {/* Framed Content Wrapper */}
          <div className="relative z-20 flex flex-col items-center w-full">
            {/* Quranic Verse */}
            <p className="text-[#0C4A6E] text-[18px] md:text-xl mb-10 leading-loose text-center px-4 font-medium">
              ﴿ الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا ﴾
            </p>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#0EA5E9]"></div>
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
            </div>

            {/* Invitation Heading & Welcome Copy */}
            <h3 className={`text-4xl text-[#0EA5E9] mb-8 font-bold ${aref.className}`}>
              بطاقة دعوة
            </h3>

            <p className="text-[14px] leading-[2.2] mb-10 text-[#0C4A6E] text-center px-4 max-w-[310px]">
              بقلوبٍ يغمرها الحمدُ والشكرُ لله، وبفرحةٍ ازدانَ بها بيتُنا، نتشرّف بدعوتكم لمشاركتنا
              بهجة قدوم مولودنا الغالي في حفل استقباله. حضوركم يزيد فرحتنا نوراً وسروراً.
            </p>

            {/* Newborn & Hosting Families Information */}
            <div className="flex flex-col items-center text-[14px] font-bold w-full px-4 mb-12 mt-2 text-center">
              <p className="text-[#0369A1] text-[12px] mb-2 tracking-wide">قدوم المولود الغالي</p>
              <p
                className={`text-[36px] text-[#0EA5E9] font-bold leading-tight mb-4 ${aref.className}`}
              >
                زين
              </p>
              <div className="bg-[#E0F2FE] border border-[#0EA5E9]/20 px-5 py-2 rounded-full mb-6">
                <p className="text-[#0C4A6E] text-[13px] font-bold">
                  بُورِكَ فِي الْمَوْهُوبِ وَشُكِرَ الْوَاهِبُ 👶💙
                </p>
              </div>

              <div className="w-1.5 h-1.5 rotate-45 bg-[#0EA5E9] mb-6 opacity-60"></div>

              <p className="text-[#0369A1] text-[12px] mb-2 tracking-wide">الداعون</p>
              <p className="leading-relaxed text-[#0C4A6E] text-[15px] mb-1">
                الدكتور سهيل أبو زين وحرمه
              </p>
              <p className="text-[#0369A1] text-[12px] font-medium">
                وعموم عائلة العمري وعائلة الخطيب
              </p>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#0EA5E9]"></div>
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
            </div>

            {/* Live Countdown Timer Section */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-3xl text-[#0EA5E9] mb-8 font-bold ${aref.className}`}>
                يبدأ الاستقبال بعد
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
                    className="w-[65px] h-[75px] bg-[#F0F9FF] border border-[#0EA5E9]/30 rounded-xl flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="text-2xl font-bold font-sans text-[#0EA5E9] mb-1">
                      {toArabic(item.value.toString().padStart(2, '0'))}
                    </span>
                    <span className="text-[11px] font-bold text-[#0369A1]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#0EA5E9]"></div>
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
            </div>

            {/* Reception Program Timeline */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#0EA5E9] mb-10 font-bold ${aref.className}`}>
                برنامج الاستقبال
              </h3>
              <div className="w-full flex flex-col px-4 max-w-sm">
                {[
                  {
                    time: '6:00 – 6:30',
                    event: 'استقبال الضيوف والمهنئين',
                    desc: 'ترحيب بالأهل والأحبة مع أجواء هادئة وضيافة الاستقبال.',
                  },
                  {
                    time: '6:30 – 7:15',
                    event: 'تقديم الضيافة والحلويات 🍼',
                    desc: 'تقديم المغلي والحلويات الخاصة بمناسبة قدوم المولود زين.',
                  },
                  {
                    time: '7:15 – 8:00',
                    event: 'المباركة والصور التذكارية 📸',
                    desc: 'مشاركة الفرحة وتوثيق أجمل اللحظات مع المولود والعائلة.',
                  },
                  {
                    time: '8:00 – 8:30',
                    event: 'توزيع الهدايا التذكارية 🎁',
                    desc: 'تقديم تذكارات المولود زين وتوديع الضيوف بكل محبة.',
                  },
                ].map((prog, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-5 border-b border-dashed border-[#0EA5E9]/30"
                  >
                    <div className="flex-1 text-right">
                      <span className="text-[#0C4A6E] text-[15px] font-bold block">
                        {prog.event}
                      </span>
                      <span className="text-[#0369A1] text-[11px] block mt-1 leading-relaxed pl-2">
                        {prog.desc}
                      </span>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#0EA5E9] border-[2px] border-[#F0F9FF] mx-3 shrink-0 shadow-[0_0_0_1px_#0EA5E9]"></div>
                    <span
                      className="text-[#0369A1] text-[12px] font-bold shrink-0 min-w-[75px] text-left font-sans"
                      dir="ltr"
                    >
                      {prog.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-14"></div>

            {/* Venue Location & Embedded Interactive Google Map */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#0EA5E9] mb-8 font-bold ${aref.className}`}>
                الموقع
              </h3>
              <div className="w-full max-w-[300px] h-48 bg-[#E0F2FE] rounded-xl mb-6 border border-[#0EA5E9]/30 shadow-sm relative overflow-hidden group">
                <iframe
                  title="موقع الاستقبال - بيت العائلة"
                  src="https://maps.google.com/maps?q=31.9965,35.8335&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=31.9965,35.8335"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فتح في خرائط جوجل"
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-105 transition-all"
                >
                  <MapPin size={18} className="text-[#0EA5E9]" />
                </a>
              </div>
              <div className="text-center font-bold text-[14px] leading-relaxed mb-8 text-[#0C4A6E]">
                <p className="mb-3">يوم الأحد، 29 تشرين الثاني 2026</p>
                <p className="text-[#0369A1] mb-6 text-[12px]">الساعة السادسة مساءً</p>
                <p className={`text-[#0EA5E9] mb-3 font-normal text-2xl ${aref.className}`}>
                  بيت العائلة
                </p>
                <p className="text-[#0369A1] text-[13px]">دابوق — عمان</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=31.9965,35.8335"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0EA5E9] text-white px-8 py-2.5 rounded-full text-[13px] font-bold shadow-md hover:bg-[#0284C7] transition-all inline-block mb-4"
              >
                الخريطة
              </a>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#0EA5E9]"></div>
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
            </div>

            {/* Reception Notes */}
            <div className="w-full flex flex-col items-center">
              <h3 className={`text-4xl text-[#0EA5E9] mb-10 font-bold ${aref.className}`}>
                ملاحظات
              </h3>
              <ul className="text-[14px] font-bold flex flex-col gap-6 text-right w-full px-6 text-[#0C4A6E]">
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#0EA5E9] opacity-70" />
                  <span>نتشرّف بحضوركم ومشاركتنا فرحة قدوم مولودنا زين</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#0EA5E9] opacity-70" />
                  <span>وجودكم بيننا ودعواتكم الصالحة أجمل هدية لمولودنا</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#0EA5E9] opacity-70" />
                  <span>الدعوة تشمل الأهل والأحبة الكرام</span>
                </li>
              </ul>
            </div>

            {/* Section Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#0EA5E9]"></div>
              <div className="h-[1px] flex-1 bg-[#0EA5E9]"></div>
            </div>

            {/* Frame Footer Contact Info */}
            <div className="w-full flex flex-col items-center">
              <div className="text-center w-full font-bold">
                <h3 className={`text-3xl mb-5 text-[#0C4A6E] ${aref.className}`}>
                  حضوركم يزيّن فرحتنا
                </h3>
                <p className="text-[#0EA5E9] font-sans text-[14px] mb-12 tracking-wider">
                  #استقبال_زين
                </p>

                <p className="text-[12px] text-[#0369A1] mb-4">للاستفسار والتأكيد</p>
                <div className="flex justify-center mb-10">
                  <a
                    href="https://wa.me/9647700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#0EA5E9]/50 rounded-full px-6 py-2 text-[13px] text-[#0C4A6E] bg-transparent flex items-center gap-2 hover:bg-[#E0F2FE] transition-colors"
                  >
                    أبو زين <Phone size={14} className="text-[#0EA5E9]" />
                  </a>
                </div>

                <p className="text-[13px] text-[#0C4A6E] mb-8">عائلة العمري & عائلة الخطيب</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Section ("أجمل اللحظات") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <h3
            className={`text-4xl text-[#0EA5E9] font-bold ${aref.className} flex flex-col items-center gap-3`}
          >
            أجمل اللحظات
          </h3>
        </div>
        <div className="px-6 mb-16 w-full">
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80',
            ].map((src, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden shadow-sm border border-[#0EA5E9]/20 ${
                  idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'
                }`}
              >
                <img
                  src={src}
                  alt={`Newborn Memory ${idx + 1}`}
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
            <h3 className={`text-2xl text-[#0EA5E9] font-bold ${aref.className}`}>احفظ الموعد</h3>
          </div>

          <div className="bg-[#F0F9FF] rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.12)] w-full max-w-sm overflow-hidden border border-[#0EA5E9]/20 relative">
            <div className="absolute top-0 left-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>
            <div className="absolute top-0 right-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>

            <div className="bg-[#0EA5E9] text-white py-3 text-center font-bold text-lg pt-4">
              تشرين الثاني 2026
            </div>

            <div className="p-6 flex flex-col items-center relative">
              <p className="text-[#0EA5E9] font-bold text-lg mb-1">الأحد</p>
              <p className="text-8xl text-[#0EA5E9] font-light mb-2 leading-none">29</p>
              <p className="text-[#0C4A6E] font-bold text-sm">الساعة السادسة مساءً</p>
            </div>

            <div className="border-t border-dashed border-[#0EA5E9]/30 px-6 py-5 bg-white/50">
              <p className="text-center text-[#0369A1] text-xs font-bold mb-4">
                أضف الموعد إلى تقويم هاتفك بضغطة 📅
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border border-[#0EA5E9] text-[#0EA5E9] rounded-full py-2 text-xs font-bold hover:bg-[#0EA5E9] hover:text-white transition-colors block"
                >
                  تقويم جوجل
                </a>
                <button
                  onClick={handleAppleCalendar}
                  className="flex-1 border border-[#0EA5E9] text-[#0EA5E9] rounded-full py-2 text-xs font-bold hover:bg-[#0EA5E9] hover:text-white transition-colors"
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
              <div className="w-12 h-[1px] bg-[#0EA5E9]"></div>
              <span className="text-xl">🤍</span>
              <div className="w-12 h-[1px] bg-[#0EA5E9]"></div>
            </div>
            <h3 className={`text-[42px] text-[#0C4A6E] font-bold ${aref.className} mb-1 mt-2`}>
              تأكيد الحضور
            </h3>
            <p className="text-center text-[#0369A1] text-[15px] mb-2 font-bold">
              يسعدنا تأكيد حضوركم
            </p>
          </div>
        </div>

        <div className="w-full px-6 mb-24">
          <form
            onSubmit={handleRSVPSubmit}
            className="bg-[#F0F9FF] border border-[#0EA5E9]/40 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(14,165,233,0.1)] relative overflow-hidden"
          >
            {/* Guest Name Input */}
            <div className="mb-5 mt-2">
              <label className="block text-[#0369A1] mb-2 text-xs font-bold">الاسم الكريم</label>
              <input
                type="text"
                required
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                placeholder="أدخل اسمك هنا..."
                className="w-full border-b border-[#0EA5E9]/30 bg-transparent px-2 py-2 text-[#0C4A6E] text-sm focus:outline-none focus:border-[#0EA5E9] transition-colors placeholder-[#0369A1]/40"
              />
            </div>

            {/* Attendance Status Radio Buttons (نعم / لا / ربما) */}
            <div className="mb-6">
              <label className="block text-[#0C4A6E] mb-3 text-sm font-bold text-right w-full">
                هل ستحضر؟
              </label>
              <div className="flex gap-2">
                <label
                  className={`flex-1 cursor-pointer rounded-xl border ${
                    rsvpData.status === 'attending'
                      ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                      : 'border-[#0EA5E9]/30 bg-white text-[#0C4A6E] hover:border-[#0EA5E9]/60'
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
                      ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                      : 'border-[#0EA5E9]/30 bg-white text-[#0C4A6E] hover:border-[#0EA5E9]/60'
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
                      ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                      : 'border-[#0EA5E9]/30 bg-white text-[#0C4A6E] hover:border-[#0EA5E9]/60'
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
                <label className="block text-[#0C4A6E] mb-4 text-xs font-bold text-center w-full">
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
                    className="w-10 h-10 rounded-full border border-[#0EA5E9]/40 bg-white flex items-center justify-center text-[#0369A1] hover:bg-[#E0F2FE] hover:text-[#0EA5E9] transition-colors"
                  >
                    <Minus size={16} strokeWidth={1.5} />
                  </button>
                  <span className="text-[#0C4A6E] font-bold text-lg w-4 text-center">
                    {rsvpData.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setRsvpData({ ...rsvpData, guests: (Number(rsvpData.guests) || 0) + 1 })
                    }
                    className="w-10 h-10 rounded-full border border-[#0EA5E9]/40 bg-white flex items-center justify-center text-[#0369A1] hover:bg-[#E0F2FE] hover:text-[#0EA5E9] transition-colors"
                  >
                    <Plus size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Congratulatory Wish Input Field */}
            <div className="mb-8">
              <label className="block text-[#0C4A6E] mb-2 text-xs font-bold flex items-center gap-2">
                كلمة وتهنئة للمولود ووالديه 👶💙
              </label>
              <textarea
                value={rsvpData.message}
                onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                placeholder="اكتب تهنئتك ودعواتك للمولود زين..."
                rows="3"
                className="w-full border border-[#0EA5E9]/30 rounded-xl px-4 py-3 bg-white text-[#0C4A6E] text-sm focus:outline-none focus:border-[#0EA5E9] transition-colors resize-none placeholder-[#0369A1]/50"
              ></textarea>
            </div>

            {/* Submit RSVP Confirmation Button */}
            <button
              type="submit"
              className="w-full bg-[#0EA5E9] text-white rounded-2xl py-4 mt-2 font-bold text-[15px] shadow-md hover:bg-[#0284C7] transition-colors flex items-center justify-center gap-2"
            >
              إرسال التأكيد
            </button>
          </form>
        </div>

        {/* Wishes / Greetings Wall Section ("كلمات المهنئين") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-[#0EA5E9]/30 rounded-full px-8 py-3 shadow-sm flex items-center justify-center gap-3">
            <span className="text-[20px] drop-shadow-sm">🍼</span>
            <h3 className={`text-2xl text-[#0C4A6E] font-bold ${aref.className}`}>
              كلمات المهنئين
            </h3>
          </div>
        </div>

        <div className="w-full px-6 mb-24 flex flex-col gap-4">
          {guestbookMessages.map((msg, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm border border-[#0EA5E9]/20 rounded-2xl p-5 shadow-[0_4px_20px_rgba(14,165,233,0.05)] flex items-center gap-4 relative overflow-hidden"
            >
              <div
                className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold ${msg.avatarColor} shadow-inner`}
              >
                {msg.avatarLetter}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-[#0C4A6E] font-bold text-lg mb-1">{msg.name}</h4>
                <p className="text-[#0369A1] text-[13px] leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Audio Stream Player (Newborn Celebration Song) */}
      <BackgroundMusic youtubeUrl="https://www.youtube.com/watch?v=yl7a-5yxEAI" autoPlay={true} />

      {/* Celebratory Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            colors={['#0EA5E9', '#0EA5E9', '#F0F9FF', '#38BDF8', '#0369A1']}
          />
        </div>
      )}

      {/* VIP QR Code Entry Pass Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-[#F0F9FF] border-2 border-[#0EA5E9] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center shadow-2xl relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-[#0369A1] hover:text-[#0C4A6E] transition-colors bg-[#E0F2FE] p-2 rounded-full"
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

            <h3 className={`text-4xl text-[#0EA5E9] font-bold mb-4 ${aref.className} mt-2`}>
              شكراً لتأكيد حضورك!
            </h3>

            {rsvpData.status === 'attending' ? (
              <>
                <p className="text-[#0C4A6E] text-center mb-6 text-[14px] leading-relaxed">
                  نسعد جداً بحضوركم حفل استقبال مولودنا زين. يُرجى الاحتفاظ ببطاقة الدخول الذكية
                  (QR Code) وإبرازها عند الاستقبال.
                </p>

                <div className="bg-white p-2 rounded-xl shadow-[0_5px_15px_rgba(14,165,233,0.2)] border border-[#0EA5E9]/20 mb-6 flex justify-center items-center">
                  <QRCodeCanvas
                    value={`BEGIN:VCARD\nVERSION:3.0\nFN:${rsvpData.name || 'ضيف'}\nORG:بطاقة دعوة - استقبال المولود زين\nNOTE:عدد المرافقين: ${rsvpData.guests}\nEND:VCARD`}
                    size={180}
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <p className="text-[#0369A1] font-bold text-xl mb-1">{rsvpData.name || 'ضيف'}</p>
                <p className="text-[#0EA5E9] text-sm font-bold">المرافقين: {rsvpData.guests}</p>
              </>
            ) : (
              <p className="text-[#0C4A6E] text-center mb-6 text-[15px] leading-relaxed mt-4">
                {rsvpData.status === 'not_attending'
                  ? 'نشكرك على ردك اللطيف، ونتمنى لك دوام الصحة والسعادة، وسنفتقدك بالتأكيد في يومنا هذا.'
                  : 'نشكرك على ردك اللطيف، ونتمنى أن تتمكن من مشاركتنا فرحتنا قريباً.'}
              </p>
            )}

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-8 bg-[#0EA5E9] text-white px-10 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#A88461] transition-all w-full"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
