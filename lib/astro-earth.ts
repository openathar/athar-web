/**
 * Tag/Nacht-Grenze auf der Erde — berechnet, nicht gemalt.
 *
 * Der Subsonnenpunkt (genau dort steht die Sonne senkrecht) folgt aus
 * Deklination und Stundenwinkel der Sonne. Mit bekannten Naehrungsformeln
 * fuer die Position der Sonne in der Ekliptik (nach NOAA-Astronomie),
 * Genauigkeit ca. ±0.5 Grad — fuer eine Visualisierung mehr als ausreichend.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/** Tage seit J2000.0 (1. Januar 2000, 12:00 UTC). */
function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Sonnendeklination in Grad (positiv: Sommer auf der Nordhalbkugel). */
export function solarDeclination(date: Date): number {
  const jd = julianDay(date);
  const n = jd - 2451545.0; // Tage seit J2000.0
  // Mittlere Anomalie und Bahnlaenge der Erde
  const M = (357.5291 + 0.98560028 * n) * DEG;
  const L = (280.4665 + 0.98564736 * n) * DEG; // mittlere Laenge
  const lambda = L + (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * DEG;
  const epsilon = 23.4391 * DEG; // Schiefe der Ekliptik
  return Math.asin(Math.sin(epsilon) * Math.sin(lambda)) * RAD;
}

/**
 * Stundenwinkel der Sonne fuer einen Punkt auf der Erde.
 * Rueckgabe in Grad: 0 = Sonne im Meridian (Mittag), ±180 = Mitternacht.
 */
export function solarHourAngle(date: Date, lonDeg: number): number {
  const utcH = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  // Einfache Naehrung: 15 Grad pro Stunde seit Greenwich-Transit
  return ((utcH - 12) * 15 + lonDeg) * DEG;
}

/**
 * Gibt zurueck, ob ein Punkt (lat, lon) zur gegebenen Zeit in der Tagesseite
 * der Erde liegt. 1 = voller Tag, 0 = Mitternacht, dazwischen: Daemmerung.
 */
export function sunElevationFactor(latDeg: number, lonDeg: number, date: Date): number {
  const dec = solarDeclination(date) * DEG;
  const ha = solarHourAngle(date, lonDeg);
  const lat = latDeg * DEG;
  // Hoehe der Sonne ueber dem Horizont an diesem Punkt
  const sinH =
    Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(ha);
  return Math.asin(Math.max(-1, Math.min(1, sinH))); // Bogenmass
}

/** 0–1, weich verlaufend ueber die Daemmerungszone. */
export function daylightFactor(latDeg: number, lonDeg: number, date: Date): number {
  const h = sunElevationFactor(latDeg, lonDeg, date);
  // Weiche Kante ueber etwa 6 Grad Hoehenwinkel (Zivildaemmerung)
  const edge = 6 * DEG;
  return Math.max(0, Math.min(1, (h + edge) / (2 * edge)));
}

/** Richtung der Lichtquelle im 3D-Raum (x=Richtung zur Sonne). */
export function sunlightDirection(date: Date): [number, number, number] {
  const dec = solarDeclination(date) * DEG;
  const utcH = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  // Längengrad, an dem gerade Mittag ist (Sonne im Meridian)
  const noonLon = -((utcH - 12) * 15);
  const lat = solarDeclination(date);
  return [
    Math.cos(lat * DEG) * Math.cos(noonLon * DEG),
    Math.sin(lat * DEG),
    Math.cos(lat * DEG) * Math.sin(noonLon * DEG),
  ];
}
