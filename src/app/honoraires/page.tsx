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
    <div className="space-y-6">
      <PageHeader
        title={page?.h1 ?? page?.title ?? "Honoraires"}
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Honoraires" },
        ]}
      />

      {page?.html ? (
        <Prose html={page.html} />
      ) : (
        <p className="text-sm text-slate-600">Contenu en cours de migration.</p>
      )}
    </div>
  );
}
