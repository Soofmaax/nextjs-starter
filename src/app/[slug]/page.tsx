import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPostBySlug, getPostsIndex } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { ArticleMeta } from "@/components/ArticleMeta";

export const dynamic = "force-static";

type ArticlePageParams = {
  slug: string;
};

interface ArticlePageProps {
  params: Promise<ArticlePageParams>;
}

export async function generateStaticParams() {
  const posts = await getPostsIndex();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const postsIndex = await getPostsIndex();
  const entry = postsIndex.find((post) => post.slug === slug);

  const title = entry?.title ?? "Publication";
  const description = entry?.metaDescription ?? siteConfig.description;
  const canonical = entry?.url ?? `${BASE_URL}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const heading = post.h1 ?? post.title ?? "Publication";
  const canonicalUrl = post.url ?? `${BASE_URL}/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: heading,
    description: post.metaDescription ?? undefined,
    datePublished: post.date ?? undefined,
    dateModified: post.date ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={heading}
        subtitle={null}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Publications & actualités", href: "/publications-actualites" },
          { label: heading },
        ]}
      />

      <ArticleMeta category={post.category} date={post.date} />

      <div className="mx-auto max-w-3xl">
        {post.html ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
            <Prose html={post.html} />
          </div>
        ) : (
          <p className="text-sm text-slate-600">Contenu en cours de migration.</p>
        )}
      </div>

      <script
        type="application/ld+json"
        // Les données JSON-LD sont dérivées uniquement des métadonnées existantes.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
