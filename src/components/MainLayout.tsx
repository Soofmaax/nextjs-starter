import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6] text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Passer au contenu principal
      </a>
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
