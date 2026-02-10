import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-[var(--border-subtle)] bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
              Cabinet d&apos;avocats
            </span>
            <p className="font-display text-lg font-semibold tracking-tight text-slate-50">
              Temple Boyer Legal
            </p>
            <p className="text-sm text-slate-400">
              10, avenue de Wagram
              <br />
              75008 Paris
            </p>
            <p className="text-sm">
              <a
                href="mailto:contact@templeboyer-legal.com"
                className="text-slate-200 underline-offset-4 decoration-[var(--accent)] hover:text-[var(--accent-strong)] hover:underline"
              >
                contact@templeboyer-legal.com
              </a>
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/le-cabinet"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Le cabinet
                </Link>
              </li>
              <li>
                <Link
                  href="/competences"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Compétences
                </Link>
              </li>
              <li>
                <Link
                  href="/honoraires"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Honoraires
                </Link>
              </li>
              <li>
                <Link
                  href="/publications-actualites"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Publications &amp; actualités
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/plan-d-acces"
                  className="text-slate-300 transition-colors hover:text-slate-50 hover:underline underline-offset-4"
                >
                  Plan d&apos;accès
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-6 text-xs text-[var(--text-muted)]">
          <p>© {year} Temple Boyer Legal.</p>
        </div>
      </div>
    </footer>
  );
}
