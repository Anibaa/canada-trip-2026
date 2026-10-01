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

// Signature local dishes — halal notes because not all of them are halal everywhere.
export interface LocalDish {
  name: string;
  what: string;
  halalNote: string;
  where: string;
  mapQuery: string;
  photo: PhotoId;
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
    localFood: [
      {
        name: "Candied wild salmon",
        what: "BC's smoky-sweet salmon strips, cured with maple or brown sugar — the snack locals bring home.",
        halalNote: "Fish, so generally fine — check the glaze has no wine or rum.",
        where: "Longliner Seafoods, Granville Island Public Market",
        mapQuery: "Longliner Seafoods Granville Island Public Market",
        photo: "food-candied-salmon"
      },
      {
        name: "Nanaimo bar",
        what: "No-bake layered bar — chocolate-coconut crumb, custard buttercream, chocolate top. Named after a BC town.",
        halalNote: "No meat; ask if a flavour uses gelatin.",
        where: "Northern Bars, Granville Island Public Market",
        mapQuery: "Northern Bars Granville Island Public Market",
        photo: "food-nanaimo-bar"
      },
      {
        name: "Honey-dip doughnut",
        what: "Hand-made classic from Lee's Donuts, a Granville Island institution since 1979.",
        halalNote: "Vegetarian; ask about the frying fat if you're strict.",
        where: "Lee's Donuts, Granville Island Public Market",
        mapQuery: "Lee's Donuts Granville Island",
        photo: "food-donut"
      }
    ] as LocalDish[],
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
    localFood: [
      {
        name: "Butter tart",
        what: "Ontario's classic: flaky pastry with a gooey butter-and-brown-sugar filling.",
        halalNote: "Some bakeries use lard in the pastry — ask for an all-butter one.",
        where: "Wanda's Pie in the Sky, 287 Augusta Ave (Kensington Market)",
        mapQuery: "Wanda's Pie in the Sky 287 Augusta Ave Toronto",
        photo: "food-butter-tart"
      },
      {
        name: "BeaverTails",
        what: "Hand-stretched fried dough shaped like a beaver's tail, topped with cinnamon sugar and lemon.",
        halalNote: "Vegetarian pastry — pick sweet toppings.",
        where: "BeaverTails, 4967 Clifton Hill, Niagara Falls",
        mapQuery: "BeaverTails 4967 Clifton Hill Niagara Falls",
        photo: "food-beavertails"
      },
      {
        name: "Timbits & a double-double",
        what: "Tim Hortons doughnut holes and a coffee with two creams, two sugars — Canada's daily ritual.",
        halalNote: "Timbits are vegetarian; a few flavours may contain gelatin — check the list in the app.",
        where: "Tim Hortons — there's one in Union Station",
        mapQuery: "Tim Hortons Union Station Toronto",
        photo: "food-timbits"
      }
    ] as LocalDish[],
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
    localFood: [
      {
        name: "Montreal bagel",
        what: "Boiled in honey water and baked in a wood-fired oven — smaller, denser and sweeter than a New York bagel.",
        halalNote: "Plain and sesame bagels are just dough; check any fillings.",
        where: "St-Viateur Bagel, 263 Saint-Viateur O (open 24 h)",
        mapQuery: "St-Viateur Bagel 263 Rue Saint-Viateur O Montreal",
        photo: "food-bagel"
      },
      {
        name: "Poutine",
        what: "Quebec's signature dish: fries, squeaky cheese curds and hot gravy.",
        halalNote: "Regular gravy is usually made with non-halal stock — order it at a halal place like Boustan.",
        where: "Boustan, 2020 Rue Crescent",
        mapQuery: "Boustan 2020 Rue Crescent Montreal",
        photo: "food-poutine"
      },
      {
        name: "Maple taffy & maple butter",
        what: "Quebec makes most of the world's maple syrup — try taffy, maple butter and maple candy.",
        halalNote: "Pure maple products are fine.",
        where: "Jean-Talon Market (maple stalls)",
        mapQuery: "Marché Jean-Talon Montreal",
        photo: "food-maple"
      }
    ] as LocalDish[],
  },
};

export const transportLegs: TransportLeg[] = [
  {
    from: "Tunis (TUN)",
    to: "Frankfurt (FRA)",
    mode: "Flight — booked",
    distanceKm: 1470,
    durationLabel: "Oct 1, 01:35 → 05:10 · AC9277",
    priceCad: "Booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Tunis-Carthage Airport to Frankfurt Airport"
  },
  {
    from: "Frankfurt (FRA)",
    to: "Vancouver (YVR)",
    mode: "Flight — booked",
    distanceKm: 8060,
    durationLabel: "Oct 1, 13:20 → 14:20 (~10h)",
    priceCad: "Booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Frankfurt Airport to Vancouver International Airport"
  },
  {
    from: "Vancouver (YVR)",
    to: "Calgary (YYC)",
    mode: "Flight — booked",
    distanceKm: 690,
    durationLabel: "Oct 8, 19:30 → 21:59 (~1h30)",
    priceCad: "Booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Vancouver International Airport to Calgary International Airport"
  },
  {
    from: "Calgary (YYC)",
    to: "Montréal (YUL)",
    mode: "Flight — booked",
    distanceKm: 3000,
    durationLabel: "Oct 9, 01:00 → 07:10 (~4h10, overnight)",
    priceCad: "Booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Calgary International Airport to Montreal Trudeau Airport"
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
    durationLabel: "Oct 11 · 07:45 → 10:15 (train + GO bus), back 16:02 → 18:24",
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
  {
    from: "Montréal (YUL)",
    to: "Rome (FCO)",
    mode: "Flight — booked",
    distanceKm: 6580,
    durationLabel: "Oct 12, 19:25 → Oct 13, 09:15 (~7h50, overnight)",
    priceCad: "Booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Montreal Trudeau Airport to Rome Fiumicino Airport"
  },
  {
    from: "Rome (FCO)",
    to: "Tunis (TUN)",
    mode: "Flight — booked",
    distanceKm: 580,
    durationLabel: "Oct 13, 17:00 → 17:20 (~1h20)",
    priceCad: "Booked",
    priceTnd: "—",
    booked: true,
    mapQuery: "Rome Fiumicino Airport to Tunis-Carthage Airport"
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
    city: "Tunis → Vancouver",
    title: "Fly in via Frankfurt",
    morning: "TUN 01:35 → FRA 05:10, FRA 13:20 → YVR 14:20.",
    afternoon: "Canada Line to Waterfront, check in at the Vancouver Harbourfront Hotel (1133 W Hastings St).",
    evening: "Coal Harbour seawall walk behind the hotel, dinner at Nuba Gastown (halal).",
    food: [cities.vancouver.food[0]],
    transport: "Flights booked · Canada Line YVR → Waterfront ≈$10–12",
  },
  {
    day: "Day 2–3",
    date: "Oct 2–3",
    city: "Vancouver",
    title: "Free days before the IAS Annual Meeting",
    morning: "Granville Island market (Fri Oct 2) · Capilano Suspension Bridge (Sat Oct 3, the driest day).",
    afternoon: "Jumu'ah at Al-Jamia, Chinatown & Gastown (Oct 2) · Grouse Mountain (Oct 3).",
    evening: "Moltaqa with live oud (Fri) · English Bay sunset and Nuba (Sat).",
    food: [cities.vancouver.food[1], cities.vancouver.food[2]],
  },
  {
    day: "Day 4–7",
    date: "Oct 4–7",
    city: "Vancouver",
    title: "IAS Annual Meeting — Vancouver Harbourfront Hotel",
    morning: "Sessions at your own hotel (1133 W Hastings St).",
    evening: "Coal Harbour, English Bay sunset, Seawall by bike — dry evenings forecast. See the Day guide.",
  },
  {
    day: "Day 8",
    date: "Oct 8",
    city: "Vancouver → Calgary",
    title: "Last IAS meeting day, evening flight",
    morning: "Check out, bags with the hotel concierge, last sessions.",
    afternoon: "Collect bags 16:30, Burrard station → Waterfront → Canada Line to YVR.",
    evening: "YVR 19:30 → YYC 21:59, connection, YYC 01:00 → YUL 07:10.",
    transport: "Flights booked",
  },
  {
    day: "Day 9",
    date: "Oct 9",
    city: "Montreal",
    title: "Land 07:10, full Montreal day",
    morning: "747 bus downtown, St-Viateur bagels, Jean-Talon Market.",
    afternoon: "Nap, Tunisian lunch at El Mida, Plateau walk.",
    evening: "Botanical Garden + Gardens of Light, dinner at Boustan.",
    food: [cities.montreal.food[1], cities.montreal.food[2]],
    transport: "747 bus $11.25 = 24 h métro/bus pass",
  },
  {
    day: "Day 10",
    date: "Oct 10",
    city: "Montreal → Toronto",
    title: "Notre-Dame + overnight bus",
    morning: "Notre-Dame Basilica, Old Montreal, Pointe-à-Callière.",
    afternoon: "Lunch at Palki, Mount Royal lookout.",
    evening: "18:20 FlixBus from Laval – Métro Cartier to Toronto (overnight).",
    food: [cities.montreal.food[3]],
    transport: "FlixBus Montreal → Toronto, $59.48 CAD",
  },
  {
    day: "Day 11",
    date: "Oct 11",
    city: "Toronto & Niagara",
    title: "Niagara Falls day trip, CN Tower at night",
    morning: "Arrive Union 05:05, GO train + bus 07:45 → Niagara 10:15, Journey Behind the Falls.",
    afternoon: "Boat cruise, lunch at Casablanca, GO train 16:02 → Union 18:24.",
    evening: "Dinner at Paramount (Union Station), CN Tower, UP Express to Pearson for the 01:20 bus.",
    food: [cities.toronto.food[4], cities.toronto.food[0]],
    transport: "GO Train Toronto ↔ Niagara ≈$22 each way · UP Express $12.35",
  },
  {
    day: "Day 12",
    date: "Oct 12",
    city: "Toronto → Montreal → Rome",
    title: "Night bus back, fly home 19:25",
    morning: "FlixBus arrives Laval 11:00, métro downtown.",
    afternoon: "Lunch at Shawarmaz, 747 bus to YUL by 16:00 (Thanksgiving Monday).",
    evening: "YUL 19:25 → Rome FCO 09:15 (+1).",
    food: [cities.montreal.food[0]],
    transport: "FlixBus Toronto → Montreal, $77.48 CAD · 747 bus $11.25",
  },
  {
    day: "Day 13",
    date: "Oct 13",
    city: "Rome → Tunis",
    title: "Home",
    morning: "Land Rome 09:15, connection.",
    afternoon: "FCO 17:00 → TUN 17:20.",
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
