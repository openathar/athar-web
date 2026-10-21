import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { landingCopy } from "~/lib/landing-copy";
import { lpCopy } from "~/lib/lp-copy";
import { upcomingIslamicDates } from "~/lib/islamic-dates";
import { getVerse } from "~/lib/quran";
import { API_BASE_URL } from "~/lib/api-config";
import reflections from "~/data/reflections.json";
import { LpShell, GITHUB_ORG } from "~/components/lp/shell";
import { MoonStage } from "~/components/lp/moon-lazy";
import { TreeGrow } from "~/components/lp/tree-grow";
import { CosmosTabs } from "~/components/cosmos-tabs";
import { MoonFaces } from "~/components/lp/moon-faces";
import { NumberedList, pad } from "~/components/lp/parts";
import { Reveal } from "~/components/reveal";
import { BuildIn } from "~/components/build-in";
import { DailySign } from "~/components/daily-sign";
import { EmotionTree } from "~/components/lp/emotion-tree";
import { ForceDark } from "~/components/force-dark";

export const revalidate = 3600;

const CHAPTERS = ["roots", "trunk", "branches", "crown", "fruit", "seeds"] as const;

/**
 * Startseite — "Baum unter dem Mond" (frueher Variante 2).
 *
 * Hero: der echte Mond (heutige Phase) geht hinter der leuchtenden Baumkrone
 * auf. Danach waechst der Baum beim Scrollen, und jedes Kapitel ist ein Teil
 * von ihm: Wurzeln (rechnet lokal), Stamm (was traegt), Aeste (zueinander),
 * Krone (der Himmel), Fruechte (API, Versprechen), Samen (mitmachen).
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const rtl = isRtl(l);
  const t = dictionaries[l];
  const c = landingCopy[l];
  const p = lpCopy[l];
  const ch = p.v2.chapters;
  const dates = upcomingIslamicDates(l, 4);
  const fmt = new Intl.DateTimeFormat(l === "de" ? "de-DE" : l === "ar" ? "ar-JO" : "en-GB", {
    weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  const dayIndex = Math.floor(Date.now() / 86_400_000) % reflections.entries.length;
  const verses = await Promise.all(
    reflections.entries.map((e) =>
      getVerse(e.verse, l, {
        arabic: e.fallback.arabic,
        rendered: l === "ar" ? e.fallback.arabic : (e.fallback[l] ?? ""),
      }),
    ),
  );
  const stat = c.hero.stats[0];
  const moonLabels = { ...t.cosmos.moonView, hijri: t.dates.label };
  const iso = new Date().toISOString();

  const Head = ({ i }: { i: number }) => (
    <header className="lp-chap" data-chapter={i}>
      <p className="lp-chap-n mono">
        {pad(i + 1, l)} · {ch[CHAPTERS[i]].name}
      </p>
      <h2 className="title-l">{ch[CHAPTERS[i]].title}</h2>
    </header>
  );

  return (
    <LpShell locale={l} variant="2" home>
      <ForceDark />
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.setAttribute("data-theme","dark")' }} />

      {/* ---------- Hero: Mond hinter dem Baum ---------- */}
      <section className="lp-wrap lp-hero2">
        <div className="lp-hero2-text">
          <p className="lp-eyebrow mono">{c.hero.eyebrow}</p>
          <h1 className="title-xl">
            {l !== "ar" && <span className="sr-only">Athar — </span>}
            {c.hero.title[0]}
            <br />
            <span className="lp-dim">{c.hero.title[1]}</span>
          </h1>
          <p className="lp-lead">{c.hero.lead}</p>
          <p className="lp-actions">
            <Link href={`/${l}`} className="lp-btn">
              {p.common.tryIt}
            </Link>
            <a href={GITHUB_ORG} className="lp-link" rel="noopener">
              {p.common.github} →
            </a>
          </p>
        </div>
        <div className="lp-hero2-moon">
          <div className="lp-scene">
            <MoonStage part="canvas" locale={l} initialIso={iso} labels={moonLabels} phaseNames={t.earth.phaseNames} />
          </div>
          <MoonStage part="facts" locale={l} initialIso={iso} labels={moonLabels} phaseNames={t.earth.phaseNames} />
        </div>
      </section>

      {/* ---------- Die Aya, aus der der Name kommt ---------- */}
      <section className="lp-wrap lp-ayah-sec">
        <Reveal>
          <figure className="lp-ayah">
            <blockquote>
              <p className="quran lp-ayah-ar" lang="ar" dir="rtl">
                {dictionaries.ar.ayah.text}
              </p>
              {!rtl && <p className="lp-ayah-tr">{t.ayah.text}</p>}
            </blockquote>
            <figcaption className="mono">{t.ayah.ref}</figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ---------- Der Baum waechst ---------- */}
      <div className="lp-wrap">
        <TreeGrow names={CHAPTERS.map((k) => ch[k].name)} alt={c.what.imgAlt} hint={p.v2.growHint}>
          {/* 1 Wurzeln: die Erde rechnet, der Mond zaehlt */}
          <section className="lp-chapter lp-cosmos">
            <Head i={0} />
            <Reveal>
              <p className="lp-stat">
                <b>{stat.value}</b> <span>{stat.label}</span>
              </p>
              <p className="lp-lead">{t.cosmos.intro}</p>
            </Reveal>
            <CosmosTabs locale={l} cosmos={t.cosmos} earth={t.earth} map={t.map} zoom={c.cosmos} showMoon={false} />
            <div className="lp-sub-block">
              <MoonFaces locale={l} labels={p.v2.faces} phaseNames={t.earth.phaseNames} />
            </div>
          </section>

          {/* 2 Stamm: was traegt */}
          <section className="lp-chapter">
            <Head i={1} />
            <BuildIn className="fade-block lp-wide">
              <img src="/beit-athar/workers.jpg" alt={c.what.imgAlt} width={1510} height={874} loading="lazy" decoding="async" className="orb-dark" />
            </BuildIn>
            <Reveal>
              <NumberedList items={c.what.items} locale={l} />
            </Reveal>
          </section>

          {/* 3 Aeste: Lesen. Beten. Weitergeben. */}
          <section className="lp-chapter">
            <Head i={2} />
            <BuildIn className="fade-block lp-wide">
              <img src="/beit-athar/connection.jpg" alt={c.ways.imgAlt} width={1600} height={696} loading="lazy" decoding="async" className="orb-dark" />
            </BuildIn>
            <Reveal>
              <ol className="lp-words">
                {c.ways.words.map((w, i) => (
                  <li key={w}>
                    <h3 className="title-l">{w}</h3>
                    <p>{c.ways.bodies[i]}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>

          {/* 4 Krone: der Himmel */}
          <section className="lp-chapter" id="cosmos">
            <Head i={3} />
            <Reveal>
              <p className="lp-lead">{t.dates.intro}</p>
            </Reveal>
            <BuildIn className="fade-block alpha-block orb-block lp-orb">
              <img src="/beit-athar/world-dark.webp" alt={c.cosmosOrbAlt} width={1200} height={1200} loading="lazy" decoding="async" className="orb-dark" />
            </BuildIn>
            <Reveal>
              <p className="lp-eyebrow mono">{t.dates.label}</p>
              <ol className="lp-dates">
                {dates.map((d) => (
                  <li key={d.key}>
                    <h3>{d.name}</h3>
                    <p className="lp-dates-when mono">{d.gregorian ? fmt.format(d.gregorian) : ""}</p>
                    <p>{d.note}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal>
              <p className="lp-eyebrow mono">{t.signs.label}</p>
              <h3 className="lp-sub">{t.signs.heading}</h3>
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

          {/* 5 Fruechte: API und Versprechen */}
          <section className="lp-chapter" id="dev">
            <Head i={4} />
            <Reveal>
              <p className="lp-lead">{c.dev.lead}</p>
              <pre className="lp-code mono" dir="ltr" lang="en">
                <code>{`curl "${API_BASE_URL}/v1/prayer-times\\
  ?lat=52.52&lon=13.405\\
  &date=2026-09-14\\
  &method=MWL&utcOffset=2"`}</code>
              </pre>
              <p>
                <Link href={`/${l}/developers`} className="lp-link">
                  {c.dev.cta}
                </Link>
              </p>
            </Reveal>
            <Reveal>
              <aside className="lp-aside">
              <p className="lp-aside-title mono">{c.promise.title}</p>
              <p>{c.promise.lead}</p>
              <ul>
                {c.promise.badges.map((b) => (
                  <li key={b} className="mono">
                    {b}
                  </li>
                ))}
              </ul>
            </aside>
            </Reveal>
          </section>

          {/* 6 Samen: mitmachen */}
          <section className="lp-chapter">
            <Head i={5} />
            <BuildIn className="fade-block lp-wide">
              <img src="/beit-athar/bridge-dark.webp" alt={c.take.bridgeAlt} width={1600} height={900} loading="lazy" decoding="async" className="orb-dark" />
            </BuildIn>
            <Reveal>
              <p className="lp-lead">{c.take.lead}</p>
              <ol className="lp-ways lp-ways--stack">
                {c.take.cards.map((card, i) => (
                  <li key={card.title}>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                    <Link href={i === 0 ? `/${l}` : i === 1 ? GITHUB_ORG : `/${l}/developers`} className="lp-link">
                      {card.cta}
                    </Link>
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>
        </TreeGrow>
      </div>

      {/* ---------- Gefuehle als Baum ---------- */}
      <section className="lp-wrap lp-emo-sec">
        <div className="lp-emo-intro">
          <p className="lp-eyebrow mono">{p.v3.emotions.eyebrow}</p>
          <h2 className="title-l">{p.v3.emotions.title}</h2>
          <p className="lp-lead">{p.v3.emotions.lead}</p>
        </div>
        <EmotionTree copy={p.v3.emotions} rtl={l === "ar"} />
        <p className="lp-emo-note">
          <span>{p.v3.emotions.note}</span>
          <a href={p.v3.emotions.sourceUrl} rel="noopener">
            {p.v3.emotions.source}
          </a>
        </p>
      </section>

      {/* ---------- Abschluss ---------- */}
      <section className="lp-closing2">
        <div className="lp-closing2-text">
          <p className="title-xl">{t.campaign.closing}</p>
          <p className="lp-actions">
            <a href={GITHUB_ORG} className="lp-btn" rel="noopener">
              {t.campaign.cta}
            </a>
          </p>
        </div>
      </section>
    </LpShell>
  );
}
