'use client';

/**
 * @file src/components/ClientProviders.jsx
 * @description Root client-side wrapper providing smooth inertial scrolling via
 * `@studio-freight/react-lenis` and global toast notifications via `sonner`.
 */

// 1. Third-party libraries
import { ReactLenis } from '@studio-freight/react-lenis';
import { Toaster } from 'sonner';

/**
 * ClientProviders Component
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Application content wrapped in client providers.
 * @returns {JSX.Element} The Lenis smooth-scroll root and Sonner toast container.
 */
export default function ClientProviders({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#F5EFEA',
            border: '1px solid #C49A6C',
          },
        }}
      />
    </ReactLenis>
  );
}
