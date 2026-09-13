#!/usr/bin/env node
/**
 * Erzeugt Entwürfe für die "Beobachtung"-Spalte des Vers-Abschnitts.
 *
 * WICHTIG — warum das ein Skript und kein Laufzeit-Aufruf ist:
 * Neben Offenbarungstext darf kein ungeprüfter Modelltext stehen. Dieses
 * Skript schreibt ausschliesslich nach `data/reflections.draft.json`.
 * Die Seite liest `data/reflections.json` — dorthin gelangt ein Text erst,
 * nachdem ein Mensch ihn gelesen und freigegeben hat.
 *
 *   node scripts/generate-reflections.mjs [modell]
 *
 * Danach: Entwürfe prüfen, korrigieren, in reflections.json übernehmen und
 * `reviewedBy` + `reviewedAt` setzen.
 */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const MODEL = process.argv[2] ?? "llama3.2";
const OLLAMA = process.env.OLLAMA_HOST ?? "http://localhost:11434";

/**
 * Das Modell bekommt NUR ein naturwissenschaftliches Thema — nie den Vers.
 * So kann es gar nicht erst in die Lage kommen, Offenbarung zu deuten.
 */
const SYSTEM = `Du schreibst eine nüchterne Naturbeobachtung für eine Infobox.

REGELN, strikt einzuhalten:
1. Du deutest niemals religiöse Texte. Du erklärst keine Verse, keine Bedeutung, keine Absicht.
2. Du behauptest nie, ein Text habe Wissenschaft vorhergesagt, bestätigt oder bewiesen.
3. Nur gesichertes Lehrbuchwissen. Keine Spekulation, keine Schätzwerte ohne Einheit.
4. Genau 2 Sätze. Nüchtern und konkret, keine Superlative, keine Ausrufezeichen.
5. Keine religiösen Begriffe. Keine Anrede des Lesers. Keine Einleitung wie "Hier ist".`;

const LANG = {
  de: "Schreib auf Deutsch.",
  en: "Write in English.",
  ar: "اكتب بالعربية الفصحى.",
};

/**
 * Themen sind bewusst allgemein formuliert — sie benennen das Naturphänomen,
 * nicht den Vers. Die Zuordnung Vers ↔ Thema trifft ein Mensch, nicht das Modell.
 */
const ENTRIES = [
  {
    verse: "36:38",
    field: { de: "Astronomie", en: "Astronomy", ar: "علم الفلك" },
    topic: "Die Eigenbewegung der Sonne: Sie umkreist das Zentrum der Milchstrasse in etwa 225 bis 250 Millionen Jahren.",
  },
  {
    verse: "21:33",
    field: { de: "Himmelsmechanik", en: "Orbital mechanics", ar: "ميكانيكا الأجرام" },
    topic: "Bahnen von Himmelskörpern: Warum Körper auf stabilen Umlaufbahnen bleiben, statt zu stürzen oder zu entweichen.",
  },
  {
    verse: "30:22",
    field: { de: "Genetik", en: "Genetics", ar: "علم الوراثة" },
    topic: "Menschliche Vielfalt: Wie gering die genetischen Unterschiede zwischen Menschen sind, gemessen am gesamten Genom.",
  },
  {
    verse: "13:28",
    field: { de: "Psychologie", en: "Psychology", ar: "علم النفس" },
    topic: "Wiederkehrende Rituale und Atemrhythmus: messbare Wirkung langsamer, regelmässiger Atmung auf Herzfrequenz und Stressreaktion.",
  },
];

async function generate(topic, locale) {
  const res = await fetch(`${OLLAMA}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      system: SYSTEM,
      prompt: `Thema: ${topic}\n${LANG[locale]}`,
      stream: false,
      options: { temperature: 0.3, num_predict: 220 },
    }),
  });
  if (!res.ok) throw new Error(`ollama ${res.status}`);
  const json = await res.json();
  return json.response.trim().replace(/\s+/g, " ");
}

const out = { model: MODEL, generatedAt: new Date().toISOString(), entries: [] };

for (const entry of ENTRIES) {
  const observation = {};
  for (const locale of ["de", "en", "ar"]) {
    process.stdout.write(`${entry.verse} ${locale} … `);
    try {
      observation[locale] = await generate(entry.topic, locale);
      console.log("ok");
    } catch (err) {
      observation[locale] = "";
      console.log(`FEHLER: ${err.message}`);
    }
  }
  out.entries.push({ ...entry, observation, reviewedBy: null, reviewedAt: null });
}

const target = join(root, "data", "reflections.draft.json");
await writeFile(target, JSON.stringify(out, null, 2) + "\n");
console.log(`\nEntwürfe geschrieben: ${target}`);
console.log("Nicht ungeprüft übernehmen — lesen, korrigieren, dann nach data/reflections.json.");
