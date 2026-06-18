import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts the optimizer to this allowlist (default is [75]).
    // 75 keeps small thumbnails light; 90 is for full-bleed/feature imagery.
    qualities: [75, 90],
    // AVIF first for better quality-per-byte, WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
