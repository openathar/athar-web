"use client";

import { useCallback, useState } from "react";
import { CITIES, type CityKey } from "~/lib/cities";
import type { CosmosPlace } from "~/components/prayer-strip";
import type { Locale } from "~/lib/i18n";

export type PickerLabels = {
  useLocation: string;
  locating: string;
  denied: string;
  myLocation: string;
};

/** Staedte als Chips plus "Mein Standort" — waehlt den Ort fuer Globus und Gebetszeiten. */
export function PlacePicker({
  locale,
  labels,
  place,
  onPlace,
}: {
  locale: Locale;
  labels: PickerLabels;
  place: CosmosPlace | null;
  onPlace: (p: CosmosPlace) => void;
}) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(false);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError(true);
      return;
    }
    setLocating(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPlace({ label: labels.myLocation, lat: pos.coords.latitude, lon: pos.coords.longitude, current: true });
        setLocating(false);
      },
      () => {
        setError(true);
        setLocating(false);
      },
      { timeout: 8000 },
    );
  }, [labels.myLocation, onPlace]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CITIES) as CityKey[]).map((key) => {
          const city = CITIES[key];
          const active = place?.label === city.name[locale] && !place.current;
          return (
            <button
              key={key}
              onClick={() =>
                onPlace({ label: city.name[locale], lat: city.lat, lon: city.lon, zone: city.zone, current: false })
              }
              className={`mono rounded-full border px-3 py-1.5 text-xs transition ${
                active
                  ? "border-transparent bg-gold text-paper"
                  : "border-rule text-muted hover:border-gold hover:text-ink"
              }`}
            >
              {city.name[locale]}
            </button>
          );
        })}
        <button
          onClick={locate}
          className="mono flex items-center gap-1.5 rounded-full border border-accent/50 px-3 py-1.5 text-xs text-accent transition hover:bg-accent/10"
        >
          <span aria-hidden>◎</span>
          {locating ? labels.locating : labels.useLocation}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-gold">{labels.denied}</p>}
    </div>
  );
}
