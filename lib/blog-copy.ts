import type { Locale } from "./i18n";

/** Rahmentexte der Blog-Seiten (handgeschrieben je Sprache). */
export const blogCopy: Record<Locale, { title: string; metaDescription: string; intro: string; back: string }> = {
  en: {
    title: "Blog",
    metaDescription: "Short articles about how Athar works: local calculation, the open-source core and the public API.",
    intro: "Short articles about how Athar works and why it is built this way. Only what is in the product today.",
    back: "← All articles",
  },
  de: {
    title: "Blog",
    metaDescription: "Kurze Artikel darüber, wie Athar funktioniert: lokale Berechnung, der Open-Source-Kern und die öffentliche API.",
    intro: "Kurze Artikel darüber, wie Athar funktioniert und warum es so gebaut ist. Nur was heute im Produkt steckt.",
    back: "← Alle Artikel",
  },
  ar: {
    title: "المدوّنة",
    metaDescription: "مقالات قصيرة عن طريقة عمل أثر: الحساب المحلي، والنواة المفتوحة المصدر، والواجهة البرمجية العامة.",
    intro: "مقالات قصيرة عن طريقة عمل أثر ولماذا بُني بهذا الشكل. فقط ما هو موجود في المنتج اليوم.",
    back: "→ كل المقالات",
  },
};

const dateLocale: Record<Locale, string> = { en: "en-GB", de: "de-DE", ar: "ar" };

/** Datum fest in UTC formatieren, damit Server und Browser dasselbe anzeigen. */
export function formatBlogDate(iso: string, l: Locale): string {
  return new Intl.DateTimeFormat(dateLocale[l], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
