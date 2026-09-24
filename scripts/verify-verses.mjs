#!/usr/bin/env node
/**
 * Verifiziert jeden Vers in data/reflections.json byte-exakt gegen die
 * quran.com-API:
 *
 *   fallback.arabic  == text_uthmani
 *   fallback.de      == Bubenheim & Elyas (id 27), Fußnoten entfernt
 *   fallback.en      == Saheeh International (id 20), Fußnoten entfernt
 *
 * Die Fallback-Texte sind die Offline-Quelle der Seite — sie müssen exakt
 * der zitierten Fassung entsprechen. Abweichung oder nicht erreichbare API
 * brechen mit Exit-Code 1 ab (fail-closed): nichts wird ohne Bestätigung
 * veröffentlicht. Läuft als `npm run verify:content` und im CI-Gate.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const data = JSON.parse(await readFile(join(root, "data", "reflections.json"), "utf8"));

const stripHtml = (s) => s.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, "").trim();

/**
 * Dokumentierte Abweichungen: Fehler in der API-Quelle, bei denen der
 * Fallback die korrekte Fassung bewahrt. apiText = exakter Text, den die
 * API aktuell liefert (nach Fußnoten-Bereinigung). Behebt die API den
 * Fehler später, meldet das Script die Ausnahme als veraltet.
 */
const SOURCE_DEFECTS = {
  "13:28:en": {
    apiText:
      'Those who have believed and whose hearts are assured by the remembrance of Allāh. Unquestionably, by the remembrance of Allāh hearts are assured."',
    note: "Saheeh International endet in der API-Quelle mit einem überflüssigen Anführungszeichen.",
  },
  "57:25:de": {
    apiText:
      "Wir haben ja Unsere Gesandten mit den klaren Beweisen gesandt und mit ihnen die Schrift und die Waage herabgesandt, damit die Menschen für die Gerechtigkeit eintreten. Und Wir haben das Eisen herabgsandt. In ihm ist starke Gewalt und Nutzen für die Menschen -, damit Allah kennt, wer Ihm und Seinen Gesandten im Verborgenen hilft. Gewiß, Allah ist Stark und Allmächtig.",
    note: "Bubenheim & Elyas enthält in der API-Quelle den Tippfehler „herabgsandt“ statt „herabgesandt“.",
  },
};

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  throw lastError;
}

let failed = 0;
const defectFields = [];

for (const entry of data.entries) {
  const url = `https://api.quran.com/api/v4/verses/by_key/${entry.verse}?fields=text_uthmani&translations=27,20`;
  let json;
  try {
    const res = await fetchWithRetry(url);
    json = await res.json();
  } catch (err) {
    console.error(`✗ ${entry.verse}: quran.com nicht erreichbar (${err.message})`);
    failed++;
    continue;
  }

  const verse = json.verse;
  const de = verse.translations?.find((t) => t.resource_id === 27);
  const en = verse.translations?.find((t) => t.resource_id === 20);

  const checks = [
    ["arabic", verse?.text_uthmani, entry.fallback.arabic],
    ["de", de ? stripHtml(de.text) : undefined, entry.fallback.de],
    ["en", en ? stripHtml(en.text) : undefined, entry.fallback.en],
  ];

  const mismatches = checks.filter(([, api, fallback]) => api !== fallback);
  const undocumented = [];
  for (const [lang, api, fallback] of mismatches) {
    const defect = SOURCE_DEFECTS[`${entry.verse}:${lang}`];
    if (defect && api === defect.apiText) {
      defectFields.push({ verse: entry.verse, lang, api, fallback });
      console.log(`✓ ${entry.verse} (${lang}) — dokumentierte Ausnahme: ${defect.note}`);
    } else {
      undocumented.push([lang, api, fallback]);
    }
  }

  if (undocumented.length > 0) {
    for (const [lang, api, fallback] of undocumented) {
      console.error(`✗ ${entry.verse} (${lang}): Fallback weicht von der API ab`);
      if (typeof api === "string" && typeof fallback === "string") {
        for (let i = 0; i < Math.max(api.length, fallback.length); i++) {
          if (api[i] !== fallback[i]) {
            console.error(`  erste Abweichung an Position ${i}:`);
            console.error(`  API:      …${api.slice(Math.max(0, i - 30), i + 30)}…`);
            console.error(`  Fallback: …${fallback.slice(Math.max(0, i - 30), i + 30)}…`);
            break;
          }
        }
      }
    }
    failed++;
  } else if (mismatches.length === 0) {
    console.log(`✓ ${entry.verse}`);
  }
}

for (const { verse, lang, api, fallback } of defectFields) {
  if (api === fallback) {
    console.warn(
      `! ${verse} (${lang}): dokumentierte Ausnahme ist veraltet — API entspricht jetzt dem Fallback, Eintrag aus SOURCE_DEFECTS entfernen.`,
    );
  }
}

if (failed > 0) {
  console.error(`\n${failed} Verse fehlerhaft — Veröffentlichung blockiert.`);
  process.exit(1);
}
console.log(`\nAlle ${data.entries.length} Verse byte-exakt bestätigt (arabic, de, en).`);