import Link from "next/link";
import { cities, transportLegs } from "@/lib/trip-data";

const stops = [
  { key: "vancouver", name: "Vancouver", dates: "Oct 1–8", href: "/vancouver" },
  { key: "calgary", name: "Calgary", dates: "flight connection", href: null },
  { key: "montreal", name: "Montreal", dates: "Oct 9–10 & 12", href: "/montreal" },
  { key: "toronto", name: "Toronto + Niagara", dates: "Oct 10–11", href: "/toronto" },
];

export default function Home() {
  return (
    <div>
      <header className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6">
        <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-teal">
          Travel Proposal
        </span>
        <h1 className="max-w-xl font-display text-5xl font-semibold leading-tight sm:text-6xl">
          Vancouver, Toronto, Niagara Falls &amp; Montreal
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          A 13-day loop through Canada — one direction, no backtracking, flights already
          booked. Prepared for the travel team.
        </p>
        <div className="mt-8 flex flex-wrap gap-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">Trip dates</p>
            <p className="font-display text-2xl font-semibold">Oct 1 – 13, 2026</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">Stops</p>
            <p className="font-display text-2xl font-semibold">4 cities</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">Currency</p>
            <p className="font-display text-2xl font-semibold">CAD · TND</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-panel-dark p-6 text-on-dark sm:p-10">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            Optimized round trip
          </span>
          <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
            One loop, no backtracking
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-dark-soft">
            Flights already booked get you west to east once. Overnight buses cover the
            Toronto ↔ Niagara ↔ Montreal leg and double as lodging, so the route never
            doubles back and needs no extra hotel night.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stops.map((s) => {
              const inner = (
                <div className="h-full rounded-2xl border-l-[3px] border-gold bg-panel-dark-2 p-4">
                  <p className="text-xs uppercase tracking-wide text-on-dark-soft">
                    {s.dates}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">{s.name}</p>
                </div>
              );
              return s.href ? (
                <Link key={s.key} href={s.href} className="block hover:opacity-90">
                  {inner}
                </Link>
              ) : (
                <div key={s.key}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="mb-6 font-display text-2xl font-semibold">Ground transport at a glance</h2>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-3">Leg</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {transportLegs.map((leg) => (
                <tr key={`${leg.from}-${leg.to}`} className="border-b border-line last:border-0">
                  <td className="p-3">
                    {leg.from} → {leg.to}
                  </td>
                  <td className="p-3">{leg.mode}</td>
                  <td className="tabular p-3">{leg.distanceKm} km</td>
                  <td className="tabular p-3 font-bold text-amber">{leg.priceCad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/itinerary"
            className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-on-dark hover:opacity-90"
          >
            See the day-by-day plan →
          </Link>
          <Link
            href="/transport"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-bold hover:bg-panel"
          >
            Full transport, addresses & budget →
          </Link>
        </div>
      </section>
    </div>
  );
}
