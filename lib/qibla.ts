/**
 * Qibla-Berechnung.
 *
 * Bewusst lokal und ohne API: Die Richtung folgt aus zwei Koordinatenpaaren,
 * dafür braucht es keinen Server. Das ist zugleich der Vorgriff auf
 * `athan-core-java` — dieselbe Formel wird dort die Referenz sein.
 */

/** Kaaba, Masjid al-Haram. */
export const KAABA = { lat: 21.4224779, lon: 39.8251832 };

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/**
 * Anfangspeilung (Great-Circle) von einem Punkt zur Kaaba, in Grad ab Nord.
 *
 * Wichtig: Es ist die orthodrome Richtung, nicht die Luftlinie auf einer
 * flachen Karte. Auf einer Mercator-Projektion zeigt die korrekte Qibla aus
 * Europa deshalb erstaunlich weit südöstlich — das ist kein Fehler.
 */
export function qiblaBearing(lat: number, lon: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lon - lon);

  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Entfernung zur Kaaba in Kilometern (Haversine). */
export function distanceToKaaba(lat: number, lon: number): number {
  const R = 6371;
  const dφ = toRad(KAABA.lat - lat);
  const dλ = toRad(KAABA.lon - lon);
  const a =
    Math.sin(dφ / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA.lat)) * Math.sin(dλ / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/** Himmelsrichtung als Kürzel, für die Beschriftung neben dem Gradwert. */
export function compassPoint(bearing: number): string {
  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return points[Math.round(bearing / 45) % 8];
}
