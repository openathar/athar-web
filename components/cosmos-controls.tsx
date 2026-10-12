"use client";

import { useEffect, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** Programmatischer Zugriff auf den Zoom — fuer die Buttons neben der Szene. */
export type ZoomApi = { zoom: (factor: number) => void; reset: () => void };

export type ZoomLabels = {
  zoomIn: string;
  zoomOut: string;
  zoomReset: string;
  zoomHint: string;
};

/**
 * Orbit-Steuerung fuer Globus und Mond — gleiche Regeln in beiden Ansichten,
 * damit sie sich gleich anfuehlen:
 *
 *  - Ziehen dreht, Zwei-Finger-Pinch und Strg/⌘ + Scroll zoomen. Ein normales
 *    Scrollrad zoomt NICHT: Sonst blieb man beim Herunterscrollen der Seite im
 *    Globus haengen. Senkrechtes Wischen auf dem Handy scrollt die Seite.
 *  - Die Buttons (apiRef) fahren weich auf die Zielposition.
 *  - Zuruecksetzen faehrt zur Startansicht, die die Szene in homeRef ablegt.
 */
export function ZoomableControls({
  apiRef,
  homeRef,
  min,
  max,
  rotateSpeed = 0.35,
  polarRange = 0.35,
}: {
  apiRef: MutableRefObject<ZoomApi | null>;
  homeRef?: MutableRefObject<THREE.Vector3 | null>;
  min: number;
  max: number;
  rotateSpeed?: number;
  polarRange?: number;
}) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.zoomSpeed = 0.7;
    controls.minDistance = min;
    controls.maxDistance = max;
    controls.rotateSpeed = rotateSpeed;
    controls.minPolarAngle = Math.PI / 2 - polarRange;
    controls.maxPolarAngle = Math.PI / 2 + polarRange;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    // Nach dem Konstruktor: OrbitControls setzt touch-action selbst auf none.
    gl.domElement.style.touchAction = "pan-y";

    const initial = camera.position.clone();
    let goal: THREE.Vector3 | null = null;

    apiRef.current = {
      zoom(factor) {
        const base = (goal ?? camera.position).clone();
        base.setLength(THREE.MathUtils.clamp(base.length() * factor, min, max));
        goal = base;
      },
      reset() {
        goal = (homeRef?.current ?? initial).clone();
      },
    };

    const host = gl.domElement.parentElement;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
      else goal = null;
    };
    host?.addEventListener("wheel", onWheel, { capture: true });
    const onDown = () => {
      goal = null;
    };
    gl.domElement.addEventListener("pointerdown", onDown);

    let raf = 0;
    const tick = () => {
      if (goal) {
        camera.position.lerp(goal, 0.1);
        if (camera.position.distanceTo(goal) < 0.002) {
          camera.position.copy(goal);
          goal = null;
        }
      }
      controls.update();
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      host?.removeEventListener("wheel", onWheel, { capture: true });
      gl.domElement.removeEventListener("pointerdown", onDown);
      apiRef.current = null;
      controls.dispose();
    };
  }, [camera, gl, apiRef, homeRef, min, max, rotateSpeed, polarRange]);

  return null;
}

/** + / − / Zuruecksetzen, unten am Rand der Buehne. */
export function ZoomButtons({
  labels,
  onZoom,
  onReset,
}: {
  labels: ZoomLabels;
  onZoom: (factor: number) => void;
  onReset: () => void;
}) {
  const btn =
    "mono flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper/70 text-lg leading-none text-ink backdrop-blur transition hover:border-accent hover:text-accent";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-end justify-between gap-4 px-2">
      <p className="mono max-w-[16rem] text-[11px] leading-snug text-muted">
        {labels.zoomHint}
      </p>
      <div className="pointer-events-auto flex gap-2" dir="ltr">
        <button type="button" className={btn} onClick={() => onZoom(1 / 1.45)} aria-label={labels.zoomIn}>
          +
        </button>
        <button type="button" className={btn} onClick={() => onZoom(1.45)} aria-label={labels.zoomOut}>
          −
        </button>
        <button type="button" className={btn} onClick={onReset} aria-label={labels.zoomReset}>
          ⟲
        </button>
      </div>
    </div>
  );
}
