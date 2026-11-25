import type { MetadataRoute } from "next";
import { listStotrams } from "@/lib/stotrams";
import { stotramPath, versePath } from "@/lib/seo";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, priority: 1 },
    ...listStotrams().flatMap((s) => [
      { url: `${SITE.url}${stotramPath(s)}`, priority: 0.9 },
      ...s.verses.map((v) => ({ url: `${SITE.url}${versePath(s, v)}`, priority: 0.7 })),
    ]),
  ];
}
