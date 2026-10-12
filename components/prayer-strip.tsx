"use client";

import { useMemo } from "react";
import {
  getPrayerTimesForCoords,
  nextPrayerKey,
  prayerKeys,
  toArabicDigits,
} from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

export type CosmosPlace = {
  label: string;
  lat: number;
  lon: number;
  zone?: string;
  /** true = aus der Zeitzone des Geraets abgeleitet, nicht gewaehlt. */
  current: boolean;
};

export type StripLabels = {
  currentLocation: string;
  timesFor: string;
  names: Record<string, string>;
  source: string;
  next: string;
};

/**
 * Die fuenf Gebetszeiten des gewaehlten Ortes als ruhige Zeile unter der
 * Buehne. Ort und Zeiten kommen aus einem gemeinsamen Zustand — Erde und
 * Karte zeigen dadurch immer denselben Ort.
 */
export function PrayerStrip({
  place,
  locale,
  labels,
}: {
  place: CosmosPlace | null;
  locale: Locale;
  labels: StripLabels;
}) {
  const rtl = locale === "ar";
  const num = (v: string) => (rtl ? toArabicDigits(v) : v);

  const data = useMemo(
    () =>
      place
        ? getPrayerTimesForCoords(place.lat, place.lon, place.label, place.zone)
        : null,
    [place],
  );
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  // "Naechstes Gebet" ergibt nur am eigenen Ort Sinn — dort stimmt die Uhr.
  const next = data && place?.current ? nextPrayerKey(data.timings, clock) : null;

  return (
    <div className="mt-8 border-y border-rule py-6">
      <p className="text-muted">
        {place?.current ? labels.currentLocation : labels.timesFor}{" "}
        <span className="text-ink">{place?.label ?? "…"}</span>
      </p>
      <dl className="mt-5 grid grid-cols-5 gap-2 sm:gap-6">
        {prayerKeys.map((k) => (
          <div key={k}>
            <dt className="mono flex flex-wrap items-center gap-x-2 text-[11px] text-muted sm:text-xs">
              {labels.names[k]}
              {next === k && (
                <span className="rounded-full border border-accent px-1.5 text-[9px] uppercase text-accent">
                  {labels.next}
                </span>
              )}
            </dt>
            <dd
              dir="ltr"
              className={`mt-1 text-lg font-light tabular-nums sm:text-3xl ${next === k ? "text-accent" : "text-gold"}`}
            >
              {data?.timings[k] ? num(data.timings[k]!) : "—:—"}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mono mt-4 text-xs text-muted">
        {labels.source}: athan-core{data?.method ? ` · ${data.method}` : ""}
      </p>
    </div>
  );
}
