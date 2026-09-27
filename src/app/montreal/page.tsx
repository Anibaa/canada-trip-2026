import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";
import { getTripWeather } from "@/lib/weather";

export const revalidate = 10800; // re-fetch the forecast every 3 h

export const metadata = { title: "Montreal — Canada Loop" };

export default async function MontrealPage() {
  const c = cities.montreal;
  const { byDate, fetchedAt } = await getTripWeather();
  const weather = ["2026-10-09","2026-10-10","2026-10-12"].flatMap((d) => byDate[d]);
  return (
    <CityPage
      name={c.name}
      dates={`Oct 9–10 & 12 · Stop 3`}
      intro="Land from Calgary at 07:10 on Oct 9 for a full day, Old Montreal before the night bus on Oct 10, then a last lunch on Oct 12 before the 19:25 flight home via Rome."
      activities={c.activities}
      food={c.food}
      localFood={c.localFood}
      weather={weather}
      fetchedAt={fetchedAt}
    />
  );
}
