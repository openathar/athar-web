"use client";

import { useEffect, useRef } from "react";
import { Mark } from "~/components/mark";
import { palette, useTheme } from "~/lib/use-theme";
import type { Locale } from "~/lib/i18n";

// `fontVariationSettings` fehlt im TS-DOM-Typ, existiert aber in allen
// unterstützten Browsern (Chrome 99+, Safari 16.4+, Firefox 105+).
type CanvasWithVariation = CanvasRenderingContext2D & { fontVariationSettings: string };
const setVariation = (ctx: CanvasRenderingContext2D, value: string) => {
  (ctx as CanvasWithVariation).fontVariationSettings = value;
};

type HeroLabels = {
  name: string;
  meaning: string;
  cta: string;
  ctaSecondary: string;
};

/**
 * Hero-Wortzeichen: das arabische أثر als Canvas-Malerei statt CSS-Text.
 *
 * Hintergrund: `background-clip: text` verhält sich browser- und font-abhängig
 * unterschiedlich (Ligaturen, Diakritika, das ر wurde beim reinen CSS-Ansatz
 * mehrfach abgeschnitten). Auf dem Canvas malen wir den Text einmal mit echten
 * Pixeln — Gradient und Leuchten sind dort exakt steuerbar.
 *
 * Gold trifft Grün: der Schein mischt beide Akzentfarben, der Verlauf läuft
 * von hellem Gold über Gold zu Oliv.
 */
function WordmarkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelled = false;
    const c = palette[theme];

    async function paint() {
      // Auf die tatsächlich geladene Amiri-Quran-Schrift warten, sonst malt
      // der erste Frame mit der Systemschrift und wirkt schmal/falsch.
      try {
        await document.fonts.ready;
      } catch {
        // ignorieren — im schlimmsten Fall malt der Fallback-Font
      }
      if (cancelled) return;

      const host = canvas!.parentElement!;
      const cssWidth = host.clientWidth;
      const cssHeight = host.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = cssWidth * dpr;
      canvas!.height = cssHeight * dpr;
      canvas!.style.width = `${cssWidth}px`;
      canvas!.style.height = `${cssHeight}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, cssWidth, cssHeight);

      const quranFace =
        getComputedStyle(document.documentElement).getPropertyValue("--font-quran-face") ||
        "serif";
      const serifFace =
        getComputedStyle(document.documentElement).getPropertyValue("--font-serif") || "serif";
      let fontSize = Math.min(cssWidth * 0.62, cssHeight * 0.72);
      let enFontSize = fontSize * 0.16;
      let enAscent = 0;
      let enDescent = 0;

      // أثر (groß) und Athar (klein darunter) müssen zusammen in die Bühne
      // passen. Amiri-Glyphen sind deutlich höher als die Fontgröße, deshalb
      // die Größen iterativ bestimmen, bis der ganze Block Platz hat.
      for (let i = 0; i < 4; i++) {
        ctx!.font = `400 ${enFontSize}px ${serifFace}`;
        setVariation(ctx!, '"opsz" 40');
        ctx!.direction = "ltr";
        const enM = ctx!.measureText("Athar");
        enAscent = enM.actualBoundingBoxAscent;
        enDescent = enM.actualBoundingBoxDescent;
        const gap = fontSize * 0.08;
        const maxArH = cssHeight - (enAscent + enDescent) - gap;

        ctx!.font = `400 ${fontSize}px ${quranFace}`;
        setVariation(ctx!, "normal");
        ctx!.direction = "rtl";
        const m = ctx!.measureText("أثر");
        const arH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        if (arH <= maxArH) break;
        fontSize = (fontSize * maxArH) / arH;
        enFontSize = fontSize * 0.16;
      }

      // Arabische Glyphen ragen weit über die Baseline hinaus (Diakritika,
      // Alef). `textBaseline: middle` zentriert nur die Em-Box und schneidet
      // oben ab. Stattdessen die gemessene Glyphen-Höhe nehmen und daraus die
      // Baseline so legen, dass der echte Textblock exakt mittig sitzt.
      ctx!.textAlign = "center";
      ctx!.textBaseline = "alphabetic";
      const m = ctx!.measureText("أثر");
      const ascent = m.actualBoundingBoxAscent;
      const descent = m.actualBoundingBoxDescent;
      const arH = ascent + descent;
      const gap = fontSize * 0.08;
      const blockH = arH + gap + enAscent + enDescent;
      const blockTop = (cssHeight - blockH) / 2;
      const arBaseline = blockTop + ascent;
      const enBaseline = blockTop + arH + gap + enAscent;
      const cx = cssWidth / 2;

      // Gold-Grüner Schein — zwei weiche Schatten-Durchgänge hinter dem Text.
      ctx!.save();
      ctx!.shadowColor = c.greenGlow;
      ctx!.shadowBlur = 60;
      ctx!.fillStyle = "rgba(212, 169, 95, 0.01)";
      ctx!.fillText("أثر", cx, arBaseline);
      ctx!.shadowColor = c.goldGlow;
      ctx!.shadowBlur = 40;
      ctx!.fillText("أثر", cx, arBaseline);
      ctx!.restore();

      // Gold-Verlauf, von hell oben nach dunkel unten.
      const grad = ctx!.createLinearGradient(0, blockTop, 0, blockTop + arH);
      grad.addColorStop(0, c.goldLight);
      grad.addColorStop(0.5, c.gold);
      grad.addColorStop(1, c.goldDark);
      ctx!.fillStyle = grad;
      ctx!.fillText("أثر", cx, arBaseline);

      // Athar klein darunter, in der Display-Schrift des Banners von vorher
      // (Newsreader mit optischer Größenachse).
      ctx!.font = `400 ${enFontSize}px ${serifFace}`;
      setVariation(ctx!, '"opsz" 40');
      ctx!.direction = "ltr";
      ctx!.fillStyle = c.gold;
      ctx!.globalAlpha = 0.9;
      ctx!.fillText("Athar", cx, enBaseline);
      ctx!.globalAlpha = 1;
    }

    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return <canvas ref={ref} aria-hidden="true" />;
}

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
          <Mark size={320} />
        </div>
        <div className="hero-word relative">
          <WordmarkCanvas />
        </div>
      </div>
      <h1 className="sr-only">{labels.name}</h1>
      <p className="mono rise mt-5 text-muted" style={{ animationDelay: "0.1s" }}>
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