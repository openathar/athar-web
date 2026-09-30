/**
 * Anzeige-Zeiten der Startseite (Weltkarte, Erde & Mond). Run with `npm test`.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getPrayerTimesForCoords, nextPrayerKey } from "./prayer-times.ts";

describe("prayer times for display", () => {
  it("matches the core reference for Berlin", () => {
    const t = getPrayerTimesForCoords(52.52, 13.405, "Berlin", "Europe/Berlin", new Date("2026-09-14T12:00:00Z"));
    assert.deepEqual(t.timings, { fajr: "04:38", dhuhr: "13:02", asr: "16:30", maghrib: "19:25", isha: "21:17" });
  });

  // Mitternachtssonne: Maghrib und Isha finden nicht statt. Der Kern liefert
  // dafuer NaN — frueher stand dann "NaN:NaN" auf der Karte.
  it("returns null, not NaN:NaN, for prayers that do not occur (midnight sun)", () => {
    const t = getPrayerTimesForCoords(69.65, 18.96, "Tromsø", "Europe/Oslo", new Date("2026-06-21T12:00:00Z"));
    assert.equal(t.timings.maghrib, null);
    assert.equal(t.timings.isha, null);
    assert.equal(t.timings.fajr, null);
    assert.equal(t.timings.dhuhr, "12:46");
    for (const v of Object.values(t.timings)) assert.notEqual(v, "NaN:NaN");
  });
});

describe("next prayer", () => {
  const berlin = { fajr: "04:38", dhuhr: "13:02", asr: "16:30", maghrib: "19:25", isha: "21:17" };

  it("is the first prayer later than now", () => {
    assert.equal(nextPrayerKey(berlin, "14:00"), "asr");
  });

  it("wraps to tomorrow's Fajr after Isha", () => {
    assert.equal(nextPrayerKey(berlin, "22:00"), "fajr");
  });

  // Als String verglichen war "NaN:NaN" > "14:00" wahr — ein Gebet, das gar
  // nicht stattfindet, wurde als naechstes markiert.
  it("skips prayers that do not occur", () => {
    const polar = { fajr: null, dhuhr: "12:46", asr: "17:58", maghrib: null, isha: null };
    assert.equal(nextPrayerKey(polar, "18:00"), "dhuhr");
    assert.equal(nextPrayerKey(polar, "13:00"), "asr");
  });

  it("is null when no prayer occurs at all", () => {
    assert.equal(nextPrayerKey({ fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null }, "12:00"), null);
  });
});
