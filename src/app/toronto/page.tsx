import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";

export const metadata = { title: "Toronto & Niagara Falls — Canada Loop" };

export default function TorontoPage() {
  const c = cities.toronto;
  return (
    <CityPage
      name={c.name}
      dates={`Oct 10 – 11 · Stop 2`}
      intro="Arrive by overnight bus, CN Tower and the Distillery District, then a day trip to the Falls before the bus back to Montreal."
      activities={c.activities}
      food={c.food}
    />
  );
}
