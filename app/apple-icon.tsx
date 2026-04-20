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
          background: "#001A4D",
          border: "6px solid #C9A84C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            color: "#C9A84C",
            fontSize: 90,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          V
        </span>
        <span
          style={{
            color: "rgba(201,168,76,0.6)",
            fontSize: 14,
            fontFamily: "sans-serif",
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
