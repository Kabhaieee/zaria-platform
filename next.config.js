/**
 * @file next.config.js
 * @description Next.js configuration for the ZARIA platform.
 * Defines allowed development origins, supported image optimization qualities,
 * and standard HTTP security headers across all routes.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['shanna-warmish-gema.ngrok-free.dev'],
  images: {
    qualities: [75, 100],
  },
  /**
   * Applies standard HTTP security headers across all application routes.
   *
   * @returns {Promise<Array<{ source: string, headers: Array<{ key: string, value: string }> }>>}
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
