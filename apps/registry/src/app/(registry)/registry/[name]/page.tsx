import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getRegistryItems } from "@/lib/registry.server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const components = getRegistryItems();

  return components.map(({ name }) => ({
    name,
  }));
}

export default async function RegistryItemPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  try {
    const { default: Post, metadata } = await import(
      `@/content/docs/components/${name}.mdx`
    );

    return (
      <div className="container p-5 md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="font-bold text-3xl tracking-tight">
              {metadata?.title}
            </h1>
          </div>
        </div>

        <Post />
      </div>
    );
  } catch (err) {
    return notFound();
  }
}
