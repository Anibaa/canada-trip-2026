import { MapLink } from "@/components/MapLink";
import { WeatherChip, WeatherNote } from "@/components/Weather";
import {
  directionsLink,
  gettingAround,
  guideDays,
  modeIcon,
  sunTimes,
  type Leg,
  type Stop,
} from "@/lib/guide";
import { getTripWeather } from "@/lib/weather";

export const revalidate = 10800; // re-fetch the forecast every 3 h

export const metadata = { title: "Day-by-day Guide — Canada Loop" };

function dayLabel(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

// "25", "5–10", "25 + 12" are minutes; anything else ("2 h 30", "18:20 → 05:05") is shown as-is.
function duration(m: string) {
  return /^[\d–+\s]+$/.test(m) ? `${m} min` : m;
}

function StopRow({ s }: { s: Stop }) {
  return (
    <li className="relative grid grid-cols-[4.5rem_1fr] gap-3 py-2 sm:grid-cols-[6rem_1fr]">
      <span className="tabular pt-0.5 text-sm font-bold text-ink">{s.time}</span>
      <div className="relative border-l-2 border-teal pl-4">
        <span
          className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ${s.food ? "bg-amber" : "bg-teal"}`}
          aria-hidden
        />
        <p className="font-semibold">
          {s.food && <span aria-hidden>🍽 </span>}
          {s.place}
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">{s.what}</p>
        {s.best && (
          <p className="mt-1 text-sm">
            <span className="font-bold text-teal">Best time · </span>
            {s.best}
          </p>
        )}
        {s.mapQuery && (
          <div className="mt-1">
            <MapLink query={s.mapQuery} label="Map" />
          </div>
        )}
      </div>
    </li>
  );
}

function LegRow({ l }: { l: Leg }) {
  const dir = directionsLink(l);
  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-3 sm:grid-cols-[6rem_1fr]">
      <span />
      <div className="border-l-2 border-dashed border-line py-1.5 pl-4">
        <div className="rounded-xl bg-panel px-3 py-2.5 text-sm">
          <p className="font-semibold">
            <span aria-hidden>{modeIcon[l.mode]} </span>
            {l.route}
          </p>
          <p className="tabular mt-0.5 text-xs text-ink-soft">
            ⏱ {duration(l.minutes)} · 💵 {l.cost}
          </p>
          {l.taxi && <p className="mt-0.5 text-xs text-ink-soft">🚕 Taxi / Uber: {l.taxi}</p>}
          {l.note && <p className="mt-0.5 text-xs text-ink-soft">ℹ️ {l.note}</p>}
          {dir && (
            <a
              href={dir}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-teal hover:underline"
            >
              Directions in Google Maps ↗
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export default async function GuidePage() {
  const { byDate, fetchedAt } = await getTripWeather();
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-teal">Hour by hour</p>
      <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">Day-by-day guide</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        Every day, place to place: when to be where, the best time for each stop, and how to get
        between them — recommended bus, SkyTrain, métro or train, the taxi fallback, and a Google
        Maps directions link for each leg.
      </p>
      <p className="mt-3 text-sm text-ink-soft">
        Fares and opening hours checked in September 2026 and approximate — confirm the week before.
        Flight times aren&apos;t listed here; plan the arrival and departure legs around your tickets.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Jump to day">
        {guideDays.map((d) => (
          <a
            key={d.date}
            href={`#d-${d.date}`}
            className="tabular rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-soft hover:bg-panel hover:text-ink"
          >
            Oct {Number(d.date.slice(8))}
          </a>
        ))}
      </nav>

      <h2 className="mb-4 mt-12 font-display text-2xl font-semibold">Getting around</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {gettingAround.map((c) => (
          <div key={c.city} className="rounded-2xl border border-line bg-bg-raised p-5">
            <h3 className="mb-2 text-lg font-semibold">{c.city}</h3>
            <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed text-ink-soft">
              {c.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {guideDays.map((d, i) => {
          const sun = sunTimes(d);
          return (
            <section
              key={d.date}
              id={`d-${d.date}`}
              className="scroll-mt-20 rounded-2xl border border-line bg-bg-raised p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-semibold sm:text-2xl">
                  Day {i + 1} <span className="font-normal text-ink-soft">· {dayLabel(d.date)}</span>
                </h2>
                <span className="rounded-full bg-panel px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
                  {d.city}
                </span>
              </div>
              <p className="mt-1 text-base font-semibold text-teal">{d.title}</p>

              <div className="mt-3 flex flex-wrap items-stretch gap-2">
                {(byDate[d.date] ?? []).map((w) => (
                  <WeatherChip key={w.place} w={w} showPlace={(byDate[d.date] ?? []).length > 1} />
                ))}
                <div className="flex flex-col justify-center gap-0.5 rounded-xl border border-line px-3 py-2 text-xs text-ink-soft">
                  <span className="tabular">🌅 Sunrise {sun.sunrise}</span>
                  <span className="tabular">🌇 Sunset {sun.sunset}</span>
                </div>
              </div>

              <ol className="mt-5">
                {d.steps.map((s, k) =>
                  s.kind === "stop" ? <StopRow key={k} s={s} /> : <LegRow key={k} l={s} />,
                )}
              </ol>

              {d.tips && (
                <div className="mt-4 rounded-xl border-l-[3px] border-amber bg-panel px-4 py-3 text-sm leading-relaxed">
                  {d.tips.map((t) => (
                    <p key={t}>💡 {t}</p>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <WeatherNote fetchedAt={fetchedAt} />
    </div>
  );
}
