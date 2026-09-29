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
 * Bewegung respektiert Reduced-Motion (dann steht alles still) und pausiert
 * zudem, solange der Zeiger die Szene bedient — die Oberflaeche wandert beim
 * Zielen nicht unter dem Cursor weg. Ein Klick direkt nach einer Ziehgeste
 * (inkl. Kamera-Nachlauf) zaehlt nie als Ortswahl, damit Drehen niemals
 * versehentlich einen Ort setzt.
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

// Echte Atmosphaere als Fresnel-Glow (BackSide, additiv): An der Kante des
// Planeten streift der Blick die Lufthuelle — dort leuchtet sie auf, zur
// Mitte hin blendet sie aus. Sieht nach Raum aus statt nach Folie.
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
    gl_FragColor = vec4(0.38, 0.62, 1.0, 1.0) * intensity;
  }
`;

function Earth({
  sunDir,
  nightBoost,
  onPick,
  pickedMarker,
  reduced,
}: {
  sunDir: [number, number, number];
  nightBoost: number;
  onPick: (p: Pick) => void;
  pickedMarker: Pick;
  reduced: boolean;
}) {
  const earthGroup = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  // Eigenbewegung pausiert, solange der Zeiger die Szene anfuehrt oder
  // zieht — sonst wandert die Oberflaeche beim Zielen unter dem Cursor weg.
  // Und: Zeitstempel der letzten Ziehgeste, damit ein Klick direkt danach
  // (inkl. Damping-Nachlauf) nie als Ortswahl zaehlt.
  const pausedRef = useRef(false);
  const lastGestureRef = useRef(0);
  const downPos = useRef<[number, number] | null>(null);
  const movedRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    const pause = () => {
      pausedRef.current = true;
      if (resumeTimer.current !== null) {
        clearTimeout(resumeTimer.current);
        resumeTimer.current = null;
      }
    };
    const scheduleResume = () => {
      if (resumeTimer.current !== null) clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        pausedRef.current = false;
        resumeTimer.current = null;
      }, 2500);
    };
    const onDown = (e: PointerEvent) => {
      downPos.current = [e.clientX, e.clientY];
      movedRef.current = false;
      pause();
    };
    const onMove = (e: PointerEvent) => {
      if (e.buttons === 0 || !downPos.current) return;
      const [x, y] = downPos.current;
      if (Math.hypot(e.clientX - x, e.clientY - y) > 6) {
        movedRef.current = true;
        lastGestureRef.current = performance.now();
        pause();
      }
    };
    const onUp = () => {
      // Nur das Loslassen einer echten Ziehgeste zaehlt als Geste — ein
      // reiner Klick (down/up ohne Weg) darf die Ortswahl nicht blockieren.
      if (movedRef.current) lastGestureRef.current = performance.now();
      downPos.current = null;
      scheduleResume();
    };
    const onLeave = () => scheduleResume();
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      if (resumeTimer.current !== null) clearTimeout(resumeTimer.current);
    };
  }, [gl]);

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

  // Echte Atmosphaere als Fresnel-Glow (BackSide, additiv): leuchtet nur an
  // der Planetenkante, wo der Blick die Lufthuelle streift.
  const atmoMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
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
    // Direkt nach einer Ziehgeste (inkl. Damping-Nachlauf der Kamera) ist ein
    // Klick fast immer das Loslassen der Geste, keine Ortswahl — ignorieren.
    if (performance.now() - lastGestureRef.current < 350) return;
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
    // Zurueckhaltende, aber deutlich sichtbare Eigendrehung — steht still bei
    // Reduced-Motion und waehrend der Zeiger die Szene bedient.
    const spinning = !reduced && !pausedRef.current;
    if (earthGroup.current && spinning) earthGroup.current.rotation.y += delta * 0.025;
    if (cloudsRef.current && spinning) cloudsRef.current.rotation.y += delta * 0.035;

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
      // Bei Reduced-Motion steht auch das still.
      const beat = reduced ? 0 : performance.now() * 0.005;
      const pulse = 0.7 + 0.3 * Math.sin(beat);
      markerMat.opacity = pulse;
      markerRef.current.scale.setScalar(1 + 0.15 * Math.sin(beat));
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
      {/* Atmosphaere als Fresnel-Glow — nur die Kante leuchtet */}
      <mesh material={atmoMaterial} scale={1.06}>
        <sphereGeometry args={[EARTH_R, 64, 64]} />
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
      {/* Fixsterne weit draussen — rotieren nicht mit, geben Parallaxe */}
      <SceneStars />
      <Earth sunDir={sunDir} nightBoost={nightBoost} onPick={onPick} pickedMarker={pickedMarker} reduced={reduced} />
      <Moon sunDir={sunDir} moonPhaseAngle={moonPhaseAngle} reduced={reduced} />
    </>
  );
}

/** Ruhiges Fixsternfeld als Kugelschale weit ausserhalb der Szene. */
function SceneStars() {
  const positions = useMemo(() => {
    const count = 900;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 24 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#cfe0ff"
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Setzt die Kameradistanz so, dass Erde UND Mond bei jeder Canvas-Groesse
 * vollstaendig sichtbar bleiben — berechnet aus dem tatsaechlichen
 * Seitenverhaeltnis, nicht aus einem geratenen Fixwert. Reagiert auf
 * Groessenaenderungen (Fenster/Viewport).
 */
/**
 * Setzt die Kameradistanz so, dass Erde UND Mond bei jeder Canvas-Groesse
 * vollstaendig sichtbar bleiben — berechnet aus dem tatsaechlichen
 * Seitenverhaeltnis, nicht aus einem geratenen Fixwert.
 *
 * Passt die Kamera nur beim ersten Einhängen und bei echten
 * Groessenaenderungen an (Schlüssel aus Breite x Höhe): Ein Re-Render des
 * Baums — z.B. nach einer Ortswahl — darf die vom Nutzer gedrehte Kamera
 * niemals auf die Startposition zuruecksetzen. (R3F reicht `size` als neues
 * Objekt durch, daher der Vergleich über primitive Werte statt Identität.)
 */
function FitCamera() {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const fitted = useRef<string | null>(null);
  useEffect(() => {
    const key = `${width}x${height}`;
    if (fitted.current === key) return;
    fitted.current = key;
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = width / height;
    const vFovRad = (cam.fov * Math.PI) / 180;
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

    // Margin (1.12x), damit die Koerper formatfuellend wirken, aber bei
    // jeder Canvas-Groesse vollstaendig im Bild bleiben
    const distForWidth = (SCENE_HALF_WIDTH * 1.12) / Math.tan(hFovRad / 2);
    const distForHeight = (SCENE_HALF_HEIGHT * 1.12) / Math.tan(vFovRad / 2);
    const dist = Math.max(distForWidth, distForHeight);

    camera.position.set(0, dist * 0.09, dist);
    camera.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, width, height]);
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

  // Memoized: Ein inline-Objekt bekäme bei jedem Re-Render (z.B. nach einer
  // Ortswahl) eine neue Identität — R3F würde die Kameraposition daraufhin
  // neu anwenden und die Ansicht auf die Startposition zurücksetzen, obwohl
  // der Nutzer gerade gedreht hat. So bleibt die Kamera, wo sie ist.
  const cameraSettings = useMemo(
    () => ({ position: [0, 1, 12] as [number, number, number], fov: 32 }),
    [],
  );

  return (
    <div ref={hostRef} className="h-[62vh] max-h-[720px] min-h-[440px] w-full cursor-grab active:cursor-grabbing">
      {visible && (
        // fov klein + Distanz gross: beide Koerper bleiben bei jeder Fensterbreite
        // vollstaendig im Bild; Zoom ist erlaubt, bleibt aber gekappt.
        <Canvas camera={cameraSettings} dpr={[1, 1.5]}>
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
