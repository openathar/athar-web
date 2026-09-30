"use client";

import { useState } from "react";
import { API_BASE_URL } from "~/lib/api-config";

type IssuedKey = { apiKey: string; label: string; createdAt: string };
type Usage = { label: string; createdAt: string; requestCount: number };

/** Matches ApiKeyService.MAX_LABEL_LENGTH — the API rejects longer labels with 400. */
const MAX_LABEL = 64;

const NETWORK_ERROR = "Could not reach the API. Check your connection and try again.";

/**
 * The API answers every error as {"error": "..."}; surface that message
 * instead of failing silently. Falls back to the status line when the body
 * is not the expected shape.
 */
async function errorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error) return body.error;
  } catch {
    // not JSON — fall through
  }
  return `Request failed (HTTP ${res.status}).`;
}

/**
 * Self-serve API key issuance + usage lookup, calling api-service directly
 * from the browser. No account, no email — matches the API's own design
 * (see ApiKeyController). English-only like the rest of the reference.
 *
 * Every failure is shown: previously a rate-limited or offline "Generate"
 * click did nothing visible, and any failed usage lookup — a 429 or a 500
 * included — claimed the key was unknown.
 */
export function ApiKeyWidget() {
  const [label, setLabel] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [lookupKey, setLookupKey] = useState("");
  const [checking, setChecking] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);

  async function generate() {
    setIssuing(true);
    setIssued(null);
    setIssueError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label || undefined }),
      });
      if (res.ok) setIssued(await res.json());
      else setIssueError(await errorMessage(res));
    } catch {
      setIssueError(NETWORK_ERROR);
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
      // clipboard API unavailable — the key stays selectable by hand
    }
  }

  async function checkUsage() {
    const key = lookupKey.trim();
    if (!key) return;
    setChecking(true);
    setUsage(null);
    setUsageError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api-keys/${encodeURIComponent(key)}/usage`);
      if (res.ok) setUsage(await res.json());
      else setUsageError(res.status === 404 ? "Unknown API key." : await errorMessage(res));
    } catch {
      setUsageError(NETWORK_ERROR);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2" dir="ltr" lang="en">
      <div className="min-w-0 border border-rule bg-surface p-5">
        <label className="block">
          <span className="mono mb-1 block text-xs text-muted">Label (optional, for your own reference)</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="my-prayer-widget"
            maxLength={MAX_LABEL}
            className="w-full rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={generate}
          disabled={issuing}
          className="mono mt-3 w-full rounded border border-accent bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {issuing ? "Generating…" : "Generate key"}
        </button>

        {issueError && (
          <p role="alert" className="mt-4 text-sm text-gold">
            {issueError}
          </p>
        )}

        {issued && (
          <div className="mt-4 rounded border border-gold/50 bg-paper p-4">
            <p className="mono mb-3 text-xs text-gold">Shown once — store it yourself, Athar cannot show it to you again.</p>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="mono text-xs text-muted">Your API key</dt>
                <dd className="mono flex items-center gap-2 break-all text-ink">
                  {issued.apiKey}
                  <button
                    type="button"
                    onClick={copyKey}
                    className="mono shrink-0 rounded border border-rule px-2 py-0.5 text-xs text-muted transition hover:text-ink"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="mono text-xs text-muted">Label</dt>
                <dd>{issued.label}</dd>
              </div>
              <div>
                <dt className="mono text-xs text-muted">Created</dt>
                <dd className="mono text-xs">{issued.createdAt}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="min-w-0 border border-rule bg-surface p-5">
        <p className="mono mb-3 text-xs uppercase tracking-wider text-muted">Check usage</p>
        <p className="mb-3 text-sm text-muted">Look up the request count for a key you already hold.</p>
        <div className="flex gap-2">
          <input
            value={lookupKey}
            onChange={(e) => setLookupKey(e.target.value)}
            placeholder="ath_…"
            aria-label="API key to look up"
            className="w-full min-w-0 rounded border border-rule bg-paper px-3 py-2 text-sm text-ink transition focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={checkUsage}
            disabled={checking}
            className="mono shrink-0 rounded border border-accent bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/20 disabled:opacity-50"
          >
            {checking ? "Checking…" : "Check"}
          </button>
        </div>

        {usageError && (
          <p role="alert" className="mt-4 text-sm text-muted">
            {usageError}
          </p>
        )}
        {usage && (
          <dl className="mt-4 space-y-2 rounded border border-rule bg-paper p-4 text-sm">
            <div>
              <dt className="mono text-xs text-muted">Label</dt>
              <dd>{usage.label}</dd>
            </div>
            <div>
              <dt className="mono text-xs text-muted">Created</dt>
              <dd className="mono text-xs">{usage.createdAt}</dd>
            </div>
            <div>
              <dt className="mono text-xs text-muted">Total requests</dt>
              <dd className="mono text-lg text-accent">{usage.requestCount}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
