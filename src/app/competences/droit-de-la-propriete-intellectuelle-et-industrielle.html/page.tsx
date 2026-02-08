import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

const PAGE_SLUG = "competences/droit-de-la-propriete-intellectuelle-et-industrielle.html";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUG);

  const title =
    page?.title ?? "Droit de la propriété intellectuelle et industrielle";
  const description = page?.metaDescription ?? siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical:
        `${BASE_URL}/competences/droit-de-la-propriete-intellectuelle-et-industrielle.html`,
    },
  };
}

export default async function DroitDeLaProprieteIntellectuelleEtIndustriellePage() {
  const page = await getPageBySlug(PAGE_SLUG);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          page?.h1
            ?? page?.title
            ?? "Droit de la propriété intellectuelle et industrielle"
        }
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Compétences", href: "/competences" },
          { label: "Droit de la propriété intellectuelle et industrielle" },
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
