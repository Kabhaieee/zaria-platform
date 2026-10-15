'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { notFound } from 'next/navigation';
import { use } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export default function DemoPage({ params }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  
  // This would typically come from a database or a templates config file
  const validTemplates = ['wedding-royal', 'wedding-classic', 'engagement-floral', 'graduation-modern', 'birthday-fun', 'newborn-cute', 'graduation-notebook'];
  
  if (!validTemplates.includes(slug)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black w-full" dir="rtl">
      {/* 
        This is a clean slate page. 
        It has no Navbar or Footer. 
        We pass the slug to the TemplateRenderer to render the specific design.
      */}
      <TemplateRenderer templateId={slug} />
    </div>
  );
}
