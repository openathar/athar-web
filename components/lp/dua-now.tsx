import { DUAS, type Collection, type Dua } from "~/data/duas";
import type { Locale } from "~/lib/i18n";
import { ShareButton } from "~/components/lp/share-button";

/**
 * "Du'a des Tages" — one sahih/hasan du'a from the hadith collections per
 * day (deterministic by UTC date), quoted word for word (Arabic verbatim
 * from the open hadith-api dataset), with its occasion, meaning and source.
 * Same curated data set as the mobile app (athar-mobile-app/src/data/duas.ts).
 */

const COLLECTION_NAME: Record<Collection, Record<Locale, string>> = {
  bukhari: { en: "Sahih al-Bukhari", de: "Sahih al-Bukhari", ar: "صحيح البخاري" },
  muslim: { en: "Sahih Muslim", de: "Sahih Muslim", ar: "صحيح مسلم" },
  abudawud: { en: "Sunan Abi Dawud", de: "Sunan Abi Dawud", ar: "سنن أبي داود" },
  tirmidhi: { en: "Jami' at-Tirmidhi", de: "Jami' at-Tirmidhi", ar: "جامع الترمذي" },
  ibnmajah: { en: "Sunan Ibn Majah", de: "Sunan Ibn Majah", ar: "سنن ابن ماجه" },
};

const LABEL: Record<Locale, string> = {
  en: "Du'a of the day",
  de: "Du'a des Tages",
  ar: "دعاء اليوم",
};

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const num = (n: string, l: Locale) => (l === "ar" ? n.replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]) : n);

const KEYS = Object.keys(DUAS);

export function DuaNow({ locale }: { locale: Locale }) {
  const day = Math.floor(Date.now() / 86_400_000);
  const dua: Dua = DUAS[KEYS[day % KEYS.length]];
  const meaning = locale === "ar" ? null : dua.meaning[locale as "en" | "de"];
  const occasion = dua.occasion[locale];
  const source = `${COLLECTION_NAME[dua.collection][locale]} ${num(dua.number, locale)}${
    dua.grade && !["bukhari", "muslim"].includes(dua.collection) ? ` · ${dua.grade}` : ""
  }`;

  return (
    <figure className="lp-dua">
      <p className="lp-dua-label mono">{LABEL[locale]}</p>
      <figcaption className="lp-dua-occ">{occasion}</figcaption>
      <blockquote>
        <p className="quran lp-dua-ar" lang="ar" dir="rtl">
          {dua.arabic}
        </p>
        {meaning ? <p className="lp-dua-tr">{meaning}</p> : null}
      </blockquote>
      <p className="lp-dua-src mono">{source}</p>
      <p className="lp-dua-share">
        <ShareButton
          text={`${dua.arabic}\n${meaning ?? ""}\n— ${source}`}
          url="https://openathar.org"
          label={{ en: "Share", de: "Teilen", ar: "مشاركة" }[locale]}
        />
      </p>
    </figure>
  );
}
