import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'utfs.io',
      'z5bvwccrbg.ufs.sh',
      'source.unsplash.com',
      'images.unsplash.com',
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
};

export default nextConfig;
