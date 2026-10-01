import Image from "next/image";
import { MapLink } from "@/components/MapLink";
import { WeatherChip, WeatherNote } from "@/components/Weather";
import {
  directionsLink,
  gettingAround,
  guideDays,
  modeIcon,
  prayersFor,
  sunTimes,
  tunisTime,
  zones,
  type Leg,
  type Stop,
  type Zone,
} from "@/lib/guide";
import { getPhoto } from "@/lib/trip-data";
import { getTripWeather } from "@/lib/weather";
import { TodayMarker } from "@/components/TodayMarker";

export const revalidate = 10800; // re-fetch the forecast every 3 h

const prayerNames = [
  ["fajr", "Fajr"],
  ["dhuhr", "Dhuhr"],
  ["asr", "Asr"],
  ["maghrib", "Maghrib"],
  ["isha", "Isha"],
] as const;

function PrayerBlock({ date }: { date: string }) {
  const { times, mosques, jumuah } = prayersFor(date);
  if (!times) return null;
  return (
    <div className="mt-3 rounded-xl border border-line px-3 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
        🕌 Prayer times · {times.city} <span className="font-medium normal-case">({times.method})</span>
      </p>
      <div className="mt-2 grid grid-cols-5 gap-1 text-center">
        {prayerNames.map(([k, label]) => (
          <div key={k} className="rounded-lg bg-panel px-1 py-1.5">
            <p className="text-[10px] font-semibold uppercase text-ink-soft">{label}</p>
            <p className="tabular text-sm font-bold">{times[k]}</p>
          </div>
        ))}
      </div>
      {jumuah && <p className="mt-2 text-sm font-semibold text-teal">{jumuah}</p>}
      {mosques.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {mosques.map((m) => (
            <li key={m.name} className="text-sm leading-snug">
              <span className="font-semibold">{m.name}</span>
              <span className="text-ink-soft"> · {m.address}. {m.note} </span>
              <MapLink query={m.mapQuery} label="Map" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// "Vancouver time (UTC−7) · Montreal +3 h · 🇹🇳 Tunisia +8 h"
function zoneLine(z: Zone) {
  const signed = (h: number) => (h > 0 ? `+${h} h` : `−${-h} h`);
  const here = zones[z];
  const parts = [`Times are ${here.label} time (${here.utc})`];
  if (z === "vancouver") parts.push(`Montreal ${signed(zones.vancouver.tunisAhead - zones.eastern.tunisAhead)}`);
  if (z === "eastern") parts.push(`Vancouver ${signed(zones.eastern.tunisAhead - zones.vancouver.tunisAhead)}`);
  if (z !== "tunis") parts.push(`🇹🇳 Tunisia ${signed(here.tunisAhead)}`);
  return parts.join(" · ");
}

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

function StopRow({ s, dayZone }: { s: Stop; dayZone: Zone }) {
  const p = s.photo ? getPhoto(s.photo) : null;
  const zone = s.zone ?? dayZone;
  const tn = tunisTime(s.time, zone);
  return (
    <li className="relative grid grid-cols-[4.5rem_1fr] gap-3 py-2 sm:grid-cols-[6rem_1fr]">
      <span className="tabular pt-0.5 text-sm font-bold text-ink">
        {s.time}
        {s.zone && s.zone !== dayZone && (
          <span className="block text-[10px] font-semibold text-ink-soft">{zones[s.zone].label}</span>
        )}
        {tn && (
          <span className="block text-[11px] font-medium text-ink-soft" title="Time in Tunisia">
            🇹🇳 {tn}
          </span>
        )}
      </span>
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
        {p && (
          <figure className="relative mt-2 aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl bg-panel">
            <Image
              src={p.src}
              alt={p.caption ? `${s.place} — ${p.caption.toLowerCase()}` : s.place}
              fill
              sizes="(min-width: 640px) 448px, 85vw"
              className="object-cover"
            />
            {p.caption && (
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                {p.caption}
              </span>
            )}
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2.5 pb-1 pt-4 text-right text-[10px] text-white/85">
              <a href={p.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Photo: {p.credit} · {p.license}
              </a>
            </figcaption>
          </figure>
        )}
        {s.mapQuery && (
          <div className="mt-1.5">
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-teal">Oct 1 – 13, 2026</p>
      <h1 className="mb-3 font-display text-4xl font-semibold sm:text-5xl">Canada, day by day</h1>
      <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
        Vancouver → Montreal → Toronto &amp; Niagara → Montreal. Each day: where to be when (local
        time and 🇹🇳 Tunisia time), how to get there, weather, prayer times and the nearest mosque.
      </p>

      <nav
        className="sticky top-[57px] z-40 -mx-4 mt-6 flex gap-2 overflow-x-auto border-b border-line bg-bg/95 px-4 py-2 backdrop-blur [scrollbar-width:none] sm:-mx-6 sm:px-6"
        aria-label="Jump to day"
      >
        {guideDays.map((d) => (
          <a
            key={d.date}
            href={`#d-${d.date}`}
            className="tabular shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-panel hover:text-ink"
          >
            Oct {Number(d.date.slice(8))}
          </a>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-6 sm:gap-8">
        {guideDays.map((d, i) => {
          const sun = sunTimes(d);
          return (
            <section
              key={d.date}
              id={`d-${d.date}`}
              className="scroll-mt-32 rounded-2xl border border-line bg-bg-raised p-5 sm:p-6"
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
              <p className="mt-1 text-xs text-ink-soft">🕐 {zoneLine(d.zone)}</p>

              <div className="mt-3 flex flex-wrap items-stretch gap-2">
                {(byDate[d.date] ?? []).map((w) => (
                  <WeatherChip key={w.place} w={w} showPlace={(byDate[d.date] ?? []).length > 1} />
                ))}
                {sun && (
                  <div className="flex flex-col justify-center gap-0.5 rounded-xl border border-line px-3 py-2 text-xs text-ink-soft">
                    <span className="tabular">🌅 Sunrise {sun.sunrise}</span>
                    <span className="tabular">🌇 Sunset {sun.sunset}</span>
                  </div>
                )}
              </div>
              <PrayerBlock date={d.date} />

              <ol className="mt-5">
                {d.steps.map((s, k) =>
                  s.kind === "stop" ? <StopRow key={k} s={s} dayZone={d.zone} /> : <LegRow key={k} l={s} />,
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

      <details className="mt-10 rounded-2xl border border-line bg-bg-raised p-5">
        <summary className="cursor-pointer font-display text-xl font-semibold">
          Getting around: fares, cards & taxis
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          {gettingAround.map((c) => (
            <div key={c.city}>
              <h3 className="mb-2 text-base font-semibold">{c.city}</h3>
              <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed text-ink-soft">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <p className="mt-6 text-xs leading-relaxed text-ink-soft">
        Fares and opening hours checked September 2026 — approximate. Prayer times: ISNA method in
        Canada, Muslim World League in Rome, standard Asr; mosques may post slightly different times.
      </p>
      <WeatherNote fetchedAt={fetchedAt} />
      <TodayMarker />
    </div>
  );
}
