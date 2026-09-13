"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Läuft vor dem ersten Paint und setzt data-theme — sonst blitzt beim Laden
 * kurz das helle Theme auf, bevor React hydriert.
 */
export const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("athar-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export function ThemeToggle({ labels }: { labels: { light: string; dark: string } }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ?? "light";
    setTheme(current);
    setReady(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("athar-theme", next);
    } catch {}
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? labels.light : labels.dark}
      className="mono text-muted transition hover:text-ink"
      // Vor der Hydration ist das echte Theme unbekannt — Label erst dann zeigen,
      // sonst widerspricht der Server-Text dem tatsächlichen Zustand.
      style={{ visibility: ready ? "visible" : "hidden" }}
    >
      {isDark ? "☾ layl" : "☼ mushaf"}
    </button>
  );
}
