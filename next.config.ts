import type { NextConfig } from "next";


// return `https://via.placeholder.com/800x1200/${color}/FFFFFF?text=${encodedTitle}`

const nextConfig: NextConfig = {
  images: {
    domains:['http://localhost'],
    remotePatterns: [
      
      {
        hostname : "res.cloudinary.com"
        
      },
      {
        hostname:"via.placeholder.com"
      },
      {
        hostname:"picsum.photos"
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  /* config options here */
};

export default nextConfig;
