import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/testing',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
