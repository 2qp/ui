import { docs } from ".source";
import { loader } from "fumadocs-core/source";

import type { PageData, SourceConfig } from "fumadocs-core/source";
import type { MDXProps } from "mdx/types";
import type { FC } from "react";
import type { MetaData } from "source.config";

type CustomPageData = PageData &
  MetaData & {
    body: FC<MDXProps>;
  };

type CustomSourceConfig = SourceConfig & {
  pageData: CustomPageData;
};

// interface CustomLoaderPlugins
//   extends LoaderPlugins<
//     CustomSourceConfig["pageData"],
//     CustomSourceConfig["metaData"]
//   > {}

// const bodyPlugin: gg[number] = {
//   transformPageTree: {
//     file(node, file) {
//       // access the original (unfiltered) file data
//       if (file) console.log(this.storage.read(file));
//       // modify nodes
//       node.name = "";
//       return node;
//     },
//   },
// };

export const source = loader<CustomSourceConfig, undefined>({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  // plugins: [bodyPlugin],
});
