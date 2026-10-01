import type { ReactNode } from "react";

/** Shared layout for the privacy policy and terms: readable measure, B colours. */
export function LegalPage({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="d-root b-theme min-h-[100svh]">
      <header className="px-6 pt-8 lg:px-12">
        <div className="d-wrap flex items-center justify-between gap-6">
          <a href="/" className="inline-flex min-h-11 items-center" aria-label="Chrizos Media home">
            <img
              src="/b/logo-blue.svg"
              alt="Chrizos Media"
              width={952}
              height={386}
              className="h-auto w-[104px]"
            />
          </a>
          <a href="/audit" className="d-btn d-btn-forest min-h-11 whitespace-nowrap px-5 text-sm">
            Book a free audit
          </a>
        </div>
      </header>
      <main className="d-section">
        <article className="d-wrap max-w-[46rem]">
          <p className="d-kicker">{kicker}</p>
          <h1 className="d-display d-h2 mt-4">{title}</h1>
          <p className="mt-4 text-sm text-[var(--d-muted)]">Last updated: {updated}</p>
          <div className="legal mt-12">{children}</div>
        </article>
      </main>
      <footer className="border-t border-[var(--d-rule)] px-6 py-8 text-sm lg:px-12">
        <div className="d-wrap flex flex-wrap justify-between gap-4">
          <p className="font-semibold">© {new Date().getFullYear()} Chrizos Media</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6">
            <a href="/privacy" className="d-link inline-flex min-h-11 items-center">
              Privacy policy
            </a>
            <a href="/terms" className="d-link inline-flex min-h-11 items-center">
              Terms
            </a>
            <a href="/" className="d-link inline-flex min-h-11 items-center">
              Home
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
