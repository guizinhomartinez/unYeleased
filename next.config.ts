import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
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

export default withMDX(nextConfig);
