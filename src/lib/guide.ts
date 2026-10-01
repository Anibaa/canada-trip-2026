// Detailed day-by-day guide: timed stops with the best time to visit, and the transit leg between
// each stop (recommended line, time, fare, taxi fallback, Google Maps directions).
// Fares/hours checked Sept 2026 — approximate, confirm the week before.
import prayers from "./prayers.json";
import sun from "./sun.json";
import type { PhotoId } from "./trip-data";

export type Mode =
  | "walk"
  | "skytrain"
  | "bus"
  | "seabus"
  | "ferry"
  | "metro"
  | "train"
  | "shuttle"
  | "taxi"
  | "flight"
  | "coach";

export const modeIcon: Record<Mode, string> = {
  walk: "🚶",
  skytrain: "🚈",
  bus: "🚌",
  seabus: "⛴️",
  ferry: "⛴️",
  metro: "🚇",
  train: "🚆",
  shuttle: "🚐",
  taxi: "🚕",
  flight: "✈️",
  coach: "🚌",
};

export interface Stop {
  kind: "stop";
  time: string;
  place: string;
  what: string;
  best?: string; // best time to be there
  mapQuery?: string;
  food?: boolean;
  photo?: PhotoId;
  zone?: Zone; // when the stop is in a different time zone than the day
}

export interface Leg {
  kind: "leg";
  mode: Mode;
  route: string; // e.g. "Canada Line → Waterfront"
  minutes: string;
  cost: string;
  taxi?: string; // taxi / Uber fallback
  from?: string; // for Google Maps directions
  to?: string;
  travelmode?: "transit" | "walking" | "driving";
  note?: string;
}

export type SunCity = keyof typeof sun.cities;

// Time zones in October 2026: Canada, Germany and Italy are still on summer time; Tunisia is UTC+1 all year.
export type Zone = "vancouver" | "calgary" | "eastern" | "frankfurt" | "rome" | "tunis";
export const zones: Record<Zone, { label: string; utc: string; tunisAhead: number; iana: string }> = {
  vancouver: { label: "Vancouver", utc: "UTC−7", tunisAhead: 8, iana: "America/Vancouver" },
  calgary: { label: "Calgary", utc: "UTC−6", tunisAhead: 7, iana: "America/Edmonton" },
  eastern: { label: "Montreal & Toronto", utc: "UTC−4", tunisAhead: 5, iana: "America/Toronto" },
  frankfurt: { label: "Frankfurt", utc: "UTC+2", tunisAhead: -1, iana: "Europe/Berlin" },
  rome: { label: "Rome", utc: "UTC+2", tunisAhead: -1, iana: "Europe/Rome" },
  tunis: { label: "Tunis", utc: "UTC+1", tunisAhead: 0, iana: "Africa/Tunis" },
};

// "17:15" in Vancouver → "01:15 +1" in Tunis. Labels like "Morning" return null.
export function tunisTime(time: string, zone: Zone): string | null {
  const m = time.match(/^(\d{2}):(\d{2})$/);
  if (!m || zone === "tunis") return null;
  const mins = Number(m[1]) * 60 + Number(m[2]) + zones[zone].tunisAhead * 60;
  const dayShift = Math.floor(mins / 1440);
  const t = ((mins % 1440) + 1440) % 1440;
  const hhmm = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  return hhmm + (dayShift > 0 ? " +1" : dayShift < 0 ? " −1" : "");
}

export interface Mosque {
  name: string;
  address: string;
  note: string;
  mapQuery: string;
}

const mosques: Record<string, Mosque> = {
  fra: { name: "Frankfurt Airport prayer rooms", address: "Terminal 1 — follow the prayer-room signs or ask at an info desk", note: "Plenty of time during the 8-hour connection.", mapQuery: "Frankfurt Airport Terminal 1" },
  yvr: { name: "YVR multi-faith prayer room", address: "Vancouver Airport, Pier D upper lounge", note: "Has a washing station.", mapQuery: "Vancouver International Airport" },
  jamia: { name: "Al-Masjid Al-Jamia", address: "655 W 8th Ave, Vancouver", note: "Vancouver's oldest mosque: all five prayers and Jumu'ah, open daily. Canada Line → Broadway–City Hall, ~5-min walk.", mapQuery: "Al Masjid Al Jamia 655 W 8th Ave Vancouver" },
  arRahman: { name: "Masjid Ar-Rahman", address: "1398 W 15th St, North Vancouver", note: "Closest mosque on the North Shore — about 10 min by taxi from Capilano.", mapQuery: "Masjid Ar-Rahman 1398 W 15th St North Vancouver" },
  yul: { name: "YUL multi-faith prayer room", address: "Montréal–Trudeau, public area behind the Java U café", note: "Prayer mats available.", mapQuery: "Montréal-Trudeau International Airport" },
  madinah: { name: "Al-Madinah Centre", address: "1260 Rue Mackay, Montreal", note: "Downtown, a few minutes from Guy-Concordia métro, Shawarmaz and Boustan.", mapQuery: "Al-Madinah Center 1260 Rue Mackay Montreal" },
  mtAdelaide: { name: "Masjid Toronto @ Adelaide", address: "84 Adelaide St E, Toronto", note: "About 10 min on foot from Union Station.", mapQuery: "Masjid Toronto 84 Adelaide St E Toronto" },
  aisha: { name: "Mosque Aisha", address: "5550 Stanley Ave, Niagara Falls", note: "Closest mosque to Clifton Hill — a short taxi ride.", mapQuery: "Mosque Aisha 5550 Stanley Ave Niagara Falls" },
  pearson: { name: "Pearson T1 prayer room", address: "Terminal 1, Level 1 Arrivals (before security), beside Tim Hortons", note: "Carpeted Muslim prayer room in the Multi-Faith Centre — where you wait for the 01:20 bus.", mapQuery: "Toronto Pearson Terminal 1" },
};

const mosquesByDay: Record<string, string[]> = {
  "2026-10-01": ["fra", "yvr", "jamia"],
  "2026-10-02": ["arRahman", "jamia"],
  "2026-10-03": ["jamia"],
  "2026-10-04": ["jamia"],
  "2026-10-05": ["jamia"],
  "2026-10-06": ["jamia"],
  "2026-10-07": ["jamia"],
  "2026-10-08": ["jamia", "yvr"],
  "2026-10-09": ["yul", "madinah"],
  "2026-10-10": ["madinah"],
  "2026-10-11": ["mtAdelaide", "aisha", "pearson"],
  "2026-10-12": ["madinah", "yul"],
};

// The two Fridays in Canada.
const jumuah: Record<string, string> = {
  "2026-10-02": "Friday: Jumu'ah at Masjid Ar-Rahman (North Shore) or Al-Jamia — check the khutbah time the day before.",
  "2026-10-09": "Friday: Jumu'ah at Al-Madinah Centre downtown fits after the nap, before the Tunisian lunch — check the khutbah time.",
};

export function prayersFor(date: string) {
  return {
    times: prayers.days[date as keyof typeof prayers.days] ?? null,
    method: prayers.note,
    mosques: (mosquesByDay[date] ?? []).map((k) => mosques[k]),
    jumuah: jumuah[date] ?? null,
  };
}

export interface GuideDay {
  date: string; // YYYY-MM-DD
  city: string;
  sunCity?: SunCity; // absent on transit-only days outside Canada
  zone: Zone; // the day's local time zone
  title: string;
  steps: (Stop | Leg)[];
  tips?: string[];
}

export function sunTimes(day: GuideDay) {
  if (!day.sunCity) return null;
  return sun.cities[day.sunCity][day.date.slice(5) as keyof (typeof sun.cities)[SunCity]];
}

export function directionsLink(leg: Leg): string | null {
  if (!leg.from || !leg.to) return null;
  const p = new URLSearchParams({
    api: "1",
    origin: leg.from,
    destination: leg.to,
    travelmode: leg.travelmode ?? "transit",
  });
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

const stop = (s: Omit<Stop, "kind">): Stop => ({ kind: "stop", ...s });
const leg = (l: Omit<Leg, "kind">): Leg => ({ kind: "leg", ...l });

export const gettingAround = [
  {
    city: "Vancouver",
    items: [
      "Tap a contactless credit card (or phone) at SkyTrain gates, SeaBus and bus readers: $3.50 for 1 zone. A Compass card with stored value is cheaper ($2.85).",
      "Weekdays before 6:30 pm, trips that cross into North Vancouver (SeaBus) cost 2 zones (≈$5); evenings and weekends everything is 1 zone.",
      "From the airport, a $6.50 YVR AddFare is added automatically — leaving for the airport, it isn't.",
      "Taxis from YVR use flat zone fares (≈$35–46 to downtown). Uber and Lyft work across the city.",
    ],
  },
  {
    city: "Toronto & Niagara",
    items: [
      "TTC subway/streetcar/bus: tap a credit card, $3.30 per ride (2 h transfer).",
      "UP Express Union ↔ Pearson: 25 min, every 15 min, $12.35 ($9.25 with PRESTO). Last train from Union 01:00.",
      "GO Transit Union ↔ Niagara Falls ≈$22 each way. Ask for the GO + WEGO combo ($22 incl. an unlimited WEGO day pass).",
      "WEGO buses link every Niagara attraction: $16 for 24 h. Uber and taxis are easy on both ends.",
    ],
  },
  {
    city: "Montreal",
    items: [
      "The 747 airport bus costs $11.25 and that ticket is a 24 h pass for all buses and the métro in zone A — buy it at the machines in arrivals.",
      "Single métro/bus fare: $3.75 (zone A).",
      "The FlixBus stop at Cartier is in Laval (zone B): buy an 'All modes AB' ticket at the station machine — a zone A pass won't open the gates there.",
      "YUL taxis are flat-rate to downtown: $49.45 (5 am–11 pm), $56.70 overnight. Uber works too.",
    ],
  },
];

export const guideDays: GuideDay[] = [
  {
    date: "2026-10-01",
    city: "Tunis → Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "Fly in via Frankfurt, Seawall & English Bay sunset",
    steps: [
      stop({ time: "Sep 30, 23:00", zone: "tunis", place: "Tunis–Carthage (TUN)", what: "Check in for the 01:35 departure.", mapQuery: "Tunis-Carthage International Airport" }),
      leg({ mode: "flight", route: "Tunis (TUN) 01:35 → Frankfurt (FRA) 05:10 · Air Canada AC9277", minutes: "2 h 35", cost: "Booked" }),
      stop({ time: "05:10", zone: "frankfurt", place: "Frankfurt Airport", what: "8-hour connection. Stay airside and rest — leaving the airport needs a Schengen entry.", photo: "fra", mapQuery: "Frankfurt Airport Terminal 1" }),
      leg({ mode: "flight", route: "Frankfurt (FRA) 13:20 → Vancouver (YVR) 14:20", minutes: "~10 h", cost: "Booked" }),
      stop({ time: "14:20", place: "Vancouver Intl (YVR)", what: "Immigration + bags usually take 45–60 min. Then follow signs to the Canada Line.", photo: "yvr", mapQuery: "YVR Airport Station Canada Line" }),
      leg({ mode: "skytrain", route: "Canada Line → Vancouver City Centre / Waterfront", minutes: "25", cost: "≈$10–12 incl. the $6.50 AddFare (tap card)", taxi: "Flat zone fare ≈$35–46, ~30 min", from: "YVR-Airport Station", to: "Waterfront Station Vancouver" }),
      stop({ time: "16:00", place: "Hotel", what: "Check in, shower, 30 min rest. Stay awake until evening to beat jet lag." }),
      leg({ mode: "bus", route: "Bus 19 (Stanley Park) from W Pender St, or walk along Coal Harbour", minutes: "10 by bus / 25 walking", cost: "$3.50", taxi: "≈$10", from: "Waterfront Station Vancouver", to: "Stanley Park Seawall Coal Harbour" }),
      stop({ time: "17:15", place: "Stanley Park Seawall", what: "Walk the seawall from Coal Harbour past the Brockton Point totem poles.", best: "Late afternoon into golden hour — softest light on the harbour.", photo: "stanley-park-seawall", mapQuery: "Stanley Park Seawall Vancouver" }),
      leg({ mode: "walk", route: "Cut through the park (Lagoon Dr) to English Bay", minutes: "30", cost: "Free", taxi: "≈$10", from: "Brockton Point Vancouver", to: "English Bay Beach Vancouver", travelmode: "walking" }),
      stop({ time: "18:30", place: "English Bay Beach", what: "Sunset from the beach by the Inukshuk.", best: "Be there 20 min before sunset (18:50 tonight).", photo: "english-bay", mapQuery: "English Bay Beach Vancouver" }),
      leg({ mode: "walk", route: "Walk east along Davie St (or bus 6)", minutes: "25 walking / 10 by bus", cost: "Free / $3.50", taxi: "≈$10", from: "English Bay Beach Vancouver", to: "Nuba 508 Davie St Vancouver", travelmode: "walking" }),
      stop({ time: "19:30", place: "Nuba (Yaletown)", what: "Halal Lebanese dinner — then an early night.", photo: "dish-falafel", mapQuery: "Nuba 508 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-02",
    city: "Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "North Shore: Capilano & Grouse Mountain",
    steps: [
      stop({ time: "08:45", place: "Canada Place", what: "Free Capilano shuttle pickup (every ~30 min, year-round).", photo: "canada-place", mapQuery: "Canada Place Vancouver" }),
      leg({ mode: "shuttle", route: "Free Capilano Suspension Bridge shuttle", minutes: "25", cost: "Free", taxi: "≈$30–35, 20 min", from: "Canada Place Vancouver", to: "Capilano Suspension Bridge Park", travelmode: "driving" }),
      stop({ time: "09:30", place: "Capilano Suspension Bridge Park", what: "The bridge, Treetops Adventure and the Cliffwalk.", best: "Right at opening — tour buses arrive from ~11:00.", photo: "capilano", mapQuery: "Capilano Suspension Bridge Park" }),
      leg({ mode: "bus", route: "Bus 236 north on Capilano Rd → Grouse Mountain (last stop)", minutes: "5–10", cost: "$3.50", taxi: "≈$10", from: "Capilano Suspension Bridge Park", to: "Grouse Mountain Skyride" }),
      stop({ time: "12:00", place: "Grouse Mountain", what: "Skyride gondola up for views over the city. Bring a halal wrap — the mountain restaurants aren't halal.", best: "Only on a clear day — check the Grouse webcam first. Cloudy? Swap for Lynn Canyon (tip below).", photo: "grouse", mapQuery: "Grouse Mountain Skyride" }),
      leg({ mode: "bus", route: "Bus 236 → Lonsdale Quay, then SeaBus → Waterfront", minutes: "25 + 12", cost: "≈$5 (2 zones before 6:30 pm)", taxi: "≈$40, 25 min", from: "Grouse Mountain Skyride", to: "Waterfront Station Vancouver" }),
      stop({ time: "16:00", place: "Hotel", what: "Rest before dinner." }),
      leg({ mode: "skytrain", route: "Canada Line → Yaletown–Roundhouse", minutes: "5", cost: "$3.50", taxi: "≈$10", from: "Waterfront Station Vancouver", to: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver" }),
      stop({ time: "19:30", place: "Moltaqa (Yaletown)", what: "Halal Moroccan dinner — tagine or couscous. Fridays have live oud; book ahead.", photo: "dish-tajine", mapQuery: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver", food: true }),
    ],
    tips: [
      "Free alternative to Capilano + Grouse: Lynn Canyon Park — SeaBus to Lonsdale Quay, bus 228 to Lynn Valley Rd, then a 15-min walk. Its suspension bridge is free.",
    ],
  },
  {
    date: "2026-10-03",
    city: "Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "Granville Island, Gastown & Queen Elizabeth Park",
    steps: [
      stop({ time: "09:00", place: "Hornby St Aquabus dock", what: "Little rainbow ferries across False Creek.", photo: "aquabus", mapQuery: "Aquabus Hornby Street Dock Vancouver" }),
      leg({ mode: "ferry", route: "Aquabus → Granville Island", minutes: "5", cost: "≈$5", taxi: "≈$12", from: "Aquabus Hornby Street Dock Vancouver", to: "Granville Island Public Market", travelmode: "walking" }),
      stop({ time: "09:15", place: "Granville Island Public Market", what: "Taste BC: candied wild salmon at Longliner Seafoods, a Nanaimo bar at Northern Bars, a honey-dip at Lee's Donuts.", best: "9–11 am, before the weekend crowds.", photo: "granville-island", mapQuery: "Granville Island Public Market Vancouver" }),
      leg({ mode: "bus", route: "Bus 50 → Granville & Hastings, then walk east through Gastown", minutes: "30", cost: "$3.50", taxi: "≈$12, 10 min", from: "Granville Island Public Market", to: "Gastown Steam Clock Vancouver" }),
      stop({ time: "11:45", place: "Gastown & the Steam Clock", what: "Cobblestones and the steam clock (it whistles every 15 min).", best: "On the quarter-hour for the whistle.", photo: "steam-clock", mapQuery: "Gastown Steam Clock Vancouver" }),
      leg({ mode: "walk", route: "Walk down Carrall St to Chinatown", minutes: "8", cost: "Free", from: "Gastown Steam Clock Vancouver", to: "Dr. Sun Yat-Sen Classical Chinese Garden", travelmode: "walking" }),
      stop({ time: "12:15", place: "Dr. Sun Yat-Sen Classical Chinese Garden", what: "Ming-style scholar's garden — 45 min is enough.", best: "Midday; lovely even in rain.", photo: "sun-yat-sen-garden", mapQuery: "Dr. Sun Yat-Sen Classical Chinese Garden Vancouver" }),
      leg({ mode: "walk", route: "Walk to W Hastings St", minutes: "10", cost: "Free", from: "Dr. Sun Yat-Sen Classical Chinese Garden", to: "Nuba 207 W Hastings St Vancouver", travelmode: "walking" }),
      stop({ time: "13:15", place: "Nuba (Gastown)", what: "Halal lunch.", photo: "dish-falafel", mapQuery: "Nuba 207 W Hastings St Vancouver", food: true }),
      leg({ mode: "skytrain", route: "Canada Line Waterfront → King Edward, then walk 10 min uphill", minutes: "25", cost: "$3.50", taxi: "≈$18, 15 min", from: "Waterfront Station Vancouver", to: "Bloedel Conservatory Queen Elizabeth Park Vancouver" }),
      stop({ time: "15:00", place: "Queen Elizabeth Park & Bloedel Conservatory", what: "Quarry gardens, the city's highest viewpoint, and the bird-filled dome (open 10–17).", best: "Mid-afternoon — the lookout faces north to downtown and the mountains.", photo: "queen-elizabeth-park", mapQuery: "Bloedel Conservatory Queen Elizabeth Park Vancouver" }),
      leg({ mode: "skytrain", route: "Canada Line King Edward → downtown", minutes: "15", cost: "$3.50", taxi: "≈$18", from: "King Edward Station Vancouver", to: "Vancouver City Centre Station" }),
      stop({ time: "Evening", place: "Manoush'eh", what: "Sunset 18:45. Manousheh and knafeh at Manoush'eh (620 Davie, open until 22:00 Sat).", photo: "dish-manakish", mapQuery: "Manoush'eh 620 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-04",
    city: "Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "IASAM · Day 1",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      stop({ time: "18:00", place: "Coal Harbour & Canada Place", what: "Evening walk along the harbour: seaplanes, the Olympic Cauldron, North Shore mountains.", best: "Just before sunset (18:43).", photo: "coal-harbour", mapQuery: "Vancouver Convention Centre Olympic Cauldron" }),
      leg({ mode: "walk", route: "Walk along Cordova St to Gastown", minutes: "12", cost: "Free", from: "Vancouver Convention Centre Olympic Cauldron", to: "Nuba 207 W Hastings St Vancouver", travelmode: "walking" }),
      stop({ time: "19:30", place: "Nuba (Gastown)", what: "Halal dinner.", photo: "dish-falafel", mapQuery: "Nuba 207 W Hastings St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-05",
    city: "Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "IASAM · Day 2",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      leg({ mode: "bus", route: "Bus 5 or 6 → Davie & Denman", minutes: "15", cost: "$3.50", taxi: "≈$12", from: "Vancouver City Centre Station", to: "English Bay Beach Vancouver" }),
      stop({ time: "18:15", place: "English Bay", what: "Second chance at the sunset if day 1 was cloudy.", best: "Sunset 18:41.", photo: "english-bay", mapQuery: "English Bay Beach Vancouver" }),
      leg({ mode: "walk", route: "Walk east on Davie St", minutes: "20", cost: "Free", from: "English Bay Beach Vancouver", to: "Manoush'eh 620 Davie St Vancouver", travelmode: "walking" }),
      stop({ time: "19:15", place: "Manoush'eh", what: "Halal Levantine dinner — open until 21:00 on Mondays.", photo: "dish-manakish", mapQuery: "Manoush'eh 620 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-06",
    city: "Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "IASAM · Day 3",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      stop({ time: "Evening", place: "Seawall by bike", what: "Rent a bike on Denman St and ride the Seawall loop (~1 h) — or rest.", best: "Before dark — sunset is 18:39.", photo: "stanley-park-seawall", mapQuery: "Denman Street bike rental Vancouver" }),
      stop({ time: "20:00", place: "Dinner near Davie St", what: "Nuba (508 Davie) or Manoush'eh (620 Davie), both halal.", photo: "dish-falafel", mapQuery: "Nuba 508 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-07",
    city: "Vancouver",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "IASAM · Day 4 — last full evening in Vancouver",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      stop({ time: "19:30", place: "Moltaqa (Yaletown)", what: "Farewell-to-Vancouver halal Moroccan dinner. Manoush'eh is closed Wednesdays.", photo: "dish-tajine", mapQuery: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver", food: true }),
      stop({ time: "Night", place: "Pack", what: "Tomorrow you check out and fly at 19:30." }),
    ],
  },
  {
    date: "2026-10-08",
    city: "Vancouver → Calgary",
    sunCity: "vancouver",
    zone: "vancouver",
    title: "IASAM · Day 5, evening flight east",
    steps: [
      stop({ time: "Morning", place: "Check out", what: "Leave your bags with the hotel luggage room, then go to the last conference day." }),
      stop({ time: "12:30", place: "Manoush'eh", what: "Lunch, and take-away manousheh for the overnight trip — airport food isn't halal.", photo: "dish-manakish", mapQuery: "Manoush'eh 620 Davie St Vancouver", food: true }),
      stop({ time: "16:30", place: "Hotel", what: "Collect bags." }),
      leg({ mode: "skytrain", route: "Canada Line → YVR-Airport (no AddFare in this direction)", minutes: "25", cost: "$3.50–5", taxi: "≈$35–46, 30 min in rush hour", from: "Vancouver City Centre Station", to: "YVR-Airport Station" }),
      stop({ time: "17:30", place: "Vancouver Intl (YVR)", what: "Domestic check-in, 2 h before departure.", photo: "yvr", mapQuery: "Vancouver International Airport" }),
      leg({ mode: "flight", route: "Vancouver (YVR) 19:30 → Calgary (YYC) 21:59", minutes: "~1 h 30 (+1 h time change)", cost: "Booked" }),
      stop({ time: "21:59", zone: "calgary", place: "Calgary Intl (YYC)", what: "3-hour connection — stay airside, charge your phone, sleep if you can.", photo: "yyc", mapQuery: "Calgary International Airport" }),
      leg({ mode: "flight", route: "Calgary (YYC) 01:00 → Montréal–Trudeau (YUL) 07:10 · overnight", minutes: "~4 h (+2 h time change)", cost: "Booked" }),
    ],
    tips: ["Sleep on the Calgary → Montreal red-eye: you land at 07:10 and Oct 9 is a full day."],
  },
  {
    date: "2026-10-09",
    city: "Montreal",
    sunCity: "montreal",
    zone: "eastern",
    title: "Land at 07:10: bagels, Jean-Talon, Tunisian lunch, Gardens of Light",
    steps: [
      stop({ time: "07:10", place: "Montréal–Trudeau (YUL)", what: "Buy the $11.25 747 ticket at the arrivals machine — it's a 24 h pass for every bus and métro ride today.", photo: "yul", mapQuery: "Montréal-Trudeau International Airport" }),
      leg({ mode: "bus", route: "747 bus → downtown (René-Lévesque stops, ends at Berri-UQAM)", minutes: "50–70 (Friday rush hour)", cost: "$11.25 = 24 h pass", taxi: "Flat $49.45, ~40 min in traffic", from: "Montréal-Trudeau International Airport", to: "Berri-UQAM Station Montreal" }),
      stop({ time: "08:30", place: "Hotel", what: "Drop bags (ask for early check-in). This is the only hotel night you need in Montreal." }),
      leg({ mode: "bus", route: "Green line → Place-des-Arts, then bus 80 north on Av. du Parc → Saint-Viateur", minutes: "25", cost: "Covered by the 747 pass", taxi: "≈$15", from: "Place-des-Arts Station Montreal", to: "St-Viateur Bagel 263 Rue Saint-Viateur O Montreal" }),
      stop({ time: "09:15", place: "St-Viateur Bagel", what: "Breakfast: wood-fired Montreal bagels straight from the oven (open 24 h).", best: "Morning, when the batches come out hot.", photo: "food-bagel", mapQuery: "St-Viateur Bagel 263 Rue Saint-Viateur O Montreal", food: true }),
      leg({ mode: "walk", route: "Walk east through Mile End & Little Italy", minutes: "25", cost: "Free", taxi: "≈$12", from: "St-Viateur Bagel 263 Rue Saint-Viateur O Montreal", to: "Marché Jean-Talon Montreal", travelmode: "walking" }),
      stop({ time: "10:15", place: "Jean-Talon Market", what: "Harvest season: apples, pumpkins, and maple taffy / maple butter to try.", best: "Mid-morning, before the lunch crowd.", photo: "jean-talon", mapQuery: "Marché Jean-Talon Montreal" }),
      leg({ mode: "metro", route: "Orange line Jean-Talon → hotel", minutes: "20", cost: "Covered by the 747 pass", taxi: "≈$15", from: "Jean-Talon Station Montreal", to: "Berri-UQAM Station Montreal" }),
      stop({ time: "11:30", place: "Hotel", what: "Check in and nap — you came off a red-eye." }),
      stop({ time: "14:00", place: "El Mida", what: "A taste of home: halal Tunisian — kafteji, ojja, lablabi.", photo: "dish-lablabi", mapQuery: "El Mida 3485 Avenue du Parc Montreal", food: true }),
      leg({ mode: "walk", route: "Walk east to Carré Saint-Louis", minutes: "15", cost: "Free", from: "El Mida 3485 Avenue du Parc Montreal", to: "Carré Saint-Louis Montreal", travelmode: "walking" }),
      stop({ time: "15:30", place: "Plateau Mont-Royal", what: "Carré Saint-Louis, the outdoor staircases, Saint-Laurent Blvd murals.", best: "Afternoon — sun on the row houses.", photo: "carre-saint-louis", mapQuery: "Carré Saint-Louis Montreal" }),
      leg({ mode: "metro", route: "Orange line Sherbrooke → Berri-UQAM, green line → Pie-IX", minutes: "25", cost: "Covered by the 747 pass", taxi: "≈$18", from: "Sherbrooke Station Montreal", to: "Montreal Botanical Garden" }),
      stop({ time: "17:15", place: "Botanical Garden + Gardens of Light", what: "Gardens in daylight, then silk lanterns in the Chinese, Japanese and First Nations gardens (18:30–21:00).", best: "Arrive before sunset (18:19) and stay for dark.", photo: "botanical-garden", mapQuery: "Montreal Botanical Garden" }),
      leg({ mode: "metro", route: "Green line Pie-IX → Guy-Concordia", minutes: "25", cost: "Covered by the 747 pass", taxi: "≈$20", from: "Pie-IX Station Montreal", to: "Boustan 2020 Rue Crescent Montreal" }),
      stop({ time: "21:00", place: "Boustan (Crescent St)", what: "Halal shawarma — or a halal poutine, Quebec's signature dish.", photo: "food-poutine", mapQuery: "Boustan 2020 Rue Crescent Montreal", food: true }),
    ],
    tips: ["Instead of the gardens, the AURA light show inside Notre-Dame Basilica runs in the evenings (≈$37, ~45 min)."],
  },
  {
    date: "2026-10-10",
    city: "Montreal → Toronto",
    sunCity: "montreal",
    zone: "eastern",
    title: "Notre-Dame, Old Montreal, Mount Royal, then the night bus",
    steps: [
      stop({ time: "08:30", place: "Check out", what: "Leave bags at the hotel until ~16:00. Buy a new fare — the 747 pass expires this morning." }),
      leg({ mode: "metro", route: "Orange line → Place-d'Armes", minutes: "10", cost: "$3.75", taxi: "≈$12", from: "Berri-UQAM Station Montreal", to: "Notre-Dame Basilica Montreal" }),
      stop({ time: "09:00", place: "Notre-Dame Basilica", what: "The blue-and-gold nave.", best: "First entry of the morning — quiet, and the light is best.", photo: "notre-dame", mapQuery: "Notre-Dame Basilica Montreal" }),
      leg({ mode: "walk", route: "Walk down to the waterfront", minutes: "5", cost: "Free", from: "Notre-Dame Basilica Montreal", to: "Pointe-à-Callière Montreal", travelmode: "walking" }),
      stop({ time: "10:00", place: "Pointe-à-Callière & Old Montreal", what: "The archaeology museum underground, then Rue Saint-Paul and Place Jacques-Cartier.", best: "Morning, before the Saturday crowds.", photo: "place-jacques-cartier", mapQuery: "Pointe-à-Callière Montreal" }),
      stop({ time: "11:45", place: "BeaverTails (Rue Saint-Paul)", what: "Snack: the classic Canadian fried-dough pastry with cinnamon sugar (136 Rue Saint-Paul E).", photo: "food-beavertails", mapQuery: "BeaverTails 136 Rue Saint-Paul E Montreal", food: true }),
      leg({ mode: "walk", route: "Back up to Notre-Dame St", minutes: "8", cost: "Free", from: "BeaverTails 136 Rue Saint-Paul E Montreal", to: "Restaurant Palki 56 Rue Notre-Dame O Montreal", travelmode: "walking" }),
      stop({ time: "12:30", place: "Restaurant Palki", what: "Halal Indian lunch.", photo: "dish-butter-chicken", mapQuery: "Restaurant Palki 56 Rue Notre-Dame O Montreal", food: true }),
      leg({ mode: "metro", route: "Place-d'Armes → Lionel-Groulx → Peel, then walk up Peel St to the stairs", minutes: "15 + 12 walk", cost: "$3.75", taxi: "≈$15 to the summit chalet", from: "Place d'Armes Montreal", to: "Kondiaronk Belvedere Mount Royal Montreal" }),
      stop({ time: "14:00", place: "Mount Royal — Kondiaronk lookout", what: "400 wooden steps up from Peel & Pine, then the classic skyline view.", best: "Clear afternoon: the sun lights up downtown from behind you.", photo: "mount-royal", mapQuery: "Kondiaronk Belvedere Mount Royal Montreal" }),
      leg({ mode: "walk", route: "Walk down and on to Crescent St", minutes: "30", cost: "Free", from: "Kondiaronk Belvedere Mount Royal Montreal", to: "Boustan 2020 Rue Crescent Montreal", travelmode: "walking" }),
      stop({ time: "16:00", place: "Boustan (Crescent St)", what: "Take-away shawarma for the bus, then collect your bags.", photo: "dish-toum", mapQuery: "Boustan 2020 Rue Crescent Montreal", food: true }),
      leg({ mode: "metro", route: "Orange line (toward Montmorency) → Cartier", minutes: "35–40", cost: "'All modes AB' ticket — Laval is zone B", taxi: "≈$35–45, 25–35 min", from: "Lionel-Groulx Station Montreal", to: "Terminus Cartier 40 Boulevard des Laurentides Laval" }),
      stop({ time: "17:40", place: "Terminus Cartier (Laval)", what: "FlixBus boards here — departure 18:20. Be there 30 min early.", photo: "cartier", mapQuery: "40 Boulevard des Laurentides, Laval, QC H7G 2S6" }),
      leg({ mode: "coach", route: "FlixBus Laval → Toronto Union Station (booked, overnight)", minutes: "18:20 → 05:05", cost: "$59.48 (paid)" }),
    ],
  },
  {
    date: "2026-10-11",
    city: "Toronto & Niagara",
    sunCity: "toronto",
    zone: "eastern",
    title: "Niagara Falls day trip, CN Tower at night",
    steps: [
      stop({ time: "05:05", place: "Union Station", what: "Arrive. Freshen up, breakfast, drop bags at a luggage-storage spot near Union (book ahead — you'll be out ~15 h).", photo: "union-station", mapQuery: "Union Station Bus Terminal 81 Bay St Toronto" }),
      leg({ mode: "train", route: "GO train 07:45 Lakeshore West → Burlington (09:08), connect to GO bus 12B (09:15) → Niagara Falls Bus Terminal 10:15", minutes: "2 h 30", cost: "≈$22 — ask for the GO + WEGO combo", note: "Earlier: 06:40 train + bus → 09:35. Direct train: 09:04 → 11:30 (Sunday timetable, June 2026).", from: "Union Station Toronto", to: "Niagara Falls Bus Terminal 4555 Erie Ave" }),
      leg({ mode: "bus", route: "WEGO bus from the terminal toward Table Rock", minutes: "25", cost: "WEGO day pass $16 (or in the combo)", taxi: "≈$20, 10 min", from: "Niagara Falls Bus Terminal 4555 Erie Ave", to: "Table Rock Centre Niagara Falls" }),
      stop({ time: "10:45", place: "Horseshoe Falls & Journey Behind the Falls", what: "Table Rock viewpoint at the brink, then the tunnels behind the falls (open ~9–19). Wear a waterproof layer.", best: "Late morning, before the midday crowd.", photo: "horseshoe-falls", mapQuery: "Journey Behind the Falls Niagara" }),
      leg({ mode: "walk", route: "Promenade along the Niagara Parkway, north to the cruise dock", minutes: "25", cost: "Free", from: "Table Rock Centre Niagara Falls", to: "Niagara City Cruises 5920 Niagara Parkway", travelmode: "walking" }),
      stop({ time: "12:45", place: "Niagara City Cruises boat", what: "20 minutes into the mist at the base of the falls (daily through Nov 30).", best: "Midday sun makes rainbows in the spray.", photo: "niagara-boat", mapQuery: "Niagara City Cruises Niagara Falls" }),
      leg({ mode: "walk", route: "Up Clifton Hill to Victoria Ave", minutes: "10", cost: "Free", from: "Niagara City Cruises 5920 Niagara Parkway", to: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls", travelmode: "walking" }),
      stop({ time: "13:45", place: "Casablanca", what: "Halal lunch — kebab, shawarma.", photo: "dish-shish-kebab", mapQuery: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls", food: true }),
      stop({ time: "14:45", place: "Clifton Hill: BeaverTails or Skylon Tower", what: "A BeaverTails pastry at 4967 Clifton Hill, or the Skylon Tower deck 10 min away.", photo: "clifton-hill", mapQuery: "BeaverTails 4967 Clifton Hill Niagara Falls" }),
      leg({ mode: "taxi", route: "Taxi or WEGO to Niagara Falls GO station", minutes: "10 (taxi)", cost: "≈$15 taxi", from: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls", to: "Niagara Falls GO Station 4267 Bridge St", travelmode: "driving" }),
      leg({ mode: "train", route: "Direct GO train 16:02 → Union 18:24", minutes: "2 h 20", cost: "≈$22", note: "Later direct trains: 20:00 → 22:23, 22:02 → 00:25 (too late for the airport).", from: "Niagara Falls GO Station 4267 Bridge St", to: "Union Station Toronto" }),
      stop({ time: "18:30", place: "Paramount Fine Foods (Union Station)", what: "Halal dinner in the food court (open until 21:00).", photo: "dish-hummus", mapQuery: "Paramount Fine Foods Union Station Toronto", food: true }),
      leg({ mode: "walk", route: "SkyWalk from Union to the CN Tower", minutes: "10", cost: "Free", from: "Union Station Toronto", to: "CN Tower Toronto", travelmode: "walking" }),
      stop({ time: "19:30", place: "CN Tower", what: "Observation deck and glass floor (open until 22:30).", best: "After dark — sunset is 18:40, city lights by 19:15.", photo: "cn-tower", mapQuery: "CN Tower Toronto" }),
      leg({ mode: "train", route: "Collect bags → UP Express Union → Pearson (every 15 min)", minutes: "25", cost: "$12.35 ($9.25 PRESTO)", taxi: "Uber/taxi ≈$60–75, 30 min", note: "Aim for the ~23:00 train; the last one leaves Union at 01:00.", from: "Union Station Toronto", to: "Toronto Pearson Terminal 1" }),
      stop({ time: "23:30", place: "Pearson Terminal 1", what: "Find the FlixBus stop shown in your booking. Departure 01:20.", photo: "pearson", mapQuery: "Toronto Pearson Airport Terminal 1" }),
    ],
    tips: ["Oct 11 is Thanksgiving weekend: GO trains and the falls are busy — keep your GO + WEGO tickets on your phone."],
  },
  {
    date: "2026-10-12",
    city: "Toronto → Montreal → Rome",
    sunCity: "montreal",
    zone: "eastern",
    title: "Night bus back, last lunch, fly home at 19:25",
    steps: [
      leg({ mode: "coach", route: "FlixBus Pearson T1 → Laval Cartier (booked, overnight)", minutes: "01:20 → 11:00", cost: "$77.48 (paid)" }),
      stop({ time: "11:00", place: "Terminus Cartier (Laval)", what: "You have bags and a 19:25 international flight: be at YUL by 16:25.", photo: "cartier", mapQuery: "40 Boulevard des Laurentides, Laval, QC H7G 2S6" }),
      leg({ mode: "metro", route: "Orange line Cartier → Lionel-Groulx, green line → Guy-Concordia", minutes: "45", cost: "'All modes AB' ticket", taxi: "≈$35–45 to downtown", from: "Terminus Cartier 40 Boulevard des Laurentides Laval", to: "Guy-Concordia Station Montreal" }),
      stop({ time: "12:00", place: "Shawarmaz (Saint-Catherine W)", what: "Last halal lunch in Canada. It's Thanksgiving Monday — Boustan on Crescent St is the backup.", photo: "dish-shawarma", mapQuery: "Shawarmaz 1340 Saint-Catherine St W Montreal", food: true }),
      stop({ time: "13:15", place: "Crescent St & Sainte-Catherine", what: "Short stroll and last souvenirs (maple syrup) — keep it light with the bags.", mapQuery: "Rue Crescent Montreal" }),
      leg({ mode: "bus", route: "747 bus from a René-Lévesque Blvd stop → YUL", minutes: "45–70 (holiday traffic)", cost: "$11.25", taxi: "Flat $49.45, ~30 min", note: "Leave downtown by 14:30 at the latest.", from: "Guy-Concordia Station Montreal", to: "Montréal-Trudeau International Airport" }),
      stop({ time: "16:00", place: "Montréal–Trudeau (YUL)", what: "International check-in, 3 h before departure.", photo: "yul", mapQuery: "Montréal-Trudeau International Airport" }),
      leg({ mode: "flight", route: "Montréal (YUL) 19:25 → Rome Fiumicino (FCO) 09:15 +1 · overnight", minutes: "~8 h", cost: "Booked" }),
    ],
    tips: ["Too tired after the bus? Take a taxi straight from Cartier to YUL (~30 min, metered, roughly $50–70) and eat airside."],
  },
  {
    date: "2026-10-13",
    city: "Rome → Tunis",
    zone: "rome",
    title: "Connection in Rome, home by evening",
    steps: [
      stop({ time: "09:15", place: "Rome Fiumicino (FCO)", what: "7 h 45 connection. Stay airside unless your passport/visa allows Schengen entry.", photo: "fco", mapQuery: "Rome Fiumicino Airport" }),
      leg({ mode: "flight", route: "Rome (FCO) 17:00 → Tunis (TUN) 17:20", minutes: "~1 h 20", cost: "Booked" }),
      stop({ time: "17:20", zone: "tunis", place: "Tunis–Carthage (TUN)", what: "Welcome home.", mapQuery: "Tunis-Carthage International Airport" }),
    ],
  },
];

