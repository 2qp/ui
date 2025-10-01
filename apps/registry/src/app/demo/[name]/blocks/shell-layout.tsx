import MinimalLayout from "@app/demo/[name]/blocks/minimal-layout";
import { Toaster } from "@/components/ui/sonner";

import type { ReactNode } from "react";

export default function ShellLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MinimalLayout>
      <main className="flex w-full justify-center">
        <div className="container">{children}</div>
      </main>
      {/* <Toaster /> */}
    </MinimalLayout>
  );
}
