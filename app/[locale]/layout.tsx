import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { serif, sans, arabic, code } from "~/lib/fonts";
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

  return (
    <html
      lang={l}
      dir={isRtl(l) ? "rtl" : "ltr"}
      className={`${serif.variable} ${sans.variable} ${arabic.variable} ${code.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
