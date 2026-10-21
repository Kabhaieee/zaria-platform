'use client';

/**
 * @file src/components/templates/TemplateRenderer.jsx
 * @description Dynamic template dispatcher and wrapper for all interactive ZARIA
 * invitation demos (`/demo/[slug]`). Resolves the appropriate design component
 * by `templateId` and renders a floating "رجوع" (Back) button whose color palette
 * automatically adapts to match each template's light or dark background theme.
 */

// 1. React and Next.js core modules
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { ArrowRight } from 'lucide-react';

// 3. Internal components, hooks, and utility functions
import BirthdayFun from './designs/BirthdayFun';
import EngagementFloral from './designs/EngagementFloral';
import GraduationModern from './designs/GraduationModern';
import GraduationNotebook from './designs/GraduationNotebook';
import NewbornCute from './designs/NewbornCute';
import WeddingClassic from './designs/WeddingClassic';
import WeddingRoyal from './designs/WeddingRoyal';

/**
 * Lookup map associating each template slug with its corresponding React component.
 * @type {Record<import('@/types/zaria').TemplateSlug, React.ComponentType>}
 */
const designs = {
  'wedding-royal': WeddingRoyal,
  'wedding-classic': WeddingClassic,
  'engagement-floral': EngagementFloral,
  'graduation-modern': GraduationModern,
  'graduation-notebook': GraduationNotebook,
  'birthday-fun': BirthdayFun,
  'newborn-cute': NewbornCute,
};

/**
 * Per-template floating Back button color palettes tailored to harmonize with each
 * template's background luminance and primary accent color.
 * @type {Record<import('@/types/zaria').TemplateSlug, import('@/types/zaria').BackButtonThemeStyle>}
 */
const backButtonStyles = {
  'wedding-royal': {
    button:
      'bg-[#141414]/85 hover:bg-[#1f1f1f] text-[#EADBD1] border-[#D1B06B]/50 hover:border-[#D1B06B] shadow-[0_8px_25px_rgba(0,0,0,0.45)]',
    icon: 'text-[#D1B06B]',
  },
  'wedding-classic': {
    button:
      'bg-[#FDFBF9]/90 hover:bg-white text-[#4A3728] border-[#C49A6C]/50 hover:border-[#C49A6C] shadow-[0_6px_20px_rgba(196,154,108,0.22)]',
    icon: 'text-[#C49A6C]',
  },
  'engagement-floral': {
    button:
      'bg-white/90 hover:bg-white text-[#4A3B52] border-[#9A7EAC]/45 hover:border-[#9A7EAC] shadow-[0_6px_20px_rgba(154,126,172,0.22)]',
    icon: 'text-[#9A7EAC]',
  },
  'graduation-modern': {
    button:
      'bg-white/90 hover:bg-white text-[#1E3A8A] border-[#1E3A8A]/35 hover:border-[#1E3A8A] shadow-[0_6px_20px_rgba(30,58,138,0.18)]',
    icon: 'text-[#1E3A8A]',
  },
  'graduation-notebook': {
    button:
      'bg-white/90 hover:bg-white text-[#5B1E2B] border-[#5B1E2B]/30 hover:border-[#5B1E2B] shadow-[0_6px_20px_rgba(91,30,43,0.18)]',
    icon: 'text-[#5B1E2B]',
  },
  'birthday-fun': {
    button:
      'bg-[#FDF2F8]/90 hover:bg-white text-[#831843] border-[#EC4899]/45 hover:border-[#EC4899] shadow-[0_6px_20px_rgba(236,72,153,0.22)]',
    icon: 'text-[#EC4899]',
  },
  'newborn-cute': {
    button:
      'bg-[#F0F9FF]/90 hover:bg-white text-[#0C4A6E] border-[#0EA5E9]/45 hover:border-[#0EA5E9] shadow-[0_6px_20px_rgba(14,165,233,0.22)]',
    icon: 'text-[#0EA5E9]',
  },
};

/**
 * TemplateRenderer Component
 *
 * @param {Object} props - Component props.
 * @param {import('@/types/zaria').TemplateSlug | string} props.templateId - Slug identifier of the template to render.
 * @returns {JSX.Element | null} The theme-aware back button and rendered invitation template.
 */
export default function TemplateRenderer({ templateId }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /**
   * Navigates back to the previous page in browser history if available,
   * or falls back to the `/templates` collection page.
   */
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/templates');
    }
  };

  // Resolve target design component and corresponding back button theme
  const DesignComponent = designs[templateId] || WeddingRoyal;
  const currentStyle = backButtonStyles[templateId] || backButtonStyles['wedding-royal'];

  if (!isLoaded) return null;

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden relative font-sans text-white">
      {/* Theme-Adaptive Floating Back Button ("رجوع") */}
      <button
        onClick={handleBack}
        aria-label="رجوع"
        dir="rtl"
        className={`fixed top-5 right-5 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-105 group cursor-pointer ${currentStyle.button}`}
      >
        <ArrowRight
          className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${currentStyle.icon}`}
        />
        <span className="text-sm font-bold tracking-wide">رجوع</span>
      </button>

      {/* Active Invitation Template Component */}
      <DesignComponent />
    </div>
  );
}
