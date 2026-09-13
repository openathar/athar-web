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
    note: string;
    rows: { name: string; time: string; basis: string }[];
  };
  geometry: { label: string; heading: string; body: string };
  campaign: { label: string; heading: string; body: string; cta: string; meta: string[] };
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
      cta: "Leave your Athar",
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
      note: "example output · Amman · 13 Sep",
      rows: [
        { name: "Fajr", time: "04:47", basis: "sun 18° below the horizon" },
        { name: "Dhuhr", time: "12:31", basis: "solar transit" },
        { name: "Asr", time: "15:58", basis: "shadow length 1×" },
        { name: "Maghrib", time: "19:44", basis: "sunset" },
        { name: "Isha", time: "21:22", basis: "sun 17° below the horizon" },
      ],
    },
    geometry: {
      label: "pattern & rule",
      heading: "The same craft",
      body:
        "A girih pattern is not drawn — it is derived. A few rules, repeated faithfully, produce something that never closes the same way twice. Software written well works the same: small, honest rules that survive repetition. Your prayer times are not a lookup table. They are geometry, recomputed on your own device.",
    },
    campaign: {
      label: "the trace you leave",
      heading: "Leave your Athar",
      meta: ["commit  8f3a19c", "author  you", "date    whenever you choose"],
      body:
        "Every contribution stays. A line of code, a translation, a bug report — as long as someone uses this platform to pray, the reward continues. This is Sadaqah Jariyah written in software.",
      cta: "Contribute on GitHub",
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
      cta: "Hinterlasse dein Athar",
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
      note: "Beispielausgabe · Amman · 13. Sep",
      rows: [
        { name: "Fadschr", time: "04:47", basis: "Sonne 18° unter dem Horizont" },
        { name: "Dhuhr", time: "12:31", basis: "Sonnenhöchststand" },
        { name: "Asr", time: "15:58", basis: "Schattenlänge 1×" },
        { name: "Maghrib", time: "19:44", basis: "Sonnenuntergang" },
        { name: "Ischa", time: "21:22", basis: "Sonne 17° unter dem Horizont" },
      ],
    },
    geometry: {
      label: "Muster & Regel",
      heading: "Dasselbe Handwerk",
      body:
        "Ein Girih-Muster wird nicht gezeichnet — es wird hergeleitet. Wenige Regeln, sauber wiederholt, ergeben etwas, das sich nie zweimal gleich schließt. Gut geschriebene Software funktioniert genauso: kleine, ehrliche Regeln, die Wiederholung aushalten. Deine Gebetszeiten sind keine Tabelle. Sie sind Geometrie, neu berechnet auf deinem eigenen Gerät.",
    },
    campaign: {
      label: "die Spur, die du hinterlässt",
      heading: "Hinterlasse dein Athar",
      meta: ["commit  8f3a19c", "autor   du", "datum   wann immer du willst"],
      body:
        "Jeder Beitrag bleibt. Eine Zeile Code, eine Übersetzung, ein Fehlerbericht — solange jemand mit dieser Plattform betet, läuft der Lohn weiter. Das ist Sadaqah Jariyah in Software geschrieben.",
      cta: "Auf GitHub mitmachen",
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
      cta: "اترك أثرك",
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
      note: "مثال · عمّان · ١٣ أيلول",
      rows: [
        { name: "الفجر", time: "٠٤:٤٧", basis: "الشمس ١٨° تحت الأفق" },
        { name: "الظهر", time: "١٢:٣١", basis: "زوال الشمس" },
        { name: "العصر", time: "١٥:٥٨", basis: "ظل المثل" },
        { name: "المغرب", time: "١٩:٤٤", basis: "غروب الشمس" },
        { name: "العشاء", time: "٢١:٢٢", basis: "الشمس ١٧° تحت الأفق" },
      ],
    },
    geometry: {
      label: "النقش والقاعدة",
      heading: "الصنعة ذاتها",
      body:
        "النقش الگيريهي لا يُرسم، بل يُستنبط. قواعد قليلة تُكرَّر بأمانة فتُنتج ما لا ينغلق مرتين على الصورة نفسها. والبرمجة الجيدة كذلك: قواعد صغيرة صادقة تصمد أمام التكرار. مواقيتك ليست جدولاً محفوظاً، بل هندسة تُحسب من جديد على جهازك أنت.",
    },
    campaign: {
      label: "الأثر الذي تتركه",
      heading: "اترك أثرك",
      meta: ["commit  8f3a19c", "المساهم  أنت", "التاريخ  متى شئت"],
      body:
        "كل مساهمة تبقى. سطر برمجي، ترجمة، أو تقرير خلل — ما دام أحدهم يصلّي بهذه المنصة، يستمر الأجر. هذه صدقة جارية مكتوبة بالبرمجة.",
      cta: "ساهم على GitHub",
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
