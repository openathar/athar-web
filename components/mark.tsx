type Ring = {
  scale: number;
  rotate: number;
  opacity: number;
  /**
   * Sekunden pro Umdrehung. `0` heisst: steht fest.
   * Der aeussere Ring bleibt bewusst statisch — er definiert die Silhouette.
   * Rotiert er mit, wirkt das Signet groesser und unruhig.
   */
  duration: number;
  reverse?: boolean;
};

/** Khatam — achtzackiger Stern aus zwei ueberlagerten Quadraten, um den Ursprung konstruiert. */
function Khatam({ scale = 1, rotate = 0 }: { scale?: number; rotate?: number }) {
  return (
    <g transform={`rotate(${rotate}) scale(${scale})`}>
      <path d="M-28 -28 H28 V28 H-28 Z" vectorEffect="non-scaling-stroke" />
      <path d="M0 -40 L40 0 L0 40 L-40 0 Z" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

/**
 * Ein rotierender Ring plus nachlaufende Echos.
 *
 * Die Spur entsteht nicht durch Unschärfe, sondern durch Phasenversatz:
 * dieselbe Drehung, verzögert gestartet — die Echos bleiben dauerhaft ein
 * Stück hinter dem Ring zurück und verblassen nach hinten.
 */
function SpinningRing({ ring, trail }: { ring: Ring; trail: number }) {
  if (ring.duration === 0) {
    return (
      <g opacity={ring.opacity}>
        <Khatam scale={ring.scale} rotate={ring.rotate} />
      </g>
    );
  }

  const layers = Array.from({ length: trail + 1 }, (_, j) => j);
  return (
    <>
      {layers.map((j) => (
        <g
          key={j}
          className={[
            "ring",
            ring.reverse ? "ring--rev" : "",
            j > 0 ? "ring--echo" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            animationDuration: `${ring.duration}s`,
            // Positiver Versatz: die Echos laufen der Drehung hinterher.
            // Negativ waeren sie ihr voraus — das liest sich nicht als Spur.
            animationDelay: `${j * 0.8}s`,
            opacity: ring.opacity * (j === 0 ? 1 : j === 1 ? 0.4 : 0.18),
          }}
        >
          <Khatam scale={ring.scale} rotate={ring.rotate} />
        </g>
      ))}
    </>
  );
}

const MARK_RINGS: Ring[] = [
  { scale: 1, rotate: 0, opacity: 1, duration: 0 },
  { scale: 0.62, rotate: 22.5, opacity: 0.55, duration: 0 },
  { scale: 0.3, rotate: 45, opacity: 0.3, duration: 0 },
];

const ROSETTE_RINGS: Ring[] = [
  { scale: 1, rotate: 0, opacity: 0.9, duration: 0 },
  { scale: 0.78, rotate: 22.5, opacity: 0.6, duration: 60, reverse: true },
  { scale: 0.56, rotate: 45, opacity: 0.45, duration: 44 },
  { scale: 0.34, rotate: 67.5, opacity: 0.3, duration: 32, reverse: true },
  { scale: 0.16, rotate: 90, opacity: 0.2, duration: 22 },
];

export function Mark({
  size = 40,
  className,
  // Das Logo bleibt statisch. Ein dauerhaft bewegtes Signet zieht den Blick
  // vom Inhalt ab und laesst die Marke unruhig wirken.
  animate = false,
  trail = 1,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
  trail?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className={`${animate ? "spin-host" : ""} ${className ?? ""}`}
      role="img"
      aria-label="Athar"
    >
      {MARK_RINGS.map((r) => (
        <SpinningRing key={r.scale} ring={r} trail={animate ? trail : 0} />
      ))}
    </svg>
  );
}

export function Rosette({
  className,
  animate = true,
  trail = 2,
}: {
  className?: string;
  animate?: boolean;
  trail?: number;
}) {
  return (
    <svg
      className={`${animate ? "spin-host" : ""} ${className ?? ""}`}
      aria-hidden
      viewBox="-50 -50 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinejoin="round"
    >
      {ROSETTE_RINGS.map((r) => (
        <SpinningRing key={r.scale} ring={r} trail={animate ? trail : 0} />
      ))}
    </svg>
  );
}

/** Statischer Trenner — fünf Sterne, zur Mitte hin kräftiger. */
export function Ornament({ className }: { className?: string }) {
  const stars = [
    { cx: 80, opacity: 0.25 },
    { cx: 160, opacity: 0.5 },
    { cx: 240, opacity: 1 },
    { cx: 320, opacity: 0.5 },
    { cx: 400, opacity: 0.25 },
  ];
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 480 72"
      width="100%"
      height="72"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid meet"
    >
      {stars.map((s) => (
        <g key={s.cx} transform={`translate(${s.cx} 36) scale(0.34)`} opacity={s.opacity}>
          <path d="M-28 -28 H28 V28 H-28 Z" vectorEffect="non-scaling-stroke" />
          <path d="M0 -40 L40 0 L0 40 L-40 0 Z" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Signet mit eingeschriebenem Wort.
 *
 * Das arabische أثر steht nicht neben der Marke, sondern im Stern — das
 * entspricht der klassischen Anordnung von Kalligrafie in geometrischer
 * Fassung (Siegel, Tughra). Der Text bleibt echte Schrift, keine Pfade:
 * Nur so bleiben Formgebung und Ligaturen korrekt.
 *
 * Die inneren Ringe entfallen hier bewusst — sie wuerden dem Wort den Platz
 * nehmen und es unleserlich machen.
 */
export function LogoMark({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      className={className}
      role="img"
      aria-label="Athar — أثر"
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
        <Khatam scale={1} />
        <Khatam scale={0.82} rotate={22.5} />
      </g>
      <text
        x="0"
        y="2"
        textAnchor="middle"
        dominantBaseline="central"
        direction="rtl"
        xmlLang="ar"
        fill="currentColor"
        stroke="none"
        fontSize="38"
        style={{ fontFamily: "var(--font-ar-display), serif" }}
      >
        أثر
      </text>
    </svg>
  );
}
