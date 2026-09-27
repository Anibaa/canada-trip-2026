// Detailed day-by-day guide: timed stops with the best time to visit, and the transit leg between
// each stop (recommended line, time, fare, taxi fallback, Google Maps directions).
// Fares/hours checked Sept 2026 — approximate, confirm the week before.
import sun from "./sun.json";

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

export interface GuideDay {
  date: string; // YYYY-MM-DD
  city: string;
  sunCity: SunCity;
  title: string;
  steps: (Stop | Leg)[];
  tips?: string[];
}

export function sunTimes(day: GuideDay) {
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
    city: "Vancouver",
    sunCity: "vancouver",
    title: "Arrival, Seawall & English Bay sunset",
    steps: [
      stop({ time: "Arrival", place: "Vancouver Intl (YVR)", what: "Land, clear arrivals, follow signs to the Canada Line.", mapQuery: "YVR Airport Station Canada Line" }),
      leg({ mode: "skytrain", route: "Canada Line → Vancouver City Centre / Waterfront", minutes: "25", cost: "≈$10–12 incl. the $6.50 AddFare (tap card)", taxi: "Flat zone fare ≈$35–46, ~30 min", from: "YVR-Airport Station", to: "Waterfront Station Vancouver" }),
      stop({ time: "Afternoon", place: "Hotel", what: "Check in, rest after the flight." }),
      leg({ mode: "bus", route: "Bus 19 (Stanley Park) from W Pender St, or walk along Coal Harbour", minutes: "10 by bus / 25 walking", cost: "$3.50", taxi: "≈$10", from: "Waterfront Station Vancouver", to: "Stanley Park Seawall Coal Harbour" }),
      stop({ time: "16:30", place: "Stanley Park Seawall", what: "Walk the seawall past the totem poles at Brockton Point toward Lions Gate Bridge (bike rentals on Denman St if you prefer).", best: "Late afternoon into golden hour — softest light on the harbour.", mapQuery: "Stanley Park Seawall Vancouver" }),
      leg({ mode: "walk", route: "Seawall around to Third Beach / English Bay", minutes: "45", cost: "Free", from: "Brockton Point Vancouver", to: "English Bay Beach Vancouver", travelmode: "walking" }),
      stop({ time: "18:30", place: "English Bay Beach", what: "Sunset from the beach by the Inukshuk.", best: "Be there 20 min before sunset (18:50 tonight).", mapQuery: "English Bay Beach Vancouver" }),
      leg({ mode: "walk", route: "Walk east along Davie St (or bus 6)", minutes: "25 walking / 10 by bus", cost: "Free / $3.50", taxi: "≈$10", from: "English Bay Beach Vancouver", to: "Nuba 508 Davie St Vancouver", travelmode: "walking" }),
      stop({ time: "19:30", place: "Nuba (Yaletown)", what: "Halal Lebanese dinner — mezze and grills.", mapQuery: "Nuba 508 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-02",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "North Shore: Capilano & Grouse Mountain",
    steps: [
      stop({ time: "08:45", place: "Canada Place", what: "Free Capilano shuttle pickup (runs every ~30 min, year-round).", mapQuery: "Canada Place Vancouver" }),
      leg({ mode: "shuttle", route: "Free Capilano Suspension Bridge shuttle", minutes: "25", cost: "Free", taxi: "≈$30–35, 20 min", from: "Canada Place Vancouver", to: "Capilano Suspension Bridge Park", travelmode: "driving" }),
      stop({ time: "09:30", place: "Capilano Suspension Bridge Park", what: "The bridge, Treetops Adventure and the Cliffwalk.", best: "Right at opening — tour buses arrive from ~11:00.", mapQuery: "Capilano Suspension Bridge Park" }),
      leg({ mode: "bus", route: "Bus 236 north on Capilano Rd → Grouse Mountain (last stop)", minutes: "5–10", cost: "$3.50", taxi: "≈$10", from: "Capilano Suspension Bridge Park", to: "Grouse Mountain Skyride" }),
      stop({ time: "12:00", place: "Grouse Mountain", what: "Skyride gondola up for views over the city and the harbour. Bring a halal wrap — the mountain restaurants aren't halal.", best: "Only on a clear day — check the Grouse webcam first. Cloudy? Swap for Lynn Canyon (below).", mapQuery: "Grouse Mountain Skyride" }),
      leg({ mode: "bus", route: "Bus 236 → Lonsdale Quay, then SeaBus → Waterfront", minutes: "25 + 12", cost: "≈$5 (2 zones before 6:30 pm)", taxi: "≈$40, 25 min", from: "Grouse Mountain Skyride", to: "Waterfront Station Vancouver" }),
      stop({ time: "16:00", place: "Hotel", what: "Rest before dinner." }),
      leg({ mode: "skytrain", route: "Canada Line → Yaletown–Roundhouse", minutes: "5", cost: "$3.50", taxi: "≈$10", from: "Waterfront Station Vancouver", to: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver" }),
      stop({ time: "19:30", place: "Moltaqa (Yaletown)", what: "Halal Moroccan dinner — tagine or couscous. Fridays have live oud; book ahead.", mapQuery: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver", food: true }),
    ],
    tips: [
      "Free alternative to Capilano + Grouse: Lynn Canyon Park — SeaBus to Lonsdale Quay, bus 228 to Lynn Valley Rd, then a 15-min walk. Its suspension bridge is free.",
    ],
  },
  {
    date: "2026-10-03",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "Granville Island, Gastown & Queen Elizabeth Park",
    steps: [
      stop({ time: "09:00", place: "Hornby St Aquabus dock", what: "Little rainbow ferries across False Creek.", mapQuery: "Aquabus Hornby Street Dock Vancouver" }),
      leg({ mode: "ferry", route: "Aquabus → Granville Island", minutes: "5", cost: "≈$5", taxi: "≈$12", from: "Aquabus Hornby Street Dock Vancouver", to: "Granville Island Public Market", travelmode: "walking" }),
      stop({ time: "09:15", place: "Granville Island Public Market", what: "Market halls, artisan shops, harbour seals by the docks.", best: "9–11 am, before the weekend crowds.", mapQuery: "Granville Island Public Market Vancouver" }),
      leg({ mode: "bus", route: "Bus 50 → Granville & Hastings, then walk east through Gastown", minutes: "30", cost: "$3.50", taxi: "≈$12, 10 min", from: "Granville Island Public Market", to: "Gastown Steam Clock Vancouver" }),
      stop({ time: "11:45", place: "Gastown & the Steam Clock", what: "Cobblestones and the steam clock (it whistles every 15 min).", best: "On the quarter-hour for the whistle.", mapQuery: "Gastown Steam Clock Vancouver" }),
      leg({ mode: "walk", route: "Walk down Carrall St to Chinatown", minutes: "8", cost: "Free", from: "Gastown Steam Clock Vancouver", to: "Dr. Sun Yat-Sen Classical Chinese Garden", travelmode: "walking" }),
      stop({ time: "12:15", place: "Dr. Sun Yat-Sen Classical Chinese Garden", what: "Ming-style scholar's garden — 45 min is enough.", best: "Midday; lovely even in rain.", mapQuery: "Dr. Sun Yat-Sen Classical Chinese Garden Vancouver" }),
      leg({ mode: "walk", route: "Walk to W Hastings St", minutes: "10", cost: "Free", from: "Dr. Sun Yat-Sen Classical Chinese Garden", to: "Nuba 207 W Hastings St Vancouver", travelmode: "walking" }),
      stop({ time: "13:15", place: "Nuba (Gastown)", what: "Halal lunch.", mapQuery: "Nuba 207 W Hastings St Vancouver", food: true }),
      leg({ mode: "skytrain", route: "Canada Line Waterfront → King Edward, then walk 10 min uphill", minutes: "25", cost: "$3.50", taxi: "≈$18, 15 min", from: "Waterfront Station Vancouver", to: "Bloedel Conservatory Queen Elizabeth Park Vancouver" }),
      stop({ time: "15:00", place: "Queen Elizabeth Park & Bloedel Conservatory", what: "Quarry gardens, the city's highest viewpoint, and the bird-filled dome (open 10–17).", best: "Mid-afternoon — the lookout faces north to downtown and the mountains.", mapQuery: "Bloedel Conservatory Queen Elizabeth Park Vancouver" }),
      leg({ mode: "skytrain", route: "Canada Line King Edward → downtown", minutes: "15", cost: "$3.50", taxi: "≈$18", from: "King Edward Station Vancouver", to: "Vancouver City Centre Station" }),
      stop({ time: "Evening", place: "Free evening", what: "Sunset 18:45. Optional: Manoush'eh (620 Davie, open until 22:00 Sat) for manousheh and knafeh.", mapQuery: "Manoush'eh 620 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-04",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "IASAM · Day 1",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      stop({ time: "18:00", place: "Coal Harbour & Canada Place", what: "Evening walk along the harbour: seaplanes, the Olympic Cauldron, North Shore mountains.", best: "Just before sunset (18:43).", mapQuery: "Vancouver Convention Centre Olympic Cauldron" }),
      leg({ mode: "walk", route: "Walk along Cordova St to Gastown", minutes: "12", cost: "Free", from: "Vancouver Convention Centre Olympic Cauldron", to: "Nuba 207 W Hastings St Vancouver", travelmode: "walking" }),
      stop({ time: "19:30", place: "Nuba (Gastown)", what: "Halal dinner.", mapQuery: "Nuba 207 W Hastings St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-05",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "IASAM · Day 2",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      leg({ mode: "bus", route: "Bus 5 or 6 → Davie & Denman", minutes: "15", cost: "$3.50", taxi: "≈$12", from: "Vancouver City Centre Station", to: "English Bay Beach Vancouver" }),
      stop({ time: "18:15", place: "English Bay", what: "Second chance at the sunset if day 1 was cloudy.", best: "Sunset 18:41.", mapQuery: "English Bay Beach Vancouver" }),
      leg({ mode: "walk", route: "Walk east on Davie St", minutes: "20", cost: "Free", from: "English Bay Beach Vancouver", to: "Manoush'eh 620 Davie St Vancouver", travelmode: "walking" }),
      stop({ time: "19:15", place: "Manoush'eh", what: "Halal Levantine dinner — open until 21:00 on Mondays.", mapQuery: "Manoush'eh 620 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-06",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "IASAM · Day 3",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      stop({ time: "Evening", place: "Seawall by bike", what: "Rent a bike on Denman St and ride the Seawall loop (~1 h) — or rest.", best: "Before dark — sunset is 18:39.", mapQuery: "Denman Street bike rental Vancouver" }),
      stop({ time: "20:00", place: "Dinner near Davie St", what: "Nuba (508 Davie) or Manoush'eh (620 Davie), both halal.", mapQuery: "Nuba 508 Davie St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-07",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "IASAM · Day 4",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Conference sessions." }),
      stop({ time: "19:30", place: "Moltaqa (Yaletown)", what: "Halal Moroccan dinner. Manoush'eh is closed Wednesdays, so this is the pick tonight.", mapQuery: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver", food: true }),
    ],
  },
  {
    date: "2026-10-08",
    city: "Vancouver",
    sunCity: "vancouver",
    title: "IASAM · Day 5 + Museum of Anthropology late opening",
    steps: [
      stop({ time: "Day", place: "IASAM event", what: "Last conference day." }),
      leg({ mode: "bus", route: "Bus R4 or 99 B-Line → UBC Exchange, then walk 10 min", minutes: "40", cost: "$3.50", taxi: "≈$30–35, 25 min", from: "Vancouver City Centre Station", to: "Museum of Anthropology at UBC" }),
      stop({ time: "17:30", place: "Museum of Anthropology at UBC", what: "The Great Hall of totem poles.", best: "Thursday — the only late night (open until 21:00). Closed Mondays.", mapQuery: "Museum of Anthropology at UBC Vancouver" }),
      leg({ mode: "bus", route: "99 B-Line / R4 back downtown", minutes: "40", cost: "$3.50", taxi: "≈$30–35", from: "UBC Exchange Vancouver", to: "Vancouver City Centre Station" }),
      stop({ time: "Night", place: "Pack", what: "Early flight tomorrow." }),
    ],
  },
  {
    date: "2026-10-09",
    city: "Vancouver → Montreal",
    sunCity: "montreal",
    title: "Fly to Montreal, Old Montreal by night",
    steps: [
      leg({ mode: "skytrain", route: "Canada Line → YVR-Airport (no AddFare in this direction)", minutes: "25", cost: "$3.50–5", taxi: "≈$35–46", from: "Vancouver City Centre Station", to: "YVR-Airport Station" }),
      stop({ time: "Morning", place: "YVR", what: "Be there 2 h before the (booked) flight via Calgary.", mapQuery: "Vancouver International Airport" }),
      leg({ mode: "flight", route: "YVR → Calgary (YYC) → Montréal–Trudeau (YUL)", minutes: "~1h20 + ~4h", cost: "Booked" }),
      leg({ mode: "bus", route: "747 bus → downtown (stops along René-Lévesque, ends at Berri-UQAM)", minutes: "45–70", cost: "$11.25 = 24 h pass (buy at the arrivals machine)", taxi: "Flat $49.45 (5 am–11 pm), ~30–40 min", from: "Montréal-Trudeau International Airport", to: "Berri-UQAM Station Montreal" }),
      stop({ time: "Afternoon", place: "Hotel", what: "Check in." }),
      leg({ mode: "metro", route: "Orange line → Place-d'Armes", minutes: "10–15", cost: "Covered by the 747 pass", taxi: "≈$12", from: "Berri-UQAM Station Montreal", to: "Place d'Armes Montreal" }),
      stop({ time: "18:00", place: "Old Montreal & Old Port", what: "Rue Saint-Paul, Place Jacques-Cartier, the riverfront.", best: "Dusk onward (sunset 18:19) — facades light up after dark.", mapQuery: "Place Jacques-Cartier Montreal" }),
      leg({ mode: "metro", route: "Orange line Place-d'Armes → Lionel-Groulx, green line → Guy-Concordia", minutes: "15", cost: "Covered by the 747 pass", taxi: "≈$12", from: "Place d'Armes Montreal", to: "Shawarmaz 1340 Saint-Catherine St W Montreal" }),
      stop({ time: "20:00", place: "Shawarmaz", what: "Halal shawarma dinner.", mapQuery: "Shawarmaz 1340 Saint-Catherine St W Montreal", food: true }),
    ],
    tips: ["Optional tonight: the AURA light show inside Notre-Dame Basilica (evenings, ≈$37, ~45 min)."],
  },
  {
    date: "2026-10-10",
    city: "Montreal → Toronto",
    sunCity: "montreal",
    title: "Notre-Dame, Mount Royal, then the night bus",
    steps: [
      stop({ time: "09:00", place: "Notre-Dame Basilica", what: "The blue-and-gold nave.", best: "First entry of the morning — quiet, and the light is best.", mapQuery: "Notre-Dame Basilica Montreal" }),
      leg({ mode: "walk", route: "Walk down to the waterfront", minutes: "5", cost: "Free", from: "Notre-Dame Basilica Montreal", to: "Pointe-à-Callière Montreal", travelmode: "walking" }),
      stop({ time: "10:00", place: "Pointe-à-Callière & Old Montreal", what: "The archaeology museum underground, then Rue Saint-Paul and Marché Bonsecours.", best: "Morning, before the Saturday crowds.", mapQuery: "Pointe-à-Callière Montreal" }),
      leg({ mode: "walk", route: "Back up to Notre-Dame St", minutes: "5", cost: "Free", from: "Pointe-à-Callière Montreal", to: "Restaurant Palki 56 Rue Notre-Dame O Montreal", travelmode: "walking" }),
      stop({ time: "12:30", place: "Restaurant Palki", what: "Halal Indian lunch.", mapQuery: "Restaurant Palki 56 Rue Notre-Dame O Montreal", food: true }),
      leg({ mode: "metro", route: "Place-d'Armes → Lionel-Groulx → Peel, then walk up Peel St to the stairs", minutes: "15 + 12 walk", cost: "Covered by the 747 pass until ~24 h", taxi: "≈$15 to the summit chalet", from: "Place d'Armes Montreal", to: "Kondiaronk Belvedere Mount Royal Montreal" }),
      stop({ time: "14:00", place: "Mount Royal — Kondiaronk lookout", what: "400 wooden steps up from Peel & Pine, then the classic skyline view.", best: "Clear afternoon: the sun lights up downtown from behind you.", mapQuery: "Kondiaronk Belvedere Mount Royal Montreal" }),
      leg({ mode: "walk", route: "Walk down and on to Crescent St", minutes: "30", cost: "Free", from: "Kondiaronk Belvedere Mount Royal Montreal", to: "Boustan 2020 Rue Crescent Montreal", travelmode: "walking" }),
      stop({ time: "16:00", place: "Boustan (Crescent St)", what: "Take-away shawarma for the bus, then collect your bags.", mapQuery: "Boustan 2020 Rue Crescent Montreal", food: true }),
      leg({ mode: "metro", route: "Orange line (toward Montmorency) → Cartier", minutes: "35–40", cost: "'All modes AB' ticket — Laval is zone B", taxi: "≈$35–45, 25–35 min", from: "Lionel-Groulx Station Montreal", to: "Terminus Cartier 40 Boulevard des Laurentides Laval" }),
      stop({ time: "17:40", place: "Terminus Cartier (Laval)", what: "FlixBus boards here — departure 18:20. Be there 30 min early.", mapQuery: "40 Boulevard des Laurentides, Laval, QC H7G 2S6" }),
      leg({ mode: "coach", route: "FlixBus Laval → Toronto Union Station (booked, overnight)", minutes: "18:20 → 05:05", cost: "$59.48 (paid)" }),
    ],
  },
  {
    date: "2026-10-11",
    city: "Toronto & Niagara",
    sunCity: "toronto",
    title: "Niagara Falls day trip, CN Tower at night",
    steps: [
      stop({ time: "05:05", place: "Union Station Bus Terminal", what: "Arrive. Freshen up, breakfast, drop bags at a luggage-storage spot near Union (book ahead — you'll be out ~15 h).", mapQuery: "Union Station Bus Terminal 81 Bay St Toronto" }),
      leg({ mode: "train", route: "GO train 07:45 Lakeshore West → Burlington (09:08), connect to GO bus 12B (09:15) → Niagara Falls Bus Terminal 10:15", minutes: "2 h 30", cost: "≈$22 — ask for the GO + WEGO combo", note: "Earlier: 06:40 train + bus → 09:35. Direct train: 09:04 → 11:30 (Sunday timetable, June 2026).", from: "Union Station Toronto", to: "Niagara Falls Bus Terminal 4555 Erie Ave" }),
      leg({ mode: "bus", route: "WEGO bus from the terminal toward Table Rock", minutes: "25", cost: "WEGO day pass $16 (or in the combo)", taxi: "≈$20, 10 min", from: "Niagara Falls Bus Terminal 4555 Erie Ave", to: "Table Rock Centre Niagara Falls" }),
      stop({ time: "10:45", place: "Horseshoe Falls & Journey Behind the Falls", what: "Table Rock viewpoint at the brink, then the tunnels behind the falls (open ~9–19). Wear a waterproof layer.", best: "Late morning, before the midday crowd.", mapQuery: "Journey Behind the Falls Niagara" }),
      leg({ mode: "walk", route: "Promenade along the Niagara Parkway, north to the cruise dock", minutes: "25", cost: "Free", from: "Table Rock Centre Niagara Falls", to: "Niagara City Cruises 5920 Niagara Parkway", travelmode: "walking" }),
      stop({ time: "12:45", place: "Niagara City Cruises boat", what: "20 minutes into the mist at the base of the falls (daily through Nov 30).", best: "Midday sun makes rainbows in the spray.", mapQuery: "Niagara City Cruises Niagara Falls" }),
      leg({ mode: "walk", route: "Up Clifton Hill to Victoria Ave", minutes: "10", cost: "Free", from: "Niagara City Cruises 5920 Niagara Parkway", to: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls", travelmode: "walking" }),
      stop({ time: "13:45", place: "Casablanca", what: "Halal lunch — kebab, shawarma.", mapQuery: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls", food: true }),
      stop({ time: "14:45", place: "Optional: Skylon Tower or Whirlpool Aero Car", what: "Skylon is 10 min away on foot; the Aero Car is 15 min north on WEGO.", mapQuery: "Skylon Tower Niagara Falls" }),
      leg({ mode: "taxi", route: "Taxi or WEGO to Niagara Falls GO station", minutes: "10 (taxi)", cost: "≈$15 taxi", from: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls", to: "Niagara Falls GO Station 4267 Bridge St", travelmode: "driving" }),
      leg({ mode: "train", route: "Direct GO train 16:02 → Union 18:24", minutes: "2 h 20", cost: "≈$22", note: "Later direct trains: 20:00 → 22:23, 22:02 → 00:25 (too late for the airport).", from: "Niagara Falls GO Station 4267 Bridge St", to: "Union Station Toronto" }),
      stop({ time: "18:30", place: "Paramount Fine Foods (Union Station)", what: "Halal dinner in the food court (open until 21:00).", mapQuery: "Paramount Fine Foods Union Station Toronto", food: true }),
      leg({ mode: "walk", route: "SkyWalk from Union to the CN Tower", minutes: "10", cost: "Free", from: "Union Station Toronto", to: "CN Tower Toronto", travelmode: "walking" }),
      stop({ time: "19:30", place: "CN Tower", what: "Observation deck and glass floor (open until 22:30).", best: "After dark — sunset is 18:40, city lights by 19:15.", mapQuery: "CN Tower Toronto" }),
      leg({ mode: "train", route: "Collect bags → UP Express Union → Pearson (every 15 min)", minutes: "25", cost: "$12.35 ($9.25 PRESTO)", taxi: "Uber/taxi ≈$60–75, 30 min", note: "Aim for the ~23:00 train; the last one leaves Union at 01:00.", from: "Union Station Toronto", to: "Toronto Pearson Terminal 1" }),
      stop({ time: "23:30", place: "Pearson Terminal 1", what: "Find the FlixBus stop shown in your booking. Departure 01:20.", mapQuery: "Toronto Pearson Airport Terminal 1" }),
    ],
    tips: [
      "Oct 11 is Thanksgiving weekend: GO trains and the falls are busy — keep your GO + WEGO tickets on your phone.",
    ],
  },
  {
    date: "2026-10-12",
    city: "Toronto → Montreal",
    sunCity: "montreal",
    title: "Back in Montreal: Tunisian lunch, Plateau, Gardens of Light",
    steps: [
      leg({ mode: "coach", route: "FlixBus Pearson T1 → Laval Cartier (booked, overnight)", minutes: "01:20 → 11:00", cost: "$77.48 (paid)" }),
      leg({ mode: "metro", route: "Orange line Cartier → Sherbrooke", minutes: "30", cost: "'All modes AB' ticket", taxi: "≈$35–45", from: "Terminus Cartier 40 Boulevard des Laurentides Laval", to: "Sherbrooke Station Montreal" }),
      stop({ time: "11:45", place: "Hotel", what: "Drop bags, shower, laundry." }),
      stop({ time: "13:00", place: "El Mida", what: "Halal Tunisian lunch — kafteji, ojja, lablabi. It's Thanksgiving Monday: call ahead to check it's open.", mapQuery: "El Mida 3485 Avenue du Parc Montreal", food: true }),
      leg({ mode: "walk", route: "Walk east through the Plateau", minutes: "20", cost: "Free", from: "El Mida 3485 Avenue du Parc Montreal", to: "Carré Saint-Louis Montreal", travelmode: "walking" }),
      stop({ time: "14:30", place: "Plateau Mont-Royal", what: "Carré Saint-Louis, the outdoor staircases, Saint-Laurent Blvd murals.", best: "Afternoon — sun on the east-facing row houses.", mapQuery: "Carré Saint-Louis Montreal" }),
      leg({ mode: "metro", route: "Orange line Sherbrooke → Berri-UQAM, green line → Pie-IX", minutes: "25", cost: "$3.75 (or a 24 h pass $11.50)", taxi: "≈$18", from: "Sherbrooke Station Montreal", to: "Montreal Botanical Garden" }),
      stop({ time: "17:00", place: "Botanical Garden + Gardens of Light", what: "Walk the gardens in daylight, then the lanterns in the Chinese, Japanese and First Nations gardens (18:30–21:00).", best: "Arrive before sunset (18:13) and stay for dark.", mapQuery: "Montreal Botanical Garden" }),
      leg({ mode: "metro", route: "Green line Pie-IX → downtown", minutes: "20", cost: "$3.75", taxi: "≈$20", from: "Pie-IX Station Montreal", to: "Guy-Concordia Station Montreal" }),
      stop({ time: "21:00", place: "Boustan (Crescent St)", what: "Late halal dinner — open until 4 am.", mapQuery: "Boustan 2020 Rue Crescent Montreal", food: true }),
    ],
    tips: ["Thanksgiving Monday: museums like the Biodôme open (holiday Monday), but some shops keep holiday hours."],
  },
  {
    date: "2026-10-13",
    city: "Montreal",
    sunCity: "montreal",
    title: "Last morning & departure",
    steps: [
      leg({ mode: "metro", route: "Blue line → Côte-des-Neiges", minutes: "20", cost: "$3.75", taxi: "≈$15", from: "Berri-UQAM Station Montreal", to: "Saint Joseph's Oratory Montreal" }),
      stop({ time: "08:30", place: "Saint Joseph's Oratory", what: "Canada's largest church; free entry, city view from the terrace.", best: "Early morning — calm, before tour groups.", mapQuery: "Saint Joseph's Oratory Montreal" }),
      stop({ time: "10:30", place: "Jean-Talon Market (if time)", what: "Harvest-season stalls for last snacks (Jean-Talon métro).", best: "Mid-morning.", mapQuery: "Marché Jean-Talon Montreal" }),
      leg({ mode: "bus", route: "747 bus from downtown (René-Lévesque stops / Berri-UQAM) → YUL", minutes: "45–70", cost: "$11.25", taxi: "Flat $49.45, ~30–40 min", from: "Berri-UQAM Station Montreal", to: "Montréal-Trudeau International Airport" }),
      stop({ time: "3 h before", place: "Montréal–Trudeau (YUL)", what: "International check-in — be there 3 hours before your flight home.", mapQuery: "Montréal-Trudeau International Airport" }),
    ],
  },
];
