"use client";

import { useState } from "react";
import { API_BASE_URL } from "~/lib/api-config";
import type { Dict } from "~/lib/dictionaries";

type IssuedKey = { apiKey: string; label: string; createdAt: string };
type Usage = { label: string; createdAt: string; requestCount: number };

/**
 * Self-serve API key issuance + usage lookup, calling api-service directly
 * from the browser. No account, no email — matches the API's own design
 * (see ApiKeyController).
 */
export function ApiKeyWidget({ labels }: { labels: Dict["devs"]["keys"] }) {
  const [label, setLabel] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [copied, setCopied] = useState(false);

  const [lookupKey, setLookupKey] = useState("");
  const [checking, setChecking] = useState(false);
  const [usage, setUsage] = useState<Usage | null | "not-found">(null);

  async function generate() {
    setIssuing(true);
    setIssued(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label || undefined }),
      });
      if (res.ok) {
        setIssued(await res.json());
      }
    } finally {
      setIssuing(false);
    }
  }

  async function copyKey() {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — user can still select the text manually
    }
  }

  async function checkUsage() {
    if (!lookupKey) return;
    setChecking(true);
    setUsage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api-keys/${encodeURIComponent(lookupKey)}/usage`);
      setUsage(res.ok ? await res.json() : "not-found");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2" dir="ltr">
      <div className="border border-rule bg-surface p-5">
        <label className="block">
          <span className="mono mb-1 block text-xs text-muted">{labels.labelFieldLabel}</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={labels.labelPlaceholder}
            className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={generate}
          disabled={issuing}
          className="mono mt-3 w-full rounded border border-accent bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {issuing ? labels.generating : labels.generate}
        </button>

        {issued && (
          <div className="mt-4 rounded border border-gold/50 bg-paper p-4">
            <p className="mono mb-3 text-xs text-gold">{labels.warning}</p>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="mono text-xs text-muted">{labels.yourKey}</dt>
                <dd className="mono flex items-center gap-2 break-all text-ink">
                  {issued.apiKey}
                  <button
                    type="button"
                    onClick={copyKey}
                    className="mono shrink-0 rounded border border-rule px-2 py-0.5 text-xs text-muted transition hover:text-ink"
                  >
                    {copied ? labels.copied : labels.copy}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="mono text-xs text-muted">{labels.yourLabel}</dt>
                <dd>{issued.label}</dd>
              </div>
              <div>
                <dt className="mono text-xs text-muted">{labels.createdAt}</dt>
                <dd className="mono text-xs">{issued.createdAt}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="border border-rule bg-surface p-5">
        <p className="mono mb-3 text-xs uppercase tracking-wider text-muted">{labels.usageHeading}</p>
        <p className="mb-3 text-sm text-muted">{labels.usageIntro}</p>
        <div className="flex gap-2">
          <input
            value={lookupKey}
            onChange={(e) => setLookupKey(e.target.value)}
            placeholder={labels.usageFieldPlaceholder}
            className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={checkUsage}
            disabled={checking}
            className="mono shrink-0 rounded border border-accent bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/20 disabled:opacity-50"
          >
            {checking ? labels.usageChecking : labels.usageCheck}
          </button>
        </div>

        {usage === "not-found" && <p className="mt-4 text-sm text-muted">{labels.usageNotFound}</p>}
        {usage && usage !== "not-found" && (
          <dl className="mt-4 space-y-2 rounded border border-rule bg-paper p-4 text-sm">
            <div>
              <dt className="mono text-xs text-muted">{labels.yourLabel}</dt>
              <dd>{usage.label}</dd>
            </div>
            <div>
              <dt className="mono text-xs text-muted">{labels.createdAt}</dt>
              <dd className="mono text-xs">{usage.createdAt}</dd>
            </div>
            <div>
              <dt className="mono text-xs text-muted">{labels.usageRequests}</dt>
              <dd className="mono text-lg text-accent">{usage.requestCount}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
