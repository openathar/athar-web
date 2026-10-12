"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { subsolarPoint } from "~/lib/noor-land";
import { CITIES, type CityKey } from "~/lib/cities";
import { nearestPlace, timezoneForCoords } from "~/lib/timezones";
import { toArabicDigits } from "~/lib/prayer-times";
import { palette, useTheme } from "~/lib/use-theme";
import { ZoomButtons, type ZoomLabels } from "~/components/cosmos-controls";
import { PrayerStrip, type CosmosPlace, type StripLabels } from "~/components/prayer-strip";
import type { Locale } from "~/lib/i18n";

type MapLabels = StripLabels & {
  useLocation: string;
  locating: string;
  denied: string;
  myLocation: string;
};

type View = { cx: number; cy: number; s: number };

const MIN_S = 1;
const MAX_S = 6;
const DAY_SRC = "/textures/2k_earth_daymap.jpg";
const NIGHT_SRC = "/textures/2k_earth_nightmap.jpg";

function useImage(src: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);
  return img;
}

/**
 * Weltkarte aus derselben NASA-Textur wie der Globus — nicht mehr aus
 * handgezeichneten Umrissen, deshalb haelt sie auch starkes Zoomen aus. Tag und
 * Nacht kommen aus demselben Sonnenstand wie am Globus (Terminator berechnet,
 * Staedtelichter aus der Nachtkarte), der gewaehlte Ort ist derselbe.
 *
 * Bedienung wie am Globus: Ziehen verschiebt, Doppelklick, Buttons und
 * Strg/⌘ + Scroll zoomen, ein normales Scrollrad scrollt die Seite.
 */
export function WorldMap({
  locale,
  labels,
  zoomLabels,
  place,
  onPlace,
}: {
  locale: Locale;
  labels: MapLabels;
  zoomLabels: ZoomLabels;
  place: CosmosPlace | null;
  onPlace: (p: CosmosPlace) => void;
}) {
  const rtl = locale === "ar";
  const theme = useTheme();
  const day = useImage(DAY_SRC);
  const night = useImage(NIGHT_SRC);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const view = useRef<View>({ cx: 0, cy: 20, s: MIN_S });
  const goal = useRef<View | null>(null);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const raf = useRef(0);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [tick, setTick] = useState(0);

  const clampView = useCallback((v: View): View => {
    const { w, h } = size.current;
    const s = Math.min(MAX_S, Math.max(MIN_S, v.s));
    if (!w) return { ...v, s };
    const ppd = (w / 360) * s;
    const halfLon = w / (2 * ppd);
    const halfLat = Math.min(90, h / (2 * ppd));
    return {
      s,
      cx: Math.min(180 - halfLon, Math.max(-180 + halfLon, v.cx)),
      cy: Math.min(90 - halfLat, Math.max(-90 + halfLat, v.cy)),
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const { w, h, dpr } = size.current;
    if (!canvas || !ctx || !w || !day) return;
    const c = palette[theme];
    const v = view.current;
    const ppd = (w / 360) * v.s;
    const halfLon = w / (2 * ppd);
    const halfLat = h / (2 * ppd);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const iw = day.naturalWidth;
    const ih = day.naturalHeight;
    const srcRect = [
      ((v.cx - halfLon + 180) / 360) * iw,
      ((90 - (v.cy + halfLat)) / 180) * ih,
      ((2 * halfLon) / 360) * iw,
      ((2 * halfLat) / 180) * ih,
    ] as const;
    ctx.drawImage(day, ...srcRect, 0, 0, w, h);

    const px = (lon: number) => w / 2 + (lon - v.cx) * ppd;
    const py = (lat: number) => h / 2 - (lat - v.cy) * ppd;

    // Terminator: tan(lat) = -cos(lon - lon_sub) / tan(lat_sub)
    const sun = subsolarPoint(new Date());
    const tanSub = Math.tan((Math.max(0.05, Math.abs(sun.lat)) * Math.PI) / 180) * Math.sign(sun.lat || 1);
    const nightAbove = sun.lat < 0; // Winter im Norden: Nacht nordwaerts der Kurve
    const nightPath = (shift: number) => {
      ctx.beginPath();
      const steps = 96;
      for (let i = 0; i <= steps; i++) {
        const lon = v.cx - halfLon + (2 * halfLon * i) / steps;
        const dLon = ((lon - sun.lon) * Math.PI) / 180;
        const lat = (Math.atan(-Math.cos(dLon) / tanSub) * 180) / Math.PI;
        const y = py(lat + (nightAbove ? -shift : shift));
        if (i === 0) ctx.moveTo(px(lon), y);
        else ctx.lineTo(px(lon), y);
      }
      const edge = nightAbove ? -20 : h + 20;
      ctx.lineTo(w + 20, edge);
      ctx.lineTo(-20, edge);
      ctx.closePath();
    };

    // Daemmerung: mehrere weiche Schichten uebereinander.
    const dark = theme === "light" ? "rgba(10,16,30," : "rgba(3,6,14,";
    const a = theme === "light" ? 0.12 : 0.17;
    for (const shift of [8, 4, 0, -4, -8]) {
      ctx.fillStyle = `${dark}${a})`;
      nightPath(shift);
      ctx.fill();
    }
    // Staedtelichter dort, wo es wirklich dunkel ist.
    if (night) {
      const nsrc = [
        ((v.cx - halfLon + 180) / 360) * night.naturalWidth,
        ((90 - (v.cy + halfLat)) / 180) * night.naturalHeight,
        ((2 * halfLon) / 360) * night.naturalWidth,
        ((2 * halfLat) / 180) * night.naturalHeight,
      ] as const;
      for (const [shift, alpha] of [[-3, 0.45], [-9, 0.55]] as const) {
        ctx.save();
        nightPath(shift);
        ctx.clip();
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = "lighten";
        ctx.drawImage(night, ...nsrc, 0, 0, w, h);
        ctx.restore();
      }
    }

    // Staedte
    ctx.font = "11px ui-monospace, monospace";
    ctx.textBaseline = "middle";
    (Object.keys(CITIES) as CityKey[]).forEach((key) => {
      const city = CITIES[key];
      const x = px(city.lon);
      const y = py(city.lat);
      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) return;
      ctx.fillStyle = c.gold;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (v.s >= 2.2) {
        ctx.fillStyle = "#f4efe2";
        ctx.globalAlpha = 0.92;
        ctx.textAlign = rtl ? "right" : "left";
        ctx.fillText(city.name[locale], x + (rtl ? -8 : 8), y);
      }
    });
    ctx.globalAlpha = 1;

    if (place) {
      const x = px(place.lon);
      const y = py(place.lat);
      const pulse = 9 + 3 * Math.sin(Date.now() / 450);
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = c.green;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [day, night, theme, place, locale, rtl]);

  // Animationsschleife: laeuft nur, solange ein Ziel angefahren wird, sonst
  // einmal pro Aenderung und fuer den Puls des Ortsrings alle 90 ms.
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      const g = goal.current;
      if (g) {
        const v = view.current;
        const k = 0.14;
        const next = clampView({
          cx: v.cx + (g.cx - v.cx) * k,
          cy: v.cy + (g.cy - v.cy) * k,
          s: v.s * Math.pow(g.s / v.s, k),
        });
        view.current = next;
        if (Math.abs(g.cx - next.cx) + Math.abs(g.cy - next.cy) < 0.02 && Math.abs(g.s - next.s) < 0.003) {
          view.current = clampView(g);
          goal.current = null;
        }
      }
      draw();
      raf.current = window.setTimeout(loop, goal.current ? 16 : 90);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(raf.current);
    };
  }, [draw, clampView, tick]);

  // Groesse: folgt dem Container (auch wenn der Tab erst spaeter sichtbar wird).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      if (!w) return;
      const h = Math.round(Math.min(w / 2, 620));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      size.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      view.current = clampView(view.current);
      setTick((t) => t + 1);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [clampView]);

  // Ortswechsel (auch vom Globus): Karte faehrt auf den Ort.
  useEffect(() => {
    if (!place) return;
    goal.current = { cx: place.lon, cy: place.lat, s: Math.max(2.4, view.current.s) };
    setTick((t) => t + 1);
  }, [place?.lat, place?.lon]); // eslint-disable-line react-hooks/exhaustive-deps

  function zoomBy(f: number) {
    const v = goal.current ?? view.current;
    goal.current = clampView({ cx: v.cx, cy: v.cy, s: v.s * f });
    setTick((t) => t + 1);
  }
  function resetView() {
    goal.current = place
      ? { cx: place.lon, cy: place.lat, s: 2.4 }
      : { cx: 0, cy: 20, s: MIN_S };
    setTick((t) => t + 1);
  }

  // ---- Zeigerbedienung ----
  const drag = useRef<{ x: number; y: number; moved: number; id: number } | null>(null);

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    goal.current = null;
    drag.current = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.x = e.clientX;
    d.y = e.clientY;
    d.moved += Math.abs(dx) + Math.abs(dy);
    const v = view.current;
    const ppd = (size.current.w / 360) * v.s;
    view.current = clampView({ ...v, cx: v.cx - dx / ppd, cy: v.cy + dy / ppd });
    draw();
  }
  function pointToCoords(e: { clientX: number; clientY: number }) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const v = view.current;
    const ppd = (size.current.w / 360) * v.s;
    return {
      lon: v.cx + (e.clientX - rect.left - size.current.w / 2) / ppd,
      lat: v.cy - (e.clientY - rect.top - size.current.h / 2) / ppd,
    };
  }
  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved > 5) return;
    const { lat, lon } = pointToCoords(e);
    const near = nearestPlace(lat, lon);
    const num = (v: number) => (rtl ? toArabicDigits(v.toFixed(1)) : v.toFixed(1));
    onPlace({
      label: near ? near.city : `${num(lat)}°, ${num(lon)}°`,
      lat,
      lon,
      zone: near ? timezoneForCoords(lat, lon) : undefined,
      current: false,
    });
  }
  function onDoubleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const { lat, lon } = pointToCoords(e);
    goal.current = clampView({ cx: lon, cy: lat, s: view.current.s * 1.9 });
    setTick((t) => t + 1);
  }

  // Strg/⌘ + Scroll zoomt, normales Scrollen bleibt der Seite.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomBy(e.deltaY > 0 ? 1 / 1.25 : 1.25);
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }); // zoomBy ist stabil genug: nutzt nur Refs und setTick

  const useMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError(true);
      return;
    }
    setLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPlace({
          label: labels.myLocation,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          current: true,
        });
        setLocating(false);
      },
      () => {
        setLocationError(true);
        setLocating(false);
      },
      { timeout: 8000 },
    );
  }, [labels.myLocation, onPlace]);

  return (
    <div>
      <div className="relative">
        <div ref={wrapRef} className="map-fade w-full">
          <canvas
            ref={canvasRef}
            className="block w-full cursor-grab touch-pan-y active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
            onDoubleClick={onDoubleClick}
          />
        </div>
        <ZoomButtons labels={zoomLabels} onZoom={zoomBy} onReset={resetView} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(CITIES) as CityKey[]).map((key) => {
          const city = CITIES[key];
          const active = place?.label === city.name[locale] && !place.current;
          return (
            <button
              key={key}
              onClick={() =>
                onPlace({ label: city.name[locale], lat: city.lat, lon: city.lon, zone: city.zone, current: false })
              }
              className={`mono rounded-full border px-3 py-1.5 text-xs transition ${
                active
                  ? "border-transparent bg-gold text-paper"
                  : "border-rule text-muted hover:border-gold hover:text-ink"
              }`}
            >
              {city.name[locale]}
            </button>
          );
        })}
        <button
          onClick={useMyLocation}
          className="mono flex items-center gap-1.5 rounded-full border border-accent/50 px-3 py-1.5 text-xs text-accent transition hover:bg-accent/10"
        >
          <span aria-hidden>◎</span>
          {locating ? labels.locating : labels.useLocation}
        </button>
      </div>
      {locationError && <p className="mt-2 text-xs text-gold">{labels.denied}</p>}

      <PrayerStrip place={place} locale={locale} labels={labels} />
    </div>
  );
}
