"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
        <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={0.06} roughness={1} metalness={0} />
      </mesh>
    </>
  );
}

function Controls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.zoomSpeed = 0.6;
    controls.minDistance = 2.8;
    controls.maxDistance = 11;
    controls.rotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI / 2 - 0.6;
    controls.maxPolarAngle = Math.PI / 2 + 0.6;
    let raf: number;
    const tick = () => { controls.update(); raf = requestAnimationFrame(tick); };
    tick();
    return () => { cancelAnimationFrame(raf); controls.dispose(); };
  }, [camera, gl]);
  return null;
}

export function MoonView({
  locale,
  labels,
  phaseNames,
}: {
  locale: Locale;
  labels: MoonLabels;
  phaseNames: Record<string, string>;
}) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));

  const phase = moonPhaseAt(new Date());
  const events = nextMoonEvents(new Date());
  const illuminationPct = Math.round(phase.illumination * 100);
  const fmt = (v: number) => num(v.toFixed(1));

  return (
    <div className="border border-rule bg-surface">
      <div className="grid md:grid-cols-[1.3fr_1fr]">
        <div className="border-b border-rule md:border-b-0 md:border-e">
          <div className="h-[380px] w-full cursor-grab active:cursor-grabbing sm:h-[460px]">
            <Canvas camera={{ position: [5.1, 0.85, 1.5], fov: 34 }} dpr={[1, 1.75]}>
              <Suspense fallback={null}>
                <MoonBody elongationDeg={phase.phaseAngle} theme={theme} reduced={reduced} />
              </Suspense>
              <Controls />
            </Canvas>
          </div>
          <p className="mono border-t border-rule px-5 py-3 text-xs text-muted">{labels.hint}</p>
        </div>

        <div className="flex flex-col justify-center p-8">
          <dl className="space-y-3 text-base">
            <div className="flex justify-between gap-6">
              <dt className="text-muted">{labels.phase}</dt>
              <dd className="text-gold">{phaseNames[phase.key]}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-muted">{labels.illumination}</dt>
              <dd className="text-gold tabular-nums">{num(illuminationPct)}%</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-muted">{labels.age}</dt>
              <dd className="text-gold tabular-nums">
                {fmt(phase.ageDays)} {labels.days}
              </dd>
            </div>
            <div className="flex justify-between gap-6 border-t border-rule pt-3">
              <dt className="text-muted">{labels.nextNew}</dt>
              <dd className="tabular-nums text-ink">
                {fmt(events.nextNewMoon)} {labels.days}
              </dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-muted">{labels.nextFull}</dt>
              <dd className="tabular-nums text-ink">
                {fmt(events.nextFullMoon)} {labels.days}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
