import { transformers } from "./src/local-lib/highlight-code";
import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

import type { NextConfig } from "next";
import type { Options } from "rehype-pretty-code";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  //

  webpack(config, { isServer }) {
    config.externals = config.externals || [];
    config.externals.push("tsconfig-paths");

    //
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
        ],
      },
    ];
  },
};

const options: Options = {
  transformers: transformers,
  // theme: {
  //   dark: "github-dark-dimmed", / "github-dark"
  //   light: "github-light",
  // },
  theme: "andromeeda",
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, options]],
  },
});

// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [
//       // Without options
//       "remark-gfm",
//     ],
//     rehypePlugins: [
//       // Without options
//       [
//         "rehype-pretty-code",
//         {
//           theme: {
//             dark: "github-dark",
//             light: "github-light-default",
//           },
//           // transformers,
//         },
//       ],
//     ],
//   },
// });

export default withMDX(nextConfig);
