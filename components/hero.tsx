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

/**
 * Ruhiger Hero: Sternenhimmel (Canvas) + sanft schwebendes Logo. Keine
 * mausreaktiven Ebenen mehr — Tilt, Glow und Sandspur waren zu viel und
 * wirkten unruhig; weggenommen statt geglättet.
 */
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
  return (
    <div>
      <div className="hero-stage relative">
        <HeroStars />
        <div aria-hidden className="hero-mark">
          <span className="brand-logo" />
        </div>
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
