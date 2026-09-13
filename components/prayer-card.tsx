"use client";

import { useEffect, useState } from "react";
import { prayerKeys, toArabicDigits, type PrayerData } from "~/lib/prayer-times";
import { placeFromTimezone } from "~/lib/timezones";
import type { Locale } from "~/lib/i18n";

type Labels = {
  names: Record<string, string>;
  basis: Record<string, string>;
  maghribOffset: string;
  live: string;
  offline: string;
  source: string;
  localised: string;
};

/**
 * Zeigt die Gebetszeiten und verfeinert sie nach dem Mount auf den Ort des
 * Besuchers.
 *
 * Der Server rendert bewusst einen festen Ort vor: Damit bleibt die Seite
 * statisch auslieferbar und es entsteht kein Layout-Sprung. Erst im Browser
 * wird die Zeitzone gelesen und — falls bekannt — beim Anbieter direkt
 * nachgeladen. Der Aufruf geht vom Gerät aus, nicht über unseren Server;
 * wir erfahren den Ort des Besuchers nie.
 */
export function PrayerCard({
  initial,
  labels,
  locale,
}: {
  initial: PrayerData;
  labels: Labels;
  locale: Locale;
}) {
  const [data, setData] = useState<PrayerData>(initial);
  const [localised, setLocalised] = useState(false);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const place = placeFromTimezone(timezone);
    if (!place || place.city === initial.city) return;

    const controller = new AbortController();
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-${now.getFullYear()}`;

    // Ohne `method` waehlt Aladhan die regional uebliche Berechnungsmethode.
    fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${place.lat}&longitude=${place.lon}`,
      { signal: controller.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const d = json?.data;
        if (!d?.timings) return;
        const params = d.meta?.method?.params ?? {};
        const clean = (v: string) => v.split(" ")[0];
        const angle = (v: unknown, fb: string) =>
          typeof v === "number"
            ? String(v)
            : typeof v === "string"
              ? (v.match(/[\d.]+/)?.[0] ?? fb)
              : fb;

        const intl =
          locale === "de" ? "de-DE" : locale === "ar" ? "ar-JO" : "en-GB";
        const h = d.date?.hijri;
        const hijriParts = h
          ? [
              locale === "ar" ? toArabicDigits(h.day) : h.day,
              locale === "ar" ? h.month?.ar : h.month?.en,
              locale === "ar" ? toArabicDigits(h.year) : h.year,
            ]
          : [];

        setData({
          city: place.city,
          timings: {
            fajr: clean(d.timings.Fajr),
            dhuhr: clean(d.timings.Dhuhr),
            asr: clean(d.timings.Asr),
            maghrib: clean(d.timings.Maghrib),
            isha: clean(d.timings.Isha),
          },
          fajrAngle: angle(params.Fajr, initial.fajrAngle),
          ishaAngle: angle(params.Isha, initial.ishaAngle),
          maghribOffset:
            typeof params.Maghrib === "string" ? angle(params.Maghrib, "0") : null,
          asrFactor: d.meta?.school === "HANAFI" ? 2 : 1,
          gregorian: new Intl.DateTimeFormat(intl, {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: d.meta?.timezone ?? timezone,
          }).format(now),
          hijri: hijriParts.join(" "),
          method: d.meta?.method?.name ?? initial.method,
          live: true,
        });
        setLocalised(true);
      })
      .catch(() => {
        /* Netz weg oder Anbieter down — der vorgerenderte Stand bleibt stehen. */
      });

    return () => controller.abort();
  }, [initial, locale]);

  const rtl = locale === "ar";
  const num = (v: string | number) => (rtl ? toArabicDigits(v) : String(v));

  const basisFor = (key: (typeof prayerKeys)[number]) => {
    const template = labels.basis[key];
    if (key === "asr") return template.replace("{factor}", num(data.asrFactor));
    if (key === "maghrib") {
      return data.maghribOffset
        ? template + labels.maghribOffset.replace("{offset}", num(data.maghribOffset))
        : template;
    }
    const a = key === "fajr" ? data.fajrAngle : data.ishaAngle;
    return template.replace("{angle}", num(a));
  };

  return (
    <div className="border border-rule bg-surface">
      <div className="mono flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule px-5 py-3">
        <span className="text-ink">
          {data.city} · {data.gregorian}
        </span>
        <span className="flex items-center gap-2 text-muted">
          {data.hijri && <span>{data.hijri}</span>}
          <span aria-hidden className={data.live ? "text-accent" : "text-muted"}>
            ●
          </span>
          <span>{data.live ? labels.live : labels.offline}</span>
        </span>
      </div>

      <dl className="mono divide-y divide-rule">
        {prayerKeys.map((key) => (
          <div
            key={key}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 px-5 py-3"
          >
            <dt className="text-ink">{labels.names[key]}</dt>
            <dd className="text-gold tabular-nums">{num(data.timings[key])}</dd>
            <dd className="col-span-2 text-muted">{basisFor(key)}</dd>
          </div>
        ))}
      </dl>

      <p className="mono border-t border-rule px-5 py-3 text-muted">
        {labels.source}:{" "}
        <a
          href="https://aladhan.com/prayer-times-api"
          className="underline underline-offset-4 transition hover:text-ink"
        >
          Aladhan API
        </a>{" "}
        · {data.method}
        {localised && <> · {labels.localised}</>}
      </p>
    </div>
  );
}
