import {
  Spectral,
  Inter,
  JetBrains_Mono,
  Amiri_Quran,
  Reem_Kufi,
  IBM_Plex_Sans_Arabic,
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

export const serif = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin"],
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

/** Geometrische Kufi — nimmt die Khatam-Geometrie der Seite auf. */
export const arabicDisplay = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic-display",
  display: "swap",
});

/** Moderne Sans für arabischen Fließtext, passend zum Inter-Satz. */
export const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "600"],
  variable: "--font-arabic-sans",
  display: "swap",
});
