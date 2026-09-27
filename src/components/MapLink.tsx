import { googleMapsLink } from "@/lib/trip-data";

export function MapLink({ query, label = "Open in Google Maps" }: { query: string; label?: string }) {
  return (
    <a
      href={googleMapsLink(query)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline"
    >
      {label}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}
