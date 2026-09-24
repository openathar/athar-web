import {
  Newsreader,
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
 * Newsreader als Display-Schrift.
 *
 * Variable Antiqua mit optischer Groessenachse (fuer redaktionelle
 * Ueberschriften entworfen, nicht fuer Fliesstext). Ruhiger und
 * zurueckhaltender als Fraunces, das im Hero zu kraftvoll/dekorativ wirkte —
 * passt besser zum kontemplativen Ton der Seite und laesst dem arabischen
 * Amiri-Satz den Vortritt, statt mit ihm zu konkurrieren.
 */
export const serif = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/** Etwas mehr Eigenart als Inter, ohne unruhig zu werden. */
export const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
