import type { Activity, FoodSpot } from "@/lib/trip-data";
import { ActivityCard } from "./ActivityCard";
import { FoodCard } from "./FoodCard";

export function CityPage({
  name,
  dates,
  intro,
  activities,
  food,
}: {
  name: string;
  dates: string;
  intro: string;
  activities: Activity[];
  food: FoodSpot[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-teal">{dates}</p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">{name}</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{intro}</p>

      <h2 className="mb-4 mt-12 font-display text-2xl font-semibold">Things to do</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((a) => (
          <ActivityCard key={a.name} activity={a} />
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-display text-2xl font-semibold">Halal food nearby</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {food.map((f) => (
          <FoodCard key={f.name} spot={f} />
        ))}
      </div>
    </div>
  );
}
