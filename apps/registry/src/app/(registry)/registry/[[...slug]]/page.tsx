import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { source } from "@/lib/source";
import { COMPONENTS } from "mdx-components";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const params = source.generateParams();

  return params;
}

export default async function RegistryItemPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  try {
    const { slug } = await params;

    const page = source.getPage(slug);

    if (!page) {
      notFound();
    }

    const doc = page?.data;

    const MDX = doc.body;

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
            <h1 className="font-bold text-3xl tracking-tight">{doc.title}</h1>
          </div>
        </div>

        <MDX components={COMPONENTS} />
      </div>
    );
  } catch (err) {
    return notFound();
  }
}
