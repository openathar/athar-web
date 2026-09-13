/**
 * Hijri-Kalender-Konvertierung — vollständig lokal, kein Server.
 *
 * Vorwärts (Gregorianisch → Hijri) nutzt direkt `Intl.DateTimeFormat` mit
 * dem Kalender `islamic-umalqura` (ICU, im Browser/Node eingebaut).
 *
 * Rückwärts (Hijri → Gregorianisch) hat keine direkte Intl-Entsprechung.
 * Der tabellarische Umrechnungsalgorithmus (kbisa/al-Beruni) liefert eine
 * Schätzung als Julianisches Tagesdatum; Umalqura weicht davon aber um bis
 * zu ±2 Tage ab (kalkulierte Mondsichtbarkeit statt fester Regel). Deshalb
 * wird die Schätzung anschliessend gegen die echte Umalqura-Ausgabe von
 * Intl abgeglichen und im Umkreis weniger Tage korrigiert.
 */

export type Locale = "de" | "en" | "ar";

const localeTag = (l: Locale) => (l === "de" ? "de-DE" : l === "ar" ? "ar-SA" : "en-GB");

export type HijriDate = { day: number; month: number; monthName: string; year: number };

function hijriPartsOf(date: Date, locale: Locale): HijriDate {
  // "-nu-latn" erzwingt lateinische Ziffern fuer die Zahlenfelder — sonst
  // liefert z.B. ar-SA arabisch-indische Ziffern ("٢" statt "2") und
  // Number(...) daraus wird NaN. Digit-Darstellung fuers UI uebernimmt
  // weiterhin toArabicDigits() an der richtigen Stelle, nicht Intl selbst.
  const parts = new Intl.DateTimeFormat(`${localeTag(locale)}-u-ca-islamic-umalqura-nu-latn`, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  const monthNameParts = new Intl.DateTimeFormat(
    `${localeTag(locale)}-u-ca-islamic-umalqura`,
    { month: "long", timeZone: "UTC" },
  ).formatToParts(date);
  const get = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: Number(get(parts, "day")),
    month: Number(get(parts, "month")),
    monthName: get(monthNameParts, "month"),
    year: Number(get(parts, "year")),
  };
}

export function gregorianToHijri(date: Date, locale: Locale): HijriDate {
  return hijriPartsOf(date, locale);
}

/**
 * Namen der 12 Hijri-Monate in der gewünschten Sprache, korrekt indiziert.
 *
 * Iteriert Tage ab heute vorwärts, bis alle 12 Monatsnummern einmal
 * aufgetreten sind — robust gegenüber Jahresgrenzen, ohne Monatslängen
 * anzunehmen.
 */
export function hijriMonthNames(locale: Locale): string[] {
  const names = new Array<string>(13).fill("");
  let filled = 0;
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i < 400 && filled < 12; i++) {
    const { month, monthName } = hijriPartsOf(d, locale);
    if (!names[month]) {
      names[month] = monthName;
      filled++;
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return names.slice(1);
}

function hijriToJdnApprox(y: number, m: number, d: number): number {
  return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + 1948440 - 1;
}

function jdnToGregorian(jdn: number): Date {
  let l = jdn + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const day = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const year = 100 * (n - 49) + i + l;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Hijri → Gregorianisch. `null`, wenn keine Übereinstimmung gefunden wurde. */
export function hijriToGregorian(
  y: number,
  m: number,
  d: number,
  locale: Locale = "en",
): Date | null {
  const guess = jdnToGregorian(hijriToJdnApprox(y, m, d));
  for (let offset = -4; offset <= 4; offset++) {
    const candidate = new Date(guess);
    candidate.setUTCDate(candidate.getUTCDate() + offset);
    const got = hijriPartsOf(candidate, locale);
    if (got.day === d && got.month === m && got.year === y) return candidate;
  }
  return null;
}
