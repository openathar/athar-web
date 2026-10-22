import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "~/lib/i18n";
import { dictionaries } from "~/lib/dictionaries";
import { SiteHeader } from "~/components/site-header";
import { ForceDark } from "~/components/force-dark";
import "~/components/lp/lp.css";
import { OliveTree } from "~/components/lp/olive-tree";
import { Mark } from "~/components/mark";
import { ApiPlayground } from "~/components/api-playground";
import { ApiKeyWidget } from "~/components/api-key-widget";
import { ApiDocsNav, type NavGroup } from "~/components/api-docs-nav";
import { EndpointPanel } from "~/components/endpoint-panel";
import { CodeTabs, CopyButton } from "~/components/code-tabs";
import { API_BASE, endpoints, errorCodes, rateLimits, roadmap } from "~/lib/api-reference";

const GITHUB_ORG = "https://github.com/openathar";
const SWAGGER_URL = "https://api.openathar.org/swagger-ui.html";

/*
 * The reference is English-only by decision (see lib/api-reference.ts) —
 * the whole body, not just the parts that happen to be technical. Only the
 * page chrome (header, footer, <title>) follows the visitor's locale; a
 * German intro paragraph above an English parameter table read as a
 * half-finished translation.
 */
const CALC_ENDPOINTS = endpoints.filter((e) => !e.id.startsWith("api-key"));
const KEY_ENDPOINTS = endpoints.filter((e) => e.id.startsWith("api-key"));

const NAV: NavGroup[] = [
  {
    title: "Start",
    items: [
      { id: "overview", label: "Overview" },
      { id: "quickstart", label: "Quickstart" },
      { id: "conventions", label: "Conventions" },
    ],
  },
  {
    title: "Endpoints",
    items: CALC_ENDPOINTS.map((e) => ({ id: e.id, label: e.title, badge: e.method })),
  },
  {
    title: "Keys & limits",
    items: [
      ...KEY_ENDPOINTS.map((e) => ({ id: e.id, label: e.title, badge: e.method })),
      { id: "rate-limits", label: "Rate limits" },
      { id: "keys", label: "Get a key" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "playground", label: "Playground" },
      { id: "errors", label: "Errors" },
      { id: "roadmap", label: "Roadmap" },
      { id: "contribute", label: "Contribute" },
    ],
  },
];

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
    // The main content is identical (English) under every locale, so the
    // three URLs are duplicates to a search engine, not translations.
    // Point them all at one canonical page instead of an hreflang cluster
    // that would claim localized versions which do not exist.
    alternates: { canonical: "/en/developers" },
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

  return (
    <div className="dev-lp">
    <ForceDark />
    <div className="mx-auto max-w-[88rem] px-6 sm:px-10">
      <SiteHeader
        locale={l}
        basePath="/developers"
        languageLabel={t.nav.language}
        themeLabels={t.theme}
        nav={
          <Link href={`/${l}`} className="mono text-muted transition hover:text-ink">
            {t.devs.backHome}
          </Link>
        }
      />

      {/* Everything between header and footer is the English reference —
          left-to-right even inside the Arabic layout. */}
      <div dir="ltr" lang="en">
        {/* ================= Masthead ================= */}
        <div className="api-masthead relative border-b border-rule py-14 sm:py-20">
          <OliveTree className="dev-tree" />
          <div className="max-w-3xl">
            <p className="mono mb-5 text-[11px] uppercase tracking-[0.22em] text-accent">Developer API · v1</p>
            <h1 className="display text-[clamp(34px,6.5vw,68px)] font-light leading-[1.05]">
              Build on the same
              <br />
              <span className="text-gold">sky we do.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Prayer times, Qibla and the Hijri calendar over plain HTTP — the identical calculation core that runs
              inside the Athar apps. No account, no key required to start, no tracking, no cost. Free as in Sadaqah
              Jariyah, not as in trial.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="api-chip">
                <span className="api-pulse" aria-hidden />
                <code className="mono text-[12.5px] text-ink">{API_BASE}</code>
                <CopyButton text={API_BASE} />
              </span>
              <a href="#quickstart" className="mono border-b border-accent pb-0.5 text-[12.5px] text-accent transition hover:opacity-80">
                Quickstart →
              </a>
              <a href="#playground" className="mono border-b border-rule pb-0.5 text-[12.5px] text-muted transition hover:text-ink">
                Try it live →
              </a>
            </div>

            <dl className="mono mt-10 grid grid-cols-2 gap-x-8 gap-y-4 text-[12px] sm:grid-cols-4">
              <Stat k="endpoints" v={String(endpoints.length)} />
              <Stat k="auth" v="optional" />
              <Stat k="rate limit" v="60–600 / min" />
              <Stat k="licence" v="open source" />
            </dl>
          </div>
        </div>

        {/* ================= Docs body ================= */}
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-8 py-12">
              <ApiDocsNav groups={NAV} />
            </div>
          </aside>

          {/* Below lg the rail is hidden — without a stand-in a phone would
              have no table of contents at all. As <details> it needs no
              JavaScript. */}
          <details className="group mt-8 border border-rule bg-surface lg:hidden">
            <summary className="mono flex cursor-pointer items-center justify-between px-4 py-3 text-[12px] uppercase tracking-wider text-muted marker:content-['']">
              On this page
              <span aria-hidden className="transition group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-rule px-4 py-4">
              {NAV.map((group) => (
                <div key={group.title} className="mb-4 last:mb-0">
                  <p className="mono mb-2 text-[10px] uppercase tracking-[0.18em] text-muted/70">{group.title}</p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="flex items-center gap-2 text-sm text-muted transition hover:text-accent">
                          {item.label}
                          {item.badge && (
                            <span className="mono ms-auto text-[10px] uppercase tracking-wider text-muted/60">{item.badge}</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>

          <main id="main" className="min-w-0 py-12 lg:py-16">
            {/* ---------- Overview ---------- */}
            <Section id="overview" index="01" title="Overview">
              <p className="max-w-prose text-muted">
                One free REST API for prayer times, Qibla bearing and Hijri calendar conversion — the same calculation
                core that powers this site and the mobile app. No account, no email, no tracking. Every endpoint below
                can be tried right on this page.
              </p>
              <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-3">
                <Tile
                  title="One core, everywhere"
                  body="Server and clients share athan-core. A time computed here and a time computed offline on a phone are the same time — never a second implementation that quietly drifts."
                />
                <Tile
                  title="Nothing to sign"
                  body="Every calculation endpoint answers anonymously. A key only raises your ceiling; it identifies no person, because no account exists to identify."
                />
                <Tile
                  title="Readable, not clever"
                  body="Plain JSON, wall-clock strings, no envelopes or cursors. If you can read a URL you can read this API."
                />
              </div>
            </Section>

            {/* ---------- Quickstart ---------- */}
            <Section id="quickstart" index="02" title="Quickstart">
              <p className="max-w-prose text-muted">
                Every calculation endpoint is a plain GET request. No auth header required — an optional API key only
                raises your rate limit.
              </p>
              <div className="mt-6">
                <CodeTabs endpoint={CALC_ENDPOINTS[0]} />
              </div>
              <p className="mt-4 text-sm text-muted">
                That is the whole onboarding. No key, no header, no handshake — paste the URL in a browser and you have
                your first response.
              </p>
            </Section>

            {/* ---------- Conventions ---------- */}
            <Section id="conventions" index="03" title="Conventions">
              <p className="max-w-prose text-muted">
                Rules that hold for every endpoint, so they are not repeated in each one below.
              </p>
              <dl className="mt-6 divide-y divide-rule border-y border-rule">
                <Row k="Base URL" v={`${API_BASE} — all paths are prefixed with /v1.`} />
                <Row k="Format" v="JSON only, UTF-8. No XML, no envelope — the resource is the response body." />
                <Row k="Dates" v="ISO 8601 (YYYY-MM-DD) in, ISO 8601 out. Timestamps are UTC with a trailing Z." />
                <Row k="Times" v="Local wall-clock HH:mm strings, already shifted by the utcOffset you pass. No timezone database needed client-side." />
                <Row k="Missing values" v="A time that does not exist — sunrise during polar day, Isha without a night — is null. Never a placeholder like 00:00." />
                <Row k="Coordinates" v="Decimal degrees, never degrees/minutes/seconds. Latitude −90…90, longitude −180…180." />
                <Row k="Auth" v="Optional. Send X-API-Key to lift the rate limit; omit it and the endpoint still answers." />
                <Row k="Caching" v="Calculation results are deterministic and sent with Cache-Control: public, max-age=31536000, immutable — cache them forever. The one exception: /v1/hijri without a date means “today” and is cached for five minutes." />
                <Row k="CORS" v="Browser calls are allowed from openathar.org and, for local development, http://localhost:3000; any other origin gets 403. Call the API from your server, a mobile app or a script — CORS does not apply there — or proxy it through your own backend." />
                <Row k="Errors" v={'Always the same shape: {"error": "…"} — see Errors below.'} />
                <Row k="Versioning" v="The path carries the major version. Breaking changes land on /v2, never silently on /v1." />
              </dl>
            </Section>

            {/* ---------- Endpoints ---------- */}
            <Section id="endpoints" index="04" title="Calculation endpoints">
              <p className="max-w-prose text-muted">
                Six read-only endpoints. All are deterministic — the same input always produces the same output — except /v1/prayer-times/next without an at parameter, which answers for the current moment and is therefore never cached.
              </p>
              <div className="mt-8 space-y-12">
                {CALC_ENDPOINTS.map((e) => (
                  <EndpointPanel key={e.id} endpoint={e} />
                ))}
              </div>
            </Section>

            {/* ---------- Key endpoints ---------- */}
            <Section id="key-endpoints" index="05" title="API key endpoints">
              <p className="max-w-prose text-muted">
                Keys are issued on demand. They raise your rate limit and nothing else — no plan, no quota to buy, no
                identity attached.
              </p>
              <div className="mt-8 space-y-12">
                {KEY_ENDPOINTS.map((e) => (
                  <EndpointPanel key={e.id} endpoint={e} />
                ))}
              </div>
            </Section>

            {/* ---------- Rate limits ---------- */}
            <Section id="rate-limits" index="06" title="Rate limits">
              <p className="max-w-prose text-muted">
                A fixed one-minute window, counted per client IP — or per API key when you send one.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {rateLimits.map((r) => (
                  <div
                    key={r.tier}
                    className={`border p-5 ${r.tone === "gold" ? "border-gold/50 bg-gold/[0.04]" : "border-rule bg-surface"}`}
                  >
                    <p className={`mono text-[11px] uppercase tracking-wider ${r.tone === "gold" ? "text-gold" : "text-muted"}`}>
                      {r.tier}
                    </p>
                    <p className="display mt-2 text-2xl text-ink">{r.limit}</p>
                    <p className="mt-1 text-sm text-muted">counted {r.key}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Exceeding the window returns <code className="mono text-ink">429</code> with a{" "}
                <code className="mono text-ink">Retry-After</code> header in seconds. The limiter fails open: if its store
                is unreachable your request is served rather than rejected. Responses served from a browser or CDN cache
                never reach the API, so they count neither against the limit nor towards a key&apos;s usage — caching is
                the cheapest way to stay under the ceiling.
              </p>
            </Section>

            {/* ---------- Get a key ---------- */}
            <Section id="keys" index="07" title="Get a free API key">
              <p className="max-w-prose text-muted">
                Instant, no email, no account. A key raises your rate limit from 60 to 600 requests per minute — it is
                not an identity system.
              </p>
              <div className="mt-8">
                <ApiKeyWidget />
              </div>
            </Section>

            {/* ---------- Playground ---------- */}
            <Section id="playground" index="08" title="Try it live">
              <p className="max-w-prose text-muted">
                Edit the parameters and run a real request against the live API — right from this page.
              </p>
              <div className="mt-8">
                <ApiPlayground />
              </div>
            </Section>

            {/* ---------- Errors ---------- */}
            <Section id="errors" index="09" title="Errors">
              <p className="max-w-prose text-muted">
                Every error on every endpoint has the same shape: one field with a human-readable message. Nothing to
                special-case per endpoint.
              </p>
              <pre className="mono mt-6 overflow-x-auto border border-rule bg-surface p-4 text-[12.5px] text-ink">
{`{
  "error": "missing required parameter: lat"
}`}
              </pre>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-start text-sm">
                  <thead>
                    <tr className="border-b border-rule text-[11px] uppercase tracking-wider text-muted">
                      <th className="py-2 pe-4 text-start font-normal">Status</th>
                      <th className="py-2 pe-4 text-start font-normal">Meaning</th>
                      <th className="py-2 text-start font-normal">What to do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((e) => (
                      <tr key={e.status} className="border-b border-rule/50 align-top">
                        <td className="mono py-3 pe-4 text-gold">{e.status}</td>
                        <td className="py-3 pe-4 text-ink">{e.meaning}</td>
                        <td className="py-3 text-muted">{e.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted">
                The one exception is a CORS rejection (<code className="mono text-ink">403</code>) for browser calls from
                other origins: it is answered before the API runs, and browsers do not show its body to scripts anyway.
              </p>
            </Section>

            {/* ---------- Roadmap ---------- */}
            <Section id="roadmap" index="10" title="Roadmap">
              <p className="max-w-prose text-muted">
                What the API does not do yet, and in which order that is likely to change. Published openly so you can
                plan around the gaps — or close one yourself with a pull request.
              </p>
              <ul className="mt-8 space-y-px border border-rule bg-rule">
                {roadmap.map((r) => (
                  <li key={r.path} className="bg-surface p-5 transition hover:bg-paper">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="mono rounded bg-rule/60 px-2 py-0.5 text-[10px] tracking-wider text-muted">{r.method}</span>
                      <code className="mono text-[13px] text-ink">{r.path}</code>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="display mt-3 text-lg">{r.title}</p>
                    <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">{r.why}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted">
                Missing something that is not on this list?{" "}
                <a href={`${GITHUB_ORG}/api-service/issues`} className="border-b border-accent pb-0.5 text-accent transition hover:opacity-80">
                  Open an issue
                </a>{" "}
                — the roadmap is shaped by what people actually try to build.
              </p>
            </Section>

            {/* ---------- Contribute ---------- */}
            <Section id="contribute" index="11" title="That's it" last>
              <p className="max-w-prose text-muted">
                Deterministic in, deterministic out. Build whatever you want on top — a widget, a bot, a smart-speaker
                skill. If something&apos;s missing, open an issue.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                <a href={`${GITHUB_ORG}/api-service`} className="mono border-b border-accent pb-1 text-accent transition hover:opacity-80">
                  Source on GitHub →
                </a>
                <a href={SWAGGER_URL} className="mono border-b border-rule pb-1 text-muted transition hover:text-ink">
                  Full OpenAPI reference →
                </a>
                <a href={`${GITHUB_ORG}/athan-core-java`} className="mono border-b border-rule pb-1 text-muted transition hover:text-ink">
                  athan-core →
                </a>
              </div>
            </Section>
          </main>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-rule py-12 text-sm text-muted">
        <span className="flex items-center gap-3">
          <Mark size={18} className="text-accent" />
          {t.footer.madeAs}
        </span>
        <a href={GITHUB_ORG} className="mono transition hover:text-ink">
          {t.footer.source}
        </a>
      </footer>
    </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  id,
  index,
  title,
  children,
  last = false,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${last ? "" : "mb-20 border-b border-rule pb-20"}`}>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="mono text-[11px] tracking-[0.2em] text-muted/50" aria-hidden>
          {index}
        </span>
        <h2 className="display text-[clamp(24px,3vw,32px)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-muted/60">{k}</dt>
      <dd className="mt-1 text-ink">{v}</dd>
    </div>
  );
}

function Tile({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-surface p-5">
      <h3 className="display text-base text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
      <dt className="mono text-[11px] uppercase tracking-wider text-muted/70">{k}</dt>
      <dd className="text-sm leading-relaxed text-muted">{v}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: "next" | "planned" | "exploring" }) {
  const map = {
    next: { label: "next up", cls: "border-accent/50 text-accent" },
    planned: { label: "planned", cls: "border-gold/40 text-gold" },
    exploring: { label: "exploring", cls: "border-rule text-muted" },
  }[status];
  return (
    <span className={`mono ms-auto rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${map.cls}`}>
      {map.label}
    </span>
  );
}
