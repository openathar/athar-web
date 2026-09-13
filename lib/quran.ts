import type { Locale } from "./i18n";

/**
 * Verse aus der Quran.com-API (Quran.Foundation). Der arabische Text ist die
 * Uthmani-Fassung, die Übersetzungen sind etablierte, zitierfähige Werke:
 *
 *   de → Bubenheim & Elyas (herausgegeben vom König-Fahd-Komplex)
 *   en → The Clear Quran (Mustafa Khattab)
 *   ar → keine Übersetzung nötig; stattdessen at-Tafsīr al-Muyassar
 *        (ebenfalls König-Fahd-Komplex), bewusst kurz gehalten
 *
 * Es wird nichts generiert oder umformuliert. Was hier steht, steht so auch
 * in der Quelle — Abweichungen wären bei Offenbarungstext inakzeptabel.
 */

const TRANSLATION_ID: Record<Locale, number> = {
  de: 27, // Frank Bubenheim and Nadeem Elyas
  en: 131, // Dr. Mustafa Khattab, The Clear Quran
  ar: 27, // ungenutzt — Arabisch zeigt den Tafsir statt einer Übersetzung
};

/** at-Tafsīr al-Muyassar */
const TAFSIR_ID = 16;

export type VerseText = {
  key: string;
  arabic: string;
  /** Übersetzung (de/en) bzw. Tafsir-Auszug (ar) */
  rendered: string;
  /** Wer die Übersetzung/den Tafsir verantwortet */
  attribution: string;
  sourceUrl: string;
  /** false = Netz nicht erreichbar, Rückfalltext aus dem Repo */
  live: boolean;
};

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "").trim();

export async function getVerse(
  verseKey: string,
  locale: Locale,
  fallback: { arabic: string; rendered: string },
): Promise<VerseText> {
  const sourceUrl = `https://quran.com/${verseKey.replace(":", "/")}`;

  try {
    if (locale === "ar") {
      const [verseRes, tafsirRes] = await Promise.all([
        fetch(
          `https://api.quran.com/api/v4/verses/by_key/${verseKey}?fields=text_uthmani`,
          { next: { revalidate: 86400 } },
        ),
        fetch(`https://api.quran.com/api/v4/tafsirs/${TAFSIR_ID}/by_ayah/${verseKey}`, {
          next: { revalidate: 86400 },
        }),
      ]);
      if (!verseRes.ok || !tafsirRes.ok) throw new Error("quran.com unavailable");
      const verse = await verseRes.json();
      const tafsir = await tafsirRes.json();
      return {
        key: verseKey,
        arabic: verse.verse.text_uthmani,
        rendered: stripHtml(tafsir.tafsir?.text ?? ""),
        attribution: "التفسير الميسر · مجمع الملك فهد",
        sourceUrl,
        live: true,
      };
    }

    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${verseKey}?fields=text_uthmani&translations=${TRANSLATION_ID[locale]}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) throw new Error("quran.com unavailable");
    const json = await res.json();
    const translation = json.verse?.translations?.[0];
    return {
      key: verseKey,
      arabic: json.verse.text_uthmani,
      rendered: stripHtml(translation?.text ?? ""),
      attribution:
        locale === "de"
          ? "Übersetzung: Bubenheim & Elyas"
          : "Translation: Mustafa Khattab, The Clear Quran",
      sourceUrl,
      live: true,
    };
  } catch {
    return {
      key: verseKey,
      arabic: fallback.arabic,
      rendered: fallback.rendered,
      attribution:
        locale === "ar"
          ? "التفسير الميسر · مجمع الملك فهد"
          : locale === "de"
            ? "Übersetzung: Bubenheim & Elyas"
            : "Translation: Mustafa Khattab, The Clear Quran",
      sourceUrl,
      live: false,
    };
  }
}
