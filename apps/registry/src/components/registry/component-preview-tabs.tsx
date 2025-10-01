"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import * as React from "react";

export function ComponentPreviewTabs({
  className,
  align = "center",
  hideCode = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  component: React.ReactNode;
  source: React.ReactNode;
}) {
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

      <div className="relative h-[450px] rounded-lg border overflow-hidden md:-mx-1">
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
          data-active={tab === "code"}
          className={cn(
            "absolute inset-0 transition-opacity duration-75 ease-in-out overflow-hidden",
            tab === "code" ? "opacity-100 visible" : "opacity-0 invisible",
            "**:[figure]:!m-0 **:[pre]:h-[450px]"
          )}
        >
          <div className="h-full w-full">{source}</div>
        </div>
      </div>
    </div>
  );
}
