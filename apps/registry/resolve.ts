import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import JSON5 from "json5";
import { dirname, resolve } from "path";
import { pipeline } from "stream/promises";
import { createMatchPath } from "tsconfig-paths";

import type { ReadStream } from "fs";

const loadTsConfig = async (configPath: string) => {
  //

  try {
    const rawConfig = await readFile(configPath, "utf-8");
    return JSON5.parse(rawConfig);
  } catch (error) {
    throw new Error(
      `Failed to load or parse tsconfig.json at ${configPath}: ${error}`
    );
  }
};

//
const initializePathResolver = async () => {
  //

  const tsconfigPath = resolve("./tsconfig.json");

  const tsconfig = await loadTsConfig(tsconfigPath);
  const baseUrl = tsconfig.compilerOptions?.baseUrl || ".";
  const paths = tsconfig.compilerOptions?.paths || {};

  const resolvedBaseUrl = resolve(dirname(tsconfigPath), baseUrl);

  return createMatchPath(resolvedBaseUrl, paths);
};

//
const readFileAsStream = async (aliasPath: string): Promise<string> => {
  //

  const matchPath = await initializePathResolver();

  const resolvedPath = matchPath(aliasPath, undefined, undefined, [
    ".tsx",
    ".ts",
  ]);

  if (!resolvedPath) {
    throw new Error(`Could not resolve alias: ${aliasPath}`);
  }

  const content = await readFile(resolvedPath, "utf-8");

  const readStream: ReadStream = createReadStream(resolvedPath, {
    encoding: "utf-8",
  });

  await pipeline(readStream, async function* (source) {
    for await (const chunk of source) {
      // console.log("Stream chunk:", chunk);
      yield chunk;
    }
  });

  return content;
};

export { readFileAsStream };
