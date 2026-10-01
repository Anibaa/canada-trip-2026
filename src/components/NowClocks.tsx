"use client";

import { useEffect, useState } from "react";

// Where you are in Canada on a given date (before/after the trip: the first/last city).
function canadaZone(today: string): { label: string; tz: string } {
  if (today >= "2026-10-09") return { label: "Montreal", tz: "America/Toronto" };
  return { label: "Vancouver", tz: "America/Vancouver" };
}

function fmt(d: Date, tz: string) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
}

export function NowClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span className="h-5 w-32" aria-hidden />;
  const ca = canadaZone(now.toLocaleDateString("en-CA"));
  return (
    <span className="tabular flex shrink-0 items-center gap-2 text-xs font-semibold sm:text-sm" aria-label="Current time">
      <span title={`${ca.label} time`}>🇨🇦 {fmt(now, ca.tz)}</span>
      <span className="text-line">|</span>
      <span title="Tunisia time">🇹🇳 {fmt(now, "Africa/Tunis")}</span>
    </span>
  );
}
