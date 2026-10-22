"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MAP_H, MAP_W, HEART, NAVEL, TEXT_IDS, chest, belly, clusters, counterpartOf, placed } from "~/lib/emotion-map";
import type { EmotionCopy } from "~/lib/lp-copy";

type Loc = "en" | "de" | "ar";
const GREEN = "#8fd1b4";

/**
 * Die Gefuehls-Karte als Baum: 133 Gefuehle nach der Karte des Forschers Amin
 * Sabry, 80 als Aeste ueber dem Zwerchfell (Brust), 53 als Wurzeln darunter
 * (Bauch). Die Zweige waechst von der Mitte nach aussen, wiegen sich danach
 * leicht, und jedes Gefuehl ist antippbar; sein Gegenstueck leuchtet mit auf.
 */
export function EmotionTree({ copy, rtl, locale }: { copy: EmotionCopy; rtl: boolean; locale: Loc }) {
  const host = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);
  const [sel, setSel] = useState<string | null>("love");
  const [hover, setHover] = useState<string | null>(null);

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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const byId = useMemo(() => new Map(placed.map((p) => [p.id, p])), []);
  const nameOf = (id: string) => {
    const ti = (TEXT_IDS as readonly string[]).indexOf(id);
    if (ti >= 0) return copy.items[ti].name;
    const p = byId.get(id)!;
    return p[locale];
  };
  const counter = sel ? counterpartOf(sel) : null;
  const shown = new Set<string>([...TEXT_IDS, ...(sel ? [sel] : []), ...(counter ? [counter] : []), ...(hover ? [hover] : [])]);
  const cur = sel ? byId.get(sel) : null;
  const ti = sel ? (TEXT_IDS as readonly string[]).indexOf(sel) : -1;
  const petals = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
  const isOn = (id: string) => id === sel || id === counter;

  const label = (id: string) => {
    const p = byId.get(id)!;
    const anchor = p.tip.x < 410 ? "end" : p.tip.x > 590 ? "start" : "middle";
    const dx = anchor === "end" ? -13 : anchor === "start" ? 13 : 0;
    const dy = anchor === "middle" ? (p.zone === "chest" ? -16 : 28) : 5;
    return (
      <text key={id} x={p.tip.x + dx} y={p.tip.y + dy} textAnchor={anchor} className={`lp-fm-label${isOn(id) ? " is-on" : ""}${id === sel || id === counter || id === hover ? "" : " is-base"}${p.zone === "belly" ? " is-belly" : ""}`} lang={locale}>
        {nameOf(id)}
      </text>
    );
  };

  return (
    <div className="lp-fm" ref={host} data-grown={grown ? "1" : "0"} data-focus={sel ? "1" : "0"}>
      <div className="lp-fm-figure" dir="ltr">
        <p className="lp-fm-cap lp-fm-cap--strong mono">{copy.sideStrong}</p>
        <p className="lp-fm-cap lp-fm-cap--weak mono">{copy.sideWeak}</p>
        <p className="lp-fm-cap lp-fm-cap--chest mono">
          {copy.chest} · {chest.length}
        </p>
        <p className="lp-fm-cap lp-fm-cap--belly mono">
          {copy.belly} · {belly.length}
        </p>
        <svg viewBox={`-170 0 ${MAP_W + 340} ${MAP_H}`} role="img" aria-label={copy.alt} className="lp-fm-svg">
          <line x1="-170" x2="1170" y1="570" y2="570" className="lp-fm-diaphragm" />

          {/* Stamm */}
          <path d={`M${NAVEL.x} ${NAVEL.y}V${HEART.y}`} className="lp-fm-trunk" pathLength={1} />
          <path d={`M${NAVEL.x} ${NAVEL.y}V${HEART.y}`} className="lp-fm-sap" />

          {clusters.map((cl) => (
            <g
              key={cl.id}
              className={`lp-fm-cl is-${cl.zone}`}
              style={{ ["--i" as string]: cl.id % 40, transformOrigin: `${cl.origin.x}px ${cl.origin.y}px` }}
            >
              {cl.stem && <path d={cl.stem} pathLength={1} className="lp-fm-stem" />}
              {cl.members.map((m) => {
                const p = placed[m];
                const on = isOn(p.id);
                return (
                  <g key={p.id} className={`lp-fm-m${on ? " is-on" : ""}`}>
                    <path d={p.d} pathLength={1} className="lp-fm-twig" />
                    <circle cx={p.tip.x} cy={p.tip.y} r={on ? 7 : 3.6} className="lp-fm-dot" />
                    <circle
                      cx={p.tip.x}
                      cy={p.tip.y}
                      r={20}
                      className="lp-fm-hit"
                      onPointerEnter={() => setHover(p.id)}
                      onPointerLeave={() => setHover(null)}
                      onClick={() => setSel(p.id)}
                    />
                  </g>
                );
              })}
            </g>
          ))}

          {/* Beschriftungen */}
          <g className="lp-fm-labels" aria-hidden>
            {[...shown].filter((id) => byId.has(id)).map(label)}
          </g>

          {/* Herz */}
          <g transform={`translate(${HEART.x} ${HEART.y - 6})`} className={`lp-fm-flower${sel === "heart" ? " is-on" : ""}`}>
            <g className="lp-fm-spin">
              {petals.map((a) => (
                <ellipse key={a} cx="0" cy="-30" rx="8" ry="23" transform={`rotate(${a})`} />
              ))}
            </g>
            <circle r="9" className="lp-fm-core" />
          </g>
          <circle cx={NAVEL.x} cy={NAVEL.y} r="8" className="lp-fm-navel" />
        </svg>
      </div>

      <div className="lp-fm-side">
        <div className="lp-fm-panel" aria-live="polite">
          {cur ? (
            <>
              <p className="lp-eyebrow mono">
                {cur.zone === "belly" ? copy.belly : copy.chest} · {cur.side === "strong" ? copy.sideStrong : cur.side === "weak" ? copy.sideWeak : copy.sideMid}
              </p>
              <h3>{nameOf(cur.id)}</h3>
              {locale !== "ar" && (
                <p className="lp-fm-ar quran" lang="ar" dir="rtl">
                  {cur.ar}
                </p>
              )}
              {ti >= 0 && <p>{copy.items[ti].body}</p>}
              {counter && (
                <button type="button" className="lp-link" onClick={() => setSel(counter)}>
                  {copy.counterpart}: {nameOf(counter)} {rtl ? "←" : "→"}
                </button>
              )}
            </>
          ) : (
            <p className="lp-fm-hint">{copy.hint}</p>
          )}
        </div>

        <details className="lp-fm-all">
          <summary className="mono">{copy.all.replace("{n}", String(placed.length))}</summary>
          {(["chest", "belly"] as const).map((z) => (
            <div key={z}>
              <p className="lp-fm-all-h mono">{z === "chest" ? copy.chest : copy.belly}</p>
              <ul>
                {placed
                  .filter((p) => p.zone === z)
                  .map((p) => (
                    <li key={p.id}>
                      <button type="button" aria-pressed={sel === p.id} className={sel === p.id ? "is-on" : ""} onClick={() => setSel(p.id)}>
                        {nameOf(p.id)}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </details>
        <p className="lp-fm-count">{copy.count.replace("{n}", String(placed.length))}</p>
      </div>
    </div>
  );
}
