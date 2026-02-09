interface ArticleMetaProps {
  category?: string | null;
  date?: string | null;
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

export function ArticleMeta({ category, date }: ArticleMetaProps) {
  const formattedDate = formatDate(date);

  if (!category && !formattedDate) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        {category && (
          <span className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900">
            {category}
          </span>
        )}
        {formattedDate && (
          <time dateTime={date ?? undefined} className="text-xs text-slate-500">
            {formattedDate}
          </time>
        )}
      </div>
    </div>
  );
}
