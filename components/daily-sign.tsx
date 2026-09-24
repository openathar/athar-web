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
};

/**
 * "Ein Buch, zwei Erklärungen" — Vers und Beobachtung, ein Eintrag pro Tag.
 *
 * Die Auswahl passiert hier im Client, nicht im Server-Component: `Date.now()`
 * in einer statisch gerenderten Seite würde pro Locale-Cache-Eintrag einfrieren
 * und die Sprachen zeigten an demselben Tag verschiedene Verse. Der Client
 * berechnet den Index deterministisch aus seinem eigenen Datum — identisch für
 * alle Locales, Caches und Server. SSR zeigt den Vers zur Build-Zeit; nach dem
 * Mount übernimmt der heutige Tag.
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

  useEffect(() => {
    setDayIndex(Math.floor(Date.now() / 86_400_000) % entries.length);
  }, [entries.length]);

  const sign = entries[dayIndex];
  const verse = verses[dayIndex];

  return (
    <div className="mt-12 grid gap-px border border-rule bg-rule md:grid-cols-2">
      {/* Offenbarung — unveraendert, zitiert, verlinkt */}
      <div className="bg-paper p-8">
        <p className="mono mb-6 text-gold">
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
        <p className="mono mt-6 text-muted">
          {verse.attribution} ·{" "}
          <a
            href={verse.sourceUrl}
            className="underline underline-offset-4 transition hover:text-ink"
          >
            quran.com
          </a>
        </p>
      </div>

      {/* Beobachtung — Maschinenstimme, klar als solche markiert */}
      <div className="bg-paper p-8">
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
  );
}