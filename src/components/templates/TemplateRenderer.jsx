'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, MessageCircle, Heart, Music, Play, Pause } from 'lucide-react';
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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const DesignComponent = designs[templateId] || WeddingRoyal; // fallback to WeddingRoyal

  if (!isLoaded) return null;

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden relative font-sans text-white">
      <DesignComponent />
    </div>
  );
}
