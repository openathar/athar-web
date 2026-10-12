"use client";

import { useEffect } from "react";

/**
 * Die Startseite lebt von Nachtaufnahmen auf Schwarz und ist deshalb immer
 * dunkel — unabhaengig vom gespeicherten Theme. Gespeichert wird nichts;
 * beim Verlassen der Seite gilt wieder die Wahl des Nutzers (oder das System).
 */
export function ForceDark() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    return () => {
      let theme = "dark";
      try {
        const stored = localStorage.getItem("athar-theme");
        theme =
          stored ||
          (window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark");
      } catch {}
      root.setAttribute("data-theme", theme);
    };
  }, []);
  return null;
}
