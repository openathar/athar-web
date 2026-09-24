import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

/**
 * Arabische Schriften nur für die arabische Locale.
 *
 * Bewusst in einer eigenen Datei, getrennt von `fonts.ts`: next/font
 * generiert Preload-Links für alle Fonts, die ein Layout importiert — würden
 * Amiri und IBM Plex Sans Arabic im gemeinsamen Modul stehen, lüden EN/DE
 * ~380 KB ungenutzte Fonts. Nur das AR-Layout bindet dieses Modul ein.
 */

/**
 * Amiri fuer arabische Ueberschriften.
 *
 * Bewusst keine geometrische Kufi (Reem Kufi o.ae.): Die Texte sind
 * vollvokalisiert, und Kufi-Schnitte setzen Tashkil eng und unsauber.
 * Amiri ist ein Naskh mit ausgearbeiteter Vokalisierung — die Zeichen sitzen
 * dort, wo sie hingehoeren.
 */
export const arabicDisplay = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  display: "swap",
  // Kein Preload: nur die arabische Locale braucht diese Schrift. Ohne
  // Preload lädt der Browser sie erst, wenn arabischer Text sie anfordert —
  // EN/DE laden sie nie herunter.
  preload: false,
});

/** Moderne Sans für arabischen Fließtext, passend zum Inter-Satz. */
export const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "600"],
  variable: "--font-arabic-sans",
  display: "swap",
  preload: false,
});