"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SceneStars } from "~/components/earth-moon-scene";
import { moonPhaseAt, nextMoonEvents } from "~/lib/moon-phase";
import { gregorianToHijri } from "~/lib/hijri";
import { toArabicDigits } from "~/lib/prayer-times";
import { useReducedMotion } from "~/lib/use-reduced-motion";
import type { Locale } from "~/lib/i18n";

type Labels = {
  phase: string;
  illumination: string;
  age: string;
  nextNew: string;
  nextFull: string;
  days: string;
  hijri: string;
};

/**
 * Der Mond mit seiner echten Phase: Die Sonne steht dort, wo sie zur aktuellen
 * Elongation stehen muss, die Lichtgestalt ergibt sich aus der Geometrie.
 * Texturen lokal (siehe public/textures/README.md).
 */
function Moon({ elongationDeg, reduced }: { elongationDeg: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useLoader(THREE.TextureLoader, "/textures/2k_moon.jpg");
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
  }, [tex]);
  const e = (elongationDeg * Math.PI) / 180;
  const sun: [number, number, number] = [-Math.cos(e) * 8, 0.6, Math.sin(e) * 8];
  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <>
      <directionalLight position={sun} intensity={2.3} color="#fff6e8" />
      <ambientLight intensity={0.04} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 96, 96]} />
        <meshStandardMaterial
          map={tex}
          bumpMap={tex}
          bumpScale={0.06}
          roughness={1}
          metalness={0}
          emissive="#7f93b4"
          emissiveMap={tex}
          emissiveIntensity={0.14}
        />
      </mesh>
    </>
  );
}

export function MoonStage({
  locale,
  initialIso,
  labels,
  phaseNames,
  part = "both",
}: {
  part?: "canvas" | "facts" | "both";
  locale: Locale;
  initialIso: string;
  labels: Labels;
  phaseNames: Record<string, string>;
}) {
  const reduced = useReducedMotion();
  const [date, setDate] = useState(() => new Date(initialIso));
  useEffect(() => {
    setDate(new Date());
    const id = setInterval(() => setDate(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));
  const phase = moonPhaseAt(date);
  const ev = nextMoonEvents(date);
  const h = gregorianToHijri(date, locale);
  const d1 = (v: number) => num(v.toFixed(1));

  const facts: [string, string][] = [
    [labels.phase, phaseNames[phase.key]],
    [labels.illumination, `${num(Math.round(phase.illumination * 100))}%`],
    [labels.age, `${d1(phase.ageDays)} ${labels.days}`],
    [labels.nextFull, `${d1(ev.nextFullMoon)} ${labels.days}`],
    [labels.nextNew, `${d1(ev.nextNewMoon)} ${labels.days}`],
  ];

  return (
    <>
      {part !== "facts" && (
      <div className="lp-moon" role="img" aria-label={`${phaseNames[phase.key]}, ${Math.round(phase.illumination * 100)}%`}>
        <Canvas camera={{ position: [5.8, 1, 1.75], fov: 34 }} dpr={[1, 1.75]} gl={{ alpha: true }}>
          <SceneStars />
          <Suspense fallback={null}>
            <Moon elongationDeg={phase.phaseAngle} reduced={reduced} />
          </Suspense>
        </Canvas>
      </div>
      )}
      {part !== "canvas" && (
      <dl className="lp-facts">
        <div className="lp-facts-hijri">
          <dt>{labels.hijri}</dt>
          <dd>
            {num(h.day)} {h.monthName} {num(h.year)}
          </dd>
        </div>
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      )}
    </>
  );
}
