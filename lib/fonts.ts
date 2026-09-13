import { Spectral, Inter, Amiri, JetBrains_Mono } from "next/font/google";

/**
 * Drei Stimmen, bewusst getrennt gehalten:
 *   Amiri     — Offenbartes (Quran, arabischer Text)
 *   Spectral  — Menschliches (Überschriften, Prosa)
 *   JetBrains — Maschinelles (Berechnung, Daten, Meta)
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

export const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const code = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});
