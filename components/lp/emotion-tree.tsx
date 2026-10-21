"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { growTree, nearest } from "~/lib/emotion-tree";
import type { EmotionCopy } from "~/lib/lp-copy";

const W = 600;
const H = 780;

/** Wo jedes Gefuehl am Baum sitzt (Brust = Aeste, Bauch = Wurzeln) und wer sein Gegenstueck ist. */
const PLACES = [
  { x: 168, y: 205, belly: false, pair: 1 }, // Liebe
  { x: 196, y: 610, belly: true, pair: 0 }, // Hass
  { x: 440, y: 190, belly: false, pair: 3 }, // Angst
  { x: 408, y: 600, belly: true, pair: 2 }, // Trauer
  { x: 300, y: 92, belly: false, pair: 5 }, // Vertrauen
  { x: 300, y: 705, belly: true, pair: 4 }, // Frieden
] as const;

/**
 * Ein Baum im menschlichen Oberkoerper: Wurzeln im Bauch, Aeste in der Brust,
 * in der Mitte das Herz als Blume. Eigene Zeichnung (SVG, prozedural), nach der
 * Idee des Forschers Amin Sabry. Die Aeste wachsen, sobald die Grafik ins Bild
 * kommt; Gefuehle sind antippbar.
 */
export function EmotionTree({ copy, rtl }: { copy: EmotionCopy; rtl: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);
  const [sel, setSel] = useState<number | "heart" | null>("heart");

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tree = useMemo(() => {
    const up = growTree({
      x: 300, y: 398, angle: 0, len: 92, maxDepth: 8, spread: 30, decay: 0.8, seed: 11,
      clip: { cx: 300, cy: 240, rx: 215, ry: 190 }, dir: 1,
    });
    const down = growTree({
      x: 300, y: 532, angle: 0, len: 74, maxDepth: 8, spread: 34, decay: 0.8, seed: 7,
      clip: { cx: 300, cy: 640, rx: 170, ry: 150 }, dir: -1,
    });
    return { up, down };
  }, []);

  const nodes = useMemo(
    () =>
      PLACES.map((p) => nearest(p.belly ? tree.down.tips : tree.up.tips, p.x, p.y)),
    [tree],
  );

  const active = sel === null ? null : sel === "heart" ? { name: copy.heart.name, body: copy.heart.body, belly: false, pair: null as number | null } : { ...copy.items[sel], belly: PLACES[sel].belly, pair: PLACES[sel].pair as number | null };
  const petals = Array.from({ length: 16 }, (_, i) => i * (360 / 16));

  return (
    <div className="lp-emo" ref={host} data-grown={grown ? "1" : "0"}>
      <div className="lp-emo-figure">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={copy.alt} className="lp-emo-svg">
          {/* Oberkoerper */}
          <g className="lp-emo-body">
            <path d="M255 0V52C255 84 190 92 130 108C80 122 58 160 54 232C50 330 48 440 60 570C66 650 90 730 108 780" />
            <path d="M345 0V52C345 84 410 92 470 108C520 122 542 160 546 232C550 330 552 440 540 570C534 650 510 730 492 780" />
            <ellipse cx="300" cy="248" rx="172" ry="158" className="lp-emo-rib" />
            <path d="M150 408C220 366 380 366 450 408" className="lp-emo-diaphragm" />
          </g>
          <text x="300" y="402" className="lp-emo-zone" textAnchor="middle" aria-hidden>
            {""}
          </text>

          {/* Wurzeln und Aeste */}
          <g className="lp-emo-roots">
            {tree.down.segs.map((s, i) => (
              <path key={i} d={s.d} pathLength={1} style={{ ["--d" as string]: s.depth, strokeWidth: Math.max(0.7, 5 - s.depth * 0.6) }} />
            ))}
          </g>
          <g className="lp-emo-branches">
            {tree.up.segs.map((s, i) => (
              <path key={i} d={s.d} pathLength={1} style={{ ["--d" as string]: s.depth, strokeWidth: Math.max(0.7, 5.5 - s.depth * 0.65) }} />
            ))}
          </g>
          {/* Stamm durch das Zwerchfell */}
          <path d="M300 532C298 490 302 440 300 398" className="lp-emo-trunk" pathLength={1} />

          {/* Herz: Blume in der Mitte der Brust */}
          <g className={`lp-emo-flower${sel === "heart" ? " is-on" : ""}`} transform="translate(300 262)">
            <g className="lp-emo-spin">
              {petals.map((a) => (
                <ellipse key={a} cx="0" cy="-34" rx="9" ry="27" transform={`rotate(${a})`} />
              ))}
            </g>
            <circle r="11" className="lp-emo-core" />
          </g>
        </svg>

        {/* antippbare Punkte, in % der Zeichnung positioniert */}
        <button
          type="button"
          className={`lp-emo-dot lp-emo-dot--heart${sel === "heart" ? " is-on" : ""}`}
          style={{ left: `${(300 / W) * 100}%`, top: `${(262 / H) * 100}%` }}
          aria-label={copy.heart.name}
          aria-pressed={sel === "heart"}
          onClick={() => setSel("heart")}
        />
        {PLACES.map((p, i) => (
          <button
            key={copy.items[i].name}
            type="button"
            className={`lp-emo-dot${p.belly ? " is-belly" : ""}${nodes[i].x >= 296 ? " is-flip" : ""}${sel === i ? " is-on" : ""}`}
            style={{ left: `${((nodes[i].x / W) * 100).toFixed(2)}%`, top: `${((nodes[i].y / H) * 100).toFixed(2)}%` }}
            aria-label={copy.items[i].name}
            aria-pressed={sel === i}
            onClick={() => setSel(i)}
          >
            <span>{copy.items[i].name}</span>
          </button>
        ))}
        <p className="lp-emo-zone-label lp-emo-zone-label--chest mono">{copy.chest}</p>
        <p className="lp-emo-zone-label lp-emo-zone-label--belly mono">{copy.belly}</p>
      </div>

      <div className="lp-emo-panel" aria-live="polite">
        {active ? (
          <>
            <p className="lp-eyebrow mono">{active.belly ? copy.belly : sel === "heart" ? copy.chest : copy.chest}</p>
            <h3>{active.name}</h3>
            <p>{active.body}</p>
            {active.pair !== null && (
              <button type="button" className="lp-link" onClick={() => setSel(active.pair as number)}>
                {copy.counterpart}: {copy.items[active.pair].name} {rtl ? "←" : "→"}
              </button>
            )}
          </>
        ) : (
          <p className="lp-emo-hint">{copy.hint}</p>
        )}
      </div>
    </div>
  );
}
