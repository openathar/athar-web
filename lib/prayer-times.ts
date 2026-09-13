import type { Locale } from "./i18n";

/**
 * Gebetszeiten für die interaktiven Abschnitte der Startseite (Weltkarte,
 * Erde & Mond).
 *
 * Quelle ist vorerst die offene Aladhan-API. Das ist bewusst so: lieber echte
 * Werte aus einer fremden, offenen API zeigen als erfundene Zahlen. Sobald
 * `athan-core-java` steht, wird genau dieser Aufruf gegen die eigene Engine
 * getauscht.
 */

export const prayerKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof prayerKeys)[number];

export type PrayerData = {
  city: string;
  timings: Record<PrayerKey, string>;
  method: string;
  /** false = API nicht erreichbar, es werden Platzhalter gezeigt */
  live: boolean;
};

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Arabisch-indische Ziffern — im arabischen Satz wirken lateinische Ziffern fremd. */
export function toArabicDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Aladhan hängt an Zeiten teils eine Zonenangabe an ("04:56 (EEST)"). */
function cleanTime(v: string) {
  return v.split(" ")[0]?.trim() ?? v;
}

/** Gebetszeiten für frei gewählte Koordinaten — genutzt von der Weltkarte. */
export async function getPrayerTimesForCoords(
  lat: number,
  lon: number,
  cityName: string,
  locale: Locale,
): Promise<PrayerData> {
  const now = new Date();
  const dateParam = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
  const url = `https://api.aladhan.com/v1/timings/${dateParam}?latitude=${lat}&longitude=${lon}`;

  try {
    // Einmal pro Stunde neu holen — die Zeiten ändern sich täglich, nicht laufend.
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`aladhan responded ${res.status}`);
    const json = await res.json();
    const d = json?.data;
    if (!d?.timings) throw new Error("unexpected payload");

    return {
      city: cityName,
      timings: {
        fajr: cleanTime(d.timings.Fajr),
        dhuhr: cleanTime(d.timings.Dhuhr),
        asr: cleanTime(d.timings.Asr),
        maghrib: cleanTime(d.timings.Maghrib),
        isha: cleanTime(d.timings.Isha),
      },
      method: d.meta?.method?.name ?? "",
      live: true,
    };
  } catch {
    // Kein Grund, die Seite scheitern zu lassen — Build und Laufzeit müssen
    // auch ohne erreichbare Fremd-API durchgehen.
    return {
      city: cityName,
      timings: { fajr: "—:—", dhuhr: "—:—", asr: "—:—", maghrib: "—:—", isha: "—:—" },
      method: "",
      live: false,
    };
  }
}