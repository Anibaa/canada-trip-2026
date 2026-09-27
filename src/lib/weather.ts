// Daily weather for each trip day: live Open-Meteo forecast (up to 16 days out, re-fetched every
// 3 hours via ISR), falling back to Oct 1–13 averages from the 2016–2025 archive (weather-normals.json).
import normals from "./weather-normals.json";

export const WEATHER_REVALIDATE = 10800; // seconds

export type WeatherLoc = "vancouver" | "montreal" | "toronto" | "niagara";

const locations: Record<WeatherLoc, { name: string; lat: number; lon: number }> = {
  vancouver: { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
  montreal: { name: "Montreal", lat: 45.5019, lon: -73.5674 },
  toronto: { name: "Toronto", lat: 43.6532, lon: -79.3832 },
  niagara: { name: "Niagara Falls", lat: 43.0896, lon: -79.0849 },
};

// Where you are each day (Oct 11 is split between Toronto and the Falls).
const tripDays: Record<string, WeatherLoc[]> = {
  "2026-10-01": ["vancouver"],
  "2026-10-02": ["vancouver"],
  "2026-10-03": ["vancouver"],
  "2026-10-04": ["vancouver"],
  "2026-10-05": ["vancouver"],
  "2026-10-06": ["vancouver"],
  "2026-10-07": ["vancouver"],
  "2026-10-08": ["vancouver"],
  "2026-10-09": ["montreal"],
  "2026-10-10": ["montreal"],
  "2026-10-11": ["toronto", "niagara"],
  "2026-10-12": ["montreal"],
  "2026-10-13": ["montreal"],
};

export interface DayWeather {
  date: string; // YYYY-MM-DD
  place: string;
  kind: "forecast" | "early-forecast" | "typical";
  max: number;
  min: number;
  rainChance: number; // %
  code?: number; // WMO weather code (forecast only)
}

interface ForecastDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: (number | null)[];
}

async function fetchForecast(loc: WeatherLoc): Promise<ForecastDaily | null> {
  const { lat, lon } = locations[loc];
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=16`;
  try {
    const res = await fetch(url, { next: { revalidate: WEATHER_REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()).daily as ForecastDaily;
  } catch {
    return null;
  }
}

export async function getTripWeather(): Promise<{ byDate: Record<string, DayWeather[]>; fetchedAt: Date }> {
  const locs = Object.keys(locations) as WeatherLoc[];
  const forecasts = Object.fromEntries(
    await Promise.all(locs.map(async (l) => [l, await fetchForecast(l)] as const)),
  ) as Record<WeatherLoc, ForecastDaily | null>;

  const now = Date.now();
  const byDate: Record<string, DayWeather[]> = {};
  for (const [date, places] of Object.entries(tripDays)) {
    byDate[date] = places.map((loc) => {
      const f = forecasts[loc];
      const i = f ? f.time.indexOf(date) : -1;
      if (f && i >= 0) {
        const daysAhead = (Date.parse(date) - now) / 86_400_000;
        return {
          date,
          place: locations[loc].name,
          kind: daysAhead > 7 ? "early-forecast" : "forecast",
          max: Math.round(f.temperature_2m_max[i]),
          min: Math.round(f.temperature_2m_min[i]),
          rainChance: f.precipitation_probability_max[i] ?? 0,
          code: f.weather_code[i],
        };
      }
      const n = normals.cities[loc][date.slice(5) as keyof (typeof normals.cities)[WeatherLoc]];
      return { date, place: locations[loc].name, kind: "typical", max: n.max, min: n.min, rainChance: n.rainChance };
    });
  }
  return { byDate, fetchedAt: new Date() };
}

// "Oct 1", "Oct 2–3", "Oct 4–8" → ISO dates in the trip.
export function datesFromLabel(label: string): string[] {
  const m = label.match(/Oct (\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!m) return [];
  const start = Number(m[1]);
  const end = Number(m[2] ?? m[1]);
  return Array.from({ length: end - start + 1 }, (_, k) => `2026-10-${String(start + k).padStart(2, "0")}`);
}

export function describe(w: DayWeather): { icon: string; label: string } {
  const c = w.code;
  if (c === undefined) {
    return w.rainChance >= 50
      ? { icon: "🌦️", label: "Often rainy" }
      : { icon: "⛅", label: "Mixed sun & cloud" };
  }
  if (c === 0) return { icon: "☀️", label: "Clear" };
  if (c === 1) return { icon: "🌤️", label: "Mainly clear" };
  if (c === 2) return { icon: "⛅", label: "Partly cloudy" };
  if (c === 3) return { icon: "☁️", label: "Overcast" };
  if (c === 45 || c === 48) return { icon: "🌫️", label: "Fog" };
  if (c >= 51 && c <= 57) return { icon: "🌦️", label: "Drizzle" };
  if (c >= 61 && c <= 67) return { icon: "🌧️", label: c >= 65 ? "Heavy rain" : "Rain" };
  if (c >= 71 && c <= 77) return { icon: "🌨️", label: "Snow" };
  if (c >= 80 && c <= 82) return { icon: "🌦️", label: "Showers" };
  if (c === 85 || c === 86) return { icon: "🌨️", label: "Snow showers" };
  if (c >= 95) return { icon: "⛈️", label: "Thunderstorm" };
  return { icon: "⛅", label: "Mixed" };
}
