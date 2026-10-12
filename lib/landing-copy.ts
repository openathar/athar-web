import type { Locale } from "./i18n";

/**
 * Texte der Startseite, die nicht in `dictionaries.ts` stehen (Hero, Rhythmus,
 * Entwickler, Mitmachen). Bewusst von Hand pro Sprache geschrieben, nicht
 * uebersetzt: die arabische Fassung ist keine Wort-fuer-Wort-Uebertragung der
 * deutschen, sondern sagt dasselbe so, wie man es dort sagen wuerde.
 *
 * Regel fuer neue Texte: kurze Saetze, konkrete Dinge, keine Marketing-
 * Floskeln ("nahtlos", "leistungsstark", "Reise"). Was nicht stimmt, steht
 * nicht drin — etwa keine Zahlen, die niemand gemessen hat.
 */
export type LandingCopy = {
  skip: string;
  menu: string;
  nav: { label: string; href: string }[];
  join: string;
  cosmosOrbAlt: string;
  cosmos: { zoomIn: string; zoomOut: string; zoomReset: string; zoomHint: string };
  hero: {
    eyebrow: string;
    /** Zwei Zeilen: die zweite wird gedaempft gesetzt. */
    title: [string, string];
    lead: string;
    stats: { value: string; label: string }[];
  };
  what: { title: string; imgAlt: string; items: { title: string; body: string }[] };
  ways: {
    label: string;
    words: [string, string, string];
    bodies: [string, string, string];
    imgAlt: string;
  };
  promise: {
    title: string;
    lead: string;
    zero: string;
    zeroCaption: string;
    badges: string[];
  };
  dev: {
    label: string;
    title: string;
    lead: string;
    points: string[];
    cta: string;
  };
  state: { label: string; title: string };
  take: {
    label: string;
    title: string;
    lead: string;
    cards: { title: string; body: string; cta: string }[];
    bridgeAlt: string;
    landscapeAlt: string;
  };
};

export const landingCopy: Record<Locale, LandingCopy> = {
  de: {
    skip: "Zum Inhalt",
    menu: "Abschnitte",
    nav: [
      { label: "Was drinsteckt", href: "#what" },
      { label: "Himmel", href: "#cosmos" },
      { label: "Zeichen", href: "#signs" },
      { label: "Versprechen", href: "#promise" },
      { label: "Entwickler", href: "#dev" },
    ],
    join: "Mitmachen",
    cosmos: { zoomIn: "Hineinzoomen", zoomOut: "Herauszoomen", zoomReset: "Ansicht zurücksetzen", zoomHint: "Ziehen zum Drehen · Strg/⌘ + Scroll oder Pinch zum Zoomen" },
    cosmosOrbAlt: "Eine Kugel aus leuchtenden Wurzeln und Ästen, wie ein Netz um die Erde",
    hero: {
      eyebrow: "Islamische Plattform · kostenlos · offen",
      title: ["Eine Spur,", "die weiterläuft."],
      lead: "Gebetszeiten, Qibla, Quran und der islamische Kalender. Kostenlos, ohne Werbung, ohne Tracking, mit offenem Code. Gebaut als Sadaqah Jariyah, damit der Lohn weiterläuft.",
      stats: [
        { value: "100 %", label: "lokal berechnet, kein Server nötig" },
        { value: "0", label: "Tracker, Werbebanner, Konten" },
        { value: "3", label: "Sprachen: Deutsch, English, العربية" },
      ],
    },
    what: {
      title: "Fünf Dinge, die bleiben sollen.",
      imgAlt: "Eine Treppe aus Stein, von Moos und Pflanzen überwachsen, in grünem Licht",
      items: [
        { title: "Gebetszeiten", body: "Astronomisch berechnet, mit den gängigen Methoden. Nach dem ersten Standortabruf läuft es auch ohne Netz." },
        { title: "Qibla-Kompass", body: "Nutzt die Sensoren deines Geräts und rechnet offline." },
        { title: "Quran und Adhkar", body: "Ein Mushaf zum Offline-Lesen, dazu Hisn al-Muslim, Ruqyah und die täglichen Adhkar." },
        { title: "Ohne Überwachung", body: "Khatma-Ziele, Tasbeeh und das Ramadan-Dashboard. Deine Daten bleiben bei dir." },
        { title: "Offene API", body: "Kostenlos und ohne Account: Gebetszeiten, Kalender und Quran-Daten für alle, die darauf aufbauen wollen." },
      ],
    },
    ways: {
      label: "so ist es gedacht",
      words: ["Lesen.", "Beten.", "Weitergeben."],
      bodies: [
        "Vers und Beobachtung nebeneinander. Mondphase, Gebetszeit und Hijri-Datum kommen aus derselben Rechnung.",
        "Die Zeiten rechnet dein Gerät. Kein Konto, keine Cloud, nichts, was dir hinterherläuft.",
        "Der Code liegt offen auf GitHub. Jede Zeile, die jemand beisteuert, läuft weiter, auch wenn er längst woanders ist.",
      ],
      imgAlt: "Zwei Hände aus Wurzeln, die einander berühren, leuchtend grün",
    },
    promise: {
      title: "Frei. Ohne Kleingedrucktes.",
      lead: "Du brauchst kein Konto und keine Mail-Adresse. Es gibt nichts zu bezahlen, nichts, das verkauft wird, und nichts, das im Hintergrund mitliest.",
      zero: "0",
      zeroCaption: "Tracker. Werbung. Datenverkauf.",
      badges: ["Open Source", "MIT-Lizenz", "Ohne Konto"],
    },
    dev: {
      label: "für Entwickler",
      title: "Rechne selbst nach.",
      lead: "Die Berechnung ist ein TypeScript-Paket, das gegen die Java-Bibliothek getestet wird. Jede Gebetszeit kannst du offline auf deinem eigenen Rechner nachprüfen.",
      points: [
        "Typisiert: Gebetszeiten, Hijri-Daten, Mondphasen",
        "Läuft ohne Netz",
        "Referenztests gegen die Java-Quelle",
        "MIT-Lizenz, nichts, woran du hängenbleibst",
      ],
      cta: "Zum Entwicklerportal →",
    },
    state: { label: "Stand der Dinge", title: "Was läuft, was kommt." },
    take: {
      label: "mitmachen",
      title: "Drei Wege, dabei zu sein.",
      lead: "Du musst dafür nicht programmieren können.",
      cards: [
        {
          title: "Benutzen",
          body: "Gebetszeiten, Qibla und Kalender, ohne Anmeldung. Wenn es dir hilft, sag es weiter.",
          cta: "Ausprobieren",
        },
        {
          title: "Mitbauen",
          body: "Fehler melden, übersetzen, Code beisteuern. Jeder Beitrag zählt, auch der kleine.",
          cta: "Auf GitHub mitbauen →",
        },
        {
          title: "Darauf aufbauen",
          body: "Die API ist kostenlos und braucht keinen Account. Bau etwas, das es noch nicht gibt.",
          cta: "Zur API →",
        },
      ],
      bridgeAlt: "Zwei Bäume, deren leuchtende Äste sich über einer Brücke treffen",
      landscapeAlt: "Weite Landschaft im Morgenlicht, grün und blau",
    },
  },

  en: {
    skip: "Skip to content",
    menu: "Sections",
    nav: [
      { label: "What's inside", href: "#what" },
      { label: "Sky", href: "#cosmos" },
      { label: "Signs", href: "#signs" },
      { label: "Promise", href: "#promise" },
      { label: "Developers", href: "#dev" },
    ],
    join: "Join in",
    cosmos: { zoomIn: "Zoom in", zoomOut: "Zoom out", zoomReset: "Reset view", zoomHint: "Drag to turn · Ctrl/⌘ + scroll or pinch to zoom" },
    cosmosOrbAlt: "A sphere of glowing roots and branches, like a net around the earth",
    hero: {
      eyebrow: "Islamic platform · free · open",
      title: ["A trace", "that keeps going."],
      lead: "Prayer times, Qibla, the Qur'an and the Hijri calendar. Free, no ads, no tracking, open code. Built as Sadaqah Jariyah, so the reward keeps running.",
      stats: [
        { value: "100%", label: "calculated locally, no server needed" },
        { value: "0", label: "trackers, ads, accounts" },
        { value: "3", label: "languages: English, Deutsch, العربية" },
      ],
    },
    what: {
      title: "Five things meant to last.",
      imgAlt: "A stone staircase overgrown with moss and plants, lit green",
      items: [
        { title: "Prayer times", body: "Calculated astronomically with the common methods. After the first location lookup it works offline." },
        { title: "Qibla compass", body: "Uses your device's sensors and calculates offline." },
        { title: "Qur'an and Adhkar", body: "A Mushaf you can read offline, plus Hisn al-Muslim, Ruqyah and the daily Adhkar." },
        { title: "No surveillance", body: "Khatma goals, Tasbeeh and the Ramadan dashboard. Your data stays with you." },
        { title: "Open API", body: "Free and without an account: prayer times, calendar and Qur'an data for anyone who wants to build on them." },
      ],
    },
    ways: {
      label: "the idea",
      words: ["Read.", "Pray.", "Pass it on."],
      bodies: [
        "A verse and an observation, side by side. Moon phase, prayer time and Hijri date all come out of the same calculation.",
        "Your device works out the times. No account, no cloud, nothing following you around.",
        "The code is open on GitHub. Every line someone adds keeps running long after they've moved on.",
      ],
      imgAlt: "Two hands made of roots, touching, glowing green",
    },
    promise: {
      title: "Free. No small print.",
      lead: "No account, no email address. Nothing to pay for, nothing sold, nothing quietly reading along in the background.",
      zero: "0",
      zeroCaption: "Trackers. Ads. Data sales.",
      badges: ["Open source", "MIT licence", "No account"],
    },
    dev: {
      label: "for developers",
      title: "Check the maths yourself.",
      lead: "The calculation is a TypeScript package, tested against the Java library. You can re-check any prayer time offline, on your own machine.",
      points: [
        "Typed: prayer times, Hijri dates, moon phases",
        "Runs without a network",
        "Reference tests against the Java source",
        "MIT licence, nothing to get stuck on",
      ],
      cta: "To the developer portal →",
    },
    state: { label: "where things stand", title: "What runs, what's next." },
    take: {
      label: "join in",
      title: "Three ways to be part of it.",
      lead: "You don't need to write code.",
      cards: [
        {
          title: "Use it",
          body: "Prayer times, Qibla and calendar, no sign-up. If it helps you, tell someone.",
          cta: "Try it",
        },
        {
          title: "Help build it",
          body: "Report bugs, translate, send code. Every contribution counts, small ones too.",
          cta: "Build on GitHub →",
        },
        {
          title: "Build on it",
          body: "The API is free and needs no account. Make something that doesn't exist yet.",
          cta: "To the API →",
        },
      ],
      bridgeAlt: "Two trees whose glowing branches meet over a bridge",
      landscapeAlt: "A wide landscape in morning light, green and blue",
    },
  },

  ar: {
    skip: "إلى المحتوى",
    menu: "الأقسام",
    nav: [
      { label: "ما في الداخل", href: "#what" },
      { label: "السماء", href: "#cosmos" },
      { label: "الآيات", href: "#signs" },
      { label: "الوعد", href: "#promise" },
      { label: "للمطوّرين", href: "#dev" },
    ],
    join: "شاركنا",
    cosmos: { zoomIn: "تكبير", zoomOut: "تصغير", zoomReset: "إعادة العرض", zoomHint: "اسحب للتدوير · Ctrl/⌘ مع التمرير أو القرص للتكبير" },
    cosmosOrbAlt: "كرة من جذور وأغصان متوهجة كأنها شبكة حول الأرض",
    hero: {
      eyebrow: "منصّة إسلامية · مجانية · مفتوحة",
      title: ["أثرٌ", "لا ينقطع."],
      lead: "مواقيت الصلاة والقبلة والقرآن والتقويم الهجري. مجانية، بلا إعلانات وبلا تتبّع، وشيفرتها مفتوحة. بُنيت صدقةً جارية ليبقى الأجر.",
      stats: [
        { value: "100%", label: "تُحسب على جهازك، دون حاجة إلى خادم" },
        { value: "0", label: "أدوات تتبّع وإعلانات وحسابات" },
        { value: "3", label: "لغات: العربية، English، Deutsch" },
      ],
    },
    what: {
      title: "خمسة أشياء نريدها أن تبقى.",
      imgAlt: "درج حجري تكسوه الطحالب والنباتات بضوء أخضر",
      items: [
        { title: "مواقيت الصلاة", body: "تُحسب فلكيًا بالطرق المعتمدة. وبعد تحديد الموقع أول مرة تعمل دون إنترنت." },
        { title: "بوصلة القبلة", body: "تستعين بحسّاسات جهازك وتحسب دون اتصال." },
        { title: "القرآن والأذكار", body: "مصحف تقرؤه دون اتصال، مع حصن المسلم والرقية وأذكار اليوم." },
        { title: "بلا مراقبة", body: "أهداف الختمة والتسبيح ولوحة رمضان. وتبقى بياناتك عندك." },
        { title: "واجهة برمجية مفتوحة", body: "مجانية وبلا حساب: مواقيت وتقويم وبيانات القرآن لمن أراد أن يبني عليها." },
      ],
    },
    ways: {
      label: "الفكرة",
      words: ["اقرأ.", "صلِّ.", "شارِك."],
      bodies: [
        "آيةٌ وإلى جانبها مشاهدة. طور القمر ووقت الصلاة والتاريخ الهجري تخرج كلها من حسابٍ واحد.",
        "جهازك هو الذي يحسب المواقيت. لا حساب ولا سحابة، ولا شيء يلاحقك.",
        "الشيفرة مفتوحة على GitHub. وكل سطرٍ يضيفه أحدهم يبقى عاملًا بعد أن ينصرف إلى غيره.",
      ],
      imgAlt: "يدان من جذور تتلامسان بضوء أخضر",
    },
    promise: {
      title: "مجانية. بلا شروط خفية.",
      lead: "لا حساب ولا بريد إلكتروني. لا شيء تدفعه، ولا شيء يُباع، ولا شيء يقرأ خلفك في الخفاء.",
      zero: "0",
      zeroCaption: "تتبّع. إعلانات. بيع بيانات.",
      badges: ["مصدر مفتوح", "رخصة MIT", "بلا حساب"],
    },
    dev: {
      label: "للمطوّرين",
      title: "تحقّق من الحساب بنفسك.",
      lead: "الحساب حزمة TypeScript تُختبر مقابل مكتبة Java. يمكنك مراجعة أي وقت صلاة على جهازك ودون اتصال.",
      points: [
        "مواقيت وتواريخ هجرية وأطوار قمر بأنواع محدّدة",
        "يعمل دون شبكة",
        "اختبارات مرجعية مقابل مصدر Java",
        "رخصة MIT، فلا قيد يُلزمك بشيء",
      ],
      cta: "إلى بوابة المطوّرين ←",
    },
    state: { label: "أين وصلنا", title: "ما يعمل الآن وما هو آتٍ." },
    take: {
      label: "شاركنا",
      title: "ثلاث طرق لتكون معنا.",
      lead: "لا تحتاج أن تكتب شيفرة.",
      cards: [
        {
          title: "استخدمها",
          body: "المواقيت والقبلة والتقويم دون تسجيل. وإن نفعتك فدُلّ غيرك عليها.",
          cta: "جرّبها",
        },
        {
          title: "ساهم في بنائها",
          body: "أبلِغ عن خلل، أو ترجِم، أو أرسل شيفرة. كل مساهمة لها وزنها، ولو صغرت.",
          cta: "ساهم على GitHub ←",
        },
        {
          title: "ابنِ عليها",
          body: "الواجهة البرمجية مجانية ولا تطلب حسابًا. اصنع ما لم يُصنع بعد.",
          cta: "إلى الواجهة البرمجية ←",
        },
      ],
      bridgeAlt: "شجرتان تلتقي أغصانهما المضيئة فوق جسر",
      landscapeAlt: "مشهد واسع في ضوء الصباح بالأخضر والأزرق",
    },
  },
};
