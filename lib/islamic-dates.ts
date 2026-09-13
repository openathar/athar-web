import { hijriToGregorian, gregorianToHijri } from "./hijri";
import type { Locale } from "./i18n";

/**
 * Wichtige Termine des islamischen Kalenders — reine Kalenderfakten, keine
 * Auslegung. Zwei Punkte bewusst neutral gehalten:
 *
 *  - Mawlid (12. Rabi' al-awwal) ist unter Gelehrten umstritten, ob er
 *    überhaupt begangen werden soll. Hier steht das Datum als Fakt, nicht
 *    als Aufforderung — kein "gefeiert", nur "Geburtstag des Propheten".
 *  - Laylat al-Qadr: die genaue Nacht ist überliefert unbekannt. Üblich ist
 *    die 27. Nacht Ramadans, aber Tradition nennt ausdrücklich alle
 *    ungeraden Nächte der letzten zehn Tage. Das wird als Unsicherheit
 *    benannt, nicht als Festlegung.
 */

type EventDef = {
  key: string;
  hijriMonth: number;
  hijriDay: number;
  name: Record<Locale, string>;
  note: Record<Locale, string>;
};

const EVENTS: EventDef[] = [
  {
    key: "new-year",
    hijriMonth: 1,
    hijriDay: 1,
    name: { en: "Islamic New Year", de: "Islamisches Neujahr", ar: "رأس السنة الهجرية" },
    note: {
      en: "Start of the Hijri year.",
      de: "Beginn des Hijri-Jahres.",
      ar: "بداية السنة الهجرية.",
    },
  },
  {
    key: "ashura",
    hijriMonth: 1,
    hijriDay: 10,
    name: { en: "Ashura", de: "Aschura", ar: "عاشوراء" },
    note: {
      en: "10th of Muharram.",
      de: "10. Muharram.",
      ar: "العاشر من محرّم.",
    },
  },
  {
    key: "mawlid",
    hijriMonth: 3,
    hijriDay: 12,
    name: { en: "Mawlid al-Nabi", de: "Mawlid an-Nabi", ar: "المولد النبوي" },
    note: {
      en: "Birth date of the Prophet ﷺ. Observance of this date is debated among scholars.",
      de: "Geburtsdatum des Propheten ﷺ. Ob dieser Tag begangen werden soll, ist unter Gelehrten umstritten.",
      ar: "تاريخ مولد النبي ﷺ. إحياء هذا اليوم مسألة خلافية بين العلماء.",
    },
  },
  {
    key: "ramadan-start",
    hijriMonth: 9,
    hijriDay: 1,
    name: { en: "Start of Ramadan", de: "Beginn des Ramadan", ar: "بداية رمضان" },
    note: {
      en: "Subject to moon sighting; the calculated date may shift by a day.",
      de: "Abhängig von der Mondsichtung; das berechnete Datum kann um einen Tag abweichen.",
      ar: "مرتبط برؤية الهلال؛ قد يختلف التاريخ المحسوب بيوم واحد.",
    },
  },
  {
    key: "laylat-al-qadr",
    hijriMonth: 9,
    hijriDay: 27,
    name: { en: "Laylat al-Qadr (commonly observed)", de: "Laylat al-Qadr (üblich beobachtet)", ar: "ليلة القدر (المعتاد إحياؤها)" },
    note: {
      en: "The exact night is not specified in tradition — commonly the 27th, but any odd night of the last ten days of Ramadan.",
      de: "Die genaue Nacht ist überliefert unbekannt — üblich ist die 27., überliefert sind aber alle ungeraden Nächte der letzten zehn Ramadan-Tage.",
      ar: "لم تُحدَّد الليلة بعينها في النص — الشائع ليلة ٢٧، لكن الوارد أنها إحدى الليالي الوترية من العشر الأواخر.",
    },
  },
  {
    key: "eid-al-fitr",
    hijriMonth: 10,
    hijriDay: 1,
    name: { en: "Eid al-Fitr", de: "Eid al-Fitr", ar: "عيد الفطر" },
    note: {
      en: "1st of Shawwal, end of Ramadan.",
      de: "1. Schawwal, Ende des Ramadan.",
      ar: "الأول من شوّال، نهاية رمضان.",
    },
  },
  {
    key: "eid-al-adha",
    hijriMonth: 12,
    hijriDay: 10,
    name: { en: "Eid al-Adha", de: "Eid al-Adha", ar: "عيد الأضحى" },
    note: {
      en: "10th of Dhu al-Hijjah, during Hajj.",
      de: "10. Dhu al-Hijjah, während der Hajj.",
      ar: "العاشر من ذي الحجة، أثناء الحج.",
    },
  },
];

export type UpcomingEvent = {
  key: string;
  name: string;
  note: string;
  hijri: { day: number; month: number; year: number };
  gregorian: Date | null;
};

/**
 * Die naechsten Termine ab heute, chronologisch. Fuer jedes Ereignis wird
 * sowohl das laufende als auch das naechste Hijri-Jahr geprueft — sonst
 * wuerde z.B. ein bereits vergangener Ramadan dieses Jahr faelschlich als
 * naechster Termin erscheinen.
 */
export function upcomingIslamicDates(locale: Locale, count = 6): UpcomingEvent[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const currentHijriYear = gregorianToHijri(today, locale).year;

  const candidates: UpcomingEvent[] = [];
  for (const ev of EVENTS) {
    for (const year of [currentHijriYear, currentHijriYear + 1]) {
      const date = hijriToGregorian(year, ev.hijriMonth, ev.hijriDay, locale);
      if (date && date.getTime() >= today.getTime()) {
        candidates.push({
          key: ev.key,
          name: ev.name[locale],
          note: ev.note[locale],
          hijri: { day: ev.hijriDay, month: ev.hijriMonth, year },
          gregorian: date,
        });
        break; // erstes zukuenftiges Vorkommen reicht
      }
    }
  }

  return candidates
    .sort((a, b) => (a.gregorian?.getTime() ?? 0) - (b.gregorian?.getTime() ?? 0))
    .slice(0, count);
}
