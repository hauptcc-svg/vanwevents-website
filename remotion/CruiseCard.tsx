import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
} from "remotion";

export interface CruiseCardProps {
  destination?: string;
  shipName?: string;
  duration?: string;
  region?: string;
  imageSrc?: string;
  priceFrom?: string;
}

export const CruiseCard: React.FC<CruiseCardProps> = ({
  destination = "Destination",
  shipName = "MSC Ship",
  duration = "7 nights",
  region = "Region",
  imageSrc,
  priceFrom,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in/out for loop
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const alpha = Math.min(fadeIn, fadeOut);

  // Ken Burns effect on image
  const imageScale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  // Overlay darkening animation
  const overlayOpacity = interpolate(frame, [0, 30], [0.4, 0.75], {
    extrapolateRight: "clamp",
  });

  // Region badge slide in
  const regionSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  // Destination text
  const destOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const destY = interpolate(frame, [20, 50], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ship name
  const shipOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gold rule
  const ruleScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 20, stiffness: 40 },
  });

  // Corner accents
  const cornerOpacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: alpha, overflow: "hidden" }}>
      {/* Background image with Ken Burns */}
      {imageSrc ? (
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imageScale})`,
            transformOrigin: "center center",
          }}
        />
      ) : (
        /* Fallback gradient */
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(135deg, #001A4D 0%, #003087 50%, #001A4D 100%)",
          }}
        />
      )}

      {/* Overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to top, rgba(0,26,77,${overlayOpacity + 0.2}) 0%, rgba(0,26,77,${overlayOpacity}) 50%, rgba(0,48,135,0.2) 100%)`,
        }}
      />

      {/* Corner gold accents */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          opacity: cornerOpacity,
        }}
      >
        <div style={{ width: 40, height: 2, background: "#C9A84C" }} />
        <div style={{ width: 2, height: 40, background: "#C9A84C", marginTop: -2 }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          opacity: cornerOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div style={{ width: 2, height: 40, background: "#C9A84C" }} />
        <div style={{ width: 40, height: 2, background: "#C9A84C", marginTop: -2 }} />
      </div>

      {/* Region chip */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          opacity: regionSpring,
          transform: `translateX(${interpolate(regionSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.5)",
            color: "#C9A84C",
            fontSize: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            fontWeight: 500,
            padding: "4px 12px",
          }}
        >
          {region}
        </div>
      </div>

      {/* Bottom content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 32px 32px",
        }}
      >
        {/* Destination */}
        <div
          style={{
            opacity: destOpacity,
            transform: `translateY(${destY}px)`,
            fontFamily: "Georgia, serif",
            fontSize: 44,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          {destination}
        </div>

        {/* Gold rule */}
        <div
          style={{
            width: 50,
            height: 2,
            background: "linear-gradient(90deg, #A8873A, #E8C96A)",
            transformOrigin: "left center",
            transform: `scaleX(${ruleScale})`,
            marginBottom: 12,
          }}
        />

        {/* Ship & duration */}
        <div style={{ opacity: shipOpacity }}>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 16,
              fontFamily: "sans-serif",
              fontWeight: 400,
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            {shipName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontFamily: "sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {duration}
            </span>
            {priceFrom && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>·</span>
                <span
                  style={{
                    color: "#C9A84C",
                    fontSize: 16,
                    fontFamily: "Georgia, serif",
                    fontWeight: 600,
                  }}
                >
                  From {priceFrom}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
