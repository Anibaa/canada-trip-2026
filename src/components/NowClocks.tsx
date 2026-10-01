"use client";

import { useEffect, useState } from "react";

const clocks = [
  { label: "🇹🇳 Tunis", short: "TUN", tz: "Africa/Tunis" },
  { label: "Vancouver", short: "VAN", tz: "America/Vancouver" },
  { label: "Montreal", short: "MTL", tz: "America/Toronto" },
];

function fmt(d: Date, tz: string) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
}

// Live clocks for home and both Canadian cities; refreshes every 20 s.
export function NowClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular flex shrink-0 items-center gap-2.5 sm:gap-4" aria-label="Current time in Tunis, Vancouver and Montreal">
      {clocks.map((c) => (
        <span key={c.tz} className="flex flex-col items-center leading-tight" title={`${c.label} time`}>
          <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft sm:text-[10px]">
            <span className="sm:hidden">{c.short}</span>
            <span className="hidden sm:inline">{c.label}</span>
          </span>
          <span className="text-xs font-bold sm:text-sm">{now ? fmt(now, c.tz) : "--:--"}</span>
        </span>
      ))}
    </span>
  );
}
