import type { LocalDish } from "@/lib/trip-data";
import { MapLink } from "./MapLink";
import { Photo } from "./Photo";

export function LocalDishCard({ dish }: { dish: LocalDish }) {
  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border-b-[3px] border-amber bg-bg-raised p-5">
      <Photo id={dish.photo} alt={dish.name} />
      <h3 className="font-body text-base font-semibold">{dish.name}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{dish.what}</p>
      <p className="text-sm">
        <span className="font-bold text-teal">Halal · </span>
        {dish.halalNote}
      </p>
      <p className="text-sm">
        <span className="font-bold text-amber">Where · </span>
        {dish.where}
      </p>
      <div className="mt-auto pt-1">
        <MapLink query={dish.mapQuery} />
      </div>
    </div>
  );
}
