import type { MetadataRoute } from "next";

// Installable on the home screen; opens straight to today's plan.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Canada Loop · Oct 2026",
    short_name: "Canada Loop",
    description: "Day-by-day trip guide: Vancouver, Toronto, Niagara Falls & Montreal.",
    start_url: "/today",
    display: "standalone",
    background_color: "#fbfbf7",
    theme_color: "#16233a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
