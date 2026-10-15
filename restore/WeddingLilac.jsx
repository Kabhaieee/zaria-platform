'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell, CalendarDays, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Aref_Ruqaa, Amiri } from 'next/font/google';
import BackgroundMusic from '../../BackgroundMusic';

const aref = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400', '700'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

// Reusable SVG Flower Icon
const LilacFlower = ({ className = "w-4 h-4 text-[#9A7EAC]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C13.1 4.5 15.5 6.9 18 8C15.5 9.1 13.1 11.5 12 14C10.9 11.5 8.5 9.1 6 8C8.5 6.9 10.9 4.5 12 2Z" />
    <path d="M12 10C13.1 12.5 15.5 14.9 18 16C15.5 17.1 13.1 19.5 12 22C10.9 19.5 8.5 17.1 6 16C8.5 14.9 10.9 12.5 12 10Z" opacity="0.6"/>
  </svg>
);

export default function WeddingLilac() {
  const [doorState, setDoorState] = useState('closed'); // 'closed', 'opening', 'opened'
  const videoRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 100, hours: 23, minutes: 33, seconds: 9 });

  // RSVP State
  const [guests, setGuests] = useState(0);
  const [attendance, setAttendance] = useState('yes'); // yes, no, maybe

  // Simulate a countdown
  useEffect(() => {
    if (doorState !== 'opened') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [doorState]);

  const handleOpenDoor = () => {
    setDoorState('opening');
    window.dispatchEvent(new Event('start-wedding-music'));
  };

  return (
    <div className={`w-full min-h-screen bg-[#FDFBF9] overflow-x-hidden ${amiri.className}`} dir="rtl">
      
      {/* Scattered background flowers (subtle) */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-40">
         <div className="absolute top-[5%] left-[10%]"><LilacFlower className="w-5 h-5 text-[#9A7EAC]" /></div>
         <div className="absolute top-[25%] right-[15%] opacity-50"><LilacFlower className="w-8 h-8 text-[#9A7EAC]" /></div>
         <div className="absolute top-[45%] left-[20%]"><LilacFlower className="w-4 h-4 text-[#9A7EAC]" /></div>
         <div className="absolute top-[70%] right-[10%]"><LilacFlower className="w-6 h-6 text-[#9A7EAC]" /></div>
         <div className="absolute top-[85%] left-[15%]"><LilacFlower className="w-5 h-5 text-[#9A7EAC]" /></div>
      </div>
      
      {/* THE DOOR (Overlay & Cinematic Intro) */}
      <AnimatePresence>
        {doorState !== 'opened' && (
          <motion.div 
            key="main-door-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
          >
            {/* The Cinematic Door Video */}
            <motion.div 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ backgroundImage: 'url("/door-poster.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
              animate={{ scale: doorState === 'opening' ? 1.2 : 1, filter: doorState === 'opening' ? 'brightness(2)' : 'brightness(1)' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              onAnimationComplete={() => { if(doorState === 'opening') setDoorState('opened') }}
            />
            
            {/* The Button - Fades out immediately when opening starts */}
            <AnimatePresence>
              {doorState === 'closed' && (
                <motion.div 
                  key="entry-button"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex flex-col items-center w-full px-4"
                >
                  <button 
                    onClick={handleOpenDoor}
                    className="w-full h-screen bg-transparent flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-white/80 text-sm font-medium tracking-widest mb-6">دعوة زفاف</span>
                    <h1 className={`text-[7rem] font-bold text-white drop-shadow-lg leading-none ${aref.className}`}>محمد</h1>
                    <span className={`text-4xl text-white drop-shadow-md block my-1 ${aref.className}`}>&</span>
                    <h1 className={`text-[7rem] font-bold text-white drop-shadow-lg mb-8 leading-none ${aref.className}`}>زينب</h1>
                    
                    <p className="text-sm font-bold text-white drop-shadow-md mb-8">يوم الجمعة، ٢٠ تشرين الثاني ٢٠٢٦</p>
                    
                    <h2 className={`text-3xl text-white drop-shadow-md ${aref.className}`}>فتحنا باب فرحتنا... وطارت البشائر تدعوكم</h2>
                    
                    <div className="mt-16 text-white text-sm font-bold flex flex-col items-center drop-shadow-md">
                      <span>مرّر للأسفل</span>
                      <div className="w-px h-10 bg-white mt-3 opacity-80 animate-bounce"></div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>


          </motion.div>
        )}
      </AnimatePresence>

      {/* The Flash out for the invitation content */}
      <AnimatePresence>
        {doorState === 'opened' && (
          <motion.div
            key="flash-overlay"
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* MOBILE CONSTRAINED CONTAINER */}
      <div className="mx-auto max-w-md w-full min-h-screen relative overflow-hidden text-[#5A4F46] pb-24">
        
        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={doorState === 'opened' ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center w-full mb-12"
          >
            <h3 className={`text-4xl text-[#5A4F46] mb-8 font-bold ${aref.className}`}>بسم الله الرحمن الرحيم</h3>
            
            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-6" />

            <p className="text-xl leading-loose font-bold text-[#8B6CA8] max-w-[300px] mx-auto mb-10 text-center" style={{ lineHeight: '2.2' }}>
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </p>

            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-10" />

            {/* Invitation Card section */}
            <div className="w-full px-4 text-center relative mb-12">
              <h3 className={`text-4xl text-[#5A4F46] mb-2 font-bold ${aref.className}`}>بطاقة دعوة</h3>
              
              {/* Lilac Underline */}
              <div className="w-24 h-1 bg-[#9A7EAC] mx-auto rounded-full mb-10 opacity-70"></div>
              
              <p className="text-lg leading-loose mb-12 font-bold text-[#5A4F46] max-w-[280px] mx-auto">
                بقلوبٍ مفعمةٍ بالفرح والسرور، نفتح لكم باب فرحتنا وندعوكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.
              </p>

              <LilacFlower className="w-4 h-4 text-[#9A7EAC] mx-auto mb-8" />

              <div className="flex justify-between items-start text-sm font-bold mb-10 px-2">
                <div className="flex-1 text-center">
                  <p className="text-[#8B6CA8] mb-3 font-bold text-xs">والدا العروس</p>
                  <p className="leading-loose text-[#5A4F46]">كريمة السيّد سامي حسن و<br/>السيّدة رنا</p>
                </div>
                <div className="mt-8 mx-2 text-[#9A7EAC]">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[#8B6CA8] mb-3 font-bold text-xs">والدا العريس</p>
                  <p className="leading-loose text-[#5A4F46]">نجل السيّد كريم عبد الله و<br/>السيّدة هدى</p>
                </div>
              </div>
            </div>

            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-8" />

            {/* Countdown */}
            <h3 className={`text-4xl text-[#5A4F46] mb-2 font-bold ${aref.className}`}>باقي على فرحنا</h3>
            <div className="w-20 h-1 bg-[#9A7EAC] mx-auto rounded-full mb-10 opacity-70"></div>
            
            <div className="flex justify-center gap-3 mb-16 w-full px-2" dir="rtl">
              {[
                { label: 'يوم', value: timeLeft.days },
                { label: 'ساعة', value: timeLeft.hours },
                { label: 'دقيقة', value: timeLeft.minutes },
                { label: 'ثانية', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="w-[70px] h-[90px] bg-gradient-to-b from-white to-[#F6F4EF] border border-[#E5DCD1] rounded-2xl flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                  <span className="text-2xl font-bold font-sans text-[#5A4F46] mb-1">{item.value.toString().padStart(2, '0')}</span>
                  <span className="text-xs font-bold text-[#8B6CA8]">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* Program Timeline */}
            <div className="flex items-center justify-center gap-2 mb-12">
               <LilacFlower className="w-4 h-4 text-[#9A7EAC]" />
               <h3 className={`text-4xl text-[#5A4F46] font-bold mx-2 ${aref.className}`}>برنامج الحفل</h3>
               <LilacFlower className="w-4 h-4 text-[#9A7EAC]" />
            </div>
            
            <div className="w-full flex flex-col mb-16 px-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-[#8B6CA8] opacity-40 -translate-x-1/2"></div>
              
              {[
                { time: '٧:٠٠ مساءً', event: 'استقبال الضيوف', active: true },
                { time: '٧:٣٠ مساءً', event: 'عقد القران' },
                { time: '٩:٠٠ مساءً', event: 'العشاء' },
                { time: '١٠:٠٠ مساءً', event: 'السهرة' },
              ].map((prog, idx) => (
                <div key={idx} className="flex items-center justify-between relative py-6">
                  <div className="text-[#5A4F46] font-bold w-[45%] text-left text-sm">{prog.time}</div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF9] px-1 z-10">
                    {prog.active ? (
                      <LilacFlower className="w-8 h-8 text-[#9A7EAC]" />
                    ) : (
                      <div className="w-2.5 h-2.5 rotate-45 bg-[#8B6CA8]"></div>
                    )}
                  </div>
                  <div className="w-[45%] text-right font-bold text-[#5A4F46] text-sm pr-2">{prog.event}</div>
                </div>
              ))}
            </div>

            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-12" />

            {/* Location */}
            <h3 className={`text-4xl text-[#5A4F46] mb-2 font-bold ${aref.className}`}>مكان الحفل</h3>
            <div className="w-16 h-1 bg-[#9A7EAC] mx-auto rounded-full mb-8 opacity-70"></div>
            
            <div className="text-center font-bold text-lg leading-relaxed mb-6">
              <p className="text-[#5A4F46] mb-2">قاعة بابل الكبرى</p>
              <p className="text-sm text-[#8A7968]">بغداد — المنصور</p>
            </div>
            
            <div className="flex justify-center mb-16">
              <a href="#" className="bg-[#8B6CA8] text-white px-10 py-3.5 rounded-full font-bold text-sm shadow-md hover:bg-[#72578C] transition-colors flex items-center gap-2">
                <MapPin size={16} /> الموقع على الخريطة
              </a>
            </div>

            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-12" />

            {/* Notes */}
            <h3 className={`text-4xl text-[#5A4F46] mb-8 font-bold ${aref.className}`}>تنويهات</h3>
            
            <div className="w-full bg-white border border-[#8B6CA8] rounded-2xl p-6 mb-12 relative shadow-sm mt-8">
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#F6F4EF] rounded-full border-4 border-[#FDFBF9] flex items-center justify-center shadow-inner">
                  <Bell className="w-8 h-8 text-[#C4A692]" fill="currentColor" />
               </div>
               
               <p className="text-center font-bold text-[#8A7968] text-xs mt-6 mb-3">تنويه مهم</p>
               <h4 className={`text-2xl text-center text-[#5A4F46] font-bold ${aref.className}`}>جنة الأطفال منازلهم 🏠</h4>
            </div>

            <ul className="text-sm font-bold flex flex-col gap-6 text-right mb-16 w-full px-2 text-[#5A4F46]">
              <li className="flex items-center gap-3"><LilacFlower className="w-4 h-4 text-[#9A7EAC]" /> يُرجى الحضور قبل الموعد بنصف ساعة</li>
              <li className="flex items-center gap-3"><LilacFlower className="w-4 h-4 text-[#9A7EAC]" /> الدعوة تشمل حاملها والعائلة الكريمة</li>
            </ul>

            {/* Footer Connect */}
            <div className="text-center mb-16">
              <p className="text-xs text-[#8B6CA8] font-bold mb-4">للتواصل والتأكيد</p>
              <div className="flex justify-center gap-2">
                <a href="#" className="text-lg font-bold text-[#5A4F46] flex items-center gap-2">
                  أبو محمد ☎
                </a>
              </div>
            </div>

            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-10" />

            {/* Save the Date */}
            <div className="mb-10 flex items-center justify-center gap-2 font-bold text-[#8B6CA8]">
              <LilacFlower className="w-5 h-5 text-[#9A7EAC]" />
              <h3 className={`text-4xl mt-2 ${aref.className}`}>احفظ الموعد</h3>
              <LilacFlower className="w-5 h-5 text-[#9A7EAC]" />
            </div>

            <div className="w-[280px] mx-auto bg-white rounded-2xl shadow-sm border border-[#E5DCD1] overflow-hidden mb-16 text-center">
               <div className="bg-[#8B6CA8] text-white py-4 font-bold text-lg relative">
                 <div className="absolute top-1 left-8 w-2 h-3 bg-[#FDFBF9] rounded-b-md"></div>
                 <div className="absolute top-1 right-8 w-2 h-3 bg-[#FDFBF9] rounded-b-md"></div>
                 تشرين الثاني 2026
               </div>
               <div className="py-6">
                 <p className="text-[#8A7968] font-bold text-sm mb-2">الجمعة</p>
                 <p className="text-6xl font-serif text-[#8B6CA8] mb-4">20</p>
                 <p className="text-[#8A7968] font-bold text-sm">الساعة السابعة مساءً</p>
               </div>
            </div>

            <h3 className={`text-4xl text-[#5A4F46] mb-6 font-bold ${aref.className}`}>حضوركم يفتح أبواب سعادتنا</h3>
            <p className="text-sm font-bold text-[#5A4F46] mb-6">عائلة عبد الله & عائلة حسن</p>
            <p className="text-xs font-bold text-[#8B6CA8] mb-12">#محمد_وزينب</p>

            <LilacFlower className="w-5 h-5 text-[#9A7EAC] mx-auto mb-12" />

          </motion.div>
        </div>
      </div>

      {/* Background Music Player */}
      <BackgroundMusic youtubeUrl="https://www.youtube.com/watch?v=Hp8WTVqR_0U" />

    </div>
  );
}
