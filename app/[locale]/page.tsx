import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, localeNames, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { Mark, Ornament } from "~/components/mark";

const GITHUB_ORG = "https://github.com/openathar";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const t = dictionaries[l];
  const rtl = isRtl(l);

  return (
    <>
      <a href="#main" className="skip-link">
        {l === "de" ? "Zum Inhalt" : l === "ar" ? "إلى المحتوى" : "Skip to content"}
      </a>

      <div className="mx-auto max-w-[68rem] px-6 sm:px-10">
        {/* Kopfzeile: Signet + Sprachwahl */}
        <header className="flex items-center justify-between border-b border-rule py-6">
          <span className="flex items-center gap-3 text-ink">
            <Mark size={32} />
            <span className="display text-2xl">
              {rtl ? "أثر" : "Athar"}
            </span>
          </span>
          <nav className="flex gap-5 text-sm">
            {locales.map((code) => (
              <Link
                key={code}
                href={`/${code}`}
                lang={code}
                className={
                  code === l
                    ? "text-ink underline underline-offset-4"
                    : "text-muted transition hover:text-ink"
                }
              >
                {localeNames[code]}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main">
          {/* Hero */}
          <section className="grid gap-12 py-20 sm:py-28 md:grid-cols-[1.35fr_1fr] md:items-start">
            <div>
              <h1 className="display text-[clamp(56px,9vw,104px)]">
                {t.hero.name}
              </h1>
              <p className="mt-4 text-muted">{t.hero.meaning}</p>
              <p className="mt-10 max-w-prose text-lg leading-relaxed">
                {t.hero.tagline}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={GITHUB_ORG}
                  className="bg-ink px-6 py-3 text-paper transition hover:bg-accent"
                >
                  {t.hero.cta}
                </a>
                <a
                  href={`${GITHUB_ORG}/athar`}
                  className="border border-rule px-6 py-3 text-ink transition hover:border-ink"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Ayah als editorialer Seitenblock */}
            <figure className="border-s border-rule ps-6 md:mt-4">
              <blockquote
                lang="ar"
                dir="rtl"
                className="display text-[clamp(22px,2.6vw,30px)] leading-[1.9]"
                style={{ fontFamily: "var(--font-arabic), serif" }}
              >
                وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ
              </blockquote>
              {!rtl && (
                <p className="mt-4 text-muted">{t.ayah.text}</p>
              )}
              <figcaption className="mt-3 text-sm text-accent">
                {t.ayah.ref}
              </figcaption>
            </figure>
          </section>

          <div className="text-rule">
            <Ornament />
          </div>

          {/* Status */}
          <p className="border-s-2 border-accent py-1 ps-5 text-sm text-muted">
            <span className="me-2 font-medium text-ink">{t.status.badge}</span>
            {t.status.text}
          </p>

          {/* Was entsteht */}
          <Section heading={t.what.heading}>
            <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {t.what.items.map((item) => (
                <div key={item.title}>
                  <dt className="display text-xl">{item.title}</dt>
                  <dd className="mt-2 text-muted">{item.body}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Versprechen */}
          <Section heading={t.promise.heading}>
            <ul className="space-y-3 text-lg">
              {t.promise.items.map((item) => (
                <li key={item} className="flex gap-4">
                  <span aria-hidden className="text-accent">
                    ✦
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Kampagne */}
          <section className="my-24 bg-paper-deep px-8 py-14 sm:px-14">
            <h2 className="display text-[clamp(32px,4.5vw,52px)]">
              {t.campaign.heading}
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed">
              {t.campaign.body}
            </p>
            <a
              href={GITHUB_ORG}
              className="mt-8 inline-block border-b border-ink pb-1 transition hover:text-accent"
            >
              {t.campaign.cta} →
            </a>
          </section>

          {/* Roadmap */}
          <Section heading={t.roadmap.heading}>
            <ol className="space-y-8">
              {t.roadmap.phases.map((phase, i) => (
                <li
                  key={phase.title}
                  className="grid gap-x-8 gap-y-2 border-t border-rule pt-6 sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
                >
                  <span className="text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display text-xl">{phase.title}</h3>
                    <p className="mt-1 text-muted">{phase.body}</p>
                  </div>
                  <span className="text-sm text-accent">{phase.state}</span>
                </li>
              ))}
            </ol>
          </Section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-rule py-10 text-sm text-muted">
          <span className="flex items-center gap-3">
            <Mark size={20} />
            {t.footer.madeAs}
          </span>
          <a href={GITHUB_ORG} className="transition hover:text-ink">
            {t.footer.source}
          </a>
        </footer>
      </div>
    </>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="my-24">
      <h2 className="mb-10 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        {heading}
      </h2>
      {children}
    </section>
  );
}
