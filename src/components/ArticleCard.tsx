import Link from "next/link";

interface ArticleCardProps {
  href: string;
  title: string;
  date?: string | null;
  category?: string | null;
  excerpt?: string | null;
}

function formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export function ArticleCard({ href, title, date, category, excerpt }: ArticleCardProps) {
  const formattedDate = formatDate(date);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          {category && (
            <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-800 ring-1 ring-sky-100">
              {category}
            </span>
          )}
          {formattedDate && (
            <time dateTime={date ?? undefined} className="text-xs text-slate-500">
              {formattedDate}
            </time>
          )}
        </div>
        <h2 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-slate-950">
          <Link href={href}>{title}</Link>
        </h2>
        {excerpt && (
          <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
