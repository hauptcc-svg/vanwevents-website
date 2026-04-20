import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

// Floating particle
function Particle({
  x,
  y,
  size,
  delay,
  opacity,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = ((frame + delay) % (fps * 8)) / (fps * 8);
  const yOffset = Math.sin(progress * Math.PI * 2) * 30;
  const alpha = opacity * (0.3 + Math.sin(progress * Math.PI * 2) * 0.7);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + yOffset,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `rgba(201, 168, 76, ${alpha})`,
        filter: "blur(1px)",
      }}
    />
  );
}

// Gold horizontal rule
function GoldRule({ delay }: { delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleX = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 30 },
  });

  return (
    <div
      style={{
        width: 80,
        height: 2,
        background: "linear-gradient(90deg, #A8873A, #E8C96A, #A8873A)",
        transformOrigin: "left center",
        transform: `scaleX(${scaleX})`,
      }}
    />
  );
}

export const HeroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Background shimmer
  const bgProgress = frame / durationInFrames;
  const gradientAngle = bgProgress * 20; // slow rotation

  // Ocean wave ripple
  const waveY = interpolate(Math.sin((frame / fps) * 0.5), [-1, 1], [-5, 5]);

  // Overall fade-in
  const globalFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out at end for seamless loop
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const masterAlpha = Math.min(globalFade, fadeOut);

  // Ship slide-in
  const shipX = spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, stiffness: 20 },
  });
  const shipRight = interpolate(shipX, [0, 1], [width * 0.6, width * 0.1]);

  // Text animations
  const titleOpacity = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [40, 80], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [70, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [70, 110], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Particles
  const particles = [
    { x: 120, y: 200, size: 4, delay: 0, opacity: 0.8 },
    { x: 340, y: 450, size: 3, delay: 30, opacity: 0.6 },
    { x: 580, y: 150, size: 5, delay: 60, opacity: 0.5 },
    { x: 820, y: 380, size: 3, delay: 20, opacity: 0.7 },
    { x: 1100, y: 250, size: 4, delay: 80, opacity: 0.6 },
    { x: 1400, y: 500, size: 3, delay: 45, opacity: 0.5 },
    { x: 1650, y: 180, size: 5, delay: 10, opacity: 0.8 },
    { x: 1850, y: 420, size: 3, delay: 55, opacity: 0.6 },
    { x: 240, y: 700, size: 4, delay: 35, opacity: 0.4 },
    { x: 700, y: 820, size: 3, delay: 70, opacity: 0.5 },
    { x: 1200, y: 750, size: 4, delay: 15, opacity: 0.6 },
    { x: 1600, y: 700, size: 3, delay: 90, opacity: 0.4 },
  ];

  return (
    <AbsoluteFill style={{ opacity: masterAlpha }}>
      {/* Deep ocean gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${135 + gradientAngle}deg, #001A4D 0%, #003087 40%, #00204A 70%, #001030 100%)`,
        }}
      />

      {/* Ocean shimmer overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(0,80,180,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0,48,135,0.4) 0%, transparent 50%)",
          transform: `translateY(${waveY}px)`,
        }}
      />

      {/* Subtle grid lines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Ship silhouette */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.2,
          right: shipRight,
          opacity: 0.12,
          transform: "scaleX(-1)",
        }}
      >
        <svg
          width="500"
          height="200"
          viewBox="0 0 500 200"
          fill="rgba(201,168,76,0.8)"
        >
          {/* Simplified ship hull */}
          <path d="M20 160 Q250 100 480 160 L480 180 Q250 190 20 180 Z" />
          {/* Superstructure */}
          <rect x="180" y="80" width="140" height="80" rx="4" />
          <rect x="210" y="50" width="80" height="35" rx="3" />
          <rect x="230" y="30" width="40" height="25" rx="2" />
          {/* Funnels */}
          <rect x="240" y="5" width="20" height="30" rx="3" />
          {/* Mast */}
          <line x1="250" y1="5" x2="250" y2="-20" stroke="rgba(201,168,76,0.8)" strokeWidth="3" />
          {/* Bow detail */}
          <path d="M20 160 Q0 155 10 170 L20 180 Z" />
        </svg>
      </div>

      {/* Bottom gradient for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,16,48,0.95) 0%, rgba(0,16,48,0.4) 50%, transparent 100%)",
        }}
      />

      {/* VanWEvents Branding */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 80,
        }}
      >
        {/* Eyebrow line */}
        <Sequence from={20}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
              opacity: titleOpacity,
            }}
          >
            <GoldRule delay={20} />
            <span
              style={{
                color: "#C9A84C",
                fontSize: 16,
                letterSpacing: "0.4em",
                fontFamily: "sans-serif",
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              Authorised MSC Cruises Reseller
            </span>
            <GoldRule delay={20} />
          </div>
        </Sequence>

        {/* Main title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 120,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            VANWEVENTS
          </div>
        </div>

        {/* Gold rule */}
        <div style={{ marginBottom: 24 }}>
          <GoldRule delay={60} />
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 24,
              fontFamily: "sans-serif",
              fontWeight: 300,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Premium MSC Cruise Collection
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
