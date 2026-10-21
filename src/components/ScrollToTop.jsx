'use client';

/**
 * @file src/components/ScrollToTop.jsx
 * @description Headless client utility component that disables browser automatic
 * scroll restoration and resets the window scroll position to `(0, 0)` on initial mount.
 */

// 1. React and Next.js core modules
import { useEffect } from 'react';

/**
 * ScrollToTop Component
 *
 * @returns {null} Renders no DOM output.
 */
export default function ScrollToTop() {
  useEffect(() => {
    // Disable automatic scroll restoration by the browser history API
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force viewport scroll position to top-left on mount
    window.scrollTo(0, 0);
  }, []);

  return null;
}
