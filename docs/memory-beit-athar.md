# Beit Athar → Startseite (Stand 12.10.2026)

Der COMPUTE-Prototyp (`/beit-athar`) ist in die Startseite `/` eingegangen;
`/[locale]/beit-athar` leitet nur noch dorthin um. Alles uncommitted.

- Seite: `app/[locale]/page.tsx`. Texte außerhalb von `dictionaries.ts`:
  `lib/landing-copy.ts` (DE/EN/AR von Hand geschrieben, nicht übersetzt;
  Regeln im Dateikopf — kurze Sätze, keine Floskeln, nichts Unbelegtes).
- Typo: `.title-xl` / `.title-l` / `.stack-word` (leicht, groß; eigene
  arabische Größen, weil Amiri optisch größer wirkt). Nicht `.display`
  verwenden — die AR-Regel dort schlägt jede Utility.
- Bilder (self-hosted, `public/beit-athar/`): tree, workers, connection,
  bridge, landscape. `.ba-fade-edges` blendet die schwarzen Ränder aus.
- Nav: `components/nav-shell.tsx` (Kapsel beim Scrollen, Sentinel `data-nav-sentinel`).
- Entfernt: AtharNet, Zahlenband-Bild, Live-Balken, Anschluss-Chips
  (nannten iOS/Android als vorhanden), abstrakte Security-Bilder.
