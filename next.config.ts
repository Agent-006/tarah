import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'utfs.io',
      'z5bvwccrbg.ufs.sh',
      'source.unsplash.com',
      ...(process.env.NEXT_PUBLIC_UPLOADTHING_URL ? [process.env.NEXT_PUBLIC_UPLOADTHING_URL.replace('https://', '')] : [])
    ],
    // If you have other domains, include them too:
    // domains: ['utfs.io', 'example.com', 'another-domain.com'],
    
  },
};

export default nextConfig;
