"use client";

import { useEffect, useRef } from "react";
import { palette, useTheme } from "~/lib/use-theme";
import type { Locale } from "~/lib/i18n";

type HeroLabels = {
  name: string;
  meaning: string;
  cta: string;
  ctaSecondary: string;
};

/** Dezente Galaxie: wenige, langsam flimmernde Sterne in Gold, Grün und Ink. */
function HeroStars() {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const host = canvas.parentElement!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = palette[theme];
    let raf = 0;
    const stars: { x: number; y: number; r: number; speed: number; color: string }[] = [];

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = host.clientWidth * dpr;
      canvas!.height = host.clientHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      const count = Math.min(60, Math.floor((host.clientWidth * host.clientHeight) / 3200));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * host.clientWidth,
          y: Math.random() * host.clientHeight,
          r: Math.random() * 1.2 + 0.3,
          speed: Math.random() * 0.5 + 0.2,
          color:
            Math.random() < 0.25 ? c.gold : Math.random() < 0.12 ? c.green : c.ink,
        });
      }
    }

    function drawFrame(t: number) {
      ctx!.clearRect(0, 0, host.clientWidth, host.clientHeight);
      for (const s of stars) {
        ctx!.globalAlpha = reduced ? 0.55 : 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed));
        ctx!.fillStyle = s.color;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(drawFrame);
    }

    resize();
    drawFrame(0);
    const onResize = () => {
      resize();
      drawFrame(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}

type Bead = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  color: string;
};

/**
 * Sandspur: Perlen in Sandtönen, die der Cursor beim Überfahren der Bühne
 * verstreicht — sie laufen der Bewegung hinterher, sinken langsam wie Sand
 * und zerfallen. Canvas-Koordinaten sind physisch, wirkt also in LTR und
 * RTL identisch. Bei prefers-reduced-motion bleibt alles ruhig.
 */
function HeroSand() {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = canvas.parentElement!;
    const c = palette[theme];
    const sandColors = [c.gold, c.goldLight, c.goldDark];
    const beads: Bead[] = [];
    let raf = 0;
    let last: { x: number; y: number } | null = null;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = host.clientWidth * dpr;
      canvas!.height = host.clientHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;

      // Der Bewegungsvektor bestimmt, wohin die Spur "zurück" perlt.
      const mx = last ? x - last.x : 0;
      const my = last ? y - last.y : 0;
      last = { x, y };

      const speed = Math.hypot(mx, my);
      const n = Math.min(4, 1 + Math.floor(speed / 10));
      for (let i = 0; i < n; i++) {
        beads.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: -mx * 0.05 + (Math.random() - 0.5) * 0.7,
          vy: -my * 0.05 + (Math.random() - 0.5) * 0.7,
          life: 0,
          max: 500 + Math.random() * 400,
          r: 1 + Math.random() * 1.8,
          color: sandColors[Math.floor(Math.random() * sandColors.length)],
        });
      }
      if (beads.length > 140) beads.splice(0, beads.length - 140);
    };
    window.addEventListener("mousemove", onMove);

    let t0 = performance.now();
    function frame(t: number) {
      const dt = Math.min(50, t - t0);
      t0 = t;
      ctx!.clearRect(0, 0, host.clientWidth, host.clientHeight);
      for (let i = beads.length - 1; i >= 0; i--) {
        const b = beads[i];
        b.life += dt;
        if (b.life > b.max) {
          beads.splice(i, 1);
          continue;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.02; // sanftes Fallen — Sand, nicht Rauch
        b.vx *= 0.985;
        const k = 1 - b.life / b.max;
        ctx!.globalAlpha = 0.75 * k;
        ctx!.fillStyle = b.color;
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.r * (0.6 + 0.4 * k), 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}

export function Hero({
  locale,
  labels,
  ctaHref,
  ctaSecondaryHref,
}: {
  locale: Locale;
  labels: HeroLabels;
  ctaHref: string;
  ctaSecondaryHref: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Zweifache Maus-Reaktion: Das Logo neigt sich in 3D Richtung Cursor
  // (--rx/--ry), und ein weicher Goldschein folgt der Maus über der Bühne
  // (--gx/--gy in Prozent, physisch gemeint — der RTL-Spiegel passiert in
  // globals.css). Bei prefers-reduced-motion bleibt alles ruhig.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const nx = clamp(px * 2 - 1);
        const ny = clamp(py * 2 - 1);
        stage.style.setProperty("--ry", `${(nx * 6).toFixed(2)}deg`);
        stage.style.setProperty("--rx", `${(-ny * 6).toFixed(2)}deg`);
        stage.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        stage.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      stage.style.setProperty("--rx", "0deg");
      stage.style.setProperty("--ry", "0deg");
      stage.style.setProperty("--gx", "50%");
      stage.style.setProperty("--gy", "50%");
    };
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div>
      <div ref={stageRef} className="hero-stage relative">
        <HeroStars />
        <div aria-hidden className="hero-glow" />
        <div aria-hidden className="hero-mark">
          <div className="hero-tilt">
            <span className="brand-logo" />
          </div>
        </div>
        <HeroSand />
      </div>
      <h1 className="sr-only">{labels.name}</h1>
      <p className="rise mt-5 text-sm text-muted" style={{ animationDelay: "0.1s" }}>
        {labels.meaning}
      </p>
      <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.2s" }}>
        <a
          href={ctaHref}
          className="bg-accent px-6 py-3 text-paper transition hover:opacity-90"
        >
          {labels.cta}
        </a>
        <a
          href={ctaSecondaryHref}
          className="border border-rule px-6 py-3 transition hover:border-accent hover:text-accent"
        >
          {labels.ctaSecondary}
        </a>
      </div>
    </div>
  );
}
