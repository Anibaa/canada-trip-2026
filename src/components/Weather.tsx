import { describe, type DayWeather } from "@/lib/weather";

const kindLabel: Record<DayWeather["kind"], string> = {
  forecast: "Forecast",
  "early-forecast": "Early forecast",
  typical: "Typical",
};

function dayName(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function WeatherChip({ w, showPlace = false }: { w: DayWeather; showPlace?: boolean }) {
  const { icon, label } = describe(w);
  return (
    <div
      className={`flex min-w-[8.5rem] flex-col gap-0.5 rounded-xl border px-3 py-2 ${
        w.kind === "typical" ? "border-dashed border-line bg-bg" : "border-line bg-panel"
      }`}
      title={`${label} — ${kindLabel[w.kind]}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
        {dayName(w.date)}
        {showPlace && ` · ${w.place}`}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-xl leading-none" aria-hidden>
          {icon}
        </span>
        <span className="tabular text-sm font-bold">
          {w.max}° <span className="font-medium text-ink-soft">/ {w.min}°</span>
        </span>
      </span>
      <span className="text-xs text-ink-soft">
        {label} · 💧{w.rainChance}%
      </span>
      <span className="text-[10px] uppercase tracking-wide text-ink-soft/80">{kindLabel[w.kind]}</span>
    </div>
  );
}

export function WeatherNote({ fetchedAt }: { fetchedAt: Date }) {
  const time = fetchedAt.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Tunis",
  });
  return (
    <p className="mt-3 text-xs leading-relaxed text-ink-soft">
      °C high / low · 💧 = chance of rain. <b>Forecast</b>: live{" "}
      <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline">
        Open-Meteo
      </a>{" "}
      forecast, refreshed every 3 h (last update {time}, Tunis time). <b>Early forecast</b>: more than a
      week out, will shift. <b>Typical</b>: not in forecast range yet — average for that date over
      2016–2025.
    </p>
  );
}
