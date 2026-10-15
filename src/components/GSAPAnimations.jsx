'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GSAPAnimations() {
  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial clean up in case of hot-reloads
    ScrollTrigger.getAll().forEach(t => t.kill());

    const elements = document.querySelectorAll('.gs-reveal');

    elements.forEach((elem) => {
      // Set initial state
      gsap.set(elem, { autoAlpha: 0, y: 50 });

      // Animate on scroll
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

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
