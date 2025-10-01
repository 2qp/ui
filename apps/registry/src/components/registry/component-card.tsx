"use client";

import type { ReactNode } from "react";

interface ComponentCardProps {
  children?: ReactNode;
  baseUrl: string;
  prompt: string;
}

export function ComponentCard({
  children,
  baseUrl,
  prompt,
}: ComponentCardProps) {
  // const [copied, setCopied] = useState(false);

  // const registryUrl = `https://${baseUrl}/r/${component.name}.json`;
  // const npxCommand = `npx shadcn@latest add ${registryUrl}`;

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(npxCommand);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Failed to copy text: ", err);
  //   }
  // };

  return (
    <section className="h-full w-full">
      <div className="h-full w-full p-4">
        {/* <iframe
          id="iframe"
          src={`/demo/${component.name}`}
          className="h-full w-full"
          title="Page Preview"
        /> */}
        {children}
      </div>
    </section>
  );
}
