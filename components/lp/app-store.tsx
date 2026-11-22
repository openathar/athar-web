import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "~/lib/i18n";
import {
  appCopy,
  APP_SCREENSHOTS,
  APP_SCREENSHOT_SIZE,
  APP_STORE_URL,
  PLAY_LIVE,
  PLAY_STORE_URL,
  type ShotKey,
} from "~/lib/app-copy";

/**
 * Bausteine der App-Werbung (App-Seite, Startseite). Server-Komponenten, kein Script.
 * Keine Apple-/Google-Badges: eigener Knopfstil, Store-Namen als Text, einfache eigene Glyphen.
 */

export type Shot = { key: ShotKey; base: string };

/** Screenshots für eine Sprache; fehlt eine Datei, die englische, sonst gar keine. Geprüft beim Build. */
export function screenshotsFor(l: Locale): Shot[] {
  const has = (loc: string, file: string) =>
    existsSync(join(process.cwd(), "public", "app", "screenshots", loc, `${file}.webp`));
  return APP_SCREENSHOTS.flatMap((s) => {
    const loc = has(l, s.file) ? l : has("en", s.file) ? "en" : null;
    return loc ? [{ key: s.key, base: `/app/screenshots/${loc}/${s.file}` }] : [];
  });
}

/** Ein Screenshot im schlichten Telefonrahmen (nur Linien, kein Glas). */
export function Phone({
  shot,
  alt,
  priority = false,
  className = "",
}: {
  shot: Shot;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`lp-phone ${className}`}>
      <picture>
        <source type="image/avif" srcSet={`${shot.base}.avif`} />
        <img
          src={`${shot.base}.webp`}
          alt={alt}
          width={APP_SCREENSHOT_SIZE.width}
          height={APP_SCREENSHOT_SIZE.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </picture>
    </div>
  );
}

/** Telefon-Umriss — eine neutrale Glyphe, kein Markenlogo. */
const PhoneGlyph = () => (
  <svg aria-hidden viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
    <path d="M10.5 18.5h3" strokeLinecap="round" />
  </svg>
);

/** Abspiel-Dreieck — eine neutrale Glyphe, kein Markenlogo. */
const PlayGlyph = () => (
  <svg aria-hidden viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M7 4.5v15l12-7.5z" />
  </svg>
);

/**
 * App Store als Knopf; Google Play als Knopf, sobald PLAY_LIVE — bis dahin ein
 * nicht klickbares "demnächst" im selben Umriss (kein toter Link).
 */
export function StoreButtons({ locale }: { locale: Locale }) {
  const c = appCopy[locale];
  return (
    <div className="lp-stores">
      <a href={APP_STORE_URL} className="lp-store lp-store-main" rel="noopener" aria-label={c.ctaAria}>
        <PhoneGlyph />
        <span className="lp-store-text">
          <small>{c.storeKicker}</small>
          <b lang="en" dir="ltr">App Store</b>
        </span>
      </a>
      {PLAY_LIVE ? (
        <a href={PLAY_STORE_URL} className="lp-store" rel="noopener">
          <PlayGlyph />
          <span className="lp-store-text">
            <small>{c.playLiveKicker}</small>
            <b lang="en" dir="ltr">Google Play</b>
          </span>
        </a>
      ) : (
        <span className="lp-store lp-store-soon">
          <PlayGlyph />
          <span className="lp-store-text">
            <small>{c.playKicker}</small>
            <b lang="en" dir="ltr">Google Play</b>
          </span>
        </span>
      )}
    </div>
  );
}

/** Kleine Plakette "Data Not Collected" (Apples Etikett, in der Sprache der Seite). */
export function NoDataBadge({ locale }: { locale: Locale }) {
  return (
    <p className="lp-nodata">
      <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.2 8.4 7.5 10 4.3-1.6 7.5-5.4 7.5-10V5.6z" />
        <path d="m8.8 12 2.2 2.2 4.2-4.4" />
      </svg>
      {appCopy[locale].noData.label}
    </p>
  );
}
