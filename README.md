# athar-web

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png" />
    <img src="docs/logo-light.png" alt="Athar — the word أثر" width="420" />
  </picture>
</p>

The web frontend of Athar (openathar) — Next.js 15, App Router. A working
product, not a mockup: prayer times on a 3D earth and a live world map, a
true moon-phase observatory, an Islamic calendar, and a Quran-and-science
section — all trilingual (DE/EN/AR) with proper RTL.

> No screenshots here, deliberately — the design changes weekly and stale
> images become lies. Run it (`npm run dev`) or open
> [openathar.org](https://openathar.org).

## What's in here

- **Two lights, one clock** — a tabbed section: a 3D earth whose day/night
  terminator is computed from today's actual solar position (click anywhere
  for prayer times at that spot), a moon orbiting at today's true elongation
  with a zoomable true-phase moon view, and a dotted world map with live
  day/night and per-city prayer times.
- **The Written Book and the Witnessed Book** — the verse as revealed, the
  world as measured, side by side. Quran text is sourced and cited, never
  generated; the observation text is AI-drafted and editorially reviewed
  before it ships (`data/reflections.json`, served via `/api/reflections`).
- **Calendar & tonight's sky** — Hijri date, upcoming Islamic events, moon
  phase with illumination and age, all computed locally.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (output: standalone)
npm test        # reference tests against athan-core-java values
```

## Design principles

Calm, editorial: a paper/ink palette, serif display (Newsreader), Amiri for
Arabic. The visual language is Islamic geometry (Khatam star as SVG) —
deliberately no figurative imagery and no AI-generated letterforms. Arabic
always renders as real webfont typography, never as an image.

All spacing uses logical CSS properties (`ps-*`, `border-s`, etc.) so RTL
mirrors correctly with no special-casing.

## Honest state of the calculation logic

Prayer times are computed locally in `lib/athan-core.ts` — a TypeScript
port of `athan-core-java` (the single source of truth), kept in sync by
reference tests against the Java values (`npm test`). Hijri calendar
conversion (`lib/hijri.ts`) is also computed locally in JavaScript. Web,
the public API, and the mobile app all share one calculation engine. See
[`docs/architecture.md`](https://github.com/openathar/athar/blob/main/docs/architecture.md)
in the superproject for the full picture.
