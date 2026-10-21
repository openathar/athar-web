"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { OliveTree } from "./olive-tree";

/**
 * Der Baum waechst mit dem Text: links haftet das Bild, rechts laufen die
 * Kapitel (Wurzeln bis Samen). Der Scroll-Fortschritt setzt nur `--p` am
 * Wrapper (kein React-Render pro Scroll-Event); das Bild wird per clip-path
 * von unten nach oben freigegeben. Ein blasses Duplikat zeigt vorab die
 * Form, die entsteht. Kapitelnamen links markieren, wo man gerade ist.
 */
export function TreeGrow({
  children,
  names,
  alt,
  hint,
}: {
  children: ReactNode;
  names: string[];
  alt: string;
  hint: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, ((vh * 0.55 - r.top) / Math.max(1, r.height - vh * 0.1)) * 1.2));
      el.style.setProperty("--p", p.toFixed(4));
      let a = 0;
      el.querySelectorAll<HTMLElement>("[data-chapter]").forEach((c, i) => {
        if (c.getBoundingClientRect().top < vh * 0.55) a = i;
      });
      setActive(a);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="lp-grow" style={{ ["--p" as string]: 1 }}>
      <aside className="lp-grow-side">
        <div className="lp-grow-sticky">
          <div className="lp-grow-tree" role="img" aria-label={alt}>
            <OliveTree still className="lp-grow-ghost" />
            <OliveTree className="lp-grow-real" />
          </div>
          <ol className="lp-grow-names" aria-hidden>
            {names.map((n, i) => (
              <li key={n} className={i === active ? "is-active" : undefined}>
                {n}
              </li>
            ))}
          </ol>
          <p className="lp-grow-hint mono" aria-hidden>
            {hint}
          </p>
        </div>
      </aside>
      <div className="lp-grow-body">{children}</div>
    </div>
  );
}
