// Central trip data: FX rate is approximate and fluctuates — shown as a live-ish reference, not a guarantee.
import photos from "./photos.json";

// Free-licensed Wikimedia Commons images, fetched into public/places/ with their attribution.
export type PhotoId = keyof typeof photos;
export interface Photo {
  src: string;
  width: number;
  height: number;
  credit: string;
  license: string;
  source: string;
  caption?: string;
}
export function getPhoto(id: PhotoId): Photo {
  return photos[id];
}

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
  photo: PhotoId;
}

export interface Activity {
  name: string;
  description: string;
  priceCad: number | "Free";
  tier: PriceTier;
  durationHrs: number;
  mapQuery: string;
  photo: PhotoId;
  best: string; // best time of day / week to go
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
        photo: "stanley-park-seawall",
        best: "Late afternoon into golden hour; mornings are quietest.",
      },
      {
        name: "Gastown & Granville Island",
        description: "Historic cobblestone streets, the steam clock, and the public market on the island.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Granville Island Public Market Vancouver",
        photo: "granville-island",
        best: "9–11 am, before the crowds (market opens 9:00).",
      },
      {
        name: "English Bay Beach at sunset",
        description: "West End beach with the Inukshuk and the best sunset spot downtown — pairs with the Seawall.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 1,
        mapQuery: "English Bay Beach Vancouver",
        photo: "english-bay",
        best: "20 min before sunset (≈18:30–18:50 in early Oct).",
      },
      {
        name: "Lynn Canyon Park suspension bridge",
        description: "The free alternative to Capilano: a suspension bridge 50 m over a canyon, plus forest trails and swimming holes.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Lynn Canyon Park Suspension Bridge North Vancouver",
        photo: "lynn-canyon",
        best: "Weekday mornings — the bridge gets busy by midday.",
      },
      {
        name: "Deep Cove & Quarry Rock hike",
        description: "Short forest hike (~3.8 km return) to a granite lookout over Indian Arm. Reachable by bus from downtown.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Quarry Rock Trail Deep Cove North Vancouver",
        photo: "deep-cove",
        best: "Early morning or a clear weekend morning; trail is muddy after rain.",
      },
      {
        name: "Queen Elizabeth Park & Bloedel Conservatory",
        description: "The city's highest point, with gardens and skyline views; the domed conservatory has 100+ free-flying birds.",
        priceCad: 9,
        tier: "budget",
        durationHrs: 2,
        mapQuery: "Bloedel Conservatory Queen Elizabeth Park Vancouver",
        photo: "queen-elizabeth-park",
        best: "Mid-afternoon on a clear day; conservatory open 10–17.",
      },
      {
        name: "Dr. Sun Yat-Sen Classical Chinese Garden",
        description: "Ming-dynasty-style scholar's garden in Chinatown — quiet, compact and beautiful in the rain.",
        priceCad: 16,
        tier: "budget",
        durationHrs: 1,
        mapQuery: "Dr. Sun Yat-Sen Classical Chinese Garden Vancouver",
        photo: "sun-yat-sen-garden",
        best: "Midday; beautiful in the rain too.",
      },
      {
        name: "Museum of Anthropology at UBC",
        description: "Northwest Coast First Nations totem poles and carvings in an Arthur Erickson glass hall.",
        priceCad: 25,
        tier: "budget",
        durationHrs: 2,
        mapQuery: "Museum of Anthropology at UBC Vancouver",
        photo: "moa-ubc",
        best: "Thursday evening (open until 21:00). Closed Mondays.",
      },
      {
        name: "Vancouver Aquarium",
        description: "Marine life exhibits in Stanley Park — good rainy-day option.",
        priceCad: 32,
        tier: "budget",
        durationHrs: 2,
        mapQuery: "Vancouver Aquarium",
        photo: "vancouver-aquarium",
        best: "Opening time (10:00) on a rainy day. Open 10–17 in October.",
      },
      {
        name: "Capilano Suspension Bridge + Grouse Mountain combo",
        description: "Suspension bridge through the canopy, then the gondola up Grouse Mountain for city views.",
        priceCad: 248,
        tier: "splurge",
        durationHrs: 6,
        mapQuery: "Capilano Suspension Bridge Park",
        photo: "capilano",
        best: "Right at opening, before tour buses (~11:00).",
      },
    ] as Activity[],
    food: [
      {
        name: "Nuba",
        type: "Lebanese",
        halal: true,
        priceCad: "$15–25 CAD/person",
        priceTnd: "≈45–75 TND",
        note: "Lebanese spot where all meats are halal — mezze, falafel, shawarma plates. Locations in Gastown (207 W Hastings) and Yaletown (508 Davie).",
        mapQuery: "Nuba 508 Davie St Vancouver",
        photo: "dish-falafel",
      },
      {
        name: "Moltaqa",
        type: "Moroccan",
        halal: true,
        priceCad: "$25–40 CAD/person",
        priceTnd: "≈75–120 TND",
        note: "Michelin-recommended, fully halal Moroccan in Yaletown (1002 Mainland St) — tagines and couscous. Oud music Fri & Sun; book ahead.",
        mapQuery: "Moltaqa Moroccan Restaurant 1002 Mainland St Vancouver",
        photo: "dish-tajine",
      },
      {
        name: "Manoush'eh",
        type: "Levantine bakery",
        halal: true,
        priceCad: "$10–18 CAD/person",
        priceTnd: "≈30–55 TND",
        note: "Certified-halal, family-run: stone-baked za'atar & cheese manousheh, knafeh, Arabic breakfast. 620 Davie St. Closed Wednesdays.",
        mapQuery: "Manoush'eh 620 Davie St Vancouver",
        photo: "dish-manakish",
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
        photo: "cn-tower",
        best: "After dark for the city lights (sunset ≈18:40 on Oct 11). Open 8:30–22:30.",
      },
      {
        name: "Distillery District",
        description: "Car-free Victorian-era streets, galleries, cafés and shops.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Distillery District Toronto",
        photo: "distillery-district",
        best: "Late afternoon, when the lights come on.",
      },
      {
        name: "Kensington Market",
        description: "Colourful, eclectic neighbourhood of vintage shops, street art and food stalls next to Chinatown.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Kensington Market Toronto",
        photo: "kensington-market",
        best: "Late morning to mid-afternoon, when the stalls are open.",
      },
      {
        name: "Toronto Islands ferry",
        description: "15-min ferry from the foot of Bay St — the best skyline view in the city, plus beaches and bike paths.",
        priceCad: 9,
        tier: "budget",
        durationHrs: 3,
        mapQuery: "Jack Layton Ferry Terminal Toronto",
        photo: "toronto-islands",
        best: "Late afternoon — the skyline view at sunset from Centre Island.",
      },
      {
        name: "Royal Ontario Museum",
        description: "Dinosaurs, world cultures and the crystal-shaped Michael Lee-Chin wing.",
        priceCad: 26,
        tier: "budget",
        durationHrs: 3,
        mapQuery: "Royal Ontario Museum Toronto",
        photo: "rom",
        best: "Right at opening; allow 3 h.",
      },
      {
        name: "Casa Loma",
        description: "Early-1900s Gothic Revival castle with towers, secret passages and gardens.",
        priceCad: 45,
        tier: "moderate",
        durationHrs: 2,
        mapQuery: "Casa Loma Toronto",
        photo: "casa-loma",
        best: "Morning, before the tour groups.",
      },
      {
        name: "Ripley's Aquarium of Canada",
        description: "Walk-through shark tunnel at the foot of the CN Tower — easy to combine with it.",
        priceCad: 49,
        tier: "moderate",
        durationHrs: 2,
        mapQuery: "Ripley's Aquarium of Canada Toronto",
        photo: "ripleys-aquarium",
        best: "Evening, combined with the CN Tower next door.",
      },
      {
        name: "Horseshoe Falls viewpoint",
        description: "Free public viewpoints along Niagara Parkway looking straight at the falls.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 1,
        mapQuery: "Table Rock Niagara Falls",
        photo: "horseshoe-falls",
        best: "Morning for fewer crowds; after dark the falls are lit up.",
      },
      {
        name: "Journey Behind the Falls + Niagara City Cruises boat",
        description: "Tunnels behind the curtain of water, plus a boat ride right up to the base.",
        priceCad: 65,
        tier: "moderate",
        durationHrs: 3,
        mapQuery: "Journey Behind the Falls Niagara",
        photo: "niagara-boat",
        best: "Midday sun makes rainbows in the spray.",
      },
      {
        name: "Whirlpool Aero Car",
        description: "Antique cable car suspended over the Niagara Whirlpool, 4.5 km downstream of the falls.",
        priceCad: 22,
        tier: "budget",
        durationHrs: 1,
        mapQuery: "Whirlpool Aero Car Niagara Falls",
        photo: "whirlpool-aero-car",
        best: "Afternoon, on a dry, calm day.",
      },
      {
        name: "Skylon Tower (optional)",
        description: "Observation deck with a direct falls view, revolving restaurant on top.",
        priceCad: 23,
        tier: "budget",
        durationHrs: 1,
        mapQuery: "Skylon Tower Niagara Falls",
        photo: "skylon-tower",
        best: "Just before sunset, or after dark for the illuminated falls.",
      },
      {
        name: "Niagara-on-the-Lake",
        description: "Preserved 19th-century town ~25 km north along the Niagara Parkway. Needs a car or tour — only if time allows.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Queen Street Niagara-on-the-Lake",
        photo: "niagara-on-the-lake",
        best: "Only with a car or tour — late afternoon is loveliest.",
      },
    ] as Activity[],
    food: [
      {
        name: "Paramount Fine Foods — Union Station",
        type: "Lebanese/Middle Eastern",
        halal: true,
        priceCad: "$12–20 CAD/person",
        priceTnd: "≈35–60 TND",
        note: "HMA-certified halal, in the Union Station food court (65 Front St W) — right where the bus arrives. Open 10:00–21:00.",
        mapQuery: "Paramount Fine Foods Union Station Toronto",
        photo: "dish-hummus",
      },
      {
        name: "Paramount Fine Foods — First Canadian Place",
        type: "Lebanese/Middle Eastern",
        halal: true,
        priceCad: "$12–20 CAD/person",
        priceTnd: "≈35–60 TND",
        note: "Downtown financial district location, HMA-certified.",
        mapQuery: "Paramount Fine Foods First Canadian Place Toronto",
        photo: "dish-shish-taouk",
      },
      {
        name: "Naan Kabob",
        type: "Afghan",
        halal: true,
        priceCad: "$15–25 CAD/person",
        priceTnd: "≈45–75 TND",
        note: "100% halal, family-run Afghan: kebabs, Kabuli palaw, warm naan. 691 Yonge St, near Bloor–Yonge station.",
        mapQuery: "Naan Kabob 691 Yonge St Toronto",
        photo: "dish-kabuli-palaw",
      },
      {
        name: "Karahi Boys — Queen West",
        type: "Pakistani",
        halal: true,
        priceCad: "$18–30 CAD/person",
        priceTnd: "≈55–90 TND",
        note: "Fully halal; famous for chicken karahi and charcoal BBQ. 741 Queen St W.",
        mapQuery: "Karahi Boys 741 Queen St W Toronto",
        photo: "dish-karahi",
      },
      {
        name: "Casablanca — Niagara Falls",
        type: "Middle Eastern & grill",
        halal: true,
        priceCad: "$15–25 CAD/person",
        priceTnd: "≈45–75 TND",
        note: "Halal shish kebab, shawarma and pizza a short walk from Clifton Hill (5930 Victoria Ave) — lunch on the Niagara day.",
        mapQuery: "Casablanca Halal Restaurant 5930 Victoria Ave Niagara Falls",
        photo: "dish-shish-kebab",
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
        photo: "notre-dame",
        best: "First entry of the morning (Sunday opens only from 12:30).",
      },
      {
        name: "Old Montreal & the Old Port",
        description: "Cobblestone streets, 17th–19th century architecture, and the riverfront promenade.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 3,
        mapQuery: "Old Montreal",
        photo: "old-montreal",
        best: "Dusk onward, when the facades are lit.",
      },
      {
        name: "Mount Royal lookout",
        description: "Panoramic city view from the Kondiaronk Belvedere, in the park Frederick Law Olmsted designed after Central Park.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Kondiaronk Belvedere Mount Royal Montreal",
        photo: "mount-royal",
        best: "Clear afternoon: the sun lights downtown from behind you.",
      },
      {
        name: "Saint Joseph's Oratory",
        description: "Canada's largest church, on the west slope of Mount Royal — 283 steps up to a huge domed basilica.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 1.5,
        mapQuery: "Saint Joseph's Oratory Montreal",
        photo: "st-joseph-oratory",
        best: "Early morning — calm, before tour groups.",
      },
      {
        name: "Plateau Mont-Royal & its outdoor staircases",
        description: "Colourful row houses, Saint-Laurent Boulevard murals and cafés — Montreal's most walkable neighbourhood.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Plateau Mont-Royal Montreal",
        photo: "plateau",
        best: "Afternoon walk, then dinner nearby.",
      },
      {
        name: "Jean-Talon Market",
        description: "Huge open-air market in Little Italy — October is peak harvest season (apples, pumpkins, maple).",
        priceCad: "Free",
        tier: "free",
        durationHrs: 1.5,
        mapQuery: "Marché Jean-Talon Montreal",
        photo: "jean-talon",
        best: "Mid-morning, especially weekends in harvest season.",
      },
      {
        name: "Lachine Canal path",
        description: "Flat 14 km bike/walk path from the Old Port past Atwater Market. BIXI bikes available along the way.",
        priceCad: "Free",
        tier: "free",
        durationHrs: 2,
        mapQuery: "Lachine Canal National Historic Site Montreal",
        photo: "lachine-canal",
        best: "Afternoon bike ride, ending at Atwater Market.",
      },
      {
        name: "Montreal Botanical Garden",
        description: "One of the world's largest botanical gardens; in autumn the Chinese Garden hosts the lantern-lit Gardens of Light.",
        priceCad: 25,
        tier: "budget",
        durationHrs: 3,
        mapQuery: "Montreal Botanical Garden",
        photo: "botanical-garden",
        best: "Late afternoon, then stay for the Gardens of Light (from 18:30).",
      },
      {
        name: "Biodôme",
        description: "Four ecosystems under one roof in the old Olympic velodrome — next door to the Botanical Garden.",
        priceCad: 25,
        tier: "budget",
        durationHrs: 2,
        mapQuery: "Biodôme de Montréal",
        photo: "biodome",
        best: "Morning. Closed Mondays, except holiday Mondays (Oct 12 is one).",
      },
      {
        name: "Pointe-à-Callière museum",
        description: "Archaeology museum built over Montreal's birthplace — walk through the original foundations underground.",
        priceCad: 27,
        tier: "budget",
        durationHrs: 2,
        mapQuery: "Pointe-à-Callière Montreal",
        photo: "pointe-a-calliere",
        best: "Morning, before the Old Montreal crowds.",
      },
    ] as Activity[],
    food: [
      {
        name: "Shawarmaz",
        type: "Middle Eastern",
        halal: true,
        priceCad: "$10–18 CAD/person",
        priceTnd: "≈30–55 TND",
        note: "Fully halal-certified shawarma, generous portions. 1340 Saint-Catherine St W, downtown.",
        mapQuery: "Shawarmaz 1340 Saint-Catherine St W Montreal",
        photo: "dish-shawarma",
      },
      {
        name: "El Mida",
        type: "Tunisian",
        halal: true,
        priceCad: "$18–30 CAD/person",
        priceTnd: "≈55–90 TND",
        note: "A taste of home: halal Tunisian — kafteji, ojja, lablabi, couscous. The menu rotates every two weeks. 3485 Av. du Parc.",
        mapQuery: "El Mida 3485 Avenue du Parc Montreal",
        photo: "dish-lablabi",
      },
      {
        name: "Boustan — Crescent St",
        type: "Lebanese",
        halal: true,
        priceCad: "$10–18 CAD/person",
        priceTnd: "≈30–55 TND",
        note: "Montreal institution since 1986, everything halal — shawarma pitas and famous garlic potatoes. 2020 Crescent St, open very late.",
        mapQuery: "Boustan 2020 Rue Crescent Montreal",
        photo: "dish-toum",
      },
      {
        name: "Restaurant Palki",
        type: "Indian",
        halal: true,
        priceCad: "$20–35 CAD/person",
        priceTnd: "≈60–105 TND",
        note: "Halal Indian in the middle of Old Montreal (56 Notre-Dame St W) — steps from the Basilica.",
        mapQuery: "Restaurant Palki 56 Rue Notre-Dame O Montreal",
        photo: "dish-butter-chicken",
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
    afternoon: "Rest, laundry, light walk in Old Montreal. Oct 12 is Thanksgiving Monday — some shops and museums keep holiday hours.",
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
