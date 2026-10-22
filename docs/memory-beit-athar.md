# Startseite „Baum unter dem Mond“ (Stand 22.10.2026)

Die frühere Beit-Athar-/COMPUTE-Startseite wurde durch „Baum unter dem Mond“
ersetzt; `/[locale]/beit-athar` leitet auf `/` um, die Varianten `/1 /2 /3`
leiten ebenfalls auf `/`. Live auf openathar.org.

- Seite: `app/[locale]/page.tsx`. Komponenten: `components/lp/`
  (`shell`, `tree-grow`, `olive-tree`, `moon-stage`, `moon-faces`,
  `emotion-tree`). Styles: `components/lp/lp.css` (Palette `.lp-v2`, eine
  Akzentvariable `--lp-accent`).
- Texte von Hand je Sprache: `lib/landing-copy.ts` (Inhalte), `lib/lp-copy.ts`
  (Kapitel, Gefühle-Karte). Kapitelnamen sachlich halten (Rechnen,
  Funktionen, Idee, Kalender, API, Mitmachen).
- Baum in der Navigation: Template-Video, per CSS auf die Krone beschnitten
  und grün umgefärbt. **Lizenz ungeklärt** (`public/beit-athar/CREDITS.md`).
- Gefühle-Karte: 133 Gefühle nach Amin Sabry, `lib/emotion-map.ts`.
- Developer-Portal: gleiche Optik (`.dev-lp`), Link im Header der Startseite;
  Referenz aus `lib/api-reference.ts`.
- Falle: Server-Konstanten nie in eine `"use client"`-Datei (RSC).
