import { ASMA } from "~/data/asma-ul-husna";
import type { Locale } from "~/lib/i18n";

/**
 * "Name des Tages" — ein Name Allahs pro UTC-Tag (deterministisch),
 * arabisch + Transliteration + Bedeutung. Standard-Inhalt, exakt.
 */

const LABEL: Record<Locale, string> = {
  en: "Name of the day",
  de: "Name des Tages",
  ar: "اسم اليوم",
};

const OF: Record<Locale, string> = {
  en: "of 99",
  de: "von 99",
  ar: "من ٩٩",
};

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function NameOfDay({ locale }: { locale: Locale }) {
  const day = Math.floor(Date.now() / 86_400_000);
  const index = day % ASMA.length;
  const name = ASMA[index];
  const meaning = locale === "ar" ? null : name[locale as "en" | "de"];
  const num = locale === "ar" ? String(index + 1).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]) : String(index + 1);

  return (
    <figure className="lp-name">
        <p className="lp-name-label mono">
          {LABEL[locale]} · {num} {OF[locale]}
        </p>
        <p className="quran lp-name-ar" lang="ar" dir="rtl">
          {name.arabic}
        </p>
        <p className="lp-name-tr">{meaning ? `${name.translit} — ${meaning}` : name.translit}</p>
    </figure>
  );
}
