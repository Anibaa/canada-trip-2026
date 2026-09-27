import { dayPlans } from "@/lib/trip-data";
import { MapLink } from "@/components/MapLink";

export const metadata = { title: "Itinerary — Canada Loop" };

export default function ItineraryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-teal">Day by day</p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">The itinerary</h1>
      <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
        13 days, one direction. Overnight buses on Oct 10 and Oct 12 double as lodging.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {dayPlans.map((d) => (
          <div key={d.day} className="rounded-2xl border border-line bg-bg-raised p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">
                {d.day} <span className="text-ink-soft font-normal">· {d.date}</span>
              </h2>
              <span className="rounded-full bg-panel px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
                {d.city}
              </span>
            </div>
            <p className="mt-1 text-base font-semibold text-teal">{d.title}</p>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-ink-soft sm:grid-cols-3">
              {d.morning && (
                <p>
                  <span className="font-bold text-ink">Morning — </span>
                  {d.morning}
                </p>
              )}
              {d.afternoon && (
                <p>
                  <span className="font-bold text-ink">Afternoon — </span>
                  {d.afternoon}
                </p>
              )}
              {d.evening && (
                <p>
                  <span className="font-bold text-ink">Evening — </span>
                  {d.evening}
                </p>
              )}
            </div>
            {d.transport && (
              <p className="tabular mt-3 text-sm font-bold text-amber">🚌 {d.transport}</p>
            )}
            {d.food && d.food.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {d.food.map((f) => (
                  <span
                    key={f.name}
                    className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1.5 text-xs font-semibold"
                  >
                    🍽 {f.name}
                    <MapLink query={f.mapQuery} label="map" />
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
