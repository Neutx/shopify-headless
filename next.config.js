/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Increase timeout for image optimization (default is 10s, set to 30s)
    minimumCacheTTL: 60,
    // Disable image optimization in development if issues persist
    // unoptimized: process.env.NODE_ENV === 'development',
  },
  // Enable compression
  compress: true,
  // Enable typed routes (moved from experimental in Next.js 15)
  typedRoutes: true,
};

module.exports = nextConfig;

