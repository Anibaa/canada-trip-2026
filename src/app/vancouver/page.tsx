import { CityPage } from "@/components/CityPage";
import { cities } from "@/lib/trip-data";

export const metadata = { title: "Vancouver — Canada Loop" };

export default function VancouverPage() {
  const c = cities.vancouver;
  return (
    <CityPage
      name={c.name}
      dates={`Oct 1 – 8 · Stop 1`}
      intro="Stanley Park, Gastown, Granville Island — then the IASAM event Oct 4–8. Free evenings for the North Shore."
      activities={c.activities}
      food={c.food}
    />
  );
}
