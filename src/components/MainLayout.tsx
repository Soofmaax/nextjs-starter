import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-[var(--accent-strong)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Passer au contenu principal
      </a>
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-24 lg:pt-16"
      >
        <div className="flex-1 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--surface-bg)] px-6 pb-12 pt-10 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:px-10 sm:pb-14 sm:pt-12 lg:px-12 lg:pb-16 lg:pt-14">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
