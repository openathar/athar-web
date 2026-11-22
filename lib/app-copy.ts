import type { Locale } from "~/lib/i18n";

/**
 * Seite /[locale]/app — die iOS-App. Texte folgen der Store-Beschreibung
 * (`../mobile/docs/store-listing.md`, Stand 2026-11-22) und beschreiben nur,
 * was die App wirklich tut. Ändert sich der Funktionsumfang oder das
 * Datenschutzverhalten der App, MUSS dieser Text mit (und lib/privacy-copy.ts).
 *
 * Arabisch: aus dem arabischen Store-Text übernommen bzw. daran angelehnt;
 * braucht wie dieser noch einen muttersprachlichen Proofread.
 */

/** App-Store-Eintrag. Wird erst nach Apples Review erreichbar. */
export const APP_STORE_URL = "https://apps.apple.com/app/id6837805285";
export const APP_STORE_ID = "6837805285";
export const APP_SOURCE_URL = "https://github.com/openathar/athar-mobile-app";

/**
 * Google Play: der Eintrag ist vorbereitet (Paket `org.openathar.mobile`), aber noch nicht
 * veröffentlicht. Sobald die App im Play Store live ist, PLAY_LIVE auf true setzen — dann zeigt
 * die Seite den Play-Knopf und den QR-Code statt "folgt".
 */
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=org.openathar.mobile";
export const PLAY_LIVE = false;

/**
 * Screenshots: die einzige Liste der Dateinamen. Erwartet werden PNGs unter
 * `public/app/screenshots/<locale>/<file>` (iPhone-Hochformat, z. B. 1320×2868).
 * Die Seite zeigt nur Dateien, die beim Build existieren — fehlen alle, fällt
 * das Kapitel "Bildschirme" ganz weg. Reihenfolge = Anzeige.
 */
export const APP_SCREENSHOTS = [
  { file: "01-today.png", key: "today" },
  { file: "02-qibla.png", key: "qibla" },
  { file: "03-sky.png", key: "sky" },
  { file: "04-tasbih.png", key: "tasbih" },
  { file: "05-heart.png", key: "heart" },
] as const;
/** Seitenverhältnis der Screenshots (Breite × Höhe in px) für width/height am <img>. */
export const APP_SCREENSHOT_SIZE = { width: 1320, height: 2868 } as const;

type ShotKey = (typeof APP_SCREENSHOTS)[number]["key"];

export type AppCopy = {
  nav: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: [string, string];
  appName: string;
  lead: string;
  cta: string;
  ctaAria: string;
  source: string;
  pending: string;
  android: string;
  /** Beschriftung neben dem QR-Code: mit der Handykamera scannen. */
  qrHint: string;
  qrAria: string;
  playCta: string;
  playSoon: string;
  iconAlt: string;
  facts: { k: string; v: string }[];
  chapters: Record<"features" | "screens" | "privacy" | "source", { name: string; title: string }>;
  features: { title: string; body: string }[];
  shots: Record<ShotKey, string>;
  privacyLead: string;
  privacyPoints: string[];
  privacyLink: string;
  sourceLead: string;
  closing: string;
};

export const appCopy: Record<Locale, AppCopy> = {
  en: {
    nav: "App",
    metaTitle: "Athar for iPhone — Prayer Times & Qibla",
    metaDescription:
      "Athar – Prayer Times & Qibla for iPhone: prayer times calculated on your phone, adhan alarms, Qibla, the Hijri date and the moon. Free, no ads, no accounts, no tracking. Open source.",
    eyebrow: "The app · iPhone",
    title: ["Prayer times and Qibla,", "on your phone."],
    appName: "Athar – Prayer Times & Qibla",
    lead: "Athar (أثر) means “the trace you leave”. A prayer-times app built as a Sadaqah Jariyah: free for good, without ads, without accounts and without tracking. Open source.",
    cta: "App Store",
    ctaAria: "Download Athar on the App Store",
    source: "Source code",
    pending: "The App Store link goes live once Apple has reviewed the app.",
    android: "Android is coming later.",
    qrHint: "Point your phone camera at the code to open Athar in the store.",
    qrAria: "QR code: open Athar on the {store}",
    playCta: "Google Play",
    playSoon: "Google Play · coming soon",
    iconAlt: "Athar app icon",
    facts: [
      { k: "Platform", v: "iPhone" },
      { k: "Price", v: "Free" },
      { k: "Ads · accounts · tracking", v: "None" },
      { k: "Languages", v: "5" },
      { k: "Licence", v: "MIT" },
    ],
    chapters: {
      features: { name: "Features", title: "Everything is calculated on your phone." },
      screens: { name: "Screens", title: "A look inside." },
      privacy: { name: "Privacy", title: "Your location stays on your phone." },
      source: { name: "Open source", title: "Built in the open." },
    },
    features: [
      { title: "Prayer times, offline", body: "For where you are, calculated on your phone — no internet needed." },
      {
        title: "Adhan alarms",
        body: "For each prayer, set locally on your device — with a reminder before the prayer and an iqama reminder if you want them. Athar’s own chime or your phone’s sound. No push service, no server in between.",
      },
      { title: "Qibla compass", body: "With true-north correction, and a haptic tick when you face the Kaaba." },
      { title: "Hijri calendar", body: "Today’s Hijri date and the coming Islamic dates." },
      { title: "The moon tonight", body: "The real moon: its phase, its age, the next new and full moon." },
      {
        title: "Tasbih tree",
        body: "A counter (33 · 33 · 34) that lights a tree with every count. Four dhikr from the Sunnah take turns round by round, and every full tree joins your grove. Counted on your phone only.",
      },
      {
        title: "Your heart",
        body: "Choose what you feel — sad, afraid, angry, alone, grateful … — and receive a verse of the Qur’an and a du’a from the Sunnah for it.",
      },
      {
        title: "Calculation method",
        body: "Muslim World League, ISNA, Egypt, Umm al-Qura, Karachi or Tehran — one choice for the whole app.",
      },
      { title: "Five languages", body: "English, Deutsch, العربية, Polski, Türkçe — with full right-to-left support." },
    ],
    shots: { today: "Today", qibla: "Qibla", sky: "Sky", tasbih: "Tasbih", heart: "Your heart" },
    privacyLead:
      "Athar does not know where you are. Everything that needs your location is worked out on the phone itself.",
    privacyPoints: [
      "Your location never leaves the phone.",
      "The only thing the app sends is the text you type into the city search — to api.openathar.org, to find the place. Never your coordinates.",
      "No analytics, no crash reporting, no advertising, no accounts.",
      "Adhan alarms are local notifications — no push service.",
    ],
    privacyLink: "Read the full privacy policy",
    sourceLead:
      "Athar is built in the open under the MIT licence. The app shares its calculation engine with this website and the public API.",
    closing: "Free. No ads. No tracking.",
  },
  de: {
    nav: "App",
    metaTitle: "Athar fürs iPhone — Gebetszeiten & Qibla",
    metaDescription:
      "Athar: Gebetszeiten & Qibla fürs iPhone — Gebetszeiten auf dem Telefon berechnet, Adhan-Alarme, Qibla, Hijri-Datum und Mond. Kostenlos, ohne Werbung, ohne Konto, ohne Tracking. Open Source.",
    eyebrow: "Die App · iPhone",
    title: ["Gebetszeiten und Qibla,", "auf deinem Telefon."],
    appName: "Athar – Gebetszeiten & Qibla",
    lead: "Athar (أثر) heißt „die Spur, die du hinterlässt“. Eine Gebetszeiten-App, gebaut als Sadaqah Jariyah: dauerhaft kostenlos, ohne Werbung, ohne Konto und ohne Tracking. Open Source.",
    cta: "App Store",
    ctaAria: "Athar im App Store laden",
    source: "Quellcode",
    pending: "Der App-Store-Link ist aktiv, sobald Apple die App geprüft hat.",
    android: "Android folgt später.",
    qrHint: "Richte die Kamera deines Handys auf den Code, um Athar im Store zu öffnen.",
    qrAria: "QR-Code: Athar im {store} öffnen",
    playCta: "Google Play",
    playSoon: "Google Play · folgt",
    iconAlt: "App-Symbol von Athar",
    facts: [
      { k: "Plattform", v: "iPhone" },
      { k: "Preis", v: "Kostenlos" },
      { k: "Werbung · Konto · Tracking", v: "Keins" },
      { k: "Sprachen", v: "5" },
      { k: "Lizenz", v: "MIT" },
    ],
    chapters: {
      features: { name: "Funktionen", title: "Alles wird auf deinem Telefon berechnet." },
      screens: { name: "Bildschirme", title: "Ein Blick hinein." },
      privacy: { name: "Datenschutz", title: "Dein Standort bleibt auf deinem Telefon." },
      source: { name: "Open Source", title: "Offen gebaut." },
    },
    features: [
      { title: "Gebetszeiten, offline", body: "Für deinen Ort, auf dem Telefon berechnet — ganz ohne Internet." },
      {
        title: "Adhan-Alarme",
        body: "Für jedes Gebet, lokal auf deinem Gerät eingestellt — auf Wunsch mit Erinnerung vorher und Iqama-Erinnerung. Athars eigener Klang oder der Ton deines Telefons. Kein Push-Dienst, kein Server dazwischen.",
      },
      { title: "Qibla-Kompass", body: "Mit Korrektur auf geografisch Nord und einem spürbaren Tick, sobald du zur Kaaba zeigst." },
      { title: "Hijri-Kalender", body: "Das heutige Hijri-Datum und die nächsten islamischen Daten." },
      { title: "Der Mond heute Nacht", body: "Der echte Mond: Phase, Alter, nächster Neu- und Vollmond." },
      {
        title: "Tasbih-Baum",
        body: "Ein Zähler (33 · 33 · 34), der mit jeder Zählung einen Baum erleuchtet. Vier Dhikr aus der Sunnah wechseln sich Runde für Runde ab, und jeder volle Baum wandert in deinen Hain. Gezählt nur auf deinem Telefon.",
      },
      {
        title: "Dein Herz",
        body: "Wähle, was du fühlst — traurig, ängstlich, wütend, allein, dankbar … — und erhalte dazu einen Vers aus dem Qur’an und ein Du’a aus der Sunnah.",
      },
      {
        title: "Berechnungsmethode",
        body: "Muslim World League, ISNA, Ägypten, Umm al-Qura, Karatschi oder Teheran — eine Wahl für die ganze App.",
      },
      { title: "Fünf Sprachen", body: "Deutsch, English, العربية, Polski, Türkçe — mit vollständiger Rechts-nach-links-Unterstützung." },
    ],
    shots: { today: "Heute", qibla: "Qibla", sky: "Himmel", tasbih: "Tasbih", heart: "Dein Herz" },
    privacyLead:
      "Athar weiß nicht, wo du bist. Alles, was deinen Standort braucht, wird auf dem Telefon selbst ausgerechnet.",
    privacyPoints: [
      "Dein Standort verlässt das Telefon nie.",
      "Das Einzige, was die App sendet, ist der Text, den du in die Städtesuche tippst — an api.openathar.org, um den Ort zu finden. Nie deine Koordinaten.",
      "Keine Analyse, keine Absturzberichte, keine Werbung, keine Konten.",
      "Adhan-Alarme sind lokale Benachrichtigungen — kein Push-Dienst.",
    ],
    privacyLink: "Die ganze Datenschutzerklärung lesen",
    sourceLead:
      "Athar entsteht offen unter der MIT-Lizenz. Die Berechnung teilt sich die App mit dieser Website und der öffentlichen API.",
    closing: "Kostenlos. Ohne Werbung. Ohne Tracking.",
  },
  ar: {
    nav: "التطبيق",
    metaTitle: "أثر على آيفون — مواقيت الصلاة والقبلة",
    metaDescription:
      "أثر: مواقيت الصلاة والقبلة على آيفون — مواقيت تُحسب على هاتفك، وتنبيهات الأذان، والقبلة، والتاريخ الهجري، والقمر. مجاني، بلا إعلانات ولا حسابات ولا تتبّع، ومفتوح المصدر.",
    eyebrow: "التطبيق · آيفون",
    title: ["مواقيت الصلاة والقبلة", "على هاتفك."],
    appName: "أثر: مواقيت الصلاة والقبلة",
    lead: "«أثر» هو الأثر الذي تتركه. تطبيق مواقيت صلاة مبنيّ صدقةً جارية: مجاني دائمًا، بلا إعلانات، بلا حسابات، وبلا تتبّع. مفتوح المصدر.",
    cta: "App Store",
    ctaAria: "حمّل «أثر» من App Store",
    source: "الشيفرة المصدرية",
    pending: "يعمل رابط App Store بعد أن تُنهي Apple مراجعة التطبيق.",
    android: "نسخة أندرويد قادمة لاحقًا.",
    qrHint: "وجّه كاميرا هاتفك نحو الرمز لفتح «أثر» في المتجر.",
    qrAria: "رمز QR: افتح «أثر» في {store}",
    playCta: "Google Play",
    playSoon: "Google Play · قريبًا",
    iconAlt: "أيقونة تطبيق أثر",
    facts: [
      { k: "المنصّة", v: "آيفون" },
      { k: "السعر", v: "مجاني" },
      { k: "إعلانات · حسابات · تتبّع", v: "لا شيء" },
      { k: "اللغات", v: "٥" },
      { k: "الرخصة", v: "MIT" },
    ],
    chapters: {
      features: { name: "المزايا", title: "كل شيء يُحسب على هاتفك." },
      screens: { name: "لقطات", title: "نظرة إلى الداخل." },
      privacy: { name: "الخصوصية", title: "يبقى موقعك على هاتفك." },
      source: { name: "مفتوح المصدر", title: "يُبنى علنًا." },
    },
    features: [
      { title: "مواقيت الصلاة دون إنترنت", body: "لمكانك، تُحسب على هاتفك — دون حاجة إلى إنترنت." },
      {
        title: "تنبيهات الأذان",
        body: "لكل صلاة، تُضبط محليًا على جهازك — مع تذكير قبل الصلاة وتذكير بالإقامة إن شئت. نغمة «أثر» أو صوت هاتفك. بلا خدمة دفع وبلا خادم وسيط.",
      },
      { title: "بوصلة القبلة", body: "مع تصحيح الشمال الحقيقي، ونقرة اهتزاز خفيفة حين تتّجه إلى الكعبة." },
      { title: "التقويم الهجري", body: "التاريخ الهجري اليوم والمناسبات الإسلامية القادمة." },
      { title: "القمر الليلة", body: "القمر الحقيقي: طوره وعمره وموعد المحاق والبدر القادمين." },
      {
        title: "شجرة التسبيح",
        body: "عدّاد تسبيح (٣٣ · ٣٣ · ٣٤) يضيء شجرة مع كل تسبيحة. أربعة أذكار من السنّة تتناوب جولةً بعد جولة، وكل شجرة تكتمل تنضمّ إلى بستانك. يُعَدّ على هاتفك وحده.",
      },
      {
        title: "قلبك",
        body: "اختر ما تشعر به — حزن، خوف، غضب، وحدة، شكر … — فتجد له آية من القرآن ودعاءً من السنّة.",
      },
      {
        title: "طريقة الحساب",
        body: "رابطة العالم الإسلامي، ISNA، مصر، أم القرى، كراتشي، طهران — اختيار واحد للتطبيق كله.",
      },
      { title: "خمس لغات", body: "العربية، English، Deutsch، Polski، Türkçe — مع دعم كامل للكتابة من اليمين إلى اليسار." },
    ],
    shots: { today: "اليوم", qibla: "القبلة", sky: "السماء", tasbih: "التسبيح", heart: "قلبك" },
    privacyLead: "لا يعرف «أثر» أين أنت. كل ما يحتاج إلى موقعك يُحسب على الهاتف نفسه.",
    privacyPoints: [
      "لا يغادر موقعك الهاتف أبدًا.",
      "الشيء الوحيد الذي يرسله التطبيق هو النص الذي تكتبه في بحث المدن — إلى api.openathar.org لإيجاد المكان. لا إحداثياتك أبدًا.",
      "لا تحليلات، ولا تقارير أعطال، ولا إعلانات، ولا حسابات.",
      "تنبيهات الأذان إشعارات محلية — بلا خدمة دفع.",
    ],
    privacyLink: "اقرأ سياسة الخصوصية كاملة",
    sourceLead: "يُبنى «أثر» علنًا برخصة MIT. يشترك التطبيق في محرّك الحساب مع هذا الموقع وواجهة البرمجة العامة.",
    closing: "مجاني. بلا إعلانات. بلا تتبّع.",
  },
};
