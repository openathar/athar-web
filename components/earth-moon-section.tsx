"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { moonPhaseAt } from "~/lib/moon-phase";
import { placeFromTimezone, nearestPlace } from "~/lib/timezones";
import { toArabicDigits } from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

const Scene = dynamic(
  () => import("~/components/earth-moon-scene").then((m) => m.EarthMoonScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center text-muted sm:h-96">…</div>
    ),
  },
);

type Labels = {
  pickHint: string;
  currentLocation: string;
  timesFor: string;
  names: Record<string, string>;
  dayNight: string;
  moonPhase: string;
  phaseNames: Record<string, string>;
  source: string;
};

type Times = Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", string>;

async function fetchTimes(lat: number, lon: number): Promise<{ times: Times; method: string } | null> {
  try {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
    const res = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}`);
    if (!res.ok) return null;
    const d = await res.json();
    const t = d.data.timings;
    const clean = (v: string) => v.split(" ")[0];
    return {
      times: { fajr: clean(t.Fajr), dhuhr: clean(t.Dhuhr), asr: clean(t.Asr), maghrib: clean(t.Maghrib), isha: clean(t.Isha) },
      method: d.data.meta.method?.name ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * Startseiten-Abschnitt: Erde + Mond, immer beide vollstaendig sichtbar,
 * nur sehr sanfte Eigenbewegung (siehe earth-moon-scene.tsx).
 *
 * Default-Zustand ist der eigene Standort (aus der Zeitzone erkannt, wie bei
 * der Gebetszeiten-Karte) — nicht ein leerer Hinweistext. Ein Klick auf die
 * Erde ersetzt das durch den gewaehlten Ort; die Markierung bleibt sichtbar,
 * bis erneut geklickt wird.
 */
export function EarthMoonSection({ locale, labels }: { locale: Locale; labels: Labels }) {
  const phase = moonPhaseAt(new Date());
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));

  const [place, setPlace] = useState<{ label: string; lat: number; lon: number } | null>(null);
  const [times, setTimes] = useState<Times | null>(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCurrent, setIsCurrent] = useState(true);

  // Default: eigener Standort ueber die Zeitzone, ohne Berechtigungsdialog —
  // derselbe Mechanismus wie bei der Gebetszeiten-Karte weiter unten.
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const p = placeFromTimezone(tz) ?? { city: "Amman", lat: 31.9539, lon: 35.9106 };
    setPlace({ label: p.city, lat: p.lat, lon: p.lon });
    fetchTimes(p.lat, p.lon).then((r) => {
      if (r) { setTimes(r.times); setMethod(r.method); }
      setLoading(false);
    });
  }, []);

  async function onPick(p: { lat: number; lon: number } | null) {
    if (!p) return;
    setIsCurrent(false);
    // Naechste bekannte Stadt anzeigen statt nackter Koordinaten — erst wenn
    // nichts in der Naehe liegt (Ozean), bleiben die Zahlen stehen.
    const near = nearestPlace(p.lat, p.lon);
    const label = near ? near.city : `${num(p.lat)}°, ${num(p.lon)}°`;
    setPlace({ label, lat: p.lat, lon: p.lon });
    setLoading(true);
    const r = await fetchTimes(p.lat, p.lon);
    if (r) { setTimes(r.times); setMethod(r.method); }
    setLoading(false);
  }

  return (
    <div className="border border-rule bg-surface">
      <div className="grid md:grid-cols-[1.3fr_1fr]">
        <div className="border-b border-rule md:border-b-0 md:border-e">
          <Scene
            onPick={onPick}
            moonPhaseAngle={phase.phaseAngle}
            pickedMarker={place ? { lat: place.lat, lon: place.lon } : null}
          />
          <p className="mono border-t border-rule px-5 py-3 text-xs text-muted">
            {labels.dayNight} · {labels.moonPhase}: {labels.phaseNames[phase.key]}
          </p>
        </div>

        <div className="flex flex-col justify-center p-8">
          <p className="mono text-sm text-muted">
            {isCurrent ? labels.currentLocation : labels.timesFor} {place?.label ?? "…"}
          </p>

          {loading && <p className="mono mt-4 text-muted">…</p>}

          {!loading && times && (
            <>
              <dl className="mono mt-4 space-y-2 text-sm">
                {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((k) => (
                  <div key={k} className="flex justify-between gap-6">
                    <dt className="text-ink">{labels.names[k]}</dt>
                    <dd className="text-gold tabular-nums">{num(times[k])}</dd>
                  </div>
                ))}
              </dl>
              <p className="mono mt-5 text-xs text-muted">
                {labels.source}: Aladhan API{method ? ` · ${method}` : ""}
              </p>
            </>
          )}

          <p className="mono mt-6 text-xs text-muted">{labels.pickHint}</p>
        </div>
      </div>
    </div>
  );
}
