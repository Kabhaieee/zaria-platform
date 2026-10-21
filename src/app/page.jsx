'use client';

/**
 * @file page.jsx
 * @description Main landing page of the ZARIA platform (`/`).
 * Composes the Hero banner, floating value-proposition bar, partner offers marquee,
 * template showcase gallery, 3-step boutique process, interactive feature explorer,
 * WhatsApp-styled client testimonials, pricing tiers, FAQ accordion, and contact CTA.
 */

// 3. Internal components, hooks, and utility functions
import AnimatedSection from '@/components/AnimatedSection';
import BoutiqueProcess from '@/components/BoutiqueProcess';
import ContactCTA from '@/components/ContactCTA';
import FAQ from '@/components/FAQ';
import Features from '@/components/Features';
import FloatingFeaturesBar from '@/components/FloatingFeaturesBar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Partners from '@/components/Partners';
import Pricing from '@/components/Pricing';
import TemplateGallery from '@/components/TemplateGallery';
import Testimonials from '@/components/Testimonials';

/**
 * Renders the primary ZARIA marketing home page with scroll-triggered section animations.
 *
 * @returns {JSX.Element} The complete home page view.
 */
export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen text-[#555555] font-sans relative">
      {/* Global Creamy Silk Background (Fixed behind all sections) */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none bg-gradient-to-b from-[#F5EBE1] to-[#FAF6F3]" />

      {/* Above-the-fold Hero & Floating Highlights Bar */}
      <HeroSection />
      <FloatingFeaturesBar />

      {/* Main Marketing Sections wrapped in viewport-triggered reveal animations */}
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

      {/* Global Site Footer */}
      <Footer />
    </div>
  );
}
