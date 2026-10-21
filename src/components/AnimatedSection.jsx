'use client';

/**
 * @file src/components/AnimatedSection.jsx
 * @description Reusable Framer Motion scroll-reveal wrapper component.
 * Animates child elements smoothly upward and into view once they enter the viewport.
 */

// 1. Third-party libraries
import { motion } from 'framer-motion';

/**
 * AnimatedSection Component
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child nodes to animate on scroll.
 * @param {string} [props.className=''] - Optional CSS/Tailwind utility classes.
 * @param {number} [props.delay=0] - Optional animation start delay in seconds.
 * @returns {JSX.Element} The animated container div.
 */
export default function AnimatedSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
