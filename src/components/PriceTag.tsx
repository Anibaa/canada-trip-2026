import { cadToTnd } from "@/lib/trip-data";

export function PriceTag({ cad }: { cad: number | "Free" }) {
  if (cad === "Free") {
    return <span className="tabular text-sm font-bold text-teal">Free</span>;
  }
  return (
    <span className="tabular text-sm font-bold text-amber">
      ${cad} CAD <span className="text-ink-soft font-medium">· {cadToTnd(cad)} TND</span>
    </span>
  );
}
