/**
 * Städte für Karte und 3D-Globus — eine Quelle für beide Ansichten.
 */

export type CityKey =
  | "mecca" | "medina" | "amman" | "cairo" | "istanbul"
  | "berlin" | "jakarta" | "karachi" | "lagos" | "newyork";

export const CITIES: Record<CityKey, { lat: number; lon: number; zone: string; name: Record<"de" | "en" | "ar", string> }> = {
  mecca: { lat: 21.4225, lon: 39.8262, zone: "Asia/Riyadh", name: { de: "Mekka", en: "Mecca", ar: "مكة" } },
  medina: { lat: 24.5247, lon: 39.5692, zone: "Asia/Riyadh", name: { de: "Medina", en: "Medina", ar: "المدينة" } },
  amman: { lat: 31.9539, lon: 35.9106, zone: "Asia/Amman", name: { de: "Amman", en: "Amman", ar: "عمّان" } },
  cairo: { lat: 30.0444, lon: 31.2357, zone: "Africa/Cairo", name: { de: "Kairo", en: "Cairo", ar: "القاهرة" } },
  istanbul: { lat: 41.0082, lon: 28.9784, zone: "Europe/Istanbul", name: { de: "Istanbul", en: "Istanbul", ar: "إسطنبول" } },
  berlin: { lat: 52.52, lon: 13.405, zone: "Europe/Berlin", name: { de: "Berlin", en: "Berlin", ar: "برلين" } },
  jakarta: { lat: -6.2088, lon: 106.8456, zone: "Asia/Jakarta", name: { de: "Jakarta", en: "Jakarta", ar: "جاكرتا" } },
  karachi: { lat: 24.8607, lon: 67.0011, zone: "Asia/Karachi", name: { de: "Karachi", en: "Karachi", ar: "كراتشي" } },
  lagos: { lat: 6.5244, lon: 3.3792, zone: "Africa/Lagos", name: { de: "Lagos", en: "Lagos", ar: "لاغوس" } },
  newyork: { lat: 40.7128, lon: -74.006, zone: "America/New_York", name: { de: "New York", en: "New York", ar: "نيويورك" } },
};

/** Grobe Zuordnung IANA-Zeitzone → naheliegende Stadt aus der Liste, damit
 *  die Karte nicht immer mit Mekka startet, sondern mit einem plausiblen
 *  Standort für den Besucher — ohne dass eine Position abgefragt wird. */
export const ZONE_HINTS: Array<[RegExp, CityKey]> = [
  [/^Europe\/(Berlin|Vienna|Zurich|Amsterdam|Prague|Warsaw)/, "berlin"],
  [/^Europe\/Istanbul/, "istanbul"],
  [/^Asia\/Amman/, "amman"],
  [/^Africa\/Cairo/, "cairo"],
  [/^Asia\/Karachi/, "karachi"],
  [/^Asia\/Jakarta/, "jakarta"],
  [/^Africa\/Lagos/, "lagos"],
  [/^America\/New_York/, "newyork"],
  [/^Asia\/Riyadh/, "mecca"],
];
