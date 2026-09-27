import type { FoodSpot } from "@/lib/trip-data";
import { MapLink } from "./MapLink";

export function FoodCard({ spot }: { spot: FoodSpot }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-l-[3px] border-teal bg-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-body text-base font-semibold">{spot.name}</h3>
        {spot.halal && (
          <span className="shrink-0 rounded-full bg-teal/15 px-2.5 py-1 text-xs font-bold text-teal">
            Halal
          </span>
        )}
      </div>
      <p className="text-xs uppercase tracking-wide text-ink-soft">{spot.type}</p>
      <p className="text-sm leading-relaxed text-ink-soft">{spot.note}</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <span className="tabular text-sm font-bold text-amber">
          {spot.priceCad} <span className="text-ink-soft font-medium">· {spot.priceTnd}</span>
        </span>
        <MapLink query={spot.mapQuery} />
      </div>
    </div>
  );
}
