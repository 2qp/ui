import { createMDX } from "fumadocs-mdx/next";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { transformers } from "./src/local-lib/highlight-code";

import type { NextConfig } from "next";
import type { Options } from "rehype-pretty-code";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  //
  output: "export",
  trailingSlash: true,

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
  // async redirects() {
  //   return [
  //     {
  //       source: "/docs/components/:name",
  //       destination: "/registry/components/:name",
  //       permanent: true,
  //     },

  //     {
  //       source: "/registry/:name",
  //       destination: "/registry/components/:name",
  //       permanent: false,
  //     },
  //   ];
  // },
};

const options: Options = {
  transformers: transformers,
  // theme: {
  //   dark: "github-dark-dimmed", / "github-dark"
  //   light: "github-light",
  // },
  theme: "andromeeda",
};

// const withMDX = createMDX({
//   extension: /\.mdx?$/,
//   options: {
//     remarkPlugins: [remarkGfm],
//     rehypePlugins: [[rehypePrettyCode, options]],
//   },
// });

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

const withMDX = createMDX({});

export default withMDX(nextConfig);
