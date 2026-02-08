import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

const PAGE_SLUG = "competences/droit-de-la-consommation.html";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUG);

  const title = page?.title ?? "Droit de la consommation";
  const description = page?.metaDescription ?? siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/competences/droit-de-la-consommation.html`,
    },
  };
}

export default async function DroitDeLaConsommationPage() {
  const page = await getPageBySlug(PAGE_SLUG);

  return (
    <div className="space-y-8">
      <PageHeader
        title={page?.h1 ?? page?.title ?? "Droit de la consommation"}
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Compétences", href: "/competences" },
          { label: "Droit de la consommation" },
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
