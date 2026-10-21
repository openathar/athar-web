import type { ReactNode } from "react";
import type { Locale } from "~/lib/i18n";
import { toArabicDigits } from "~/lib/prayer-times";

/** Zweistellige Nummer, im Arabischen mit arabisch-indischen Ziffern. */
export const pad = (n: number, l: Locale) => {
  const s = String(n).padStart(2, "0");
  return l === "ar" ? toArabicDigits(s) : s;
};

/** Nummerierte Liste ohne Kaesten: Linie, Nummer, Titel, Text. */
export function NumberedList({
  items,
  locale,
  start = 1,
}: {
  items: { title: string; body: string }[];
  locale: Locale;
  start?: number;
}) {
  return (
    <ol className="lp-list">
      {items.map((it, i) => (
        <li key={it.title}>
          <span className="lp-list-n mono">{pad(i + start, locale)}</span>
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="lp-section">
      <div className="lp-wrap">
        {(eyebrow || title) && (
          <header className="lp-section-head">
            {eyebrow && <p className="lp-eyebrow mono">{eyebrow}</p>}
            {title && <h2 className="title-l">{title}</h2>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
