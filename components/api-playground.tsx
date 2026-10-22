"use client";

import { useMemo, useState } from "react";
import { API_BASE_URL } from "~/lib/api-config";
import { endpoints } from "~/lib/api-reference";

type Tab = "prayer-times" | "prayer-times-range" | "prayer-times-next" | "methods" | "qibla" | "hijri";

const byId = (id: string) => endpoints.find((e) => e.id === id)!;
/** Aus der Spec statt einer zweiten, handgepflegten Liste. */
const METHODS = byId("prayer-times").params.find((p) => p.name === "method")!.values!;
const LOCALES = byId("hijri").params.find((p) => p.name === "locale")!.values!;

function addDays(iso: string, n: number) {
  const d = new Date(`${iso || todayIso()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Live "try it" widget for the calculation endpoints — real requests
 * against the production API, run from the visitor's own browser (see
 * CorsConfig in api-service for the allowed origins).
 */
export function ApiPlayground() {
  const [tab, setTab] = useState<Tab>("prayer-times");
  const [lat, setLat] = useState("52.52");
  const [lon, setLon] = useState("13.405");
  const [date, setDate] = useState(todayIso());
  const [method, setMethod] = useState("MWL");
  const [utcOffset, setUtcOffset] = useState("0");
  const [hijriDate, setHijriDate] = useState("");
  const [locale, setLocale] = useState("en");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: number; ms: number; body: string } | null>(null);

  const { path, query } = useMemo((): { path: string; query: Record<string, string> } => {
    if (tab === "prayer-times") {
      return {
        path: "/v1/prayer-times",
        query: { lat, lon, date, method, utcOffset },
      };
    }
    if (tab === "prayer-times-range") {
      return { path: "/v1/prayer-times/range", query: { lat, lon, from: date, to: addDays(date, 6), method, utcOffset } };
    }
    if (tab === "prayer-times-next") {
      return { path: "/v1/prayer-times/next", query: { lat, lon, method, utcOffset } };
    }
    if (tab === "methods") {
      return { path: "/v1/methods", query: {} };
    }
    if (tab === "qibla") {
      return { path: "/v1/qibla", query: { lat, lon } };
    }
    return {
      path: "/v1/hijri",
      query: hijriDate ? { date: hijriDate, locale } : { locale },
    };
  }, [tab, lat, lon, date, method, utcOffset, hijriDate, locale]);

  const qs = new URLSearchParams(query).toString();
  const url = `${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`;
  const curl = `curl "${url}"${apiKey ? ` -H "X-API-Key: ${apiKey}"` : ""}`;

  async function run() {
    setLoading(true);
    setResult(null);
    const start = performance.now();
    try {
      const res = await fetch(url, {
        headers: apiKey ? { "X-API-Key": apiKey } : {},
      });
      const ms = Math.round(performance.now() - start);
      const text = await res.text();
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // not JSON, show raw text
      }
      setResult({ status: res.status, ms, body });
    } catch {
      setResult({ status: 0, ms: Math.round(performance.now() - start), body: "Network error — is the API reachable?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-rule bg-surface" dir="ltr" lang="en">
      <div className="flex flex-wrap gap-1 border-b border-rule p-2">
        {(
          [
            ["prayer-times", byId("prayer-times").title],
            ["prayer-times-range", "Date range (7 days)"],
            ["prayer-times-next", byId("prayer-times-next").title],
            ["methods", byId("methods").title],
            ["qibla", byId("qibla").title],
            ["hijri", byId("hijri").title],
          ] as [Tab, string][]
        ).map(([id, title]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setResult(null);
            }}
            className={`mono rounded-full px-3 py-1 text-xs uppercase tracking-wider transition ${
              tab === id ? "bg-accent text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-2">
        <div className="space-y-3">
          {tab !== "hijri" && tab !== "methods" && (
            <>
              <Field label="lat">
                <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none" />
              </Field>
              <Field label="lon">
                <input value={lon} onChange={(e) => setLon(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none" />
              </Field>
            </>
          )}
          {(tab === "prayer-times" || tab === "prayer-times-range") && (
            <>
              <Field label={tab === "prayer-times-range" ? "from (7 days)" : "date"}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none" />
              </Field>
              <Field label="method">
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none">
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="utcOffset">
                <input value={utcOffset} onChange={(e) => setUtcOffset(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none" />
              </Field>
            </>
          )}
          {tab === "prayer-times-next" && (
            <>
              <Field label="method">
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none">
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="utcOffset">
                <input value={utcOffset} onChange={(e) => setUtcOffset(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none" />
              </Field>
            </>
          )}
          {tab === "hijri" && (
            <>
              <Field label="date">
                <input
                  type="date"
                  value={hijriDate}
                  onChange={(e) => setHijriDate(e.target.value)}
                  className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none"
                  placeholder={todayIso()}
                />
              </Field>
              <Field label="locale">
                <select value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none">
                  {LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}
          <Field label="API key (optional)">
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="ath_… (leave empty to test anonymously)"
              className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none"
            />
          </Field>

          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="mono mt-2 w-full rounded border border-accent bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/20 disabled:opacity-50"
          >
            {loading ? "Running…" : "Run request"}
          </button>

          <pre className="mono overflow-x-auto whitespace-pre-wrap break-all rounded bg-paper p-3 text-[11px] text-muted">
            {curl}
          </pre>
        </div>

        <div>
          <p className="mono mb-2 text-xs uppercase tracking-wider text-muted">Response</p>
          <div className="min-h-[220px] rounded border border-rule bg-paper p-3">
            {result ? (
              <>
                <p className={`mono mb-2 text-xs ${result.status >= 200 && result.status < 300 ? "text-accent" : "text-gold"}`}>
                  {result.status || "ERR"} · {result.ms}ms
                </p>
                <pre className="mono overflow-x-auto whitespace-pre-wrap break-all text-[12px] text-ink">{result.body}</pre>
              </>
            ) : (
              <p className="mono text-xs text-muted">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono mb-1 block text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}
