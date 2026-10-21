'use client';

/**
 * @file src/components/GSAPAnimations.jsx
 * @description Headless client helper component that initializes GSAP ScrollTrigger
 * reveal animations on all DOM elements matching the `.gs-reveal` selector.
 */

// 1. React and Next.js core modules
import { useEffect } from 'react';

// 2. Third-party libraries
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAPAnimations Component
 *
 * Registers `ScrollTrigger` on mount, animates `.gs-reveal` elements from `autoAlpha: 0, y: 50`
 * to `autoAlpha: 1, y: 0` as they enter the viewport, and cleans up triggers on unmount.
 *
 * @returns {null} Renders no DOM output.
 */
export default function GSAPAnimations() {
  useEffect(() => {
    // Register the GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Clear any existing ScrollTrigger instances (e.g., during development hot-reloads)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const elements = document.querySelectorAll('.gs-reveal');

    elements.forEach((elem) => {
      // Set initial hidden/offset state before scroll entry
      gsap.set(elem, { autoAlpha: 0, y: 50 });

      // Animate into view when the top of the element reaches 85% of the viewport height
      gsap.to(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        duration: 1,
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
      });
    });

    // Clean up all ScrollTrigger instances on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
