"use client";

import { useState } from "react";
import { codeSample, langLabels, type Endpoint, type Lang } from "~/lib/api-reference";

const LANGS: Lang[] = ["curl", "javascript", "python", "swift", "kotlin"];

/**
 * Copy button that reports success in place, without a toast layer.
 * Falls back silently when the clipboard API is unavailable (insecure
 * origins) — the code stays selectable by hand either way.
 */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard denied — nothing useful to say, the text is selectable.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mono text-[11px] uppercase tracking-wider text-muted transition hover:text-accent"
    >
      {copied ? "copied ✓" : label}
    </button>
  );
}

/**
 * Language-tabbed code block. The snippets are generated from the endpoint
 * spec (see lib/api-reference.ts), so switching tabs can never show a
 * sample that disagrees with the parameter table above it.
 */
export function CodeTabs({ endpoint }: { endpoint: Endpoint }) {
  const [lang, setLang] = useState<Lang>("curl");
  const code = codeSample(endpoint, lang);

  return (
    <div className="border border-rule bg-paper" dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-3 py-2">
        <div role="tablist" aria-label="Code language" className="flex flex-wrap gap-1">
          {LANGS.map((l) => (
            <button
              key={l}
              role="tab"
              type="button"
              aria-selected={l === lang}
              onClick={() => setLang(l)}
              className={`mono rounded-full px-2.5 py-1 text-[11px] transition ${
                l === lang ? "bg-accent/15 text-accent" : "text-muted hover:text-ink"
              }`}
            >
              {langLabels[l]}
            </button>
          ))}
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="mono overflow-x-auto p-4 text-[12.5px] leading-relaxed text-ink">{code}</pre>
    </div>
  );
}
