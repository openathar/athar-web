"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { moonPhaseAt } from "~/lib/moon-phase";

/**
 * Erzeugt eine Mond-artige Oberflaechentextur zur Laufzeit auf einem Canvas —
 * kein externes Bild, kein Netzwerkzugriff. "Meere" (Maria) und Krater als
 * seedbasierte, deterministische Zufallsflecken, damit die Textur bei jedem
 * Laden gleich aussieht statt bei jedem Reload neu zu wuerfeln.
 */
function makeMoonTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#c9c4b8";
  ctx.fillRect(0, 0, w, h);

  // Deterministischer Pseudo-Zufall (mulberry32) statt Math.random(), damit
  // die Oberflaeche bei jedem Seitenaufruf identisch aussieht.
  let seed = 1337;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Maria — die dunklen Ebenen, groessere weiche Flecken
  for (let i = 0; i < 7; i++) {
    const x = rand() * w;
    const y = rand() * h * 0.8 + h * 0.1;
    const r = 60 + rand() * 90;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(90,88,82,0.55)");
    grad.addColorStop(1, "rgba(90,88,82,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Krater — kleinere, hellere Ringe
  for (let i = 0; i < 140; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 3 + rand() * 14;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(60,58,52,0.4)");
    grad.addColorStop(0.7, "rgba(210,206,196,0.35)");
    grad.addColorStop(1, "rgba(210,206,196,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Moon({ phaseAngleDeg }: { phaseAngleDeg: number }) {
  const texture = useMemo(() => makeMoonTexture(), []);
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Die Lichtquelle steht fest an dem Winkel, der die reale aktuelle Phase
  // ergibt. Wichtig ist das Vorzeichen der z-Komponente: bei Neumond
  // (phaseAngle=0) steht die Sonne hinter dem Mond relativ zur Kamera — die
  // erdzugewandte Seite ist dunkel. Bei Vollmond (phaseAngle=180) steht sie
  // auf derselben Seite wie die Kamera, die erdzugewandte Seite ist voll
  // beleuchtet. Ohne das Minuszeichen zeigt der Mond das Gegenteil seiner
  // tatsaechlichen Phase.
  const phaseRad = (phaseAngleDeg * Math.PI) / 180;
  const lightPos: [number, number, number] = [
    Math.sin(phaseRad) * 5,
    0.6,
    -Math.cos(phaseRad) * 5,
  ];

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
  });

  return (
    <>
      <directionalLight ref={lightRef} position={lightPos} intensity={2.4} />
      {/* Sehr schwaches Umgebungslicht, sonst ist die Nachtseite komplett schwarz
          statt nur dunkel — wie beim echten Erdschein. */}
      <ambientLight intensity={0.06} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>
    </>
  );
}

function Controls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2 - 0.6;
    controls.maxPolarAngle = Math.PI / 2 + 0.6;
    controls.rotateSpeed = 0.5;
    return () => controls.dispose();
  }, [camera, gl]);
  return null;
}

/**
 * 3D-Mond, zur aktuellen realen Phase beleuchtet. Ziehen dreht die Ansicht.
 *
 * Kein Modell-, Textur- oder API-Aufruf nach außen — Geometrie, Textur und
 * Beleuchtung entstehen vollständig im Browser.
 */
export function Moon3D({ phaseAngleDeg }: { phaseAngleDeg: number }) {
  return (
    <div className="h-72 w-full cursor-grab active:cursor-grabbing sm:h-80">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} dpr={[1, 1.5]}>
        <Moon phaseAngleDeg={phaseAngleDeg} />
        <Controls />
      </Canvas>
    </div>
  );
}

