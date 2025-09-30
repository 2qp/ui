import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import { transformers } from "@/lib/highlight-code";

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypeCodeOptions: { theme: "dark-plus", transformers },
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ]);
      return plugins;
    },
  },
});

const metadataSchema = frontmatterSchema.extend({
  links: z
    .object({
      doc: z.string().optional(),
      api: z.string().optional(),
    })
    .optional(),
});

type MetaData = z.infer<typeof metadataSchema>;

const docs = defineDocs({
  dir: "src/content/docs",
  docs: {
    schema: metadataSchema,
  },
});

export { docs };
export type { MetaData };
