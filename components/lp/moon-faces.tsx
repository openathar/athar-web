"use client";

import { useEffect, useState } from "react";
import { moonPhaseAt } from "~/lib/moon-phase";
import { toArabicDigits } from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

const SYNODIC = 29.530588853;
const FACES = [
  ["new", 0],
  ["waxing-crescent", 0.125],
  ["first-quarter", 0.25],
  ["waxing-gibbous", 0.375],
  ["full", 0.5],
  ["waning-gibbous", 0.625],
  ["last-quarter", 0.75],
  ["waning-crescent", 0.875],
] as const;

const R = 40;

/** Unbeleuchteter Teil einer Phase als SVG-Pfad (evenodd: Kreis minus Licht). */
function shadowPath(fraction: number) {
  const th = 2 * Math.PI * fraction;
  const c = Math.cos(th);
  const rx = Math.abs(c) * R;
  const waxing = fraction <= 0.5;
  // Beleuchtete Seite: zunehmend rechts, abnehmend links.
  const side = waxing ? 1 : -1;
  const outer = `A ${R} ${R} 0 0 ${waxing ? 1 : 0} 0 ${R}`;
  // Terminator: zwischen Neu und Halb (c>0) wölbt er sich zur Lichtseite, danach zur Schattenseite.
  const bulgeToLit = c > 0;
  const sweep = (side === 1) === bulgeToLit ? 0 : 1;
  const lit = `M 0 ${-R} ${outer} A ${rx.toFixed(2)} ${R} 0 0 ${sweep} 0 ${-R} Z`;
  return `M 0 ${-R} A ${R} ${R} 0 1 1 0 ${R} A ${R} ${R} 0 1 1 0 ${-R} Z ${lit}`;
}

type Labels = { title: string; hint: string; inDays: string; today: string; days: string };

/**
 * Acht Gesichter eines Mondes — echte Oberflaeche (lokale Textur), Schatten
 * nach der Geometrie der Phase. Ein Klick sagt, wann die Phase wiederkommt.
 */
export function MoonFaces({
  locale,
  labels,
  phaseNames,
}: {
  locale: Locale;
  labels: Labels;
  phaseNames: Record<string, string>;
}) {
  const [fraction, setFraction] = useState<number | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const rtl = locale === "ar";
  const num = (v: string) => (rtl ? toArabicDigits(v) : v);

  useEffect(() => {
    const p = moonPhaseAt(new Date());
    setFraction(p.ageDays / SYNODIC);
  }, []);

  const current = fraction === null ? -1 : FACES.reduce((b, f, i) => {
    const d = (x: number) => Math.min(Math.abs(x - fraction), 1 - Math.abs(x - fraction));
    return d(f[1]) < d(FACES[b][1]) ? i : b;
  }, 0);
  const pick = sel ?? (current >= 0 ? current : null);

  let answer = "";
  if (pick !== null && fraction !== null) {
    const days = (((FACES[pick][1] - fraction) % 1) + 1) % 1 * SYNODIC;
    answer =
      pick === current || days < 0.5 ? labels.today : `${labels.inDays} ${num(days.toFixed(1))} ${labels.days}`;
  }

  return (
    <div className="lp-faces">
      <p className="lp-eyebrow mono">{labels.title}</p>
      <ul className="lp-faces-row">
        {FACES.map(([key, f], i) => (
          <li key={key}>
            <button
              type="button"
              aria-pressed={pick === i}
              onClick={() => setSel(i)}
              className={i === current ? "is-now" : undefined}
              title={phaseNames[key]}
            >
              <svg viewBox="-44 -44 88 88" aria-hidden focusable="false">
                <defs>
                  <clipPath id={`mf-${key}`}>
                    <circle r={R} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#mf-${key})`}>
                  <image href="/textures/2k_moon.jpg" x={-R} y={-R} width={R * 4} height={R * 2} preserveAspectRatio="none" />
                  <path d={shadowPath(f)} fillRule="evenodd" className="lp-face-shadow" />
                </g>
              </svg>
              <span>{phaseNames[key]}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="lp-faces-answer" aria-live="polite">
        {pick !== null && (
          <>
            <b>{phaseNames[FACES[pick][0]]}</b> {answer}
          </>
        )}
        <span className="mono">{labels.hint}</span>
      </p>
    </div>
  );
}
