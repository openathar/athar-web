/**
 * Khatam — achtzackiger Stern aus zwei überlagerten Quadraten.
 * Pfade um den Ursprung konstruiert, damit Skalieren/Rotieren ohne
 * Korrekturrechnung funktioniert.
 */
function Khatam({
  cx = 0,
  cy = 0,
  scale = 1,
  rotate = 0,
  opacity = 1,
}: {
  cx?: number;
  cy?: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <g
      opacity={opacity}
      transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}
    >
      {/* vectorEffect gehört auf die Shapes — auf dem <svg> bleibt es wirkungslos */}
      <path d="M-28 -28 H28 V28 H-28 Z" vectorEffect="non-scaling-stroke" />
      <path d="M0 -40 L40 0 L0 40 L-40 0 Z" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

/**
 * Athar-Signet: ein Stern, zweifach nach innen gestaffelt und verblassend —
 * die Spur, die bleibt. Rein geometrisch, symmetrisch, RTL-neutral.
 */
export function Mark({
  size = 40,
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
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Athar"
    >
      <Khatam scale={1} />
      <Khatam scale={0.62} rotate={22.5} opacity={0.5} />
      <Khatam scale={0.3} rotate={45} opacity={0.25} />
    </svg>
  );
}

/**
 * Trenner: fünf Sterne, zur Mitte hin kräftiger — leises Ornament,
 * kein Blickfang.
 */
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
        <Khatam key={s.cx} cx={s.cx} cy={36} scale={0.34} opacity={s.opacity} />
      ))}
    </svg>
  );
}

/**
 * Grosse Rosette — dieselbe Regel, vier Mal angewandt. Dekoratives
 * Gegenstueck zum Text ueber Muster und Regel.
 */
export function Rosette({ className }: { className?: string }) {
  const rings = [
    { scale: 1, rotate: 0, opacity: 0.9 },
    { scale: 0.78, rotate: 22.5, opacity: 0.6 },
    { scale: 0.56, rotate: 45, opacity: 0.42 },
    { scale: 0.34, rotate: 67.5, opacity: 0.28 },
    { scale: 0.16, rotate: 90, opacity: 0.18 },
  ];
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="-50 -50 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinejoin="round"
    >
      {rings.map((r) => (
        <Khatam key={r.scale} scale={r.scale} rotate={r.rotate} opacity={r.opacity} />
      ))}
    </svg>
  );
}
