import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.mscpressarea.com",
      },
    ],
  },
  // Allow Remotion compositions in dev without errors
  transpilePackages: ["remotion", "@remotion/player"],
};

export default nextConfig;
