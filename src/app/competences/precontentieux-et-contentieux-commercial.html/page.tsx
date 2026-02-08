import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

const PAGE_SLUG = "competences/precontentieux-et-contentieux-commercial.html";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUG);

  const title = page?.title ?? "Précontentieux et contentieux commercial";
  const description = page?.metaDescription ?? siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/competences/precontentieux-et-contentieux-commercial.html`,
    },
  };
}

export default async function PrecontentieuxEtContentieuxCommercialPage() {
  const page = await getPageBySlug(PAGE_SLUG);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          page?.h1
            ?? page?.title
            ?? "Précontentieux et contentieux commercial"
        }
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Compétences", href: "/competences" },
          { label: "Précontentieux et contentieux commercial" },
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
