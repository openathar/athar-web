import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { SiteHeader } from "~/components/site-header";
import { Mark } from "~/components/mark";
import { ApiPlayground } from "~/components/api-playground";
import { ApiKeyWidget } from "~/components/api-key-widget";

const GITHUB_ORG = "https://github.com/openathar";
const SWAGGER_URL = "https://api.openathar.org/swagger-ui.html";

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
  const t = dictionaries[locale as Locale].devs.meta;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}/developers`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/developers`])),
    },
  };
}

export default async function Developers({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const t = dictionaries[l];
  const d = t.devs;

  return (
    <div className="mx-auto max-w-[72rem] px-6 sm:px-10">
      <SiteHeader
        locale={l}
        basePath="/developers"
        languageLabel={t.nav.language}
        themeLabels={t.theme}
        nav={
          <Link href={`/${l}`} className="mono text-muted transition hover:text-ink">
            {d.backHome}
          </Link>
        }
      />

      <main id="main" className="py-16">
        {/* ---------- Intro ---------- */}
        <section>
          <Label>{d.eyebrow}</Label>
          <h1 className="display text-[clamp(32px,6vw,64px)] font-light">{d.heading}</h1>
          <p className="mt-6 max-w-prose text-lg text-muted">{d.intro}</p>
        </section>

        {/* ---------- Quickstart ---------- */}
        <section className="mt-16 border-t border-rule pt-16">
          <h2 className="display text-2xl">{d.quickstart.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.quickstart.intro}</p>
          <pre dir="ltr" className="mono mt-6 overflow-x-auto rounded border border-rule bg-surface p-4 text-[13px] leading-relaxed text-ink">
{`curl "https://api.openathar.org/v1/prayer-times?lat=52.52&lon=13.405&date=2026-09-14&method=MWL&utcOffset=2"
curl "https://api.openathar.org/v1/qibla?lat=52.52&lon=13.405"
curl "https://api.openathar.org/v1/hijri?date=2026-09-14&locale=en"`}
          </pre>
        </section>

        {/* ---------- Endpoints ---------- */}
        <section className="mt-16 border-t border-rule pt-16">
          <h2 className="display text-2xl">{d.endpoints.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.endpoints.intro}</p>

          <div className="mt-8 space-y-10">
            <EndpointCard
              method="GET"
              path="/v1/prayer-times"
              title={d.endpoints.prayerTimes.title}
              description={d.endpoints.prayerTimes.description}
              headers={d.endpoints.paramHeaders}
              yes={d.endpoints.yes}
              no={d.endpoints.no}
              params={[
                { name: "lat", required: true, notes: d.endpoints.prayerTimes.params.lat },
                { name: "lon", required: true, notes: d.endpoints.prayerTimes.params.lon },
                { name: "date", required: true, notes: d.endpoints.prayerTimes.params.date },
                { name: "method", required: false, default: "MWL", notes: d.endpoints.prayerTimes.params.method },
                { name: "utcOffset", required: false, default: "0", notes: d.endpoints.prayerTimes.params.utcOffset },
              ]}
            />
            <EndpointCard
              method="GET"
              path="/v1/qibla"
              title={d.endpoints.qibla.title}
              description={d.endpoints.qibla.description}
              headers={d.endpoints.paramHeaders}
              yes={d.endpoints.yes}
              no={d.endpoints.no}
              params={[
                { name: "lat", required: true, notes: d.endpoints.qibla.params.lat },
                { name: "lon", required: true, notes: d.endpoints.qibla.params.lon },
              ]}
            />
            <EndpointCard
              method="GET"
              path="/v1/hijri"
              title={d.endpoints.hijri.title}
              description={d.endpoints.hijri.description}
              headers={d.endpoints.paramHeaders}
              yes={d.endpoints.yes}
              no={d.endpoints.no}
              params={[
                { name: "date", required: false, default: t.dates.today, notes: d.endpoints.hijri.params.date },
                { name: "locale", required: false, default: "en", notes: d.endpoints.hijri.params.locale },
              ]}
            />
          </div>
        </section>

        {/* ---------- Playground ---------- */}
        <section className="mt-16 border-t border-rule pt-16 scroll-mt-24" id="playground">
          <h2 className="display text-2xl">{d.playground.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.playground.intro}</p>
          <div className="mt-8">
            <ApiPlayground labels={d.playground} endpoints={d.endpoints} />
          </div>
        </section>

        {/* ---------- Errors ---------- */}
        <section className="mt-16 border-t border-rule pt-16">
          <h2 className="display text-2xl">{d.errors.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.errors.body}</p>
        </section>

        {/* ---------- Rate limits ---------- */}
        <section className="mt-16 border-t border-rule pt-16">
          <h2 className="display text-2xl">{d.limits.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.limits.body}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border border-rule bg-surface p-4">
              <dt className="mono text-xs text-muted">anonymous</dt>
              <dd className="mt-1 text-ink">{d.limits.anonymous}</dd>
            </div>
            <div className="border border-gold/50 bg-surface p-4">
              <dt className="mono text-xs text-gold">X-API-Key</dt>
              <dd className="mt-1 text-ink">{d.limits.keyed}</dd>
            </div>
          </dl>
        </section>

        {/* ---------- API keys ---------- */}
        <section className="mt-16 border-t border-rule pt-16 scroll-mt-24" id="keys">
          <h2 className="display text-2xl">{d.keys.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.keys.intro}</p>
          <div className="mt-8">
            <ApiKeyWidget labels={d.keys} />
          </div>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="mt-16 border-t border-rule pt-16">
          <h2 className="display text-2xl">{d.cta.heading}</h2>
          <p className="mt-3 max-w-prose text-muted">{d.cta.body}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
            <a href={`${GITHUB_ORG}/api-service`} className="mono border-b border-accent pb-1 text-accent transition hover:opacity-80">
              {d.cta.github} →
            </a>
            <a href={SWAGGER_URL} className="mono border-b border-rule pb-1 text-muted transition hover:text-ink">
              {d.cta.swagger} →
            </a>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 py-12 text-sm text-muted">
        <span className="flex items-center gap-3">
          <Mark size={18} className="text-accent" />
          {t.footer.madeAs}
        </span>
        <a href={GITHUB_ORG} className="mono transition hover:text-ink">
          {t.footer.source}
        </a>
      </footer>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono mb-6 text-muted">
      <span aria-hidden className="me-2 text-rule">
        //
      </span>
      {children}
    </p>
  );
}

function EndpointCard({
  method,
  path,
  title,
  description,
  headers,
  yes,
  no,
  params,
}: {
  method: string;
  path: string;
  title: string;
  description: string;
  headers: { name: string; required: string; default: string; notes: string };
  yes: string;
  no: string;
  params: { name: string; required: boolean; default?: string; notes: string }[];
}) {
  return (
    <div className="border border-rule bg-surface p-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="mono rounded bg-accent/15 px-2 py-0.5 text-xs text-accent" dir="ltr">
          {method}
        </span>
        <code className="mono text-sm text-ink" dir="ltr">
          {path}
        </code>
        <h3 className="display text-lg">{title}</h3>
      </div>
      <p className="mt-3 text-muted">{description}</p>

      <div className="mt-4 overflow-x-auto" dir="ltr">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-rule text-start text-xs text-muted">
              <th className="py-2 pe-4 text-start font-normal">{headers.name}</th>
              <th className="py-2 pe-4 text-start font-normal">{headers.required}</th>
              <th className="py-2 pe-4 text-start font-normal">{headers.default}</th>
              <th className="py-2 text-start font-normal">{headers.notes}</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.name} className="border-b border-rule/50">
                <td className="mono py-2 pe-4 text-ink">{p.name}</td>
                <td className="py-2 pe-4 text-muted">{p.required ? yes : no}</td>
                <td className="mono py-2 pe-4 text-muted">{p.default ?? "—"}</td>
                <td className="py-2 text-muted">{p.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
