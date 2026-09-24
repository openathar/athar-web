"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CITIES } from "~/lib/cities";
import { useReducedMotion } from "~/lib/use-reduced-motion";

/**
 * Erde + Mond, immer vollstaendig im Bild, sehr zurueckhaltende Eigenbewegung.
 *
 * Echte Texturen (NASA-Daten, Solar System Scope, CC BY 4.0 — siehe
 * public/textures/README.md), lokal ausgeliefert: kein Fremd-Server erfaehrt
 * vom Besucher. Die Tag/Nacht-Grenze ist berechnet, nicht gemalt: Der
 * Sonnenstand kommt aus `lib/astro-earth.ts`, und die Erde ist beim Laden so
 * gedreht, dass der Sub-Sonnenpunkt wirklich in Richtung Sonne zeigt. Auf der
 * Nachtseite leuchten die Staedte aus der echten Nachtkarte.
 *
 * Der Mond ist physisch ehrlich: Er wird von derselben Sonne beleuchtet wie
 * die Erde und startet auf seiner Umlaufbahn beim realen Elongationswinkel
 * der aktuellen Phase. Die sichtbare Lichtgestalt ergibt sich dadurch aus
 * der Geometrie — nicht aus einem gemalten Schein.
 */

const EARTH_R = 1.3;
const MOON_R = EARTH_R / 3.67; // echtes Groessenverhaeltnis
const MOON_DIST = EARTH_R * 2.4; // kuenstlerisch verkuerzt (echt ~30 Erddurchmesser)
// Orbit-Ebene um ~30° gegen die Kamera gekippt: Der Mond rutscht am hinteren
// Bahnpunkt sichtbar ueber den Erdrand, statt sich zu verdecken — wie eine
// schraege Sicht auf die Ekliptik.
const ORBIT_TILT = (30 * Math.PI) / 180;
// Ein Umlauf in ~4 Minuten — stark beschleunigt, aber die echte Richtung.
const ORBIT_RATE = (Math.PI * 2) / 240;

const SCENE_HALF_WIDTH = MOON_DIST + MOON_R;
const SCENE_HALF_HEIGHT = Math.max(EARTH_R, MOON_DIST * Math.sin(ORBIT_TILT) + MOON_R);

const TEX = {
  earthDay: "/textures/2k_earth_daymap.jpg",
  earthNight: "/textures/2k_earth_nightmap.jpg",
  earthClouds: "/textures/2k_earth_clouds.jpg",
  earthSpecular: "/textures/earth_specular_2048.jpg",
  moon: "/textures/2k_moon.jpg",
};

type Pick = { lat: number; lon: number } | null;

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uSpecular;
  uniform vec3 uSunDir;
  uniform float uNightBoost;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 sun = normalize(uSunDir);
    float d = dot(n, sun);

    vec3 day = texture2D(uDay, vUv).rgb;
    vec3 night = texture2D(uNight, vUv).rgb;

    // Weiche Daemmerung ueber den Terminator (Sonnenhoehe ~ -12° bis +20°).
    float dayFactor = smoothstep(-0.15, 0.25, d);

    // Nachtseite: Staedtelichter aus der echten Nachtkarte, aufgehellt — der
    // Boost folgt der Helligkeit der Webseite (hellles Theme = lesbare Nacht).
    vec3 color = mix(night * uNightBoost + day * 0.22, day, dayFactor);

    // Ozean-Glanz nur auf der Tagseite (specular map = Meere).
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 halfDir = normalize(sun + viewDir);
    float spec = texture2D(uSpecular, vUv).r;
    float specular = spec * pow(max(dot(n, halfDir), 0.0), 24.0) * dayFactor;
    color += vec3(1.0, 0.97, 0.88) * specular * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Earth({
  sunDir,
  nightBoost,
  onPick,
  pickedMarker,
}: {
  sunDir: [number, number, number];
  nightBoost: number;
  onPick: (p: Pick) => void;
  pickedMarker: Pick;
}) {
  const earthGroup = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);

  const [day, night, clouds, specular] = useLoader(THREE.TextureLoader, [
    TEX.earthDay,
    TEX.earthNight,
    TEX.earthClouds,
    TEX.earthSpecular,
  ]);

  useEffect(() => {
    for (const t of [day, night, clouds, specular]) t.colorSpace = THREE.SRGBColorSpace;
  }, [day, night, clouds, specular]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uDay: { value: day },
          uNight: { value: night },
          uSpecular: { value: specular },
          uSunDir: { value: new THREE.Vector3(...sunDir) },
          uNightBoost: { value: nightBoost },
        },
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
      }),
    [day, night, specular],
  );

  useEffect(() => {
    material.uniforms.uNightBoost.value = nightBoost;
  }, [material, nightBoost]);

  // Gemeinsames Material fuer den Markierungs-Punkt und seinen Ring — so
  // pulsiert beides im selben Takt (eine Opacity fuer beide Meshes).
  const markerMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#d4a95f",
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uSunDir.value.set(sunDir[0], sunDir[1], sunDir[2]);
  }, [material, sunDir]);

  // Beim Laden so drehen, dass der Sub-Sonnenpunkt in Richtung Sonne zeigt —
  // die Tag/Nacht-Grenze liegt damit geografisch richtig auf den Kontinenten.
  useEffect(() => {
    if (!earthGroup.current) return;
    const local = new THREE.Vector3(sunDir[0], sunDir[1], -sunDir[2]);
    const target = new THREE.Vector3(sunDir[0], sunDir[1], sunDir[2]);
    const a = Math.atan2(local.z, local.x);
    const b = Math.atan2(target.z, target.x);
    earthGroup.current.rotation.y = a - b;
  }, [sunDir]);

  function onEarthClick(e: any) {
    e.stopPropagation();
    if (!e.point || !earthGroup.current) return;
    // Zieh-Gesten (Drehen der Kamera) enden mit einem Klick-Event — erst ab
    // einer deutlichen Bewegung wird daraus ein echter Klick, sonst waehlt jede
    // Drehbewegung versehentlich einen Punkt aus. Echte Mausklicks bewegen
    // sich beim Druecken/Loslassen um ein paar Pixel — 20px trennt Klick von
    // bewusstem Ziehen.
    if (e.delta > 20) return;
    const local = earthGroup.current.worldToLocal(e.point.clone()).normalize();
    const lat = Math.asin(local.y) * (180 / Math.PI);
    const lon = Math.atan2(-local.z, local.x) * (180 / Math.PI);
    onPick({ lat: Math.round(lat * 10) / 10, lon: Math.round(lon * 10) / 10 });
  }

  useFrame((_, delta) => {
    // Zurueckhaltende, aber deutlich sichtbare Eigendrehung.
    if (earthGroup.current) earthGroup.current.rotation.y += delta * 0.025;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.035;

    if (markerRef.current && pickedMarker && earthGroup.current) {
      const lat = (pickedMarker.lat * Math.PI) / 180;
      const lon = (pickedMarker.lon * Math.PI) / 180;
      const r = EARTH_R * 1.01;
      const local = new THREE.Vector3(
        r * Math.cos(lat) * Math.cos(lon),
        r * Math.sin(lat),
        -r * Math.cos(lat) * Math.sin(lon),
      );
      // Marker ist Kind von earthGroup → Position in dessen lokalem
      // Koordinatensystem (nicht worldToLocal — das wuerde doppelt
      // transformieren und den Punkt aus dem Bild werfen).
      markerRef.current.position.copy(local);
      // Ring tangential zur Oberflaeche ausrichten (lokale +Z = Normale).
      markerRef.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        local.clone().normalize(),
      );
      // Pulsieren: Punkt und Ring atmen gemeinsam in Groesse und Deckkraft —
      // zurueckhaltend, damit der Punkt sichtbar bleibt, ohne zu dominieren.
      const pulse = 0.7 + 0.3 * Math.sin(performance.now() * 0.005);
      markerMat.opacity = pulse;
      markerRef.current.scale.setScalar(1 + 0.15 * Math.sin(performance.now() * 0.005));
      markerRef.current.visible = true;
    } else if (markerRef.current) {
      markerRef.current.visible = false;
    }
  });

  return (
    <group ref={earthGroup} position={[0, 0, 0]}>
      <mesh material={material} onClick={onEarthClick}>
        <sphereGeometry args={[EARTH_R, 96, 96]} />
      </mesh>
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[EARTH_R, 64, 64]} />
        <meshStandardMaterial
          map={clouds}
          alphaMap={clouds}
          transparent
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Atmosphaerischer Rand — Fresnel-artiges Glimmen an der Tagseite */}
      <mesh scale={1.045}>
        <sphereGeometry args={[EARTH_R, 64, 64]} />
        <meshBasicMaterial
          color="#6fb2ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Schwebende Stadt-Marker — kleine goldene Punkte, die sanft ueber
          der Oberflaeche schweben und mit der Erde mitrotieren. */}
      <FloatingCities />

      {/* Markierung fuer den gewaehlten Ort — minimaler pulsierender Punkt */}
      <group ref={markerRef} visible={false}>
        <mesh material={markerMat}>
          <sphereGeometry args={[0.018, 12, 12]} />
        </mesh>
        <mesh material={markerMat}>
          <ringGeometry args={[0.04, 0.05, 32]} />
        </mesh>
      </group>
    </group>
  );
}

/** Die zehn Städte als schwebende goldene Punkte — jede mit eigenem Takt,
 *  alle in Erdkoordinaten (rotieren mit der Erde mit). */
function FloatingCities() {
  const group = useRef<THREE.Group>(null);
  const cityMeshes = useMemo(
    () =>
      Object.values(CITIES).map(({ lat, lon }) => {
        const la = (lat * Math.PI) / 180;
        const lo = (lon * Math.PI) / 180;
        const r = EARTH_R * 1.012;
        return new THREE.Vector3(
          r * Math.cos(la) * Math.cos(lo),
          r * Math.sin(la),
          -r * Math.cos(la) * Math.sin(lo),
        );
      }),
    [],
  );

  useFrame(() => {
    if (!group.current) return;
    const t = performance.now() * 0.0012;
    group.current.children.forEach((child, i) => {
      // Radiales Atmen um die Basisposition — jede Stadt in eigenem Takt.
      const bob = 1 + 0.012 * (0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.7));
      child.position.copy(cityMeshes[i]).multiplyScalar(bob);
    });
  });

  return (
    <group ref={group}>
      {cityMeshes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#d4a95f" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Mond auf schraeger Umlaufbahn. Startwinkel = reale Elongation der aktuellen
 * Phase (0° = Neumond in Sonnenrichtung, 180° = Vollmond opposite der Sonne).
 * Beleuchtung kommt von derselben Sonnenlichtquelle wie die Erde — die
 * sichtbare Phase ist Geometrie, kein Effekt.
 */
function Moon({
  sunDir,
  moonPhaseAngle,
  reduced,
}: {
  sunDir: [number, number, number];
  moonPhaseAngle: number;
  reduced: boolean;
}) {
  const spinRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const moonTex = useLoader(THREE.TextureLoader, TEX.moon);

  useEffect(() => {
    moonTex.colorSpace = THREE.SRGBColorSpace;
  }, [moonTex]);

  // Startwinkel: Winkel der Sonnenrichtung in der Orbit-Ebene + Elongation.
  const startAngle = useMemo(() => {
    const sunAngle = Math.atan2(-sunDir[2], sunDir[0]);
    return sunAngle + (moonPhaseAngle * Math.PI) / 180;
    // Nur der Startwert soll festgehalten werden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const angleRef = useRef(startAngle);

  useFrame((_, delta) => {
    if (!reduced) angleRef.current += delta * ORBIT_RATE;
    if (spinRef.current) spinRef.current.rotation.y = angleRef.current;
    if (moonRef.current && !reduced) moonRef.current.rotation.y += delta * 0.045;
  });

  return (
    <group rotation-x={-ORBIT_TILT}>
      {/* Bahmlinie — duenner goldener Kreis, macht die Ebene lesbar */}
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 128 }, (_, i) => {
                  const a = (i / 128) * Math.PI * 2;
                  return [Math.cos(a) * MOON_DIST, 0, -Math.sin(a) * MOON_DIST];
                }).flat(),
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#d4a95f" transparent opacity={0.16} />
      </lineLoop>
      <group ref={spinRef}>
        <mesh ref={moonRef} position={[MOON_DIST, 0, 0]}>
          <sphereGeometry args={[MOON_R, 64, 64]} />
          <meshStandardMaterial
            map={moonTex}
            bumpMap={moonTex}
            bumpScale={0.08}
            roughness={1}
            metalness={0}
          />
        </mesh>
      </group>
    </group>
  );
}

function Scene({
  sunDir,
  moonPhaseAngle,
  nightBoost,
  ambient,
  reduced,
  onPick,
  pickedMarker,
}: {
  sunDir: [number, number, number];
  moonPhaseAngle: number;
  nightBoost: number;
  ambient: number;
  reduced: boolean;
  onPick: (p: Pick) => void;
  pickedMarker: Pick;
}) {
  return (
    <>
      {/* Eine Sonne fuer beide Koerper — deshalb stimmt die Mondphase. */}
      <directionalLight position={[sunDir[0] * 12, sunDir[1] * 12, sunDir[2] * 12]} intensity={2.4} color="#fff6e8" />
      <ambientLight intensity={ambient} />
      <Earth sunDir={sunDir} nightBoost={nightBoost} onPick={onPick} pickedMarker={pickedMarker} />
      <Moon sunDir={sunDir} moonPhaseAngle={moonPhaseAngle} reduced={reduced} />
    </>
  );
}

/**
 * Setzt die Kameradistanz so, dass Erde UND Mond bei jeder Canvas-Groesse
 * vollstaendig sichtbar bleiben — berechnet aus dem tatsaechlichen
 * Seitenverhaeltnis, nicht aus einem geratenen Fixwert. Reagiert auf
 * Groessenaenderungen (Fenster/Viewport).
 */
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const vFovRad = (cam.fov * Math.PI) / 180;
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

    // Margin (1.25x), damit die Koerper nicht am Rand kleben
    const distForWidth = (SCENE_HALF_WIDTH * 1.25) / Math.tan(hFovRad / 2);
    const distForHeight = (SCENE_HALF_HEIGHT * 1.25) / Math.tan(vFovRad / 2);
    const dist = Math.max(distForWidth, distForHeight);

    camera.position.set(0, dist * 0.09, dist);
    camera.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Controls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    // Zoom erlaubt (Scroll/Pinch) — enger ran an den Globus oder weiter weg,
    // mit kuenstlichem Deckel, damit nichts im Nichts oder im Erdinneren landet.
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    controls.minDistance = 3.6;
    controls.maxDistance = 26;
    controls.enablePan = false;
    controls.rotateSpeed = 0.35;
    controls.minPolarAngle = Math.PI / 2 - 0.35;
    controls.maxPolarAngle = Math.PI / 2 + 0.35;
    // Federt sanft zurueck statt abrupt stehenzubleiben
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    let raf: number;
    const tick = () => { controls.update(); raf = requestAnimationFrame(tick); };
    tick();
    return () => { cancelAnimationFrame(raf); controls.dispose(); };
  }, [camera, gl]);
  return null;
}

export function EarthMoonScene({
  onPick,
  moonPhaseAngle,
  pickedMarker,
  theme,
}: {
  onPick: (p: Pick) => void;
  moonPhaseAngle: number;
  pickedMarker: Pick;
  theme: "light" | "dark";
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [sunDir, setSunDir] = useState<[number, number, number]>([1, 0.15, 0.3]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!hostRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    obs.observe(hostRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    import("~/lib/astro-earth").then(({ sunlightDirection }) => {
      if (!cancelled) setSunDir(sunlightDirection(new Date()));
    });
    return () => { cancelled = true; };
  }, [visible]);

  // Beleuchtung in Proportion zur Webseite: helles Theme = hellere Nachtseite
  // und mehr Umgebungslicht, dunkles Theme = dramatische Kontraste.
  const nightBoost = theme === "light" ? 4.6 : 3.0;
  const ambient = theme === "light" ? 0.12 : 0.05;

  return (
    <div ref={hostRef} className="h-80 w-full cursor-grab active:cursor-grabbing sm:h-96">
      {visible && (
        // fov klein + Distanz gross: beide Koerper bleiben bei jeder Fensterbreite
        // vollstaendig im Bild; Zoom ist erlaubt, bleibt aber gekappt.
        <Canvas camera={{ position: [0, 1, 12], fov: 32 }} dpr={[1, 1.5]}>
          <FitCamera />
          <Suspense fallback={null}>
            <Scene
              sunDir={sunDir}
              moonPhaseAngle={moonPhaseAngle}
              nightBoost={nightBoost}
              ambient={ambient}
              reduced={reduced}
              onPick={onPick}
              pickedMarker={pickedMarker}
            />
          </Suspense>
          <Controls />
        </Canvas>
      )}
    </div>
  );
}
