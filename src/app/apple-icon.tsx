import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1614",
          color: "#f6f1ea",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "0.01em",
          }}
        >
          PBP
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 13,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#a89c8b",
          }}
        >
          Piece by Piece
        </div>
      </div>
    ),
    { ...size },
  );
}
