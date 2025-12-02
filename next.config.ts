import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'utfs.io',
      'z5bvwccrbg.ufs.sh',
      'source.unsplash.com',
      'images.unsplash.com',
      'randomuser.me',
      ...(process.env.NEXT_PUBLIC_UPLOADTHING_URL ? [process.env.NEXT_PUBLIC_UPLOADTHING_URL.replace('https://', '')] : [])
    ],
    
    // If you have other domains, include them too:
    // domains: ['utfs.io', 'example.com', 'another-domain.com'],
    
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Suppress hydration warnings caused by browser extensions
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-navigation-menu', '@radix-ui/react-select']
  }
};

export default nextConfig;
