import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("partenariats");

  const title = page?.title ?? "Partenariats";
  const description = page?.metaDescription ?? siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/partenariats`,
    },
  };
}

export default async function PartenariatsPage() {
  const page = await getPageBySlug("partenariats");

  return (
    <div className="space-y-8">
      <PageHeader
        title={page?.h1 ?? page?.title ?? "Partenariats"}
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Partenariats" },
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
