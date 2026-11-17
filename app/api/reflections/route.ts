import { NextRequest, NextResponse } from "next/server";
import { getVerse } from "~/lib/quran";
import { locales, type Locale } from "~/lib/i18n";
import reflections from "~/data/reflections.json";
import { allLiveReflections } from "~/lib/reflections-db";

/** Live rows get their own number range so they can never collide with a seed index. */
const LIVE_OFFSET = 1000;

export const dynamic = "force-dynamic";

/**
 * Backend für "Ein Buch, zwei Erklärungen": Auf einen Klick im Frontend
 * liefert dieser Endpoint ein zufälliges — vom gerade gezeigten
 * verschiedenes — Vers+Beobachtung-Paar. Der Vers wird live von quran.com
 * geholt (mit Rückfalltext aus dem Repo bei Netzproblemen, siehe
 * lib/quran.ts). Jeder Klick soll frische Inhalte laden, deshalb
 * force-dynamic statt ISR-Cache.
 *
 * Quelle: Seed (reflections.json) + Postgres-Live-Pool (n8n-generiert und
 * menschlich freigegeben) in EINEM Pool.
 */
export async function GET(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get("locale");
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : "en";
  const exclude = Number(req.nextUrl.searchParams.get("exclude") ?? "-1");

  // Ein Pool aus beidem: dem geprüften Seed (reflections.json) UND den freigegebenen
  // Postgres-Zeilen. Der Live-Pool ersetzt den Seed nicht, er wächst darum herum.
  const live = await allLiveReflections();
  const keys: number[] = [
    ...reflections.entries.map((_, i) => i),
    ...live.map((r) => LIVE_OFFSET + r.id),
  ];
  const candidates = keys.length > 1 ? keys.filter((k) => k !== exclude) : keys;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];

  if (pick >= LIVE_OFFSET) {
    const row = live.find((r) => LIVE_OFFSET + r.id === pick)!;
    const verse = await getVerse(row.verse, locale, { arabic: "", rendered: "" });
    return NextResponse.json({
      dayIndex: pick,
      field: row.field[locale],
      observation: row.observation[locale],
      verse,
    });
  }

  const dayIndex = pick;
  const entry = reflections.entries[dayIndex];
  const verse = await getVerse(entry.verse, locale, {
    arabic: entry.fallback.arabic,
    rendered: locale === "ar" ? entry.fallback.arabic : (entry.fallback[locale] ?? ""),
  });

  return NextResponse.json({
    dayIndex,
    field: entry.field[locale],
    observation: entry.observation[locale],
    verse,
  });
}
