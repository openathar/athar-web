import type { ReactNode } from "react";

/**
 * "Alte Lampe geht an" — ein warmer Goldschein hinter dem Inhalt, der beim
 * Hereinscrollen (via umgebendes .reveal.is-visible) einmalig aufglüht:
 * zündet, flackert kurz, läuft dann warm und ruhig. Rein dekorativ, RTL-neutral.
 */
export function Lamp({ children }: { children: ReactNode }) {
  return (
    <div className="lp-lamp">
      <div className="lp-lamp-halo" aria-hidden="true" />
      {children}
    </div>
  );
}
