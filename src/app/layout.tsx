import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { RegisterSW } from "@/components/RegisterSW";
import { NowClocks } from "@/components/NowClocks";
import { SaveOffline } from "@/components/SaveOffline";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canada Loop — Oct 2026",
  description:
    "Vancouver, Toronto, Niagara Falls & Montreal travel proposal: day-by-day plan, transport, halal food and budget in CAD & TND.",
  appleWebApp: { capable: true, title: "Canada Loop", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#16233a",
};

const navLinks = [
  { href: "/", label: "Guide" },
  { href: "/today", label: "Today" },
  { href: "/vancouver", label: "Vancouver" },
  { href: "/toronto", label: "Toronto & Niagara" },
  { href: "/montreal", label: "Montreal" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/transport", label: "Transport & Budget" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <RegisterSW />
        <nav className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-5 py-3 md:justify-start">
              <Link href="/" className="shrink-0 whitespace-nowrap font-display text-[19px] font-semibold">
                Canada Loop
              </Link>
              <span className="md:order-last md:ml-auto">
                <NowClocks />
              </span>
              <div className="hidden gap-1 overflow-x-auto [scrollbar-width:none] md:flex">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-panel hover:text-ink transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="flex flex-col items-center gap-4 border-t border-line px-4 py-8 text-center text-sm text-ink-soft">
          <SaveOffline />
          <span>Canada Loop — travel proposal · Oct 2026</span>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
