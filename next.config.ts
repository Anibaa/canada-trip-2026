import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Few widths = fewer variants per photo, so "Save for offline" (public/sw.js) can store
    // exactly what a phone requests: 828 on 2x screens, 1080 on 3x. Sources are ≤960 px anyway.
    deviceSizes: [640, 828, 1080],
    imageSizes: [256, 384],
  },
};

export default nextConfig;
