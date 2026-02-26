import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.futbin.com",
        pathname: "/content/fifa26/img/players/**",
      },
    ],
  },
};

export default nextConfig;
