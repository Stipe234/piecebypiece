import { ImageResponse } from "next/og";

// 48px square is Google's recommended favicon size; browsers downscale it
// for the 16px tab.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1614",
          color: "#f6f1ea",
          fontFamily: "serif",
          fontSize: 19,
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}
      >
        PBP
      </div>
    ),
    { ...size },
  );
}
