import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, localeNames, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { landingCopy } from "~/lib/landing-copy";
import { Mark, Ornament, Rosette } from "~/components/mark";
import { getVerse } from "~/lib/quran";
import reflections from "~/data/reflections.json";
import { upcomingIslamicDates } from "~/lib/islamic-dates";
import { gregorianToHijri } from "~/lib/hijri";
import { DailySign } from "~/components/daily-sign";
import { TodayHijri } from "~/components/today-hijri";
import { TodaySky } from "~/components/today-sky";
import { moonPhaseAt, nextMoonEvents } from "~/lib/moon-phase";
import { CosmosTabs } from "~/components/cosmos-tabs";
import { ForceDark } from "~/components/force-dark";
import { Reveal } from "~/components/reveal";
import { BuildIn } from "~/components/build-in";
import { NavShell } from "~/components/nav-shell";

const GITHUB_ORG = "https://github.com/openathar";

/** Gemeinsame Breite aller Abschnitte; Vollbreite-Flaechen liegen darum herum. */
const WRAP = "mx-auto max-w-[72rem] px-6 sm:px-10";

const pill =
  "inline-flex items-center rounded-full px-7 py-3.5 transition";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const t = dictionaries[l];
  const c = landingCopy[l];
  const rtl = isRtl(l);

  // Ein Vers pro Tag, deterministisch — der Index dient nur dem SSR/SEO; die
  // eigentliche Auswahl macht DailySign mit dem Client-Datum.
  const dayIndex =
    Math.floor(Date.now() / 86_400_000) % reflections.entries.length;
  const upcoming = upcomingIslamicDates(l);
  const initialHijri = gregorianToHijri(new Date(), l);
  const initialSky = {
    phase: moonPhaseAt(new Date()),
    events: nextMoonEvents(new Date()),
  };
  const verses = await Promise.all(
    reflections.entries.map((e) =>
      getVerse(e.verse, l, {
        arabic: e.fallback.arabic,
        rendered: l === "ar" ? e.fallback.arabic : (e.fallback[l] ?? ""),
      }),
    ),
  );

  const dateFmt = new Intl.DateTimeFormat(
    l === "de" ? "de-DE" : l === "ar" ? "ar-JO" : "en-GB",
    { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
  );

  return (
    <>
      <a href="#main" className="skip-link">
        {c.skip}
      </a>
      {/* Kein z-index auf dem Inhalt: ein Stacking-Kontext wuerde die
          Bildmasken einschliessen. Der Himmel liegt auf z-index -1. */}
      <div aria-hidden className="ba-sky" />
      <div
        aria-hidden
        data-nav-sentinel
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
      />

      <NavShell
        links={c.nav}
        cta={{ href: "#athar", label: c.join }}
        menuLabel={c.menu}
        closeLabel={t.nav.language}
        brand={
          <Link href={`/${l}`} aria-label="Athar" className="shrink-0">
            <span
              role="img"
              aria-label="Athar"
              className="brand-logo -my-2 block h-14 sm:h-20 aspect-[1607/742]"
            />
          </Link>
        }
        trailing={
          <span className="flex items-center gap-4">
            <div
              role="group"
              aria-label={t.nav.language}
              className="hidden items-center gap-1 rounded-full border border-rule bg-surface p-1 sm:flex"
            >
              {locales.map((code) => (
                <Link
                  key={code}
                  href={`/${code}`}
                  lang={code}
                  title={localeNames[code]}
                  aria-current={code === l ? "page" : undefined}
                  className={`mono rounded-full px-3 py-1 text-xs uppercase tracking-wider transition ${
                    code === l
                      ? "bg-accent text-paper"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {code}
                </Link>
              ))}
            </div>
          </span>
        }
      />

      <ForceDark />
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.documentElement.setAttribute("data-theme","dark")',
        }}
      />
      <main id="main">
        {/* ================= Hero ================= */}
        <section className="relative isolate overflow-hidden">
          <div
            className={`${WRAP} relative flex min-h-[100svh] flex-col justify-end pb-10 pt-36`}
          >
            {/* Bühne: nur der Baum. Das Logo wohnt in der Navigation. */}
            <div
              aria-hidden
              className="pointer-events-none absolute end-[-6%] top-[12%] -z-10 w-[84%] opacity-30 sm:w-[64%] sm:opacity-60 md:end-[1%] md:top-[11%] md:w-[48%] md:max-w-[38rem] md:opacity-100"
            >
              <div className="ba-stage relative">
                <img
                  src="/beit-athar/tree.jpg"
                  alt=""
                  width={1554}
                  height={1664}
                  fetchPriority="high"
                  decoding="async"
                  className="orb-dark ba-frame ba-frame--round ba-float relative z-10 h-auto w-full"
                />
              </div>
            </div>

            <div className="relative max-w-[46rem]">
              <p className="eyebrow mono rise">{c.hero.eyebrow}</p>
              <h1
                className="title-xl rise mt-7"
                style={{ animationDelay: "0.08s" }}
              >
                <span className="sr-only">Athar — </span>
                <span className="block">{c.hero.title[0]}</span>
                <span className="block text-muted">{c.hero.title[1]}</span>
              </h1>
              <p
                className="rise mt-8 max-w-[34rem] text-lg leading-relaxed text-muted"
                style={{ animationDelay: "0.2s" }}
              >
                {c.hero.lead}
              </p>
              <div
                className="rise mt-9 flex flex-wrap gap-3"
                style={{ animationDelay: "0.3s" }}
              >
                <a
                  href="#athar"
                  className={`${pill} bg-accent text-paper hover:opacity-90`}
                >
                  {t.hero.cta}
                </a>
                <a
                  href={`${GITHUB_ORG}/athar`}
                  className={`${pill} border border-rule hover:border-accent hover:text-accent`}
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>

            <dl className="relative mt-16 grid grid-cols-3 gap-4 border-t border-rule pt-8 sm:gap-10">
              {c.hero.stats.map((s, i) => (
                <div
                  key={s.label}
                  className="rise"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <dt
                    className="title-l !text-[clamp(1.9rem,5vw,3.6rem)] !leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.value}
                  </dt>
                  <dd className="mt-3 max-w-[16rem] text-xs leading-snug text-muted sm:text-sm">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ================= Ayah ================= */}
        <section className={`${WRAP} py-28 text-center`}>
          <Reveal>
            <Rosette className="mx-auto h-14 w-14 text-gold opacity-70" />
            <blockquote
              lang="ar"
              dir="rtl"
              className="quran mx-auto mt-6 max-w-[40rem] text-[clamp(30px,5vw,54px)] leading-[2]"
            >
              وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ
            </blockquote>
            {!rtl && (
              <p className="mx-auto mt-4 max-w-[30rem] text-lg text-muted">
                {t.ayah.text}
              </p>
            )}
            <p className="mono mt-5 text-gold">{t.ayah.ref}</p>
          </Reveal>
        </section>

        {/* ================= Was drinsteckt: Treppe baut sich von hinten nach vorn ================= */}
        <section id="what" className="scroll-mt-24 overflow-x-clip py-24">
          <div className={WRAP}>
            <Reveal>
              <Eyebrow>{t.what.heading}</Eyebrow>
              <h2 className="title-l max-w-[18ch]">{c.what.title}</h2>
            </Reveal>
            <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr]">
              <Reveal>
                <dl>
                  {c.what.items.map((item, i) => (
                    <div
                      key={item.title}
                      className="border-t border-rule py-6 last:border-b"
                    >
                      <dt className="flex items-baseline gap-4 text-xl font-medium">
                        <span className="mono text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.title}
                      </dt>
                      <dd className="mt-2 max-w-prose text-muted">{item.body}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <BuildIn className="fade-block lg:-me-24">
                <img
                  src="/beit-athar/workers.jpg"
                  alt={c.what.imgAlt}
                  width={1510}
                  height={874}
                  loading="lazy"
                  decoding="async"
                  className="orb-dark ba-frame h-auto w-full"
                />
              </BuildIn>
            </div>
          </div>
        </section>

        {/* ================= Lesen. Beten. Weitergeben.: Haende finden zueinander ================= */}
        <section className="overflow-x-clip py-24">
          <div className={WRAP}>
            <Reveal>
              <Eyebrow>{c.ways.label}</Eyebrow>
              <h2 className="sr-only">{c.ways.words.join(" ")}</h2>
            </Reveal>
            <div className="grid items-center gap-12 lg:grid-cols-[1.28fr_0.72fr]">
              <BuildIn className="fade-block order-last lg:order-first lg:-ms-24">
                <img
                  src="/beit-athar/connection.jpg"
                  alt={c.ways.imgAlt}
                  width={1600}
                  height={696}
                  loading="lazy"
                  decoding="async"
                  className="orb-dark ba-frame h-auto w-full"
                />
                <div aria-hidden className="hands-glow" />
              </BuildIn>
              <Reveal>
                <ol>
                  {c.ways.words.map((w, i) => (
                    <li
                      key={w}
                      className="border-t border-rule py-6 last:border-b"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="mono text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="title-l !text-[clamp(1.7rem,3vw,2.4rem)]">
                          {w}
                        </h3>
                      </div>
                      <p className="mt-2 max-w-prose text-muted lg:ms-9">
                        {c.ways.bodies[i]}
                      </p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= Zwei Lichter, eine Uhr ================= */}
        <section
          id="cosmos"
          className={`${WRAP} scroll-mt-24 border-t border-rule py-24`}
        >
          <Reveal>
            <Eyebrow>{t.cosmos.label}</Eyebrow>
            <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="title-l max-w-[16ch]">{t.cosmos.heading}</h2>
                <p className="mt-6 max-w-prose text-lg text-muted">
                  {t.cosmos.intro}
                </p>
              </div>
              <div className="mx-auto w-full max-w-[22rem]">
              <BuildIn className="fade-block alpha-block orb-block w-full">
                {/* Dunkel: Schwarz ist echte Transparenz (Alpha). Hell: das Bild mit
                dem Filter, der das Schwarz ins Papier hebt. */}
              <img
                src="/beit-athar/world-dark.webp"
                alt={c.cosmosOrbAlt}
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
                className="orb-dark h-auto w-full"
              />
              </BuildIn>
              </div>
            </div>
            <div className="mt-12">
              <CosmosTabs
                locale={l}
                cosmos={t.cosmos}
                earth={t.earth}
                map={t.map}
                zoom={c.cosmos}
              />
            </div>
          </Reveal>
        </section>

        {/* ================= Zwei Bücher ================= */}
        <section
          id="signs"
          className={`${WRAP} scroll-mt-24 border-t border-rule py-24`}
        >
          <Reveal>
            <Eyebrow>{t.signs.label}</Eyebrow>
            <h2 className="title-l max-w-[20ch]">{t.signs.heading}</h2>
            <p className="mt-6 max-w-prose text-lg text-muted">
              {t.signs.intro}
            </p>
            <DailySign
              entries={reflections.entries}
              verses={verses}
              locale={l}
              labels={t.signs}
              model={reflections.provenance.draftModel}
              initialDayIndex={dayIndex}
            />
          </Reveal>
        </section>

        {/* ================= Kalender + Himmel ================= */}
        <section className={`${WRAP} border-t border-rule py-24`}>
          <Reveal>
            <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <Eyebrow>{t.dates.label}</Eyebrow>
                <h2 className="title-l !text-[clamp(1.9rem,4vw,3rem)]">
                  {t.dates.heading}
                </h2>
                <p className="mt-4 max-w-md text-muted">{t.dates.intro}</p>
                <TodayHijri
                  locale={l}
                  labels={t.dates}
                  initialHijri={initialHijri}
                />
                <ol className="mt-8 divide-y divide-rule border-y border-rule">
                  {upcoming.map((ev) => (
                    <li key={ev.key} className="py-3">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="whitespace-nowrap text-[15px] text-gold tabular-nums">
                          {ev.hijri.day} · {ev.hijri.month} · {ev.hijri.year}{" "}
                          {t.dates.hijriYear}
                        </span>
                        <h3 className="text-sm font-medium">{ev.name}</h3>
                        <span className="ms-auto whitespace-nowrap text-[15px] text-muted">
                          {ev.gregorian ? dateFmt.format(ev.gregorian) : "—"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">
                        {ev.note}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <Eyebrow>{t.sky.label}</Eyebrow>
                <h2 className="title-l !text-[clamp(1.9rem,4vw,3rem)]">
                  {t.sky.heading}
                </h2>
                <p className="mt-4 max-w-md text-muted">{t.sky.intro}</p>
                <TodaySky
                  labels={{ ...t.sky, phaseNames: t.earth.phaseNames }}
                  initial={initialSky}
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================= Versprechen ================= */}
        <section id="promise" className="scroll-mt-24 border-t border-rule">
          <div className={`${WRAP} py-28`}>
            <Reveal>
              <Eyebrow>{t.promise.heading}</Eyebrow>
              <h2 className="title-l max-w-[16ch]">{c.promise.title}</h2>
              <p className="mt-6 max-w-prose text-lg text-muted">
                {c.promise.lead}
              </p>

              <div className="mt-14 grid gap-6 lg:grid-cols-12">
                <div className="relative flex min-h-[26rem] flex-col justify-between overflow-hidden border border-rule bg-surface p-8 lg:col-span-7 lg:p-12">
                  <Rosette className="ba-breathe pointer-events-none absolute -bottom-16 -end-16 h-80 w-80 text-accent opacity-25" />
                  <div className="relative">
                    <span
                      className="title-xl block !text-[clamp(7rem,16vw,12rem)] !leading-[0.85]"
                      aria-hidden
                    >
                      {c.promise.zero}
                    </span>
                    <span className="mt-5 block text-lg text-muted">
                      {c.promise.zeroCaption}
                    </span>
                  </div>
                  <ul className="relative mt-10 flex flex-wrap gap-2">
                    {c.promise.badges.map((b) => (
                      <li
                        key={b}
                        className="mono rounded-full border border-rule px-4 py-1.5 text-xs text-muted"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <ol className="flex flex-col gap-4 lg:col-span-5">
                  {t.promise.items.map((item, i) => (
                    <li
                      key={item}
                      className="flex flex-1 items-center gap-5 border border-rule bg-surface p-6"
                    >
                      <span
                        aria-hidden
                        className="mono flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule text-gold"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-medium">{item}</h3>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= Entwickler ================= */}
        <section id="dev" className={`${WRAP} scroll-mt-24 py-28`}>
          <Reveal>
            <Eyebrow>{c.dev.label}</Eyebrow>
            <h2 className="title-l max-w-[16ch]">{c.dev.title}</h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              <div>
                <p className="max-w-prose text-lg text-muted">{c.dev.lead}</p>
                <ul className="mt-8 space-y-3">
                  {c.dev.points.map((p) => (
                    <li key={p} className="flex gap-4">
                      <span aria-hidden className="text-accent">
                        ✦
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${l}/developers`}
                  className="mono mt-8 inline-block border-b border-accent pb-1 text-accent transition hover:opacity-80"
                >
                  {c.dev.cta}
                </Link>
              </div>
              <div className="api-panel self-start overflow-x-auto p-6" lang="en" dir="ltr">
                <pre className="mono text-sm text-ink">
                  <code>{`import {
  Methods,
  PrayerTimes,
  formatLocalTime,
} from "@openathar/athan-core-ts";

const t = new PrayerTimes(Methods.MWL)
  .getTimes(2026, 9, 15, 52.52, 13.405);

formatLocalTime(t.fajr, 2.0);
// "04:41" — computed locally, no network`}</code>
                </pre>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================= Stand der Dinge ================= */}
        <section className={`${WRAP} border-t border-rule py-24`}>
          <Reveal>
            <Eyebrow>{c.state.label}</Eyebrow>
            <h2 className="title-l !text-[clamp(1.9rem,4vw,3rem)]">
              {c.state.title}
            </h2>
            <p className="mt-6 border-s-2 border-gold py-1 ps-5 text-muted">
              <span className="mono me-3 text-ink">{t.status.badge}</span>
              {t.status.text}
            </p>
            <ol className="mt-10">
              {t.roadmap.phases.map((phase, i) => (
                <li
                  key={phase.title}
                  className="grid gap-x-6 gap-y-1 border-b border-rule py-6 first:border-t sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
                >
                  <span className="mono text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium">{phase.title}</h3>
                    <p className="mt-1 max-w-prose text-muted">{phase.body}</p>
                  </div>
                  <span className="mono text-accent">{phase.state}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* ================= Die Frage dahinter ================= */}
        <section className={`${WRAP} border-t border-rule py-24`}>
          <Reveal>
            <Eyebrow>{t.legacy.label}</Eyebrow>
            <div className="grid items-center gap-14 md:grid-cols-[1.25fr_auto]">
              <div>
                <h2 className="title-l max-w-[16ch]">{t.legacy.heading}</h2>
                <div className="mt-8 max-w-prose space-y-5 text-lg text-muted">
                  {t.legacy.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>
              <Rosette className="h-48 w-48 text-accent sm:h-60 sm:w-60" />
            </div>
          </Reveal>
        </section>

        {/* ================= Mein Athar ================= */}
        <section id="athar" className="scroll-mt-24">
         <div className={`${WRAP} pb-8`}>
          <div className="relative overflow-x-clip py-16">
            <Ornament className="ba-orn-flow pointer-events-none absolute inset-x-0 bottom-0 text-rule" />
            <Reveal>
              <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr]">
                <div>
                  <Eyebrow>{t.campaign.label}</Eyebrow>
                  <div className="mono space-y-1 text-muted" dir={rtl ? "rtl" : "ltr"}>
                    {t.campaign.meta.map((line) => (
                      <p key={line} className={rtl ? "" : "whitespace-pre"}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <h2 className="title-l mt-8">{t.campaign.heading}</h2>
                  <div className="mt-6 max-w-prose space-y-4 text-lg leading-relaxed">
                    {t.campaign.body.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                  <p className="title-l mt-10 !text-[clamp(1.7rem,3.4vw,2.6rem)] text-accent">
                    {t.campaign.closing}
                  </p>
                  <a
                    href={`${GITHUB_ORG}/athar`}
                    className="mono mt-8 inline-block border-b border-accent pb-1 text-accent transition hover:opacity-80"
                  >
                    {t.campaign.cta} {rtl ? "←" : "→"}
                  </a>
                </div>
                <BuildIn className="fade-block alpha-block ba-stage relative md:-me-16">
                  <img
                    src="/beit-athar/bridge-dark.webp"
                    alt={c.take.bridgeAlt}
                    width={1600}
                    height={1067}
                    loading="lazy"
                    decoding="async"
                    className="orb-dark h-auto w-full"
                  />

                </BuildIn>
              </div>
            </Reveal>
          </div>
         </div>
        </section>

        {/* ================= Mitmachen ================= */}
        <section className={`${WRAP} py-24`}>
          <Reveal>
            <Eyebrow>{c.take.label}</Eyebrow>
            <h2 className="title-l max-w-[16ch]">{c.take.title}</h2>
            <p className="mt-6 max-w-prose text-lg text-muted">{c.take.lead}</p>
            <ol className="mt-12 grid gap-px border border-rule bg-rule md:grid-cols-3">
              {c.take.cards.map((card, i) => {
                const href =
                  i === 0
                    ? "#cosmos"
                    : i === 1
                      ? `${GITHUB_ORG}/athar`
                      : `/${l}/developers`;
                return (
                  <li key={card.title} className="ba-glass flex flex-col px-8 py-10">
                    <span className="mono text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-xl font-medium">{card.title}</h3>
                    <p className="mt-2 flex-1 text-muted">{card.body}</p>
                    <a
                      href={href}
                      className="mono mt-6 inline-block self-start border-b border-accent pb-1 text-sm text-accent transition hover:opacity-80"
                    >
                      {card.cta}
                    </a>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </section>

        {/* ================= Landschaft ================= */}
        <section className="overflow-hidden pt-16">
          <figure className={`${WRAP}`}>
            <Img
              src="/beit-athar/landscape.jpg"
              alt={c.take.landscapeAlt}
              width={1600}
              height={477}
            />
          </figure>
        </section>
      </main>

      <footer
        className={`${WRAP} flex flex-wrap items-center justify-between gap-4 py-12 text-sm text-muted`}
      >
        <span className="flex items-center gap-3">
          <Mark size={18} className="text-accent" />
          {t.footer.madeAs}
        </span>
        <span className="flex items-center gap-6">
          <Link
            href={`/${l}/developers`}
            className="mono transition hover:text-ink"
          >
            {t.nav.developers}
          </Link>
          <a href={GITHUB_ORG} className="mono transition hover:text-ink">
            {t.footer.source}
          </a>
        </span>
      </footer>
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mono mb-8">{children}</p>;
}

function Img({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="orb-dark ba-frame ba-fade-edges h-auto w-full"
      />
    </>
  );
}
