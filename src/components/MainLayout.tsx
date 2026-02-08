import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-900 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="group flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-700">
              Cabinet d&apos;avocats
            </span>
            <span className="text-lg font-semibold tracking-wide text-slate-900">
              Temple Boyer Legal
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
            <Link href="/le-cabinet" className="hover:text-slate-950">
              Le cabinet
            </Link>
            <Link href="/competences" className="hover:text-slate-950">
              Compétences
            </Link>
            <Link href="/honoraires" className="hover:text-slate-950">
              Honoraires
            </Link>
            <Link
              href="/publications-actualites"
              className="hover:text-slate-950"
            >
              Publications &amp; actualités
            </Link>
            <Link href="/contact" className="hover:text-slate-950">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-10 pt-8 lg:px-8 lg:pb-14 lg:pt-10">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} Temple Boyer Legal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/mentions-legales" className="hover:text-slate-900">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-slate-900">
              Confidentialité
            </Link>
            <Link href="/plan-d-acces" className="hover:text-slate-900">
              Plan d&apos;accès
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
