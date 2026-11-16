#!/usr/bin/env node
/**
 * Holt die OpenAPI-Spec der Live-API und schreibt data/openapi-paths.json:
 * sortierte Liste "METHOD /pfad", nur Pfade unter /v1.
 *
 * Das Snapshot ist die Referenz fuer lib/api-reference.test.ts (offline).
 * Nach einer API-Aenderung: `npm run sync:openapi`, dann lib/api-reference.ts
 * angleichen, bis `npm test` gruen ist. Nicht erreichbare API -> Exit 1.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL_DOCS = process.env.OPENAPI_URL ?? "https://api.openathar.org/v3/api-docs";
const METHODS = ["get", "post", "put", "patch", "delete", "head", "options"];
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "openapi-paths.json");

const res = await fetch(URL_DOCS, { signal: AbortSignal.timeout(20_000) });
if (!res.ok) {
  console.error(`GET ${URL_DOCS} -> HTTP ${res.status}`);
  process.exit(1);
}
const spec = await res.json();
const entries = [];
for (const [path, item] of Object.entries(spec.paths ?? {})) {
  if (!path.startsWith("/v1")) continue;
  for (const m of METHODS) if (item[m]) entries.push(`${m.toUpperCase()} ${path}`);
}
entries.sort();
if (entries.length === 0) {
  console.error("Keine /v1-Pfade in der Spec gefunden — nichts geschrieben.");
  process.exit(1);
}
await writeFile(out, JSON.stringify(entries, null, 2) + "\n");
console.log(`${entries.length} Pfade -> ${out}`);
