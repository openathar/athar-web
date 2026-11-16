import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { privacyCopy } from "~/lib/privacy-copy";
import { LpShell } from "~/components/lp/shell";
import { ForceDark } from "~/components/force-dark";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const c = privacyCopy[locale as Locale];
  return {
    title: `${c.title} — Athar`,
    description: c.metaDescription,
    // Real translations: one hreflang cluster, each language canonical to itself.
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
    },
  };
}

/** Datenschutz — Store-Pflichtseite (Apple/Google) und Beleg für "ohne Tracking". Text: lib/privacy-copy.ts. */
export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const c = privacyCopy[l];

  return (
    <LpShell locale={l} variant="2">
      <ForceDark />
      <article className="lp-wrap lp-privacy" dir={isRtl(l) ? "rtl" : "ltr"}>
        <p className="lp-eyebrow mono">{c.updated}</p>
        <h1 className="title-xl">{c.title}</h1>
        <p className="lp-lead">{c.intro}</p>
        {c.sections.map((s) => (
          <section key={s.id} id={s.id} className="lp-privacy-sec">
            <h2 className="title-l">{s.h}</h2>
            {s.p.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </section>
        ))}
      </article>
    </LpShell>
  );
}
