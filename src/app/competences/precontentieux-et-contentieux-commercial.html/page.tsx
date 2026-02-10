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
  const canonical = `${BASE_URL}/competences/precontentieux-et-contentieux-commercial.html`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PrecontentieuxEtContentieuxCommercialPage() {
  const page = await getPageBySlug(PAGE_SLUG);

  return (
    <div className="space-y-8">
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

      <div className="mx-auto max-w-3xl">
        {page?.html ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
            <Prose html={page.html} />
          </div>
        ) : (
          <p className="text-sm text-slate-600">Contenu en cours de migration.</p>
        )}
      </div>
    </div>
  );
}
