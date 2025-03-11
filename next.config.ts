import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  images: {
    domains:['http://localhost'],
    remotePatterns: [
      {
        hostname : "res.cloudinary.com"
    
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
