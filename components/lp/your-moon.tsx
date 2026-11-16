"use client";

import { useEffect, useRef, useState } from "react";
import { gregorianToHijri, moonPhaseAt, type MoonPhaseKey } from "@openathar/athan-core-ts";
import type { Locale } from "~/lib/i18n";

/**
 * "Dein Mond" — der Mond eines gewählten Tages (z. B. Geburtstag), von der
 * Erde aus gesehen. Eigenes Rendering, bewusst NICHT die 3D-Szene des Heros:
 * eine vollständige Kugel (nichts wird abgeschnitten), echte NASA-LROC-
 * Farbkarte, Lommel-Seeliger-Shading (so streut Mondstaub wirklich: der
 * Vollmond ist flach, der Terminator scharf) und aschgraues Erdlicht auf der
 * Nachtseite. Beleuchtung aus der echten Phase (moonPhaseAt), Norden oben.
 */

const TEXTURE = "/textures/moon_lroc_2k.jpg";
const SIZE = 640; // Pixel der Zeichenfläche (CSS skaliert)

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

let texturePromise: Promise<ImageData> | null = null;
function loadTexture(): Promise<ImageData> {
  texturePromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, c.width, c.height));
    };
    img.onerror = reject;
    img.src = TEXTURE;
  });
  return texturePromise;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Zeichnet die Kugel; phaseAngle: 0° Neumond … 180° Vollmond (< 180 = zunehmend, rechts beleuchtet). */
function renderMoon(canvas: HTMLCanvasElement, tex: ImageData, phaseAngleDeg: number) {
  const N = SIZE;
  const ctx = canvas.getContext("2d")!;
  const out = ctx.createImageData(N, N);
  const a = (phaseAngleDeg * Math.PI) / 180;
  const sx = Math.sin(a);
  const sz = -Math.cos(a);
  const W = tex.width, H = tex.height, T = tex.data;
  const R = N / 2 - 6; // Rand lassen: nichts wird beschnitten

  for (let y = 0; y < N; y++) {
    const ny = ((N / 2 - (y + 0.5)) / R);
    for (let x = 0; x < N; x++) {
      const nx = ((x + 0.5) - N / 2) / R;
      const r2 = nx * nx + ny * ny;
      if (r2 > 1.04) continue;
      const r = Math.sqrt(r2);
      const edge = Math.min(1, Math.max(0, (1 - r) * R / 1.4)); // 1,4 px weicher Rand
      if (edge <= 0) continue;
      const cx = Math.min(1, r2) === r2 ? nx : nx / r;
      const cy = Math.min(1, r2) === r2 ? ny : ny / r;
      const nz = Math.sqrt(Math.max(0, 1 - cx * cx - cy * cy));

      const lat = Math.asin(cy);
      const lon = Math.atan2(cx, nz);
      let u = ((lon + Math.PI) / (2 * Math.PI)) * W - 0.5;
      let v = ((Math.PI / 2 - lat) / Math.PI) * H - 0.5;
      u = Math.min(W - 1.001, Math.max(0, u));
      v = Math.min(H - 1.001, Math.max(0, v));
      const x0 = Math.floor(u), y0 = Math.floor(v);
      const fx = u - x0, fy = v - y0;
      const i00 = (y0 * W + x0) * 4, i10 = i00 + 4, i01 = i00 + W * 4, i11 = i01 + 4;
      const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
      const tr = T[i00] * w00 + T[i10] * w10 + T[i01] * w01 + T[i11] * w11;
      const tg = T[i00 + 1] * w00 + T[i10 + 1] * w10 + T[i01 + 1] * w01 + T[i11 + 1] * w11;
      const tb = T[i00 + 2] * w00 + T[i10 + 2] * w10 + T[i01 + 2] * w01 + T[i11 + 2] * w11;

      const mu0 = cx * sx + nz * sz; // Einfallswinkel zur Sonne
      const mu = nz; // Blickwinkel zur Erde
      // Lommel-Seeliger: μ0 / (μ0 + μ); Terminator leicht geglättet
      const sun = mu0 > 0 ? (mu0 / (mu0 + mu + 1e-4)) * 2 * smooth(0, 0.1, mu0) : 0;
      const earthshine = 0.035;
      const g = sun * 1.05 + earthshine;
      const o = (y * N + x) * 4;
      out.data[o] = Math.min(255, tr * g * (sun > 0 ? 1 : 0.9));
      out.data[o + 1] = Math.min(255, tg * g * (sun > 0 ? 1 : 0.95));
      out.data[o + 2] = Math.min(255, tb * g + (sun > 0 ? 0 : 7));
      out.data[o + 3] = 255 * edge;
    }
  }
  ctx.putImageData(out, 0, 0);
}

export function YourMoon({ locale, phaseNames }: { locale: Locale; phaseNames: Record<MoonPhaseKey, string> }) {
  const [dateStr, setDateStr] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setDateStr((prev) => prev || new Date().toISOString().slice(0, 10));
  }, []);

  const date = dateStr ? new Date(`${dateStr}T12:00:00`) : null;
  const phase = date ? moonPhaseAt(date) : null;
  const hijri = date ? gregorianToHijri(date, locale as "en" | "de" | "ar") : null;
  const angle = phase?.phaseAngle ?? null;

  useEffect(() => {
    if (angle === null || !canvasRef.current) return;
    let cancelled = false;
    loadTexture().then((tex) => {
      if (!cancelled && canvasRef.current) renderMoon(canvasRef.current, tex, angle);
    });
    return () => {
      cancelled = true;
    };
  }, [angle]);

  return (
    <figure className="lp-mymoon">
      <p className="lp-mymoon-label mono">{LABEL[locale]}</p>

      <div className="lp-mymoon-scene">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} role="img" aria-label={phase ? phaseNames[phase.key] : LABEL[locale]} />
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
