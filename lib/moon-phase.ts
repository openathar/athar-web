/**
 * Mondphase — Näherung über die synodische Periode, vollständig lokal.
 *
 * Genauigkeit: ±0,5 Tage gegenüber exakter Ephemeride. Das reicht für eine
 * Visualisierung, aber NICHT als Grundlage für den tatsächlichen Beginn von
 * Ramadan/Eid — der hängt von der realen Mondsichtung ab, nicht von einer
 * berechneten Nährung (siehe auch die Formulierung im Feiertage-Abschnitt).
 * Diese Funktion behauptet das auch nirgends.
 */

const SYNODIC_MONTH = 29.530588853; // Tage zwischen zwei Neumonden
/** Bekannter Referenz-Neumond: 6. Januar 2000, 18:14 UTC. */
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

export type MoonPhaseKey =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export type MoonPhase = {
  /** Beleuchteter Anteil, 0 (Neumond) bis 1 (Vollmond). */
  illumination: number;
  /** Tage seit dem letzten Neumond, 0 bis ~29.5. */
  ageDays: number;
  /** Phasenwinkel in Grad — bestimmt die Richtung des Terminators im 3D-Modell. */
  phaseAngle: number;
  key: MoonPhaseKey;
};

function phaseKeyFromFraction(f: number): MoonPhaseKey {
  if (f < 0.03 || f > 0.97) return "new";
  if (f < 0.22) return "waxing-crescent";
  if (f < 0.28) return "first-quarter";
  if (f < 0.47) return "waxing-gibbous";
  if (f < 0.53) return "full";
  if (f < 0.72) return "waning-gibbous";
  if (f < 0.78) return "last-quarter";
  return "waning-crescent";
}

export function moonPhaseAt(date: Date): MoonPhase {
  const days = (date.getTime() - KNOWN_NEW_MOON_UTC) / 86_400_000;
  let age = days % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;
  const fraction = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  return {
    illumination,
    ageDays: age,
    phaseAngle: fraction * 360,
    key: phaseKeyFromFraction(fraction),
  };
}
