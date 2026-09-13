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
  };
  legacy: { label: string; heading: string; body: string[] };
  campaign: { label: string; heading: string; body: string; closing: string; cta: string; meta: string[] };
  roadmap: { heading: string; phases: { title: string; body: string; state: string }[] };
  theme: { light: string; dark: string };
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
      body:
        "This platform is my trace. I build it so that it remains: free, without ads, without surveillance — as long as someone prays with it, the reward continues. My athar is to inspire people. Yours is something else. Perhaps a line of code, perhaps a tree, perhaps a child who watched how you lived.",
      closing: "Find your Athar.",
      cta: "Follow the project",
    },
    roadmap: {
      heading: "Roadmap",
      phases: [
        { title: "Calculation core", body: "Prayer times, Qibla and Hijri conversion as one shared library — the single source of truth for web, API and mobile.", state: "In progress" },
        { title: "Public API", body: "Free and rate-limited, documented for third-party developers.", state: "Next" },
        { title: "Web tools", body: "Prayer times, Qibla and calendar directly in the browser.", state: "Planned" },
        { title: "Mobile apps", body: "Android and iOS — offline-first, reliable Adhan notifications, widgets and Live Activities.", state: "Planned" },
      ],
    },
    theme: { light: "Switch to light", dark: "Switch to dark" },
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
      body:
        "Diese Plattform ist meine Spur. Ich baue sie, damit sie bleibt: kostenlos, ohne Werbung, ohne Überwachung — solange jemand mit ihr betet, läuft der Lohn weiter. Mein Athar ist es, Menschen zu inspirieren. Deins ist ein anderes. Vielleicht eine Zeile Code, vielleicht ein Baum, vielleicht ein Kind, das gesehen hat, wie du gelebt hast.",
      closing: "Finde dein Athar.",
      cta: "Das Projekt verfolgen",
    },
    roadmap: {
      heading: "Roadmap",
      phases: [
        { title: "Berechnungs-Kern", body: "Gebetszeiten, Qibla und Hijri-Konvertierung als eine gemeinsame Bibliothek — die einzige Quelle der Wahrheit für Web, API und Mobile.", state: "In Arbeit" },
        { title: "Öffentliche API", body: "Kostenlos und rate-limitiert, dokumentiert für Fremdentwickler.", state: "Als Nächstes" },
        { title: "Web-Werkzeuge", body: "Gebetszeiten, Qibla und Kalender direkt im Browser.", state: "Geplant" },
        { title: "Mobile Apps", body: "Android und iOS — offline-first, zuverlässige Adhan-Benachrichtigungen, Widgets und Live Activities.", state: "Geplant" },
      ],
    },
    theme: { light: "Zu hell wechseln", dark: "Zu dunkel wechseln" },
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
      label: "أثري",
      heading: "أثري",
      meta: ["commit  athar", "المؤلف   أحمد الزعبي", "التاريخ  ٢٠٢٦ —"],
      body:
        "هذه المنصة أثري. أبنيها لتبقى: مجانية، بلا إعلانات، بلا مراقبة — وما دام أحدهم يصلّي بها، يستمر الأجر. أثري أن أُلهم الناس. وأثرك غيره؛ لعلّه سطر برمجي، أو شجرة، أو ولدٌ رأى كيف عشت.",
      closing: "اعثر على أثرك.",
      cta: "تابع المشروع",
    },
    roadmap: {
      heading: "خارطة الطريق",
      phases: [
        { title: "نواة الحساب", body: "مواقيت الصلاة والقبلة وتحويل التقويم الهجري كمكتبة واحدة مشتركة — المرجع الوحيد للويب والواجهة البرمجية والتطبيقات.", state: "قيد العمل" },
        { title: "الواجهة البرمجية العامة", body: "مجانية ومحدودة المعدّل وموثّقة للمطوّرين.", state: "التالي" },
        { title: "أدوات الويب", body: "مواقيت الصلاة والقبلة والتقويم مباشرة في المتصفح.", state: "مخطط" },
        { title: "تطبيقات الجوال", body: "أندرويد وiOS — تعمل دون اتصال، تنبيهات أذان موثوقة، ودجات وأنشطة مباشرة.", state: "مخطط" },
      ],
    },
    theme: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
    footer: {
      madeAs: "بُنيت كصدقة جارية.",
      source: "الشيفرة المصدرية",
      imprint: "بيانات الناشر",
    },
  },
};
