/**
 * Der Baum (Krone + Stamm aus dem COMPUTE-Template-Video, gruen umgefaerbt,
 * ohne Huegel) mit einem Stueck Boden aus dem Original. Lizenz: public/beit-athar/CREDITS.md.
 */
export function OliveTree({ className, still = false }: { className?: string; still?: boolean }) {
  return (
    <div className={`lp-olive${still ? " is-still" : ""}${className ? ` ${className}` : ""}`} aria-hidden>
      <div className="lp-olive-in">
        {still ? (
          <img src="/beit-athar/tree-poster.jpg" alt="" decoding="async" />
        ) : (
          <video autoPlay muted loop playsInline preload="metadata" poster="/beit-athar/tree-poster.jpg">
            <source src="/beit-athar/tree.mp4" type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}
