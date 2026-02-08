import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPostsIndex } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-static";

interface PublicationsActualitesPageProps {
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Publications & actualités",
    description: siteConfig.description,
    alternates: {
      canonical: `${BASE_URL}/publications-actualites`,
    },
  };
}

export default async function PublicationsActualitesPage({
  searchParams,
}: PublicationsActualitesPageProps) {
  const pageParam = searchParams?.page;
  const page = Number(pageParam) > 1 ? Number(pageParam) : 1;
  const pageSize = 10;

  const posts = await getPostsIndex();
  const total = posts.length;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const slice = posts.slice(start, end);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publications & actualités"
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Publications & actualités" },
        ]}
      />

      {slice.length === 0 ? (
        <p className="text-sm text-slate-600">Contenu en cours de migration.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {slice.map((post) => (
              <ArticleCard
                key={post.slug}
                href={`/${post.slug}`}
                title={post.title ?? post.slug}
                date={post.date}
                category={post.category}
                excerpt={post.metaDescription}
              />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            basePath="/publications-actualites"
          />
        </>
      )}
    </div>
  );
}
