import { NextRequest, NextResponse } from "next/server";
import { getVerse } from "~/lib/quran";
import { locales, type Locale } from "~/lib/i18n";
import reflections from "~/data/reflections.json";

export const dynamic = "force-dynamic";

/**
 * Backend für "Ein Buch, zwei Erklärungen": Auf einen Klick im Frontend
 * liefert dieser Endpoint ein zufälliges — vom gerade gezeigten
 * verschiedenes — Vers+Beobachtung-Paar. Der Vers wird live von quran.com
 * geholt (mit Rückfalltext aus dem Repo bei Netzproblemen, siehe
 * lib/quran.ts). Jeder Klick soll frische Inhalte laden, deshalb
 * force-dynamic statt ISR-Cache.
 */
export async function GET(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get("locale");
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : "en";
  const exclude = Number(req.nextUrl.searchParams.get("exclude") ?? "-1");

  const entries = reflections.entries;
  let dayIndex = Math.floor(Math.random() * entries.length);
  if (entries.length > 1) {
    while (dayIndex === exclude) {
      dayIndex = Math.floor(Math.random() * entries.length);
    }
  }

  const entry = entries[dayIndex];
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
