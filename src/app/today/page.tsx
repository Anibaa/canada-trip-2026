import { guideDays } from "@/lib/guide";
import { TodayView } from "./TodayView";

export const metadata = { title: "Today — Canada Loop" };

export default function TodayPage() {
  const days = guideDays.map(({ date, city, title }) => ({ date, city, title }));
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <TodayView days={days} />
    </div>
  );
}
