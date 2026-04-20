import { Composition } from "remotion";
import { HeroVideo } from "./HeroVideo";
import { CruiseCard } from "./CruiseCard";

// Cruise compositions config — one per destination
const cruiseCompositions = [
  {
    id: "cruise-east-africa",
    destination: "East Africa",
    shipName: "MSC Sinfonia",
    duration: "11 nights",
    region: "East Africa",
    imageSrc: "images/msc/east-africa.jpg",
    priceFrom: "R 18 500",
  },
  {
    id: "cruise-mediterranean",
    destination: "Mediterranean",
    shipName: "MSC Splendida",
    duration: "8 nights",
    region: "Mediterranean",
    imageSrc: "images/msc/mediterranean.jpg",
    priceFrom: "R 24 900",
  },
  {
    id: "cruise-greek-islands",
    destination: "Greek Islands",
    shipName: "MSC Musica",
    duration: "7 nights",
    region: "Greek Islands",
    imageSrc: "images/msc/greek-islands.jpg",
    priceFrom: "R 21 500",
  },
  {
    id: "cruise-caribbean",
    destination: "Caribbean",
    shipName: "MSC Seashore",
    duration: "7 nights",
    region: "Caribbean",
    imageSrc: "images/msc/caribbean.jpg",
    priceFrom: "R 28 900",
  },
  {
    id: "cruise-arabian-gulf",
    destination: "Arabian Gulf",
    shipName: "MSC Virtuosa",
    duration: "7 nights",
    region: "Arabian Gulf",
    imageSrc: "images/msc/arabian-gulf.jpg",
    priceFrom: "R 22 900",
  },
  {
    id: "cruise-northern-europe",
    destination: "Northern Europe",
    shipName: "MSC Preziosa",
    duration: "14 nights",
    region: "Northern Europe",
    imageSrc: "images/msc/northern-europe.jpg",
    priceFrom: "R 34 500",
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Hero video: 1920x1080, 15 seconds at 30fps */}
      <Composition
        id="HeroVideo"
        component={HeroVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Individual cruise card videos: 800x450, 6 seconds at 30fps */}
      {cruiseCompositions.map((cruise) => (
        <Composition
          key={cruise.id}
          id={cruise.id}
          component={CruiseCard}
          durationInFrames={180}
          fps={30}
          width={800}
          height={450}
          defaultProps={{
            destination: cruise.destination,
            shipName: cruise.shipName,
            duration: cruise.duration,
            region: cruise.region,
            imageSrc: cruise.imageSrc,
            priceFrom: cruise.priceFrom,
          }}
        />
      ))}
    </>
  );
};
