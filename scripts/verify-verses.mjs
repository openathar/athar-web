#!/usr/bin/env node
/**
 * Verifiziert die gebündelten Qur'an-Texte byte-exakt gegen ihre Quellen:
 *
 *   data/quran/tanzil-uthmani.json  == Tanzil-Download (alle 6236 Verse, Copyright-Block)
 *   data/quran/<key>.json            == QuranEnc-API für jeden Vers aus data/reflections.json,
 *                                       Version == aktuelle QuranEnc-Version (Pflicht: aktuell halten)
 *   reflections.json fallback.*      == data/quran/ (arabic, de, en, footnotes)
 *
 * Kein Text wird „korrigiert“: Was die Quelle liefert, steht so im Repo (QuranEnc-Bedingung 1:
 * keine Änderung; Anmerkungen zur Übersetzung gehen an QuranEnc, Bedingung 5).
 * Abweichung oder nicht erreichbare Quelle → Exit-Code 1 (fail-closed). Läuft als
 * `npm run verify:content` und im CI-Gate. `--offline` prüft nur die lokale Konsistenz.
 * Neu erzeugen: node scripts/fetch-quran.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EDITIONS, get, loadMeta, loadTanzil } from "./fetch-quran.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OFFLINE = process.argv.includes("--offline");
const read = async (...p) => JSON.parse(await readFile(join(root, ...p), "utf8"));

const data = await read("data", "reflections.json");
const tanzil = await read("data", "quran", "tanzil-uthmani.json");
const editions = {};
for (const [lang, { key }] of Object.entries(EDITIONS)) editions[lang] = await read("data", "quran", `${key}.json`);

let failed = 0;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed++;
};

function firstDiff(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) return `an Position ${i}: »…${a.slice(Math.max(0, i - 30), i + 30)}…« vs. »…${b.slice(Math.max(0, i - 30), i + 30)}…«`;
  }
  return "";
}

// 1. Lokal: Form der Daten und reflections.json gegen data/quran/.
const count = tanzil.suras.reduce((n, s) => n + s.length, 0);
if (count !== 6236) fail(`tanzil-uthmani.json hat ${count} statt 6236 Verse`);
if (!/Tanzil Project/.test(tanzil.copyright) || !/CHANGING IT IS NOT ALLOWED/.test(tanzil.copyright)) {
  fail("tanzil-uthmani.json: Copyright-Block fehlt");
}
for (const [lang, ed] of Object.entries(editions)) {
  const n = ed.suras.reduce((m, s) => m + s.length, 0);
  if (n !== 6236) fail(`${ed.key}.json hat ${n} statt 6236 Verse`);
  if (!/^\d+\.\d+\.\d+$/.test(ed.version ?? "")) fail(`${ed.key}.json: Versionsnummer fehlt (${lang})`);
}
for (const e of data.entries) {
  const [s, a] = e.verse.split(":").map(Number);
  const want = {
    arabic: tanzil.suras[s - 1]?.[a - 1],
    de: editions.de.suras[s - 1]?.[a - 1]?.t,
    en: editions.en.suras[s - 1]?.[a - 1]?.t,
  };
  for (const [k, v] of Object.entries(want)) {
    if (e.fallback[k] !== v) fail(`${e.verse} (${k}): reflections.json weicht von data/quran ab ${firstDiff(e.fallback[k] ?? "", v ?? "")}`);
  }
  for (const lang of ["de", "en"]) {
    const f = editions[lang].suras[s - 1]?.[a - 1]?.f ?? "";
    if ((e.fallback.footnotes?.[lang] ?? "") !== f) fail(`${e.verse} (${lang}): Fußnoten fehlen oder weichen ab`);
  }
}
console.log(failed ? "" : `✓ lokal: reflections.json == data/quran (${data.entries.length} Verse)`);

// 2. Netz: gegen die Quellen.
if (!OFFLINE) {
  try {
    const live = await loadTanzil();
    if (live.copyright !== tanzil.copyright) fail("Tanzil: Copyright-Block hat sich geändert — fetch-quran.mjs neu laufen lassen");
    let diff = 0;
    tanzil.suras.forEach((row, si) =>
      row.forEach((text, ai) => {
        if (live.verses.get(`${si + 1}:${ai + 1}`) !== text) diff++;
      }),
    );
    if (diff) fail(`Tanzil: ${diff} Verse weichen vom aktuellen Download ab`);
    else console.log("✓ Tanzil: alle 6236 Verse byte-exakt");
  } catch (err) {
    fail(`Tanzil nicht erreichbar (${err.message})`);
  }

  try {
    const meta = await loadMeta();
    for (const [lang, m] of Object.entries(meta)) {
      if (m.version !== editions[lang].version) {
        fail(`${m.key}: QuranEnc hat v${m.version}, gebündelt ist v${editions[lang].version} — fetch-quran.mjs neu laufen lassen`);
      }
    }
  } catch (err) {
    fail(`QuranEnc-Liste nicht erreichbar (${err.message})`);
  }

  for (const e of data.entries) {
    const [s, a] = e.verse.split(":").map(Number);
    for (const [lang, ed] of Object.entries(editions)) {
      try {
        const r = (await get(`https://quranenc.com/api/v1/translation/aya/${ed.key}/${s}/${a}`)).result;
        const mine = ed.suras[s - 1][a - 1];
        if (r.translation !== mine.t) fail(`${e.verse} (${ed.key}): Text weicht ab ${firstDiff(mine.t, r.translation)}`);
        if ((r.footnotes ?? "") !== (mine.f ?? "")) fail(`${e.verse} (${ed.key}): Fußnoten weichen ab`);
      } catch (err) {
        fail(`${e.verse} (${ed.key}): QuranEnc nicht erreichbar (${err.message})`);
      }
    }
  }
  if (!failed) console.log(`✓ QuranEnc: ${data.entries.length} Verse × ${Object.keys(editions).length} Ausgaben byte-exakt, Versionen aktuell`);
}

if (failed > 0) {
  console.error(`\n${failed} Fehler — Veröffentlichung blockiert.`);
  process.exit(1);
}
console.log(`\nAlle Verse bestätigt (Tanzil + QuranEnc${OFFLINE ? ", nur lokal" : ""}).`);
