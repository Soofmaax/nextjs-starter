import type { Metadata } from "next";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug, getPostsIndex } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { Prose } from "@/components/Prose";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  alternates: {
    canonical: `${BASE_URL}/`,
  },
};

export default async function HomePage() {
  const [page, postsIndex] = await Promise.all([
    getPageBySlug("index"),
    getPostsIndex(),
  ]);

  const latestPosts = postsIndex.slice(0, 3);

  return (
    <div className="space-y-10">
      <PageHeader
        title={page?.h1 ?? page?.title ?? "Temple Boyer Legal"}
        subtitle={null}
        breadcrumb={[{ label: "Accueil" }]}
      />

      {page?.html ? (
        <Prose html={page.html} />
      ) : (
        <p className="text-sm text-slate-600">Contenu en cours de migration.</p>
      )}

      {latestPosts.length > 0 && (
        <section aria-labelledby="publications-recents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="publications-recents"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700"
            >
              Publications récentes
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {latestPosts.map((post) => (
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
        </section>
      )}
    </div>
  );
}
