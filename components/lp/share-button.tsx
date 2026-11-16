"use client";

import { useState } from "react";

/**
 * Teilen-Knopf: nutzt die native Web-Share-API (navigator.share), sonst
 * Kopieren in die Zwischenablage. Der geteilte Text kommt als Prop.
 */
export function ShareButton({ text, url, label }: { text: string; url: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Athar", text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <button type="button" className="lp-link lp-share" onClick={onShare}>
      {copied ? "✓" : label}
    </button>
  );
}
