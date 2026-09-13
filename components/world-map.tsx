"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isLand, subsolarPoint, isDaylight } from "~/lib/noor-land";
import { getPrayerTimesForCoords, prayerKeys, toArabicDigits, type PrayerData } from "~/lib/prayer-times";
import { palette, useTheme } from "~/lib/use-theme";
import type { Locale } from "~/lib/i18n";

type CityKey =
  | "mecca" | "medina" | "amman" | "cairo" | "istanbul"
  | "berlin" | "jakarta" | "karachi" | "lagos" | "newyork";

const CITIES: Record<CityKey, { lat: number; lon: number; name: Record<"de" | "en" | "ar", string> }> = {
  mecca: { lat: 21.4225, lon: 39.8262, name: { de: "Mekka", en: "Mecca", ar: "مكة" } },
  medina: { lat: 24.5247, lon: 39.5692, name: { de: "Medina", en: "Medina", ar: "المدينة" } },
  amman: { lat: 31.9539, lon: 35.9106, name: { de: "Amman", en: "Amman", ar: "عمّان" } },
  cairo: { lat: 30.0444, lon: 31.2357, name: { de: "Kairo", en: "Cairo", ar: "القاهرة" } },
  istanbul: { lat: 41.0082, lon: 28.9784, name: { de: "Istanbul", en: "Istanbul", ar: "إسطنبول" } },
  berlin: { lat: 52.52, lon: 13.405, name: { de: "Berlin", en: "Berlin", ar: "برلين" } },
  jakarta: { lat: -6.2088, lon: 106.8456, name: { de: "Jakarta", en: "Jakarta", ar: "جاكرتا" } },
  karachi: { lat: 24.8607, lon: 67.0011, name: { de: "Karachi", en: "Karachi", ar: "كراتشي" } },
  lagos: { lat: 6.5244, lon: 3.3792, name: { de: "Lagos", en: "Lagos", ar: "لاغوس" } },
  newyork: { lat: 40.7128, lon: -74.006, name: { de: "New York", en: "New York", ar: "نيويورك" } },
};

/** Grobe Zuordnung IANA-Zeitzone → naheliegende Stadt aus der Liste, damit
 *  die Karte nicht immer mit Mekka startet, sondern mit einem plausiblen
 *  Standort für den Besucher — ohne dass eine Position abgefragt wird. */
const ZONE_HINTS: Array<[RegExp, CityKey]> = [
  [/^Europe\/(Berlin|Vienna|Zurich|Amsterdam|Prague|Warsaw)/, "berlin"],
  [/^Europe\/Istanbul/, "istanbul"],
  [/^Asia\/Amman/, "amman"],
  [/^Africa\/Cairo/, "cairo"],
  [/^Asia\/Karachi/, "karachi"],
  [/^Asia\/Jakarta/, "jakarta"],
  [/^Africa\/Lagos/, "lagos"],
  [/^America\/New_York/, "newyork"],
  [/^Asia\/Riyadh/, "mecca"],
];

type MapLabels = {
  useLocation: string;
  locating: string;
  denied: string;
  myLocation: string;
  next: string;
  source: string;
  live: string;
  offline: string;
  names: Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", string>;
};

const GRID_STEP = 4; // Grad — Auflösung des Punktrasters

export function WorldMap({ locale, labels }: { locale: Locale; labels: MapLabels }) {
  const rtl = locale === "ar";
  const num = (v: string | number) => (rtl ? toArabicDigits(v) : String(v));
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<CityKey | "mylocation">("mecca");
  const [myCoords, setMyCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [times, setTimes] = useState<PrayerData | null>(null);

  // Beim ersten Laden: aus der Zeitzone des Geräts eine plausible
  // Standardstadt ableiten — keine Standortabfrage, nur eine gute Vermutung.
  useEffect(() => {
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hit = ZONE_HINTS.find(([re]) => re.test(zone));
      if (hit) setSelected(hit[1]);
    } catch {
      // Intl nicht verfügbar — Standard (Mekka) bleibt stehen.
    }
  }, []);

  const activeCoords =
    selected === "mylocation" && myCoords
      ? myCoords
      : selected !== "mylocation"
        ? { lat: CITIES[selected].lat, lon: CITIES[selected].lon }
        : null;

  const activeName =
    selected === "mylocation" ? labels.myLocation : CITIES[selected].name[locale];

  // Gebetszeiten für den aktiven Ort holen.
  useEffect(() => {
    if (!activeCoords) return;
    let cancelled = false;
    getPrayerTimesForCoords(activeCoords.lat, activeCoords.lon, activeName, locale).then((data) => {
      if (!cancelled) setTimes(data);
    });
    return () => {
      cancelled = true;
    };
    // activeName fliesst bewusst mit ein, damit die Anzeige beim Wechsel
    // sofort den neuen Stadtnamen zeigt.
  }, [activeCoords?.lat, activeCoords?.lon, activeName, locale]);

  const useMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError(true);
      return;
    }
    setLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setSelected("mylocation");
        setLocating(false);
      },
      () => {
        setLocationError(true);
        setLocating(false);
      },
      { timeout: 8000 },
    );
  }, []);

  // Punktraster + Tag/Nacht zeichnen. Läuft in Echtzeit (jede Minute neu),
  // damit der Terminator sichtbar wandert, ohne unnötig CPU zu verbrennen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = 720;
    const h = 360;
    canvas.width = w;
    canvas.height = h;

    function project(lon: number, lat: number) {
      return { x: ((lon + 180) / 360) * w, y: ((90 - lat) / 180) * h };
    }

    function render() {
      ctx!.clearRect(0, 0, w, h);
      const sun = subsolarPoint(new Date());
      const c = palette[theme];

      for (let lat = -88; lat <= 88; lat += GRID_STEP) {
        for (let lon = -178; lon <= 178; lon += GRID_STEP) {
          if (!isLand(lon, lat)) continue;
          const { x, y } = project(lon, lat);
          const day = isDaylight(lon, lat, sun);
          ctx!.fillStyle = day ? c.gold : c.muted;
          ctx!.globalAlpha = day ? 0.85 : 0.5;
          ctx!.beginPath();
          ctx!.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;

      // Städte-Pins
      (Object.keys(CITIES) as CityKey[]).forEach((key) => {
        const city = CITIES[key];
        const { x, y } = project(city.lon, city.lat);
        const isSelected = selected === key;
        ctx!.fillStyle = c.gold;
        ctx!.globalAlpha = isSelected ? 1 : 0.55;
        ctx!.beginPath();
        ctx!.arc(x, y, isSelected ? 5 : 3, 0, Math.PI * 2);
        ctx!.fill();
        if (isSelected) {
          ctx!.strokeStyle = c.goldGlow;
          ctx!.globalAlpha = 1;
          ctx!.lineWidth = 1.5;
          ctx!.beginPath();
          ctx!.arc(x, y, 9, 0, Math.PI * 2);
          ctx!.stroke();
        }
      });
      ctx!.globalAlpha = 1;

      // eigener Standort, falls gesetzt
      if (myCoords) {
        const { x, y } = project(myCoords.lon, myCoords.lat);
        const isSelected = selected === "mylocation";
        ctx!.fillStyle = c.green;
        ctx!.globalAlpha = isSelected ? 1 : 0.6;
        ctx!.beginPath();
        ctx!.arc(x, y, isSelected ? 5 : 3, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
    }

    render();
    const interval = setInterval(render, 60_000);
    return () => clearInterval(interval);
  }, [selected, myCoords, theme]);

  const nextPrayerKey = times ? guessNextPrayer(times) : null;

  return (
    <div className="border border-rule bg-surface">
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="p-5 sm:p-6">
          <div className="overflow-hidden border border-rule bg-paper">
            <canvas ref={canvasRef} className="block h-auto w-full" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.keys(CITIES) as CityKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`mono rounded-full border px-3 py-1.5 text-xs transition ${
                  selected === key
                    ? "border-transparent bg-gold text-paper"
                    : "border-rule text-muted hover:border-gold hover:text-ink"
                }`}
              >
                {CITIES[key].name[locale]}
              </button>
            ))}
            <button
              onClick={useMyLocation}
              className={`mono flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                selected === "mylocation"
                  ? "border-transparent bg-accent text-paper"
                  : "border-accent/50 text-accent hover:bg-accent/10"
              }`}
            >
              <span aria-hidden>◎</span>
              {locating ? labels.locating : labels.useLocation}
            </button>
          </div>
          {locationError && <p className="mt-2 text-xs text-gold">{labels.denied}</p>}
        </div>

        <div className="border-t border-rule p-6 lg:border-t-0 lg:border-s">
          <p className="mono text-sm text-muted">{activeName}</p>
          <dl className="mono mt-4 space-y-2 text-sm">
            {prayerKeys.map((k) => (
              <div
                key={k}
                className={`flex justify-between gap-6 px-3 py-2 ${
                  nextPrayerKey === k ? "border border-accent/50 bg-accent/10" : ""
                }`}
              >
                <dt className="flex items-center gap-2">
                  {nextPrayerKey === k && (
                    <span className="rounded-full border border-accent px-2 py-0.5 text-[9px] uppercase tracking-wide text-accent">
                      {labels.next}
                    </span>
                  )}
                  <span className="text-ink">{labels.names[k]}</span>
                </dt>
                <dd className="text-gold tabular-nums">{times ? num(times.timings[k]) : "—:—"}</dd>
              </div>
            ))}
          </dl>
          <p className="mono mt-5 text-xs text-muted">
            <span
              aria-hidden
              className={`me-2 inline-block h-1.5 w-1.5 rounded-full ${times?.live ? "bg-accent" : "bg-muted"}`}
            />
            {times?.live ? labels.live : labels.offline} · {labels.source}
          </p>
        </div>
      </div>
    </div>
  );
}

function guessNextPrayer(data: PrayerData): (typeof prayerKeys)[number] | null {
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (const key of prayerKeys) {
    if (data.timings[key] > current) return key;
  }
  return prayerKeys[0] ?? null;
}