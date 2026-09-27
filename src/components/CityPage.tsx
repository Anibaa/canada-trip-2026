import type { Activity, FoodSpot, LocalDish } from "@/lib/trip-data";
import { ActivityCard } from "./ActivityCard";
import { FoodCard } from "./FoodCard";
import { LocalDishCard } from "./LocalDishCard";
import { WeatherChip, WeatherNote } from "./Weather";
import type { DayWeather } from "@/lib/weather";

export function CityPage({
  name,
  dates,
  intro,
  activities,
  food,
  localFood,
  weather,
  fetchedAt,
}: {
  name: string;
  dates: string;
  intro: string;
  activities: Activity[];
  food: FoodSpot[];
  localFood: LocalDish[];
  weather: DayWeather[];
  fetchedAt: Date;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-teal">{dates}</p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">{name}</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{intro}</p>

      <p className="mt-4 text-sm text-ink-soft">
        {activities.length} things to do · {food.length} halal spots. Prices are approximate 2026 adult
        rates — check the official site before you go.
      </p>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="On this page">
        {[
          ["#weather", "Weather"],
          ["#do", "Things to do"],
          ["#halal", "Halal food"],
          ["#local", "Local food"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-panel">
            {label}
          </a>
        ))}
      </nav>

      <h2 id="weather" className="mb-4 mt-12 scroll-mt-20 font-display text-2xl font-semibold">Weather while you&apos;re here</h2>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {weather.map((w) => (
          <WeatherChip key={w.date + w.place} w={w} showPlace={weather.some((x) => x.place !== w.place)} />
        ))}
      </div>
      <WeatherNote fetchedAt={fetchedAt} />

      <h2 id="do" className="mb-4 mt-12 scroll-mt-20 font-display text-2xl font-semibold">Things to do</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((a) => (
          <ActivityCard key={a.name} activity={a} />
        ))}
      </div>

      <h2 id="halal" className="mb-4 mt-12 scroll-mt-20 font-display text-2xl font-semibold">Halal food nearby</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {food.map((f) => (
          <FoodCard key={f.name} spot={f} />
        ))}
      </div>

      <h2 id="local" className="mb-1 mt-12 scroll-mt-20 font-display text-2xl font-semibold">Local food to try</h2>
      <p className="mb-4 text-sm text-ink-soft">The dishes this place is known for — with a halal note for each.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {localFood.map((d) => (
          <LocalDishCard key={d.name} dish={d} />
        ))}
      </div>
    </div>
  );
}
