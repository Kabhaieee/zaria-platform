'use client';

/**
 * @file EngagementFloral.jsx
 * @description Engagement Floral digital invitation template ("الخطوبة الملكية — لافندر").
 * Features a lavender and white floral aesthetic, a cinematic video door preloader,
 * a hero background video, an ornamental framed invitation card, a live countdown timer,
 * a scroll-linked floral timeline, an embedded Google Map, a photo gallery, a Save-the-Date
 * calendar card, an interactive RSVP form ("تأكيد الحضور"), a live Wishes/Greetings guestbook
 * ("كلمات المهنئين"), background music, confetti celebrations, and a VIP QR code pass modal.
 */

// 1. React and Next.js core modules
import { useEffect, useRef, useState } from 'react';
import { Amiri, Aref_Ruqaa } from 'next/font/google';
import Image from 'next/image';

// 2. Third-party libraries
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Minus, Phone, Plus } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Confetti from 'react-confetti';

// 3. Internal components, hooks, and utility functions
import BackgroundMusic from '../../BackgroundMusic';

// Configure Arabic typography fonts
const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

// Theme color constants for the Engagement Floral palette
const ZARIA_GOLD = '#9A7EAC';
const ZARIA_CREAM_DARK = '#FFFFFF';

/**
 * Formats a numeric value as a string for display in the countdown timer.
 *
 * @param {number|string} num - The number to format.
 * @returns {string} Formatted numeric string.
 */
const toArabic = (num) => {
  return String(num);
};

/**
 * Decorative minimalist corner SVG rendered at the four corners of the main invitation frame.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS utility classes.
 * @param {string} [props.color] - Stroke and fill color.
 * @returns {JSX.Element} The rendered corner ornament SVG.
 */
const ElegantCorner = ({ className = 'w-4 h-4', color = ZARIA_GOLD }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12V4H12" />
    <path d="M8 8L2 2" />
    <circle cx="16" cy="4" r="1" fill={color} stroke="none" />
    <circle cx="4" cy="16" r="1" fill={color} stroke="none" />
  </svg>
);

/**
 * Five-petal floral SVG icon used for bullet points in the notes section.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS utility classes.
 * @param {string} [props.color] - Fill and stroke color.
 * @returns {JSX.Element} The rendered flower bullet SVG.
 */
const FlowerBullet = ({ className = 'w-3.5 h-3.5 mt-1 text-[#9A7EAC]', color = '#9A7EAC' }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <g fill={color}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx="50" cy="22" r="22" transform={`rotate(${deg} 50 50)`} />
      ))}
    </g>
    <circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke={color} strokeWidth="4" />
  </svg>
);

/**
 * Reusable scroll-triggered fade-in animation wrapper for invitation sections.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child elements to animate into view.
 * @param {number} [props.delay=0] - Optional animation start delay in seconds.
 * @returns {JSX.Element} Animated container element.
 */
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    className="w-full flex flex-col items-center"
  >
    {children}
  </motion.div>
);

/**
 * Five-petal lavender flower SVG indicator that travels along the vertical program timeline track.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS utility classes.
 * @returns {JSX.Element} The rendered scrolling flower SVG.
 */
const ScrollFlower = ({ className = 'w-6 h-6 text-[#9A7EAC]' }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <g fill="currentColor">
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx="50" cy="22" r="22" transform={`rotate(${deg} 50 50)`} />
      ))}
    </g>
    <circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke="currentColor" strokeWidth="4" />
  </svg>
);

/**
 * EngagementFloral Template Component.
 * Renders the complete interactive engagement invitation experience.
 *
 * @returns {JSX.Element} The rendered EngagementFloral template.
 */
export default function EngagementFloral() {
  // Reference and scroll progress binding for the vertical program timeline indicator
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });
  const flowerTop = useTransform(timelineScroll, [0, 1], ['5%', '95%']);

  /**
   * Calculates the remaining time until the engagement celebration date.
   *
   * @returns {import('@/types/zaria').CountdownTimeLeft} Remaining days, hours, minutes, and seconds.
   */
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-11-29T21:00:00') - +new Date();
    let remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      remaining = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return remaining;
  };

  // Component state for countdown, RSVP form, confetti, QR modal, viewport dimensions, and preloader door
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpData, setRsvpData] = useState({ name: '', guests: 0, status: 'attending', message: '' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [doorState, setDoorState] = useState('waiting'); // 'waiting' -> 'opening' -> 'done'
  const videoRef = useRef(null);

  // Initial Wishes & Greetings ("كلمات المهنئين") displayed in the guestbook
  const [guestbookMessages, setGuestbookMessages] = useState([
    { name: 'أم محمد', message: 'ألف مبروك 🤍 بالرفاه والبنين إن شاء الله، فرحتكم فرحتنا', avatarColor: 'bg-[#A888B5]', avatarLetter: 'أ' },
    { name: 'سارة', message: 'عقبال ما نفرح بيكم بأحلى المناسبات، دعوة بغاية الذوق 🤩', avatarColor: 'bg-[#6B4B75]', avatarLetter: 'س' },
    { name: 'حيدر', message: 'مبارك الزواج، الله يجعل أيامكم كلها أفراح', avatarColor: 'bg-[#BE955C]', avatarLetter: 'ح' },
    { name: 'نور الهدى', message: 'بيت جديد عامر بالمحبة إن شاء الله، ألف مبروك', avatarColor: 'bg-[#7D8F69]', avatarLetter: 'ن' },
    { name: 'أبو علي', message: 'الله يبارك لكما ويبارك عليكما ويجمع بينكما في خير', avatarColor: 'bg-[#B399D4]', avatarLetter: 'أ' },
  ]);

  /**
   * Handles RSVP form submission:
   * 1. Prepends the guest's greeting message to the guestbook if non-empty.
   * 2. Triggers confetti animation for attending guests and opens the QR code modal.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   */
  const handleRSVPSubmit = (e) => {
    e.preventDefault();

    // 1. Add greeting message to the guestbook if provided
    if (rsvpData.message.trim()) {
      const colors = ['bg-[#A888B5]', 'bg-[#6B4B75]', 'bg-[#BE955C]', 'bg-[#7D8F69]', 'bg-[#B399D4]'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const firstLetter = rsvpData.name ? rsvpData.name.trim().charAt(0) : 'ز';

      setGuestbookMessages((prev) => [
        { name: rsvpData.name || 'ضيف', message: rsvpData.message, avatarColor: randomColor, avatarLetter: firstLetter },
        ...prev,
      ]);

      // Clear the message input while retaining the guest's name for the QR pass
      setRsvpData((prev) => ({ ...prev, message: '' }));
    }

    // 2. Trigger celebratory confetti and display the QR pass modal
    if (rsvpData.status === 'attending') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
    setShowQRModal(true);
  };

  // Initialize viewport size and start the 1-second countdown interval on mount
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Google Calendar deep link URL for the engagement event
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('حفل خطوبة المهندس عمر العمري والدكتورة آيات الخطيب')}&dates=20261129T180000Z/20261129T210000Z&details=${encodeURIComponent('نتشرف بحضوركم حفل خطوبتنا')}&location=${encodeURIComponent('فندق فور سيزونز عمان')}`;

  /**
   * Generates and triggers an `.ics` calendar file download for Apple/iOS Calendar.
   */
  const handleAppleCalendar = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Zaria//Wedding//AR\nBEGIN:VEVENT\nSUMMARY:حفل خطوبة المهندس عمر العمري والدكتورة آيات الخطيب\nDTSTART:20261129T180000Z\nDTEND:20261129T210000Z\nLOCATION:فندق فور سيزونز عمان\nDESCRIPTION:نتشرف بحضوركم حفل خطوبتنا\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding_invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`w-full min-h-screen bg-[${ZARIA_CREAM_DARK}] overflow-x-hidden ${amiri.className}`} dir="rtl">
      {/* Cinematic Preloader Door Overlay */}
      <AnimatePresence>
        {doorState !== 'done' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFFFF]"
          >
            {/* Preloader background video */}
            <video
              ref={videoRef}
              src="/wedding_preloader.mp4"
              poster="/wedding_preloader_poster.jpg"
              muted
              playsInline
              onEnded={() => setDoorState('done')}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
            />

            {/* Dark contrast overlay while waiting for user interaction */}
            {doorState === 'waiting' && (
              <div className="absolute inset-0 bg-black/20 z-10 transition-opacity" />
            )}

            {/* Interactive glassmorphism button to open the invitation */}
            {doorState === 'waiting' && (
              <motion.button
                type="button"
                aria-label="فتح الدعوة"
                onClick={() => {
                  setDoorState('opening');
                  window.dispatchEvent(new Event('start-wedding-music'));
                  if (videoRef.current) {
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }
                }}
                className="z-30 flex flex-col items-center justify-center px-10 py-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-pointer hover:bg-white/15 hover:scale-105 transition-all text-center min-w-[260px] relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Hover shimmer highlight */}
                <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

                <span className="text-[#E8DCC8] font-['Aref_Ruqaa'] text-xl mb-3 opacity-90 tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>دعوة خطوبة</span>
                <span className="text-white font-['Aref_Ruqaa'] text-5xl mb-8" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>عمر و آيات</span>

                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/50" />
                  <span className="text-white/90 text-sm font-medium tracking-widest uppercase">اضغط لفتح الدعوة</span>
                  <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/50" />
                </div>
              </motion.button>
            )}

            {/* Skip button displayed while the door opening video is playing */}
            {doorState === 'opening' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => setDoorState('done')}
                className="absolute bottom-12 px-8 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-medium border border-white/30 hover:bg-white/40 transition-colors shadow-lg z-30"
              >
                تخطي
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Intro Section */}
      <section className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black text-[#fdf8f5]">
        {/* Looping background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
          src="/hero.mp4"
          poster="/hero_poster.jpg"
          loop
          muted
          playsInline
          ref={(el) => {
            if (el) {
              const p = el.play();
              if (p !== undefined) p.catch(() => {});
            }
          }}
        />

        {/* Gradient overlays for text contrast */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

        <motion.div
          className="relative z-20 flex flex-col items-center text-center px-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.p
            className="text-sm md:text-base mb-6 font-['Noto_Naskh_Arabic'] opacity-90 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            بسم الله الرحمن الرحيم
          </motion.p>

          <motion.div
            className="flex items-center gap-2 mb-8 opacity-70"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d4b886]" />
            <b className="text-[#d4b886] text-xs">♦</b>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d4b886]" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            عمر
          </motion.h1>

          <motion.div
            className="text-2xl md:text-3xl font-light text-[#d4b886] mb-4 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.9 }}
          >
            &amp;
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
          >
            آيات
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl font-['Aref_Ruqaa'] opacity-90 mb-8 max-w-sm mx-auto drop-shadow-md text-[#fdf8f5]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            يتشرّفان بدعوتكم لمشاركتهما فرحة العمر
          </motion.p>

          <motion.p
            className="text-sm md:text-base opacity-80 mb-4 tracking-widest font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.1 }}
          >
            —
          </motion.p>

          <motion.p
            className="text-lg md:text-xl font-['Aref_Ruqaa'] text-[#d4b886] drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.4 }}
          >
            حكاية عمرٍ تبدأ
          </motion.p>
        </motion.div>

        {/* Animated Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 z-20 flex flex-col items-center gap-2 text-white/80"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-[11px] font-medium tracking-widest bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">مرّر للأسفل</span>
          <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </section>

      {/* Main Invitation Content Container */}
      <div className="mx-auto max-w-md w-full bg-[#FFFFFF] relative text-[#5A4F46] pb-24 overflow-x-hidden pt-12 px-4 shadow-2xl">
        {/* Ornamental Framed Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full bg-[#FFFFFF] flex flex-col items-center pt-10 pb-12 px-2 shadow-sm border border-[#9A7EAC]/30"
        >
          {/* Decorative Frame Corners */}
          <div className="absolute -top-[1px] -left-[1px] bg-[#FFFFFF] p-1"><ElegantCorner className="w-5 h-5 text-[#9A7EAC]" /></div>
          <div className="absolute -top-[1px] -right-[1px] bg-[#FFFFFF] p-1"><ElegantCorner className="w-5 h-5 text-[#9A7EAC] rotate-90" /></div>
          <div className="absolute -bottom-[1px] -left-[1px] bg-[#FFFFFF] p-1"><ElegantCorner className="w-5 h-5 text-[#9A7EAC] -rotate-90" /></div>
          <div className="absolute -bottom-[1px] -right-[1px] bg-[#FFFFFF] p-1"><ElegantCorner className="w-5 h-5 text-[#9A7EAC] rotate-180" /></div>

          {/* Framed Content Wrapper */}
          <div className="relative z-20 flex flex-col items-center w-full">
            {/* Bismillah & Quranic Verse */}
            <h2 className={`text-[#5A4F46] text-3xl mb-4 text-center font-bold ${aref.className}`}>
              بسم الله الرحمن الرحيم
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC]"></div>
            </div>
            <p className="text-[#8B6CA8] text-base md:text-lg mb-4 leading-loose text-center px-6 font-medium">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC]"></div>
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
            </div>

            {/* Invitation Heading & Welcome Text */}
            <h3 className={`text-4xl text-[#9A7EAC] mb-8 font-bold ${aref.className}`}>بطاقة دعوة</h3>
            <p className="text-[14px] leading-[2.2] mb-12 text-[#5A4F46] text-center px-4 max-w-[300px]">
              بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل خطوبتنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.
            </p>

            {/* Parents & Couple Names */}
            <div className="flex justify-between items-start text-[14px] font-bold w-full px-2 mb-12 mt-4">
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-[#8A7968] text-[11px] mb-3">والد العريس</p>
                <p className="leading-relaxed text-[#5A4F46] mb-5">الدكتور سهيل أبو عمر<br />وعائلته الكريمة</p>
                <p className={`text-[22px] text-[#9A7EAC] font-bold leading-tight ${aref.className}`}>المهندس<br />عمر العمري</p>
              </div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC] mt-7 mx-2 opacity-60"></div>
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-[#8A7968] text-[11px] mb-3">والد العروس</p>
                <p className="leading-relaxed text-[#5A4F46] mb-5">المهندس علي أبو نضال<br />وعائلته الكريمة</p>
                <p className={`text-[22px] text-[#9A7EAC] font-bold leading-tight ${aref.className}`}>الدكتورة<br />آيات الخطيب</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC]"></div>
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
            </div>

            {/* Live Countdown Timer */}
            <FadeIn>
              <h3 className={`text-3xl text-[#9A7EAC] mb-8 font-bold ${aref.className}`}>يبدأ الاحتفال بعد</h3>
              <div className="flex justify-center gap-3 mb-10 w-full px-4">
                {[
                  { label: 'يوم', value: timeLeft.days },
                  { label: 'ساعة', value: timeLeft.hours },
                  { label: 'دقيقة', value: timeLeft.minutes },
                  { label: 'ثانية', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div key={idx} className="w-[65px] h-[75px] bg-[#FFFFFF] border border-[#9A7EAC]/30 rounded-xl flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-bold font-sans text-[#9A7EAC] mb-1">{toArabic(item.value.toString().padStart(2, '0'))}</span>
                    <span className="text-[11px] font-bold text-[#8A7968]">{item.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC]"></div>
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
            </div>

            {/* Program Timeline Section */}
            <FadeIn>
              <div className="w-full flex flex-col items-center py-10 relative">
                <h3 className={`text-4xl text-[#9A7EAC] mb-12 font-bold z-10 ${aref.className}`}>برنامج الحفل</h3>

                <div className="relative w-full flex flex-col px-0 max-w-sm z-10" ref={timelineRef}>
                  {/* Vertical Track Line */}
                  <div className="absolute right-[95px] md:right-[105px] top-6 bottom-6 w-px bg-[#9A7EAC]/30"></div>

                  {/* Scroll-Linked Flower Indicator */}
                  <motion.div
                    className="absolute right-[95px] md:right-[105px] translate-x-1/2 flex items-center justify-center z-20"
                    style={{ top: flowerTop }}
                  >
                    <ScrollFlower className="w-8 h-8 text-[#9A7EAC] drop-shadow-[0_0_8px_rgba(154,126,172,0.4)]" />
                  </motion.div>

                  {[
                    { time: '9:00 – 9:20', event: 'استقبال الضيوف', desc: 'استقبال وترحيب بالضيوف مع موسيقى هادئة وضيافة خفيفة.' },
                    { time: '9:20 – 9:35', event: 'دخول العروسين 🤍', desc: 'دخول العروسين لبدء حفل الخطوبة وسط أجواء احتفالية.' },
                    { time: '9:35 – 9:50', event: 'الرقصة الأولى', desc: 'لحظة رومانسية احتفالاً بالخطوبة.' },
                    { time: '9:50 – 10:10', event: 'فرحة الأهل', desc: 'رقص واحتفال مع الأهل والمقرّبين.' },
                    { time: '10:10 – 10:40', event: 'أجواء الحفل 💃🏻🕺🏻', desc: 'موسيقى ورقص واحتفال مع جميع الحضور.' },
                    { time: '10:40 – 10:50', event: 'ضيافة ومشروبات ☕️', desc: 'تقديم الضيافة والمشروبات للضيوف.' },
                    { time: '10:50 – 11:00', event: 'الختام 🤍', desc: 'آخر لحظات الاحتفال، صور جماعية، وتوديع الضيوف.' },
                  ].map((prog, idx) => (
                    <div key={idx} className="flex flex-row-reverse items-start py-8 relative z-10">
                      {/* Left Side: Event Title & Description */}
                      <div className="flex-1 text-right pr-4">
                        <h4 className="text-[#5A4F46] text-[22px] font-bold mb-2 font-['Aref_Ruqaa']" style={{ fontFamily: 'var(--font-aref-ruqaa), serif' }}>{prog.event}</h4>
                        <p className="text-[#8A7968] text-[14px] leading-relaxed">{prog.desc}</p>
                      </div>

                      {/* Middle: Static Diamond Node */}
                      <div className="w-[50px] shrink-0 flex flex-col items-center justify-start pt-3">
                        <div className="w-2 h-2 rotate-45 bg-[#9A7EAC] opacity-50 shadow-[0_0_8px_rgba(154,126,172,0.3)]"></div>
                      </div>

                      {/* Right Side: Time Slot */}
                      <div className="w-[70px] md:w-[80px] shrink-0 text-left pt-2 pl-2">
                        <span className="text-[#8A7968] opacity-90 text-[13px] font-bold tracking-wider font-sans" dir="ltr">{prog.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <div className="mb-14"></div>

            {/* Venue Location & Embedded Google Map */}
            <FadeIn>
              <h3 className={`text-4xl text-[#9A7EAC] mb-8 font-bold ${aref.className}`}>الموقع</h3>
              <div className="w-full max-w-[300px] h-48 bg-[#F3EEF5] rounded-xl mb-6 border border-[#9A7EAC]/30 shadow-sm relative overflow-hidden group mx-auto">
                <iframe
                  title="موقع الحفل - فندق فور سيزونز عمان"
                  src="https://maps.google.com/maps?q=Four%20Seasons%20Hotel%20Amman&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="text-center font-bold text-[14px] leading-relaxed mb-8 text-[#5A4F46]">
                <p className="mb-3">يوم الأحد، 29 تشرين الثاني 2026</p>
                <p className="text-[#8A7968] mb-6 text-[12px]">الساعة التاسعة مساءً</p>
                <p className={`text-[#9A7EAC] mb-3 font-normal text-2xl ${aref.className}`}>فندق فور سيزونز</p>
                <p className="text-[#8A7968] text-[13px]">عمان — الأردن</p>
              </div>

              <a href="https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman" target="_blank" rel="noopener noreferrer" className="bg-[#9A7EAC] text-white px-8 py-2.5 rounded-full text-[13px] font-bold shadow-md hover:bg-[#72578C] transition-all inline-block mb-4">الموقع على الخريطة</a>
            </FadeIn>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC]"></div>
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
            </div>

            {/* Event Notes Section */}
            <FadeIn>
              <h3 className={`text-4xl text-[#9A7EAC] mb-10 font-bold ${aref.className}`}>ملاحظات</h3>
              <ul className="text-[14px] font-bold flex flex-col gap-6 text-right w-full px-6 text-[#5A4F46]">
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#9A7EAC] opacity-70" />
                  <span>يُرجى الحضور قبل الموعد بنصف ساعة</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#9A7EAC] opacity-70" />
                  <span>نتشرّف بحضوركم بأبهى حلّة</span>
                </li>
                <li className="flex items-start justify-center gap-3 text-center">
                  <FlowerBullet className="w-3.5 h-3.5 mt-1 shrink-0 text-[#9A7EAC] opacity-70" />
                  <span>الدعوة تشمل حاملها</span>
                </li>
              </ul>
            </FadeIn>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-10 w-2/3 opacity-60">
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#9A7EAC]"></div>
              <div className="h-[1px] flex-1 bg-[#9A7EAC]"></div>
            </div>

            {/* Closing Contact & Family Signatures */}
            <FadeIn>
              <div className="text-center w-full font-bold">
                <h3 className={`text-3xl mb-5 text-[#5A4F46] ${aref.className}`}>حضوركم يزيّن فرحتنا</h3>
                <p className="text-[#9A7EAC] font-sans text-[14px] mb-12 tracking-wider">#عمر_وآيات</p>

                <p className="text-[12px] text-[#8A7968] mb-4">للاستفسار والتأكيد</p>
                <div className="flex justify-center mb-10">
                  <a href="https://wa.me/9647700000000" target="_blank" rel="noopener noreferrer" className="border border-[#9A7EAC]/50 rounded-full px-6 py-2 text-[13px] text-[#5A4F46] bg-transparent flex items-center gap-2 hover:bg-[#FFFFFF] transition-colors">
                    أبو عمر <Phone size={14} className="text-[#9A7EAC]" />
                  </a>
                </div>

                <p className="text-[13px] text-[#5A4F46] mb-8">عائلة العمري &amp; عائلة الخطيب</p>
              </div>
            </FadeIn>
          </div>
        </motion.div>

        {/* Photo Gallery Section Outside Frame */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <h3 className={`text-4xl text-[#9A7EAC] font-bold ${aref.className} flex flex-col items-center gap-3`}>
            بداية الحكاية
          </h3>
        </div>

        <div className="px-6 mb-16 w-full">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i, idx) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-xl overflow-hidden shadow-sm border border-[#9A7EAC]/20 ${idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'}`}
              >
                <Image
                  src={`/gallery-${i}.jpg`}
                  alt={`Memory ${i}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Save the Date Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center mt-12 mb-16 px-6"
        >
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl">🤍</span>
            <h3 className={`text-2xl text-[#8B6CA8] font-bold ${aref.className}`}>
              احفظ الموعد
            </h3>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl shadow-[0_10px_30px_rgba(139,108,168,0.15)] w-full max-w-sm overflow-hidden border border-[#8B6CA8]/20 relative">
            <div className="absolute top-0 left-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>
            <div className="absolute top-0 right-1/4 w-3 h-4 bg-gray-200 rounded-full border border-gray-300 -translate-y-1/2 z-10 shadow-sm"></div>

            <div className="bg-[#8B6CA8] text-white py-3 text-center font-bold text-lg pt-4">
              تشرين الثاني 2026
            </div>

            <div className="p-6 flex flex-col items-center relative">
              <p className="text-[#8B6CA8] font-bold text-lg mb-1">الأحد</p>
              <p className="text-8xl text-[#9A7EAC] font-light mb-2 leading-none">29</p>
              <p className="text-[#5A4F46] font-bold text-sm">الساعة التاسعة مساءً</p>
            </div>

            <div className="border-t border-dashed border-[#8B6CA8]/30 px-6 py-5 bg-white/50">
              <p className="text-center text-[#8A7968] text-xs font-bold mb-4">
                أضف الموعد إلى تقويم هاتفك بضغطة 📅
              </p>
              <div className="flex gap-3 justify-center">
                <a href={googleCalUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center border border-[#8B6CA8] text-[#8B6CA8] rounded-full py-2 text-xs font-bold hover:bg-[#8B6CA8] hover:text-white transition-colors block">
                  تقويم جوجل
                </a>
                <button onClick={handleAppleCalendar} className="flex-1 border border-[#8B6CA8] text-[#8B6CA8] rounded-full py-2 text-xs font-bold hover:bg-[#8B6CA8] hover:text-white transition-colors">
                  تقويم آيفون
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RSVP Form Section ("تأكيد الحضور") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <div className="text-center w-full relative z-10 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-2 opacity-80">
              <div className="w-12 h-[1px] bg-[#9A7EAC]"></div>
              <span className="text-xl">🤍</span>
              <div className="w-12 h-[1px] bg-[#9A7EAC]"></div>
            </div>
            <h3 className={`text-[42px] text-[#5A4F46] font-bold ${aref.className} mb-1 mt-2`}>
              تأكيد الحضور
            </h3>
            <p className="text-center text-[#8A7968] text-[15px] mb-2 font-bold">يسعدنا تأكيد حضوركم</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full px-6 mb-24"
        >
          <form onSubmit={handleRSVPSubmit} className="bg-[#FFFFFF] border border-[#9A7EAC]/40 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(196,154,108,0.1)] relative overflow-hidden">
            {/* Guest Full Name Input */}
            <div className="mb-5 mt-2">
              <label className="block text-[#8A7968] mb-2 text-xs font-bold">الاسم الكريم</label>
              <input
                type="text"
                required
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                placeholder="أدخل اسمك هنا..."
                className="w-full border-b border-[#9A7EAC]/30 bg-transparent px-2 py-2 text-[#5A4F46] text-sm focus:outline-none focus:border-[#9A7EAC] transition-colors placeholder-[#8A7968]/40"
              />
            </div>

            {/* Attendance Status Radio Selection */}
            <div className="mb-6">
              <label className="block text-[#5A4F46] mb-3 text-sm font-bold text-right w-full">هل ستحضر؟</label>
              <div className="flex gap-2">
                <label className={`flex-1 cursor-pointer rounded-xl border ${rsvpData.status === 'attending' ? 'bg-[#8B6CA8] border-[#8B6CA8] text-white' : 'border-[#9A7EAC]/30 bg-white text-[#5A4F46] hover:border-[#9A7EAC]/60'} py-2.5 text-center transition-colors text-[13px] font-bold`}>
                  <input type="radio" name="status" value="attending" checked={rsvpData.status === 'attending'} onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })} className="hidden" />
                  نعم
                </label>
                <label className={`flex-1 cursor-pointer rounded-xl border ${rsvpData.status === 'not_attending' ? 'bg-[#8B6CA8] border-[#8B6CA8] text-white' : 'border-[#9A7EAC]/30 bg-white text-[#5A4F46] hover:border-[#9A7EAC]/60'} py-2.5 text-center transition-colors text-[13px] font-bold`}>
                  <input type="radio" name="status" value="not_attending" checked={rsvpData.status === 'not_attending'} onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })} className="hidden" />
                  لا
                </label>
                <label className={`flex-1 cursor-pointer rounded-xl border ${rsvpData.status === 'maybe' ? 'bg-[#8B6CA8] border-[#8B6CA8] text-white' : 'border-[#9A7EAC]/30 bg-white text-[#5A4F46] hover:border-[#9A7EAC]/60'} py-2.5 text-center transition-colors text-[13px] font-bold`}>
                  <input type="radio" name="status" value="maybe" checked={rsvpData.status === 'maybe'} onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })} className="hidden" />
                  ربما
                </label>
              </div>
            </div>

            {/* Accompanying Guests Counter (Increment/Decrement) */}
            <AnimatePresence>
              {rsvpData.status !== 'not_attending' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                >
                  <label className="block text-[#5A4F46] mb-4 text-xs font-bold text-center w-full">عدد المرافقين (عدا حضورك - 0 إن كنت وحدك)</label>
                  <div className="flex items-center justify-center gap-6 w-full">
                    <button type="button" onClick={() => setRsvpData({ ...rsvpData, guests: Math.max(0, (Number(rsvpData.guests) || 0) - 1) })} className="w-10 h-10 rounded-full border border-[#9A7EAC]/40 bg-white flex items-center justify-center text-[#8A7968] hover:bg-[#FFFFFF] hover:text-[#9A7EAC] transition-colors">
                      <Minus size={16} strokeWidth={1.5} />
                    </button>
                    <span className="text-[#5A4F46] font-bold text-lg w-4 text-center">{rsvpData.guests}</span>
                    <button type="button" onClick={() => setRsvpData({ ...rsvpData, guests: (Number(rsvpData.guests) || 0) + 1 })} className="w-10 h-10 rounded-full border border-[#9A7EAC]/40 bg-white flex items-center justify-center text-[#8A7968] hover:bg-[#FFFFFF] hover:text-[#9A7EAC] transition-colors">
                      <Plus size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional Congratulatory Message Textarea */}
            <div className="mb-8">
              <label className="block text-[#5A4F46] mb-2 text-xs font-bold flex items-center gap-2">كلمة للعروسين 💌</label>
              <textarea
                value={rsvpData.message}
                onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                placeholder="اكتب تهنئتك للعروسين..."
                rows="3"
                className="w-full border border-[#9A7EAC]/30 rounded-xl px-4 py-3 bg-white text-[#5A4F46] text-sm focus:outline-none focus:border-[#9A7EAC] transition-colors resize-none placeholder-[#8A7968]/50"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-[#8B6CA8] text-white rounded-2xl py-4 mt-2 font-bold text-[15px] shadow-md hover:bg-[#72578C] transition-colors flex items-center justify-center gap-2">
              إرسال التأكيد
            </button>
          </form>
        </motion.div>

        {/* Wishes & Greetings Guestbook Section ("كلمات المهنئين") */}
        <div className="w-full flex justify-center mt-12 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-[#9A7EAC]/30 rounded-full px-8 py-3 shadow-sm flex items-center justify-center gap-3">
            <span className="text-[20px] drop-shadow-sm">🌹</span>
            <h3 className={`text-2xl text-[#5A4F46] font-bold ${aref.className}`}>
              كلمات المهنئين
            </h3>
          </div>
        </div>

        <div className="w-full px-6 mb-24 flex flex-col gap-4">
          {guestbookMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-sm border border-[#9A7EAC]/20 rounded-2xl p-5 shadow-[0_4px_20px_rgba(196,154,108,0.05)] flex items-center gap-4 relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold ${msg.avatarColor} shadow-inner`}>
                {msg.avatarLetter}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-[#5A4F46] font-bold text-lg mb-1">{msg.name}</h4>
                <p className="text-[#8A7968] text-[13px] leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Background Music Controller (Mabrouk Al Khoutube) */}
      <BackgroundMusic youtubeUrl="https://www.youtube.com/watch?v=7oouSAlrzbY" />

      {/* Celebratory Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            colors={['#9A7EAC', '#9A7EAC', '#FFFFFF', '#A888B5', '#8A7968']}
          />
        </div>
      )}

      {/* VIP QR Code Entry Pass Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FFFFFF] border-2 border-[#9A7EAC] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center shadow-2xl relative"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-[#8A7968] hover:text-[#5A4F46] transition-colors bg-[#EFE7DD] p-2 rounded-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>

              <h3 className={`text-4xl text-[#9A7EAC] font-bold mb-4 ${aref.className} mt-2`}>شكراً لتأكيد حضورك!</h3>

              {rsvpData.status === 'attending' ? (
                <>
                  <p className="text-[#5A4F46] text-center mb-6 text-[14px] leading-relaxed">
                    نحن متحمسون جداً لرؤيتك في حفل خطوبتنا. يُرجى الاحتفاظ ببطاقة الدخول الذكية (QR Code) وإبرازها لموظفي الاستقبال.
                  </p>

                  <div className="bg-white p-2 rounded-xl shadow-[0_5px_15px_rgba(196,154,108,0.2)] border border-[#9A7EAC]/20 mb-6 flex justify-center items-center">
                    <QRCodeCanvas
                      value={`BEGIN:VCARD\nVERSION:3.0\nFN:${rsvpData.name || 'ضيف'}\nORG:بطاقة صالحة - خطوبة عمر وآيات\nNOTE:عدد المرافقين: ${rsvpData.guests}\nEND:VCARD`}
                      size={180}
                      fgColor="#000000"
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <p className="text-[#8A7968] font-bold text-xl mb-1">{rsvpData.name || 'ضيف'}</p>
                  <p className="text-[#9A7EAC] text-sm font-bold">المرافقين: {rsvpData.guests}</p>
                </>
              ) : (
                <p className="text-[#5A4F46] text-center mb-6 text-[15px] leading-relaxed mt-4">
                  {rsvpData.status === 'not_attending'
                    ? 'نشكرك على ردك اللطيف، ونتمنى لك دوام الصحة والسعادة، وسنفتقدك بالتأكيد في يومنا هذا.'
                    : 'نشكرك على ردك اللطيف، ونتمنى أن تتمكن من مشاركتنا فرحتنا قريباً.'}
                </p>
              )}

              <button
                onClick={() => setShowQRModal(false)}
                className="mt-8 bg-[#9A7EAC] text-white px-10 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#72578C] transition-all w-full"
              >
                حسناً
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
