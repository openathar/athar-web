/**
 * Drift-Test: Developer-Portal (lib/api-reference.ts) <-> OpenAPI der Live-API.
 * Offline — vergleicht gegen data/openapi-paths.json (npm run sync:openapi).
 * `roadmap` (geplante Endpunkte) ist bewusst ausgenommen.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { endpoints } from "./api-reference.ts";

const snapshot: string[] = JSON.parse(
  readFileSync(new URL("../data/openapi-paths.json", import.meta.url), "utf8"),
);
const documented = endpoints.map((e) => `${e.method} ${e.path}`);

describe("developer portal vs. live OpenAPI snapshot", () => {
  it("documents every endpoint of the API", () => {
    const missing = snapshot.filter((s) => !documented.includes(s));
    assert.deepEqual(missing, [], `in der API, aber nicht im Portal: ${missing.join(", ")}`);
  });

  it("documents no endpoint the API does not have", () => {
    const extra = documented.filter((s) => !snapshot.includes(s));
    assert.deepEqual(extra, [], `im Portal, aber nicht in der API: ${extra.join(", ")}`);
  });
});
