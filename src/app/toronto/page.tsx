import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";
import { getTripWeather } from "@/lib/weather";

export const revalidate = 10800; // re-fetch the forecast every 3 h

export const metadata = { title: "Toronto & Niagara Falls — Canada Loop" };

export default async function TorontoPage() {
  const c = cities.toronto;
  const { byDate, fetchedAt } = await getTripWeather();
  const weather = ["2026-10-11"].flatMap((d) => byDate[d]);
  return (
    <CityPage
      name={c.name}
      dates={`Oct 10 – 11 · Stop 2`}
      intro="Arrive by overnight bus, CN Tower and the Distillery District, then a day trip to the Falls before the bus back to Montreal."
      activities={c.activities}
      food={c.food}
      weather={weather}
      fetchedAt={fetchedAt}
    />
  );
}
