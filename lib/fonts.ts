import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Amiri_Quran,
} from "next/font/google";

/**
 * Drei Stimmen, bewusst getrennt:
 *   Offenbartes  — Quran-Text
 *   Menschliches — Überschriften, Prosa
 *   Maschinelles — Berechnung, Daten, Meta
 *
 * Arabisch bekommt ein eigenes Schrift-System, weil eine einzige Schrift die
 * drei Rollen nicht gleich gut trägt: Quran-Text braucht vollvokalisierte
 * Naskh, Überschriften profitieren von geometrischer Kufi, Fließtext von
 * einer modernen Sans.
 */

/**
 * Plus Jakarta Sans traegt Fliesstext UND Ueberschriften.
 *
 * Frueher lief fuer Ueberschriften zusaetzlich Newsreader (Serif) — auf
 * Wunsch entfernt: eine Familie fuer alles Lateinische wirkt ruhiger und
 * spart einen Font-Download. Die Hierarchie entsteht jetzt ueber Gewicht und
 * Laufweite statt ueber den Schriftwechsel.
 *
 * Ohne `weight` laedt next/font die variable Datei (200–800) — ein File pro
 * Stil statt je eines pro Schnitt. Italic wird gebraucht, weil einige
 * Gold-Labels `display italic` setzen; ohne echte Kursive wuerde der Browser
 * die Aufrechte nur schraeg stellen.
 */
export const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

export const code = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});

/** Eigens für Quran-Satz entworfen — trägt die Diakritika sauber. */
export const quran = Amiri_Quran({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-quran-face",
  display: "swap",
});
