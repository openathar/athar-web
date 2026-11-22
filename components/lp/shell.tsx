import Link from "next/link";
import type { ReactNode } from "react";
import { locales, localeNames, type Locale } from "~/lib/i18n";
import { lpCopy } from "~/lib/lp-copy";
import { appCopy, APP_STORE_URL, PLAY_LIVE, PLAY_STORE_URL } from "~/lib/app-copy";
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
  path,
  current,
  children,
}: {
  locale: Locale;
  variant: Variant;
  home?: boolean;
  /** Unterseite wie "/app": die Sprachwahl bleibt dann auf dieser Seite. */
  path?: string;
  /** Markiert den aktiven Navigationspunkt. */
  current?: "app";
  children: ReactNode;
}) {
  const base = home ? `/${locale}` : `/${locale}/${variant}`;
  const c = lpCopy[locale].common;
  const a = appCopy[locale];
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
          {/* Auf jeder Seite: der Weg zur App, als hervorgehobener Knopf. */}
          <Link
            href={`/${locale}/app`}
            className="lp-nav-cta"
            aria-current={current === "app" ? "page" : undefined}
          >
            <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
              <path d="M10.5 18.5h3" strokeLinecap="round" />
            </svg>
            <span className="lp-long">{a.getApp}</span>
            <span className="lp-short">{a.nav}</span>
          </Link>
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
                href={path ? `/${code}${path}` : home ? `/${code}` : `/${code}/${variant}`}
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
          <Link href={`/${locale}/app`}>{c.app}</Link>
          <a href={APP_STORE_URL} rel="noopener">App Store</a>
          {PLAY_LIVE ? (
            <a href={PLAY_STORE_URL} rel="noopener">Google Play</a>
          ) : (
            <span>Google Play · {a.playSoon}</span>
          )}
          <Link href={`/${locale}/developers`}>{c.developers}</Link>
          <Link href={`/${locale}/blog`}>{c.blog}</Link>
          <Link href={`/${locale}/privacy`}>{c.privacy}</Link>
          <a href={GITHUB_ORG} rel="noopener">
            {c.github}
          </a>
        </p>
        </div>
      </footer>
    </div>
  );
}
