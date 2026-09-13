"use client";

import dynamic from "next/dynamic";
import { moonPhaseAt } from "~/lib/moon-phase";
import { toArabicDigits } from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

// WebGL/three.js braucht den Browser — kein SSR, und laedt erst, wenn
// jemand diese Seite tatsaechlich oeffnet (kein Gewicht auf der Startseite).
const Moon3D = dynamic(() => import("~/components/moon-3d").then((m) => m.Moon3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center text-muted sm:h-80">…</div>
  ),
});
export function MoonSection({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    illumination: string;
    age: string;
    days: string;
    caveat: string;
    phases: Record<string, string>;
  };
}) {
  const phase = moonPhaseAt(new Date());
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));

  return (
    <div className="border border-rule bg-surface p-8">
      <Moon3D phaseAngleDeg={phase.phaseAngle} />
      <div className="mono mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-rule pt-6">
        <p>
          <span className="text-ink">{labels.phases[phase.key]}</span>
        </p>
        <p>
          <span className="text-muted">{labels.illumination}: </span>
          <span className="text-gold">{num(Math.round(phase.illumination * 100))}%</span>
        </p>
        <p>
          <span className="text-muted">{labels.age}: </span>
          <span className="text-gold">{num(phase.ageDays.toFixed(1))}</span>{" "}
          <span className="text-muted">{labels.days}</span>
        </p>
      </div>
      <p className="mono mt-4 text-xs text-muted">{labels.caveat}</p>
    </div>
  );
}
