/**
 * Blog-Inhalte: jede Sprache vollständig, Slugs eindeutig, Datumsfilter.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { blogPosts, publishedPosts, findPost } from "./blog.ts";

const LOCALES = ["en", "de", "ar"] as const;

describe("blog", () => {
  it("jeder Artikel hat alle Sprachen mit Titel, Beschreibung und Text", () => {
    for (const post of blogPosts) {
      for (const l of LOCALES) {
        const t = post.text[l];
        assert.ok(t, `${post.slug}: Sprache ${l} fehlt`);
        assert.ok(t.title.trim() && t.description.trim(), `${post.slug}/${l}: Titel oder Beschreibung leer`);
        assert.ok(t.sections.length > 0 && t.sections.every((s) => s.p.length > 0), `${post.slug}/${l}: leerer Abschnitt`);
      }
      assert.equal(post.text.en.sections.length, post.text.de.sections.length, `${post.slug}: Abschnitte en/de`);
      assert.equal(post.text.en.sections.length, post.text.ar.sections.length, `${post.slug}: Abschnitte en/ar`);
    }
  });

  it("Slugs sind eindeutig und URL-tauglich", () => {
    const slugs = blogPosts.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("Artikel erscheinen erst ab ihrem Datum, neueste zuerst", () => {
    const day = new Date("2026-11-19T12:00:00Z");
    const visible = publishedPosts(day).map((p) => p.slug);
    assert.deepEqual(visible, ["one-core-two-languages", "prayer-times-on-your-device"]);
    assert.equal(findPost("a-free-public-api", day), undefined);
  });
});
