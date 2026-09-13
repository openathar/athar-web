"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

/** Farbpalette für Canvas-Zeichnungen — die CSS-Variablen decken nur die
 *  Grundfarben ab, Verläufe brauchen hellere/dunklere Stufen. */
export const palette: Record<
  Theme,
  { gold: string; goldLight: string; goldDark: string; green: string; greenGlow: string; goldGlow: string; ink: string; muted: string }
> = {
  dark: {
    gold: "#d4a95f",
    goldLight: "#f6e7b8",
    goldDark: "#8a6f3b",
    green: "#4aa583",
    greenGlow: "rgba(74, 165, 131, 0.45)",
    goldGlow: "rgba(212, 169, 95, 0.5)",
    ink: "#e9e3d4",
    muted: "#939bab",
  },
  light: {
    gold: "#9a6f1f",
    goldLight: "#b98a2e",
    goldDark: "#6d4e12",
    green: "#0d7a55",
    greenGlow: "rgba(13, 122, 85, 0.4)",
    goldGlow: "rgba(154, 111, 31, 0.45)",
    ink: "#23261f",
    muted: "#5c6156",
  },
};

/** Aktuelles Theme beobachten (data-theme auf <html>), damit Canvas-Zeichnungen
 *  beim Umschalten neu malen können. */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setTheme(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}