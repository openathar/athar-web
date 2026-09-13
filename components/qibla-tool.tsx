"use client";

import { useEffect, useState } from "react";
import { qiblaBearing, distanceToKaaba, compassPoint } from "~/lib/qibla";
import { placeFromTimezone, type Place } from "~/lib/timezones";
import { toArabicDigits } from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

type Labels = {
  heading: string;
  intro: string;
  city: string;
  bearing: string;
  distance: string;
  km: string;
  deviceCompass: string;
  deviceCompassOn: string;
  deviceCompassDenied: string;
  fallbackNote: string;
};

/**
 * Qibla-Kompass.
 *
 * Standort-Bestimmung folgt demselben Prinzip wie die Gebetszeiten-Karte:
 * Browser-Zeitzone statt Geolocation-Berechtigung, damit nichts an einen
 * Server geht und kein Freigabe-Dialog nötig ist. Für die reale
 * Kompass-Ausrichtung (das Ziffernblatt dreht sich mit dem Gerät) ist eine
 * Berechtigung technisch unvermeidbar (iOS verlangt sie für
 * Bewegungssensoren) — das bleibt eine bewusste Zusatzoption, nichts, was
 * automatisch passiert.
 */
export function QiblaTool({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [place, setPlace] = useState<Place>({ city: "Amman", lat: 31.9539, lon: 35.9106 });
  const [detected, setDetected] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<"idle" | "granted" | "denied">("idle");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const p = placeFromTimezone(tz);
    if (p) {
      setPlace(p);
      setDetected(true);
    }
  }, []);

  const bearing = qiblaBearing(place.lat, place.lon);
  const distance = distanceToKaaba(place.lat, place.lon);
  const point = compassPoint(bearing);
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));

  // Wenn ein Gerätekompass aktiv ist, dreht sich das Ziffernblatt gegen die
  // Geräteausrichtung, sodass der Pfeil weiterhin auf die Qibla zeigt statt
  // auf den festen Peilwinkel relativ zu Norden.
  const dialRotation = heading !== null ? -heading : 0;
  const arrowRotation = bearing + dialRotation;

  async function enableDeviceCompass() {
    const AnyDOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    try {
      if (typeof AnyDOE.requestPermission === "function") {
        const res = await AnyDOE.requestPermission();
        if (res !== "granted") return setPermission("denied");
      }
      setPermission("granted");
      window.addEventListener(
        "deviceorientationabsolute",
        onOrientation as EventListener,
        true,
      );
      window.addEventListener("deviceorientation", onOrientation as EventListener, true);
    } catch {
      setPermission("denied");
    }
  }

  function onOrientation(e: DeviceOrientationEvent & { webkitCompassHeading?: number }) {
    const h = typeof e.webkitCompassHeading === "number" ? e.webkitCompassHeading : e.alpha;
    if (h != null) setHeading(h);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrientation as EventListener);
      window.removeEventListener("deviceorientation", onOrientation as EventListener);
    };
  }, []);

  return (
    <div className="border border-rule bg-surface p-8">
      <p className="mono mb-2 text-muted">{labels.city}: {place.city}</p>
      {detected && <p className="mono mb-6 text-muted text-xs">{labels.fallbackNote}</p>}

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        {/* Ziffernblatt */}
        <svg viewBox="0 0 200 200" className="h-52 w-52 shrink-0">
          <circle cx="100" cy="100" r="94" fill="none" stroke="var(--color-rule)" strokeWidth="1.5" />
          <g
            style={{
              transform: `rotate(${dialRotation}deg)`,
              transformOrigin: "100px 100px",
              transition: "transform 0.15s linear",
            }}
          >
            {["N", "E", "S", "W"].map((d, i) => (
              <text
                key={d}
                x="100"
                y={i === 0 ? 22 : i === 2 ? 186 : 100}
                textAnchor="middle"
                dominantBaseline="middle"
                className="mono"
                fill="var(--color-muted)"
                fontSize="13"
                transform={i === 1 ? "translate(78,0)" : i === 3 ? "translate(-78,0)" : ""}
              >
                {d}
              </text>
            ))}
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i * 15 * Math.PI) / 180;
              const major = i % 6 === 0;
              const r1 = major ? 78 : 84;
              return (
                <line
                  key={i}
                  x1={100 + r1 * Math.sin(a)}
                  y1={100 - r1 * Math.cos(a)}
                  x2={100 + 90 * Math.sin(a)}
                  y2={100 - 90 * Math.cos(a)}
                  stroke="var(--color-rule)"
                  strokeWidth={major ? 1.5 : 1}
                />
              );
            })}
          </g>

          {/* Pfeil zur Kaaba — bleibt fest auf die Qibla ausgerichtet */}
          <g
            style={{
              transform: `rotate(${arrowRotation}deg)`,
              transformOrigin: "100px 100px",
              transition: "transform 0.15s linear",
            }}
          >
            <line x1="100" y1="100" x2="100" y2="26" stroke="var(--color-accent)" strokeWidth="2.5" />
            <path d="M100 18 L108 34 L92 34 Z" fill="var(--color-accent)" />
          </g>

          <circle cx="100" cy="100" r="3" fill="var(--color-gold)" />
        </svg>

        <div className="mono space-y-3">
          <p>
            <span className="text-muted">{labels.bearing}: </span>
            <span className="text-gold">{num(bearing.toFixed(1))}°</span>{" "}
            <span className="text-muted">{point}</span>
          </p>
          <p>
            <span className="text-muted">{labels.distance}: </span>
            <span className="text-gold">{num(distance)}</span>{" "}
            <span className="text-muted">{labels.km}</span>
          </p>

          {permission !== "granted" && (
            <button
              type="button"
              onClick={enableDeviceCompass}
              className="border border-rule px-4 py-2 text-sm transition hover:border-accent hover:text-accent"
            >
              {labels.deviceCompass}
            </button>
          )}
          {permission === "granted" && (
            <p className="text-accent text-sm">{labels.deviceCompassOn}</p>
          )}
          {permission === "denied" && (
            <p className="text-muted text-sm">{labels.deviceCompassDenied}</p>
          )}
        </div>
      </div>
    </div>
  );
}
