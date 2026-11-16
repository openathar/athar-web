"use client";

import { useEffect, useState } from "react";
import { getPrayerTimesForCoords, nextPrayerKey, type PrayerKey } from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

/**
 * Countdown zur nächsten Gebetszeit. Holt den Standort per Browser-Geolocation
 * (mit stiller Ablehnung) und fällt sonst auf Mekka zurück. Die Zeiten werden
 * lokal berechnet (@openathar/athan-core-ts via lib/prayer-times), kein Netz.
 */

const PRAYER_NAME: Record<PrayerKey, Record<Locale, string>> = {
  fajr: { en: "Fajr", de: "Fajr", ar: "الفجر" },
  dhuhr: { en: "Dhuhr", de: "Dhuhr", ar: "الظهر" },
  asr: { en: "Asr", de: "Asr", ar: "العصر" },
  maghrib: { en: "Maghrib", de: "Maghrib", ar: "المغرب" },
  isha: { en: "Isha", de: "Isha", ar: "العشاء" },
};

const MECCA = { lat: 21.4225, lon: 39.8262, city: "Makkah" };

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const num = (n: string | number, l: Locale) =>
  l === "ar" ? String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]) : String(n);

function fmtCountdown(ms: number, l: Locale): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const hh = num(h, l), mm = num(m, l), ss = num(s, l);
  if (h > 0) return `${hh}h ${mm}m`;
  return `${mm}m ${ss}s`;
}

export function PrayerCountdown({ locale }: { locale: Locale }) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [loc, setLoc] = useState(MECCA);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: "" }),
        () => {},
        { timeout: 4000, maximumAge: 300000 },
      );
    }
    return () => clearInterval(t);
  }, []);

  const data = getPrayerTimesForCoords(loc.lat, loc.lon, loc.city, undefined, now);
  const nowStr = now.toTimeString().slice(0, 5);
  const key = nextPrayerKey(data.timings, nowStr);
  if (!key) return null;

  const [h, m] = (data.timings[key] as string).split(":").map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);

  return (
    <span className="lp-count" aria-live="off">
      {PRAYER_NAME[key][locale]} · {fmtCountdown(target.getTime() - now.getTime(), locale)}
    </span>
  );
}
