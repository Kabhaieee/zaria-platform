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

  if (!isLoaded) return null;

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden relative font-sans text-white">
      {/* Floating Back Button across all templates */}
      <button
        onClick={handleBack}
        aria-label="رجوع"
        dir="rtl"
        className="fixed top-5 right-5 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/75 hover:bg-black/90 text-white backdrop-blur-md border border-[#C49A6C]/50 shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:border-[#C49A6C] group cursor-pointer"
      >
        <ArrowRight className="w-4 h-4 text-[#C49A6C] transition-transform duration-300 group-hover:translate-x-1" />
        <span className="text-sm font-medium tracking-wide">رجوع</span>
      </button>

      <DesignComponent />
    </div>
  );
}

