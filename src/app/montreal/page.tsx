import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";

export const metadata = { title: "Montreal — Canada Loop" };

export default function MontrealPage() {
  const c = cities.montreal;
  return (
    <CityPage
      name={c.name}
      dates={`Oct 9–10 & 12 · Stop 3`}
      intro="Base city on both ends of the trip — arrival from Vancouver/Calgary, then the return before the flight home on Oct 13."
      activities={c.activities}
      food={c.food}
    />
  );
}
