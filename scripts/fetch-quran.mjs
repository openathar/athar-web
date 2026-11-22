#!/usr/bin/env node
/**
 * Baut die gebündelten Qur'an-Texte der Website aus lizenzsauberen Quellen, wörtlich:
 *
 *   Arabisch  Tanzil Quran Text (Uthmani), https://tanzil.net/download/
 *             Lizenz https://tanzil.net/docs/text_license — unverändert, „Tanzil Project“ nennen,
 *             auf tanzil.net verlinken, Copyright-Block mitführen.
 *   en / de   QuranEnc.com (english_saheeh, german_bubenheim) — Bedeutungsübersetzungen
 *   ar        QuranEnc.com arabic_moyassar (at-Tafsīr al-Muyassar, König-Fahd-Komplex)
 *             QuranEnc-Bedingungen: unverändert inkl. Fußnoten, Herausgeber + QuranEnc.com nennen,
 *             Versionsnummer zeigen, aktuell halten.
 *
 * Schreibt den GANZEN Text (6236 Verse je Ausgabe), weil der Live-Pool (Postgres) beliebige Verse
 * enthalten kann — die Seite holt zur Laufzeit nichts mehr aus dem Netz:
 *
 *   data/quran/tanzil-uthmani.json   { source, copyright, suras: string[][] }
 *   data/quran/<key>.json            { key, version, …, suras: { t, f? }[][] }  (t = Text, f = Fußnoten)
 *   data/reflections.json            fallback.{arabic,de,en,footnotes} jedes Eintrags daraus neu
 *
 * Aufruf: node scripts/fetch-quran.mjs   (Netz: tanzil.net + quranenc.com, ~350 Anfragen)
 * Prüfen ohne Schreiben: node scripts/verify-verses.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "data", "quran");

export const TANZIL_URL =
  "https://tanzil.net/pub/download/index.php?marks=true&sajdah=true&rub=false&alef=false&quranType=uthmani&outType=txt-2&agree=true";

/** Website-Sprache → QuranEnc-Ausgabe (ar: Tafsir statt Übersetzung). */
export const EDITIONS = {
  en: { key: "english_saheeh", credit: "Saheeh International · Noor International Center" },
  de: { key: "german_bubenheim", credit: "Frank Bubenheim & Nadim Elias" },
  ar: { key: "arabic_moyassar", credit: "التفسير الميسر · مجمع الملك فهد" },
};

export async function get(url, as = "json", attempts = 4) {
  let last;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "openathar-verse-fetch" } });
      if (res.ok) return as === "json" ? res.json() : res.text();
      last = new Error(`HTTP ${res.status} ${url}`);
    } catch (err) {
      last = err;
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  throw last;
}

/** Tanzil-Datei → { verses: Map("s:a" → Text), copyright, version }. */
export async function loadTanzil() {
  const raw = await get(TANZIL_URL, "text");
  const verses = new Map();
  const block = [];
  for (const line of raw.split("\n")) {
    const m = /^(\d+)\|(\d+)\|(.*)$/.exec(line);
    if (m) verses.set(`${m[1]}:${m[2]}`, m[3]);
    else if (line.startsWith("#")) block.push(line);
  }
  const copyright = block.join("\n");
  if (verses.size !== 6236) throw new Error(`Tanzil: 6236 Verse erwartet, ${verses.size} erhalten`);
  if (!copyright.includes("Tanzil Project") || !copyright.includes("CHANGING IT IS NOT ALLOWED")) {
    throw new Error("Tanzil: Copyright-Block fehlt");
  }
  return { verses, copyright, version: /Tanzil Quran Text \(([^)]+)\)/.exec(copyright)?.[1] ?? "?" };
}

/** Versionsangaben aus der QuranEnc-Liste (alle drei Ausgaben stehen dort). */
export async function loadMeta() {
  const list = (await get("https://quranenc.com/api/v1/translations/list")).translations;
  const byKey = new Map(list.map((t) => [t.key, t]));
  // arabic_moyassar fehlt in der Liste — dann die Übersichtsseite lesen.
  let home;
  const meta = {};
  for (const [lang, { key, credit }] of Object.entries(EDITIONS)) {
    const hit = byKey.get(key);
    if (hit) {
      meta[lang] = { key, credit, version: hit.version, lastUpdate: new Date(hit.last_update * 1000).toISOString().slice(0, 10), title: hit.title };
      continue;
    }
    home ??= await get("https://quranenc.com/en/home", "text");
    const at = home.indexOf(`href="https://quranenc.com/en/browse/${key}"`);
    const before = at < 0 ? "" : home.slice(Math.max(0, at - 4000), at);
    const d = [...before.matchAll(/(\d\d)\/(\d\d)\/(\d{4}) - V([\d.]+)/g)].at(-1);
    if (!d) throw new Error(`QuranEnc: keine Version für ${key}`);
    const title = before.slice(d.index).replace(/<[^>]+>/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean)[1];
    meta[lang] = { key, credit, version: d[4], lastUpdate: `${d[3]}-${d[2]}-${d[1]}`, title };
  }
  return meta;
}

/** Eine Sura einer Ausgabe, genau so, wie die API sie liefert. */
export async function loadSura(key, sura) {
  const json = await get(`https://quranenc.com/api/v1/translation/sura/${key}/${sura}`);
  return json.result.map((r) => ({ aya: Number(r.aya), text: r.translation, footnotes: r.footnotes ?? "" }));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const fetchedAt = new Date().toISOString().slice(0, 10);
  const tanzil = await loadTanzil();
  const meta = await loadMeta();

  const suras = [];
  for (let s = 1; s <= 114; s++) {
    const row = [];
    for (let a = 1; tanzil.verses.has(`${s}:${a}`); a++) row.push(tanzil.verses.get(`${s}:${a}`));
    suras.push(row);
  }
  await writeFile(
    join(OUT, "tanzil-uthmani.json"),
    JSON.stringify({
      about: "Generated by scripts/fetch-quran.mjs — do not edit. Verbatim Tanzil text; the copyright block below must stay with it.",
      source: `Tanzil Quran Text (${tanzil.version})`,
      url: "https://tanzil.net",
      download: TANZIL_URL,
      licence: "https://tanzil.net/docs/text_license",
      fetchedAt,
      copyright: tanzil.copyright,
      suras,
    }) + "\n",
  );
  console.log(`✓ Tanzil (${tanzil.version})`);

  const editions = {};
  for (const [lang, m] of Object.entries(meta)) {
    const rows = [];
    for (let s = 1; s <= 114; s++) {
      const ayat = await loadSura(m.key, s);
      if (ayat.length !== suras[s - 1].length) throw new Error(`${m.key} Sura ${s}: ${ayat.length} statt ${suras[s - 1].length} Verse`);
      rows.push(ayat.map((x) => (x.footnotes ? { t: x.text, f: x.footnotes } : { t: x.text })));
    }
    editions[lang] = rows;
    await writeFile(
      join(OUT, `${m.key}.json`),
      JSON.stringify({
        about: "Generated by scripts/fetch-quran.mjs — do not edit. Verbatim from QuranEnc.com (t = text incl. footnote markers, f = footnotes).",
        ...m,
        source: "QuranEnc.com",
        url: `https://quranenc.com/en/browse/${m.key}`,
        api: `https://quranenc.com/api/v1/translation/sura/${m.key}/{sura}`,
        fetchedAt,
        suras: rows,
      }) + "\n",
    );
    console.log(`✓ ${m.key} v${m.version}`);
  }

  // reflections.json: fallback jedes Eintrags aus denselben Daten.
  const file = join(root, "data", "reflections.json");
  const data = JSON.parse(await readFile(file, "utf8"));
  for (const e of data.entries) {
    const [s, a] = e.verse.split(":").map(Number);
    const en = editions.en[s - 1][a - 1];
    const de = editions.de[s - 1][a - 1];
    const footnotes = {};
    if (de.f) footnotes.de = de.f;
    if (en.f) footnotes.en = en.f;
    e.fallback = { arabic: suras[s - 1][a - 1], de: de.t, en: en.t, footnotes };
  }
  await writeFile(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`✓ reflections.json (${data.entries.length} Verse)`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
