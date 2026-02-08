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
    <article className="group rounded-xl border border-slate-200 bg-white/80 p-4 transition duration-150 hover:border-slate-300 hover:bg-white">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          {category && <span className="font-medium uppercase tracking-[0.18em]">{category}</span>}
          {formattedDate && <time dateTime={date ?? undefined}>{formattedDate}</time>}
        </div>
        <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-950">
          <Link href={href}>{title}</Link>
        </h2>
        {excerpt && (
          <p className="text-sm text-slate-600 line-clamp-3">{excerpt}</p>
        )}
      </div>
    </article>
  );
}
