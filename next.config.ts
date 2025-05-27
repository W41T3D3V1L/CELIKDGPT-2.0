
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn3d.iconscout.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdmntprnorthcentralus.oaiusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.oaiusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media1.giphy.com', // Added for feedback bot GIF
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
