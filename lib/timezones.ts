/**
 * IANA-Zeitzone → ungefähre Stadtkoordinaten.
 *
 * Warum dieser Umweg statt Geolocation oder IP-Auflösung:
 * - Die Geolocation-API verlangt eine Berechtigung und liefert metergenaue
 *   Position. Beides ist für Gebetszeiten unnötig.
 * - Eine IP-Auflösung müsste über unseren Server laufen. Genau das schliesst
 *   das Versprechen der Seite aus ("kein Server muss wissen, wo du betest").
 *
 * Die Zeitzone steht ohnehin im Browser bereit, ist grob (Stadt- bis
 * Landesebene) und verlässt das Gerät nicht. Für Gebetszeiten ist das
 * ausreichend genau: Ein Versatz von einigen Kilometern verschiebt die
 * Zeiten um Sekunden.
 */

export type Place = { city: string; lat: number; lon: number };

export const timezonePlaces: Record<string, Place> = {
  // MENA
  "Asia/Amman": { city: "Amman", lat: 31.9539, lon: 35.9106 },
  "Asia/Riyadh": { city: "Riyadh", lat: 24.7136, lon: 46.6753 },
  "Asia/Dubai": { city: "Dubai", lat: 25.2048, lon: 55.2708 },
  "Asia/Qatar": { city: "Doha", lat: 25.2854, lon: 51.531 },
  "Asia/Kuwait": { city: "Kuwait City", lat: 29.3759, lon: 47.9774 },
  "Asia/Bahrain": { city: "Manama", lat: 26.2285, lon: 50.586 },
  "Asia/Muscat": { city: "Muscat", lat: 23.588, lon: 58.3829 },
  "Asia/Baghdad": { city: "Baghdad", lat: 33.3152, lon: 44.3661 },
  "Asia/Damascus": { city: "Damascus", lat: 33.5138, lon: 36.2765 },
  "Asia/Beirut": { city: "Beirut", lat: 33.8938, lon: 35.5018 },
  "Asia/Jerusalem": { city: "Jerusalem", lat: 31.7683, lon: 35.2137 },
  "Asia/Hebron": { city: "Hebron", lat: 31.5326, lon: 35.0998 },
  "Asia/Gaza": { city: "Gaza", lat: 31.5017, lon: 34.4668 },
  "Africa/Cairo": { city: "Cairo", lat: 30.0444, lon: 31.2357 },
  "Africa/Khartoum": { city: "Khartoum", lat: 15.5007, lon: 32.5599 },
  "Africa/Tripoli": { city: "Tripoli", lat: 32.8872, lon: 13.1913 },
  "Africa/Tunis": { city: "Tunis", lat: 36.8065, lon: 10.1815 },
  "Africa/Algiers": { city: "Algiers", lat: 36.7538, lon: 3.0588 },
  "Africa/Casablanca": { city: "Casablanca", lat: 33.5731, lon: -7.5898 },
  "Asia/Tehran": { city: "Tehran", lat: 35.6892, lon: 51.389 },

  // Europa
  "Europe/Berlin": { city: "Berlin", lat: 52.52, lon: 13.405 },
  "Europe/Vienna": { city: "Vienna", lat: 48.2082, lon: 16.3738 },
  "Europe/Zurich": { city: "Zurich", lat: 47.3769, lon: 8.5417 },
  "Europe/Paris": { city: "Paris", lat: 48.8566, lon: 2.3522 },
  "Europe/London": { city: "London", lat: 51.5072, lon: -0.1276 },
  "Europe/Dublin": { city: "Dublin", lat: 53.3498, lon: -6.2603 },
  "Europe/Madrid": { city: "Madrid", lat: 40.4168, lon: -3.7038 },
  "Europe/Lisbon": { city: "Lisbon", lat: 38.7223, lon: -9.1393 },
  "Europe/Rome": { city: "Rome", lat: 41.9028, lon: 12.4964 },
  "Europe/Amsterdam": { city: "Amsterdam", lat: 52.3676, lon: 4.9041 },
  "Europe/Brussels": { city: "Brussels", lat: 50.8476, lon: 4.3572 },
  "Europe/Copenhagen": { city: "Copenhagen", lat: 55.6761, lon: 12.5683 },
  "Europe/Stockholm": { city: "Stockholm", lat: 59.3293, lon: 18.0686 },
  "Europe/Oslo": { city: "Oslo", lat: 59.9139, lon: 10.7522 },
  "Europe/Helsinki": { city: "Helsinki", lat: 60.1699, lon: 24.9384 },
  "Europe/Warsaw": { city: "Warsaw", lat: 52.2297, lon: 21.0122 },
  "Europe/Prague": { city: "Prague", lat: 50.0755, lon: 14.4378 },
  "Europe/Budapest": { city: "Budapest", lat: 47.4979, lon: 19.0402 },
  "Europe/Bucharest": { city: "Bucharest", lat: 44.4268, lon: 26.1025 },
  "Europe/Sofia": { city: "Sofia", lat: 42.6977, lon: 23.3219 },
  "Europe/Athens": { city: "Athens", lat: 37.9838, lon: 23.7275 },
  "Europe/Istanbul": { city: "Istanbul", lat: 41.0082, lon: 28.9784 },
  "Europe/Moscow": { city: "Moscow", lat: 55.7558, lon: 37.6173 },
  "Europe/Kyiv": { city: "Kyiv", lat: 50.4501, lon: 30.5234 },
  "Europe/Belgrade": { city: "Belgrade", lat: 44.7866, lon: 20.4489 },
  "Europe/Sarajevo": { city: "Sarajevo", lat: 43.8563, lon: 18.4131 },
  "Europe/Tirane": { city: "Tirana", lat: 41.3275, lon: 19.8187 },
  "Europe/Skopje": { city: "Skopje", lat: 41.9981, lon: 21.4254 },

  // Asien
  "Asia/Karachi": { city: "Karachi", lat: 24.8607, lon: 67.0011 },
  "Asia/Kolkata": { city: "Delhi", lat: 28.6139, lon: 77.209 },
  "Asia/Dhaka": { city: "Dhaka", lat: 23.8103, lon: 90.4125 },
  "Asia/Kabul": { city: "Kabul", lat: 34.5553, lon: 69.2075 },
  "Asia/Tashkent": { city: "Tashkent", lat: 41.2995, lon: 69.2401 },
  "Asia/Almaty": { city: "Almaty", lat: 43.222, lon: 76.8512 },
  "Asia/Baku": { city: "Baku", lat: 40.4093, lon: 49.8671 },
  "Asia/Jakarta": { city: "Jakarta", lat: -6.2088, lon: 106.8456 },
  "Asia/Kuala_Lumpur": { city: "Kuala Lumpur", lat: 3.139, lon: 101.6869 },
  "Asia/Singapore": { city: "Singapore", lat: 1.3521, lon: 103.8198 },
  "Asia/Manila": { city: "Manila", lat: 14.5995, lon: 120.9842 },
  "Asia/Bangkok": { city: "Bangkok", lat: 13.7563, lon: 100.5018 },
  "Asia/Shanghai": { city: "Shanghai", lat: 31.2304, lon: 121.4737 },
  "Asia/Tokyo": { city: "Tokyo", lat: 35.6762, lon: 139.6503 },
  "Asia/Seoul": { city: "Seoul", lat: 37.5665, lon: 126.978 },
  "Asia/Hong_Kong": { city: "Hong Kong", lat: 22.3193, lon: 114.1694 },

  // Afrika (weitere)
  "Africa/Lagos": { city: "Lagos", lat: 6.5244, lon: 3.3792 },
  "Africa/Accra": { city: "Accra", lat: 5.6037, lon: -0.187 },
  "Africa/Dakar": { city: "Dakar", lat: 14.7167, lon: -17.4677 },
  "Africa/Nairobi": { city: "Nairobi", lat: -1.2921, lon: 36.8219 },
  "Africa/Addis_Ababa": { city: "Addis Ababa", lat: 9.03, lon: 38.74 },
  "Africa/Mogadishu": { city: "Mogadishu", lat: 2.0469, lon: 45.3182 },
  "Africa/Johannesburg": { city: "Johannesburg", lat: -26.2041, lon: 28.0473 },

  // Amerika
  "America/New_York": { city: "New York", lat: 40.7128, lon: -74.006 },
  "America/Toronto": { city: "Toronto", lat: 43.6532, lon: -79.3832 },
  "America/Chicago": { city: "Chicago", lat: 41.8781, lon: -87.6298 },
  "America/Denver": { city: "Denver", lat: 39.7392, lon: -104.9903 },
  "America/Los_Angeles": { city: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  "America/Vancouver": { city: "Vancouver", lat: 49.2827, lon: -123.1207 },
  "America/Mexico_City": { city: "Mexico City", lat: 19.4326, lon: -99.1332 },
  "America/Sao_Paulo": { city: "São Paulo", lat: -23.5505, lon: -46.6333 },
  "America/Buenos_Aires": { city: "Buenos Aires", lat: -34.6037, lon: -58.3816 },

  // Ozeanien
  "Australia/Sydney": { city: "Sydney", lat: -33.8688, lon: 151.2093 },
  "Australia/Melbourne": { city: "Melbourne", lat: -37.8136, lon: 144.9631 },
  "Australia/Perth": { city: "Perth", lat: -31.9523, lon: 115.8613 },
  "Pacific/Auckland": { city: "Auckland", lat: -36.8485, lon: 174.7633 },
};

/** Ort aus der Browser-Zeitzone. `null`, wenn die Zone unbekannt ist. */
export function placeFromTimezone(timezone: string): Place | null {
  return timezonePlaces[timezone] ?? null;
}
