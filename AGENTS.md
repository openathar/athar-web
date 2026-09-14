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

Prayer times are fetched from the external Aladhan API (placeholder, not
final). Hijri conversion is already computed locally in JS
(`lib/hijri.ts`). Both migrate to `athan-core-java` once that repo has code
— see the superproject's `docs/architecture.md` for the concrete sequence.

## Languages

DE / EN / AR — copy lives in `lib/dictionaries.ts`, locale routing via
`app/[locale]`.

## APM (Agent Package Manager)

Projekt-lokale Skills/Agents/Commands werden über `apm.yaml` verwaltet
(Registry-Quelle: `~/Development/harness/registry/`).
- `apm install --local` — installiert die in `apm.yaml` gelisteten Packages
- `apm status --local` — prüft Installations-Stand gegen die Registry
