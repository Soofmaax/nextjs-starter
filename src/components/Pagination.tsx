import Link from "next/link";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
}

export function Pagination({ page, pageSize, total, basePath }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const buildHref = (targetPage: number): string => {
    if (targetPage <= 1) return basePath;
    const params = new URLSearchParams({ page: String(targetPage) });
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm">
      <div>
        Page {currentPage} / {pageCount}
      </div>
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link
            href={buildHref(currentPage - 1)}
            className="rounded-full px-3 py-1 text-slate-700 hover:bg-slate-100"
          >
            Précédent
          </Link>
        )}
        {pages.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={buildHref(pageNumber)}
            className={`rounded-full px-3 py-1 text-sm ${
              pageNumber === currentPage
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNumber}
          </Link>
        ))}
        {currentPage < pageCount && (
          <Link
            href={buildHref(currentPage + 1)}
            className="rounded-full px-3 py-1 text-slate-700 hover:bg-slate-100"
          >
            Suivant
          </Link>
        )}
      </div>
    </nav>
  );
}
