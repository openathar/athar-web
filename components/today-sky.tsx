"use client";

import { useEffect, useState } from "react";
import {
  moonPhaseAt,
  nextMoonEvents,
  type MoonEvents,
  type MoonPhase,
  type MoonPhaseKey,
} from "~/lib/moon-phase";

type SkyLabels = {
  moon: string;
  illuminated: string;
  nextFull: string;
  nextNew: string;
  days: string;
  phaseNames: Record<MoonPhaseKey, string>;
};

export type SkyState = { phase: MoonPhase; events: MoonEvents };

/**
 * "Heute am Himmel" — Mondphase, Beleuchtung und die nächsten Ereignisse,
 * vollständig lokal berechnet. Gleiches ISR-Muster wie TodayHijri: SSR zeigt
 * den Zustand zur Build-Zeit, nach dem Mount übernimmt der heutige Tag.
 */
export function TodaySky({ labels, initial }: { labels: SkyLabels; initial: SkyState }) {
  const [sky, setSky] = useState(initial);

  useEffect(() => {
    const now = new Date();
    setSky({ phase: moonPhaseAt(now), events: nextMoonEvents(now) });
  }, []);

  const { phase, events } = sky;
  const pct = Math.round(phase.illumination * 100);
  const fmt = (d: number) => Math.round(d);

  return (
    <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-3">
      <div className="bg-surface p-6">
        <p className="mono text-xs text-gold">{labels.moon}</p>
        <p className="display mt-2 text-xl">{labels.phaseNames[phase.key]}</p>
        <p className="mono mt-1 text-sm text-muted">
          {pct} % {labels.illuminated}
        </p>
      </div>
      <div className="bg-surface p-6">
        <p className="mono text-xs text-gold">{labels.nextFull}</p>
        <p className="display mt-2 text-xl">
          {fmt(events.nextFullMoon)}
          <span className="ms-2 text-sm text-muted">{labels.days}</span>
        </p>
      </div>
      <div className="bg-surface p-6">
        <p className="mono text-xs text-gold">{labels.nextNew}</p>
        <p className="display mt-2 text-xl">
          {fmt(events.nextNewMoon)}
          <span className="ms-2 text-sm text-muted">{labels.days}</span>
        </p>
      </div>
    </div>
  );
}