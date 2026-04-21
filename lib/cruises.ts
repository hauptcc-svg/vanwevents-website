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
}

export const cruises: Cruise[] = [
  {
    slug: "east-africa",
    name: "East African Discovery",
    ship: "MSC Sinfonia",
    destination: "Mozambique, Madagascar & Réunion",
    region: "East Africa",
    duration: "11 nights",
    priceFrom: "R 18 500",
    highlights: [
      "Pristine Mozambique beaches",
      "Wild Madagascar wildlife",
      "Volcanic Réunion island",
      "Full-board dining",
    ],
    imageSrc: "/images/msc/east-africa.jpg",
    videoSrc: "/videos/cruises/east-africa.mp4",
    posterSrc: "/videos/cruises/east-africa-poster.jpg",
    embarkation: "Durban, South Africa",
    badge: "Most Popular",
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
