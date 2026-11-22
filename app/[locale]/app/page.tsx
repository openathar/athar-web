import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "~/lib/i18n";
import {
  appCopy,
  APP_SCREENSHOTS,
  APP_SCREENSHOT_SIZE,
  APP_SOURCE_URL,
  APP_STORE_ID,
  APP_STORE_URL,
  PLAY_LIVE,
  PLAY_STORE_URL,
} from "~/lib/app-copy";
import { StoreQr } from "~/components/lp/store-qr";
import { LpShell } from "~/components/lp/shell";
import { NumberedList, pad } from "~/components/lp/parts";
import { ForceDark } from "~/components/force-dark";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const c = appCopy[locale as Locale];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `/${locale}/app`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/app`])),
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `https://openathar.org/${locale}/app`,
      siteName: "Athar",
      type: "website",
      images: [{ url: "/app/icon.png", width: 320, height: 320, alt: c.iconAlt }],
    },
    // Safari's Smart App Banner — a plain meta tag, no script.
    other: { "apple-itunes-app": `app-id=${APP_STORE_ID}` },
  };
}

/** Screenshots that exist for this locale (checked when the page is built). */
function screenshotsFor(l: Locale) {
  return APP_SCREENSHOTS.filter((s) =>
    existsSync(join(process.cwd(), "public", "app", "screenshots", l, s.file)),
  );
}

/** Die iOS-App: Download, Funktionen, Datenschutz, Quellcode. Text: lib/app-copy.ts. */
export default async function AppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const c = appCopy[l];
  const shots = screenshotsFor(l);

  // Kapitel werden fortlaufend nummeriert; ohne Screenshots faellt "Bildschirme" weg.
  const chapters = (["features", ...(shots.length ? ["screens"] : []), "privacy", "source"] as const).map(
    (k, i) => ({ k, n: pad(i + 1, l) }),
  );
  const n = (k: (typeof chapters)[number]["k"]) => chapters.find((x) => x.k === k)!.n;

  const Head = ({ k }: { k: keyof typeof c.chapters }) => (
    <header className="lp-chap">
      <p className="lp-chap-n mono">
        {n(k)} · {c.chapters[k].name}
      </p>
      <h2 className="title-l">{c.chapters[k].title}</h2>
    </header>
  );

  /** Pfeil "weiter" — in RTL gespiegelt, damit er in Leserichtung zeigt. */
  const Arrow = () => (
    <span aria-hidden className="lp-app-arrow">
      →
    </span>
  );

  const StoreButton = () => (
    <a href={APP_STORE_URL} className="lp-btn lp-app-store" rel="noopener" aria-label={c.ctaAria}>
      {c.cta}
      <Arrow />
    </a>
  );

  /** Google Play: live → a second button; until then a quiet "coming soon" chip (PLAY_LIVE). */
  const PlayButton = () =>
    PLAY_LIVE ? (
      <a href={PLAY_STORE_URL} className="lp-btn lp-btn-ghost lp-app-store" rel="noopener">
        {c.playCta}
        <Arrow />
      </a>
    ) : (
      <span className="lp-app-soon mono">{c.playSoon}</span>
    );

  /** Both stores as QR codes, for someone reading this page on a computer. */
  const Codes = () => (
    <div className="lp-qr-row">
      <StoreQr url={APP_STORE_URL} label="App Store" aria={c.qrAria.replace("{store}", "App Store")} />
      {PLAY_LIVE && (
        <StoreQr url={PLAY_STORE_URL} label="Google Play" aria={c.qrAria.replace("{store}", "Google Play")} />
      )}
    </div>
  );

  return (
    <LpShell locale={l} variant="2" home path="/app" current="app">
      <ForceDark />

      {/* ---------- Kopf: Name, Download, Eckdaten ---------- */}
      <section className="lp-wrap lp-app-hero">
        <div className="lp-app-hero-text">
          <p className="lp-eyebrow mono">{c.eyebrow}</p>
          <h1 className="title-xl">
            {c.title[0]}
            <br />
            <span className="lp-dim">{c.title[1]}</span>
          </h1>
          <p className="lp-lead">{c.lead}</p>
          <p className="lp-actions">
            <StoreButton />
            <PlayButton />
            <a href={APP_SOURCE_URL} className="lp-link" rel="noopener">
              {c.source} <Arrow />
            </a>
          </p>
          <p className="lp-app-note">
            {c.pending} {PLAY_LIVE ? "" : c.android}
          </p>
        </div>

        <aside className="lp-app-card" aria-label={c.appName}>
          <img
            src="/app/icon.png"
            alt={c.iconAlt}
            width={320}
            height={320}
            decoding="async"
            className="lp-app-icon"
          />
          <p className="lp-app-name">{c.appName}</p>
          <dl className="lp-app-facts">
            {c.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd className={/^[0-9٠-٩]+$/.test(f.v) ? "mono" : undefined}>{f.v}</dd>
              </div>
            ))}
          </dl>
          <Codes />
          <p className="lp-app-note lp-qr-hint">{c.qrHint}</p>
        </aside>
      </section>

      <div className="lp-wrap lp-app-body">
        {/* ---------- Funktionen ---------- */}
        <section className="lp-chapter" id="features">
          <Head k="features" />
          <NumberedList items={c.features} locale={l} />
        </section>

        {/* ---------- Bildschirme: nur wenn Dateien da sind (APP_SCREENSHOTS) ---------- */}
        {shots.length > 0 && (
          <section className="lp-chapter" id="screens">
            <Head k="screens" />
            <ul className="lp-app-shots">
              {shots.map((s, i) => (
                <li key={s.file}>
                  <img
                    src={`/app/screenshots/${l}/${s.file}`}
                    alt={`${c.appName} — ${c.shots[s.key]}`}
                    width={APP_SCREENSHOT_SIZE.width}
                    height={APP_SCREENSHOT_SIZE.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <p>
                    <span className="mono lp-list-n">{pad(i + 1, l)}</span> {c.shots[s.key]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Datenschutz ---------- */}
        <section className="lp-chapter" id="privacy">
          <Head k="privacy" />
          <p className="lp-lead">{c.privacyLead}</p>
          <ul className="lp-points lp-app-points">
            {c.privacyPoints.map((p) => (
              <li key={p.slice(0, 24)}>{p}</li>
            ))}
          </ul>
          <p>
            <Link href={`/${l}/privacy`} className="lp-link">
              {c.privacyLink} <Arrow />
            </Link>
          </p>
        </section>

        {/* ---------- Quellcode ---------- */}
        <section className="lp-chapter" id="source">
          <Head k="source" />
          <p className="lp-lead">{c.sourceLead}</p>
          <p>
            <a href={APP_SOURCE_URL} className="lp-link mono" rel="noopener" dir="ltr">
              github.com/openathar/athar-mobile-app
            </a>
          </p>
        </section>

        {/* ---------- Schluss: noch einmal der Download ---------- */}
        <section className="lp-app-closing">
          <h2 className="title-l">{c.closing}</h2>
          <div className="lp-app-closing-cta">
            <p className="lp-actions">
              <StoreButton />
              <PlayButton />
            </p>
            <Codes />
          </div>
        </section>
      </div>
    </LpShell>
  );
}
