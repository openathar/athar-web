"use client";

import { useEffect, useState } from "react";
import type { Locale } from "~/lib/i18n";
import type { VerseText } from "~/lib/quran";

export type ReflectionEntry = {
  verse: string;
  field: Record<Locale, string>;
  fallback: { arabic: string; de: string; en: string };
  observation: Record<Locale, string>;
};

type Labels = {
  revealed: string;
  observed: string;
  draft: string;
  next: string;
  loading: string;
};

/**
 * "Ein Buch, zwei Erklärungen" — Vers und Beobachtung.
 *
 * Initial gilt der deterministische Tageseintrag (SSR/SEO, gleicher Stand
 * für alle Locales und Caches; der Client korrigiert nach dem Mount auf
 * sein eigenes Datum). Jeder weitere Eintrag kommt per Mausklick vom
 * Backend-Endpoint `/api/reflections` — der löst den Vers live auf und
 * liefert ein anderes Paar zurück.
 */
export function DailySign({
  entries,
  verses,
  locale,
  labels,
  model,
  initialDayIndex,
}: {
  entries: ReflectionEntry[];
  verses: VerseText[];
  locale: Locale;
  labels: Labels;
  model: string;
  initialDayIndex: number;
}) {
  const [dayIndex, setDayIndex] = useState(initialDayIndex);
  const [sign, setSign] = useState(entries[initialDayIndex]);
  const [verse, setVerse] = useState(verses[initialDayIndex]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const i = Math.floor(Date.now() / 86_400_000) % entries.length;
    setDayIndex(i);
    setSign(entries[i]);
    setVerse(verses[i]);
  }, [entries.length, verses]);

  async function loadNext() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reflections?locale=${locale}&exclude=${dayIndex}`);
      if (!res.ok) return;
      const data = await res.json();
      const entry = entries[data.dayIndex];
      setDayIndex(data.dayIndex);
      setSign({
        ...entry,
        field: { ...entry.field, [locale]: data.field },
        observation: { ...entry.observation, [locale]: data.observation },
      });
      setVerse(data.verse);
    } catch {
      // Netz weg — der aktuelle Eintrag bleibt stehen, kein Fehler-Nutzen
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-12 cursor-pointer" onClick={loadNext}>
      <div
        key={dayIndex}
        className="grid gap-px bg-rule md:grid-cols-2 border border-rule"
        aria-busy={loading}
      >
        {/* Offenbarung — unveraendert, zitiert, verlinkt */}
        <div className="rise bg-paper p-8">
          <p className="display italic mb-6 text-gold">
            {labels.revealed} · {verse.key}
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="quran text-[clamp(21px,2.4vw,28px)] leading-[2.1]"
          >
            {verse.arabic}
          </p>
          <p className="mt-6 text-muted">{verse.rendered}</p>
          <p className="display italic mt-6 text-sm text-muted">
            {verse.attribution} ·{" "}
            <a
              href={verse.sourceUrl}
              onClick={(e) => e.stopPropagation()}
              className="underline underline-offset-4 transition hover:text-ink"
            >
              quran.com
            </a>
          </p>
        </div>

        {/* Beobachtung — Maschinenstimme, klar als solche markiert */}
        <div className="rise bg-paper p-8" style={{ animationDelay: "0.1s" }}>
          <p className="mono mb-6 text-accent">
            {labels.observed} · {sign.field[locale]}
          </p>
          <p className="mono text-[0.95rem] leading-relaxed text-ink">
            {sign.observation[locale]}
          </p>
          <p className="mono mt-6 text-muted">
            {labels.draft.replace("{model}", model)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            loadNext();
          }}
          disabled={loading}
          className="mono border border-rule px-5 py-2 text-xs text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {loading ? labels.loading : labels.next} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
