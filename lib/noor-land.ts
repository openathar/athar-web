/**
 * Grob vereinfachte Kontinent-Silhouetten für die gepunktete Weltkarte.
 *
 * Bewusst keine echte Kartendatenbank (Natural Earth o.ä.) eingebunden —
 * das wäre ein schweres Asset für ein rein dekoratives, stilisiertes Bild.
 * Stattdessen ein paar Dutzend Stützpunkte pro Kontinent, handgezeichnet
 * nach Augenmaß. Für Navigation ungeeignet, für ein Punktraster ausreichend.
 *
 * Koordinaten als [lon, lat] in Grad.
 */

type Ring = Array<[number, number]>;

const NORTH_AMERICA: Ring = [
  [-170, 68], [-165, 60], [-155, 58], [-135, 58], [-130, 52], [-125, 48],
  [-124, 40], [-117, 32], [-110, 31], [-105, 20], [-97, 16], [-92, 15],
  [-88, 14], [-83, 9], [-79, 8], [-77, 8], [-80, 25], [-81, 31], [-75, 35],
  [-70, 41], [-65, 45], [-60, 50], [-65, 60], [-75, 65], [-85, 68],
  [-95, 70], [-110, 72], [-130, 70], [-150, 70], [-165, 68], [-170, 68],
];

const SOUTH_AMERICA: Ring = [
  [-80, 10], [-77, 5], [-79, -3], [-81, -5], [-70, -18], [-70, -30],
  [-73, -40], [-68, -54], [-65, -55], [-58, -52], [-53, -34], [-48, -25],
  [-35, -8], [-40, 0], [-50, 5], [-60, 8], [-70, 10], [-80, 10],
];

const EUROPE: Ring = [
  [-10, 36], [-9, 43], [-5, 48], [0, 50], [5, 51], [8, 54], [10, 58],
  [15, 60], [20, 63], [30, 66], [40, 66], [35, 55], [25, 50], [20, 46],
  [15, 45], [13, 42], [18, 40], [23, 36], [15, 37], [10, 38], [3, 40],
  [-5, 37], [-10, 36],
];

const AFRICA: Ring = [
  [-17, 15], [-15, 20], [-10, 28], [-5, 33], [0, 33], [10, 32], [20, 32],
  [32, 31], [35, 31], [36, 20], [43, 12], [51, 12], [51, 5], [44, -1],
  [40, -5], [39, -15], [35, -25], [32, -30], [27, -33], [20, -34],
  [15, -30], [13, -18], [9, -5], [9, 4], [3, 6], [-8, 6], [-13, 9],
  [-17, 15],
];

const MIDDLE_EAST: Ring = [
  [35, 31], [45, 32], [48, 30], [50, 25], [57, 25], [60, 22], [58, 15],
  [50, 13], [43, 12], [36, 20], [35, 31],
];

const ASIA: Ring = [
  [27, 65], [40, 68], [60, 70], [80, 73], [100, 75], [130, 75], [160, 70],
  [180, 66], [178, 60], [160, 55], [145, 43], [130, 38], [122, 30],
  [110, 18], [105, 10], [100, 6], [95, 5], [92, 15], [88, 22], [80, 25],
  [68, 24], [61, 25], [55, 27], [48, 38], [40, 40], [35, 40], [27, 45],
  [27, 65],
];

const AUSTRALIA: Ring = [
  [113, -22], [114, -30], [118, -35], [130, -32], [137, -35], [141, -38],
  [147, -38], [150, -33], [153, -28], [153, -20], [145, -15], [135, -12],
  [128, -15], [122, -18], [113, -22],
];

const BRITISH_ISLES: Ring = [
  [-8, 50], [-6, 54], [-5, 58], [-3, 59], [0, 55], [1, 52], [-3, 50], [-8, 50],
];

const JAPAN: Ring = [
  [130, 32], [132, 34], [136, 35], [140, 37], [142, 40], [141, 44],
  [145, 44], [140, 36], [136, 33], [130, 32],
];

const INDONESIA: Ring = [
  [95, 5], [97, 3], [104, -1], [106, -6], [113, -8], [119, -9], [124, -9],
  [130, -3], [135, -2], [140, -5], [141, -3], [134, 0], [126, 2], [118, 1],
  [110, 2], [100, 5], [95, 5],
];

const CONTINENTS: Ring[] = [
  NORTH_AMERICA, SOUTH_AMERICA, EUROPE, AFRICA, MIDDLE_EAST, ASIA,
  AUSTRALIA, BRITISH_ISLES, JAPAN, INDONESIA,
];

/** Standard Ray-Casting Punkt-in-Polygon-Test. */
function pointInRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    const intersects =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** true, wenn der Punkt auf einer der stilisierten Kontinent-Flächen liegt. */
export function isLand(lon: number, lat: number): boolean {
  for (const ring of CONTINENTS) {
    if (pointInRing(lon, lat, ring)) return true;
  }
  return false;
}

/**
 * Subsolarer Punkt (die Stelle, an der die Sonne im Zenit steht) —
 * grob genähert, ohne Zeitgleichung. Reicht für eine dekorative
 * Tag/Nacht-Schattierung.
 */
export function subsolarPoint(date: Date): { lon: number; lat: number } {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  const declination = 23.44 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
  // Bei 12:00 UTC steht die Sonne über 0° Länge; pro Stunde 15° Verschiebung.
  let lon = (12 - utcHours) * 15;
  lon = ((lon + 180) % 360 + 360) % 360 - 180;

  return { lon, lat: declination };
}

/** true = Tageslicht an diesem Punkt, nach dem Subsolar-Zenitwinkel. */
export function isDaylight(lon: number, lat: number, sun: { lon: number; lat: number }): boolean {
  const rad = Math.PI / 180;
  const latR = lat * rad;
  const sunLatR = sun.lat * rad;
  const lonDiffR = (lon - sun.lon) * rad;
  const cosZenith = Math.sin(latR) * Math.sin(sunLatR) + Math.cos(latR) * Math.cos(sunLatR) * Math.cos(lonDiffR);
  return cosZenith > 0;
}
