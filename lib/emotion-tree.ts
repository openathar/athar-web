/**
 * Prozedural erzeugter Baum fuer die Gefuehls-Grafik: Aeste im Brustkorb,
 * Wurzeln im Bauch. Deterministisch (festes Seed) — Server und Client
 * zeichnen exakt dieselben Pfade, kein Hydration-Unterschied.
 */
export type Seg = { d: string; depth: number; len: number };
export type Tip = { x: number; y: number };

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Opts = {
  x: number;
  y: number;
  /** Richtung in Grad, 0 = nach oben */
  angle: number;
  len: number;
  maxDepth: number;
  spread: number;
  decay: number;
  seed: number;
  /** Nur Segmente, deren Ende in dieser Ellipse liegt, werden gezeichnet. */
  clip: { cx: number; cy: number; rx: number; ry: number };
  /** +1 nach oben (Aeste), -1 nach unten (Wurzeln) */
  dir: 1 | -1;
};

export function growTree(o: Opts): { segs: Seg[]; tips: Tip[] } {
  const r = rng(o.seed);
  const segs: Seg[] = [];
  const tips: Tip[] = [];
  const inside = (x: number, y: number) =>
    ((x - o.clip.cx) / o.clip.rx) ** 2 + ((y - o.clip.cy) / o.clip.ry) ** 2 <= 1;

  function branch(x: number, y: number, ang: number, len: number, depth: number) {
    const rad = (ang * Math.PI) / 180;
    const ex = x + Math.sin(rad) * len;
    const ey = y - Math.cos(rad) * len * o.dir;
    if (!inside(ex, ey)) {
      tips.push({ x: +x.toFixed(1), y: +y.toFixed(1) });
      return;
    }
    // Leicht gekruemmt: Kontrollpunkt seitlich der Mitte.
    const bend = (r() - 0.5) * len * 0.5;
    const mx = (x + ex) / 2 + Math.cos(rad) * bend;
    const my = (y + ey) / 2 + Math.sin(rad) * bend * o.dir;
    segs.push({
      d: `M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      depth,
      len,
    });
    if (depth >= o.maxDepth) {
      tips.push({ x: +ex.toFixed(1), y: +ey.toFixed(1) });
      return;
    }
    const kids = depth < 2 ? 2 : r() < 0.28 ? 3 : 2;
    for (let i = 0; i < kids; i++) {
      const t = i / (kids - 1) - 0.5;
      const a = ang + t * o.spread * 2 + (r() - 0.5) * o.spread * 0.55;
      branch(ex, ey, a, len * (o.decay + (r() - 0.5) * 0.12), depth + 1);
    }
  }
  branch(o.x, o.y, o.angle, o.len, 0);
  return { segs, tips };
}

export function nearest(tips: Tip[], x: number, y: number): Tip {
  let best = tips[0];
  let bd = Infinity;
  for (const t of tips) {
    const d = (t.x - x) ** 2 + (t.y - y) ** 2;
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  return best;
}
