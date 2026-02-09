import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("honoraires");

  const title = page?.title ?? "Honoraires";
  const description = page?.metaDescription ?? siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/honoraires`,
    },
  };
}

export default async function HonorairesPage() {
  const page = await getPageBySlug("honoraires");

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageHeader
        title={page?.h1 ?? page?.title ?? "Honoraires"}
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Honoraires" },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        {page?.html ? (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--surface-bg)] px-6 py-7 sm:px-8 sm:py-9">
            <Prose html={page.html} />
          </div>
        ) : (
          <p className="text-sm text-slate-600">Contenu en cours de migration.</p>
        )}
      </div>
    </div>
  );
}
