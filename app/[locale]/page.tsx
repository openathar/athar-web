import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, localeNames, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { Mark, Ornament, Rosette } from "~/components/mark";
import { ThemeToggle } from "~/components/theme";

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

      <div className="mx-auto max-w-[72rem] px-6 sm:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-rule py-6">
          <span className="flex items-center gap-3">
            <Mark size={30} className="text-accent" />
            <span className="display text-xl">Athar</span>
            <span className="quran text-xl text-muted">أثر</span>
          </span>
          <nav className="flex items-center gap-5 text-sm">
            {locales.map((c) => (
              <Link
                key={c}
                href={`/${c}`}
                lang={c}
                className={
                  c === l
                    ? "text-ink underline underline-offset-4"
                    : "text-muted transition hover:text-ink"
                }
              >
                {localeNames[c]}
              </Link>
            ))}
            <span aria-hidden className="text-rule">
              |
            </span>
            <ThemeToggle labels={t.theme} />
          </nav>
        </header>

        <main id="main">
          {/* ---------- Hero ---------- */}
          <section className="grid gap-14 py-20 sm:py-24 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h1 className="display text-[clamp(60px,9vw,112px)] font-light">
                {t.hero.name}
              </h1>
              <p className="mono mt-4 text-muted">{t.hero.meaning}</p>
              <p className="mt-9 max-w-prose text-lg leading-relaxed">
                {t.hero.tagline}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={GITHUB_ORG}
                  className="bg-accent px-6 py-3 text-paper transition hover:opacity-90"
                >
                  {t.hero.cta}
                </a>
                <a
                  href={`${GITHUB_ORG}/athar`}
                  className="border border-rule px-6 py-3 transition hover:border-accent hover:text-accent"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Ayah — Offenbartes bekommt eigene Flaeche und eigene Schrift */}
            <figure className="relative overflow-hidden border border-rule bg-surface px-8 py-10">
              <Rosette className="pointer-events-none absolute -bottom-20 -end-20 h-56 w-56 text-gold opacity-20" />
              <blockquote
                lang="ar"
                dir="rtl"
                className="quran relative text-[clamp(24px,3vw,34px)] leading-[2.1]"
              >
                وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ
              </blockquote>
              {!rtl && <p className="mt-5 text-muted">{t.ayah.text}</p>}
              <figcaption className="mono mt-4 text-gold">{t.ayah.ref}</figcaption>
            </figure>
          </section>

          {/* ---------- Berechnung: das konzeptionelle Herzstueck ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.compute.label}</Label>
            <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
              <div>
                <h2 className="display text-[clamp(32px,4vw,46px)]">
                  {t.compute.heading}
                </h2>
                <p className="mt-6 max-w-prose text-muted">{t.geometry.body}</p>
              </div>

              {/* Ausgabe-Block: Maschinen-Stimme */}
              <div className="border border-rule bg-surface">
                <div className="mono flex items-center justify-between border-b border-rule px-5 py-3 text-muted">
                  <span>{t.compute.note}</span>
                  <span aria-hidden className="text-accent">
                    ●
                  </span>
                </div>
                <dl className="mono divide-y divide-rule">
                  {t.compute.rows.map((row) => (
                    <div
                      key={row.name}
                      className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 px-5 py-3"
                    >
                      <dt className="text-ink">{row.name}</dt>
                      <dd className="text-gold tabular-nums">{row.time}</dd>
                      <dd className="col-span-2 text-muted">{row.basis}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* ---------- Muster & Regel ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.geometry.label}</Label>
            <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
              <h2 className="display text-[clamp(36px,6vw,72px)] font-light">
                {t.geometry.heading}
              </h2>
              <Rosette className="h-48 w-48 text-accent sm:h-64 sm:w-64" />
            </div>
          </section>

          {/* ---------- Was entsteht ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.what.heading}</Label>
            <dl className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
              {t.what.items.map((item, i) => (
                <div key={item.title} className="grid grid-cols-[auto_1fr] gap-x-5">
                  <span className="mono pt-1 text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <dt className="display text-xl">{item.title}</dt>
                    <dd className="mt-2 text-muted">{item.body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* ---------- Versprechen ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.promise.heading}</Label>
            <ul className="mono space-y-3 text-[0.95rem]">
              {t.promise.items.map((item) => (
                <li key={item} className="flex gap-4">
                  <span aria-hidden className="text-accent">
                    ✦
                  </span>
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- Kampagne: dein Commit als deine Spur ---------- */}
          <section className="relative overflow-hidden border border-rule bg-surface px-8 py-14 sm:px-14">
            <Ornament className="pointer-events-none absolute inset-x-0 bottom-0 text-rule" />
            <Label>{t.campaign.label}</Label>
            <div className="mono space-y-1 text-muted">
              {t.campaign.meta.map((line) => (
                <p key={line} className="whitespace-pre">
                  {line}
                </p>
              ))}
            </div>
            <h2 className="display mt-8 text-[clamp(34px,5vw,58px)]">
              {t.campaign.heading}
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed">
              {t.campaign.body}
            </p>
            <a
              href={GITHUB_ORG}
              className="mono mt-8 inline-block border-b border-accent pb-1 text-accent transition hover:opacity-80"
            >
              {t.campaign.cta} →
            </a>
          </section>

          {/* ---------- Status ---------- */}
          <p className="mono mt-20 border-s-2 border-gold py-1 ps-5 text-muted">
            <span className="me-3 text-ink">{t.status.badge}</span>
            {t.status.text}
          </p>

          {/* ---------- Roadmap als Log ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.roadmap.heading}</Label>
            <ol>
              {t.roadmap.phases.map((phase, i) => (
                <li
                  key={phase.title}
                  className="grid gap-x-6 gap-y-1 border-b border-rule py-6 sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
                >
                  <span className="mono text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display text-xl">{phase.title}</h3>
                    <p className="mt-1 text-muted">{phase.body}</p>
                  </div>
                  <span className="mono text-accent">{phase.state}</span>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 py-12 text-sm text-muted">
          <span className="flex items-center gap-3">
            <Mark size={18} className="text-accent" />
            {t.footer.madeAs}
          </span>
          <a href={GITHUB_ORG} className="mono transition hover:text-ink">
            {t.footer.source}
          </a>
        </footer>
      </div>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono mb-8 text-muted">
      <span aria-hidden className="me-2 text-rule">
        //
      </span>
      {children}
    </p>
  );
}
