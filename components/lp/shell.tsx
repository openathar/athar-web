import Link from "next/link";
import type { ReactNode } from "react";
import { locales, localeNames, type Locale } from "~/lib/i18n";
import { lpCopy } from "~/lib/lp-copy";
import "./lp.css";

export const GITHUB_ORG = "https://github.com/openathar";
export const VARIANTS = ["1", "2", "3"] as const;
export type Variant = (typeof VARIANTS)[number];

/**
 * Rahmen der Landing-Varianten. Jede Variante setzt ihre Palette ueber
 * `.lp-vN` — Akzent ist genau eine Variable (`--lp-accent`).
 */
export function LpShell({
  locale,
  variant,
  home = false,
  children,
}: {
  locale: Locale;
  variant: Variant;
  home?: boolean;
  children: ReactNode;
}) {
  const base = home ? `/${locale}` : `/${locale}/${variant}`;
  const c = lpCopy[locale].common;
  return (
    <div className={`lp lp-v${variant}`}>
      <a href="#main" className="skip-link">
        {c.skip}
      </a>
      <header className="lp-wrap lp-header">
        <Link href={base} aria-label="Athar" className="lp-logo">
          <span role="img" aria-label="Athar" className="brand-logo" />
        </Link>
        <nav className="lp-header-nav" aria-label="Athar">
          <Link href={`/${locale}/developers`} className="lp-nav-link">
            {c.developers}
          </Link>
          {!home && <div role="group" aria-label={c.variant} className="lp-variants">
            {VARIANTS.map((v) => (
              <Link
                key={v}
                href={`/${locale}/${v}`}
                aria-current={v === variant ? "page" : undefined}
              >
                {v}
              </Link>
            ))}
          </div>}
          <div role="group" aria-label="Language" className="lp-pills">
            {locales.map((code) => (
              <Link
                key={code}
                href={home ? `/${code}` : `/${code}/${variant}`}
                lang={code}
                title={localeNames[code]}
                aria-current={code === locale ? "page" : undefined}
              >
                {code}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="lp-wrap">
        <div className="lp-footer">
        <p>{c.footer}</p>
        <p className="lp-footer-links">
          {!home && <Link href={`/${locale}`}>{c.fullSite}</Link>}
          <Link href={`/${locale}/developers`}>{c.developers}</Link>
          <a href={GITHUB_ORG} rel="noopener">
            {c.github}
          </a>
        </p>
        </div>
      </footer>
    </div>
  );
}
