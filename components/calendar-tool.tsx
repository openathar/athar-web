"use client";

import { useMemo, useState } from "react";
import {
  gregorianToHijri,
  hijriToGregorian,
  hijriMonthNames,
  type HijriDate,
} from "~/lib/hijri";
import { toArabicDigits } from "~/lib/prayer-times";
import type { Locale } from "~/lib/i18n";

type Labels = {
  heading: string;
  intro: string;
  toHijri: string;
  toGregorian: string;
  day: string;
  month: string;
  year: string;
  result: string;
  notFound: string;
};

export function CalendarTool({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [mode, setMode] = useState<"toHijri" | "toGregorian">("toHijri");
  const monthNames = useMemo(() => hijriMonthNames(locale), [locale]);
  const rtl = locale === "ar";
  const num = (v: number | string) => (rtl ? toArabicDigits(v) : String(v));
  const intlLocale = locale === "de" ? "de-DE" : locale === "ar" ? "ar-SA" : "en-GB";

  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);

  const [gregInput, setGregInput] = useState(isoToday);
  const [hDay, setHDay] = useState(1);
  const [hMonth, setHMonth] = useState(1);
  const [hYear, setHYear] = useState(gregorianToHijri(today, locale).year);

  let hijriResult: HijriDate | null = null;
  let gregResult: Date | null = null;

  if (mode === "toHijri") {
    const d = new Date(gregInput + "T00:00:00Z");
    if (!Number.isNaN(d.getTime())) hijriResult = gregorianToHijri(d, locale);
  } else {
    gregResult = hijriToGregorian(hYear, hMonth, hDay, locale);
  }

  return (
    <div className="border border-rule bg-surface p-8">
      <div className="mono mb-6 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("toHijri")}
          className={
            mode === "toHijri"
              ? "border border-accent px-3 py-1.5 text-accent"
              : "border border-rule px-3 py-1.5 text-muted transition hover:text-ink"
          }
        >
          {labels.toHijri}
        </button>
        <button
          type="button"
          onClick={() => setMode("toGregorian")}
          className={
            mode === "toGregorian"
              ? "border border-accent px-3 py-1.5 text-accent"
              : "border border-rule px-3 py-1.5 text-muted transition hover:text-ink"
          }
        >
          {labels.toGregorian}
        </button>
      </div>

      {mode === "toHijri" ? (
        <div className="flex flex-wrap items-end gap-4">
          <label className="mono flex flex-col gap-1 text-sm text-muted">
            {labels.result.includes(":") ? labels.result.split(":")[0] : labels.result}
            <input
              type="date"
              value={gregInput}
              onChange={(e) => setGregInput(e.target.value)}
              className="border border-rule bg-paper px-3 py-2 text-ink"
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-wrap items-end gap-4">
          <label className="mono flex flex-col gap-1 text-sm text-muted">
            {labels.day}
            <input
              type="number"
              min={1}
              max={30}
              value={hDay}
              onChange={(e) => setHDay(Number(e.target.value))}
              className="w-20 border border-rule bg-paper px-3 py-2 text-ink"
            />
          </label>
          <label className="mono flex flex-col gap-1 text-sm text-muted">
            {labels.month}
            <select
              value={hMonth}
              onChange={(e) => setHMonth(Number(e.target.value))}
              className="border border-rule bg-paper px-3 py-2 text-ink"
            >
              {monthNames.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="mono flex flex-col gap-1 text-sm text-muted">
            {labels.year}
            <input
              type="number"
              value={hYear}
              onChange={(e) => setHYear(Number(e.target.value))}
              className="w-24 border border-rule bg-paper px-3 py-2 text-ink"
            />
          </label>
        </div>
      )}

      <div className="mono mt-6 border-t border-rule pt-6">
        {mode === "toHijri" && hijriResult && (
          <p className="text-lg">
            <span className="text-gold">
              {num(hijriResult.day)} {hijriResult.monthName} {num(hijriResult.year)}
            </span>
          </p>
        )}
        {mode === "toGregorian" &&
          (gregResult ? (
            <p className="text-lg text-gold">
              {new Intl.DateTimeFormat(intlLocale, {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(gregResult)}
            </p>
          ) : (
            <p className="text-muted">{labels.notFound}</p>
          ))}
      </div>
    </div>
  );
}
