import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string | null;
  breadcrumb?: BreadcrumbItem[];
}

export function PageHeader({ title, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <header className="mb-10 border-b border-slate-200/80 pb-7 sm:mb-12 sm:pb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav
          aria-label="Fil d'ariane"
          className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500"
        >
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            if (isLast || !item.href) {
              return (
                <span key={item.label} className="opacity-80">
                  {item.label}
                </span>
              );
            }
            return (
              <span key={item.label}>
                <Link href={item.href} className="hover:text-slate-700">
                  {item.label}
                </Link>
                <span className="mx-1 text-slate-400">/</span>
              </span>
            );
          })}
        </nav>
      )}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
