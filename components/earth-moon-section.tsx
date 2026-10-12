"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { moonPhaseAt } from "~/lib/moon-phase";
import { nearestPlace, timezoneForCoords } from "~/lib/timezones";
import { toArabicDigits } from "~/lib/prayer-times";
import { useTheme } from "~/lib/use-theme";
import { ZoomButtons, type ZoomApi, type ZoomLabels } from "~/components/cosmos-controls";
import { PrayerStrip, type CosmosPlace, type StripLabels } from "~/components/prayer-strip";
import { PlacePicker, type PickerLabels } from "~/components/place-picker";
import type { Locale } from "~/lib/i18n";

const Scene = dynamic(
  () => import("~/components/earth-moon-scene").then((m) => m.EarthMoonScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[68vh] max-h-[760px] min-h-[460px] items-center justify-center text-muted">…</div>
    ),
  },
);

type Labels = StripLabels & PickerLabels & {
  pickHint: string;
  dayNight: string;
  moonPhase: string;
  phaseNames: Record<string, string>;
};

/**
 * Erde + Mond direkt auf der Seite, ohne Kasten: der Globus schwebt im
 * Himmel der Seite, die Gebetszeiten des gewaehlten Ortes stehen darunter.
 * Der Ort gehoert dem uebergeordneten Zustand.
 */
export function EarthMoonSection({
  locale,
  labels,
  zoomLabels,
  place,
  onPlace,
}: {
  locale: Locale;
  labels: Labels;
  zoomLabels: ZoomLabels;
  place: CosmosPlace | null;
  onPlace: (p: CosmosPlace) => void;
}) {
  const phase = moonPhaseAt(new Date());
  const theme = useTheme();
  const apiRef = useRef<ZoomApi | null>(null);
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));

  function onPick(p: { lat: number; lon: number } | null) {
    if (!p) return;
    // Naechste bekannte Stadt statt nackter Koordinaten — erst im Ozean
    // bleiben die Zahlen stehen.
    const near = nearestPlace(p.lat, p.lon);
    const label = near ? near.city : `${num(p.lat)}°, ${num(p.lon)}°`;
    onPlace({
      label,
      lat: p.lat,
      lon: p.lon,
      zone: near ? timezoneForCoords(p.lat, p.lon) : undefined,
      current: false,
    });
  }

  return (
    <div>
      <div className="relative">
        <div className="stage-fade">
          <Scene
            onPick={onPick}
            moonPhaseAngle={phase.phaseAngle}
            pickedMarker={place ? { lat: place.lat, lon: place.lon } : null}
            theme={theme}
            apiRef={apiRef}
          />
        </div>
        <ZoomButtons
          labels={zoomLabels}
          onZoom={(f) => apiRef.current?.zoom(f)}
          onReset={() => apiRef.current?.reset()}
        />
      </div>

      <PlacePicker locale={locale} labels={labels} place={place} onPlace={onPlace} />
      <PrayerStrip place={place} locale={locale} labels={labels} />
      <p className="mono mt-4 text-xs text-muted">
        {labels.pickHint} · {labels.dayNight} · {labels.moonPhase}: {labels.phaseNames[phase.key]}
      </p>
    </div>
  );
}
