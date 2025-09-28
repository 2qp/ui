import registry from "@/registry";
import fs from "node:fs/promises";
import { Project, ScriptKind } from "ts-morph";

import type { Component } from "./registry";

export function getRegistryItems(): Component[] {
  return registry.items.filter(
    (item) => item.type !== "registry:style"
  ) as Component[];
}

export async function getRegistryItem(name: string): Promise<Component> {
  const components = getRegistryItems();
  const component = components.find((item) => item.name === name);

  if (!component) {
    throw new Error(`Component "${name}" not found`);
  }

  if (!component.files) {
    return component;
  }

  //
  const filesWithContent = await Promise.all(
    component.files.map(async (file) => {
      const content = await getFileContent(file);
      return { ...file, content };
    })
  );

  return { ...component, files: filesWithContent };
}

async function getFileContent(file: { path: string; type: string }) {
  const raw = await fs.readFile(file.path, "utf-8");

  const project = new Project({});

  const sourceFile = project.createSourceFile(file.path, raw, {
    scriptKind: file.path.endsWith(".tsx") ? ScriptKind.TSX : ScriptKind.TS,
    overwrite: true,
  });

  let code = sourceFile.getFullText();

  if (file.type !== "registry:page") {
    code = code.replaceAll("export default", "export");
  }

  code = fixImport(code);

  return code;
}

function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g;

  return content.replace(regex, (match, _path, type, component) => {
    if (type.endsWith("components")) {
      return `@/components/${component}`;
    } else if (type.endsWith("ui")) {
      return `@/components/ui/${component}`;
    } else if (type.endsWith("hooks")) {
      return `@/hooks/${component}`;
    } else if (type.endsWith("lib")) {
      return `@/lib/${component}`;
    }
    return match;
  });
}

export function getBlocks() {
  return getRegistryItems().filter((c) => c.type === "registry:block");
}

export function getUIPrimitives() {
  return getRegistryItems().filter((c) => c.type === "registry:ui");
}

export function getComponents() {
  return getRegistryItems().filter((c) => c.type === "registry:component");
}
