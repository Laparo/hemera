import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // App Router is default in Next 13+, keep minimal flags
  },
};

export default nextConfig;
