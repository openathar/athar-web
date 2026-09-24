/**
 * Tests for the content validation gate (data/reflections.json).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateReflections } from "./content-validation.ts";

const reflections = JSON.parse(
  readFileSync(join(import.meta.dirname, "..", "data", "reflections.json"), "utf8"),
);

describe("content validation", () => {
  it("reflections.json hat keine Fehler", () => {
    const issues = validateReflections(reflections);
    const errors = issues.filter((i) => i.severity === "error");
    assert.deepEqual(errors, [], `Fehler in reflections.json:\n${JSON.stringify(issues, null, 2)}`);
  });

  it("flaggt fehlende Locale", () => {
    const entry = {
      ...reflections.entries[0],
      observation: { de: "Ein Satz.", en: "One sentence." },
    };
    const issues = validateReflections({ ...reflections, entries: [entry] });
    assert.ok(issues.some((i) => i.code === "missing-locale"));
  });

  it("flaggt Beweis-Behauptungen in der Observation", () => {
    const entry = {
      ...reflections.entries[0],
      observation: { de: "Dies beweist die Theorie.", en: "One sentence.", ar: "جملة واحدة." },
    };
    const issues = validateReflections({ ...reflections, entries: [entry] });
    assert.ok(issues.some((i) => i.code === "forbidden-claim"));
  });

  it("flaggt ungültige und außerhalb liegende Vers-Referenzen", () => {
    const bad = { ...reflections.entries[0], verse: "abc" };
    const out = { ...reflections.entries[0], verse: "200:5" };
    const issues = validateReflections({ ...reflections, entries: [bad, out] });
    assert.ok(issues.some((i) => i.code === "invalid-verse"));
    assert.ok(issues.some((i) => i.code === "verse-out-of-range"));
  });

  it("flaggt doppelte Verse", () => {
    const entries = [
      reflections.entries[0],
      { ...reflections.entries[1], verse: reflections.entries[0].verse },
    ];
    const issues = validateReflections({ ...reflections, entries });
    assert.ok(issues.some((i) => i.code === "duplicate-verse"));
  });

  it("flaggt fehlende Review-Metadaten", () => {
    const entry = { ...reflections.entries[0] };
    delete entry.reviewed;
    const issues = validateReflections({ ...reflections, entries: [entry] });
    assert.ok(issues.some((i) => i.code === "missing-review"));
  });

  it("flaggt HTML-Injection", () => {
    const entry = {
      ...reflections.entries[0],
      observation: {
        ...reflections.entries[0].observation,
        en: "<script>alert(1)</script>",
      },
    };
    const issues = validateReflections({ ...reflections, entries: [entry] });
    assert.ok(issues.some((i) => i.code === "html-injection"));
  });

  it("flaggt lateinische Zeichen im arabischen Text", () => {
    const entry = {
      ...reflections.entries[0],
      observation: { ...reflections.entries[0].observation, ar: "جملة hello" },
    };
    const issues = validateReflections({ ...reflections, entries: [entry] });
    assert.ok(issues.some((i) => i.code === "non-arabic-script"));
  });

  it("flaggt Observations mit mehr als zwei Sätzen", () => {
    const entry = {
      ...reflections.entries[0],
      observation: { de: "Eins. Zwei. Drei.", en: "One sentence.", ar: "جملة واحدة." },
    };
    const issues = validateReflections({ ...reflections, entries: [entry] });
    assert.ok(issues.some((i) => i.code === "sentence-count"));
  });
});