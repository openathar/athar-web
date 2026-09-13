"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Erde + Mond, immer vollstaendig im Bild, sehr zurueckhaltende Eigenbewegung.
 *
 * Echte Texturen (NASA-Daten, Solar System Scope, CC BY 4.0 — siehe
 * public/textures/README.md), lokal ausgeliefert: kein Fremd-Server erfaehrt
 * vom Besucher. Die Tag/Nacht-Grenze ist berechnet, nicht gemalt: Der
 * Sonnenstand kommt aus `lib/astro-earth.ts`, und die Erde ist beim Laden so
 * gedreht, dass der Sub-Sonnenpunkt wirklich in Richtung Sonne zeigt. Auf der
 * Nachtseite leuchten die Staedte aus der echten Nachtkarte.
 */

const EARTH_R = 1.3;
const MOON_R = EARTH_R / 3.67; // echtes Groessenverhaeltnis
const MOON_DIST = EARTH_R * 2.4; // kuenstlerisch verkuerzt (echt ~30 Erddurchmesser)
/*
 * EARTH_X so gewaehlt, dass die Bounding-Box beider Koerper (linkester bis
 * rechtester Punkt) exakt um den Ursprung zentriert ist. Ohne das schaut
 * die Kamera (fix auf (0,0,0) gerichtet) an der wahren Bildmitte vorbei,
 * und der Mond faellt aus dem Rahmen.
 *
 * leftmost = EARTH_X - EARTH_R
 * rightmost = EARTH_X + MOON_DIST + MOON_R
 * gefordert: leftmost = -rightmost  →  EARTH_X = (EARTH_R - MOON_DIST - MOON_R) / 2
 */
const EARTH_X = (EARTH_R - MOON_DIST - MOON_R) / 2;
const MOON_X = EARTH_X + MOON_DIST;
const SCENE_HALF_WIDTH = MOON_X + MOON_R; // == -(EARTH_X - EARTH_R), per Konstruktion
const SCENE_HALF_HEIGHT = EARTH_R;

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

    // Nachtseite: Staedtelichter aus der echten Nachtkarte, deutlich aufgehellt,
    // plus ein schwacher Anteil der Tagkarte — so bleiben Kontinente und
    // Ozeane in der Nacht erkennbar statt in Schwarz zu verschwinden.
    vec3 color = mix(night * 3.0 + day * 0.22, day, dayFactor);

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
  onPick,
  pickedMarker,
}: {
  sunDir: [number, number, number];
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
        },
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
      }),
    [day, night, specular],
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
    <group ref={earthGroup} position={[EARTH_X, 0, 0]}>
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

function Moon({ moonPhaseAngle }: { moonPhaseAngle: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const moonTex = useLoader(THREE.TextureLoader, TEX.moon);

  useEffect(() => {
    moonTex.colorSpace = THREE.SRGBColorSpace;
  }, [moonTex]);

  useFrame((_, delta) => {
    if (moonRef.current) moonRef.current.rotation.y += delta * 0.045;
  });

  const moonLightRad = (moonPhaseAngle * Math.PI) / 180;
  const moonLightPos: [number, number, number] = [
    Math.sin(moonLightRad) * 6,
    0.4,
    -Math.cos(moonLightRad) * 6,
  ];

  return (
    <>
      <mesh ref={moonRef} position={[MOON_X, 0, 0]}>
        <sphereGeometry args={[MOON_R, 64, 64]} />
        <meshStandardMaterial
          map={moonTex}
          bumpMap={moonTex}
          bumpScale={0.08}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <directionalLight position={moonLightPos} intensity={1.6} target-position={[MOON_X, 0, 0]} />
    </>
  );
}

function Scene({
  sunDir,
  moonPhaseAngle,
  onPick,
  pickedMarker,
}: {
  sunDir: [number, number, number];
  moonPhaseAngle: number;
  onPick: (p: Pick) => void;
  pickedMarker: Pick;
}) {
  return (
    <>
      <directionalLight position={[sunDir[0] * 12, sunDir[1] * 12, sunDir[2] * 12]} intensity={2.4} color="#fff6e8" />
      <ambientLight intensity={0.045} />
      <Earth sunDir={sunDir} onPick={onPick} pickedMarker={pickedMarker} />
      <Moon moonPhaseAngle={moonPhaseAngle} />
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
    controls.enableZoom = false;
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
}: {
  onPick: (p: Pick) => void;
  moonPhaseAngle: number;
  pickedMarker: Pick;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [sunDir, setSunDir] = useState<[number, number, number]>([1, 0.15, 0.3]);

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

  return (
    <div ref={hostRef} className="h-80 w-full cursor-grab active:cursor-grabbing sm:h-96">
      {visible && (
        // fov klein + Distanz gross: beide Koerper bleiben bei jeder Fensterbreite
        // vollstaendig im Bild, kein Zoom/Pan moeglich, das das aendern koennte.
        <Canvas camera={{ position: [0, 1, 10], fov: 32 }} dpr={[1, 1.5]}>
          <FitCamera />
          <Suspense fallback={null}>
            <Scene sunDir={sunDir} moonPhaseAngle={moonPhaseAngle} onPick={onPick} pickedMarker={pickedMarker} />
          </Suspense>
          <Controls />
        </Canvas>
      )}
    </div>
  );
}