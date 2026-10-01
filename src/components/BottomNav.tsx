"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Phone-only tab bar: the pages you need on the go, within thumb reach.
const icons = {
  today: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  guide: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  places: "M4 21V8l6-4v17M10 21V11l10-3v13M4 21h16M7 10v.01M7 14v.01M14 13v.01M17 13v.01M14 17v.01M17 17v.01",
  transport: "M6 17h12M7 21l1-4M17 21l-1-4M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM4 11h16M8 14h.01M16 14h.01",
};

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const places = [
  { href: "/vancouver", label: "Vancouver", sub: "Oct 1–8" },
  { href: "/toronto", label: "Toronto & Niagara", sub: "Oct 11" },
  { href: "/montreal", label: "Montreal", sub: "Oct 9–10 & 12" },
  { href: "/itinerary", label: "Itinerary overview", sub: "All 13 days" },
];

export function BottomNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const placesActive = places.some((p) => path.startsWith(p.href));

  const tab = (href: string, label: string, d: string) => {
    const active = href === "/" ? path === "/" : path.startsWith(href);
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${active ? "text-teal" : "text-ink-soft"}`}
        aria-current={active ? "page" : undefined}
      >
        <Icon d={d} />
        {label}
      </Link>
    );
  };

  return (
    <div className="md:hidden">
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />
      )}
      {open && (
        <div
          id="places-sheet"
          className="fixed inset-x-3 z-50 rounded-2xl border border-line bg-bg-raised p-2 shadow-xl"
          style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
        >
          {places.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between rounded-xl px-4 py-3 hover:bg-panel"
            >
              <span className="font-semibold">{p.label}</span>
              <span className="text-xs text-ink-soft">{p.sub}</span>
            </Link>
          ))}
        </div>
      )}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-bg/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Main"
      >
        {tab("/", "Guide", icons.guide)}
        {tab("/today", "Today", icons.today)}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="places-sheet"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${placesActive || open ? "text-teal" : "text-ink-soft"}`}
        >
          <Icon d={icons.places} />
          Places
        </button>
        {tab("/transport", "Transport", icons.transport)}
      </nav>
    </div>
  );
}
