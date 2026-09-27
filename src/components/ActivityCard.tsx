import type { Activity } from "@/lib/trip-data";
import { PriceTag } from "./PriceTag";
import { MapLink } from "./MapLink";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-bg-raised p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-body text-lg font-semibold">{activity.name}</h3>
        <PriceTag cad={activity.priceCad} />
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">{activity.description}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-ink-soft">
          ~{activity.durationHrs}h
        </span>
        <MapLink query={activity.mapQuery} />
      </div>
    </div>
  );
}
