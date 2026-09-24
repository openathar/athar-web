/**
 * Offline-Inhaltsvalidierung für data/reflections.json.
 *
 * Läuft in `npm test` (lib/*.test.ts) und blockiert die Veröffentlichung,
 * wenn irgendein Eintrag einen Fehler liefert. Die Netzwerk-Prüfung — Verse
 * byte-exakt gegen die quran.com-API — macht zusätzlich
 * scripts/verify-verses.mjs (npm run verify:content, CI-Gate).
 */

export type Severity = "error" | "warning";

export type ValidationIssue = {
  severity: Severity;
  code: string;
  path: string;
  message: string;
};

/** Pflicht-Schlüssel je Gruppe (fallback nutzt `arabic` statt `ar`). */
const GROUP_KEYS: Record<string, string[]> = {
  field: ["de", "en", "ar"],
  fallback: ["arabic", "de", "en"],
  observation: ["de", "en", "ar"],
};

/** Standard-Ayah-Zahl je Sura (Index 0 = Sura 1, Index 113 = Sura 114). */
const AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89,
  59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30,
  52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
  21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

/** Lateinische Buchstaben oder ASCII-Ziffern in arabischem Text = Mischschrift. */
const HAS_LATIN = /[A-Za-z0-9]/;

/** Satzende: Satzzeichen, gefolgt von Leerzeichen + Großbuchstabe/arabischem Buchstaben oder Ende. */
const SENTENCE_END = /[.!?؟](?=\s+[\p{Lu}\u0600-\u06FF]|$)/gu;

/** Vokabular, das die Site-Haltung bricht: „der Vers beweist die Wissenschaft". */
const FORBIDDEN_CLAIMS: Record<string, string[]> = {
  de: ["beweis", "beweist", "bewiesen", "vorhergesagt", "prophezeit", "wunder"],
  en: ["proves", "proof", "predicted", "prediction", "miracle"],
  ar: ["تثبت", "إثبات", "تنبأ", "معجزة", "برهان"],
};

type Entry = {
  verse?: unknown;
  field?: Record<string, unknown>;
  fallback?: Record<string, unknown>;
  observation?: Record<string, unknown>;
  reviewed?: unknown;
};

export function validateReflections(data: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const root = data as { provenance?: Record<string, unknown>; entries?: unknown[] };

  if (!Array.isArray(root.entries) || root.entries.length === 0) {
    issues.push({
      severity: "error",
      code: "empty-entries",
      path: "entries",
      message: "entries muss ein nicht-leeres Array sein.",
    });
    return issues;
  }

  const prov = root.provenance;
  if (!prov || typeof prov !== "object") {
    issues.push({
      severity: "error",
      code: "missing-provenance",
      path: "provenance",
      message: "provenance fehlt.",
    });
  } else if (typeof prov.arabicApproved !== "boolean") {
    issues.push({
      severity: "error",
      code: "missing-arabic-approval",
      path: "provenance.arabicApproved",
      message: "arabicApproved (boolean) fehlt.",
    });
  } else if (prov.arabicApproved === false) {
    issues.push({
      severity: "warning",
      code: "arabic-not-approved",
      path: "provenance.arabicApproved",
      message: "Arabische Beobachtungen sind noch nicht muttersprachlich freigegeben.",
    });
  }

  const seenVerses = new Set<string>();

  root.entries.forEach((entry, i) => {
    const path = `entries[${i}]`;
    const e = entry as Entry;

    // Verse-Referenz: Format + Bereich innerhalb des Korans.
    const verse = typeof e.verse === "string" ? e.verse : "";
    const m = /^(\d{1,3}):(\d{1,3})$/.exec(verse);
    if (!m) {
      issues.push({
        severity: "error",
        code: "invalid-verse",
        path: `${path}.verse`,
        message: `Ungültige Vers-Referenz: "${verse}".`,
      });
    } else {
      const surah = Number(m[1]);
      const ayah = Number(m[2]);
      if (surah < 1 || surah > 114 || ayah < 1 || ayah > AYAH_COUNTS[surah - 1]) {
        issues.push({
          severity: "error",
          code: "verse-out-of-range",
          path: `${path}.verse`,
          message: `Vers ${verse} liegt außerhalb des Korans (Sura ${surah} hat ${AYAH_COUNTS[surah - 1] ?? "?"} Ayat).`,
        });
      }
      if (seenVerses.has(verse)) {
        issues.push({
          severity: "error",
          code: "duplicate-verse",
          path: `${path}.verse`,
          message: `Vers ${verse} kommt mehrfach vor.`,
        });
      }
      seenVerses.add(verse);
    }

    // Locale-Vollständigkeit.
    for (const group of ["field", "fallback", "observation"] as const) {
      const g = e[group];
      if (!g || typeof g !== "object") {
        issues.push({
          severity: "error",
          code: "missing-group",
          path: `${path}.${group}`,
          message: `${group} fehlt.`,
        });
        continue;
      }
      for (const key of GROUP_KEYS[group]) {
        const text = g[key];
        if (typeof text !== "string" || text.trim() === "") {
          issues.push({
            severity: "error",
            code: "missing-locale",
            path: `${path}.${group}.${key}`,
            message: `${group}.${key} fehlt oder ist leer.`,
          });
        }
      }
    }

    // Inhalt: keine HTML-/Template-Zeichen, keine Mischschrift im Arabischen.
    const texts: { key: string; text: string }[] = [];
    for (const group of ["field", "fallback", "observation"] as const) {
      const g = e[group] as Record<string, unknown> | undefined;
      if (!g) continue;
      for (const [key, value] of Object.entries(g)) {
        if (typeof value === "string") texts.push({ key: `${group}.${key}`, text: value });
      }
    }
    for (const { key, text } of texts) {
      if (/[<>{}]/.test(text)) {
        issues.push({
          severity: "error",
          code: "html-injection",
          path: `${path}.${key}`,
          message: "Text enthält HTML-/Template-Zeichen (<, >, {, }).",
        });
      }
    }
    for (const key of ["observation.ar", "fallback.arabic"] as const) {
      const [group, loc] = key.split(".");
      const text = (e[group as "observation" | "fallback"] as Record<string, unknown> | undefined)?.[loc];
      if (typeof text === "string" && text.trim() !== "" && HAS_LATIN.test(text)) {
        issues.push({
          severity: "error",
          code: "non-arabic-script",
          path: `${path}.${key}`,
          message: "Arabischer Text enthält lateinische Buchstaben oder ASCII-Ziffern.",
        });
      }
    }

    // Observation: 1–2 Sätze, keine Beweis-Behauptungen.
    const obs = e.observation as Record<string, unknown> | undefined;
    for (const loc of GROUP_KEYS.observation) {
      const text = obs?.[loc];
      if (typeof text !== "string") continue;
      const sentences = text.match(SENTENCE_END)?.length ?? 0;
      if (sentences < 1 || sentences > 2) {
        issues.push({
          severity: "error",
          code: "sentence-count",
          path: `${path}.observation.${loc}`,
          message: `Observation hat ${sentences} Sätze (erlaubt: 1–2).`,
        });
      }
      const lower = text.toLowerCase();
      const banned = FORBIDDEN_CLAIMS[loc].filter((w) => lower.includes(w));
      if (banned.length > 0) {
        issues.push({
          severity: "error",
          code: "forbidden-claim",
          path: `${path}.observation.${loc}`,
          message: `Observation enthält Behauptungs-Vokabular: ${banned.join(", ")}.`,
        });
      }
    }

    // field: kurzer Sachbegriff.
    const field = e.field as Record<string, unknown> | undefined;
    for (const loc of GROUP_KEYS.field) {
      const text = field?.[loc];
      if (typeof text === "string" && text.length > 40) {
        issues.push({
          severity: "error",
          code: "field-too-long",
          path: `${path}.field.${loc}`,
          message: "field-Wert länger als 40 Zeichen.",
        });
      }
    }

    // Review-Metadaten: Eintrag muss redaktionell geprüft sein.
    const reviewed = e.reviewed as Record<string, unknown> | undefined;
    if (
      !reviewed ||
      typeof reviewed !== "object" ||
      typeof reviewed.by !== "string" ||
      reviewed.by.trim() === "" ||
      typeof reviewed.at !== "string" ||
      reviewed.at.trim() === ""
    ) {
      issues.push({
        severity: "error",
        code: "missing-review",
        path: `${path}.reviewed`,
        message: "reviewed (by + at) fehlt — Eintrag muss redaktionell geprüft sein.",
      });
    }
  });

  return issues;
}