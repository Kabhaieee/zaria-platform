/**
 * @file next.config.js
 * @description Next.js configuration for the ZARIA platform.
 * Defines allowed development origins and supported image optimization qualities.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['shanna-warmish-gema.ngrok-free.dev'],
  images: {
    qualities: [75, 100],
  },
};

module.exports = nextConfig;
