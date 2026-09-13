# athar-web

The web frontend of Athar (openathar) — Next.js 15, App Router. A working
product, not a mockup: prayer times, an Earth & Moon view with a real
day/night terminator, a live world map, and a Quran-and-science section —
all trilingual (DE/EN/AR) with proper RTL.

<p align="center">
  <img src="docs/screenshots/hero.png" alt="Athar hero — the word أثر next to the verse it's named after" width="100%" />
</p>

## What's in here

<table>
<tr>
<td width="50%">

**Earth & Moon**
Real 3D earth, terminator computed from today's actual solar position, not
painted on. The moon shows today's real phase. Click anywhere on earth for
prayer times at that spot.

</td>
<td width="50%"><img src="docs/screenshots/earth-moon.png" width="100%" /></td>
</tr>
<tr>
<td width="50%">

**World map & prayer times**
Pick a city or use your own location. The dotted map shows day/night live;
prayer times come from the Aladhan API with the next prayer highlighted.

</td>
<td width="50%"><img src="docs/screenshots/world-map.png" width="100%" /></td>
</tr>
<tr>
<td width="50%">

**Two Books**
The verse as revealed, and the world as measured — side by side, neither
claiming to prove the other. Quran text is sourced and cited, never
generated; the observation text is AI-drafted and editorially reviewed
before it ships (see `data/reflections.json`).

</td>
<td width="50%"><img src="docs/screenshots/two-books.png" width="100%" /></td>
</tr>
</table>

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (output: standalone)
```

## Design principles

Calm, editorial: a paper/ink palette, serif display (Newsreader), Amiri for
Arabic. The visual language is Islamic geometry (Khatam star as SVG) —
deliberately no figurative imagery and no AI-generated letterforms. Arabic
always renders as real webfont typography, never as an image.

All spacing uses logical CSS properties (`ps-*`, `border-s`, etc.) so RTL
mirrors correctly with no special-casing.

## Honest state of the calculation logic

Prayer times currently come from the external **Aladhan API** — a
deliberate placeholder, not the end state. Hijri calendar conversion
(`lib/hijri.ts`) is already computed locally in JavaScript. Both are meant
to move into `athan-core-java` (a separate, not-yet-built repo) once it
exists, so web, the public API, and the mobile app all share one
calculation engine instead of three separate implementations. See
[`docs/architecture.md`](https://github.com/openathar/athar/blob/main/docs/architecture.md)
in the superproject for the full picture.
