import Link from "next/link";
import type { ReactNode } from "react";
import { locales, localeNames, type Locale } from "~/lib/i18n";
import { ThemeToggle } from "~/components/theme";

/**
 * Kopfzeile — auf der Startseite und dem Developer-Portal identisch, damit
 * Sprachwahl/Theme-Toggle nicht zweimal gepflegt werden. `basePath` erlaubt
 * dem Portal, beim Sprachwechsel auf derselben Unterseite zu bleiben statt
 * auf die Startseite zurueckzuspringen.
 */
export function SiteHeader({
  locale,
  basePath = "",
  languageLabel,
  themeLabels,
  nav,
}: {
  locale: Locale;
  basePath?: string;
  languageLabel: string;
  themeLabels: { light: string; dark: string };
  nav?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-b border-rule py-4">
      <span className="flex items-center gap-3">
        <Link href={`/${locale}`} aria-label="Athar">
          <span role="img" aria-label="Athar" className="brand-logo h-12 aspect-[1607/742]" />
        </Link>
      </span>
      <nav className="flex flex-wrap items-center gap-6">
        {nav}
        <div
          role="group"
          aria-label={languageLabel}
          className="flex items-center gap-1 rounded-full border border-rule bg-surface p-1"
        >
          {locales.map((c) => (
            <Link
              key={c}
              href={`${basePath}/${c}`}
              lang={c}
              title={localeNames[c]}
              aria-current={c === locale ? "page" : undefined}
              className={`mono rounded-full px-3 py-1 text-xs uppercase tracking-wider transition ${
                c === locale ? "bg-accent text-paper" : "text-muted hover:text-ink"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
        <ThemeToggle labels={themeLabels} />
      </nav>
    </header>
  );
}
