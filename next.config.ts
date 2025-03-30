import type { NextConfig } from "next";


// return `https://via.placeholder.com/800x1200/${color}/FFFFFF?text=${encodedTitle}`

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
      {
        hostname:"via.placeholder.com"
      },
      {
        hostname:"picsum.photos"
      }
    ],
  },
  
  /* config options here */
};

export default nextConfig;
