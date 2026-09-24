"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EarthMoonSection } from "~/components/earth-moon-section";
import { WorldMap } from "~/components/world-map";
import type { Dict } from "~/lib/dictionaries";
import type { Locale } from "~/lib/i18n";

// MoonView haengt vom Abrufzeitpunkt ab (Mondphase) und nutzt R3F-Canvas —
// beides ist nicht SSR-tauglich, darum client-only wie die 3D-Szene.
const MoonView = dynamic(
  () => import("~/components/moon-view").then((m) => m.MoonView),
  {
    ssr: false,
    loading: () => (
      <div className="border border-rule bg-surface">
        <div className="flex h-[380px] items-center justify-center text-muted sm:h-[460px]">…</div>
      </div>
    ),
  },
);

type Props = {
  locale: Locale;
  cosmos: Dict["cosmos"];
  earth: Dict["earth"];
  map: Dict["map"];
};

/**
 * Eine Beobachtungsstation, drei Fenster: der 3D-Globus mit Mond, der Mond
 * in Grossaufnahme, die flache Weltkarte. Die Gebetszeiten bleiben in
 * Erd- und Karten-Tab; der Mond-Tab zaehlt Phasen statt Gebete.
 */
export function CosmosTabs({ locale, cosmos, earth, map }: Props) {
  const [tab, setTab] = useState<"earth" | "moon" | "map">("earth");

  const tabs = [
    ["earth", cosmos.tabs.earth],
    ["moon", cosmos.tabs.moon],
    ["map", cosmos.tabs.map],
  ] as const;

  return (
    <div>
      <div role="tablist" aria-label={cosmos.label} className="flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`mono rounded-full border px-4 py-1.5 text-xs transition ${
              tab === key
                ? "border-transparent bg-gold text-paper"
                : "border-rule text-muted hover:border-gold hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alle Panels bleiben gemountet und werden nur versteckt — sonst
          erzeugt jeder Tab-Wechsel neue WebGL-Kontexte, und der Browser
          verwirft bei zu vielen alte Kontexte (Canvas bleibt schwarz). */}
      {tabs.map(([key]) => (
        <div key={key} role="tabpanel" hidden={tab !== key} className="mt-6">
          {key === "earth" && <EarthMoonSection locale={locale} labels={earth} />}
          {key === "moon" && <MoonView locale={locale} labels={cosmos.moonView} phaseNames={earth.phaseNames} />}
          {key === "map" && <WorldMap locale={locale} labels={map} />}
        </div>
      ))}
    </div>
  );
}
