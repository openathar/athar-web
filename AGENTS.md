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

## Languages

DE / EN / AR — copy lives in `lib/dictionaries.ts`, locale routing via
`app/[locale]`.

## APM (Agent Package Manager)

Project-local skills/agents/commands are managed via `apm.yaml`
(registry source: `~/Development/harness/registry/`).
- `apm install --local` — installs the packages listed in `apm.yaml`
- `apm status --local` — checks install state against the registry
