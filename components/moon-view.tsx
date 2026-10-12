"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ZoomableControls, ZoomButtons, type ZoomApi, type ZoomLabels } from "~/components/cosmos-controls";
import { SceneStars } from "~/components/earth-moon-scene";
import { moonPhaseAt, nextMoonEvents } from "~/lib/moon-phase";
import { toArabicDigits } from "~/lib/prayer-times";
import { useTheme } from "~/lib/use-theme";
import { useReducedMotion } from "~/lib/use-reduced-motion";
import type { Locale } from "~/lib/i18n";

/**
 * Der Mond allein, gross: Die Beleuchtung entspricht exakt der realen
 * Elongation — Kamera steht in Erdrichtung, die Sonne rotiert um den Mond.
 * Neumond = dunkle Scheibe, Vollmond = voll leuchtend, alles dazwischen
 * aus der Geometrie. Zoom per Scroll/Pinch, Drehen per Ziehen.
 */

const MOON_R = 1.5;
const MOON_TEX = "/textures/2k_moon.jpg";

type MoonLabels = {
  phase: string;
  illumination: string;
  age: string;
  nextNew: string;
  nextFull: string;
  hint: string;
  days: string;
};

function MoonBody({ elongationDeg, theme, reduced }: { elongationDeg: number; theme: "light" | "dark"; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useLoader(THREE.TextureLoader, MOON_TEX);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
  }, [tex]);

  // Sonnenrichtung aus Mondsicht: Bei Neumond (Elongation 0°) steht die Sonne
  // hinter dem Mond (Kamera sieht die dunkle Seite), bei Vollmond (180°) hinter
  // der Kamera — die erdzugewandte Seite ist dann voll beleuchtet.
  const e = (elongationDeg * Math.PI) / 180;
  const sunPos: [number, number, number] = [-Math.cos(e) * 8, 0.6, Math.sin(e) * 8];

  useFrame((_, delta) => {
    if (!reduced && ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <>
      <directionalLight position={sunPos} intensity={2.3} color="#fff6e8" />
      <ambientLight intensity={theme === "light" ? 0.1 : 0.04} />
      <mesh ref={ref}>
        <sphereGeometry args={[MOON_R, 96, 96]} />
        <meshStandardMaterial
          map={tex}
          bumpMap={tex}
          bumpScale={0.06}
          roughness={1}
          metalness={0}
          // Erdschein wie in der Szene mit der Erde: die Nachtseite ist nie ganz schwarz.
          emissive="#7f93b4"
          emissiveMap={tex}
          emissiveIntensity={0.14}
        />
      </mesh>
    </>
  );
}

export function MoonView({
  locale,
  labels,
  phaseNames,
  zoomLabels,
}: {
  locale: Locale;
  labels: MoonLabels;
  phaseNames: Record<string, string>;
  zoomLabels: ZoomLabels;
}) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const apiRef = useRef<ZoomApi | null>(null);
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));

  const phase = moonPhaseAt(new Date());
  const events = nextMoonEvents(new Date());
  const illuminationPct = Math.round(phase.illumination * 100);
  const fmt = (v: number) => num(v.toFixed(1));

  const facts: [string, string, boolean][] = [
    [labels.phase, phaseNames[phase.key], true],
    [labels.illumination, `${num(illuminationPct)}%`, true],
    [labels.age, `${fmt(phase.ageDays)} ${labels.days}`, true],
    [labels.nextNew, `${fmt(events.nextNewMoon)} ${labels.days}`, false],
    [labels.nextFull, `${fmt(events.nextFullMoon)} ${labels.days}`, false],
  ];

  return (
    <div>
      <div className="relative">
        <div className="stage-fade h-[460px] w-full cursor-grab active:cursor-grabbing sm:h-[580px]">
          <Canvas camera={{ position: [5.1, 0.85, 1.5], fov: 34 }} dpr={[1, 1.75]}>
            <SceneStars />
            <Suspense fallback={null}>
              <MoonBody elongationDeg={phase.phaseAngle} theme={theme} reduced={reduced} />
            </Suspense>
            <ZoomableControls apiRef={apiRef} min={2.6} max={11} rotateSpeed={0.4} polarRange={0.6} />
          </Canvas>
        </div>
        <ZoomButtons
          labels={zoomLabels}
          onZoom={(f) => apiRef.current?.zoom(f)}
          onReset={() => apiRef.current?.reset()}
        />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-rule py-6 sm:grid-cols-5">
        {facts.map(([k, v, accent]) => (
          <div key={k}>
            <dt className="mono text-xs text-muted">{k}</dt>
            <dd className={`mt-1 text-xl font-light tabular-nums sm:text-2xl ${accent ? "text-gold" : "text-ink"}`}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mono mt-4 text-xs text-muted">{labels.hint}</p>
    </div>
  );
}
