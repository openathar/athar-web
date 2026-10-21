"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EarthMoonSection } from "~/components/earth-moon-section";
import type { ZoomLabels } from "~/components/cosmos-controls";
import type { CosmosPlace } from "~/components/prayer-strip";
import { placeFromTimezone } from "~/lib/timezones";
import type { Dict } from "~/lib/dictionaries";
import type { Locale } from "~/lib/i18n";

// MoonView haengt vom Abrufzeitpunkt ab (Mondphase) und nutzt R3F-Canvas —
// beides ist nicht SSR-tauglich, darum client-only wie die 3D-Szene.
const MoonView = dynamic(
  () => import("~/components/moon-view").then((m) => m.MoonView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[460px] items-center justify-center text-muted sm:h-[580px]">…</div>
    ),
  },
);

type Props = {
  locale: Locale;
  cosmos: Dict["cosmos"];
  earth: Dict["earth"];
  map: Dict["map"];
  zoom: ZoomLabels;
  showMoon?: boolean;
};

/**
 * Eine Beobachtungsstation, zwei Fenster: der 3D-Globus mit Mond, der Mond
 * in Grossaufnahme. Die Gebetszeiten bleiben in
 * Erd-Tab; der Mond-Tab zaehlt Phasen statt Gebete.
 */
export function CosmosTabs({ locale, cosmos, earth, map, zoom, showMoon = true }: Props) {
  const [tab, setTab] = useState<"earth" | "moon">("earth");
  // Ein Ort fuer Globus und Gebetszeiten. Start: der Ort des Geraets aus der
  // Zeitzone (keine Standortabfrage), sonst Amman.
  const [place, setPlace] = useState<CosmosPlace | null>(null);
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const known = placeFromTimezone(tz);
    const p = known ?? { city: "Amman", lat: 31.9539, lon: 35.9106 };
    setPlace({ label: p.city, lat: p.lat, lon: p.lon, zone: known ? tz : "Asia/Amman", current: true });
  }, []);

  const strip = { ...earth, ...map, source: earth.source };

  const tabs = (showMoon
    ? ([["earth", cosmos.tabs.earth], ["moon", cosmos.tabs.moon]] as const)
    : ([["earth", cosmos.tabs.earth]] as const)) as readonly (readonly ["earth" | "moon", string])[];

  return (
    <div>
      <div role="tablist" aria-label={cosmos.label} className="flex flex-wrap gap-2" hidden={!showMoon}>
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
          {key === "earth" && (
            <EarthMoonSection locale={locale} labels={strip} zoomLabels={zoom} place={place} onPlace={setPlace} />
          )}
          {key === "moon" && (
            <MoonView locale={locale} labels={cosmos.moonView} phaseNames={earth.phaseNames} zoomLabels={zoom} />
          )}
        </div>
      ))}
    </div>
  );
}
