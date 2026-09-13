# athar-web

Web-Plattform von Athar (openathar) — Next.js 15, App Router.
Landing Page in DE / EN / AR (inkl. RTL), später die Online-Werkzeuge
(Gebetszeiten, Qibla, Hijri-Konverter) gegen die Public API.

## Entwicklung

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Produktions-Build (output: standalone)
```

## Design

Ruhig-editorial: Papier/Tinte-Palette, Serif-Display (Cormorant Garamond),
Amiri für Arabisch. Visuelle Sprache ist islamische Geometrie (Khatam-Stern
als SVG) — bewusst keine figurativen Motive und keine generierten
Schriftbilder. Arabisch läuft immer als echte Webfont-Typografie, nie als
Grafik.

Alle Abstände nutzen logische CSS-Eigenschaften (`ps-*`, `border-s`), damit
RTL ohne Sonderfälle spiegelt.
