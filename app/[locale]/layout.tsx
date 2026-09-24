import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { serif, sans, code, quran } from "~/lib/fonts";
import { arabicDisplay, arabicSans } from "~/lib/fonts-ar";
import { themeScript } from "~/components/theme";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const t = dictionaries[locale as Locale];
  return {
    title: t.meta.title,
    description: t.meta.description,
    metadataBase: new URL("https://openathar.org"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `https://openathar.org/${locale}`,
      siteName: "Athar",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;

  // Arabische Schriften (Amiri, IBM Plex Sans Arabic) werden nur von der
  // arabischen Locale gebraucht — sie nur dort laden, statt ~380 KB Fonts
  // an EN/DE-Besucher auszuliefern. Die Quran-Schrift (Amiri Quran) bleibt
  // überall, weil Verse in allen Sprachen als arabischer Text stehen.
  const arFonts = l === "ar" ? ` ${arabicDisplay.variable} ${arabicSans.variable}` : "";

  return (
    <html
      lang={l}
      dir={isRtl(l) ? "rtl" : "ltr"}
      className={`${serif.variable} ${sans.variable} ${code.variable} ${quran.variable}${arFonts}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
