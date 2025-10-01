import { notFound } from "next/navigation";

import { demos, getDemoComponents } from "@app/demo/[name]/index";

import { getRegistryItem } from "@/lib/registry";
import { Renderer } from "@app/demo/[name]/renderer";

export async function generateStaticParams() {
  return Object.keys(demos).map((name) => ({
    name,
  }));
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const component = getRegistryItem(name);

  if (!component) {
    notFound();
  }

  const components = getDemoComponents(name);

  return (
    <div className="flex w-full flex-col gap-4">
      {components &&
        Object.entries(components).map(([key, node]) => (
          <div className="relative w-full" key={key}>
            <Renderer>{node}</Renderer>
          </div>
        ))}
    </div>
  );
}
