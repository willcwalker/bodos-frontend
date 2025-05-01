import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,

  // disable all ESLint errors on build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
