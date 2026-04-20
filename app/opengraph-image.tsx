import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VanWEvents — Premium MSC Cruise Packages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #001A4D 0%, #003087 50%, #001A4D 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Gold corner accents */}
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 60, height: 2, background: "#C9A84C" }} />
          <div style={{ width: 2, height: 60, background: "#C9A84C" }} />
        </div>
        <div style={{ position: "absolute", bottom: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ width: 2, height: 60, background: "#C9A84C" }} />
          <div style={{ width: 60, height: 2, background: "#C9A84C" }} />
        </div>

        {/* Logo mark */}
        <div
          style={{
            width: 70,
            height: 70,
            border: "2px solid #C9A84C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#C9A84C", fontSize: 40, fontWeight: 700 }}>V</span>
        </div>

        {/* Brand name */}
        <div style={{ color: "#FFFFFF", fontSize: 64, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8 }}>
          VANWEVENTS
        </div>

        {/* Gold rule */}
        <div style={{ width: 80, height: 2, background: "#C9A84C", marginBottom: 24 }} />

        {/* Tagline */}
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 26, fontFamily: "sans-serif", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Premium MSC Cruise Collection
        </div>

        {/* Sub */}
        <div style={{ color: "rgba(201,168,76,0.7)", fontSize: 18, fontFamily: "sans-serif", marginTop: 16, letterSpacing: "0.05em" }}>
          vanwevents.co.za · South Africa
        </div>
      </div>
    ),
    { ...size }
  );
}
