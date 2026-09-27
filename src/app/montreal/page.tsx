import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";
import { getTripWeather } from "@/lib/weather";

export const revalidate = 10800; // re-fetch the forecast every 3 h

export const metadata = { title: "Montreal — Canada Loop" };

export default async function MontrealPage() {
  const c = cities.montreal;
  const { byDate, fetchedAt } = await getTripWeather();
  const weather = ["2026-10-09","2026-10-10","2026-10-12","2026-10-13"].flatMap((d) => byDate[d]);
  return (
    <CityPage
      name={c.name}
      dates={`Oct 9–10 & 12 · Stop 3`}
      intro="Base city on both ends of the trip — arrival from Vancouver/Calgary, then the return before the flight home on Oct 13."
      activities={c.activities}
      food={c.food}
      weather={weather}
      fetchedAt={fetchedAt}
    />
  );
}
