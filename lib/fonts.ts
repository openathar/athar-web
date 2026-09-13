import { Cormorant_Garamond, Inter, Amiri } from "next/font/google";

/** Display-Serif (lateinisch) — ruhig-editorial, hoher Strichkontrast. */
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

/** Fließtext (lateinisch). */
export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Arabisch: Amiri (Naskh). Echte Schrift statt gezeichneter/generierter
 * Buchstabenformen — Shaping und Ligaturen bleiben korrekt.
 */
export const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});
