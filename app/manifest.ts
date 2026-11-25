import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Web app manifest: lets phones install the site to the home screen (PWA).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: Understand what you chant`,
    short_name: SITE.name,
    description: SITE.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#000000",
    categories: ["books", "education", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
