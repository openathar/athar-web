import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "~/lib/i18n";
import { appCopy, APP_STORE_ID, APP_STORE_URL, PLAY_LIVE, PLAY_STORE_URL } from "~/lib/app-copy";
import { StoreQr } from "~/components/lp/store-qr";
import { LpShell } from "~/components/lp/shell";
import { NumberedList, pad } from "~/components/lp/parts";
import { NoDataBadge, Phone, StoreButtons, screenshotsFor } from "~/components/lp/app-store";
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

/** Die App: Download, Bildschirme, Funktionen, Datenschutz. Text: lib/app-copy.ts. */
export default async function AppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const c = appCopy[l];
  const shots = screenshotsFor(l);
  const heroShot = shots.find((s) => s.key === "today") ?? shots[0];
  const backShot = shots.find((s) => s.key === "qibla");

  // Kapitel werden fortlaufend nummeriert; ohne Screenshots faellt "Bildschirme" weg.
  const chapters = ([...(shots.length ? ["screens"] : []), "features", "privacy"] as const).map(
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

      {/* ---------- Kopf: Name, Download, zwei Telefone ---------- */}
      <section className="lp-wrap lp-app-hero">
        <div className="lp-app-hero-text">
          <p className="lp-eyebrow mono">{c.eyebrow}</p>
          <h1 className="title-xl">
            {c.title[0]}
            <br />
            <span className="lp-dim">{c.title[1]}</span>
          </h1>
          <p className="lp-lead">{c.lead}</p>
          <StoreButtons locale={l} />
          <NoDataBadge locale={l} />
          <p className="lp-app-note">{c.note}</p>
        </div>

        {heroShot && (
          // Dekoration: dieselben Bilder stehen beschrieben unter "Bildschirme".
          <div className="lp-app-hero-phones" aria-hidden>
            {backShot && <Phone shot={backShot} alt="" className="lp-phone-back" />}
            <Phone shot={heroShot} alt="" priority className="lp-phone-front" />
          </div>
        )}
      </section>

      {/* ---------- Eckdaten + QR-Codes ---------- */}
      <section className="lp-wrap" aria-label={c.appName}>
        <div className="lp-app-card">
          <div className="lp-app-id">
            <img src="/app/icon.png" alt={c.iconAlt} width={320} height={320} decoding="async" className="lp-app-icon" />
            <p className="lp-app-name">{c.appName}</p>
          </div>
          <dl className="lp-app-facts">
            {c.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd className={/^[0-9٠-٩]+$/.test(f.v) ? "mono" : undefined}>{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="lp-app-codes">
            <Codes />
            <p className="lp-app-note lp-qr-hint">{c.qrHint}</p>
          </div>
        </div>
      </section>

      <div className="lp-wrap lp-app-body">
        {/* ---------- Bildschirme: nur wenn Dateien da sind (APP_SCREENSHOTS) ---------- */}
        {shots.length > 0 && (
          <section className="lp-chapter" id="screens">
            <Head k="screens" />
            <ul className="lp-app-shots">
              {shots.map((s, i) => (
                <li key={s.key}>
                  <Phone shot={s} alt={`${c.appName} — ${c.shots[s.key].title}: ${c.shots[s.key].body}`} />
                  <p>
                    <span className="mono lp-list-n">{pad(i + 1, l)}</span> <b>{c.shots[s.key].title}</b>
                    <br />
                    <span className="lp-dim">{c.shots[s.key].body}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Funktionen ---------- */}
        <section className="lp-chapter" id="features">
          <Head k="features" />
          <NumberedList items={c.features} locale={l} />
          <p className="lp-app-sources">{c.sources}</p>
        </section>

        {/* ---------- Datenschutz ---------- */}
        <section className="lp-chapter" id="privacy">
          <Head k="privacy" />
          <div className="lp-app-privacy">
            <div>
              <p className="lp-app-nodata-big">{c.noData.label}</p>
              <p className="lp-app-note">{c.noData.body}</p>
            </div>
            <div>
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
            </div>
          </div>
        </section>

        {/* ---------- Schluss: noch einmal der Download ---------- */}
        <section className="lp-app-closing">
          <h2 className="title-l">{c.closing}</h2>
          <div className="lp-app-closing-cta">
            <StoreButtons locale={l} />
            <Codes />
          </div>
        </section>
      </div>
    </LpShell>
  );
}
