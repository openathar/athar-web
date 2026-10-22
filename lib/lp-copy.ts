import type { Locale } from "./i18n";

/**
 * Texte der drei Landing-Varianten (/1, /2, /3). Von Hand je Sprache
 * geschrieben, nicht uebersetzt — gleiche Regeln wie in landing-copy.ts:
 * kurze Saetze, konkrete Dinge, nichts Unbelegtes.
 * Feature-, Versprechen- und Mitmach-Texte kommen aus landing-copy.ts.
 */
export type LpCopy = {
  common: {
    skip: string;
    variant: string;
    fullSite: string;
    github: string;
    developers: string;
    footer: string;
    city: string;
    next: string;
    now: string;
    sunrise: string;
    sunset: string;
    tryIt: string;
  };
  v1: { eyebrow: string; title: [string, string]; lead: string; featTitle: string; codeTitle: string; codeLead: string; };
  v2: { eyebrow: string; title: [string, string]; lead: string; factsTitle: string; datesTitle: string; featTitle: string; growHint: string; faces: { title: string; hint: string; inDays: string; today: string; days: string }; chapters: Record<"roots" | "trunk" | "branches" | "crown" | "fruit" | "seeds", { name: string; title: string }> };
  v3: { emotions: EmotionCopy; eyebrow: string; title: [string, string]; lead: string; word: string; ayahLabel: string; waysTitle: string; commitLabel: string };
};

export type EmotionCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  source: string;
  sourceUrl: string;
  chest: string;
  belly: string;
  hint: string;
  counterpart: string;
  sideStrong: string;
  sideWeak: string;
  sideMid: string;
  all: string;
  count: string;
  heart: { name: string; body: string };
  /** Reihenfolge: Liebe, Hass, Angst, Trauer, Vertrauen, Frieden */
  items: { name: string; body: string }[];
  alt: string;
};

export const lpCopy: Record<Locale, LpCopy> = {
  en: {
    common: {
      skip: "Skip to content",
      variant: "Version",
      fullSite: "Full site",
      github: "GitHub",
      developers: "Developers",
      footer: "Free. No ads. No tracking. Open source under the MIT licence.",
      city: "City",
      next: "Next",
      now: "Now",
      sunrise: "Sunrise",
      sunset: "Sunset",
      tryIt: "Open the tools",
    },
    v1: {
      eyebrow: "Today, worked out on your device",
      title: ["The day,", "to the minute."],
      lead: "Prayer times from the position of the sun. No server involved, no account, nothing that follows you around.",
      featTitle: "Five things meant to last.",
      codeTitle: "Check the maths yourself.",
      codeLead: "The same calculation runs in the app, in the API and in the TypeScript package. Pick any city above and compare.",
    },
    v2: {
      eyebrow: "The moon, as it is tonight",
      title: ["The moon needs", "no account."],
      lead: "Real surface, real phase. The light on it comes from the same maths as the prayer times and the Hijri date.",
      factsTitle: "Tonight",
      datesTitle: "What's coming",
      featTitle: "Five things meant to last.",
      growHint: "Scroll, and the tree grows.",
      faces: { title: "Eight faces of one moon", hint: "Pick one: when does it come back?", inDays: "in", today: "tonight", days: "days" },
      chapters: {
        roots: { name: "Calculation", title: "Calculated on your device." },
        trunk: { name: "Features", title: "What's inside." },
        branches: { name: "Idea", title: "Read, pray, pass it on." },
        crown: { name: "Calendar", title: "Dates and signs of the day." },
        fruit: { name: "API", title: "Build on it." },
        seeds: { name: "Take part", title: "Three ways to help." },
      },
    },
    v3: {
      emotions: {
        eyebrow: "an idea worth a look",
        title: "Feelings grow like a tree.",
        lead: "Roots in the belly, branches in the chest, and in the middle the heart, like a flower. In the model of the researcher Amin Sabry, every feeling has its own place on this tree. Tap one.",
        note: "A researcher's model, not a medical claim.",
        source: "Source: Amin Sabry, “The Tree of Feelings”",
        sourceUrl: "https://www.aminsabry.net/%d8%b4%d8%ac%d8%b1%d8%a9-%d8%a7%d9%84%d9%85%d8%b4%d8%a7%d8%b9%d8%b1/",
        chest: "Chest · branches",
        belly: "Belly · roots",
        hint: "Tap a feeling on the tree.",
        counterpart: "Its counterpart",
        sideStrong: "Right side of the body · stronger",
        sideWeak: "Left side of the body · weaker",
        sideMid: "Centre",
        all: "All {n} feelings",
        count: "The map counts 135 feelings and sensors. {n} of them are here.",
        heart: { name: "The heart", body: "A flower in the middle of the tree, in the centre of the chest." },
        items: [
          { name: "Love", body: "A branch in the chest. You feel love there, not in the belly." },
          { name: "Hatred", body: "Its sensors sit in the belly, which is why it turns your stomach." },
          { name: "Fear", body: "Tied to the unknown and the future. It sits in the chest." },
          { name: "Sadness", body: "About something that already happened or was lost. It sits in the belly." },
          { name: "Trust in the unseen", body: "Faith and the feeling of safety sit in the chest, on the branches." },
          { name: "Peace", body: "Sits in the belly. When it is lost, the stomach is the first to know." },
        ],
        alt: "A human torso with a tree inside: roots in the belly, branches in the chest and a flower at the heart",
      },
      eyebrow: "Sadaqah Jariyah · open source",
      title: ["Leave", "your Athar."],
      lead: "Athar means trace. This is a tool built so the good it does keeps running, long after the people who built it have moved on.",
      word: "أثر",
      ayahLabel: "where the word comes from",
      waysTitle: "Three ways to leave one.",
      commitLabel: "the first commit",
    },
  },
  de: {
    common: {
      skip: "Zum Inhalt",
      variant: "Version",
      fullSite: "Ganze Seite",
      github: "GitHub",
      developers: "Entwickler",
      footer: "Kostenlos. Ohne Werbung. Ohne Tracking. Open Source unter MIT-Lizenz.",
      city: "Stadt",
      next: "Als Nächstes",
      now: "Jetzt",
      sunrise: "Sonnenaufgang",
      sunset: "Sonnenuntergang",
      tryIt: "Werkzeuge öffnen",
    },
    v1: {
      eyebrow: "Heute, auf deinem Gerät ausgerechnet",
      title: ["Der Tag,", "auf die Minute."],
      lead: "Gebetszeiten aus dem Stand der Sonne. Ohne Server, ohne Konto, ohne etwas, das dir hinterherläuft.",
      featTitle: "Fünf Dinge, die bleiben sollen.",
      codeTitle: "Rechne selbst nach.",
      codeLead: "Dieselbe Rechnung läuft in der App, in der API und im TypeScript-Paket. Wähl oben eine Stadt und vergleiche.",
    },
    v2: {
      eyebrow: "Der Mond, wie er heute Nacht steht",
      title: ["Der Mond braucht", "kein Konto."],
      lead: "Echte Oberfläche, echte Phase. Das Licht darauf kommt aus derselben Rechnung wie Gebetszeiten und Hijri-Datum.",
      factsTitle: "Heute Nacht",
      datesTitle: "Was ansteht",
      featTitle: "Fünf Dinge, die bleiben sollen.",
      growHint: "Scroll, und der Baum wächst.",
      faces: { title: "Acht Gesichter eines Mondes", hint: "Wähl eins: wann kommt es wieder?", inDays: "in", today: "heute Nacht", days: "Tagen" },
      chapters: {
        roots: { name: "Rechnen", title: "Gerechnet auf deinem Gerät." },
        trunk: { name: "Funktionen", title: "Was drinsteckt." },
        branches: { name: "Idee", title: "Lesen, beten, weitergeben." },
        crown: { name: "Kalender", title: "Daten und Zeichen des Tages." },
        fruit: { name: "API", title: "Darauf bauen." },
        seeds: { name: "Mitmachen", title: "Drei Wege, zu helfen." },
      },
    },
    v3: {
      emotions: {
        eyebrow: "ein Gedanke zum Anschauen",
        title: "Gefühle wachsen wie ein Baum.",
        lead: "Wurzeln im Bauch, Äste in der Brust, und in der Mitte das Herz, wie eine Blume. Im Modell des Forschers Amin Sabry hat jedes Gefühl seinen eigenen Platz an diesem Baum. Tipp eins an.",
        note: "Das Modell eines Forschers, keine medizinische Aussage.",
        source: "Quelle: Amin Sabry, „Der Baum der Gefühle“",
        sourceUrl: "https://www.aminsabry.net/%d8%b4%d8%ac%d8%b1%d8%a9-%d8%a7%d9%84%d9%85%d8%b4%d8%a7%d8%b9%d8%b1/",
        chest: "Brust · Äste",
        belly: "Bauch · Wurzeln",
        hint: "Tipp ein Gefühl am Baum an.",
        counterpart: "Sein Gegenstück",
        sideStrong: "Rechte Körperseite · stärker",
        sideWeak: "Linke Körperseite · schwächer",
        sideMid: "Mitte",
        all: "Alle {n} Gefühle",
        count: "Die Karte zählt 135 Gefühle und Sensoren. {n} davon sind hier.",
        heart: { name: "Das Herz", body: "Eine Blume in der Mitte des Baums, im Zentrum der Brust." },
        items: [
          { name: "Liebe", body: "Ein Ast in der Brust. Liebe spürst du dort, nicht im Bauch." },
          { name: "Hass", body: "Seine Sensoren sitzen im Bauch, darum dreht er dir den Magen um." },
          { name: "Angst", body: "Gehört zum Unbekannten und zur Zukunft. Sie sitzt in der Brust." },
          { name: "Trauer", body: "Gilt etwas, das schon geschehen oder verloren ist. Sie sitzt im Bauch." },
          { name: "Vertrauen ins Ungesehene", body: "Glaube und das Gefühl von Sicherheit sitzen in der Brust, auf den Ästen." },
          { name: "Frieden", body: "Sitzt im Bauch. Geht er verloren, merkt es der Magen zuerst." },
        ],
        alt: "Ein menschlicher Oberkörper mit einem Baum darin: Wurzeln im Bauch, Äste in der Brust und eine Blume am Herzen",
      },
      eyebrow: "Sadaqah Jariyah · Open Source",
      title: ["Hinterlasse", "deinen Athar."],
      lead: "Athar heißt Spur. Dieses Werkzeug ist gebaut, damit das Gute weiterläuft, auch wenn die, die es gebaut haben, längst woanders sind.",
      word: "أثر",
      ayahLabel: "woher das Wort kommt",
      waysTitle: "Drei Wege, eine zu hinterlassen.",
      commitLabel: "der erste Commit",
    },
  },
  ar: {
    common: {
      skip: "انتقل إلى المحتوى",
      variant: "النسخة",
      fullSite: "الموقع كاملًا",
      github: "GitHub",
      developers: "المطوّرون",
      footer: "مجاني، بلا إعلانات ولا تتبّع، ومفتوح المصدر برخصة MIT.",
      city: "المدينة",
      next: "التالية",
      now: "الآن",
      sunrise: "الشروق",
      sunset: "الغروب",
      tryIt: "افتح الأدوات",
    },
    v1: {
      eyebrow: "اليوم، محسوبًا على جهازك",
      title: ["اليوم،", "بالدقيقة."],
      lead: "مواقيت الصلاة من موضع الشمس. بلا خادم، وبلا حساب، وبلا شيء يتتبّعك.",
      featTitle: "خمسة أشياء أُريد لها أن تبقى.",
      codeTitle: "تحقّق من الحساب بنفسك.",
      codeLead: "الحساب نفسه يعمل في التطبيق وفي الواجهة البرمجية وفي حزمة TypeScript. اختر مدينة من الأعلى وقارن.",
    },
    v2: {
      eyebrow: "القمر كما هو الليلة",
      title: ["القمر لا يطلب", "تسجيل دخول."],
      lead: "سطح حقيقي وطور حقيقي. الضوء عليه يأتي من الحساب نفسه الذي يُخرج المواقيت والتاريخ الهجري.",
      factsTitle: "الليلة",
      datesTitle: "ما هو قادم",
      featTitle: "خمسة أشياء أُريد لها أن تبقى.",
      growHint: "مرّر الصفحة وشاهد الشجرة تنمو.",
      faces: { title: "ثمانية وجوه لقمر واحد", hint: "اختر وجهًا لترى متى يعود.", inDays: "بعد", today: "الليلة", days: "يومًا" },
      chapters: {
        roots: { name: "الحساب", title: "يُحسب على جهازك." },
        trunk: { name: "الميزات", title: "ما بداخله." },
        branches: { name: "الفكرة", title: "اقرأ، صلِّ، شارِك." },
        crown: { name: "التقويم", title: "تواريخ اليوم وآياته." },
        fruit: { name: "الواجهة البرمجية", title: "ابنِ عليها." },
        seeds: { name: "شارك", title: "ثلاث طرق للمساعدة." },
      },
    },
    v3: {
      emotions: {
        eyebrow: "فكرة تستحق النظر",
        title: "المشاعر شجرة.",
        lead: "جذورها في البطن، وأغصانها في الصدر، وفي وسطها القلب كأنه زهرة. في نموذج الباحث أمين صبري لكل شعور مكانه على هذه الشجرة. المس شعورًا لترى مكانه.",
        note: "هذا نموذج باحث، وليس ادّعاءً طبيًّا.",
        source: "المصدر: أمين صبري، «شجرة المشاعر»",
        sourceUrl: "https://www.aminsabry.net/%d8%b4%d8%ac%d8%b1%d8%a9-%d8%a7%d9%84%d9%85%d8%b4%d8%a7%d8%b9%d8%b1/",
        chest: "الصدر · الأغصان",
        belly: "البطن · الجذور",
        hint: "المس شعورًا على الشجرة.",
        counterpart: "ما يقابله",
        sideStrong: "الجهة اليمنى · أقوى",
        sideWeak: "الجهة اليسرى · أضعف",
        sideMid: "الوسط",
        all: "كل المشاعر ({n})",
        count: "تضم الخريطة ١٣٥ شعورًا ومستشعرًا، وهنا {n} منها.",
        heart: { name: "القلب", body: "زهرة في وسط الشجرة، في منتصف الصدر." },
        items: [
          { name: "الحب", body: "غصن في الصدر. تشعر به هناك، لا في البطن." },
          { name: "الكراهية", body: "مستشعراتها في البطن، ولهذا تشعر بها في بطنك." },
          { name: "الخوف", body: "يرتبط بالمجهول والمستقبل، ومكانه الصدر." },
          { name: "الحزن", body: "يكون على أمر وقع وانتهى أو شيء فُقد، ومكانه البطن." },
          { name: "الإيمان بالغيب", body: "الإيمان والشعور بالأمان في الصدر، على الأغصان." },
          { name: "السلام", body: "مكانه البطن. إذا فُقد كان البطن أول من يشعر." },
        ],
        alt: "جسد إنسان وفي داخله شجرة: جذورها في البطن وأغصانها في الصدر وزهرة عند القلب",
      },
      eyebrow: "صدقة جارية · مفتوح المصدر",
      title: ["اترك", "أثرك."],
      lead: "الأثر ما يبقى بعدك. بُنيت هذه الأداة ليستمر خيرها، حتى بعد أن ينشغل عنها من بناها.",
      word: "أثر",
      ayahLabel: "من أين جاءت الكلمة",
      waysTitle: "ثلاث طرق لتترك أثرًا.",
      commitLabel: "أول إضافة",
    },
  },
};
