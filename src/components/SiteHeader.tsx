"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/le-cabinet", label: "Le cabinet" },
  { href: "/competences", label: "Compétences" },
  { href: "/honoraires", label: "Honoraires" },
  { href: "/publications-actualites", label: "Publications & actualités" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--surface-bg)] backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex flex-col"
            aria-label="Accueil Temple Boyer Legal"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 transition-colors group-hover:text-slate-700">
              Cabinet d&apos;avocats
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-slate-950">
              Temple Boyer Legal
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 text-sm font-medium md:flex"
            aria-label="Navigation principale"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative pb-1 transition-colors ${
                    active
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`pointer-events-none absolute inset-x-0 -bottom-0.5 block h-0.5 origin-left rounded-full bg-[var(--accent)] opacity-80 transition-transform duration-150 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--surface-bg)] p-2 text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 md:hidden"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">
              {isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            </span>
            <span className="relative block h-4 w-4">
              <span
                className={`absolute left-0 right-0 h-0.5 rounded-full bg-slate-700 transition-transform duration-150 ${
                  isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-0.5 rounded-full bg-slate-700 transition-opacity duration-150 ${
                  isMenuOpen
                    ? "top-1/2 opacity-0"
                    : "top-1/2 -translate-y-1/2 opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-0.5 rounded-full bg-slate-700 transition-transform duration-150 ${
                  isMenuOpen
                    ? "top-1/2 -translate-y-1/2 -rotate-45"
                    : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--surface-bg)] backdrop-blur-sm md:hidden">
          <nav
            className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8"
            aria-label="Navigation principale"
          >
            <ul className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                        active
                          ? "bg-slate-900/90 text-slate-50"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
