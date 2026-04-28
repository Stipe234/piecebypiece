import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Piece by Piece",
    short_name: "Piece by Piece",
    description:
      "Minimalist, everyday jewellery designed to be worn and built over time.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: "#1a1614",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
