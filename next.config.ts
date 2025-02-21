import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false,
  },
  pageExtensions: [
    'js',
    'jsx',
    'md',
    'mdx',
    'ts',
    'tsx'
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/testing',
        permanent: true,
      },
    ]
  }
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx?$/,
  options: {
    //@ts-ignore
    rehypePlugins: [
      [
            //@ts-ignore
        'rehype-pretty-code',
        {
          theme: "github-dark"
        }
      ]
    ],
  }
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
