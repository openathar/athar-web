# athar-web

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png" />
    <img src="docs/logo-light.png" alt="Athar — the word أثر" width="420" />
  </picture>
</p>

The web frontend of Athar (openathar) — Next.js 15, App Router. A working
product, not a mockup: a true-phase 3D moon, prayer times on a 3D earth, a
tree that grows as you scroll through the chapters, an Islamic calendar, a
Quran-and-science section, an emotion map and a developer portal — all
trilingual (DE/EN/AR) with proper RTL.

> No screenshots here, deliberately — the design changes weekly and stale
> images become lies. Run it (`npm run dev`) or open
> [openathar.org](https://openathar.org).

## What's in here

- **The start page (`/`)** — a real 3D moon with today's phase, then six
  chapters (calculation, features, idea, calendar, API, take part) while a
  tree in the side navigation grows with your scroll. Texts live in
  `lib/landing-copy.ts` and `lib/lp-copy.ts` (handwritten per language), the
  components in `components/lp/`, the styles in `components/lp/lp.css`.
- **Two lights, one clock** — a tabbed section: a 3D earth whose day/night
  terminator is computed from today's actual solar position (click anywhere
  for prayer times at that spot) and "eight faces of one moon" showing when
  each phase returns.
- **The Written Book and the Witnessed Book** — the verse as revealed, the
  world as measured, side by side. Quran text is sourced and cited, never
  generated; the observation text is AI-drafted and editorially reviewed
  before it ships (`data/reflections.json`, served via `/api/reflections`).
- **Upcoming Islamic dates and tonight's sky** — Hijri date, observances,
  moon phase, all computed locally.
- **The emotion map** — 133 feelings as branches (chest) and roots (belly),
  after the research model of Amin Sabry. Data and layout in
  `lib/emotion-map.ts`, component `components/lp/emotion-tree.tsx`.
- **The developer portal (`/developers`)** — English-only reference generated
  from one spec (`lib/api-reference.ts`: index, panels, cURL/JS/Python/
  Swift/Kotlin samples, roadmap) plus a live in-browser playground for the
  public API and self-serve API keys. Local API: set
  `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (output: standalone)
npm test        # reference tests against athan-core-java values
```

## Design principles

Calm and quiet: a deep-navy night palette with one gold accent (a single CSS
variable), Plus Jakarta Sans throughout (headings set by weight and tracking,
not a second face), Amiri for Arabic. No gradients, no glass, no glow, no
serifs, no ticker bands. Arabic always renders as real webfont typography,
never as an image.

All spacing uses logical CSS properties (`ps-*`, `border-s`, etc.) so RTL
mirrors correctly with no special-casing.

## Media and licences

The tree video, its poster and a few images on the start page come from a
third-party template and their **licence is not clarified yet** — see
[`public/beit-athar/CREDITS.md`](public/beit-athar/CREDITS.md). Do not
reuse them elsewhere; the plan is to replace them with our own artwork.

## Honest state of the calculation logic

Prayer times are computed locally in `lib/athan-core.ts` — a TypeScript
port of `athan-core-java` (the single source of truth), kept in sync by
reference tests against the Java values (`npm test`). Hijri calendar
conversion (`lib/hijri.ts`) is also computed locally in JavaScript. Web,
the public API, and the mobile app all share one calculation engine. See
[`docs/architecture.md`](https://github.com/openathar/athar/blob/main/docs/architecture.md)
in the superproject for the full picture.
