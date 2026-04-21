export interface Cruise {
  slug: string;
  name: string;
  ship: string;
  destination: string;
  region: string;
  duration: string;
  priceFrom: string;
  highlights: string[];
  imageSrc: string;
  videoSrc?: string;
  posterSrc?: string;
  embarkation: string;
  badge?: string;
  blurb: string;
}

export const cruises: Cruise[] = [
  {
    slug: "east-africa",
    name: "East African Discovery",
    ship: "MSC Sinfonia",
    destination: "Mozambique, Madagascar & Reunion",
    region: "East Africa",
    duration: "11 nights",
    priceFrom: "R 18 500",
    highlights: [
      "Pristine Mozambique beaches",
      "Wild Madagascar wildlife",
      "Volcanic Reunion island",
      "Full-board dining",
    ],
    imageSrc: "/images/msc/east-africa.jpg",
    videoSrc: "/videos/cruises/east-africa.mp4",
    posterSrc: "/videos/cruises/east-africa-poster.jpg",
    embarkation: "Durban, South Africa",
    badge: "Most Popular",
    blurb: "Step aboard the MSC Sinfonia for an unforgettable 11-night journey through East Africa's most breathtaking destinations. From the powder-white beaches of Mozambique and the extraordinary wildlife of Madagascar, to the dramatic volcanic landscapes of Reunion — this voyage departs right from Durban's doorstep, making it the ultimate African adventure for South African travellers.",
  },
  {
    slug: "mediterranean",
    name: "Mediterranean Splendour",
    ship: "MSC Splendida",
    destination: "Italy, France, Spain & Malta",
    region: "Mediterranean",
    duration: "8 nights",
    priceFrom: "R 24 900",
    highlights: [
      "Iconic Amalfi coastline",
      "Monaco Grand Prix route",
      "Barcelona's Gothic Quarter",
      "Valletta, UNESCO World Heritage",
    ],
    imageSrc: "/images/msc/mediterranean.jpg",
    videoSrc: "/videos/cruises/mediterranean.mp4",
    posterSrc: "/videos/cruises/mediterranean-poster.jpg",
    embarkation: "Genoa, Italy",
    badge: "New Route",
    blurb: "Sail the legendary Mediterranean aboard the luxurious MSC Splendida, visiting four iconic countries in 8 unforgettable nights. Explore the dramatic Amalfi coastline, follow Monaco's Grand Prix route, immerse yourself in Barcelona's vibrant Gothic Quarter, and wander the UNESCO-listed streets of Valletta — a seamless blend of history, world-class cuisine, and stunning coastal beauty.",
  },
  {
    slug: "greek-islands",
    name: "Greek Island Odyssey",
    ship: "MSC Musica",
    destination: "Athens, Santorini, Mykonos & Rhodes",
    region: "Greek Islands",
    duration: "7 nights",
    priceFrom: "R 21 500",
    highlights: [
      "Santorini's volcanic caldera",
      "Mykonos nightlife & beaches",
      "Ancient ruins of Athens",
      "Rhodes medieval old town",
    ],
    imageSrc: "/images/msc/greek-islands.jpg",
    videoSrc: "/videos/cruises/greek-islands.mp4",
    posterSrc: "/videos/cruises/greek-islands-poster.jpg",
    embarkation: "Piraeus, Greece",
    blurb: "Discover the timeless magic of Greece's most celebrated islands on this 7-night odyssey aboard the elegant MSC Musica. Walk in the footsteps of ancient civilisations in Athens, marvel at Santorini's famous volcanic caldera, soak up the sun on Mykonos's famous beaches, and explore the medieval old town of Rhodes — a journey that brings mythology to life.",
  },
  {
    slug: "caribbean",
    name: "Western Caribbean Escape",
    ship: "MSC Seashore",
    destination: "Jamaica, Cayman Islands & Mexico",
    region: "Caribbean",
    duration: "7 nights",
    priceFrom: "R 28 900",
    highlights: [
      "Jamaica's Blue Mountains",
      "Stingray City, Grand Cayman",
      "Mayan ruins of Cozumel",
      "Ocean Cay Private Island",
    ],
    imageSrc: "/images/msc/caribbean.jpg",
    videoSrc: "/videos/cruises/caribbean.mp4",
    posterSrc: "/videos/cruises/caribbean-poster.jpg",
    embarkation: "Miami, USA",
    badge: "Premium",
    blurb: "Escape to the turquoise waters of the Western Caribbean aboard the premium MSC Seashore. This 7-night voyage from Miami calls on Jamaica, the Cayman Islands, and Mexico's Yucatan coast. Whether you're swimming with stingrays at Stingray City, exploring ancient Mayan ruins at Cozumel, or relaxing on the pristine sands of Ocean Cay Private Island — pure Caribbean magic awaits.",
  },
  {
    slug: "arabian-gulf",
    name: "Arabian Gulf Luxury",
    ship: "MSC Virtuosa",
    destination: "Dubai, Abu Dhabi & Muscat",
    region: "Arabian Gulf",
    duration: "7 nights",
    priceFrom: "R 22 900",
    highlights: [
      "Dubai city tour & desert safari",
      "Ferrari World, Abu Dhabi",
      "Old Muscat souks & forts",
      "Luxury MSC Virtuosa ship",
    ],
    imageSrc: "/images/msc/arabian-gulf.jpg",
    videoSrc: "/videos/cruises/arabian-gulf.mp4",
    posterSrc: "/videos/cruises/arabian-gulf-poster.jpg",
    embarkation: "Dubai, UAE",
    blurb: "Experience the opulence of the Arabian Gulf aboard the world-class MSC Virtuosa on this 7-night luxury voyage. Marvel at Dubai's futuristic skyline, explore the grandeur of Ferrari World in Abu Dhabi, and wander through the ancient souks and forts of Muscat — a journey that perfectly balances cutting-edge modern luxury with the timeless allure of Arabian culture.",
  },
  {
    slug: "northern-europe",
    name: "Northern Europe Explorer",
    ship: "MSC Preziosa",
    destination: "Norway, Iceland & Scotland",
    region: "Northern Europe",
    duration: "14 nights",
    priceFrom: "R 34 500",
    highlights: [
      "Norwegian fjords by ship",
      "Northern Lights (seasonal)",
      "Edinburgh castle & whisky",
      "Iceland's geysers & waterfalls",
    ],
    imageSrc: "/images/msc/northern-europe.jpg",
    videoSrc: "/videos/cruises/northern-europe.mp4",
    posterSrc: "/videos/cruises/northern-europe-poster.jpg",
    embarkation: "Southampton, UK",
    badge: "Bucket List",
    blurb: "A true bucket-list voyage — 14 awe-inspiring nights aboard the MSC Preziosa through some of the world's most dramatic scenery. Glide through Norway's majestic fjords, chase the Northern Lights in Iceland, discover Edinburgh's legendary castle and whisky culture, and stand before Iceland's erupting geysers and thundering waterfalls. This is adventure travel at its most refined.",
  },
];

export function getCruiseBySlug(slug: string): Cruise | undefined {
  return cruises.find((c) => c.slug === slug);
}

/** Parse priceFrom string (e.g. "R 18 500") to a plain number */
export function parsePriceZAR(priceFrom: string): number {
  return parseInt(priceFrom.replace(/[R\s,]/g, ""), 10);
}

/** Return the 33% instalment-1 deposit in ZAR for a given cruise name */
export function getDepositZAR(cruiseName: string): number {
  const cruise = cruises.find((c) => c.name === cruiseName);
  if (!cruise) return 1500; // fallback for "Custom Voyage"
  return Math.round(parsePriceZAR(cruise.priceFrom) * 0.33);
}

/** Format a ZAR amount as "R X,XXX" */
export function formatZAR(amount: number): string {
  return `R ${amount.toLocaleString("en-ZA")}`;
}
