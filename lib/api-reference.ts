/**
 * Single source of truth for the public API reference.
 *
 * Deliberately English-only: the marketing pages are translated, the
 * developer reference is not. Endpoint names, parameters and JSON field
 * names are English anyway, and a half-translated reference is worse than
 * an honest monolingual one. Only the page chrome around it (nav, theme,
 * language switch) stays localized.
 *
 * Everything on /developers is rendered from this file — the section index,
 * the endpoint panels, the code samples. Adding an endpoint here adds it to
 * the navigation and the docs body in one step, so the page can never drift
 * from the list it advertises.
 */

export const API_BASE = "https://api.openathar.org";

export type Param = {
  name: string;
  type: "number" | "string" | "date" | "enum";
  required: boolean;
  default?: string;
  example: string;
  notes: string;
  /** Allowed values, for enum-ish params. Rendered as a hint row. */
  values?: string[];
};

export type Field = { name: string; type: string; notes: string };

export type Endpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  title: string;
  /** One line, shown in the index rail and as the panel subtitle. */
  summary: string;
  description: string;
  /** "path": the key itself is the path segment, no header involved. */
  auth: "none" | "optional" | "path";
  params: Param[];
  /** Request body sample for POST endpoints. */
  body?: string;
  response: { fields: Field[]; sample: string };
};

/* ------------------------------------------------------------------ *
 * Live endpoints
 * ------------------------------------------------------------------ */

export const endpoints: Endpoint[] = [
  {
    id: "prayer-times",
    method: "GET",
    path: "/v1/prayer-times",
    title: "Prayer times",
    summary: "Five daily prayers, sunrise, midnight and the Duha window.",
    description:
      "Computes the prayer times for one location, one date and one calculation method. Times come back as local wall-clock strings (HH:mm) already shifted by the utcOffset you pass — no timezone database needed on your side. The maths is the same athan-core code that runs inside the Athar apps, so a client and the server always agree. At high latitudes in summer, when the sun never sinks far enough for Fajr or Isha, both are placed by the middle-of-the-night rule. Where an event does not happen at all — polar day or polar night — its field is null, never a made-up time.",
    auth: "optional",
    params: [
      { name: "lat", type: "number", required: true, example: "52.52", notes: "Latitude in decimal degrees, −90 to 90." },
      { name: "lon", type: "number", required: true, example: "13.405", notes: "Longitude in decimal degrees, −180 to 180." },
      { name: "date", type: "date", required: true, example: "2026-09-14", notes: "Gregorian date, ISO 8601 (YYYY-MM-DD)." },
      {
        name: "method",
        type: "enum",
        required: false,
        default: "MWL",
        example: "MWL",
        notes: "Twilight angle set used for Fajr and Isha.",
        values: ["MWL", "ISNA", "EGYPT", "MAKKAH", "KARACHI", "TEHRAN", "JAFARI", "FRANCE", "RUSSIA", "MALAYSIA", "SINGAPORE"],
      },
      {
        name: "utcOffset",
        type: "number",
        required: false,
        default: "0",
        example: "2",
        notes: "Hours offset applied to render local times, −12 to 14. Fractional offsets (5.5) are allowed.",
      },
    ],
    response: {
      fields: [
        { name: "date", type: "string", notes: "The requested date, echoed back." },
        { name: "method", type: "string", notes: "Calculation method actually used." },
        { name: "latitude / longitude", type: "number", notes: "Coordinates echoed back." },
        { name: "utcOffsetHours", type: "number", notes: "Offset applied to the wall-clock strings." },
        { name: "dhuhr", type: "string", notes: "HH:mm local time. Always present." },
        { name: "fajr / asr / maghrib / isha", type: "string | null", notes: "HH:mm local time; null where the prayer does not occur (polar day or night)." },
        { name: "sunrise / sunset", type: "string | null", notes: "Solar events bounding the day; null during polar day or night." },
        { name: "midnight", type: "string | null", notes: "Islamic midnight. Standard methods: solar midnight, always present. TEHRAN / JAFARI: midpoint of sunset and Fajr, null where either is missing." },
        { name: "duhaStart / duhaBest / duhaEnd", type: "string | null", notes: "Forenoon prayer window and its recommended moment; all null when there is no sunrise." },
      ],
      sample: `{
  "date": "2026-09-14",
  "method": "MWL",
  "latitude": 52.52,
  "longitude": 13.405,
  "utcOffsetHours": 2.0,
  "fajr": "04:38",
  "sunrise": "06:39",
  "dhuhr": "13:02",
  "asr": "16:30",
  "sunset": "19:24",
  "maghrib": "19:25",
  "isha": "21:17",
  "midnight": "01:02",
  "duhaStart": "06:54",
  "duhaEnd": "12:52",
  "duhaBest": "09:51"
}`,
    },
  },
  {
    id: "prayer-times-range",
    method: "GET",
    path: "/v1/prayer-times/range",
    title: "Date ranges",
    summary: "Prayer times for every day from one date to another.",
    description:
      "The same calculation as the daily endpoint for each day of an inclusive date range, in one call — a printable month costs one request instead of thirty. Every entry in days is exactly what /v1/prayer-times returns for that date. At most 62 days per call; a longer range, or a to before from, returns 400. Like the daily endpoint it is deterministic and cached forever.",
    auth: "optional",
    params: [
      { name: "lat", type: "number", required: true, example: "52.52", notes: "Latitude in decimal degrees, −90 to 90." },
      { name: "lon", type: "number", required: true, example: "13.405", notes: "Longitude in decimal degrees, −180 to 180." },
      { name: "from", type: "date", required: true, example: "2026-09-14", notes: "First day, ISO 8601 (YYYY-MM-DD)." },
      { name: "to", type: "date", required: true, example: "2026-09-15", notes: "Last day, inclusive. At most 62 days after from." },
      {
        name: "method",
        type: "enum",
        required: false,
        default: "MWL",
        example: "MWL",
        notes: "Calculation method. See /v1/methods for what each one means.",
        values: ["MWL", "ISNA", "EGYPT", "MAKKAH", "KARACHI", "TEHRAN", "JAFARI", "FRANCE", "RUSSIA", "MALAYSIA", "SINGAPORE"],
      },
      { name: "utcOffset", type: "number", required: false, default: "0", example: "2", notes: "Hours offset applied to render local times, −12 to 14." },
    ],
    response: {
      fields: [
        { name: "from / to", type: "string", notes: "The requested range, echoed back." },
        { name: "method", type: "string", notes: "Calculation method actually used." },
        { name: "latitude / longitude / utcOffsetHours", type: "number", notes: "Inputs echoed back." },
        { name: "days", type: "object[]", notes: "One entry per day, in date order, in the shape of the /v1/prayer-times response." },
      ],
      sample: `{
  "from": "2026-09-14",
  "to": "2026-09-15",
  "method": "MWL",
  "latitude": 52.52,
  "longitude": 13.405,
  "utcOffsetHours": 2.0,
  "days": [
    { "date": "2026-09-14", "method": "MWL", "fajr": "04:38", "sunrise": "06:39", "dhuhr": "13:02", "asr": "16:30", "sunset": "19:24", "maghrib": "19:25", "isha": "21:17", "midnight": "01:02", "duhaStart": "06:54", "duhaEnd": "12:52", "duhaBest": "09:51", "…": "…" },
    { "date": "2026-09-15", "…": "…" }
  ]
}`,
    },
  },
  {
    id: "prayer-times-next",
    method: "GET",
    path: "/v1/prayer-times/next",
    title: "Current & next prayer",
    summary: "Which prayer is now, which is next, and seconds until it.",
    description:
      "Answers the question every prayer app asks: which prayer has most recently started, which one comes next, and how many seconds are left. It rolls over midnight correctly — before Fajr the current prayer is yesterday’s Isha, after Isha the next one is tomorrow’s Fajr — and skips prayers that do not occur at the location (polar day or night). Without at the answer is for the current moment and is not cached; with an explicit at it is deterministic and cached forever.",
    auth: "optional",
    params: [
      { name: "lat", type: "number", required: true, example: "52.52", notes: "Latitude in decimal degrees, −90 to 90." },
      { name: "lon", type: "number", required: true, example: "13.405", notes: "Longitude in decimal degrees, −180 to 180." },
      {
        name: "method",
        type: "enum",
        required: false,
        default: "MWL",
        example: "MWL",
        notes: "Calculation method. See /v1/methods.",
        values: ["MWL", "ISNA", "EGYPT", "MAKKAH", "KARACHI", "TEHRAN", "JAFARI", "FRANCE", "RUSSIA", "MALAYSIA", "SINGAPORE"],
      },
      { name: "utcOffset", type: "number", required: false, default: "0", example: "2", notes: "Hours offset of the location, −12 to 14. Decides the local date and time." },
      { name: "at", type: "string", required: false, default: "now", example: "2026-09-14T15:30:00Z", notes: "The moment to answer for, as an ISO 8601 instant. Useful for testing; defaults to now." },
    ],
    response: {
      fields: [
        { name: "localTime", type: "string", notes: "The moment the answer is for, as local date-time (utcOffset applied)." },
        { name: "current", type: "object", notes: "The latest prayer that has started: name (fajr, dhuhr, asr, maghrib, isha), date and HH:mm time." },
        { name: "next", type: "object", notes: "The next prayer to start, same shape. Can be on the following date." },
        { name: "secondsUntilNext", type: "number", notes: "Seconds from localTime until next starts." },
        { name: "method / latitude / longitude / utcOffsetHours", type: "string | number", notes: "Inputs echoed back." },
      ],
      sample: `{
  "method": "MWL",
  "latitude": 52.52,
  "longitude": 13.405,
  "utcOffsetHours": 2.0,
  "localTime": "2026-09-14T17:30:00",
  "current": { "name": "asr", "date": "2026-09-14", "time": "16:30" },
  "next": { "name": "maghrib", "date": "2026-09-14", "time": "19:25" },
  "secondsUntilNext": 6900
}`,
    },
  },
  {
    id: "methods",
    method: "GET",
    path: "/v1/methods",
    title: "Calculation methods",
    summary: "Every accepted method with its angles and rules.",
    description:
      "The catalogue behind the method parameter: each accepted id with its authority, the Fajr angle, the Isha and Maghrib rules and the midnight rule. Build a settings picker from this instead of hardcoding a list that goes stale. Fajr is always an angle below the horizon; Isha and Maghrib are either an angle or a fixed number of minutes. All methods use the standard Asr shadow rule and place Fajr and Isha by the middle-of-the-night rule where the sun does not sink far enough. Cached for a day.",
    auth: "optional",
    params: [],
    response: {
      fields: [
        { name: "methods[].id", type: "string", notes: "Value for the method parameter." },
        { name: "methods[].name", type: "string", notes: "The authority or convention behind it." },
        { name: "methods[].fajrAngle", type: "number", notes: "Sun depression angle for Fajr, in degrees." },
        { name: "methods[].isha / maghrib", type: "object", notes: "{ type: \"angle\" | \"minutes\", value } — degrees below the horizon, or minutes (after Maghrib for Isha, after sunset for Maghrib)." },
        { name: "methods[].midnight", type: "string", notes: "STANDARD (solar midnight) or JAFARI (midpoint of sunset and Fajr)." },
        { name: "asr / highLatitude", type: "string", notes: "Rules shared by every method: STANDARD and NIGHT_MIDDLE." },
      ],
      sample: `{
  "methods": [
    {
      "id": "MWL",
      "name": "Muslim World League",
      "fajrAngle": 18.0,
      "isha": { "type": "angle", "value": 17.0 },
      "maghrib": { "type": "minutes", "value": 1.0 },
      "midnight": "STANDARD"
    },
    { "id": "MAKKAH", "name": "Umm al-Qura University, Makkah", "fajrAngle": 18.5, "isha": { "type": "minutes", "value": 90.0 }, "…": "…" }
  ],
  "asr": "STANDARD",
  "highLatitude": "NIGHT_MIDDLE"
}`,
    },
  },
  {
    id: "qibla",
    method: "GET",
    path: "/v1/qibla",
    title: "Qibla",
    summary: "Great-circle bearing to the Kaaba, clockwise from true north.",
    description:
      "Returns the direction of prayer for a location as a bearing in degrees from true north. It is a great-circle bearing, not a flat-map heading — compass apps should correct for magnetic declination themselves before drawing an arrow.",
    auth: "optional",
    params: [
      { name: "lat", type: "number", required: true, example: "52.52", notes: "Latitude in decimal degrees, −90 to 90." },
      { name: "lon", type: "number", required: true, example: "13.405", notes: "Longitude in decimal degrees, −180 to 180." },
    ],
    response: {
      fields: [
        { name: "latitude / longitude", type: "number", notes: "Coordinates echoed back." },
        { name: "bearingDegrees", type: "number", notes: "0 = true north, 90 = east. Range 0–360, full precision — round for display." },
      ],
      sample: `{
  "latitude": 52.52,
  "longitude": 13.405,
  "bearingDegrees": 136.6848865372571
}`,
    },
  },
  {
    id: "hijri",
    method: "GET",
    path: "/v1/hijri",
    title: "Hijri date",
    summary: "Gregorian → Hijri (Umm al-Qura) conversion with month names.",
    description:
      "Converts a Gregorian date into the Umm al-Qura calendar — the precomputed astronomical table Saudi Arabia uses as its civil calendar. A local moon sighting may legitimately differ by a day, so treat the result as the civil reference rather than a religious ruling. Supported range is the span of that table: 1882-11-12 to 2174-11-25 (1300–1600 AH); dates outside it return 400. With an explicit date the response is cached forever; without one it means “today” and is cached for five minutes only.",
    auth: "optional",
    params: [
      { name: "date", type: "date", required: false, default: "today", example: "2026-09-14", notes: "Gregorian date to convert, 1882-11-12 to 2174-11-25. Defaults to today (UTC)." },
      { name: "locale", type: "enum", required: false, default: "en", example: "en", notes: "Language of monthName. de uses the same transliteration as en.", values: ["en", "ar", "de"] },
    ],
    response: {
      fields: [
        { name: "gregorianDate", type: "string", notes: "The date that was converted." },
        { name: "day / month / year", type: "number", notes: "Hijri components. Month is 1–12." },
        { name: "monthName", type: "string", notes: "Localized month name, per locale." },
      ],
      sample: `{
  "gregorianDate": "2026-09-14",
  "day": 3,
  "month": 4,
  "year": 1448,
  "monthName": "Rabi' al-thani"
}`,
    },
  },
  {
    id: "api-keys",
    method: "POST",
    path: "/v1/api-keys",
    title: "Issue an API key",
    summary: "Create a key for the higher rate limit. No account needed.",
    description:
      "Issues an API key instantly — no sign-up, no email, no billing. The key is shown exactly once in the response; lose it and you simply issue another one. The optional label (max 64 characters, default “unlabeled”) is only there to tell your keys apart. A mistyped or unknown key in X-API-Key is never rejected — the request simply counts as anonymous.",
    auth: "none",
    params: [],
    body: `{
  "label": "my-prayer-widget"
}`,
    response: {
      fields: [
        { name: "apiKey", type: "string", notes: "Send as the X-API-Key header. Shown once." },
        { name: "label", type: "string", notes: "Your label, max 64 characters; “unlabeled” if omitted." },
        { name: "createdAt", type: "string", notes: "ISO 8601 timestamp." },
      ],
      sample: `{
  "apiKey": "ath_x7Kp2mQ9vLr4TnW8bYc3HdF6jZs1Ne5A",
  "label": "my-prayer-widget",
  "createdAt": "2026-09-14T09:12:03Z"
}`,
    },
  },
  {
    id: "api-key-usage",
    method: "GET",
    path: "/v1/api-keys/{apiKey}/usage",
    title: "Key usage",
    summary: "Request count for one key since it was issued.",
    description:
      "A usage snapshot for a single key. Counting is per key, not per user — Athar stores no identity to attach it to.",
    auth: "path",
    params: [
      { name: "apiKey", type: "string", required: true, example: "ath_YOUR_KEY", notes: "Path segment, not a query parameter or header." },
    ],
    response: {
      fields: [
        { name: "label", type: "string", notes: "Label given at creation." },
        { name: "createdAt", type: "string", notes: "When the key was issued." },
        { name: "requestCount", type: "number", notes: "Total requests made with this key." },
      ],
      sample: `{
  "label": "my-prayer-widget",
  "createdAt": "2026-09-14T09:12:03Z",
  "requestCount": 1423
}`,
    },
  },
];

/* ------------------------------------------------------------------ *
 * Errors & limits
 * ------------------------------------------------------------------ */

export const errorCodes: { status: string; meaning: string; fix: string }[] = [
  { status: "400", meaning: "Bad request", fix: "A required parameter is missing or does not parse, a value is out of range (latitude, longitude, utcOffset, a Hijri date outside 1882–2174), the method is unknown, the JSON body is malformed, or a key label exceeds 64 characters. The message says which." },
  { status: "404", meaning: "Not found", fix: "Unknown path — or, on the usage endpoint, a key that does not exist (\"unknown API key\")." },
  { status: "405", meaning: "Method not allowed", fix: "Wrong HTTP method for the path. The Allow header lists the right one." },
  { status: "415", meaning: "Unsupported media type", fix: "POST bodies must be sent as Content-Type: application/json. A bare curl -d sends form data and lands here." },
  { status: "429", meaning: "Rate limited", fix: "You crossed the window limit. Wait for the seconds given in the Retry-After header, or send an API key for the higher ceiling." },
  { status: "500", meaning: "Server error", fix: "Something broke on the Athar side; the message is deliberately generic. Worth an issue on GitHub — include the full request URL." },
];

export const rateLimits = [
  { tier: "Anonymous", key: "by IP address", limit: "60 requests / minute", tone: "muted" as const },
  { tier: "With X-API-Key", key: "by key", limit: "600 requests / minute", tone: "gold" as const },
];

/* ------------------------------------------------------------------ *
 * Roadmap — endpoints under consideration
 *
 * Kept in the docs on purpose: the honest state of a young API is more
 * useful to a developer deciding to build on it than a polished page that
 * hides the gaps. Status distinguishes what is already computable from the
 * existing core from what needs new data.
 * ------------------------------------------------------------------ */

export type Proposal = {
  method: string;
  path: string;
  title: string;
  why: string;
  status: "next" | "planned" | "exploring";
};

export const roadmap: Proposal[] = [
  {
    method: "GET",
    path: "/v1/prayer-times.ics",
    title: "Calendar subscription feed",
    why: "An iCalendar feed turns prayer times into a subscribable calendar in Apple Calendar, Google Calendar or Outlook — reach far beyond people who install another app, at almost no cost.",
    status: "next",
  },
  {
    method: "GET",
    path: "/v1/calendar/hijri",
    title: "Hijri month grid & reverse conversion",
    why: "Hijri → Gregorian is already implemented in the web client but not exposed. A full month grid would let any client render a Hijri calendar without shipping conversion logic.",
    status: "next",
  },
  {
    method: "GET",
    path: "/v1/events",
    title: "Islamic dates & observances",
    why: "Ramadan, the two Eids, Ashura, Laylat al-Qadr — with countdowns from a given date. The event table already exists client-side; promoting it to the API makes it reusable and correctable in one place.",
    status: "planned",
  },
  {
    method: "GET",
    path: "/v1/moon",
    title: "Moon phase & events",
    why: "Phase, illumination, age, next new and full moon. It is the astronomy that underpins the Hijri month and it powers the visuals on this very site — worth exposing rather than keeping private.",
    status: "planned",
  },
  {
    method: "GET",
    path: "/v1/places",
    title: "City lookup & timezone resolution",
    why: "Most integrations start from a city name, not coordinates. Resolving name → lat/lon/timezone removes the one dependency that pushes developers to a third-party geocoder.",
    status: "exploring",
  },
  {
    method: "POST",
    path: "/v1/prayer-times/batch",
    title: "Batch requests",
    why: "One request, many locations — for mosque directories, dashboards and multi-city widgets that would otherwise hammer the rate limit.",
    status: "exploring",
  },
  {
    method: "GET",
    path: "/v1/quran/verse",
    title: "Quran & Adhkar content",
    why: "The largest expansion, and the one that turns a calculation API into a platform API. Needs a licence-clean text source and careful versioning before it can be promised.",
    status: "exploring",
  },
];

/* ------------------------------------------------------------------ *
 * Code sample generation
 * ------------------------------------------------------------------ */

export type Lang = "curl" | "javascript" | "python" | "swift" | "kotlin";

export const langLabels: Record<Lang, string> = {
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
  swift: "Swift",
  kotlin: "Kotlin",
};

/** Example query string built from each parameter's documented example. */
function exampleQuery(e: Endpoint): string {
  const pairs = e.params
    .filter((p) => !e.path.includes(`{${p.name}}`))
    .filter((p) => p.required || p.default === undefined || p.example !== p.default)
    .map((p) => `${p.name}=${encodeURIComponent(p.example)}`);
  return pairs.join("&");
}

function examplePath(e: Endpoint): string {
  return e.path.replace(/\{(\w+)\}/g, (_, name: string) => {
    const p = e.params.find((x) => x.name === name);
    return p ? p.example : `{${name}}`;
  });
}

/** Fully-qualified example URL for an endpoint, used by every sample. */
export function exampleUrl(e: Endpoint): string {
  const q = exampleQuery(e);
  return `${API_BASE}${examplePath(e)}${q ? `?${q}` : ""}`;
}

/**
 * Renders a runnable snippet per language. Samples are generated rather
 * than written by hand so they cannot contradict the parameter table
 * directly above them.
 */
export function codeSample(e: Endpoint, lang: Lang): string {
  const url = exampleUrl(e);
  const isPost = e.method === "POST";

  switch (lang) {
    case "curl":
      if (isPost) {
        return `curl -X POST "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${(e.body ?? "{}").replace(/\n\s*/g, " ")}'`;
      }
      return `curl "${url}"`;

    case "javascript":
      if (isPost) {
        return `const res = await fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ label: "my-prayer-widget" }),
});
const data = await res.json();`;
      }
      return `const res = await fetch("${url}");
const data = await res.json();`;

    case "python":
      if (isPost) {
        return `import requests

res = requests.post(
    "${url}",
    json={"label": "my-prayer-widget"},
)
data = res.json()`;
      }
      return `import requests

res = requests.get("${url}")
data = res.json()`;

    case "swift":
      if (isPost) {
        return `var request = URLRequest(url: URL(string: "${url}")!)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.httpBody = try JSONSerialization.data(withJSONObject: ["label": "my-prayer-widget"])
let (data, _) = try await URLSession.shared.data(for: request)
let json = try JSONSerialization.jsonObject(with: data)`;
      }
      return `let url = URL(string: "${url}")!
let (data, _) = try await URLSession.shared.data(from: url)
let json = try JSONSerialization.jsonObject(with: data)`;

    case "kotlin":
      if (isPost) {
        return `import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody

val body = """{"label":"my-prayer-widget"}"""
    .toRequestBody("application/json".toMediaType())
val request = Request.Builder()
    .url("${url}")
    .post(body)
    .build()
OkHttpClient().newCall(request).execute().use { response ->
    val json = response.body?.string()
}`;
      }
      return `val client = OkHttpClient()
val request = Request.Builder()
    .url("${url}")
    .build()
client.newCall(request).execute().use { response ->
    val json = response.body?.string()
}`;
  }
}
