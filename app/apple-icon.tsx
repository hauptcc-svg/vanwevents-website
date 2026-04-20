import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #E91E8C 0%, #FF6B35 100%)",
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 100,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          V
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 16,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          VWE
        </span>
      </div>
    ),
    { ...size }
  );
}
