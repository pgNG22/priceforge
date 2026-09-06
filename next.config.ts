import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "store-images.s-microsoft.com",
      },
    ],
  },
};

export default nextConfig;