import { Methods, PrayerTimes, formatLocalTime } from "./athan-core";

/**
 * Gebetszeiten für die interaktiven Abschnitte der Startseite (Weltkarte,
 * Erde & Mond).
 *
 * Berechnet lokal mit dem TypeScript-Port von `athan-core-java`
 * (`lib/athan-core.ts`) — kein externer API-Aufruf mehr. Die Zeiten werden
 * in der Zeitzone des Ortes angezeigt; dafür wird der UTC-Offset der
 * IANA-Zeitzone (Browser-Zeitzone oder Stadtzuordnung) zum aktuellen
 * Zeitpunkt bestimmt.
 */

export const prayerKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof prayerKeys)[number];

export type PrayerData = {
  city: string;
  timings: Record<PrayerKey, string>;
  method: string;
  /** true = lokal berechnet (kein Netzwerk nötig) */
  live: boolean;
};

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Arabisch-indische Ziffern — im arabischen Satz wirken lateinische Ziffern fremd. */
export function toArabicDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** UTC-Offset einer IANA-Zeitzone in Stunden zum gegebenen Zeitpunkt. */
export function utcOffsetHoursForZone(timeZone: string, date: Date): number {
  // formatToParts liefert nur ganze Sekunden — ohne das Nullen der
  // Millisekunden wäre der Offset um den ms-Anteil verfälscht und die
  // Minuten-Rundung der Gebetszeiten könnte um 1 Minute abweichen.
  const whole = new Date(Math.floor(date.getTime() / 1000) * 1000);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(whole);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const asUtc = Date.UTC(
    +get("year"), +get("month") - 1, +get("day"),
    +get("hour"), +get("minute"), +get("second"),
  );
  return (asUtc - whole.getTime()) / 3_600_000;
}

/**
 * Gebetszeiten für frei gewählte Koordinaten — genutzt von der Weltkarte
 * und dem Erde-&-Mond-Abschnitt. `timeZone` ist eine IANA-Zeitzone (z. B.
 * die Browser-Zeitzone oder die Zone der gewählten Stadt); ohne Angabe
 * gilt die Browser-Zeitzone.
 */
export function getPrayerTimesForCoords(
  lat: number,
  lon: number,
  cityName: string,
  timeZone?: string,
): PrayerData {
  const now = new Date();
  const zone = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = utcOffsetHoursForZone(zone, now);
  const result = new PrayerTimes(Methods.MWL).getTimes(
    now.getFullYear(), now.getMonth() + 1, now.getDate(), lat, lon,
  );
  return {
    city: cityName,
    timings: {
      fajr: formatLocalTime(result.fajr, offset),
      dhuhr: formatLocalTime(result.dhuhr, offset),
      asr: formatLocalTime(result.asr, offset),
      maghrib: formatLocalTime(result.maghrib, offset),
      isha: formatLocalTime(result.isha, offset),
    },
    method: "MWL",
    live: true,
  };
}