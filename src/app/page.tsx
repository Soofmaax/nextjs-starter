import type { Metadata } from "next";
import Image from "next/image";
import { BASE_URL, siteConfig } from "@/config/site";
import { getPageBySlug, getPostsIndex } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";

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
  const heroTitle = page?.h1 ?? page?.title ?? "Temple Boyer Legal";
  const heroEyebrow = page?.title ?? siteConfig.defaultTitle;
  const heroSubtitle = page?.metaDescription ?? null;

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-50 shadow-sm">
        <div className="grid items-stretch gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-16">
            <div className="max-w-3xl space-y-4 sm:space-y-5 lg:space-y-6">
              {heroEyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">
                  {heroEyebrow}
                </p>
              )}
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="max-w-2xl text-sm leading-relaxed text-slate-200/90 sm:text-base lg:text-lg line-clamp-4">
                  {heroSubtitle}
                </p>
              )}
            </div>

            <div className="mt-8 h-48 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 shadow-sm md:hidden">
              <div className="relative h-full w-full">
                <Image
                  src="/Sarah%20Temple-Boyer.jpg"
                  alt="Portrait de Maître Sarah Temple-Boyer"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent" />
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0">
              <Image
                src="/Sarah%20Temple-Boyer.jpg"
                alt="Portrait de Maître Sarah Temple-Boyer"
                fill
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
          </div>
        </div>
      </section>

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
