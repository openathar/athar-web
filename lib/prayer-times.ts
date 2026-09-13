import type { Locale } from "./i18n";

/**
 * Gebetszeiten für den Demo-Block auf der Startseite.
 *
 * Quelle ist vorerst die offene Aladhan-API. Das ist bewusst so: lieber echte
 * Werte aus einer fremden, offenen API zeigen als erfundene Zahlen unter eine
 * Überschrift schreiben, die "berechnet" verspricht. Sobald `athan-core-java`
 * steht, wird genau dieser Aufruf gegen die eigene Engine getauscht.
 */

const CITY = { name: "Amman", lat: 31.9539, lon: 35.9106 };
/** 23 = Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan */
const METHOD = 23;

export const prayerKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof prayerKeys)[number];

export type PrayerData = {
  city: string;
  timings: Record<PrayerKey, string>;
  fajrAngle: string;
  ishaAngle: string;
  maghribOffset: string | null;
  asrFactor: number;
  gregorian: string;
  hijri: string;
  method: string;
  /** false = API nicht erreichbar, es werden Rückfallwerte gezeigt */
  live: boolean;
};

const FALLBACK: Omit<PrayerData, "gregorian" | "hijri"> = {
  city: CITY.name,
  timings: {
    fajr: "04:56",
    dhuhr: "12:32",
    asr: "16:05",
    maghrib: "18:50",
    isha: "20:08",
  },
  fajrAngle: "18",
  ishaAngle: "18",
  maghribOffset: "5",
  asrFactor: 1,
  method: "Ministry of Awqaf, Jordan",
  live: false,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Aladhan hängt an Zeiten teils eine Zonenangabe an ("04:56 (EEST)"). */
function cleanTime(v: string) {
  return v.split(" ")[0]?.trim() ?? v;
}

function angleFrom(v: unknown, fallback: string) {
  if (typeof v === "number") return String(v);
  if (typeof v === "string") {
    const m = v.match(/[\d.]+/);
    if (m) return m[0];
  }
  return fallback;
}

export async function getPrayerTimes(locale: Locale): Promise<PrayerData> {
  const now = new Date();
  const dateParam = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
  const url = `https://api.aladhan.com/v1/timings/${dateParam}?latitude=${CITY.lat}&longitude=${CITY.lon}&method=${METHOD}`;

  const intlLocale = locale === "de" ? "de-DE" : locale === "ar" ? "ar-JO" : "en-GB";

  try {
    // Einmal pro Stunde neu holen — die Zeiten ändern sich täglich, nicht laufend.
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`aladhan responded ${res.status}`);
    const json = await res.json();
    const d = json?.data;
    if (!d?.timings) throw new Error("unexpected payload");

    const params = d.meta?.method?.params ?? {};
    const timestamp = Number(d.date?.timestamp);
    const gregorian = Number.isFinite(timestamp)
      ? new Intl.DateTimeFormat(intlLocale, {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: d.meta?.timezone ?? "UTC",
        }).format(new Date(timestamp * 1000))
      : (d.date?.readable ?? "");

    const h = d.date?.hijri;
    const hijriMonth = locale === "ar" ? h?.month?.ar : h?.month?.en;
    const hijriDay = locale === "ar" ? toArabicDigits(h?.day ?? "") : (h?.day ?? "");
    const hijriYear = locale === "ar" ? toArabicDigits(h?.year ?? "") : (h?.year ?? "");
    const hijri = h ? `${hijriDay} ${hijriMonth} ${hijriYear}` : "";

    return {
      city: CITY.name,
      timings: {
        fajr: cleanTime(d.timings.Fajr),
        dhuhr: cleanTime(d.timings.Dhuhr),
        asr: cleanTime(d.timings.Asr),
        maghrib: cleanTime(d.timings.Maghrib),
        isha: cleanTime(d.timings.Isha),
      },
      fajrAngle: angleFrom(params.Fajr, FALLBACK.fajrAngle),
      ishaAngle: angleFrom(params.Isha, FALLBACK.ishaAngle),
      maghribOffset:
        typeof params.Maghrib === "string" ? angleFrom(params.Maghrib, "0") : null,
      asrFactor: d.meta?.school === "HANAFI" ? 2 : 1,
      gregorian,
      hijri,
      method: d.meta?.method?.name ?? FALLBACK.method,
      live: true,
    };
  } catch {
    // Kein Grund, die Seite scheitern zu lassen — Build und Laufzeit müssen
    // auch ohne erreichbare Fremd-API durchgehen.
    return {
      ...FALLBACK,
      gregorian: new Intl.DateTimeFormat(intlLocale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now),
      hijri: "",
    };
  }
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Arabisch-indische Ziffern — im arabischen Satz wirken lateinische Ziffern fremd. */
export function toArabicDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}
