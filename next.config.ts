import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'z5bvwccrbg.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  // Suppress hydration warnings caused by browser extensions
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-navigation-menu', '@radix-ui/react-select']
  }
};

export default nextConfig;
