"use client";

import { useEffect } from "react";

// On the guide, outline today's card and its chip (phone's local date) during the trip.
export function TodayMarker() {
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    const card = document.getElementById(`d-${today}`);
    if (!card) return;
    card.style.outline = "3px solid var(--teal)";
    card.style.outlineOffset = "2px";
    const chip = document.querySelector<HTMLAnchorElement>(`a[href="#d-${today}"]`);
    if (chip) {
      chip.style.background = "var(--teal)";
      chip.style.color = "white";
      chip.textContent = `Today · ${chip.textContent}`;
      chip.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }, []);
  return null;
}
