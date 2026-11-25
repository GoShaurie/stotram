import type { Stotram, Verse } from "./schema";
import { SITE } from "./site";

export const stotramPath = (s: Stotram) => `/stotram/${s.id}`;
export const versePath = (s: Stotram, v: Verse) => `/stotram/${s.id}/verse/${v.number}`;

export function stotramJsonLd(s: Stotram) {
  const url = `${SITE.url}${stotramPath(s)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: s.title.en,
      alternateName: [s.title.sa, s.title.iast, s.title.hi],
      inLanguage: "sa",
      url,
      description: s.summary.en,
      about: s.deities,
      hasPart: s.verses.map((v) => ({
        "@type": "CreativeWork",
        name: `${s.title.en}, verse ${v.number}`,
        url: `${SITE.url}${versePath(s, v)}`,
      })),
    },
    breadcrumbs([
      ["Home", "/"],
      [s.title.en, stotramPath(s)],
    ]),
  ];
}

export function breadcrumbs(items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE.url}${path}`,
    })),
  };
}

// First line of the original text, for titles and descriptions ("jatatavi galajjala…").
export function verseIncipit(v: Verse) {
  const first = v.lines[0].words;
  return { sa: first.map((w) => w.text).join(" "), iast: first.map((w) => w.iast).join(" ") };
}

// Plain-text answers for FAQPage: markdown links and emphasis stripped.
export function faqJsonLd(s: Stotram) {
  const plain = (md: string) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*?([^*]+)\*\*?/g, "$1");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (s.faq ?? []).map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a.en) },
    })),
  };
}
