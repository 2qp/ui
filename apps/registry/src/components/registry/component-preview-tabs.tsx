"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

import type { VariantProps } from "class-variance-authority";

const previewTabsVariants = cva("", {
  variants: {
    height: {
      sm: "h-[300px]",
      md: "h-[500px]",
      lg: "h-[600px]",
      custom: "",
      default: "h-[450px]",
    },
  },
  defaultVariants: {
    height: "default",
  },
});

type PrevieTabswVariants = VariantProps<typeof previewTabsVariants>;

export function ComponentPreviewTabs({
  className,
  align = "center",
  hideCode = false,
  component,
  source,
  height,

  ...props
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  component: React.ReactNode;
  source: React.ReactNode;
} & PrevieTabswVariants) {
  const [tab, setTab] = React.useState("preview");

  return (
    <div
      className={cn("group relative mt-4 mb-12 flex flex-col gap-2", className)}
      {...props}
    >
      <Tabs
        className="relative mr-auto w-full"
        value={tab}
        onValueChange={setTab}
      >
        <div className="flex items-center justify-between">
          {!hideCode && (
            <TabsList className="justify-start gap-4 rounded-none bg-transparent px-2 md:px-0">
              <TabsTrigger
                value="preview"
                className="text-muted-foreground data-[state=active]:text-foreground px-0 text-base data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="text-muted-foreground data-[state=active]:text-foreground px-0 text-base data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
              >
                Code
              </TabsTrigger>
            </TabsList>
          )}
        </div>
      </Tabs>

      <div
        className={cn(
          "relative rounded-lg border overflow-hidden md:-mx-1",
          previewTabsVariants({ height })
        )}
      >
        <div
          data-slot="preview"
          data-active={tab === "preview"}
          className={cn(
            "absolute inset-0 transition-opacity duration-75 ease-in-out",
            tab === "preview" ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <div
            data-align={align}
            className={cn(
              "preview flex h-full w-full justify-center",
              "data-[align=center]:items-center",
              "data-[align=start]:items-start",
              "data-[align=end]:items-end"
            )}
          >
            {component}
          </div>
        </div>

        <div
          data-slot="code"
          className={cn(
            "absolute inset-0 transition-opacity duration-75 ease-in-out",
            tab === "code" ? "opacity-100 visible" : "opacity-0 invisible",
            "**:[figure]:!m-0"
          )}
        >
          <ScrollArea className={cn("w-full", previewTabsVariants({ height }))}>
            <div className="p-4">{source}</div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export type { PrevieTabswVariants };
