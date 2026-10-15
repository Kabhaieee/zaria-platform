'use client';

import AnimatedSection from '@/components/AnimatedSection';
import HeroSection from '@/components/HeroSection';
import FloatingFeaturesBar from '@/components/FloatingFeaturesBar';
import TemplateGallery from '@/components/TemplateGallery';
import Partners from '@/components/Partners';
import BoutiqueProcess from '@/components/BoutiqueProcess';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen text-[#555555] font-sans relative">
      
      {/* Global Creamy Silk Background (Solid/Gradient) */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none bg-gradient-to-b from-[#F5EBE1] to-[#FAF6F3]">
      </div>

      <HeroSection />
      <FloatingFeaturesBar />

      <main>
        <AnimatedSection>
          <Partners />
        </AnimatedSection>

        <AnimatedSection>
          <TemplateGallery />
        </AnimatedSection>
        
        <AnimatedSection>
          <BoutiqueProcess />
        </AnimatedSection>
        
        <AnimatedSection>
          <Features />
        </AnimatedSection>
        
        <AnimatedSection>
          <Testimonials />
        </AnimatedSection>
        
        <AnimatedSection>
          <Pricing />
        </AnimatedSection>
        
        <AnimatedSection>
          <FAQ />
        </AnimatedSection>
        
        <AnimatedSection>
          <ContactCTA />
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
