// Central trip data: FX rate is approximate and fluctuates — shown as a live-ish reference, not a guarantee.
export const FX = {
  cadToTnd: 2.05, // approx, Sept 2026 — 1 CAD ≈ 2.05 TND
};

export function cadToTnd(cad: number): number {
  return Math.round(cad * FX.cadToTnd * 100) / 100;
}

export type PriceTier = "free" | "budget" | "moderate" | "splurge";

export interface FoodSpot {
  name: string;
  type: string;
  halal: boolean;
  priceCad: string;
  priceTnd: string;
  note: string;
  mapQuery: string;
}

export interface Activity {
  name: string;
  description: string;
  priceCad: number | "Free";
  tier: PriceTier;
  durationHrs: number;
  mapQuery: string;
}

export interface TransportLeg {
  from: string;
  to: string;
  mode: string;
  distanceKm: number;
  durationLabel: string;
  priceCad: string;
  priceTnd: string;
  booked: boolean;
  notes?: string;
  mapQuery: string;
}

export interface DayPlan {
  day: string;
  date: string;
  city: string;
  title: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  food?: FoodSpot[];
  transport?: string;
}

export const cities = {
  vancouver: {
    name: "Vancouver",
    dates: "Oct 1 – 8",
    color: "#2F8F8A",
    airport: "Vancouver Intl (YVR)",
    activities: [
      {
        name: "Stanley Park Seawall",
        description: "9 km paved waterfront path around the park — bike or walk it.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Stanley Park Seawall Vancouver",
      },
      {
        name: "Gastown & Granville Island",
        description: "Historic cobblestone streets, the steam clock, and the public market on the island.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Granville Island Public Market Vancouver",
      },
      {
        name: "Vancouver Aquarium",
        description: "Marine life exhibits in Stanley Park — good rainy-day option.",
        priceCad: 32,
        tier: "budget",
        durationHrs: 2,
        mapQuery: "Vancouver Aquarium",
      },
      {
        name: "Capilano Suspension Bridge + Grouse Mountain combo",
        description: "Suspension bridge through the canopy, then the gondola up Grouse Mountain for city views.",
        priceCad: 248,
        tier: "splurge",
        durationHrs: 6,
        mapQuery: "Capilano Suspension Bridge Park",
      },
    ] as Activity[],
    food: [
      {
        name: "Nuba",
        type: "Lebanese",
        halal: true,
        priceCad: "$15–25 CAD/person",
        priceTnd: "≈45–75 TND",
        note: "Halal Lebanese chain, several downtown/Gastown locations — mezze, shawarma wraps.",
        mapQuery: "Nuba 508 Davie St Vancouver",
      },
      {
        name: "Moltaqa",
        type: "Moroccan",
        halal: true,
        priceCad: "$25–40 CAD/person",
        priceTnd: "≈75–120 TND",
        note: "Halal Moroccan restaurant in Yaletown, tagines and couscous.",
        mapQuery: "Moltaqa Restaurant Yaletown Vancouver",
      },
    ] as FoodSpot[],
  },
  toronto: {
    name: "Toronto & Niagara Falls",
    dates: "Oct 10 – 11",
    color: "#E0793D",
    airport: "Toronto Pearson (YYZ)",
    activities: [
      {
        name: "CN Tower observation deck",
        description: "360° views over the city and the lake from Canada's tallest tower.",
        priceCad: 58,
        tier: "moderate",
        durationHrs: 2,
        mapQuery: "CN Tower Toronto",
      },
      {
        name: "Distillery District",
        description: "Car-free Victorian-era streets, galleries, cafés and shops.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Distillery District Toronto",
      },
      {
        name: "Horseshoe Falls viewpoint",
        description: "Free public viewpoints along Niagara Parkway looking straight at the falls.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 1,
        mapQuery: "Table Rock Niagara Falls",
      },
      {
        name: "Journey Behind the Falls + Hornblower boat cruise",
        description: "Tunnels behind the curtain of water, plus a boat ride right up to the base.",
        priceCad: 65,
        tier: "moderate",
        durationHrs: 3,
        mapQuery: "Journey Behind the Falls Niagara",
      },
      {
        name: "Skylon Tower (optional)",
        description: "Observation deck with a direct falls view, revolving restaurant on top.",
        priceCad: 23,
        tier: "budget",
        durationHrs: 1,
        mapQuery: "Skylon Tower Niagara Falls",
      },
    ] as Activity[],
    food: [
      {
        name: "Paramount Fine Foods — Union Station",
        type: "Lebanese/Middle Eastern",
        halal: true,
        priceCad: "$12–20 CAD/person",
        priceTnd: "≈35–60 TND",
        note: "HMA-certified halal chain, convenient location right at Union Station before/after the bus.",
        mapQuery: "Paramount Fine Foods Union Station Toronto",
      },
      {
        name: "Paramount Fine Foods — First Canadian Place",
        type: "Lebanese/Middle Eastern",
        halal: true,
        priceCad: "$12–20 CAD/person",
        priceTnd: "≈35–60 TND",
        note: "Downtown financial district location, HMA-certified.",
        mapQuery: "Paramount Fine Foods First Canadian Place Toronto",
      },
    ] as FoodSpot[],
  },
  montreal: {
    name: "Montreal",
    dates: "Oct 9–10 & 12",
    color: "#16233A",
    airport: "Montréal–Trudeau (YUL)",
    activities: [
      {
        name: "Notre-Dame Basilica",
        description: "Gothic Revival interior with a deep-blue starred ceiling — one of the most photographed churches in Canada.",
        priceCad: 15,
        tier: "budget",
        durationHrs: 1,
        mapQuery: "Notre-Dame Basilica Montreal",
      },
      {
        name: "Old Montreal & the Old Port",
        description: "Cobblestone streets, 17th–19th century architecture, and the riverfront promenade.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Old Montreal",
      },
      {
        name: "Mount Royal lookout",
        description: "Panoramic city view from the park Frederick Law Olmsted designed after Central Park.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Mount Royal Lookout Montreal",
      },
    ] as Activity[],
    food: [
      {
        name: "Shawarmaz",
        type: "Middle Eastern",
        halal: true,
        priceCad: "$10–18 CAD/person",
        priceTnd: "≈30–55 TND",
        note: "Popular shawarma spot on Saint-Catherine St W, generous portions.",
        mapQuery: "Shawarmaz 1340 Saint-Catherine St W Montreal",
      },
      {
        name: "Byblos / Old Montreal halal grills",
        type: "Middle Eastern",
        halal: true,
        priceCad: "$15–25 CAD/person",
        priceTnd: "≈45–75 TND",
        note: "Several halal-friendly grill spots around Old Montreal — check current HMA/Zabihah listing before you go.",
        mapQuery: "halal restaurants Old Montreal",
      },
    ] as FoodSpot[],
  },
};

export const transportLegs: TransportLeg[] = [
  {
    from: "Vancouver",
    to: "Calgary",
    mode: "Flight (connection)",
    distanceKm: 690,
    durationLabel: "~1h20 flight",
    priceCad: "Already booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Vancouver to Calgary",
  },
  {
    from: "Calgary",
    to: "Montreal",
    mode: "Flight",
    distanceKm: 3000,
    durationLabel: "~4h flight",
    priceCad: "Already booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Calgary to Montreal",
  },
  {
    from: "Montreal (Laval – Métro Cartier)",
    to: "Toronto (Union Station)",
    mode: "FlixBus — booked",
    distanceKm: 540,
    durationLabel: "Oct 10, 18:20 → Oct 11, 05:05 (~10h45, overnight)",
    priceCad: "$59.48 CAD",
    priceTnd: `≈${cadToTnd(59.48)} TND`,
    booked: true,
    notes: "Overnight bus doubles as a hotel night.",
    mapQuery: "Laval Terminus Metro Cartier to Toronto Union Station Bus Terminal",
  },
  {
    from: "Toronto (Union Station)",
    to: "Niagara Falls",
    mode: "GO Train",
    distanceKm: 130,
    durationLabel: "~2h each way",
    priceCad: "≈$22 CAD one-way",
    priceTnd: `≈${cadToTnd(22)} TND`,
    booked: false,
    mapQuery: "Union Station Toronto to Niagara Falls GO Train",
  },
  {
    from: "Toronto (Pearson Airport T1)",
    to: "Montreal (Laval – Métro Cartier)",
    mode: "FlixBus — booked",
    distanceKm: 540,
    durationLabel: "Oct 12, 01:20 → 11:00 (~9h40, overnight)",
    priceCad: "$77.48 CAD",
    priceTnd: `≈${cadToTnd(77.48)} TND`,
    booked: true,
    notes: "Overnight bus doubles as a hotel night.",
    mapQuery: "Toronto Pearson Airport Terminal 1 to Laval Terminus Metro Cartier",
  },
];

export const addresses = [
  {
    label: "Boarding point (Montreal)",
    name: "Laval – Métro Cartier terminus",
    address: "40 Boul. des Laurentides, Laval, QC H7G 2S6",
    mapQuery: "40 Boulevard des Laurentides, Laval, QC H7G 2S6",
  },
  {
    label: "Toronto arrival",
    name: "Union Station Bus Terminal",
    address: "81 Bay St, Toronto, ON",
    mapQuery: "81 Bay St, Toronto, ON",
  },
  {
    label: "Return departure",
    name: "Toronto Pearson Airport, Terminal 1",
    address: "6301 Silver Dart Dr, Mississauga, ON L5P 1B2",
    mapQuery: "6301 Silver Dart Dr, Mississauga, ON L5P 1B2",
  },
];

export const dayPlans: DayPlan[] = [
  {
    day: "Day 1",
    date: "Oct 1",
    city: "Vancouver",
    title: "Arrival",
    afternoon: "Settle in, walk Stanley Park Seawall at golden hour.",
    evening: "Dinner at Nuba (halal, Gastown).",
    food: [cities.vancouver.food[0]],
  },
  {
    day: "Day 2–3",
    date: "Oct 2–3",
    city: "Vancouver",
    title: "Free days before IASAM",
    morning: "Granville Island Public Market.",
    afternoon: "Capilano Suspension Bridge + Grouse Mountain gondola.",
    evening: "Dinner at Moltaqa (halal Moroccan, Yaletown).",
    food: [cities.vancouver.food[1]],
  },
  {
    day: "Day 4–8",
    date: "Oct 4–8",
    city: "Vancouver",
    title: "IASAM event",
    morning: "Conference sessions.",
    evening: "Evenings free — Vancouver Aquarium or Gastown.",
  },
  {
    day: "Day 9",
    date: "Oct 9",
    city: "Montreal",
    title: "Arrive Montreal",
    afternoon: "Land, check in, walk Old Montreal & the Old Port.",
    evening: "Dinner at Shawarmaz (halal, Saint-Catherine St W).",
    food: [cities.montreal.food[0]],
  },
  {
    day: "Day 10",
    date: "Oct 10",
    city: "Montreal → Toronto",
    title: "Notre-Dame + overnight bus",
    morning: "Notre-Dame Basilica.",
    afternoon: "Mount Royal lookout, pack for the bus.",
    evening: "18:20 FlixBus from Laval – Métro Cartier to Toronto (overnight).",
    transport: "FlixBus Montreal → Toronto, $59.48 CAD",
  },
  {
    day: "Day 11",
    date: "Oct 11",
    city: "Toronto & Niagara",
    title: "Arrive Toronto, day trip to the Falls",
    morning: "Arrive Union Station 05:05, breakfast, CN Tower.",
    afternoon: "GO Train to Niagara Falls, Journey Behind the Falls + boat cruise.",
    evening: "GO Train back to Toronto, dinner at Paramount Fine Foods (halal, Union Station), then to Pearson for the night bus.",
    food: [cities.toronto.food[0]],
    transport: "GO Train Toronto ↔ Niagara, ≈$22 CAD each way",
  },
  {
    day: "Day 12",
    date: "Oct 12",
    city: "Toronto → Montreal",
    title: "Overnight bus back, rest day",
    morning: "01:20 FlixBus departs Pearson T1, arrives Montreal 11:00.",
    afternoon: "Rest, laundry, light walk in Old Montreal.",
    evening: "Free evening.",
    transport: "FlixBus Toronto → Montreal, $77.48 CAD",
  },
  {
    day: "Day 13",
    date: "Oct 13",
    city: "Montreal",
    title: "Departure",
    morning: "Free morning.",
    afternoon: "Flight home.",
  },
];

export const budgetTiers = [
  {
    tier: "Budget",
    cad: "21–70",
    tnd: `${cadToTnd(21)}–${cadToTnd(70)}`,
    description: "Free viewpoints, walking tours, minimal paid attractions.",
  },
  {
    tier: "Moderate — recommended",
    cad: "≈250",
    tnd: `≈${cadToTnd(250)}`,
    description: "Journey Behind the Falls, Hornblower cruise, CN Tower, Basilica entry.",
    recommended: true,
  },
  {
    tier: "Splurge",
    cad: "≈440",
    tnd: `≈${cadToTnd(440)}`,
    description: "Adds the Capilano + Grouse Mountain combo in Vancouver.",
  },
];

export function googleMapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
