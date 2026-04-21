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
    blurb: "Step aboard the MSC Sinfonia for an unforgettable 11-night journey through East Africa's most breathtaking destinations. From the powder-white beaches of Mozambique and the extraordinary wildlife of Madagascar, to the dramatic volcanic landscapes of Réunion — this voyage departs right from Durban's doorstep, making it the ultimate African adventure for South African travellers.",
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
    blurb: "Escape to the turquoise waters of the Western Caribbean aboard the premium MSC Seashore. This 7-night voyage from Miami calls on