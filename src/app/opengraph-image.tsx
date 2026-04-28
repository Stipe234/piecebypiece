import { ImageResponse } from "next/og";

export const alt = "Piece by Piece, Minimalist Everyday Jewellery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          background:
            "linear-gradient(180deg, #f6f1ea 0%, #ece3d6 60%, #d9c8b3 100%)",
          color: "#1a1614",
          fontFamily: "serif",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 300,
            letterSpacing: "0.02em",
            lineHeight: 1.05,
          }}
        >
          Piece by Piece
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: "#3a322d",
            maxWidth: 880,
            lineHeight: 1.4,
          }}
        >
          Minimalist, everyday jewellery, worn and built over time.
        </div>
        <div
          style={{
            marginTop: 60,
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6b5d4f",
          }}
        >
          piecebypiecewear.com
        </div>
      </div>
    ),
    { ...size },
  );
}
