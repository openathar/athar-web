# Design: COMPUTE-Template → Beit Athar (Grün-Blau, ohne Rosa)

> **Historisch (Stand 22.10.2026):** Dieser Entwurf wurde nicht so umgesetzt. Die Startseite ist
> inzwischen „Baum unter dem Mond“ (siehe `memory-beit-athar.md`). Nur der Baum stammt noch aus dem
> Template (Lizenz ungeklärt, `public/beit-athar/CREDITS.md`). Das Dokument bleibt als Begründung
> der Section-Zuordnung stehen.

Quelle: https://v0.app/templates/compute-the-platform-to-build-ship-ai-agents-Auw4otwlr20
Live-Demo: https://v0-compute-11.vercel.app
Stand: 07.10.2026

> Ziel: Layout-Rhythmus von COMPUTE übernehmen, aber Bildsprache komplett auf
> Athar umstellen: kein Rosa/Magenta (Bäume, Whale, Bridge, Biolumineszenz),
> sondern Grün-Blau aus der bestehenden Layl/Mushaf-Palette. Erst lokal als
> Prototyp, kein Ersatz der aktuellen Landing.

## 1. Was wir übernehmen (Struktur, nicht Stil)

COMPUTE ist eine klassische SaaS-Longpage. Mapping auf Beit Athar:

| # | COMPUTE-Sektion | Beit-Athar-Entsprechung | Bemerkung |
|---|-----------------|-------------------------|-----------|
| 0 | Sticky Nav: Capabilities, Process, Infra, Integrations, Security + CTA „Deploy agent" | Nav: Zeichen, Himmel, Kalender, Kampagne, Entwickler + CTA „Mach mit / GitHub" | Nur Text-Nav, keine Icons von Dritten |
| 1 | Hero: „Distributed compute, agents that automate" + 3 Stats (3500+, 99.7%, <50ms) | Hero: Ayah + Claim „Hinterlasse dein Athar" + 3 Stats (z. B. Gebetszeiten lokal, Hijri lokal, 0 Tracker) | Typo-Hero wie bisher (`display`, clamp 32–60px), kein Bild-Hero |
| 2 | „Intelligent workers." + 01-Card + Bild | „Zwei Bücher: Vers neben Beobachtung" (bestehende DailySign-Sektion) | Nummerierung 01/02/03 passt zu Athar (`mono text-gold`) |
| 3 | „Define. Deploy. Scale." + Baum-Bild (`tree-...png`) | „Bestimmen. Beten. Weitergeben." 3 Schritte + Geometrie statt Baum | Baum-Bild ersatzlos streichen → Rosette/Khatam-SVG |
| 4 | „Global by default." + Weltkugel + Regionen-Liste + Live-Metriken-Graph | „Zwei Lichter, eine Uhr" (bestehende CosmosTabs: Erde/Mond/Karte) | Weltkugel-Globus nicht übernehmen, eigene `world-map`/`earth-moon-scene` weiter nutzen |
| 5 | „Connect everything." Logo-Wall (OpenAI, Slack, GitHub …) | Entfällt / wird zu „Offen per Design": GitHub-Org, API-Docs, Mitmachen | Keine Fremd-Logos (Tracking + Markenrecht), nur eigene Links |
| 6 | „Autonomous, not uncontrolled." 4 Security-Cards + SOC2-Badges | „Versprechen" (bestehende Promise-Liste: keine Ads, kein Tracking, Open Source) | Karten-Raster ja, Badge-Wall nein |
| 7 | Developer SDK + Code-Block | Developer-Portal (`/[locale]/developers`, bestehende `api-masthead`, `api-panel`) | Code-Tabs übernehmen, Styling an `mono` + `api-panel` anpassen |
| 8 | Testimonials + Pricing (Explorer $0, Builder $65, Scale Custom) + Wal-Bild | Entfällt komplett | Kein Pricing, kein Wal, keine Fake-Testimonials — passt nicht zu Sadaqah Jariyah |
| 9 | Final-CTA „Ready to delegate" + Brücken-Bild (`bridge.png`, zwei Bäume) + Footer | Kampagnen-Block `#athar` (bestehend) + Footer | Brücken-Bild ersetzen durch `Ornament`-SVG, sonst Struktur 1:1 übernehmbar |

Fazit: Nur Sektionen 0,1,2,3,4,6,7,9 sind relevant. 5 und 8 streichen.

## 2. Farbe: Rosa raus, Grün-Blau rein

COMPUTE lebt von Magenta/Biolumineszenz (`#ff5da2`, `#b24bf3`, pinke Bäume auf
dunkelviolett). Das wird komplett ersetzt — keine neuen Hex-Werte erfinden,
sondern bestehende Tokens aus `app/globals.css` nutzen:

```css
/* Dark (Layl) — Default */
--c-paper: #0b0f17;   /* Nachthimmel, ersetzt Violett-Schwarz */
--c-surface: #121a26; /* Kartenfläche */
--c-ink: #e9e3d4;
--c-muted: #939bab;
--c-rule: #222b3a;
--c-accent: #4aa583;  /* Smaragd-Grün, ersetzt Pink als Primär-CTA */
--c-gold: #d4a95f;    /* Sekundär-Akzent, ersetzt Magenta-Glow */

/* Light (Mushaf) */
--c-paper: #faf5ea;
--c-surface: #f2ecdd;
--c-ink: #23261f;
--c-muted: #5c6156;
--c-rule: #d8d0bb;
--c-accent: #0d7a55;  /* Tiefgrün */
--c-gold: #9a6f1f;
```

Regeln für den Prototyp:

- Bäume/Brücke/Wal/Biolumineszenz-Bilder: **nicht umfärben, sondern ersetzen.**
  Statt PNGs: `Rosette`/`Ornament` aus `components/mark.tsx` + CSS-Gradienten
  `linear-gradient(180deg, #0b1628, #12395b)` (Himmel) → `#0d7a55 → #4aa583 → #7fd1b8`
  (Vegetation). Reine CSS/SVG-Textur wie `.api-masthead`, kein Canvas nötig.
- Glow-Effekte (COMPUTE: pinker Neon-Schein): nur mit `color-mix(in oklab,
  var(--color-accent) …)` wie `.api-pulse`. Kein Box-Shadow in Fremdfarben.
- CTA-Hierarchie: primär `bg-accent text-paper`, sekundär `border-rule`,
 _Meta/Nummern `text-gold`. Genau wie aktuelle Landing.
- Light-Mode muss ohne Zusatzarbeit funktionieren (Tokens tun das bereits).

Damit ist dein Wunsch „irgendwas mit Grün-Blau abgestimmt" ohne neues
Branding erfüllt — es ist die vorhandene Athar-Palette.

## 3. Was wir bewusst NICHT übernehmen (Binding Rules)

Aus `web/AGENTS.md` — diese COMPUTE-Muster verstoßen dagegen und bleiben draußen:

1. **Externe Bilder von `blob.vercel-storage.com`** (`tree-….png`, `world-….png`,
   `connection-….png`, Upscaled-Bilder). Verstoß gegen „no third-party".
   → Alle Bilder selbst hosten oder durch SVG/CSS ersetzen. Kein Hotlink.
2. **Fremd-Skripte/Animation-Libs** (COMPUTE nutzt Framer-Motion-ähnliche
   Scroll-Effekte). → Nur CSS wie `.rise`, `.ring`, `hero-float`. Respect
   `prefers-reduced-motion` (ist in `globals.css` bereits drin).
3. **Figurative Bildsprache.** Bäume/Brücke/Wal sind zwar keine Menschen/Tiere
   im verbotenen Sinn, aber fotorealistische KI-Renderings brechen die
   Geometrie-Sprache (Khatam/Girih als SVG). → Geometrie statt Renderings.
4. **LTR-only Layout.** COMPUTE kennt kein RTL. → Nur logische Properties
   (`ms-/me-/ps-/pe-/border-s`, `inset-inline-*`), wie im Bestand.
5. **Englische Marketing-Floskeln + Fake-Social-Proof** („Trusted by teams",
   erfundene Zitate). → DE/EN/AR-Copy aus `lib/dictionaries.ts`, keine
   Testimonials ohne echte Zustimmung.

## 4. Aufwand

| Paket | Inhalt | Aufwand |
|-------|--------|---------|
| A. Prototyp-Route | Neue Route `app/[locale]/beit-athar/page.tsx` (Kopie der Sektions-Reihenfolge aus Kap. 1, noch mit Platzhalter-Geometrie), kein Eingriff in `/` | 0,5–1 Tag |
| B. Bildersatz | Baum/Brücke/Weltkugel/Graph durch `mark.tsx`-SVG + CSS-Gradient ersetzen; `world-map`/`earth-moon-scene` wiederverwenden | 1,5–2 Tage (größter Brocken) |
| C. i18n + RTL | Copy in `dictionaries.ts` für DE/EN/AR, Amiri-Shaping prüfen, `dir`-Attribute | 0,5 Tag |
| D. A11y + Perf | Skip-Link, `:focus-visible`, Kontrast AA (Gold auf Paper prüfen), `next build` ohne externe Hosts, Lighthouse | 0,5 Tag |
| **Summe MVP** | Lokal klickbarer Prototyp | **3–4 Tage** |
| Ausbau | Scroll-Animationen, Qibla-/Sky-Sektion einhängen, Content-Final | +3–5 Tage |

Kein Backend-Aufwand: alles statisch, keine API-Änderung.

## 5. Lokal testen (Plan)

Bewusst als isolierte Route, damit die produktive Landing (`/`) unangetastet bleibt:

```bash
workdir=/Users/ahmad/Development/business/athar/web
git status                    # sauberer Baum prüfen
git checkout -b prototype/beit-athar-compute
npm install                   # nur falls node_modules veraltet
npm run dev                   # → http://localhost:3000/de/beit-athar
npm test                      # Referenztests athan-core/hijri müssen grün bleiben
npm run build                 # keine externen Hosts im Bundle
```

Checkliste beim Draufschauen:

- [ ] Kein Rosa/Pink irgendwo (DevTools: nach `#ff`, `magenta`, `blob.vercel` suchen)
- [ ] Dark + Light (`data-theme`) beide lesbar, Gold-Kontrast AA
- [ ] AR-Route (`/ar/beit-athar`): RTL, Amiri-Shaping, keine `left`/`right`-Klassen
- [ ] `prefers-reduced-motion`: keine Dauer-Animation
- [ ] Kein Request an Dritte (Network-Tab: nur `localhost`, keine `vercel-storage`, keine Fonts von Google)

Wenn der Prototyp gefällt: Sektionen einzeln in `/` zurückportieren oder als
eigene Kampagnen-Seite behalten. Wenn nicht: Branch löschen, kein Schaden.

## 7. Bild-Pipeline (Rosa → Grün-Blau, self-hosted)

Alle COMPUTE-Bilder liegen unter `public/beit-athar/` (12 Dateien, ~1,7 MB),
kein Hotlink, keine Fremdhosts. Originale waren Magenta/Pink (`blob.vercel-storage`
+ `v0-compute-11.vercel.app/images/`), umgefärbt per Hue-Rotation +160° in PIL:

```bash
python3 - <<'EOF'
from PIL import Image
import os
SHIFT = 160/360
for f in os.listdir("public/beit-athar/src"):
    im = Image.open(f"public/beit-athar/src/{f}").convert("RGB")
    h, s, v = im.convert("HSV").split()
    out = Image.merge("HSV", (h.point(lambda x: (x + int(SHIFT*255)) % 256), s, v)).convert("RGB")
    out.save(f"public/beit-athar/{f.rsplit('.', 1)[0]}.jpg", quality=78, optimize=True)
EOF
```

Danach auf max. 1600px Breite skaliert, fotografische PNGs nach JPG gewandelt.
Bewusst weggelassen: `whale.png` (Tier-Motiv + Pricing-Kontext — beides passt
nicht zu den Binding Rules / Sadaqah Jariyah). Pricing wurde zu „Teilhabe"
(Nutzen / Mitbauen / Weitergeben, alles €0), Testimonials ersatzlos gestrichen.

## 6. Offene Fragen an dich

1. Ist „Beit Athar" eine eigene Seite/Route oder soll die Haupt-Landing umgebaut werden? (Vorschlag: eigene Route, siehe Kap. 5.)
2. Welche 3 Stats sollen in den Hero (statt 3500+ Agents / 99.7% / <50ms)? Vorschlag: „100% lokal berechnet · 0 Tracker · 3 Sprachen".
3. Bäume-Metapher behalten (als Geometrie stilisiert) oder ganz raus? Für „Haus/Beit" könnte eine Khatam-Rosette als Haus-Zeichen stärker sein als Bäume.
