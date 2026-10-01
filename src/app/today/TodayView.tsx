"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SaveOffline } from "@/components/SaveOffline";

interface DayLite {
  date: string;
  city: string;
  title: string;
}

const FIRST = "2026-10-01";
const LAST = "2026-10-13";

// The phone's own calendar date (local time zone), as YYYY-MM-DD.
function localToday() {
  return new Date().toLocaleDateString("en-CA");
}

export function TodayView({ days }: { days: DayLite[] }) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const t = localToday();
    setToday(t);
    if (t >= FIRST && t <= LAST) window.location.replace(`/#d-${t}`);
  }, []);

  if (!today || (today >= FIRST && today <= LAST)) {
    return <p className="text-ink-soft">Opening today&apos;s plan…</p>;
  }

  if (today > LAST) {
    return (
      <div>
        <h1 className="font-display text-4xl font-semibold">Welcome home 🇹🇳</h1>
        <p className="mt-3 text-ink-soft">The trip is over — the whole plan is still in the guide.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-teal px-5 py-3 font-semibold text-white">
          Open the day guide
        </Link>
      </div>
    );
  }

  const daysLeft = Math.round((Date.parse(FIRST) - Date.parse(today)) / 86_400_000);
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-teal">Countdown</p>
      <h1 className="mt-1 font-display text-5xl font-semibold">
        {daysLeft} {daysLeft === 1 ? "day" : "days"} to go
      </h1>
      <p className="mt-3 text-lg text-ink-soft">
        Check in at Tunis–Carthage by <b className="text-ink">23:00 on Sep 30</b> for the 01:35
        flight to Frankfurt. During the trip, this button opens that day&apos;s plan directly.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-bg-raised p-5">
        <h2 className="font-display text-xl font-semibold">Before you leave</h2>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>Save this site to your home screen (Share → Add to Home Screen) and press “Save for offline” below on Wi-Fi.</li>
          <li>Book a luggage-storage spot near Toronto Union Station for Oct 11 (05:30–23:00).</li>
          <li>Book Moltaqa for Friday Oct 2 (live oud night).</li>
          <li>Buy a GO + WEGO combo ticket in the GO app for Oct 11.</li>
          <li>Download offline Google Maps areas: Vancouver, Toronto–Niagara, Montreal.</li>
        </ul>
        <div className="mt-4">
          <SaveOffline />
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">The 13 days</h2>
      <ol className="mt-3 flex flex-col gap-2">
        {days.map((d, i) => (
          <li key={d.date}>
            <Link
              href={`/#d-${d.date}`}
              className="flex items-baseline gap-3 rounded-xl border border-line bg-bg-raised px-4 py-3 hover:bg-panel"
            >
              <span className="tabular w-14 shrink-0 text-sm font-bold text-teal">Oct {Number(d.date.slice(8))}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{d.title}</span>
                <span className="block text-xs text-ink-soft">
                  Day {i + 1} · {d.city}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
