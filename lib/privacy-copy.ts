import type { Locale } from "~/lib/i18n";

/**
 * Datenschutzerklärung — jede Aussage hier ist im Code geprüft (Stand
 * 2026-11-16): Web (kein Analytics/Cookie, localStorage nur "athar-theme",
 * Verse holt der Server, nicht der Browser), API (IP als Rate-Limit-Schlüssel
 * im Redis-Fenster, Schlüssel = Zufallswert + Label), App (kein Tracking-SDK,
 * einziger Netzzugriff = Städtesuche an api.openathar.org, Standort nur
 * lokal). Ändert sich eines davon, MUSS dieser Text mit.
 *
 * Arabisch: von Ahmad gelesen und freigegeben am 2026-11-17 (docs/arabic-review.md).
 */

export type PrivacyCopy = {
  title: string;
  metaDescription: string;
  updated: string;
  intro: string;
  sections: { id: string; h: string; p: string[] }[];
};

export const privacyCopy: Record<Locale, PrivacyCopy> = {
  en: {
    title: "Privacy",
    metaDescription:
      "What Athar does and does not do with your data: no accounts, no ads, no tracking — on the website, in the app and in the API.",
    updated: "Last updated: 22 November 2026",
    intro:
      "Athar is built as a Sadaqah Jariyah: free, without ads, without accounts and without tracking. This page says exactly what that means in practice — for the website, the app and the public API.",
    sections: [
      {
        id: "short",
        h: "In short",
        p: [
          "We do not run advertising, analytics or tracking tools. There are no accounts and no sign-up. Prayer times, Qibla, the Hijri calendar and the moon are calculated on your own device. Your location is never sent to us.",
        ],
      },
      {
        id: "website",
        h: "The website (openathar.org)",
        p: [
          "No cookies, no analytics, no advertising, no social-media widgets and no third-party scripts. Fonts and images are served from our own server — your browser does not contact Google or any other font or image host.",
          "Your light/dark choice is saved in your browser (local storage, key “athar-theme”). It stays on your device and is never sent to us.",
          "If you allow your browser to share your location (for the countdown or “use my location”), it is used inside your browser to calculate prayer times. It is not transmitted.",
          "Qur’an verses and their translations are stored on our own server (Arabic text: Tanzil Project, tanzil.net; translations: QuranEnc.com) — neither your browser nor our server contacts another service to show them. Links to tanzil.net, QuranEnc.com, GitHub and other sites leave this website — their own privacy rules apply there.",
        ],
      },
      {
        id: "app",
        h: "The mobile app",
        p: [
          "All calculations run on your phone. Your location stays on the phone. Adhan alarms are local notifications — no push service, no account.",
          "The only thing the app ever sends over the network is the text you type into the city search, to api.openathar.org, to find a place. It does not send your coordinates. There is no analytics, crash-reporting or advertising component in the app.",
          "Your settings (calculation method, language, theme, alarm switches, recent cities) are stored on your device only.",
          "Permissions: location while the app is in use (to calculate for where you are; you can pick a city instead), notifications (for adhan alarms) and, on Android, exact alarms (so an alarm sounds on the minute).",
        ],
      },
      {
        id: "api",
        h: "The public API (api.openathar.org)",
        p: [
          "What you send (coordinates, dates, a search text) is used to answer your request. We do not build user profiles from it.",
          "To enforce the rate limit we count requests per IP address, or per API key if you send one, in a one-minute window held in a temporary store.",
          "An API key is a random value plus an optional label you choose (up to 64 characters), its creation time and a request counter. No name, no e-mail address. Keys are kept until you ask us to delete them.",
        ],
      },
      {
        id: "logs",
        h: "Technical logs",
        p: [
          "Like any web service, Cloudflare, which sits in front of the website and the API, processes technical data such as your IP address, the requested address and the time in order to deliver pages and to protect against abuse.",
          "Our own server keeps an access log: time, requested address including its parameters (for example the city you searched for) and the response status. It does not contain your IP address, because requests reach our server through Cloudflare. These logs are deleted after 30 days. We use them only to operate and secure the service — not for analytics, advertising or profiling.",
        ],
      },
      {
        id: "rights",
        h: "Your rights and contact",
        p: [
          "You may ask what we hold about you, ask for it to be corrected or deleted (for example an API key you created), and complain to a data-protection authority. Because we hold no accounts, there is usually nothing tied to you — but ask and we will check.",
          "Responsible: Ahmad Al Zoubi (project openathar). Contact: open an issue at github.com/openathar.",
        ],
      },
    ],
  },
  de: {
    title: "Datenschutz",
    metaDescription:
      "Was Athar mit deinen Daten macht und was nicht: keine Konten, keine Werbung, kein Tracking — auf der Website, in der App und in der API.",
    updated: "Stand: 22. November 2026",
    intro:
      "Athar ist als Sadaqah Jariyah gebaut: kostenlos, ohne Werbung, ohne Konten und ohne Tracking. Diese Seite sagt genau, was das konkret heißt — für die Website, die App und die öffentliche API.",
    sections: [
      {
        id: "short",
        h: "Kurz gesagt",
        p: [
          "Wir betreiben keine Werbung, keine Analyse- und keine Tracking-Werkzeuge. Es gibt keine Konten und keine Anmeldung. Gebetszeiten, Qibla, Hijri-Kalender und Mond werden auf deinem eigenen Gerät berechnet. Dein Standort wird nie an uns gesendet.",
        ],
      },
      {
        id: "website",
        h: "Die Website (openathar.org)",
        p: [
          "Keine Cookies, keine Analyse, keine Werbung, keine Social-Media-Widgets und keine Skripte von Dritten. Schriften und Bilder kommen von unserem eigenen Server — dein Browser nimmt keinen Kontakt zu Google oder einem anderen Schrift- oder Bilderdienst auf.",
          "Deine Hell/Dunkel-Wahl wird in deinem Browser gespeichert (Local Storage, Schlüssel „athar-theme“). Sie bleibt auf deinem Gerät und wird nie an uns gesendet.",
          "Wenn du deinem Browser erlaubst, deinen Standort zu teilen (für den Countdown oder „Standort verwenden“), wird er im Browser genutzt, um Gebetszeiten zu berechnen. Er wird nicht übertragen.",
          "Koranverse und ihre Übersetzungen liegen auf unserem eigenen Server (arabischer Text: Tanzil Project, tanzil.net; Übersetzungen: QuranEnc.com) — weder dein Browser noch unser Server fragt dafür einen anderen Dienst an. Links zu tanzil.net, QuranEnc.com, GitHub und anderen Seiten verlassen diese Website — dort gelten deren eigene Datenschutzregeln.",
        ],
      },
      {
        id: "app",
        h: "Die mobile App",
        p: [
          "Alle Berechnungen laufen auf deinem Telefon. Dein Standort bleibt auf dem Telefon. Adhan-Alarme sind lokale Benachrichtigungen — kein Push-Dienst, kein Konto.",
          "Das Einzige, was die App je über das Netz sendet, ist der Text, den du in die Städtesuche tippst, an api.openathar.org, um einen Ort zu finden. Deine Koordinaten sendet sie nicht. Die App enthält keine Analyse-, Absturzberichts- oder Werbekomponente.",
          "Deine Einstellungen (Berechnungsmethode, Sprache, Darstellung, Alarm-Schalter, letzte Städte) liegen nur auf deinem Gerät.",
          "Berechtigungen: Standort während der Nutzung (um für deinen Ort zu rechnen; du kannst stattdessen eine Stadt wählen), Benachrichtigungen (für Adhan-Alarme) und unter Android exakte Alarme (damit ein Alarm auf die Minute klingelt).",
        ],
      },
      {
        id: "api",
        h: "Die öffentliche API (api.openathar.org)",
        p: [
          "Was du sendest (Koordinaten, Daten, ein Suchtext), dient dazu, deine Anfrage zu beantworten. Wir erstellen daraus keine Nutzerprofile.",
          "Um das Anfragelimit durchzusetzen, zählen wir Anfragen pro IP-Adresse — oder pro API-Schlüssel, wenn du einen sendest — in einem Ein-Minuten-Fenster in einem temporären Speicher.",
          "Ein API-Schlüssel besteht aus einem Zufallswert und einer optionalen Bezeichnung (bis 64 Zeichen), die du wählst, dem Erstellungszeitpunkt und einem Anfragezähler. Kein Name, keine E-Mail-Adresse. Schlüssel bleiben gespeichert, bis du sie löschen lässt.",
        ],
      },
      {
        id: "logs",
        h: "Technische Protokolle",
        p: [
          "Wie jeder Webdienst verarbeitet Cloudflare, das vor Website und API sitzt, technische Daten wie deine IP-Adresse, die angeforderte Adresse und die Uhrzeit, um Seiten auszuliefern und vor Missbrauch zu schützen.",
          "Unser eigener Server führt ein Zugriffsprotokoll: Uhrzeit, angeforderte Adresse samt Parametern (zum Beispiel die Stadt, nach der du gesucht hast) und Antwortstatus. Deine IP-Adresse steht nicht darin, weil Anfragen über Cloudflare bei unserem Server ankommen. Diese Protokolle werden nach 30 Tagen gelöscht. Wir nutzen sie nur zum Betrieb und zur Absicherung — nicht für Analyse, Werbung oder Profilbildung.",
        ],
      },
      {
        id: "rights",
        h: "Deine Rechte und Kontakt",
        p: [
          "Du kannst Auskunft darüber verlangen, was wir über dich speichern, die Berichtigung oder Löschung verlangen (zum Beispiel eines API-Schlüssels, den du erstellt hast) und dich bei einer Datenschutzbehörde beschweren. Da wir keine Konten führen, ist meist nichts mit dir verknüpft — frag trotzdem, wir prüfen es.",
          "Verantwortlich: Ahmad Al Zoubi (Projekt openathar). Kontakt: Issue auf github.com/openathar eröffnen.",
        ],
      },
    ],
  },
  ar: {
    title: "الخصوصية",
    metaDescription:
      "ما يفعله «أثر» بياناتك وما لا يفعله: لا حسابات ولا إعلانات ولا تتبّع — في الموقع والتطبيق وواجهة البرمجة.",
    updated: "آخر تحديث: ٢٢ نوفمبر ٢٠٢٦",
    intro:
      "«أثر» مبنيّ صدقةً جارية: مجاني، بلا إعلانات، بلا حسابات، وبلا تتبّع. توضّح هذه الصفحة بالضبط ما يعنيه ذلك عمليًا — للموقع والتطبيق وواجهة البرمجة العامة.",
    sections: [
      {
        id: "short",
        h: "باختصار",
        p: [
          "لا نشغّل إعلانات ولا أدوات تحليل ولا تتبّع. لا توجد حسابات ولا تسجيل. تُحسب مواقيت الصلاة والقبلة والتقويم الهجري والقمر على جهازك أنت. موقعك لا يُرسَل إلينا أبدًا.",
        ],
      },
      {
        id: "website",
        h: "الموقع (openathar.org)",
        p: [
          "لا ملفات تعريف ارتباط، ولا تحليلات، ولا إعلانات، ولا أدوات تواصل اجتماعي، ولا سكربتات من أطراف ثالثة. تُقدَّم الخطوط والصور من خادمنا نحن — متصفحك لا يتصل بغوغل ولا بأي خدمة خطوط أو صور أخرى.",
          "يُحفظ اختيارك للوضع الفاتح أو الداكن في متصفحك (التخزين المحلي، المفتاح «athar-theme»). يبقى على جهازك ولا يُرسَل إلينا.",
          "إذا سمحتَ لمتصفحك بمشاركة موقعك (للعدّاد التنازلي أو «استخدم موقعي») فيُستخدم داخل المتصفح لحساب المواقيت فقط، ولا يُنقل.",
          "آيات القرآن وتفسيرها وترجماتها محفوظة على خادمنا نحن (النص العربي: مشروع تنزيل tanzil.net؛ الترجمات والتفسير الميسر: QuranEnc.com)، فلا يتصل متصفحك ولا خادمنا بأي خدمة أخرى لعرضها. الروابط إلى tanzil.net وQuranEnc.com وGitHub ومواقع أخرى تخرج من هذا الموقع، وتسري هناك سياسات خصوصيتها.",
        ],
      },
      {
        id: "app",
        h: "تطبيق الجوال",
        p: [
          "تجري كل الحسابات على هاتفك. موقعك يبقى على الهاتف. تنبيهات الأذان إشعارات محلية — بلا خدمة دفع وبلا حساب.",
          "الشيء الوحيد الذي يرسله التطبيق عبر الشبكة هو النص الذي تكتبه في بحث المدن، إلى api.openathar.org، للعثور على مكان. ولا يرسل إحداثياتك. لا يحتوي التطبيق على أي مكوّن للتحليل أو تقارير الأعطال أو الإعلانات.",
          "إعداداتك (طريقة الحساب، اللغة، المظهر، مفاتيح التنبيه، آخر المدن) تُحفظ على جهازك فقط.",
          "الأذونات: الموقع أثناء استخدام التطبيق (لحساب المواقيت لمكانك؛ ويمكنك اختيار مدينة بدلًا منه)، والإشعارات (لتنبيهات الأذان)، وعلى أندرويد المنبّهات الدقيقة (ليرنّ التنبيه في الدقيقة المضبوطة).",
        ],
      },
      {
        id: "api",
        h: "واجهة البرمجة العامة (api.openathar.org)",
        p: [
          "ما ترسله (إحداثيات، تواريخ، نص بحث) يُستخدم للردّ على طلبك. لا نبني منه ملفات تعريفية للمستخدمين.",
          "لفرض حدّ الطلبات نعدّ الطلبات لكل عنوان IP — أو لكل مفتاح API إن أرسلتَ مفتاحًا — ضمن نافذة مدتها دقيقة في مخزن مؤقت.",
          "مفتاح API هو قيمة عشوائية مع وسم اختياري تختاره (حتى ٦٤ حرفًا) ووقت الإنشاء وعدّاد للطلبات. لا اسم ولا بريد إلكتروني. تبقى المفاتيح محفوظة حتى تطلب حذفها.",
        ],
      },
      {
        id: "logs",
        h: "السجلات التقنية",
        p: [
          "كأي خدمة ويب، تعالج Cloudflare — الموضوعة أمام الموقع والواجهة — بيانات تقنية مثل عنوان IP والعنوان المطلوب والوقت، من أجل تقديم الصفحات والحماية من إساءة الاستخدام.",
          "يحتفظ خادمنا بسجلّ وصول: الوقت والعنوان المطلوب بمعاملاته (مثل المدينة التي بحثتَ عنها) وحالة الردّ. لا يتضمن عنوان IP الخاص بك لأن الطلبات تصل إلى خادمنا عبر Cloudflare. تُحذف هذه السجلات بعد ٣٠ يومًا. نستخدمها فقط لتشغيل الخدمة وتأمينها — لا للتحليل ولا للإعلان ولا لبناء ملفات تعريفية.",
        ],
      },
      {
        id: "rights",
        h: "حقوقك والتواصل",
        p: [
          "يحق لك أن تسأل عمّا نحتفظ به عنك، وأن تطلب تصحيحه أو حذفه (مثل مفتاح API أنشأتَه)، وأن تشتكي إلى سلطة حماية البيانات. وبما أننا لا نحتفظ بحسابات فغالبًا لا يوجد شيء مرتبط بك — لكن اسأل وسنتحقق.",
          "المسؤول: أحمد الزعبي (مشروع openathar). للتواصل: افتح بلاغًا (issue) على github.com/openathar.",
        ],
      },
    ],
  },
};
