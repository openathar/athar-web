export const locales = ["de", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Arabisch ist RTL — das bestimmt <html dir> und Layout-Spiegelung. */
export const rtlLocales: Locale[] = ["ar"];
export const isRtl = (l: Locale) => rtlLocales.includes(l);

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  ar: "العربية",
};
