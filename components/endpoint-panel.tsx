import type { Endpoint } from "~/lib/api-reference";
import { exampleUrl } from "~/lib/api-reference";
import { CodeTabs, CopyButton } from "~/components/code-tabs";

const AUTH_COPY: Record<Endpoint["auth"], { label: string; tone: string }> = {
  none: { label: "public", tone: "text-muted" },
  optional: { label: "key optional", tone: "text-accent" },
  path: { label: "key in path", tone: "text-gold" },
};

/**
 * One endpoint, rendered from its spec entry: signature, parameters,
 * response shape and runnable samples. Two columns on wide screens so the
 * reference (what exists) and the example (how to call it) sit side by
 * side instead of forcing a scroll between them.
 *
 * `dir="ltr"` auf dem ganzen Panel: der Referenzteil ist bewusst
 * englischsprachig, und englische Prosa rechtsbuendig zu setzen, nur weil
 * die Seite drumherum Arabisch ist, liest sich falsch.
 */
export function EndpointPanel({ endpoint }: { endpoint: Endpoint }) {
  const e = endpoint;
  const auth = AUTH_COPY[e.auth];

  return (
    <article id={e.id} dir="ltr" lang="en" className="api-panel scroll-mt-28">
      {/* ---- Signature ---- */}
      <header className="border-b border-rule px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            dir="ltr"
            className={`mono rounded px-2 py-0.5 text-[11px] font-medium tracking-wider ${
              e.method === "POST" ? "bg-gold/15 text-gold" : "bg-accent/15 text-accent"
            }`}
          >
            {e.method}
          </span>
          <code dir="ltr" className="mono text-sm text-ink">
            {e.path}
          </code>
          <span className={`mono ms-auto text-[10px] uppercase tracking-wider ${auth.tone}`}>{auth.label}</span>
        </div>
        <h3 className="display mt-3 text-xl">{e.title}</h3>
        <p className="mt-2 max-w-prose text-[15px] text-muted">{e.description}</p>
      </header>

      <div className="grid gap-px bg-rule lg:grid-cols-2">
        {/* ---- Parameters ---- */}
        <div className="min-w-0 bg-surface p-5">
          <SectionLabel>Parameters</SectionLabel>
          {e.params.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              None. {e.method === "POST" && "An optional JSON body lets you label the key."}
            </p>
          ) : (
            <ul className="mt-3 space-y-3" dir="ltr">
              {e.params.map((p) => (
                <li key={p.name} className="border-s-2 border-rule ps-3">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <code className="mono text-[13px] text-ink">{p.name}</code>
                    <span className="mono text-[10px] uppercase tracking-wider text-muted/70">{p.type}</span>
                    {p.required ? (
                      <span className="mono text-[10px] uppercase tracking-wider text-gold">required</span>
                    ) : (
                      <span className="mono text-[10px] text-muted/60">default {p.default ?? "—"}</span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.notes}</p>
                  {p.values && (
                    <p className="mono mt-1 text-[11px] leading-relaxed text-muted/70">{p.values.join(" · ")}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {e.body && (
            <>
              <SectionLabel className="mt-6">Request body</SectionLabel>
              <pre dir="ltr" className="mono mt-3 overflow-x-auto border border-rule bg-paper p-3 text-[12px] text-ink">
                {e.body}
              </pre>
            </>
          )}
        </div>

        {/* ---- Response ---- */}
        <div className="min-w-0 bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Response · 200</SectionLabel>
            <CopyButton text={e.response.sample} label="Copy JSON" />
          </div>
          <pre
            dir="ltr"
            className="mono mt-3 max-h-[19rem] overflow-auto border border-rule bg-paper p-3 text-[12px] leading-relaxed text-ink"
          >
            {e.response.sample}
          </pre>
          <dl className="mt-4 space-y-1.5" dir="ltr">
            {e.response.fields.map((f) => (
              <div key={f.name} className="flex flex-wrap gap-x-2 text-[12.5px]">
                <dt className="mono text-ink">{f.name}</dt>
                <dd className="text-muted">
                  <span className="mono text-[10px] uppercase tracking-wider text-muted/60">{f.type}</span> {f.notes}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---- Samples ---- */}
      <div className="border-t border-rule p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionLabel>Example request</SectionLabel>
          <CopyButton text={exampleUrl(e)} label="Copy URL" />
        </div>
        <div className="mt-3">
          <CodeTabs endpoint={e} />
        </div>
      </div>
    </article>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mono text-[10px] uppercase tracking-[0.18em] text-muted/70 ${className}`}>{children}</p>
  );
}
