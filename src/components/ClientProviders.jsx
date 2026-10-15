'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { Toaster } from 'sonner';

export default function ClientProviders({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {children}
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#111111', color: '#F5EFEA', border: '1px solid #C49A6C' } }} />
    </ReactLenis>
  );
}
