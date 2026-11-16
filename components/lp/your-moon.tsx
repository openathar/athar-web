"use client";

import { useEffect, useState } from "react";
import { gregorianToHijri, moonPhaseAt, type MoonPhaseKey } from "@openathar/athan-core-ts";
import type { Locale } from "~/lib/i18n";

/**
 * "Dein Mond" — the moon phase and the Hijri date of a chosen day (e.g. a
 * birth date). Fully computed on the device via @openathar/athan-core-ts, no
 * network call. The phase disc is a plain SVG (lit/dark regions from the
 * illumination), matching the site's dark/gold palette.
 */

const LABEL: Record<Locale, string> = {
  en: "Your moon",
  de: "Dein Mond",
  ar: "قمرك",
};
const HINT: Record<Locale, string> = {
  en: "Pick a date — the day you were born, or any day that matters.",
  de: "Wähle ein Datum — deinen Geburtstag oder jeden Tag, der zählt.",
  ar: "اختر تاريخًا — يوم ميلادك أو أي يوم يهمّك.",
};
const ILLUM: Record<Locale, string> = { en: "illuminated", de: "beleuchtet", ar: "مضاء" };
const HIJRI: Record<Locale, string> = { en: "Hijri date", de: "Hijri-Datum", ar: "التاريخ الهجري" };

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const num = (n: number, l: Locale) => (l === "ar" ? String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]) : String(n));

/** Region of a disc of radius R lit at `illumination`; the unlit region is the mirror. */
function discRegion(R: number, illumination: number, rightSide: boolean): string {
  const rx = Math.max(0.001, R * Math.abs(1 - 2 * illumination));
  const outerSweep = rightSide ? 1 : 0;
  const termSweep = rightSide === illumination < 0.5 ? 0 : 1;
  return `M 0 ${-R} A ${R} ${R} 0 0 ${outerSweep} 0 ${R} A ${rx} ${R} 0 0 ${termSweep} 0 ${-R} Z`;
}

function MoonDisc({ illumination, waxing, size }: { illumination: number; waxing: boolean; size: number }) {
  const R = 50;
  const dark = discRegion(R, 1 - illumination, !waxing);
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} role="img" aria-label="moon">
      <circle r={R} fill="#e9e3d4" />
      <path d={dark} fill="#0b0f17" />
      <circle r={R - 0.5} fill="none" stroke="#d4a95f" strokeOpacity={0.35} strokeWidth={1} />
    </svg>
  );
}

export function YourMoon({ locale, phaseNames }: { locale: Locale; phaseNames: Record<MoonPhaseKey, string> }) {
  const [dateStr, setDateStr] = useState<string>("");
  useEffect(() => {
    // Client-only default: today, in the visitor's own timezone.
    setDateStr((prev) => prev || new Date().toISOString().slice(0, 10));
  }, []);

  const date = dateStr ? new Date(`${dateStr}T12:00:00`) : null;
  const phase = date ? moonPhaseAt(date) : null;
  const hijri = date ? gregorianToHijri(date, locale as "en" | "de" | "ar") : null;

  return (
    <figure className="lp-mymoon">
      <p className="lp-mymoon-label mono">{LABEL[locale]}</p>
      <div className="lp-mymoon-body">
        <div className="lp-mymoon-disc">
          {phase ? <MoonDisc illumination={phase.illumination} waxing={phase.phaseAngle < 180} size={180} /> : null}
        </div>
        <div className="lp-mymoon-facts">
          {phase ? (
            <>
              <p className="lp-mymoon-name">{phaseNames[phase.key]}</p>
              <p className="lp-mymoon-fact">
                {num(Math.round(phase.illumination * 100), locale)}% {ILLUM[locale]}
              </p>
              <p className="lp-mymoon-fact">
                {HIJRI[locale]}: {num(hijri!.day, locale)} {hijri!.monthName} {num(hijri!.year, locale)}
              </p>
            </>
          ) : (
            <p className="lp-mymoon-hint">{HINT[locale]}</p>
          )}
        </div>
      </div>
      <div className="lp-mymoon-pick">
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          aria-label={HINT[locale]}
          className="lp-mymoon-input"
        />
      </div>
    </figure>
  );
}
