import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";
import { getTripWeather } from "@/lib/weather";

export const revalidate = 10800; // re-fetch the forecast every 3 h

export const metadata = { title: "Vancouver — Canada Loop" };

export default async function VancouverPage() {
  const c = cities.vancouver;
  const { byDate, fetchedAt } = await getTripWeather();
  const weather = ["2026-10-01","2026-10-02","2026-10-03","2026-10-04","2026-10-05","2026-10-06","2026-10-07","2026-10-08"].flatMap((d) => byDate[d]);
  return (
    <CityPage
      name={c.name}
      dates={`Oct 1 – 8 · Stop 1`}
      intro="Stanley Park, Gastown, Granville Island — then the IASAM event Oct 4–8 and the 19:30 flight east on Oct 8. Free evenings for the harbour and the beaches."
      activities={c.activities}
      food={c.food}
      localFood={c.localFood}
      weather={weather}
      fetchedAt={fetchedAt}
    />
  );
}
