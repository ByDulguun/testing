// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [160, 240, 320, 480, 640],

    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],

    minimumCacheTTL: 60 * 60 * 24, // 1 өдөр
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru", "mn", "kk"],
  },
};

export default nextConfig;
