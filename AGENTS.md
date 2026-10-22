# AGENTS.md — athar-web

Next.js frontend of the Athar platform (openathar).

## Links

- Architecture/roadmap: superproject `openathar/athar` (`AGENTS.md`)
- Repo conventions: `~/Development/harness/agents/business-repo.md`

## Binding rules

- **Think RTL-first**: only logical CSS properties
  (`padding-inline`, `border-inline-start`, Tailwind `ps-/pe-/ms-/me-/border-s`).
  Never `left`/`right`. Arabic is a first-class language here, not an
  afterthought.
- **Arabic script is never an image**: always real webfont typography
  (Amiri), so shaping/ligatures stay correct. No generated letterforms.
- **No figurative imagery** (people, animals, prophets, mosque photos).
  Visual language is geometry (Khatam/Girih as SVG).
- **No tracking, no ads, no third-party scripts** — that's the site's
  product promise, and it applies to its own implementation too. If
  analytics are ever added: self-hosted Umami only, cookieless, clearly
  disclosed.
- Accessibility is part of the definition of done: skip link,
  `:focus-visible`, `prefers-reduced-motion`, WCAG AA contrast.

## Current honest state

Prayer times are computed locally in `lib/athan-core.ts` — a TypeScript
port of `athan-core-java` (the single source of truth), kept in sync by
reference tests against the Java values (`npm test`, Node's built-in test
runner, no extra dependency). Hijri conversion is computed locally in JS
(`lib/hijri.ts`). Both mirror the Java core; no external prayer-time API is
called anywhere.

## Start page and developer portal

The start page `/` (formerly the Beit Athar / COMPUTE prototype, which now
only redirects) is the "tree under the moon" page: `app/[locale]/page.tsx`,
components in `components/lp/`, styles in `components/lp/lp.css`
(`.lp-v2` palette, one `--lp-accent`), texts in `lib/landing-copy.ts` and
`lib/lp-copy.ts` (handwritten per language, no machine translation; keep
chapter names plain — no poetic metaphors). Server constants (locales,
`isRtl`) must never live in a `"use client"` file. Session notes:
`docs/memory-beit-athar.md`.

- **Licence debt:** the tree video/poster and some images are template media
  with an unclarified licence (`public/beit-athar/CREDITS.md`). Do not add
  more third-party media without recording its licence there.
- **Developer portal** (`app/[locale]/developers`): English-only reference
  driven by `lib/api-reference.ts` — add an endpoint there and the index,
  panel, code samples and (for GET endpoints) the playground tab follow
  (`components/api-playground.tsx`). When the API (`../api`) changes, update
  the spec in the same change.
- Emotion map: `lib/emotion-map.ts` (data, handwritten names) +
  `components/lp/emotion-tree.tsx`.

## Languages

DE / EN / AR — copy lives in `lib/dictionaries.ts`, locale routing via
`app/[locale]`.

## APM (Agent Package Manager)

Project-local skills/agents/commands are managed via `apm.yaml`
(registry source: `~/Development/harness/registry/`).
- `apm install --local` — installs the packages listed in `apm.yaml`
- `apm status --local` — checks install state against the registry
