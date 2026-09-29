import type { Locale } from "./i18n";

export type Dict = {
  meta: { title: string; description: string };
  ayah: { text: string; ref: string };
  hero: { name: string; meaning: string; cta: string; ctaSecondary: string };
  map: {
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
  cosmos: {
    label: string;
    heading: string;
    intro: string;
    tabs: { earth: string; moon: string; map: string };
    moonView: {
      phase: string;
      illumination: string;
      age: string;
      nextNew: string;
      nextFull: string;
      hint: string;
      days: string;
    };
  };
  status: { badge: string; text: string };
  what: { heading: string; items: { title: string; body: string }[] };
  promise: { heading: string; items: string[] };
  legacy: { label: string; heading: string; body: string[] };
  dates: { label: string; heading: string; intro: string; hijriYear: string; today: string };
  sky: {
    label: string;
    heading: string;
    intro: string;
    moon: string;
    illuminated: string;
    nextFull: string;
    nextNew: string;
    days: string;
  };
  earth: {
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
    next: string;
    loading: string;
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
  nav: { language: string; developers: string };
  footer: { madeAs: string; source: string; imprint: string };
  devs: {
    meta: { title: string; description: string };
    eyebrow: string;
    heading: string;
    intro: string;
    backHome: string;
    quickstart: { heading: string; intro: string };
    endpoints: {
      heading: string;
      intro: string;
      paramHeaders: { name: string; required: string; default: string; notes: string };
      yes: string;
      no: string;
      prayerTimes: {
        title: string;
        description: string;
        params: { lat: string; lon: string; date: string; method: string; utcOffset: string };
      };
      qibla: { title: string; description: string; params: { lat: string; lon: string } };
      hijri: { title: string; description: string; params: { date: string; locale: string } };
    };
    errors: { heading: string; body: string };
    limits: { heading: string; body: string; anonymous: string; keyed: string };
    playground: {
      heading: string;
      intro: string;
      run: string;
      running: string;
      response: string;
      apiKeyFieldLabel: string;
      apiKeyFieldPlaceholder: string;
    };
    keys: {
      heading: string;
      intro: string;
      labelFieldLabel: string;
      labelPlaceholder: string;
      generate: string;
      generating: string;
      warning: string;
      copy: string;
      copied: string;
      yourKey: string;
      yourLabel: string;
      createdAt: string;
      usageHeading: string;
      usageIntro: string;
      usageFieldPlaceholder: string;
      usageCheck: string;
      usageChecking: string;
      usageNotFound: string;
      usageRequests: string;
    };
    cta: { heading: string; body: string; github: string; swagger: string };
  };
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
      useLocation: "Use my location",
      locating: "Locating…",
      denied: "Location unavailable — please pick a city.",
      myLocation: "My location",
      next: "Next",
      source: "Source: athan-core",
      live: "live",
      offline: "last known values",
      names: { fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
    },
    cosmos: {
      label: "sun & moon",
      heading: "Two lights, one clock",
      intro:
        "Prayer times are written by the sun's position, the months by the moon's phases — two lights that kept time long before us. Turn the globe, zoom in, and watch the moon trace its orbit.",
      tabs: { earth: "Earth", moon: "Moon", map: "Map" },
      moonView: {
        phase: "Phase",
        illumination: "Illuminated",
        age: "Moon age",
        nextNew: "until new moon",
        nextFull: "until full moon",
        hint: "The lit shape matches tonight's real phase — drag to turn, scroll to zoom.",
        days: "days",
      },
    },
    status: {
      badge: "Pre-Alpha",
      text: "We build in the open. The calculation core is published, the public API is live, the mobile app is next.",
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
      label: "revelation & creation",
      heading: "The Written Book and the Witnessed Book",
      intro:
        "Islamic tradition calls the Qur'an 'the inscribed Book' and the universe 'the witnessed Book' — one truth, two books. In Arabic, the word ayah means both 'verse' and 'sign'; neither book is offered to prove the other.",
      revealed: "Revelation",
      observed: "Observation",
      draft: "drafted with {model}, running locally · editorially reviewed",
      next: "Another sign",
      loading: "loading …",
      source: "Source",
    },
    dates: {
      label: "the islamic calendar",
      heading: "What's coming",
      intro: "Computed locally from today's date — not a fixed list, always the next real occurrence.",
      hijriYear: "AH",
      today: "Today",
    },
    sky: {
      label: "today in the sky",
      heading: "The sky tonight",
      intro: "Computed locally from today's date — the moon's real phase and the next events.",
      moon: "Moon",
      illuminated: "illuminated",
      nextFull: "Next full moon",
      nextNew: "Next new moon",
      days: "days",
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
        { title: "Calculation core", body: "A single shared library for prayer times, Qibla and Hijri conversion — published to Maven Central. The web computes locally via a TypeScript port kept in sync by reference tests; the public API consumes the library directly.", state: "Live" },
        { title: "Public API", body: "Free and rate-limited. V1 is live at api.openathar.org — prayer times, Qibla and Hijri conversion, immutable-cached. API keys and a developer portal are next.", state: "Live" },
        { title: "Mobile apps", body: "Android and iOS — offline-first, reliable Adhan notifications, widgets and Live Activities.", state: "Planned" },
        { title: "AI Quran explanation", body: "AI that explains the Quran from science and connects it with text, video and images that never existed before.", state: "Vision" },
      ],
    },
    theme: { light: "Switch to light", dark: "Switch to dark" },
    nav: { language: "Language", developers: "API" },
    footer: {
      madeAs: "Built as Sadaqah Jariyah.",
      source: "Source code",
      imprint: "Legal notice",
    },
    devs: {
      meta: {
        title: "Athar API — free prayer times, Qibla and Hijri calendar for developers",
        description:
          "A free, rate-limited REST API for prayer times, Qibla bearing and Hijri calendar conversion. No account, no email, self-serve API keys for a higher rate limit.",
      },
      eyebrow: "// developer api",
      heading: "Build with Athar",
      intro:
        "One free REST API for prayer times, Qibla bearing and Hijri calendar conversion — the same calculation core that powers this site and the mobile app. No account, no email, no tracking. Try every endpoint below, right in this page.",
      backHome: "← Back to Athar",
      quickstart: {
        heading: "Quickstart",
        intro:
          "Every endpoint is a plain GET request. No auth header required — an optional API key just raises your rate limit (see below).",
      },
      endpoints: {
        heading: "Endpoints",
        intro: "Three endpoints, all deterministic and cached forever for a given input.",
        paramHeaders: { name: "Param", required: "Required", default: "Default", notes: "Notes" },
        yes: "yes",
        no: "no",
        prayerTimes: {
          title: "Prayer times",
          description:
            "Fajr, Dhuhr, Asr, Maghrib, Isha, plus sunrise, sunset, midnight and the Duha window, as local HH:mm strings.",
          params: {
            lat: "Latitude in decimal degrees (−90..90)",
            lon: "Longitude in decimal degrees (−180..180)",
            date: "ISO date yyyy-MM-dd",
            method: "MWL, ISNA, EGYPT, MAKKAH, KARACHI, TEHRAN, JAFARI, FRANCE, RUSSIA, MALAYSIA, SINGAPORE",
            utcOffset: "Location's UTC offset in hours (−12..14), for local wall-clock times",
          },
        },
        qibla: {
          title: "Qibla bearing",
          description: "Great-circle bearing from true north to the Kaaba, for any location.",
          params: {
            lat: "Latitude in decimal degrees (−90..90)",
            lon: "Longitude in decimal degrees (−180..180)",
          },
        },
        hijri: {
          title: "Hijri calendar",
          description: "Converts a Gregorian date to the Hijri (Umm al-Qura) calendar.",
          params: {
            date: "ISO date yyyy-MM-dd — defaults to today",
            locale: "en or ar — only affects the localized month name",
          },
        },
      },
      errors: {
        heading: "Errors",
        body:
          "Every 4xx response uses the same shape, everywhere — including missing or malformed parameters: {\"error\": \"latitude out of range: 95.0\"}. Nothing to special-case per endpoint.",
      },
      limits: {
        heading: "Rate limits & caching",
        body:
          "Fixed-window rate limiting per client IP — or per API key, for a higher quota. Over the limit → 429 with a Retry-After header. Every successful response carries Cache-Control: public, max-age=31536000, immutable — safe to cache forever, since (lat, lon, date, method) always produces the same result.",
        anonymous: "60 requests / minute — no key needed",
        keyed: "600 requests / minute — with a free API key",
      },
      playground: {
        heading: "Try it now",
        intro: "Edit the parameters and run a real request against the live API — right from this page.",
        run: "Run request",
        running: "Running…",
        response: "Response",
        apiKeyFieldLabel: "API key (optional)",
        apiKeyFieldPlaceholder: "ath_… (leave empty to test anonymously)",
      },
      keys: {
        heading: "Get a free API key",
        intro:
          "Instant, no email, no account. An API key just raises your rate limit from 60 to 600 requests per minute — it isn't an identity system.",
        labelFieldLabel: "Label (optional, for your own reference)",
        labelPlaceholder: "my-prayer-widget",
        generate: "Generate key",
        generating: "Generating…",
        warning: "Shown once — store it yourself, Athar cannot show it to you again.",
        copy: "Copy",
        copied: "Copied!",
        yourKey: "Your API key",
        yourLabel: "Label",
        createdAt: "Created",
        usageHeading: "Check usage",
        usageIntro: "Look up the request count for a key you already hold.",
        usageFieldPlaceholder: "ath_…",
        usageCheck: "Check",
        usageChecking: "Checking…",
        usageNotFound: "Unknown API key.",
        usageRequests: "Total requests",
      },
      cta: {
        heading: "That's it",
        body:
          "Deterministic in, deterministic out. Build whatever you want on top — a widget, a bot, a smart-speaker skill. If something's missing, open an issue.",
        github: "Source on GitHub",
        swagger: "Full OpenAPI reference",
      },
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
      useLocation: "Standort verwenden",
      locating: "Ort wird bestimmt…",
      denied: "Standort nicht verfügbar — bitte Stadt wählen.",
      myLocation: "Mein Standort",
      next: "Nächstes",
      source: "Quelle: athan-core",
      live: "live",
      offline: "zuletzt bekannte Werte",
      names: { fajr: "Fadschr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Ischa" },
    },
    cosmos: {
      label: "sonne & mond",
      heading: "Zwei Lichter, eine Uhr",
      intro:
        "Die Gebetszeiten schreibt die Sonnenposition, die Monate der Mond — zwei Lichter, die schon lange vor uns die Zeit halten. Dreh den Globus, zoom hinein und sieh dem Mond auf seiner Bahn zu.",
      tabs: { earth: "Erde", moon: "Mond", map: "Karte" },
      moonView: {
        phase: "Phase",
        illumination: "Beleuchtet",
        age: "Mondalter",
        nextNew: "bis zum Neumond",
        nextFull: "bis zum Vollmond",
        hint: "Die Lichtgestalt entspricht der echten Phase am heutigen Himmel — ziehen zum Drehen, scrollen zum Zoomen.",
        days: "Tage",
      },
    },
    status: {
      badge: "Pre-Alpha",
      text: "Wir bauen öffentlich. Der Berechnungs-Kern ist veröffentlicht, die öffentliche API ist live, die Mobile-App folgt.",
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
      label: "Offenbarung & Schöpfung",
      heading: "Das geschriebene Buch und das sichtbare Buch",
      intro:
        "Die islamische Tradition nennt den Koran „das geschriebene Buch“ und die Schöpfung „das sichtbare Buch“ — eine Wahrheit, zwei Bücher. Im Arabischen meint das Wort Aya zugleich „Vers“ und „Zeichen“; keines der beiden Bücher soll das andere beweisen.",
      revealed: "Offenbarung",
      observed: "Beobachtung",
      draft: "Entwurf mit {model}, lokal erzeugt · redaktionell geprüft",
      next: "Ein weiteres Zeichen",
      loading: "lädt …",
      source: "Quelle",
    },
    dates: {
      label: "der islamische Kalender",
      heading: "Was ansteht",
      intro: "Lokal aus dem heutigen Datum berechnet — keine feste Liste, immer der nächste tatsächliche Termin.",
      hijriYear: "n.H.",
      today: "Heute",
    },
    sky: {
      label: "der Himmel heute",
      heading: "Der Himmel heute Nacht",
      intro: "Lokal aus dem heutigen Datum berechnet — die echte Mondphase und die nächsten Ereignisse.",
      moon: "Mond",
      illuminated: "beleuchtet",
      nextFull: "Nächster Vollmond",
      nextNew: "Nächster Neumond",
      days: "Tage",
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
        { title: "Berechnungs-Kern", body: "Eine gemeinsame Bibliothek für Gebetszeiten, Qibla und Hijri-Konvertierung — veröffentlicht auf Maven Central. Das Web rechnet lokal über einen TypeScript-Port, der durch Referenztests synchron gehalten wird; die öffentliche API nutzt die Bibliothek direkt.", state: "Live" },
        { title: "Öffentliche API", body: "Kostenlos und rate-limitiert. V1 ist live unter api.openathar.org — Gebetszeiten, Qibla und Hijri-Konvertierung, immutable-gecacht. API-Keys und ein Entwicklerportal folgen.", state: "Live" },
        { title: "Mobile Apps", body: "Android und iOS — offline-first, zuverlässige Adhan-Benachrichtigungen, Widgets und Live Activities.", state: "Geplant" },
        { title: "KI-Erklärung des Quran", body: "KI, die den Quran aus der Wissenschaft erklärt und ihn mit Text, Video und Bildern verbindet, die es nie zuvor gab.", state: "Vision" },
      ],
    },
    theme: { light: "Zu hell wechseln", dark: "Zu dunkel wechseln" },
    nav: { language: "Sprache", developers: "API" },
    footer: {
      madeAs: "Gebaut als Sadaqah Jariyah.",
      source: "Quellcode",
      imprint: "Impressum",
    },
    devs: {
      meta: {
        title: "Athar API — kostenlose Gebetszeiten, Qibla und Hijri-Kalender für Entwickler",
        description:
          "Eine kostenlose, rate-limitierte REST-API für Gebetszeiten, Qibla-Richtung und Hijri-Kalenderumrechnung. Kein Account, keine E-Mail, selbstbedienbare API-Keys für ein höheres Limit.",
      },
      eyebrow: "// entwickler-api",
      heading: "Bauen mit Athar",
      intro:
        "Eine kostenlose REST-API für Gebetszeiten, Qibla-Richtung und Hijri-Kalenderumrechnung — derselbe Berechnungs-Kern, der diese Seite und die Mobile-App antreibt. Kein Account, keine E-Mail, kein Tracking. Probiere jeden Endpoint direkt hier auf der Seite aus.",
      backHome: "← Zurück zu Athar",
      quickstart: {
        heading: "Schnellstart",
        intro:
          "Jeder Endpoint ist ein einfacher GET-Request. Kein Auth-Header nötig — ein optionaler API-Key erhöht nur dein Limit (siehe unten).",
      },
      endpoints: {
        heading: "Endpoints",
        intro: "Drei Endpoints, alle deterministisch und für eine gegebene Eingabe für immer gecacht.",
        paramHeaders: { name: "Parameter", required: "Pflicht", default: "Standard", notes: "Hinweise" },
        yes: "ja",
        no: "nein",
        prayerTimes: {
          title: "Gebetszeiten",
          description:
            "Fadschr, Dhuhr, Asr, Maghrib, Ischa, plus Sonnenaufgang, Sonnenuntergang, Mitternacht und das Duha-Fenster, als lokale HH:mm-Strings.",
          params: {
            lat: "Breitengrad in Dezimalgrad (−90..90)",
            lon: "Längengrad in Dezimalgrad (−180..180)",
            date: "ISO-Datum yyyy-MM-dd",
            method: "MWL, ISNA, EGYPT, MAKKAH, KARACHI, TEHRAN, JAFARI, FRANCE, RUSSIA, MALAYSIA, SINGAPORE",
            utcOffset: "UTC-Offset des Standorts in Stunden (−12..14), für lokale Uhrzeiten",
          },
        },
        qibla: {
          title: "Qibla-Richtung",
          description: "Großkreis-Peilung von wahrem Norden zur Kaaba, für jeden Standort.",
          params: {
            lat: "Breitengrad in Dezimalgrad (−90..90)",
            lon: "Längengrad in Dezimalgrad (−180..180)",
          },
        },
        hijri: {
          title: "Hijri-Kalender",
          description: "Wandelt ein gregorianisches Datum in den Hijri-Kalender (Umm al-Qura) um.",
          params: {
            date: "ISO-Datum yyyy-MM-dd — Standard: heute",
            locale: "en oder ar — betrifft nur den lokalisierten Monatsnamen",
          },
        },
      },
      errors: {
        heading: "Fehler",
        body:
          "Jede 4xx-Antwort hat überall dieselbe Form — auch bei fehlenden oder ungültigen Parametern: {\"error\": \"latitude out of range: 95.0\"}. Kein Sonderfall pro Endpoint.",
      },
      limits: {
        heading: "Rate-Limits & Caching",
        body:
          "Fixed-Window-Rate-Limiting pro Client-IP — oder pro API-Key, für ein höheres Kontingent. Über dem Limit → 429 mit Retry-After-Header. Jede erfolgreiche Antwort trägt Cache-Control: public, max-age=31536000, immutable — sicher für immer cachebar, da (lat, lon, date, method) immer dasselbe Ergebnis liefert.",
        anonymous: "60 Anfragen / Minute — ohne Key",
        keyed: "600 Anfragen / Minute — mit kostenlosem API-Key",
      },
      playground: {
        heading: "Jetzt ausprobieren",
        intro: "Ändere die Parameter und schicke einen echten Request an die Live-API — direkt von dieser Seite.",
        run: "Request senden",
        running: "Läuft…",
        response: "Antwort",
        apiKeyFieldLabel: "API-Key (optional)",
        apiKeyFieldPlaceholder: "ath_… (leer lassen für anonymen Test)",
      },
      keys: {
        heading: "Kostenlosen API-Key holen",
        intro:
          "Sofort, ohne E-Mail, ohne Account. Ein API-Key erhöht nur dein Limit von 60 auf 600 Anfragen pro Minute — kein Identitätssystem.",
        labelFieldLabel: "Label (optional, nur für dich selbst)",
        labelPlaceholder: "mein-gebetszeiten-widget",
        generate: "Key erzeugen",
        generating: "Erzeuge…",
        warning: "Wird nur einmal angezeigt — speichere ihn selbst, Athar kann ihn dir nicht erneut zeigen.",
        copy: "Kopieren",
        copied: "Kopiert!",
        yourKey: "Dein API-Key",
        yourLabel: "Label",
        createdAt: "Erstellt",
        usageHeading: "Nutzung prüfen",
        usageIntro: "Ruf die Anzahl der Anfragen für einen Key ab, den du bereits hast.",
        usageFieldPlaceholder: "ath_…",
        usageCheck: "Prüfen",
        usageChecking: "Prüfe…",
        usageNotFound: "Unbekannter API-Key.",
        usageRequests: "Gesamtanfragen",
      },
      cta: {
        heading: "Das war's",
        body:
          "Deterministisch rein, deterministisch raus. Bau darauf, was du willst — ein Widget, einen Bot, eine Smart-Speaker-Skill. Fehlt etwas, eröffne ein Issue.",
        github: "Quellcode auf GitHub",
        swagger: "Vollständige OpenAPI-Referenz",
      },
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
      useLocation: "استخدام موقعي",
      locating: "جارٍ تحديد الموقع…",
      denied: "الموقع غير متاح — الرجاء اختيار مدينة.",
      myLocation: "موقعي",
      next: "القادمة",
      source: "المصدر: athan-core",
      live: "مباشر",
      offline: "آخر قيم معروفة",
      names: { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء" },
    },
    cosmos: {
      label: "الشمس والقمر",
      heading: "نوران وساعةٌ واحدة",
      intro:
        "مواقيت الصلاة تكتبها مواضع الشمس، والشهور يكتبها طور القمر — نوران يحفظان الزمن من قبلنا. دوّر الكرة الأرضية، قرّب، وشاهد القمر يقطع مداره.",
      tabs: { earth: "الأرض", moon: "القمر", map: "الخريطة" },
      moonView: {
        phase: "الطور",
        illumination: "الجزء المضيء",
        age: "عمر القمر",
        nextNew: "حتى المحاق",
        nextFull: "حتى اكتمال البدر",
        hint: "الشكل المضيء يطابق طور القمر الحقيقي الليلة — اسحب للتدوير، ومرّر للتقريب.",
        days: "يومًا",
      },
    },
    status: {
      badge: "نسخة أولية",
      text: "نبني في العلن. نواة الحساب منشورة، والواجهة البرمجية العامة مباشرة، وتطبيق الجوال هو التالي.",
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
      label: "الوحي والكون",
      heading: "الكتاب المسطور والكتاب المنظور",
      intro:
        "يسمّي التراث الإسلامي القرآنَ «الكتاب المسطور» والكونَ «الكتاب المنظور» — حقيقة واحدة في كتابين. وفي العربية، تحمل كلمة «آية» معنى النصّ والعلامة معًا؛ فلا يدّعي أحد الكتابين إثبات الآخر.",
      revealed: "الوحي",
      observed: "المشاهدة",
      draft: "مسوّدة بنموذج {model} يعمل محلياً · روجعت تحريرياً",
      next: "إشارة أخرى",
      loading: "جارٍ التحميل …",
      source: "المصدر",
    },
    dates: {
      label: "التقويم الإسلامي",
      heading: "ما هو قادم",
      intro: "يُحسب محلياً من تاريخ اليوم — ليست قائمة ثابتة، بل الموعد الفعلي القادم دائماً.",
      hijriYear: "هـ",
      today: "اليوم",
    },
    sky: {
      label: "السماء اليوم",
      heading: "السماء الليلة",
      intro: "يُحسب محلياً من تاريخ اليوم — طور القمر الحقيقي والأحداث القادمة.",
      moon: "القمر",
      illuminated: "مضاء",
      nextFull: "البدر القادم",
      nextNew: "المحاق القادم",
      days: "أيام",
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
        { title: "نواة الحساب", body: "مكتبة واحدة مشتركة لمواقيت الصلاة والقبلة وتحويل التقويم — منشورة على Maven Central. يحسبها الويب محلياً عبر نسخة TypeScript تُحفظ متزامنة باختبارات مرجعية، وتستهلكها الواجهة البرمجية مباشرة.", state: "متاح" },
        { title: "الواجهة البرمجية العامة", body: "مجانية ومحدودة المعدّل. النسخة الأولى مباشرة على api.openathar.org — مواقيت الصلاة والقبلة وتحويل التقويم، بتخزين مؤقت لا يتغيّر. مفاتيح API وبوابة مطوّرين تليان.", state: "متاح" },
        { title: "تطبيقات الجوال", body: "أندرويد وiOS — تعمل دون اتصال، تنبيهات أذان موثوقة، ودجات وأنشطة مباشرة.", state: "مخطط" },
        { title: "شرح القرآن بالذكاء الاصطناعي", body: "ذكاء اصطناعي يشرح القرآن من العلم ويربطه بنصوص وفيديوهات وصور لم توجد من قبل.", state: "رؤية" },
      ],
    },
    theme: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
    nav: { language: "اللغة", developers: "واجهة API" },
    footer: {
      madeAs: "بُنيت كصدقة جارية.",
      source: "الشيفرة المصدرية",
      imprint: "بيانات الناشر",
    },
    devs: {
      meta: {
        title: "واجهة أثر البرمجية — مواقيت صلاة وقبلة وتقويم هجري مجاني للمطوّرين",
        description:
          "واجهة REST مجانية ومحدودة المعدّل لمواقيت الصلاة، اتجاه القبلة، وتحويل التقويم الهجري. بلا حساب، بلا بريد إلكتروني، مفاتيح API ذاتية الخدمة لحد أعلى.",
      },
      eyebrow: "// واجهة المطوّرين",
      heading: "ابنِ باستخدام أثر",
      intro:
        "واجهة REST مجانية واحدة لمواقيت الصلاة واتجاه القبلة وتحويل التقويم الهجري — نفس نواة الحساب التي تشغّل هذا الموقع وتطبيق الجوال. بلا حساب، بلا بريد إلكتروني، بلا تتبّع. جرّب كل نقطة نهاية أدناه مباشرة في هذه الصفحة.",
      backHome: "→ العودة إلى أثر",
      quickstart: {
        heading: "بداية سريعة",
        intro:
          "كل نقطة نهاية هي طلب GET بسيط. لا حاجة لترويسة مصادقة — مفتاح API اختياري يرفع فقط حدّك (انظر أدناه).",
      },
      endpoints: {
        heading: "نقاط النهاية",
        intro: "ثلاث نقاط نهاية، جميعها حتمية النتيجة ومخزّنة مؤقتاً إلى الأبد لمدخل معيّن.",
        paramHeaders: { name: "المعامل", required: "إلزامي", default: "الافتراضي", notes: "ملاحظات" },
        yes: "نعم",
        no: "لا",
        prayerTimes: {
          title: "مواقيت الصلاة",
          description:
            "الفجر والظهر والعصر والمغرب والعشاء، بالإضافة إلى الشروق والغروب ومنتصف الليل ونافذة الضحى، كسلاسل HH:mm محلية.",
          params: {
            lat: "خط العرض بالدرجات العشرية (−90..90)",
            lon: "خط الطول بالدرجات العشرية (−180..180)",
            date: "تاريخ ISO بصيغة yyyy-MM-dd",
            method: "MWL, ISNA, EGYPT, MAKKAH, KARACHI, TEHRAN, JAFARI, FRANCE, RUSSIA, MALAYSIA, SINGAPORE",
            utcOffset: "فارق التوقيت العالمي للموقع بالساعات (−12..14)، لعرض الوقت المحلي",
          },
        },
        qibla: {
          title: "اتجاه القبلة",
          description: "الاتجاه بالدائرة العظمى من الشمال الحقيقي إلى الكعبة، لأي موقع.",
          params: {
            lat: "خط العرض بالدرجات العشرية (−90..90)",
            lon: "خط الطول بالدرجات العشرية (−180..180)",
          },
        },
        hijri: {
          title: "التقويم الهجري",
          description: "يحوّل تاريخاً ميلادياً إلى التقويم الهجري (أم القرى).",
          params: {
            date: "تاريخ ISO بصيغة yyyy-MM-dd — الافتراضي: اليوم",
            locale: "en أو ar — يؤثر فقط على اسم الشهر المترجم",
          },
        },
      },
      errors: {
        heading: "الأخطاء",
        body:
          "كل استجابة 4xx تتّخذ نفس الشكل في كل مكان — بما في ذلك المعاملات الناقصة أو غير الصالحة: {\"error\": \"latitude out of range: 95.0\"}. لا حالة خاصة لكل نقطة نهاية.",
      },
      limits: {
        heading: "حدود المعدّل والتخزين المؤقت",
        body:
          "تحديد معدّل بنافذة ثابتة لكل عنوان IP — أو لكل مفتاح API، لحصة أعلى. عند تجاوز الحد ← 429 مع ترويسة Retry-After. كل استجابة ناجحة تحمل Cache-Control: public, max-age=31536000, immutable — يمكن تخزينها مؤقتاً إلى الأبد بأمان، لأن (lat, lon, date, method) تُنتج دائماً النتيجة نفسها.",
        anonymous: "٦٠ طلباً / دقيقة — بلا مفتاح",
        keyed: "٦٠٠ طلباً / دقيقة — بمفتاح API مجاني",
      },
      playground: {
        heading: "جرّب الآن",
        intro: "عدّل المعاملات وأرسل طلباً حقيقياً إلى الواجهة المباشرة — من هذه الصفحة مباشرة.",
        run: "إرسال الطلب",
        running: "جارٍ التنفيذ…",
        response: "الاستجابة",
        apiKeyFieldLabel: "مفتاح API (اختياري)",
        apiKeyFieldPlaceholder: "ath_… (اتركه فارغاً للاختبار كزائر مجهول)",
      },
      keys: {
        heading: "احصل على مفتاح API مجاني",
        intro:
          "فوري، بلا بريد إلكتروني، بلا حساب. مفتاح API يرفع فقط حدّك من ٦٠ إلى ٦٠٠ طلب في الدقيقة — ليس نظام هوية.",
        labelFieldLabel: "تسمية (اختياري، لمرجعك الخاص)",
        labelPlaceholder: "تطبيق-مواقيت-الصلاة",
        generate: "إنشاء مفتاح",
        generating: "جارٍ الإنشاء…",
        warning: "يُعرض مرة واحدة فقط — احفظه بنفسك، لا يمكن لأثر عرضه لك مجدداً.",
        copy: "نسخ",
        copied: "تم النسخ!",
        yourKey: "مفتاحك",
        yourLabel: "التسمية",
        createdAt: "تاريخ الإنشاء",
        usageHeading: "تحقّق من الاستخدام",
        usageIntro: "اطّلع على عدد الطلبات لمفتاح تملكه بالفعل.",
        usageFieldPlaceholder: "ath_…",
        usageCheck: "تحقّق",
        usageChecking: "جارٍ التحقّق…",
        usageNotFound: "مفتاح API غير معروف.",
        usageRequests: "إجمالي الطلبات",
      },
      cta: {
        heading: "هذا كل شيء",
        body:
          "حتمي في الإدخال، حتمي في الإخراج. ابنِ ما تشاء فوقها — أداة، بوت، أو مهارة لمكبّر ذكي. إن كان هناك ما ينقص، افتح Issue.",
        github: "الشيفرة المصدرية على GitHub",
        swagger: "المرجع الكامل لـ OpenAPI",
      },
    },
  },
};
