import { transportLegs, addresses, budgetTiers } from "@/lib/trip-data";
import { MapLink } from "@/components/MapLink";

export const metadata = { title: "Transport & Budget — Canada Loop" };

export default function TransportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-amber">
        Ground &amp; air transport
      </p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">
        Every leg, distance &amp; price
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        Every flight (Tunis → Frankfurt → Vancouver, Vancouver → Calgary → Montreal, Montreal → Rome →
        Tunis) and both FlixBus legs ($140.95 USD total) are booked. Only the GO train to Niagara is left to buy.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {transportLegs.map((leg) => (
          <div
            key={`${leg.from}-${leg.to}`}
            className="rounded-2xl border border-line bg-bg-raised p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-body text-lg font-semibold">
                  {leg.from} → {leg.to}
                </h3>
                <p className="text-sm text-ink-soft">{leg.mode}</p>
              </div>
              <div className="text-right">
                <p className="tabular text-lg font-bold text-amber">{leg.priceCad}</p>
                {leg.priceTnd !== "—" && (
                  <p className="tabular text-sm text-ink-soft">{leg.priceTnd}</p>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
              <span>
                <span className="tabular font-semibold text-ink">{leg.distanceKm} km</span> ·{" "}
                {leg.durationLabel}
              </span>
              <MapLink query={leg.mapQuery} label="Route on Google Maps" />
            </div>
            {leg.booked && (
              <span className="mt-3 inline-block rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal">
                ✓ Booked
              </span>
            )}
            {leg.notes && <p className="mt-2 text-xs text-ink-soft">{leg.notes}</p>}
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-14 font-display text-2xl font-semibold">Key addresses</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {addresses.map((a) => (
          <div key={a.name} className="rounded-2xl border-l-[3px] border-teal bg-panel p-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">{a.label}</p>
            <p className="mt-1 font-display text-lg font-semibold">{a.name}</p>
            <p className="mt-1 text-sm text-ink-soft">{a.address}</p>
            <div className="mt-2">
              <MapLink query={a.mapQuery} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-14 font-display text-2xl font-semibold">Budget tiers</h2>
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">
        Figures in CAD, per person, attractions only. Booked bus fare ($140.95 USD) is
        separate.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {budgetTiers.map((t) => (
          <div
            key={t.tier}
            className={`flex flex-col gap-2 rounded-2xl p-6 ${
              t.recommended ? "bg-panel-dark text-on-dark" : "bg-panel"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wide ${
                t.recommended ? "text-gold" : "text-ink-soft"
              }`}
            >
              {t.tier}
            </p>
            <p
              className={`tabular font-display text-4xl font-semibold ${
                t.recommended ? "text-gold" : "text-teal"
              }`}
            >
              ${t.cad}
              <span className="text-base font-normal"> CAD</span>
            </p>
            <p className={`tabular text-sm ${t.recommended ? "text-on-dark-soft" : "text-ink-soft"}`}>
              ≈{t.tnd} TND
            </p>
            <p
              className={`text-sm leading-relaxed ${
                t.recommended ? "text-on-dark-soft" : "text-ink-soft"
              }`}
            >
              {t.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
