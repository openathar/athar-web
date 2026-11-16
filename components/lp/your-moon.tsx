"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gregorianToHijri, moonPhaseAt, type MoonPhaseKey } from "@openathar/athan-core-ts";
import { MoonBody } from "~/components/moon-view";
import { SceneStars } from "~/components/earth-moon-scene";
import type { Locale } from "~/lib/i18n";

/**
 * "Dein Mond" — der echte, texturierte Mond (gleiche 3D-Szene wie der Hero,
 * NASA-/Solar-System-Scope-Textur, CC BY 4.0) für ein gewähltes Datum,
 * z.B. den Geburtstag. Beleuchtung = echte Elongation (moonPhaseAt).
 */

const LABEL: Record<Locale, string> = { en: "Your moon", de: "Dein Mond", ar: "قمرك" };
const HINT: Record<Locale, string> = {
  en: "Pick a date — the day you were born, or any day that matters.",
  de: "Wähle ein Datum — deinen Geburtstag oder jeden Tag, der zählt.",
  ar: "اختر تاريخًا — يوم ميلادك أو أي يوم يهمّك.",
};
const ILLUM: Record<Locale, string> = { en: "illuminated", de: "beleuchtet", ar: "مضاء" };
const HIJRI: Record<Locale, string> = { en: "Hijri date", de: "Hijri-Datum", ar: "التاريخ الهجري" };

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const num = (n: number, l: Locale) => (l === "ar" ? String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]) : String(n));

export function YourMoon({ locale, phaseNames }: { locale: Locale; phaseNames: Record<MoonPhaseKey, string> }) {
  const [dateStr, setDateStr] = useState<string>("");
  useEffect(() => {
    setDateStr((prev) => prev || new Date().toISOString().slice(0, 10));
  }, []);

  const date = dateStr ? new Date(`${dateStr}T12:00:00`) : null;
  const phase = date ? moonPhaseAt(date) : null;
  const hijri = date ? gregorianToHijri(date, locale as "en" | "de" | "ar") : null;

  return (
    <figure className="lp-mymoon">
      <p className="lp-mymoon-label mono">{LABEL[locale]}</p>

      {date && phase ? (
        <div className="lp-mymoon-scene">
          <Canvas camera={{ position: [4.6, 0.9, 1.4], fov: 34 }} dpr={[1, 1.75]}>
            <SceneStars />
            <Suspense fallback={null}>
              <MoonBody elongationDeg={phase.phaseAngle} theme="dark" reduced={false} />
            </Suspense>
          </Canvas>
        </div>
      ) : null}

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
