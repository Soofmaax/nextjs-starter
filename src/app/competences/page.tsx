import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("competences");

  const title = page?.title ?? "Compétences";
  const description = page?.metaDescription ?? siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/competences`,
    },
  };
}

export default async function CompetencesPage() {
  const page = await getPageBySlug("competences");

  return (
    <div className="space-y-6">
      <PageHeader
        title={page?.h1 ?? page?.title ?? "Compétences"}
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Compétences" },
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
