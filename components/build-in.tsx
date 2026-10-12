"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Setzt `data-build` auf "armed" (ausgeblendet) und beim Hereinscrollen
 * auf "done" (eingeblendet), beim Verlassen wieder auf "armed". Vor dem Mount bleibt alles sichtbar, damit
 * die Seite ohne JavaScript nicht leer ist. Reduced-Motion regelt das CSS.
 */
export function BuildIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "done">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setState("armed");
    // Ein- und ausblenden: sichtbar ab einem Fuenftel im Bild, aus, sobald
    // es ganz verschwunden ist (dazwischen bleibt der Zustand stehen).
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.2) setState("done");
        else if (!e.isIntersecting) setState("armed");
      },
      { threshold: [0, 0.2] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-build={state} className={className}>
      {children}
    </div>
  );
}
