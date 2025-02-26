import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false,
  },
  transpilePackages: ["next-mdx-remote"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    //@ts-ignore
    rehypePlugins: [
      [
        //@ts-ignore
        "rehype-pretty-code",
        {
          theme: "github-dark",
        },
      ],
      // //@ts-ignore
      // ["rehype-slug"],
      // //@ts-ignore
      // [
      //   //@ts-ignore
      //   "@jsdevtools/rehype-toc",
      // ],
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
