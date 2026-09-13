# AGENTS.md — athar-web

Next.js-Frontend der Athar-Plattform (openathar).

## Verknuepfungen
- Architektur/Roadmap: Superproject `openathar/athar` (`AGENTS.md`)
- Repo-Regeln: `~/Development/harness/agents/business-repo.md`

## Verbindliche Regeln

- **RTL zuerst mitdenken**: ausschliesslich logische CSS-Eigenschaften
  (`padding-inline`, `border-inline-start`, Tailwind `ps-/pe-/ms-/me-/border-s`).
  Niemals `left`/`right`. Arabisch ist gleichwertige Sprache, kein Nachtrag.
- **Arabische Schrift nie als Bild**: immer echte Webfont-Typografie (Amiri),
  damit Shaping/Ligaturen korrekt bleiben. Keine generierten Buchstabenformen.
- **Keine figurativen Motive** (Menschen, Tiere, Propheten, Moscheen-Fotos).
  Bildsprache ist Geometrie (Khatam/Girih als SVG).
- **Kein Tracking, keine Ads, keine Fremd-Skripte** — das ist das Produkt-
  versprechen der Seite und gilt auch fuer ihre eigene Implementierung.
  Falls Analytics: nur self-hosted Umami, cookieless, transparent benannt.
- Accessibility ist Teil der Definition of Done: Skip-Link, `:focus-visible`,
  `prefers-reduced-motion`, Kontraste WCAG AA.

## Sprachen
DE / EN / AR — Texte in `lib/dictionaries.ts`, Locale-Routing ueber `app/[locale]`.
