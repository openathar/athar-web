import { notFound } from "next/navigation";
import Link from "next/link";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { getPrayerTimes } from "~/lib/prayer-times";
import { PrayerCard } from "~/components/prayer-card";
import { QiblaTool } from "~/components/qibla-tool";
import { CalendarTool } from "~/components/calendar-tool";
import { MoonSection } from "~/components/moon-section";
import { Mark } from "~/components/mark";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const t = dictionaries[l];
  const rtl = isRtl(l);
  const prayer = await getPrayerTimes(l);

  return (
    <div className="mx-auto max-w-[72rem] px-6 sm:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-rule py-6">
        <Link href={`/${l}`} className="flex items-center gap-3">
          <Mark size={30} className="text-accent" />
          <span className="display text-xl">Athar</span>
          <span className="quran text-xl text-muted">أثر</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {locales.map((c) => (
            <Link
              key={c}
              href={`/${c}/tools`}
              lang={c}
              className={
                c === l
                  ? "text-ink underline underline-offset-4"
                  : "text-muted transition hover:text-ink"
              }
            >
              {c === "de" ? "Deutsch" : c === "ar" ? "العربية" : "English"}
            </Link>
          ))}
        </nav>
      </header>

      <main className="py-16">
        <h1 className="display text-[clamp(40px,6vw,64px)] font-light">
          {t.tools.heading}
        </h1>
        <p className="mt-4 max-w-prose text-muted">{t.tools.intro}</p>

        <section className="mt-14">
          <h2 className="mono mb-6 text-sm tracking-widest text-muted uppercase">
            {t.tools.prayerHeading}
          </h2>
          <PrayerCard initial={prayer} labels={t.compute} locale={l} />
        </section>

        <section className="mt-14">
          <h2 className="display mb-2 text-2xl">{t.tools.qibla.heading}</h2>
          <p className="mb-6 max-w-prose text-muted">{t.tools.qibla.intro}</p>
          <QiblaTool locale={l} labels={t.tools.qibla} />
        </section>

        <section className="mt-14">
          <h2 className="display mb-2 text-2xl">{t.tools.calendar.heading}</h2>
          <p className="mb-6 max-w-prose text-muted">{t.tools.calendar.intro}</p>
          <CalendarTool locale={l} labels={t.tools.calendar} />
        </section>

        <section className="mt-14">
          <h2 className="display mb-2 text-2xl">{t.tools.moon.heading}</h2>
          <p className="mb-6 max-w-prose text-muted">{t.tools.moon.intro}</p>
          <MoonSection locale={l} labels={t.tools.moon} />
        </section>
      </main>
    </div>
  );
}
