import type { Locale } from "~/lib/i18n";

/**
 * Seite /[locale]/app — die App "Athar". Texte folgen dem, was die App wirklich tut
 * (`../mobile`, Stand Build 7, 2026-11-22) und der Store-Beschreibung
 * (`../mobile/docs/store-listing.md`). Ändert sich der Funktionsumfang oder das
 * Datenschutzverhalten der App, MUSS dieser Text mit (und lib/privacy-copy.ts).
 *
 * Zwei Versprechen, die hier nie brechen dürfen:
 * - Die App sammelt keine Daten (App-Store-Angabe "Data Not Collected").
 * - Das App-Repo ist privat: die App nie "Open Source" nennen (offen sind Kern, API, Website).
 *
 * Arabisch: an den arabischen Store-Text angelehnt; braucht wie dieser noch einen
 * muttersprachlichen Proofread.
 */

/** App-Store-Eintrag. Version 1.0 ist bei Apple im Review; der Link wird danach erreichbar. */
export const APP_STORE_URL = "https://apps.apple.com/app/id6837805285";
export const APP_STORE_ID = "6837805285";

/**
 * Google Play: der Eintrag ist vorbereitet (Paket `org.openathar.mobile`), aber noch nicht
 * veröffentlicht (Identitätsprüfung läuft). Sobald die App im Play Store live ist, PLAY_LIVE auf
 * true setzen — dann wird überall (App-Seite, Startseite, Fußzeile) aus "demnächst" ein
 * echter Play-Knopf samt QR-Code.
 */
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=org.openathar.mobile";
export const PLAY_LIVE = false;

/**
 * Screenshots: die einzige Liste. Dateien liegen unter
 * `public/app/screenshots/<locale>/<file>.{avif,webp}` (aus `../mobile/store/screenshots/<locale>/`,
 * auf 660 px Breite verkleinert). Fehlt eine Sprache, wird Englisch gezeigt; fehlt auch die,
 * fällt der Screenshot weg. Reihenfolge = Anzeige.
 */
export const APP_SCREENSHOTS = [
  { file: "01-today", key: "today" },
  { file: "02-qibla", key: "qibla" },
  { file: "03-sky", key: "sky" },
  { file: "04-tasbih", key: "tasbih" },
] as const;
/** Pixelmaße der Dateien für width/height am <img> (Seitenverhältnis 1320 × 2868). */
export const APP_SCREENSHOT_SIZE = { width: 660, height: 1434 } as const;

export type ShotKey = (typeof APP_SCREENSHOTS)[number]["key"];

export type AppCopy = {
  nav: string;
  /** Kurzer Aufruf in Kopfzeile und auf der Startseite. */
  getApp: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: [string, string];
  appName: string;
  lead: string;
  /** Kleine Zeile über dem Store-Namen im Knopf ("Download on the"). */
  storeKicker: string;
  ctaAria: string;
  playKicker: string;
  /** Für den Play-Knopf, sobald PLAY_LIVE. */
  playLiveKicker: string;
  /** Kurz, für die Fußzeile: "Google Play · coming soon". */
  playSoon: string;
  pending: string;
  /** Apples Datenschutz-Etikett, wie es im Store der jeweiligen Sprache heißt. */
  noData: { label: string; body: string };
  qrHint: string;
  qrAria: string;
  iconAlt: string;
  facts: { k: string; v: string }[];
  chapters: Record<"screens" | "features" | "privacy", { name: string; title: string }>;
  features: { title: string; body: string }[];
  sources: string;
  shots: Record<ShotKey, { title: string; body: string }>;
  privacyLead: string;
  privacyPoints: string[];
  privacyLink: string;
  closing: string;
  /** Abschnitt auf der Startseite. */
  band: { eyebrow: string; title: string; lead: string; more: string };
};

export const appCopy: Record<Locale, AppCopy> = {
  en: {
    nav: "App",
    getApp: "Get the app",
    metaTitle: "Athar for iPhone — Prayer Times & Qibla",
    metaDescription:
      "Athar – Prayer Times & Qibla: prayer times calculated on your phone, Qibla on a 3D globe, the moon and the Hijri calendar, tasbih, du’as and the 99 Names. Free, no ads, no account — and no data collected.",
    eyebrow: "The app · iPhone",
    title: ["Prayer times and Qibla,", "on your phone."],
    appName: "Athar – Prayer Times & Qibla",
    lead: "Athar (أثر) means “the trace you leave”. A prayer app built as a Sadaqah Jariyah: free for good, with no ads, no account and no tracking — and it collects no data at all.",
    storeKicker: "Download on the",
    ctaAria: "Download Athar on the App Store",
    playKicker: "Coming soon to",
    playLiveKicker: "Get it on",
    playSoon: "coming soon",
    pending: "Version 1.0 is in Apple’s review right now — the App Store link works as soon as it is approved. Android follows on Google Play.",
    noData: {
      label: "Data Not Collected",
      body: "That is the privacy label on the App Store — and we mean it.",
    },
    qrHint: "On a computer? Point your phone camera at the code to open Athar in the store.",
    qrAria: "QR code: open Athar on the {store}",
    iconAlt: "Athar app icon",
    facts: [
      { k: "Platform", v: "iPhone · Android soon" },
      { k: "Price", v: "Free" },
      { k: "Ads · account · tracking", v: "None" },
      { k: "Data collected", v: "None" },
      { k: "Languages", v: "8" },
    ],
    chapters: {
      screens: { name: "Screens", title: "A look inside." },
      features: { name: "Features", title: "Everything is calculated on your phone." },
      privacy: { name: "Privacy", title: "Your data stays on your phone." },
    },
    features: [
      {
        title: "Prayer times, on the device",
        body: "Calculated on your phone for where you are — no internet needed. Muslim World League, ISNA, Egypt, Umm al-Qura, Karachi or Tehran.",
      },
      { title: "Next-prayer countdown", body: "The prayer you are in, and a live countdown to the next one." },
      {
        title: "Prayer reminders",
        body: "An adhan alarm for each prayer, with a reminder before it and an iqama reminder if you want them. Set locally on your phone — no push service, no server in between.",
      },
      {
        title: "Qibla on a 3D globe",
        body: "A compass around the Earth: the shortest way from where you are to the Kaaba, the distance, and a gentle tick when you face it.",
      },
      {
        title: "Moon and Hijri calendar",
        body: "Tonight’s real moon phase, the Hijri date, the coming Islamic dates and the Sunnah fasting days.",
      },
      {
        title: "Tasbih tree",
        body: "A counter (33 · 33 · 34) that lights a tree with every count. Every full tree joins your grove — counted on your phone only.",
      },
      { title: "Daily du’as", body: "A du’a for each part of the day, quoted from the hadith collections with its source." },
      { title: "The 99 Names of Allah", body: "A Name for today, and all ninety-nine with their meaning." },
      {
        title: "Your heart",
        body: "Choose what you feel — sad, afraid, angry, alone, grateful … — and receive a verse of the Qur’an and a du’a for it.",
      },
      {
        title: "Du’as of the Prophets",
        body: "Nine du’as from the Qur’an — of Adam, Nuh, Ayyub, Ibrahim, Yunus, Musa, Yusuf, Shu’ayb and Muhammad ﷺ — each with an animated scene and its verses word for word.",
      },
      {
        title: "Eight languages, light and dark",
        body: "English, Deutsch, العربية, Polski, Türkçe, Русский, Bosanski, اردو — with full right-to-left support.",
      },
    ],
    sources: "Qur’an text: Tanzil Project (tanzil.net). Translations of the meanings: QuranEnc.com.",
    shots: {
      today: { title: "Today", body: "Hijri date, the moon and the next prayer" },
      qibla: { title: "Qibla", body: "The way to Makkah on a 3D globe" },
      sky: { title: "Sky", body: "Moon phases and fasting days" },
      tasbih: { title: "Your tree", body: "Every tasbih grows a branch" },
    },
    privacyLead:
      "Athar does not know who you are or where you are. Everything that needs your location is worked out on the phone itself.",
    privacyPoints: [
      "Your location never leaves the phone.",
      "The only thing the app sends is the text you type into the city search — to api.openathar.org, to find the place. Never your coordinates, and it is not stored.",
      "No analytics, no crash reporting, no advertising, no account.",
      "Prayer reminders are local notifications — no push service.",
    ],
    privacyLink: "Read the full privacy policy",
    closing: "Free. No ads. No data collected.",
    band: {
      eyebrow: "The app · iPhone",
      title: "Athar on your phone.",
      lead: "Prayer times, Qibla, the moon, tasbih and du’as — calculated on your phone, free, with no ads and no data collected.",
      more: "More about the app",
    },
  },
  de: {
    nav: "App",
    getApp: "App laden",
    metaTitle: "Athar fürs iPhone — Gebetszeiten & Qibla",
    metaDescription:
      "Athar – Gebetszeiten & Qibla: Gebetszeiten auf dem Telefon berechnet, Qibla auf einem 3D-Globus, Mond und Hijri-Kalender, Tasbih, Du’as und die 99 Namen. Kostenlos, ohne Werbung, ohne Konto — und ohne Datenerfassung.",
    eyebrow: "Die App · iPhone",
    title: ["Gebetszeiten und Qibla,", "auf deinem Telefon."],
    appName: "Athar – Gebetszeiten & Qibla",
    lead: "Athar (أثر) heißt „die Spur, die du hinterlässt“. Eine Gebets-App, gebaut als Sadaqah Jariyah: dauerhaft kostenlos, ohne Werbung, ohne Konto und ohne Tracking — und sie erfasst überhaupt keine Daten.",
    storeKicker: "Laden im",
    ctaAria: "Athar im App Store laden",
    playKicker: "Demnächst bei",
    playLiveKicker: "Jetzt bei",
    playSoon: "demnächst",
    pending: "Version 1.0 liegt gerade bei Apple zur Prüfung — der App-Store-Link funktioniert, sobald sie freigegeben ist. Android folgt bei Google Play.",
    noData: {
      label: "Keine Daten erfasst",
      body: "So steht es im Datenschutz-Etikett im App Store — und so meinen wir es.",
    },
    qrHint: "Am Computer? Richte die Kamera deines Handys auf den Code, um Athar im Store zu öffnen.",
    qrAria: "QR-Code: Athar im {store} öffnen",
    iconAlt: "App-Symbol von Athar",
    facts: [
      { k: "Plattform", v: "iPhone · Android folgt" },
      { k: "Preis", v: "Kostenlos" },
      { k: "Werbung · Konto · Tracking", v: "Keins" },
      { k: "Erfasste Daten", v: "Keine" },
      { k: "Sprachen", v: "8" },
    ],
    chapters: {
      screens: { name: "Bildschirme", title: "Ein Blick hinein." },
      features: { name: "Funktionen", title: "Alles wird auf deinem Telefon berechnet." },
      privacy: { name: "Datenschutz", title: "Deine Daten bleiben auf deinem Telefon." },
    },
    features: [
      {
        title: "Gebetszeiten, auf dem Gerät",
        body: "Auf deinem Telefon für deinen Ort berechnet — ganz ohne Internet. Muslim World League, ISNA, Ägypten, Umm al-Qura, Karatschi oder Teheran.",
      },
      { title: "Countdown zum nächsten Gebet", body: "Das Gebet, in dem du gerade bist, und ein laufender Countdown bis zum nächsten." },
      {
        title: "Gebetserinnerungen",
        body: "Ein Adhan-Alarm für jedes Gebet, auf Wunsch mit Erinnerung vorher und Iqama-Erinnerung. Lokal auf deinem Telefon eingestellt — kein Push-Dienst, kein Server dazwischen.",
      },
      {
        title: "Qibla auf einem 3D-Globus",
        body: "Ein Kompass um die Erde: der kürzeste Weg von deinem Ort zur Kaaba, die Entfernung und ein leichter Tick, sobald du zu ihr zeigst.",
      },
      {
        title: "Mond und Hijri-Kalender",
        body: "Die echte Mondphase heute Nacht, das Hijri-Datum, die nächsten islamischen Daten und die Fastentage der Sunnah.",
      },
      {
        title: "Tasbih-Baum",
        body: "Ein Zähler (33 · 33 · 34), der mit jeder Zählung einen Baum erleuchtet. Jeder volle Baum wandert in deinen Hain — gezählt nur auf deinem Telefon.",
      },
      { title: "Du’as für den Tag", body: "Ein Du’a für jede Tageszeit, aus den Hadith-Sammlungen zitiert, mit Quelle." },
      { title: "Die 99 Namen Allahs", body: "Ein Name für heute, und alle neunundneunzig mit ihrer Bedeutung." },
      {
        title: "Dein Herz",
        body: "Wähle, was du fühlst — traurig, ängstlich, wütend, allein, dankbar … — und erhalte dazu einen Vers aus dem Qur’an und ein Du’a.",
      },
      {
        title: "Du’as der Propheten",
        body: "Neun Du’as aus dem Qur’an — von Adam, Nuh, Ayyub, Ibrahim, Yunus, Musa, Yusuf, Schuaib und Muhammad ﷺ — jedes mit einer animierten Szene und seinen Versen im Wortlaut.",
      },
      {
        title: "Acht Sprachen, hell und dunkel",
        body: "Deutsch, English, العربية, Polski, Türkçe, Русский, Bosanski, اردو — mit vollständiger Rechts-nach-links-Unterstützung.",
      },
    ],
    sources: "Qur’an-Text: Tanzil Project (tanzil.net). Übersetzungen der Bedeutungen: QuranEnc.com.",
    shots: {
      today: { title: "Heute", body: "Hijri-Datum, Mond und das nächste Gebet" },
      qibla: { title: "Qibla", body: "Der Weg nach Mekka auf einem 3D-Globus" },
      sky: { title: "Himmel", body: "Mondphasen und Fastentage" },
      tasbih: { title: "Dein Baum", body: "Jedes Tasbih lässt einen Ast wachsen" },
    },
    privacyLead:
      "Athar weiß nicht, wer du bist und wo du bist. Alles, was deinen Standort braucht, wird auf dem Telefon selbst ausgerechnet.",
    privacyPoints: [
      "Dein Standort verlässt das Telefon nie.",
      "Das Einzige, was die App sendet, ist der Text, den du in die Städtesuche tippst — an api.openathar.org, um den Ort zu finden. Nie deine Koordinaten, und er wird nicht gespeichert.",
      "Keine Analyse, keine Absturzberichte, keine Werbung, kein Konto.",
      "Gebetserinnerungen sind lokale Benachrichtigungen — kein Push-Dienst.",
    ],
    privacyLink: "Die ganze Datenschutzerklärung lesen",
    closing: "Kostenlos. Ohne Werbung. Ohne Datenerfassung.",
    band: {
      eyebrow: "Die App · iPhone",
      title: "Athar auf deinem Telefon.",
      lead: "Gebetszeiten, Qibla, Mond, Tasbih und Du’as — auf deinem Telefon berechnet, kostenlos, ohne Werbung und ohne Datenerfassung.",
      more: "Mehr über die App",
    },
  },
  ar: {
    nav: "التطبيق",
    getApp: "حمّل التطبيق",
    metaTitle: "أثر على آيفون — مواقيت الصلاة والقبلة",
    metaDescription:
      "أثر: مواقيت الصلاة والقبلة — مواقيت تُحسب على هاتفك، والقبلة على كرة أرضية ثلاثية الأبعاد، والقمر والتقويم الهجري، والتسبيح والأدعية وأسماء الله الحسنى. مجاني، بلا إعلانات ولا حساب، ولا يجمع أي بيانات.",
    eyebrow: "التطبيق · آيفون",
    title: ["مواقيت الصلاة والقبلة", "على هاتفك."],
    appName: "أثر: مواقيت الصلاة والقبلة",
    lead: "«أثر» هو الأثر الذي تتركه. تطبيق للصلاة مبنيّ صدقةً جارية: مجاني دائمًا، بلا إعلانات، بلا حساب، وبلا تتبّع — ولا يجمع أي بيانات على الإطلاق.",
    storeKicker: "حمّله من",
    ctaAria: "حمّل «أثر» من App Store",
    playKicker: "قريبًا على",
    playLiveKicker: "حمّله من",
    playSoon: "قريبًا",
    pending: "الإصدار ١٫٠ قيد مراجعة Apple الآن — يعمل رابط App Store فور الموافقة عليه. ونسخة أندرويد قادمة على Google Play.",
    noData: {
      label: "لا يتم جمع البيانات",
      body: "هذا ما يقوله ملصق الخصوصية في App Store — ونحن نعنيه.",
    },
    qrHint: "على الحاسوب؟ وجّه كاميرا هاتفك نحو الرمز لفتح «أثر» في المتجر.",
    qrAria: "رمز QR: افتح «أثر» في {store}",
    iconAlt: "أيقونة تطبيق أثر",
    facts: [
      { k: "المنصّة", v: "آيفون · أندرويد قريبًا" },
      { k: "السعر", v: "مجاني" },
      { k: "إعلانات · حساب · تتبّع", v: "لا شيء" },
      { k: "البيانات المجموعة", v: "لا شيء" },
      { k: "اللغات", v: "٨" },
    ],
    chapters: {
      screens: { name: "لقطات", title: "نظرة إلى الداخل." },
      features: { name: "المزايا", title: "كل شيء يُحسب على هاتفك." },
      privacy: { name: "الخصوصية", title: "تبقى بياناتك على هاتفك." },
    },
    features: [
      {
        title: "مواقيت الصلاة على جهازك",
        body: "تُحسب على هاتفك لمكانك — دون حاجة إلى إنترنت. رابطة العالم الإسلامي، ISNA، مصر، أم القرى، كراتشي أو طهران.",
      },
      { title: "العدّ التنازلي للصلاة القادمة", body: "الصلاة التي أنت في وقتها، وعدّ تنازلي حيّ حتى الصلاة التالية." },
      {
        title: "تذكير بالصلاة",
        body: "تنبيه أذان لكل صلاة، مع تذكير قبلها وتذكير بالإقامة إن شئت. يُضبط محليًا على هاتفك — بلا خدمة دفع وبلا خادم وسيط.",
      },
      {
        title: "القبلة على كرة أرضية ثلاثية الأبعاد",
        body: "بوصلة حول الأرض: أقصر طريق من مكانك إلى الكعبة، والمسافة، ونقرة اهتزاز خفيفة حين تتّجه إليها.",
      },
      {
        title: "القمر والتقويم الهجري",
        body: "طور القمر الحقيقي الليلة، والتاريخ الهجري، والمناسبات الإسلامية القادمة، وأيام الصيام من السنّة.",
      },
      {
        title: "شجرة التسبيح",
        body: "عدّاد تسبيح (٣٣ · ٣٣ · ٣٤) يضيء شجرة مع كل تسبيحة. وكل شجرة تكتمل تنضمّ إلى بستانك — يُعَدّ على هاتفك وحده.",
      },
      { title: "أدعية اليوم", body: "دعاء لكل وقت من اليوم، منقول من كتب الحديث مع مصدره." },
      { title: "أسماء الله الحسنى", body: "اسم لهذا اليوم، والأسماء التسعة والتسعون كلها مع معانيها." },
      {
        title: "قلبك",
        body: "اختر ما تشعر به — حزن، خوف، غضب، وحدة، شكر … — فتجد له آية من القرآن ودعاءً.",
      },
      {
        title: "أدعية الأنبياء",
        body: "تسعة أدعية من القرآن — لآدم ونوح وأيوب وإبراهيم ويونس وموسى ويوسف وشعيب عليهم السلام، ولمحمد ﷺ — لكلٍّ منها مشهد متحرّك، وآياته بنصّها.",
      },
      {
        title: "ثماني لغات، فاتح وداكن",
        body: "العربية، English، Deutsch، Polski، Türkçe، Русский، Bosanski، اردو — مع دعم كامل للكتابة من اليمين إلى اليسار.",
      },
    ],
    sources: "نص القرآن: مشروع تنزيل (tanzil.net). ترجمات المعاني: QuranEnc.com.",
    shots: {
      today: { title: "اليوم", body: "التاريخ الهجري والقمر والصلاة القادمة" },
      qibla: { title: "القبلة", body: "الطريق إلى مكة على كرة أرضية ثلاثية الأبعاد" },
      sky: { title: "السماء", body: "أطوار القمر وأيام الصيام" },
      tasbih: { title: "شجرتك", body: "كل تسبيحة تُنبت غصنًا" },
    },
    privacyLead: "لا يعرف «أثر» من أنت ولا أين أنت. كل ما يحتاج إلى موقعك يُحسب على الهاتف نفسه.",
    privacyPoints: [
      "لا يغادر موقعك الهاتف أبدًا.",
      "الشيء الوحيد الذي يرسله التطبيق هو النص الذي تكتبه في بحث المدن — إلى api.openathar.org لإيجاد المكان. لا إحداثياتك أبدًا، ولا يُحفظ.",
      "لا تحليلات، ولا تقارير أعطال، ولا إعلانات، ولا حساب.",
      "التذكير بالصلاة إشعارات محلية — بلا خدمة دفع.",
    ],
    privacyLink: "اقرأ سياسة الخصوصية كاملة",
    closing: "مجاني. بلا إعلانات. لا يجمع أي بيانات.",
    band: {
      eyebrow: "التطبيق · آيفون",
      title: "«أثر» على هاتفك.",
      lead: "مواقيت الصلاة والقبلة والقمر والتسبيح والأدعية — تُحسب على هاتفك، مجانًا، بلا إعلانات ولا جمع للبيانات.",
      more: "المزيد عن التطبيق",
    },
  },
};
