import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, localeNames, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { Mark, Ornament, Rosette } from "~/components/mark";
import { getVerse } from "~/lib/quran";
import reflections from "~/data/reflections.json";
import { upcomingIslamicDates } from "~/lib/islamic-dates";
import { DailySign } from "~/components/daily-sign";
import { EarthMoonSection } from "~/components/earth-moon-section";
import { Hero } from "~/components/hero";
import { WorldMap } from "~/components/world-map";
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

  // Ein Vers pro Tag, deterministisch — kein Zufall, damit Server und Client
  // dasselbe zeigen und der Wechsel nachvollziehbar bleibt. Die Auswahl selbst
  // passiert in der Client-Komponente DailySign (Client-Datum); der Index hier
  // dient nur dem SSR/SEO-Rendering zur Build-Zeit.
  const dayIndex = Math.floor(Date.now() / 86_400_000) % reflections.entries.length;
  const upcoming = upcomingIslamicDates(l);
  // Alle Verse einmal holen (Data-Cache, revalidate 86400) — die Auswahl pro
  // Tag übernimmt der Client, damit alle Locales denselben Vers zeigen.
  const verses = await Promise.all(
    reflections.entries.map((e) =>
      getVerse(e.verse, l, {
        arabic: e.fallback.arabic,
        rendered: l === "ar" ? e.fallback.arabic : (e.fallback[l] ?? ""),
      }),
    ),
  );


  return (
    <>
      <a href="#main" className="skip-link">
        {l === "de" ? "Zum Inhalt" : l === "ar" ? "إلى المحتوى" : "Skip to content"}
      </a>

      <div className="mx-auto max-w-[72rem] px-6 sm:px-10">
        <header className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-b border-rule py-4">
          {/* Logo — Athar mit أثر als verblassender Spur daneben */}
          <span className="flex items-center gap-3">
            <Mark size={30} className="text-accent" />
            <span className="flex items-baseline gap-1.5">
              <span className="display text-xl font-bold leading-none text-gold">Athar</span>
              <span
                dir="rtl"
                lang="ar"
                className="quran flex h-8 items-center text-xl font-bold leading-none text-gold/30"
              >
                أثر
              </span>
            </span>
          </span>
          <nav className="flex items-center gap-6">
            {/* Sprachwahl — Segment-Control mit Sprachcodes */}
            <div
              role="group"
              aria-label={t.nav.language}
              className="flex items-center gap-1 rounded-full border border-rule bg-surface p-1"
            >
              {locales.map((c) => (
                <Link
                  key={c}
                  href={`/${c}`}
                  lang={c}
                  title={localeNames[c]}
                  aria-current={c === l ? "page" : undefined}
                  className={`mono rounded-full px-3 py-1 text-xs uppercase tracking-wider transition ${
                    c === l ? "bg-accent text-paper" : "text-muted hover:text-ink"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
            <ThemeToggle labels={t.theme} />
          </nav>
        </header>

        <main id="main">
          {/* ---------- Hero ---------- */}
          <section className="grid gap-14 py-20 sm:py-24 md:grid-cols-[1.3fr_1fr] md:items-center">
            <Hero
              locale={l}
              labels={t.hero}
              ctaHref="#athar"
              ctaSecondaryHref={`${GITHUB_ORG}/athar`}
            />

            {/* Ayah — Offenbartes bekommt eigene Flaeche und eigene Schrift */}
            <figure
              className="rise relative overflow-hidden border border-rule bg-surface px-8 py-10"
              style={{ animationDelay: "0.35s" }}
            >
              <Rosette className="pointer-events-none absolute bottom-5 end-5 h-24 w-24 text-gold opacity-35" />
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

          {/* ---------- Erde & Mond ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.earth.label}</Label>
            <h2 className="display text-[clamp(32px,5vw,60px)] font-light">
              {t.earth.heading}
            </h2>
            <p className="mt-6 max-w-prose text-muted">{t.earth.intro}</p>
            <div className="mt-10">
              <EarthMoonSection locale={l} labels={t.earth} />
            </div>
          </section>

          {/* ---------- Weltkarte & Gebetszeiten ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.map.label}</Label>
            <h2 className="display text-[clamp(32px,5vw,60px)] font-light">
              {t.map.heading}
            </h2>
            <p className="mt-6 max-w-prose text-muted">{t.map.intro}</p>
            <div className="mt-10">
              <WorldMap locale={l} labels={t.map} />
            </div>
          </section>

          {/* ---------- Zwei Buecher: Vers neben Beobachtung ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.signs.label}</Label>
            <h2 className="display text-[clamp(32px,5vw,60px)] font-light">
              {t.signs.heading}
            </h2>
            <p className="mt-6 max-w-prose text-muted">{t.signs.intro}</p>

            <DailySign
              entries={reflections.entries}
              verses={verses}
              locale={l}
              labels={t.signs}
              model={reflections.provenance.draftModel}
              initialDayIndex={dayIndex}
            />
          </section>

          {/* ---------- Islamischer Kalender: naechste Termine ---------- */}
          <section className="border-t border-rule py-16">
            <Label>{t.dates.label}</Label>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className="display text-2xl sm:text-3xl">{t.dates.heading}</h2>
              <p className="max-w-md text-sm text-muted">{t.dates.intro}</p>
            </div>

            <ol className="mt-8 divide-y divide-rule border-y border-rule">
              {upcoming.map((ev) => (
                <li key={ev.key} className="py-2">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="mono whitespace-nowrap text-xs text-gold tabular-nums">
                      {ev.hijri.day} · {ev.hijri.month} · {ev.hijri.year} {t.dates.hijriYear}
                    </span>
                    <h3 className="display text-sm">{ev.name}</h3>
                    <span className="mono ms-auto whitespace-nowrap text-xs text-muted">
                      {ev.gregorian
                        ? new Intl.DateTimeFormat(
                            l === "de" ? "de-DE" : l === "ar" ? "ar-JO" : "en-GB",
                            { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
                          ).format(ev.gregorian)
                        : "—"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{ev.note}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------- Warum ich das weiss: GATE24 ---------- */}
          <section className="border-t border-rule py-20">
            <Label>{t.legacy.label}</Label>
            <div className="grid items-center gap-14 md:grid-cols-[1.25fr_auto]">
              <div>
                <h2 className="display text-[clamp(32px,5vw,60px)] font-light">
                  {t.legacy.heading}
                </h2>
                <div className="mt-8 max-w-prose space-y-5 text-muted">
                  {t.legacy.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>
              <Rosette className="h-48 w-48 text-accent sm:h-60 sm:w-60" />
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
          <section
            id="athar"
            className="relative overflow-hidden border border-rule bg-surface px-8 py-14 sm:px-14"
          >
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
            <div className="mt-6 max-w-prose space-y-4 text-lg leading-relaxed">
              {t.campaign.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <p className="display mt-10 text-[clamp(26px,3.4vw,40px)] text-accent">
              {t.campaign.closing}
            </p>
            <a
              href={`${GITHUB_ORG}/athar`}
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
