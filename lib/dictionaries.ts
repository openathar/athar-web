import type { Locale } from "./i18n";

type Dict = {
  meta: { title: string; description: string };
  ayah: { text: string; ref: string };
  hero: { name: string; meaning: string; tagline: string; cta: string; ctaSecondary: string };
  status: { badge: string; text: string };
  what: { heading: string; items: { title: string; body: string }[] };
  promise: { heading: string; items: string[] };
  compute: {
    label: string;
    heading: string;
    body: string;
    names: Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", string>;
    /** {angle} und {factor} werden mit den echten Methodenparametern ersetzt */
    basis: Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", string>;
    maghribOffset: string;
    live: string;
    offline: string;
    source: string;
    localised: string;
  };
  legacy: { label: string; heading: string; body: string[] };
  dates: { label: string; heading: string; intro: string; hijriYear: string };
  signs: {
    label: string;
    heading: string;
    intro: string;
    revealed: string;
    observed: string;
    draft: string;
    source: string;
  };
  campaign: {
    label: string;
    heading: string;
    body: string[];
    closing: string;
    cta: string;
    meta: string[];
  };
  roadmap: { heading: string; phases: { title: string; body: string; state: string }[] };
  theme: { light: string; dark: string };
  tools: {
    nav: string;
    heading: string;
    intro: string;
    prayerHeading: string;
    qibla: {
      heading: string; intro: string; city: string; bearing: string; distance: string; km: string;
      deviceCompass: string; deviceCompassOn: string; deviceCompassDenied: string; fallbackNote: string;
    };
    calendar: {
      heading: string; intro: string; toHijri: string; toGregorian: string;
      day: string; month: string; year: string; result: string; notFound: string;
    };
    moon: {
      heading: string; intro: string; illumination: string; age: string; days: string;
      caveat: string;
      phases: Record<
        "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous" | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent",
        string
      >;
    };
  };
  footer: { madeAs: string; source: string; imprint: string };
};

export const dictionaries: Record<Locale, Dict> = {
  en: {
    meta: {
      title: "Athar — free, ad-free Islamic platform",
      description:
        "Prayer times, Qibla, Quran and Adhkar. 100% free, no ads, no tracking. Open source, built as Sadaqah Jariyah.",
    },
    ayah: {
      text: "And We record what they have put forth and what they left behind (their athar).",
      ref: "Surah Ya-Sin 36:12",
    },
    hero: {
      name: "Athar",
      meaning: "the trace · the footprint · the lasting legacy",
      tagline:
        "A 100% free, ad-free and privacy-respecting Islamic platform — for web, Android and iOS, plus a public API for developers.",
      cta: "Find your Athar",
      ctaSecondary: "Read the architecture",
    },
    status: {
      badge: "Pre-Alpha",
      text: "We are building in the open. Code repositories open at MVP launch.",
    },
    what: {
      heading: "What we are building",
      items: [
        { title: "Precise prayer times", body: "Astronomical offline calculation (MWL, ISNA, Umm Al-Qura and more) after a single location lookup. No connection required afterwards." },
        { title: "Qibla compass", body: "Device sensors plus offline calculation — works without network." },
        { title: "Quran & Adhkar", body: "Offline Mushaf in multiple languages and fonts, Hisn Al-Muslim, Ruqyah and daily Adhkar." },
        { title: "Tracking without surveillance", body: "Khatma goals, digital Tasbeeh and a Ramadan dashboard — your data stays yours." },
        { title: "Public API", body: "A free, rate-limited API for prayer times, calendar conversion and Quran data — for other developers to build on." },
      ],
    },
    promise: {
      heading: "Our promise",
      items: [
        "No ads — ever.",
        "No tracking, no selling of data, no third-party analytics.",
        "No paywalls, no premium tier, no subscriptions.",
        "Fully open source, auditable by anyone.",
      ],
    },
    compute: {
      label: "how a prayer time is found",
      heading: "Not stored. Derived.",
      body:
        "In the app your device derives the times itself — from place, date and the position of the sun. No server needs to know where you pray. Until our own engine ships, this page shows real values from the open Aladhan API, not invented ones.",
      names: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      basis: {
        fajr: "sun {angle}° below the horizon",
        dhuhr: "solar transit",
        asr: "shadow length {factor}×",
        maghrib: "sunset",
        isha: "sun {angle}° below the horizon",
      },
      maghribOffset: " + {offset} min",
      live: "live",
      offline: "last known values",
      source: "source",
      localised: "from your time zone",
    },
    signs: {
      label: "verse & observation",
      heading: "Two books",
      intro:
        "One is recited, the other is measured. We place them side by side and let each keep its own voice — no claim that one proves the other.",
      revealed: "Revelation",
      observed: "Observation",
      draft: "drafted with {model}, running locally · editorially reviewed",
      source: "Source",
    },
    dates: {
      label: "the islamic calendar",
      heading: "What's coming",
      intro: "Computed locally from today's date — not a fixed list, always the next real occurrence.",
      hijriYear: "AH",
    },
    legacy: {
      label: "the question behind it",
      heading: "Code outlives its authors",
      body: [
        "Software written in the nineties still runs today. Its authors are long gone, their names appear nowhere — the code keeps working.",
        "This platform is built on the same question: what of it still runs when no one tends it?",
      ],
    },
    campaign: {
      label: "my athar",
      heading: "My Athar",
      meta: ["commit  athar", "author  ahmad al zoubi", "date    2026 —"],
      body: [
        "I build this platform so that it remains: free, without ads, without tracking.",
        "And as long as someone uses it to pray, the reward continues.",
        "My athar is to inspire. Yours might be a line of code, or a tree, or a mark on the heart of a child who saw how you lived.",
      ],
      closing: "Find your Athar.",
      cta: "Follow the project",
    },
    roadmap: {
      heading: "Roadmap",
      phases: [
        { title: "Web tools", body: "Prayer times (live, location-aware), Qibla compass and Hijri calendar — running in your browser now.", state: "Live" },
        { title: "Calculation core", body: "A single shared library for prayer times, Qibla and Hijri conversion, used by web, API and mobile alike. The web currently computes these itself in JavaScript — this phase replaces that with one portable engine.", state: "In progress" },
        { title: "Public API", body: "Free and rate-limited, documented for third-party developers.", state: "Next" },
        { title: "Mobile apps", body: "Android and iOS — offline-first, reliable Adhan notifications, widgets and Live Activities.", state: "Planned" },
      ],
    },
    theme: { light: "Switch to light", dark: "Switch to dark" },
    tools: {
      nav: "Tools",
      heading: "Tools",
      intro: "Prayer times, Qibla and calendar conversion — computed on this device, right now.",
      prayerHeading: "Prayer times",
      qibla: {
        heading: "Qibla", intro: "Direction to the Kaaba, computed locally from your location.", city: "Location",
        bearing: "Bearing", distance: "Distance", km: "km",
        deviceCompass: "Use device compass", deviceCompassOn: "Device compass active — the dial follows your phone.",
        deviceCompassDenied: "Compass access was not granted. The bearing above is still correct.", fallbackNote: "Detected from your browser's time zone, not from precise location.",
      },
      calendar: {
        heading: "Hijri calendar", intro: "Convert between Gregorian and Hijri dates.", toHijri: "To Hijri",
        toGregorian: "To Gregorian", day: "Day", month: "Month",
        year: "Year", result: "Date", notFound: "No matching date found.",
      },
      moon: {
        heading: "Moon", intro: "Today's real moon phase, rendered in 3D — drag to look around.", illumination: "Illumination",
        age: "Age", days: "days", caveat: "Approximation (±0.5 day). Not a substitute for actual moon sighting when determining religious dates.",
        phases: {
          "new": "New Moon", "waxing-crescent": "Waxing Crescent",
          "first-quarter": "First Quarter", "waxing-gibbous": "Waxing Gibbous",
          "full": "Full Moon", "waning-gibbous": "Waning Gibbous",
          "last-quarter": "Last Quarter", "waning-crescent": "Waning Crescent",
        },
      },
    },
    footer: {
      madeAs: "Built as Sadaqah Jariyah.",
      source: "Source code",
      imprint: "Legal notice",
    },
  },
  de: {
    meta: {
      title: "Athar — kostenlose, werbefreie islamische Plattform",
      description:
        "Gebetszeiten, Qibla, Quran und Adhkar. 100% kostenlos, keine Werbung, kein Tracking. Open Source, als Sadaqah Jariyah gebaut.",
    },
    ayah: {
      text: "Und Wir schreiben auf, was sie vorausgeschickt haben und ihre Spuren (Atharahum).",
      ref: "Surah Ya-Sin 36:12",
    },
    hero: {
      name: "Athar",
      meaning: "die Spur · der Fußabdruck · das bleibende Vermächtnis",
      tagline:
        "Eine zu 100% kostenlose, werbefreie und datenschutzfreundliche islamische Plattform — für Web, Android und iOS, dazu eine öffentliche API für Entwickler.",
      cta: "Finde dein Athar",
      ctaSecondary: "Architektur lesen",
    },
    status: {
      badge: "Pre-Alpha",
      text: "Wir bauen öffentlich. Die Code-Repos werden zum MVP-Launch geöffnet.",
    },
    what: {
      heading: "Was entsteht",
      items: [
        { title: "Präzise Gebetszeiten", body: "Astronomische Offline-Berechnung (MWL, ISNA, Umm Al-Qura u.a.) nach einmaligem Standortabruf. Danach ohne Verbindung nutzbar." },
        { title: "Qibla-Kompass", body: "Gerätesensoren plus Offline-Berechnung — funktioniert ohne Netz." },
        { title: "Quran & Adhkar", body: "Offline-Mushaf in mehreren Sprachen und Schriftarten, Hisn Al-Muslim, Ruqyah und tägliche Adhkar." },
        { title: "Begleitung ohne Überwachung", body: "Khatma-Ziele, digitales Tasbeeh und Ramadan-Dashboard — deine Daten bleiben deine." },
        { title: "Öffentliche API", body: "Eine kostenlose, rate-limitierte API für Gebetszeiten, Kalender-Konvertierung und Quran-Daten — als Grundlage für andere Entwickler." },
      ],
    },
    promise: {
      heading: "Unser Versprechen",
      items: [
        "Keine Werbung — niemals.",
        "Kein Tracking, kein Datenverkauf, keine fremden Analyse-Dienste.",
        "Keine Paywall, kein Premium, keine Abos.",
        "Vollständig Open Source und für jeden überprüfbar.",
      ],
    },
    compute: {
      label: "wie eine Gebetszeit entsteht",
      heading: "Nicht gespeichert. Berechnet.",
      body:
        "In der App rechnet dein Gerät die Zeiten selbst aus — aus Ort, Datum und dem Stand der Sonne. Kein Server muss wissen, wo du betest. Bis unsere eigene Engine steht, zeigt diese Seite echte Werte der offenen Aladhan-API, keine erfundenen.",
      names: {
        fajr: "Fadschr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Ischa",
      },
      basis: {
        fajr: "Sonne {angle}° unter dem Horizont",
        dhuhr: "Sonnenhöchststand",
        asr: "Schattenlänge {factor}×",
        maghrib: "Sonnenuntergang",
        isha: "Sonne {angle}° unter dem Horizont",
      },
      maghribOffset: " + {offset} Min",
      live: "live",
      offline: "zuletzt bekannte Werte",
      source: "Quelle",
      localised: "aus deiner Zeitzone",
    },
    signs: {
      label: "Vers & Beobachtung",
      heading: "Zwei Bücher",
      intro:
        "Das eine wird rezitiert, das andere gemessen. Wir stellen sie nebeneinander und lassen jedem seine eigene Stimme — ohne zu behaupten, das eine beweise das andere.",
      revealed: "Offenbarung",
      observed: "Beobachtung",
      draft: "Entwurf mit {model}, lokal erzeugt · redaktionell geprüft",
      source: "Quelle",
    },
    dates: {
      label: "der islamische Kalender",
      heading: "Was ansteht",
      intro: "Lokal aus dem heutigen Datum berechnet — keine feste Liste, immer der nächste tatsächliche Termin.",
      hijriYear: "n.H.",
    },
    legacy: {
      label: "die Frage dahinter",
      heading: "Code überlebt seine Autoren",
      body: [
        "Software aus den Neunzigern läuft bis heute. Ihre Autoren sind längst weg, ihre Namen stehen nirgends — der Code arbeitet weiter.",
        "Diese Plattform ist mit derselben Frage gebaut: Was davon läuft noch, wenn niemand sie mehr betreut?",
      ],
    },
    campaign: {
      label: "mein Athar",
      heading: "Mein Athar",
      meta: ["commit  athar", "autor   ahmad al zoubi", "datum   2026 —"],
      body: [
        "Ich baue diese Plattform, damit sie bleibt: kostenlos, ohne Werbung, ohne Tracking.",
        "Und solange jemand mit ihr betet, läuft der Lohn weiter.",
        "Mein Athar ist es, zu inspirieren. Deins ist vielleicht eine Zeile Code, oder ein Baum, oder eine Spur im Herzen eines Kindes, das gesehen hat, wie du gelebt hast.",
      ],
      closing: "Finde dein Athar.",
      cta: "Das Projekt verfolgen",
    },
    roadmap: {
      heading: "Roadmap",
      phases: [
        { title: "Web-Werkzeuge", body: "Gebetszeiten (live, standortbezogen), Qibla-Kompass und Hijri-Kalender — laufen jetzt in deinem Browser.", state: "Live" },
        { title: "Berechnungs-Kern", body: "Eine gemeinsame Bibliothek für Gebetszeiten, Qibla und Hijri-Konvertierung, genutzt von Web, API und Mobile gleichermaßen. Das Web rechnet aktuell selbst in JavaScript — diese Phase ersetzt das durch eine einzige portable Engine.", state: "In Arbeit" },
        { title: "Öffentliche API", body: "Kostenlos und rate-limitiert, dokumentiert für Fremdentwickler.", state: "Als Nächstes" },
        { title: "Mobile Apps", body: "Android und iOS — offline-first, zuverlässige Adhan-Benachrichtigungen, Widgets und Live Activities.", state: "Geplant" },
      ],
    },
    theme: { light: "Zu hell wechseln", dark: "Zu dunkel wechseln" },
    tools: {
      nav: "Werkzeuge",
      heading: "Werkzeuge",
      intro: "Gebetszeiten, Qibla und Kalender-Umrechnung — berechnet auf diesem Gerät, jetzt gerade.",
      prayerHeading: "Gebetszeiten",
      qibla: {
        heading: "Qibla", intro: "Richtung zur Kaaba, lokal aus deinem Standort berechnet.", city: "Ort",
        bearing: "Peilung", distance: "Entfernung", km: "km",
        deviceCompass: "Gerätekompass nutzen", deviceCompassOn: "Gerätekompass aktiv — das Ziffernblatt folgt deinem Telefon.",
        deviceCompassDenied: "Kompass-Zugriff wurde nicht erlaubt. Die Peilung oben stimmt trotzdem.", fallbackNote: "Aus der Zeitzone deines Browsers erkannt, nicht aus einer genauen Standortabfrage.",
      },
      calendar: {
        heading: "Hijri-Kalender", intro: "Umrechnung zwischen gregorianischem und Hijri-Datum.", toHijri: "Zu Hijri",
        toGregorian: "Zu Gregorianisch", day: "Tag", month: "Monat",
        year: "Jahr", result: "Datum", notFound: "Kein passendes Datum gefunden.",
      },
      moon: {
        heading: "Mond", intro: "Die tatsächliche heutige Mondphase, in 3D dargestellt — ziehen zum Umsehen.", illumination: "Beleuchtung",
        age: "Alter", days: "Tage", caveat: "Näherung (±0,5 Tage). Kein Ersatz für die tatsächliche Mondsichtung bei religiösen Terminen.",
        phases: {
          "new": "Neumond", "waxing-crescent": "Zunehmende Sichel",
          "first-quarter": "Erstes Viertel", "waxing-gibbous": "Zunehmender Mond",
          "full": "Vollmond", "waning-gibbous": "Abnehmender Mond",
          "last-quarter": "Letztes Viertel", "waning-crescent": "Abnehmende Sichel",
        },
      },
    },
    footer: {
      madeAs: "Gebaut als Sadaqah Jariyah.",
      source: "Quellcode",
      imprint: "Impressum",
    },
  },
  ar: {
    meta: {
      title: "أثر — منصة إسلامية مجانية بلا إعلانات",
      description:
        "مواقيت الصلاة والقبلة والقرآن والأذكار. مجانية بالكامل، بلا إعلانات وبلا تتبّع. مفتوحة المصدر، صدقة جارية.",
    },
    ayah: {
      text: "وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ",
      ref: "سورة يس ٣٦:١٢",
    },
    hero: {
      name: "أثر",
      meaning: "الأثر · الخطوة الباقية · الإرث الدائم",
      tagline:
        "منصة إسلامية مجانية بالكامل، بلا إعلانات وتحترم خصوصيتك — للويب وأندرويد وiOS، مع واجهة برمجية عامة للمطوّرين.",
      cta: "اعثر على أثرك",
      ctaSecondary: "اقرأ البنية التقنية",
    },
    status: {
      badge: "نسخة أولية",
      text: "نبني في العلن. ستُفتح مستودعات الشيفرة عند إطلاق النسخة الأولى.",
    },
    what: {
      heading: "ما الذي نبنيه",
      items: [
        { title: "مواقيت صلاة دقيقة", body: "حساب فلكي دون اتصال (رابطة العالم الإسلامي، ISNA، أم القرى وغيرها) بعد تحديد الموقع مرة واحدة." },
        { title: "بوصلة القبلة", body: "حسّاسات الجهاز مع حساب دون اتصال — تعمل بلا إنترنت." },
        { title: "القرآن والأذكار", body: "مصحف دون اتصال بلغات وخطوط متعددة، حصن المسلم، الرقية والأذكار اليومية." },
        { title: "متابعة دون مراقبة", body: "أهداف الختمة، التسبيح الرقمي ولوحة رمضان — بياناتك تبقى لك." },
        { title: "واجهة برمجية عامة", body: "واجهة مجانية لمواقيت الصلاة وتحويل التقويم وبيانات القرآن — أساس يبني عليه المطوّرون." },
      ],
    },
    promise: {
      heading: "وعدنا",
      items: [
        "بلا إعلانات — أبداً.",
        "بلا تتبّع، بلا بيع بيانات، وبلا أدوات تحليل خارجية.",
        "بلا اشتراكات وبلا نسخة مدفوعة.",
        "مفتوحة المصدر بالكامل ويمكن لأي أحد مراجعتها.",
      ],
    },
    compute: {
      label: "كيف يُستخرج وقت الصلاة",
      heading: "لا تُخزَّن. بل تُحسب.",
      body:
        "في التطبيق يحسب جهازك المواقيت بنفسه — من الموقع والتاريخ وموضع الشمس، فلا يحتاج خادم أن يعرف أين تصلّي. وإلى أن يجهز محرّكنا الخاص، تعرض هذه الصفحة قيماً حقيقية من واجهة Aladhan المفتوحة، لا أرقاماً مخترعة.",
      names: {
        fajr: "الفجر",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
      basis: {
        fajr: "الشمس {angle}° تحت الأفق",
        dhuhr: "زوال الشمس",
        asr: "ظل المثل {factor}×",
        maghrib: "غروب الشمس",
        isha: "الشمس {angle}° تحت الأفق",
      },
      maghribOffset: " + {offset} دقيقة",
      live: "مباشر",
      offline: "آخر قيم معروفة",
      source: "المصدر",
      localised: "حسب منطقتك الزمنية",
    },
    signs: {
      label: "آية ومشاهدة",
      heading: "كتابان",
      intro:
        "أحدهما يُتلى والآخر يُقاس. نضعهما جنباً إلى جنب ونترك لكلٍّ صوته، دون ادّعاء أن أحدهما يُثبت الآخر.",
      revealed: "الوحي",
      observed: "المشاهدة",
      draft: "مسوّدة بنموذج {model} يعمل محلياً · روجعت تحريرياً",
      source: "المصدر",
    },
    dates: {
      label: "التقويم الإسلامي",
      heading: "ما هو قادم",
      intro: "يُحسب محلياً من تاريخ اليوم — ليست قائمة ثابتة، بل الموعد الفعلي القادم دائماً.",
      hijriYear: "هـ",
    },
    legacy: {
      label: "السؤال خلف ذلك",
      heading: "الشيفرة تبقى بعد كاتبها",
      body: [
        "برمجيات كُتبت في التسعينات ما زالت تعمل اليوم. كتّابها رحلوا منذ زمن ولا تُذكر أسماؤهم — والشيفرة تواصل عملها.",
        "وهذه المنصة مبنية على السؤال نفسه: ما الذي سيبقى يعمل منها حين لا يرعاها أحد؟",
      ],
    },
    campaign: {
      label: "أَثَرِي",
      heading: "أَثَرِي",
      meta: ["Commit:  athar", "المؤلف:  أحمد الزعبي", "التاريخ: ٢٠٢٦"],
      body: [
        "أَبْنِي هَذِهِ المَنَصَّةَ لِتَبْقَى: مَجَّانِيَّةً، بِلَا إِعْلَانَاتٍ، وَبِلَا تَتَبُّعٍ.",
        "وَمَا دَامَ هُنَاكَ مَنْ يَسْتَعِينُ بِهَا عَلَى الصَّلَاةِ، يَسْتَمِرُّ الأَجْرُ.",
        "أَثَرِي أَنْ أُلْهِمَ.. وَأَثَرُكَ لَعَلَّهُ سَطْرُ كُودٍ، أَوْ شَجَرَةٌ، أَوْ أَثَرٌ فِي قَلْبِ طِفْلٍ رَأَى كَيْفَ عِشْتَ.",
      ],
      closing: "اعْثُرْ عَلَى أَثَرِكَ.",
      cta: "تابع المشروع",
    },
    roadmap: {
      heading: "خارطة الطريق",
      phases: [
        { title: "أدوات الويب", body: "مواقيت الصلاة (مباشرة وحسب الموقع)، بوصلة القبلة، والتقويم الهجري — تعمل الآن في متصفحك.", state: "متاح" },
        { title: "نواة الحساب", body: "مكتبة واحدة مشتركة لمواقيت الصلاة والقبلة وتحويل التقويم، يستخدمها الويب والواجهة البرمجية والتطبيقات معاً. يحسبها الويب حالياً بنفسه بلغة JavaScript — هذه المرحلة تستبدل ذلك بمحرك واحد قابل للنقل.", state: "قيد العمل" },
        { title: "الواجهة البرمجية العامة", body: "مجانية ومحدودة المعدّل وموثّقة للمطوّرين.", state: "التالي" },
        { title: "تطبيقات الجوال", body: "أندرويد وiOS — تعمل دون اتصال، تنبيهات أذان موثوقة، ودجات وأنشطة مباشرة.", state: "مخطط" },
      ],
    },
    theme: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
    tools: {
      nav: "أدوات",
      heading: "أدوات",
      intro: "مواقيت الصلاة والقبلة وتحويل التقويم — تُحسب على هذا الجهاز، الآن.",
      prayerHeading: "مواقيت الصلاة",
      qibla: {
        heading: "القبلة", intro: "اتجاه الكعبة، يُحسب محلياً من موقعك.", city: "الموقع",
        bearing: "الاتجاه", distance: "المسافة", km: "كم",
        deviceCompass: "استخدم بوصلة الجهاز", deviceCompassOn: "بوصلة الجهاز مفعّلة — يتبع القرص هاتفك.",
        deviceCompassDenied: "لم يُسمح بالوصول إلى البوصلة. الاتجاه أعلاه صحيح رغم ذلك.", fallbackNote: "اكتُشف من المنطقة الزمنية للمتصفح، لا من تحديد موقع دقيق.",
      },
      calendar: {
        heading: "التقويم الهجري", intro: "التحويل بين التاريخ الميلادي والهجري.", toHijri: "إلى هجري",
        toGregorian: "إلى ميلادي", day: "اليوم", month: "الشهر",
        year: "السنة", result: "التاريخ", notFound: "لم يُعثر على تاريخ مطابق.",
      },
      moon: {
        heading: "القمر", intro: "طور القمر الحقيقي اليوم، معروض ثلاثي الأبعاد — اسحب للتدوير.", illumination: "الإضاءة",
        age: "العمر", days: "يوم", caveat: "تقريب (±٠٫٥ يوم). ليس بديلاً عن رؤية الهلال الفعلية عند تحديد المواعيد الدينية.",
        phases: {
          "new": "محاق", "waxing-crescent": "هلال متزايد",
          "first-quarter": "التربيع الأول", "waxing-gibbous": "أحدب متزايد",
          "full": "بدر", "waning-gibbous": "أحدب متناقص",
          "last-quarter": "التربيع الأخير", "waning-crescent": "هلال متناقص",
        },
      },
    },
    footer: {
      madeAs: "بُنيت كصدقة جارية.",
      source: "الشيفرة المصدرية",
      imprint: "بيانات الناشر",
    },
  },
};
