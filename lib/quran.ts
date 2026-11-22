import type { Locale } from "./i18n";

/**
 * Qur'an-Verse, gebündelt und wörtlich — zur Laufzeit wird nichts aus dem Netz geholt
 * (bis 2026-11-22 kam der Text live von der quran.com-API; deren Bedingungen verbieten
 * Weitergabe und Speicherung, deshalb ersetzt):
 *
 *   arabic → Tanzil Quran Text (Uthmani), Tanzil Project, tanzil.net
 *   de     → Bubenheim & Elyas, QuranEnc.com `german_bubenheim`
 *   en     → Saheeh International, QuranEnc.com `english_saheeh`
 *   ar     → keine Übersetzung nötig; stattdessen at-Tafsīr al-Muyassar
 *            (König-Fahd-Komplex), QuranEnc.com `arabic_moyassar`
 *
 * Die Daten liegen in data/quran/ (erzeugt von scripts/fetch-quran.mjs, geprüft von
 * scripts/verify-verses.mjs). Es wird nichts generiert, umformuliert oder bereinigt:
 * Fußnotenmarker bleiben im Text, die Fußnoten selbst kommen als eigenes Feld mit.
 * QuranEnc verlangt Herausgeber, Quelle und Versionsnummer bei jeder Wiedergabe → `attribution`.
 */

type Aya = { t: string; f?: string };
type Edition = { key: string; version: string; credit: string; suras: Aya[][] };
type Tanzil = { source: string; suras: string[][] };

const EDITION_FILE: Record<Locale, () => Promise<{ default: unknown }>> = {
  de: () => import("~/data/quran/german_bubenheim.json"),
  en: () => import("~/data/quran/english_saheeh.json"),
  ar: () => import("~/data/quran/arabic_moyassar.json"),
};

let tanzil: Promise<Tanzil> | null = null;
const editions: Partial<Record<Locale, Promise<Edition>>> = {};

const loadTanzil = () =>
  (tanzil ??= import("~/data/quran/tanzil-uthmani.json").then((m) => m.default as unknown as Tanzil));
const loadEdition = (l: Locale) =>
  (editions[l] ??= EDITION_FILE[l]().then((m) => m.default as Edition));

export type VerseText = {
  key: string;
  arabic: string;
  /** Übersetzung (de/en) bzw. Tafsir-Auszug (ar), wörtlich inkl. Fußnotenmarker */
  rendered: string;
  /** Fußnoten der Ausgabe zu diesem Vers, wörtlich ("" = keine) */
  footnotes: string;
  /** Wer die Übersetzung/den Tafsir verantwortet, mit Quelle und Version */
  attribution: string;
  /** Quelle des arabischen Textes (Tanzil verlangt Nennung + Link) */
  arabicSource: string;
  sourceUrl: string;
  sourceLabel: string;
};

/** "36:38" → [36, 38], oder null bei ungültigem Schlüssel. */
function parseKey(verseKey: string): [number, number] | null {
  const m = /^(\d{1,3}):(\d{1,3})$/.exec(verseKey);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

export async function getVerse(verseKey: string, locale: Locale): Promise<VerseText> {
  const [quran, edition] = await Promise.all([loadTanzil(), loadEdition(locale)]);
  const ref = parseKey(verseKey);
  const arabic = ref ? quran.suras[ref[0] - 1]?.[ref[1] - 1] : undefined;
  const aya = ref ? edition.suras[ref[0] - 1]?.[ref[1] - 1] : undefined;
  if (!ref || arabic === undefined || !aya) throw new Error(`Unbekannter Vers: ${verseKey}`);
  return {
    key: verseKey,
    arabic,
    rendered: aya.t.trim(),
    footnotes: aya.f ?? "",
    attribution: `${edition.credit} · QuranEnc.com v${edition.version}`,
    arabicSource: "Tanzil Project",
    sourceUrl: `https://quranenc.com/${locale}/browse/${edition.key}/${ref[0]}`,
    sourceLabel: "QuranEnc.com",
  };
}
