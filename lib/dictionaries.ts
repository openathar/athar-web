import type { Locale } from "./i18n";

type Dict = {
  meta: { title: string; description: string };
  ayah: { text: string; ref: string };
  hero: { name: string; meaning: string; cta: string; ctaSecondary: string };
  map: {
    label: string;
    heading: string;
    intro: string;
    useLocation: string;
    locating: string;
    denied: string;
    myLocation: string;
    next: string;
    source: string;
    live: string;
    offline: string;
    names: Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", string>;
  };
  status: { badge: string; text: string };
  what: { heading: string; items: { title: string; body: string }[] };
  promise: { heading: string; items: string[] };
  legacy: { label: string; heading: string; body: string[] };
  dates: { label: string; heading: string; intro: string; hijriYear: string };
  earth: {
    label: string;
    heading: string;
    intro: string;
    pickHint: string;
    currentLocation: string;
    timesFor: string;
    names: Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", string>;
    dayNight: string;
    moonPhase: string;
    phaseNames: Record<
      "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous" | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent",
      string
    >;
    source: string;
  };
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
  nav: { language: string };
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
      cta: "Find your Athar",
      ctaSecondary: "Read the architecture",
    },
    map: {
      label: "world map & prayer times",
      heading: "A city, a map, the times",
      intro: "Pick a city or use your location — the map shows day and night in real time, computed from today's solar position.",
      useLocation: "Use my location",
      locating: "Locating…",
      denied: "Location unavailable — please pick a city.",
      myLocation: "My location",
      next: "Next",
      source: "Source: Aladhan API",
      live: "live",
      offline: "last known values",
      names: { fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
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
    earth: {
      label: "earth & moon",
      heading: "Your place, lit by where the sun actually is",
      intro: "The terminator you see is computed from today's solar position, not painted. The moon shows today's real phase. Click a spot on the earth.",
      pickHint: "Click anywhere on the earth to see prayer times there.",
      currentLocation: "Current location:",
      timesFor: "Prayer times for",
      names: { fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
      dayNight: "Day/night computed from solar position",
      moonPhase: "Moon",
      phaseNames: {
        "new": "New Moon",
        "waxing-crescent": "Waxing Crescent",
        "first-quarter": "First Quarter",
        "waxing-gibbous": "Waxing Gibbous",
        "full": "Full Moon",
        "waning-gibbous": "Waning Gibbous",
        "last-quarter": "Last Quarter",
        "waning-crescent": "Waning Crescent"
      },
      source: "source",
    },
    signs: {
      label: "verse & observation",
      heading: "One book, two explanations",
      intro:
        "One book, two ways to read it: the verse as it was revealed, and the world as it is measured. Neither claims to prove the other.",
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
        { title: "AI Quran explanation", body: "AI that explains the Quran from science and connects it with text, video and images that never existed before.", state: "Vision" },
      ],
    },
    theme: { light: "Switch to light", dark: "Switch to dark" },
    nav: { language: "Language" },
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
      cta: "Finde dein Athar",
      ctaSecondary: "Architektur lesen",
    },
    map: {
      label: "weltkarte & gebetszeiten",
      heading: "Eine Stadt, eine Karte, die Zeiten",
      intro: "Wähle eine Stadt oder verwende deinen Standort — die Karte zeigt Tag und Nacht in Echtzeit, berechnet aus dem heutigen Sonnenstand.",
      useLocation: "Standort verwenden",
      locating: "Orte wird bestimmt…",
      denied: "Standort nicht verfügbar — bitte Stadt wählen.",
      myLocation: "Mein Standort",
      next: "Nächstes",
      source: "Quelle: Aladhan API",
      live: "live",
      offline: "zuletzt bekannte Werte",
      names: { fajr: "Fadschr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Ischa" },
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
    earth: {
      label: "erde & mond",
      heading: "Dein Ort, beleuchtet von dort, wo die Sonne wirklich steht",
      intro: "Die Tag/Nacht-Grenze, die du siehst, ist aus dem heutigen Sonnenstand berechnet, nicht gemalt. Der Mond zeigt die heutige echte Phase. Klicke einen Punkt auf der Erde an.",
      pickHint: "Klicke einen Punkt auf der Erde an, um die Gebetszeiten dort zu sehen.",
      currentLocation: "Aktueller Standort:",
      timesFor: "Gebetszeiten für",
      names: { fajr: "Fadschr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Ischa" },
      dayNight: "Tag/Nacht aus dem Sonnenstand berechnet",
      moonPhase: "Mond",
      phaseNames: {
        "new": "Neumond",
        "waxing-crescent": "Zunehmende Sichel",
        "first-quarter": "Erstes Viertel",
        "waxing-gibbous": "Zunehmender Mond",
        "full": "Vollmond",
        "waning-gibbous": "Abnehmender Mond",
        "last-quarter": "Letztes Viertel",
        "waning-crescent": "Abnehmende Sichel"
      },
      source: "Quelle",
    },
    signs: {
      label: "Vers & Beobachtung",
      heading: "Ein Buch, zwei Erklärungen",
      intro:
        "Ein Buch, zwei Weisen es zu lesen: der Vers, wie er offenbart wurde, und die Welt, wie sie gemessen wird. Keine Seite behauptet, die andere zu beweisen.",
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
        { title: "KI-Erklärung des Quran", body: "KI, die den Quran aus der Wissenschaft erklärt und ihn mit Text, Video und Bildern verbindet, die es nie zuvor gab.", state: "Vision" },
      ],
    },
    theme: { light: "Zu hell wechseln", dark: "Zu dunkel wechseln" },
    nav: { language: "Sprache" },
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
      cta: "اعثر على أثرك",
      ctaSecondary: "اقرأ البنية التقنية",
    },
    map: {
      label: "خريطة العالم وأوقات الصلاة",
      heading: "مدينة، خريطة، أوقات",
      intro: "اختر مدينة أو استخدم موقعك — تعرض الخريطة الليل والنهار لحظيًا، محسوبًا من موضع الشمس اليوم.",
      useLocation: "استخدام موقعي",
      locating: "جارٍ تحديد الموقع…",
      denied: "الموقع غير متاح — الرجاء اختيار مدينة.",
      myLocation: "موقعي",
      next: "القادمة",
      source: "المصدر: Aladhan API",
      live: "مباشر",
      offline: "آخر قيم معروفة",
      names: { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" },
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
    earth: {
      label: "الأرض والقمر",
      heading: "مكانك، مضاءٌ من حيث تقع الشمس فعلاً",
      intro: "حد النهار والليل الذي تراه محسوب من موضع الشمس اليوم، لا مرسوم. والقمر يُظهر طوره الحقيقي اليوم. انقر على نقطة من الأرض.",
      pickHint: "انقر على أي نقطة من الأرض لعرض مواقيت الصلاة فيها.",
      currentLocation: "الموقع الحالي:",
      timesFor: "مواقيت الصلاة في",
      names: { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" },
      dayNight: "النهار والليل محسوبان من موضع الشمس",
      moonPhase: "القمر",
      phaseNames: {
        "new": "محاق",
        "waxing-crescent": "هلال متزايد",
        "first-quarter": "التربيع الأول",
        "waxing-gibbous": "أحدب متزايد",
        "full": "بدر",
        "waning-gibbous": "أحدب متناقص",
        "last-quarter": "التربيع الأخير",
        "waning-crescent": "هلال متناقص"
      },
      source: "المصدر",
    },
    signs: {
      label: "آية ومشاهدة",
      heading: "كتاب واحد وتفسيران",
      intro:
        "كتاب واحد وطريقتان لقراءته: الآية كما أُنزلت، والعالم كما يُقاس. لا تدّعي إحداهما أنها تُثبت الأخرى.",
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
        { title: "شرح القرآن بالذكاء الاصطناعي", body: "ذكاء اصطناعي يشرح القرآن من العلم ويربطه بنصوص وفيديوهات وصور لم توجد من قبل.", state: "رؤية" },
      ],
    },
    theme: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
    nav: { language: "اللغة" },
    footer: {
      madeAs: "بُنيت كصدقة جارية.",
      source: "الشيفرة المصدرية",
      imprint: "بيانات الناشر",
    },
  },
};
