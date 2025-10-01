import Image from "next/image";

import { ComponentPreviewTabs } from "@/components/registry/component-preview-tabs";
import { ComponentSource } from "@/components/registry/component-source";
import { getRegistryItem } from "@/lib/registry";
import { getPrompt } from "@/lib/utils";
import { getDemoComponents } from "@app/demo/[name]";
import { Renderer } from "@app/demo/[name]/renderer";
import { ComponentCard } from "./component-card";

export function ComponentPreview({
  name,
  type,
  className,
  align = "center",
  hideCode = false,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  align?: "center" | "start" | "end";
  description?: string;
  hideCode?: boolean;
  type?: "block" | "component" | "example";
}) {
  const component = getRegistryItem(name);

  const components = getDemoComponents(name);

  if (!component) {
    return (
      <p className="text-muted-foreground text-sm">
        Component{" "}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    );
  }

  if (type === "block") {
    return (
      <div className="relative aspect-[4/2.5] w-full overflow-hidden rounded-md border md:-mx-1">
        <Image
          src={`/r/styles/new-york-v4/${name}-light.png`}
          alt={name}
          width={1440}
          height={900}
          className="bg-background absolute top-0 left-0 z-20 w-[970px] max-w-none sm:w-[1280px] md:hidden dark:hidden md:dark:hidden"
        />
        <Image
          src={`/r/styles/new-york-v4/${name}-dark.png`}
          alt={name}
          width={1440}
          height={900}
          className="bg-background absolute top-0 left-0 z-20 hidden w-[970px] max-w-none sm:w-[1280px] md:hidden dark:block md:dark:hidden"
        />
        <div className="bg-background absolute inset-0 hidden w-[1600px] md:block">
          <iframe src={`/view/${name}`} className="size-full" />
        </div>
      </div>
    );
  }

  return (
    <ComponentPreviewTabs
      className={className}
      align={align}
      hideCode={hideCode}
      component={
        <ComponentCard
          baseUrl={process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ""}
          prompt={getPrompt()}
        >
          <div className="flex w-full flex-col gap-4">
            {components &&
              Object.entries(components).map(([key, node]) => (
                <div className="relative w-full" key={key}>
                  <Renderer>{node}</Renderer>
                </div>
              ))}
          </div>
        </ComponentCard>
      }
      source={<ComponentSource name={name} collapsible={false} />}
      {...props}
    />
  );
}
