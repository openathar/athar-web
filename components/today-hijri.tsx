"use client";

import { useEffect, useState } from "react";
import type { Locale } from "~/lib/i18n";
import { gregorianToHijri, type HijriDate } from "~/lib/hijri";
import { hijriEventFor, type EventDef } from "~/lib/islamic-dates";

type Labels = {
  today: string;
  hijriYear: string;
};

/**
 * "Heute im islamischen Kalender" — das heutige Hijri-Datum, berechnet im
 * Client. Wie bei DailySign: `new Date()` in einer statisch gerenderten Seite
 * würde pro Locale-Cache-Eintrag einfrieren. SSR zeigt das Datum zur
 * Build-Zeit; nach dem Mount übernimmt der heutige Tag.
 */
export function TodayHijri({
  locale,
  labels,
  initialHijri,
}: {
  locale: Locale;
  labels: Labels;
  initialHijri: HijriDate;
}) {
  const [hijri, setHijri] = useState(initialHijri);
  const [event, setEvent] = useState<EventDef | null>(() => hijriEventFor(initialHijri));

  useEffect(() => {
    const h = gregorianToHijri(new Date(), locale);
    setHijri(h);
    setEvent(hijriEventFor(h));
  }, [locale]);

  return (
    <div className="mt-8 border border-rule bg-surface p-6">
      <p className="display italic text-sm text-gold">{labels.today}</p>
      <p className="mt-2 text-2xl">
        {hijri.day} {hijri.monthName} {hijri.year} {labels.hijriYear}
      </p>
      {event && (
        <div className="mt-3 border-t border-rule pt-3">
          <p className="text-sm font-medium text-accent">{event.name[locale]}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{event.note[locale]}</p>
        </div>
      )}
    </div>
  );
}