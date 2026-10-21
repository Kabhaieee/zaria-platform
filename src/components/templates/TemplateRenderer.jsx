'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, MessageCircle, Heart, Music, Play, Pause, ArrowRight } from 'lucide-react';
import WeddingRoyal from './designs/WeddingRoyal';
import WeddingClassic from './designs/WeddingClassic';
import EngagementFloral from './designs/EngagementFloral';
import GraduationModern from './designs/GraduationModern';
import GraduationNotebook from './designs/GraduationNotebook';
import BirthdayFun from './designs/BirthdayFun';
import NewbornCute from './designs/NewbornCute';


// A mapping of slug to its specific design component
const designs = {
  'wedding-royal': WeddingRoyal,
  'wedding-classic': WeddingClassic,
  'engagement-floral': EngagementFloral,
  'graduation-modern': GraduationModern,
  'graduation-notebook': GraduationNotebook,
  'birthday-fun': BirthdayFun,
  'newborn-cute': NewbornCute,
};

// Per-template Back button styling matching each template's background & theme
const backButtonStyles = {
  'wedding-royal': {
    button: 'bg-[#141414]/85 hover:bg-[#1f1f1f] text-[#EADBD1] border-[#D1B06B]/50 hover:border-[#D1B06B] shadow-[0_8px_25px_rgba(0,0,0,0.45)]',
    icon: 'text-[#D1B06B]',
  },
  'wedding-classic': {
    button: 'bg-[#FDFBF9]/90 hover:bg-white text-[#4A3728] border-[#C49A6C]/50 hover:border-[#C49A6C] shadow-[0_6px_20px_rgba(196,154,108,0.22)]',
    icon: 'text-[#C49A6C]',
  },
  'engagement-floral': {
    button: 'bg-white/90 hover:bg-white text-[#4A3B52] border-[#9A7EAC]/45 hover:border-[#9A7EAC] shadow-[0_6px_20px_rgba(154,126,172,0.22)]',
    icon: 'text-[#9A7EAC]',
  },
  'graduation-modern': {
    button: 'bg-white/90 hover:bg-white text-[#1E3A8A] border-[#1E3A8A]/35 hover:border-[#1E3A8A] shadow-[0_6px_20px_rgba(30,58,138,0.18)]',
    icon: 'text-[#1E3A8A]',
  },
  'graduation-notebook': {
    button: 'bg-white/90 hover:bg-white text-[#5B1E2B] border-[#5B1E2B]/30 hover:border-[#5B1E2B] shadow-[0_6px_20px_rgba(91,30,43,0.18)]',
    icon: 'text-[#5B1E2B]',
  },
  'birthday-fun': {
    button: 'bg-[#FDF2F8]/90 hover:bg-white text-[#831843] border-[#EC4899]/45 hover:border-[#EC4899] shadow-[0_6px_20px_rgba(236,72,153,0.22)]',
    icon: 'text-[#EC4899]',
  },
  'newborn-cute': {
    button: 'bg-[#F0F9FF]/90 hover:bg-white text-[#0C4A6E] border-[#0EA5E9]/45 hover:border-[#0EA5E9] shadow-[0_6px_20px_rgba(14,165,233,0.22)]',
    icon: 'text-[#0EA5E9]',
  },
};

export default function TemplateRenderer({ templateId }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/templates');
    }
  };

  const DesignComponent = designs[templateId] || WeddingRoyal; // fallback to WeddingRoyal
  const currentStyle = backButtonStyles[templateId] || backButtonStyles['wedding-royal'];

  if (!isLoaded) return null;

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden relative font-sans text-white">
      {/* Floating Back Button adapted to each template's theme */}
      <button
        onClick={handleBack}
        aria-label="رجوع"
        dir="rtl"
        className={`fixed top-5 right-5 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-105 group cursor-pointer ${currentStyle.button}`}
      >
        <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${currentStyle.icon}`} />
        <span className="text-sm font-bold tracking-wide">رجوع</span>
      </button>

      <DesignComponent />
    </div>
  );
}

