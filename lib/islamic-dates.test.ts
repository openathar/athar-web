/**
 * Tests for the Islamic calendar helpers (upcoming events, "today" matching).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hijriEventFor, EVENTS } from "./islamic-dates.ts";

describe("hijriEventFor", () => {
  it("matches a known event by Hijri month and day", () => {
    const eid = hijriEventFor({ day: 1, month: 10 });
    assert.equal(eid?.key, "eid-al-fitr");
  });

  it("returns null when no event falls on that date", () => {
    assert.equal(hijriEventFor({ day: 5, month: 4 }), null);
  });

  it("covers every event defined in EVENTS", () => {
    for (const ev of EVENTS) {
      assert.equal(hijriEventFor({ day: ev.hijriDay, month: ev.hijriMonth })?.key, ev.key);
    }
  });
});