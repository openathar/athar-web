import type { Locale } from "./i18n";

/**
 * Blog — kurze Artikel über das, was Athar heute wirklich tut.
 *
 * Jede Aussage ist gegen Code/Doku geprüft (Stand 2026-11-17):
 * athan-core-java 0.1.0 auf Maven Central (PrayTimes.org v3.2, Qibla,
 * Umm al-Qura, 38 Referenztests), TS-Port in lib/athan-core.ts mit
 * Referenztests, API V1 (15 Endpunkte, Rate-Limit je IP oder Schlüssel,
 * Schlüssel per Self-Service), Datenschutz wie in lib/privacy-copy.ts.
 * Ändert sich eines davon, muss der betroffene Artikel mit.
 *
 * Texte je Sprache handgeschrieben, keine Maschinenübersetzung.
 * Arabisch: noch ohne muttersprachliche Prüfung.
 */

export type BlogSection = { h?: string; p: string[] };

export type BlogText = {
  title: string;
  description: string;
  sections: BlogSection[];
};

export type BlogPost = {
  slug: string;
  /** ISO-Datum der Veröffentlichung */
  date: string;
  text: Record<Locale, BlogText>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "prayer-times-on-your-device",
    date: "2026-11-17",
    text: {
      en: {
        title: "Prayer times that never leave your device",
        description:
          "Why Athar calculates prayer times, Qibla and the Hijri date in your browser, and what that means for your location.",
        sections: [
          {
            p: [
              "Most prayer-time apps work the same way. Your location goes up to a server, an answer comes down. It works. It also means someone, somewhere, knows where you pray five times a day.",
              "Athar does it the other way round.",
            ],
          },
          {
            h: "The calculation runs where you are",
            p: [
              "When you open openathar.org and allow your browser to use your location, the prayer times are calculated inside the browser. The same goes for the Qibla direction, the Hijri date and tonight's moon phase.",
              "Your coordinates are used on your device and stay there. There is no request that carries them to us, because there is nothing on our side that needs them.",
            ],
          },
          {
            h: "Why this is possible at all",
            p: [
              "Prayer times are astronomy, not a secret. Given a place, a date and a calculation method, the sun's position decides the rest. That is a few hundred lines of careful mathematics, and a phone or laptop does it in a fraction of a millisecond.",
              "So the question was never whether it can run locally. The question was whether the local result is correct. That is what the next article is about: one calculation core, written in Java, mirrored in TypeScript, and held together by reference tests.",
            ],
          },
          {
            h: "What we do not have",
            p: [
              "No cookies, no analytics, no advertising, no third-party scripts. Your light or dark choice is stored in your own browser and never sent anywhere. The privacy page lists every exception, for example that Qur'an verses are fetched by our server, not by your browser.",
              "This is not a feature we will one day monetise. Athar is built as a Sadaqah Jariyah: free, without ads, open source.",
            ],
          },
        ],
      },
      de: {
        title: "Gebetszeiten, die dein Gerät nicht verlassen",
        description:
          "Warum Athar Gebetszeiten, Qibla und das Hijri-Datum im Browser berechnet und was das für deinen Standort bedeutet.",
        sections: [
          {
            p: [
              "Die meisten Gebetszeit-Apps funktionieren gleich. Dein Standort geht an einen Server, eine Antwort kommt zurück. Das funktioniert. Es heißt aber auch: Irgendwer weiß, wo du fünfmal am Tag betest.",
              "Athar macht es andersherum.",
            ],
          },
          {
            h: "Die Rechnung läuft dort, wo du bist",
            p: [
              "Wenn du openathar.org öffnest und deinem Browser den Standort erlaubst, werden die Gebetszeiten im Browser berechnet. Genauso die Qibla-Richtung, das Hijri-Datum und die Mondphase von heute Nacht.",
              "Deine Koordinaten werden auf deinem Gerät genutzt und bleiben dort. Es gibt keine Anfrage, die sie zu uns trägt, weil bei uns nichts sie braucht.",
            ],
          },
          {
            h: "Warum das überhaupt geht",
            p: [
              "Gebetszeiten sind Astronomie, kein Geheimnis. Ort, Datum und Berechnungsmethode genügen, der Stand der Sonne entscheidet den Rest. Das sind ein paar hundert Zeilen sorgfältige Mathematik, und ein Handy oder Laptop rechnet sie in Bruchteilen einer Millisekunde.",
              "Die Frage war also nie, ob es lokal läuft. Die Frage war, ob das lokale Ergebnis stimmt. Darum geht es im nächsten Artikel: ein Rechenkern in Java, gespiegelt in TypeScript und zusammengehalten von Referenztests.",
            ],
          },
          {
            h: "Was wir nicht haben",
            p: [
              "Keine Cookies, keine Analyse, keine Werbung, keine Skripte von Dritten. Deine Hell/Dunkel-Wahl liegt in deinem Browser und geht nirgendwohin. Die Datenschutzseite nennt jede Ausnahme, zum Beispiel, dass Koranverse unser Server holt und nicht dein Browser.",
              "Das ist keine Funktion, die wir später zu Geld machen. Athar ist als Sadaqah Jariyah gebaut: kostenlos, ohne Werbung, Open Source.",
            ],
          },
        ],
      },
      ar: {
        title: "مواقيت صلاة لا تغادر جهازك",
        description:
          "لماذا يحسب أثر مواقيت الصلاة واتجاه القبلة والتاريخ الهجري داخل المتصفح، وماذا يعني ذلك لموقعك.",
        sections: [
          {
            p: [
              "معظم تطبيقات مواقيت الصلاة تعمل بالطريقة نفسها: يُرسَل موقعك إلى خادم، ويعود إليك الجواب. الطريقة تعمل، لكنها تعني أيضًا أن جهةً ما تعرف أين تصلّي خمس مرات في اليوم.",
              "أثر يعمل بالعكس.",
            ],
          },
          {
            h: "الحساب يجري حيث أنت",
            p: [
              "عندما تفتح openathar.org وتسمح للمتصفح باستخدام موقعك، تُحسب مواقيت الصلاة داخل المتصفح نفسه، وكذلك اتجاه القبلة والتاريخ الهجري وطور القمر الليلة.",
              "إحداثياتك تُستخدم على جهازك وتبقى عليه. لا يوجد طلب يحملها إلينا، لأنه لا شيء عندنا يحتاج إليها.",
            ],
          },
          {
            h: "لماذا هذا ممكن أصلًا",
            p: [
              "مواقيت الصلاة علم فلك، لا سرّ. يكفي المكان والتاريخ وطريقة الحساب، وموقع الشمس يحسم الباقي. هي بضع مئات من الأسطر من رياضيات دقيقة، ينجزها الهاتف أو الحاسوب في جزء من الملّي ثانية.",
              "السؤال لم يكن يومًا: هل يمكن الحساب محليًا؟ بل: هل النتيجة المحلية صحيحة؟ وهذا موضوع المقال التالي: نواة حساب واحدة مكتوبة بلغة Java، ونسخة مطابقة لها بلغة TypeScript، تربطهما اختبارات مرجعية.",
            ],
          },
          {
            h: "ما ليس عندنا",
            p: [
              "لا ملفات تعريف ارتباط، ولا أدوات تحليل، ولا إعلانات، ولا سكربتات من أطراف أخرى. اختيارك للوضع الفاتح أو الداكن يُحفظ في متصفحك ولا يُرسل إلى أي مكان. وصفحة الخصوصية تذكر كل استثناء، مثل أن خادمنا هو الذي يجلب آيات القرآن، لا متصفحك.",
              "وهذه ليست ميزة سنحوّلها يومًا إلى مصدر ربح. أثر مبني صدقةً جارية: مجاني، بلا إعلانات، ومفتوح المصدر.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "one-core-two-languages",
    date: "2026-11-19",
    text: {
      en: {
        title: "One calculation, two languages",
        description:
          "How Athar keeps its Java calculation core and the TypeScript port in the browser from ever drifting apart.",
        sections: [
          {
            p: [
              "Calculating prayer times locally only helps if the result is right. And as soon as the same calculation exists twice, it will eventually disagree with itself. One fix lands in one place and not in the other, and nobody notices until someone's Fajr is four minutes off.",
            ],
          },
          {
            h: "One source of truth",
            p: [
              "Athar's calculations live in one library: athan-core, written in Java and published on Maven Central (org.openathar:athan-core). It covers prayer times as a port of the PrayTimes.org method, the Qibla bearing and Hijri conversion following the Umm al-Qura calendar.",
              "The public API uses exactly this library, pulled from Maven Central like any other dependency. It does not contain a second copy of the mathematics.",
            ],
          },
          {
            h: "A port that has to prove itself",
            p: [
              "The browser cannot run Java, so the website uses a TypeScript port of the same core. A port is a promise, and promises drift. So the port is held to the Java results: the reference values from the Java test suite are checked against the TypeScript implementation on every build.",
              "If the two ever disagree, the build fails before anything reaches the website. The rule in the project is short: never implement a calculation a second time without a reference test that ties it to the core.",
            ],
          },
          {
            h: "Why this matters beyond Athar",
            p: [
              "Both libraries are open source. If you build a mosque display, a school timetable or your own app, you do not have to start from a blog post and a formula. You can take the core, run the same tests, and know that your numbers match ours.",
            ],
          },
        ],
      },
      de: {
        title: "Eine Rechnung, zwei Sprachen",
        description:
          "Wie Athar dafür sorgt, dass der Rechenkern in Java und sein TypeScript-Port im Browser nie auseinanderlaufen.",
        sections: [
          {
            p: [
              "Gebetszeiten lokal zu rechnen hilft nur, wenn das Ergebnis stimmt. Und sobald dieselbe Rechnung zweimal existiert, widerspricht sie sich irgendwann selbst. Ein Fix landet an einer Stelle und nicht an der anderen, und keiner merkt es, bis bei jemandem Fadschr vier Minuten daneben liegt.",
            ],
          },
          {
            h: "Eine Quelle der Wahrheit",
            p: [
              "Die Rechnungen von Athar stecken in einer Bibliothek: athan-core, in Java geschrieben und auf Maven Central veröffentlicht (org.openathar:athan-core). Sie enthält die Gebetszeiten als Port der PrayTimes.org-Methode, die Qibla-Richtung und die Hijri-Umrechnung nach dem Umm-al-Qura-Kalender.",
              "Die öffentliche API nutzt genau diese Bibliothek, aus Maven Central eingebunden wie jede andere Abhängigkeit. Eine zweite Kopie der Mathematik enthält sie nicht.",
            ],
          },
          {
            h: "Ein Port, der sich beweisen muss",
            p: [
              "Der Browser kann kein Java ausführen, deshalb nutzt die Website einen TypeScript-Port desselben Kerns. Ein Port ist ein Versprechen, und Versprechen driften. Deshalb muss der Port die Java-Ergebnisse treffen: Die Referenzwerte aus der Java-Testsuite werden bei jedem Build gegen die TypeScript-Umsetzung geprüft.",
              "Weichen beide ab, scheitert der Build, bevor etwas auf der Website landet. Die Regel im Projekt ist kurz: keine Rechnung ein zweites Mal umsetzen ohne Referenztest, der sie an den Kern bindet.",
            ],
          },
          {
            h: "Warum das über Athar hinaus zählt",
            p: [
              "Beide Bibliotheken sind Open Source. Wer eine Moschee-Anzeige, einen Schulstundenplan oder eine eigene App baut, muss nicht bei einem Blogartikel und einer Formel anfangen. Man nimmt den Kern, lässt dieselben Tests laufen und weiß, dass die eigenen Zahlen mit unseren übereinstimmen.",
            ],
          },
        ],
      },
      ar: {
        title: "حساب واحد بلغتين",
        description:
          "كيف يضمن أثر ألّا تفترق نواة الحساب المكتوبة بلغة Java عن نسختها بلغة TypeScript في المتصفح.",
        sections: [
          {
            p: [
              "حساب مواقيت الصلاة محليًا لا يفيد إلا إذا كانت النتيجة صحيحة. وحين يوجد الحساب نفسه في مكانين، فإنه سيخالف نفسه يومًا ما: يُصلَح خطأ في مكان ولا يُصلَح في الآخر، ولا ينتبه أحد حتى يتأخر وقت الفجر عند أحدهم أربع دقائق.",
            ],
          },
          {
            h: "مصدر واحد للحقيقة",
            p: [
              "حسابات أثر موجودة في مكتبة واحدة: athan-core، مكتوبة بلغة Java ومنشورة على Maven Central باسم org.openathar:athan-core. تشمل مواقيت الصلاة وفق طريقة PrayTimes.org، واتجاه القبلة، وتحويل التاريخ الهجري وفق تقويم أم القرى.",
              "والواجهة البرمجية العامة تستخدم هذه المكتبة نفسها، تجلبها من Maven Central كأي مكتبة أخرى، ولا تحتوي على نسخة ثانية من الرياضيات.",
            ],
          },
          {
            h: "نسخة عليها أن تثبت نفسها",
            p: [
              "المتصفح لا يشغّل Java، لذلك يستخدم الموقع نسخة من النواة نفسها بلغة TypeScript. والنسخة وعد، والوعود تنحرف مع الوقت. لذلك تُلزَم النسخة بنتائج Java: القيم المرجعية من اختبارات Java تُفحص على نسخة TypeScript في كل عملية بناء.",
              "وإذا اختلفت النتيجتان يومًا، يفشل البناء قبل أن يصل أي شيء إلى الموقع. والقاعدة في المشروع قصيرة: لا يُكتب حساب مرة ثانية من دون اختبار مرجعي يربطه بالنواة.",
            ],
          },
          {
            h: "لماذا يهم هذا خارج أثر أيضًا",
            p: [
              "المكتبتان مفتوحتا المصدر. من يبني شاشة لمسجد، أو جدولًا لمدرسة، أو تطبيقًا خاصًا به، لا يحتاج إلى البدء من مقال ومعادلة. يأخذ النواة، ويشغّل الاختبارات نفسها، ويعرف أن أرقامه تطابق أرقامنا.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "a-free-public-api",
    date: "2026-11-21",
    text: {
      en: {
        title: "A public API with nothing to sell",
        description:
          "What the Athar API offers today, how it stays free and fair without accounts, and what is still missing.",
        sections: [
          {
            p: [
              "Every developer who builds something for Muslims ends up solving the same problems: prayer times for a city, the Hijri date, the Qibla. Most start from zero, or from a paid API with a free tier that changes its terms one day.",
              "The Athar API is meant to be the boring alternative: free, documented, and with nothing to upsell.",
            ],
          },
          {
            h: "What is there today",
            p: [
              "The first version is live at api.openathar.org: prayer times for a day, a date range or many places at once, the current and next prayer, and an iCalendar feed you can subscribe to in any calendar app. Next to them: calculation methods, the Qibla bearing, Hijri conversion and calendars, Islamic events, the moon phase and a place search.",
              "Behind every prayer time is the same open-source core the website uses, so the API and openathar.org always give the same answer.",
            ],
          },
          {
            h: "Fair without accounts",
            p: [
              "There is no sign-up. To keep the service fair for everyone, requests are counted per IP address in a one-minute window. If you need more, you can create an API key yourself. A key is a random value with an optional label, a creation time and a request counter. No name, no e-mail address.",
            ],
          },
          {
            h: "What is not there yet",
            p: [
              "Qur'an and adhkar content is not in the API yet. We want a text source whose licence clearly allows free redistribution before we publish it, and we would rather wait than guess.",
              "The developer portal on openathar.org lists every endpoint with examples and a playground. If something you need is missing, open an issue on GitHub. That is how the roadmap is decided.",
            ],
          },
        ],
      },
      de: {
        title: "Eine öffentliche API, die nichts verkaufen will",
        description:
          "Was die Athar-API heute bietet, wie sie ohne Konten kostenlos und fair bleibt und was noch fehlt.",
        sections: [
          {
            p: [
              "Wer Software für Musliminnen und Muslime baut, löst früher oder später dieselben Probleme: Gebetszeiten für eine Stadt, das Hijri-Datum, die Qibla. Die meisten fangen bei null an, oder bei einer bezahlten API mit Gratis-Stufe, deren Bedingungen sich eines Tages ändern.",
              "Die Athar-API soll die langweilige Alternative sein: kostenlos, dokumentiert und ohne etwas, das man später verkauft bekommt.",
            ],
          },
          {
            h: "Was es heute gibt",
            p: [
              "Die erste Version läuft unter api.openathar.org: Gebetszeiten für einen Tag, einen Zeitraum oder viele Orte auf einmal, das aktuelle und das nächste Gebet und ein iCalendar-Feed, den man in jeder Kalender-App abonnieren kann. Dazu Berechnungsmethoden, die Qibla-Richtung, Hijri-Umrechnung und Kalender, islamische Ereignisse, die Mondphase und eine Ortssuche.",
              "Hinter jeder Gebetszeit steht derselbe Open-Source-Kern wie auf der Website. API und openathar.org geben also immer dieselbe Antwort.",
            ],
          },
          {
            h: "Fair ohne Konten",
            p: [
              "Es gibt keine Anmeldung. Damit der Dienst für alle fair bleibt, werden Anfragen je IP-Adresse in einem Ein-Minuten-Fenster gezählt. Wer mehr braucht, legt sich selbst einen API-Schlüssel an. Ein Schlüssel ist ein Zufallswert mit optionalem Label, Erstellzeit und Anfragezähler. Kein Name, keine E-Mail-Adresse.",
            ],
          },
          {
            h: "Was noch fehlt",
            p: [
              "Koran- und Adhkar-Inhalte sind noch nicht in der API. Wir wollen eine Textquelle, deren Lizenz die freie Weitergabe klar erlaubt, bevor wir sie veröffentlichen, und warten lieber, als zu raten.",
              "Das Entwicklerportal auf openathar.org listet jeden Endpunkt mit Beispielen und einer Testumgebung. Fehlt etwas, das du brauchst, öffne ein Issue auf GitHub. So entsteht die Roadmap.",
            ],
          },
        ],
      },
      ar: {
        title: "واجهة برمجية عامة لا تبيع شيئًا",
        description:
          "ما تقدّمه واجهة أثر البرمجية اليوم، وكيف تبقى مجانية وعادلة من دون حسابات، وما الذي لم يُنجز بعد.",
        sections: [
          {
            p: [
              "كل مطوّر يبني شيئًا للمسلمين يصطدم بالمشكلات نفسها: مواقيت الصلاة لمدينة ما، والتاريخ الهجري، واتجاه القبلة. معظمهم يبدأ من الصفر، أو من واجهة مدفوعة لها باقة مجانية قد تتغيّر شروطها يومًا ما.",
              "واجهة أثر البرمجية تريد أن تكون البديل الهادئ: مجانية، موثّقة، ولا شيء فيها يُباع لاحقًا.",
            ],
          },
          {
            h: "ما المتاح اليوم",
            p: [
              "النسخة الأولى تعمل على api.openathar.org: مواقيت الصلاة ليوم واحد أو لفترة أو لعدة أماكن دفعة واحدة، والصلاة الحالية والقادمة، وتقويم بصيغة iCalendar يمكن الاشتراك فيه من أي تطبيق تقويم. ومعها طرق الحساب، واتجاه القبلة، وتحويل التاريخ الهجري والتقاويم، والمناسبات الإسلامية، وطور القمر، والبحث عن الأماكن.",
              "وخلف كل وقت صلاة النواة المفتوحة المصدر نفسها التي يستخدمها الموقع، فتعطي الواجهة وopenathar.org الجواب نفسه دائمًا.",
            ],
          },
          {
            h: "عادلة من دون حسابات",
            p: [
              "لا يوجد تسجيل. ولكي تبقى الخدمة عادلة للجميع، تُعدّ الطلبات لكل عنوان IP خلال نافذة مدتها دقيقة. ومن يحتاج أكثر ينشئ مفتاحًا برمجيًا بنفسه. المفتاح قيمة عشوائية مع وصف اختياري، ووقت الإنشاء، وعدّاد للطلبات. لا اسم ولا بريد إلكتروني.",
            ],
          },
          {
            h: "ما لم يُنجز بعد",
            p: [
              "محتوى القرآن والأذكار ليس في الواجهة بعد. نريد مصدرًا للنص تسمح رخصته بوضوح بإعادة النشر المجاني قبل أن ننشره، ونفضّل الانتظار على التخمين.",
              "بوابة المطوّرين على openathar.org تعرض كل نقطة وصول مع أمثلة وبيئة تجربة. وإن كان شيء تحتاجه ناقصًا، افتح طلبًا (issue) على GitHub؛ هكذا تُرسم خارطة الطريق.",
            ],
          },
        ],
      },
    },
  },
];

/** Neueste zuerst; Artikel mit Datum in der Zukunft erscheinen erst ab ihrem Tag. */
export function publishedPosts(now: Date = new Date()): BlogPost[] {
  const today = now.toISOString().slice(0, 10);
  return blogPosts.filter((p) => p.date <= today).sort((a, b) => b.date.localeCompare(a.date));
}

export function findPost(slug: string, now: Date = new Date()): BlogPost | undefined {
  return publishedPosts(now).find((p) => p.slug === slug);
}
