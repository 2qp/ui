import Link from "next/link";

import {
  MobileSidebarTrigger,
  RegistrySidebar,
} from "@/components/registry/registry-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function NotFound() {
  return (
    <SidebarProvider>
      <MobileSidebarTrigger />
      <RegistrySidebar />
      <main className="flex w-full justify-center">
        <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
          <h1 className="font-bold text-6xl text-muted-foreground tracking-tight md:text-8xl">
            404
          </h1>
          <h2 className="mt-8 font-semibold text-2xl tracking-tight md:text-3xl">
            Page Not Found
          </h2>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/r/registry.json">View Registry</Link>
            </Button>
          </div>
        </div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
