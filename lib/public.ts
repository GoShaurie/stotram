import type { Stotram, Verse } from "./schema";

// What the website ships. Modern references (dictionaries, commentaries, editions, websites) stay in the
// data for the checks and provenance, but the site cites only ancient texts (`sources[].ancient`), so
// they're stripped here, along with research-only fields no page renders.
export function publicSources(s: Stotram): Stotram["sources"] {
  return s.sources.filter((src) => src.ancient);
}

export function publicVerse(verse: Verse, s: Stotram): Verse {
  const ancient = new Set(publicSources(s).map((src) => src.id));
  return {
    ...verse,
    padas: undefined,
    adhyahara: undefined,
    anvaya: undefined,
    lock: undefined,
    review: { status: verse.review.status },
    annotations: verse.annotations?.map((a) => ({ ...a, citations: a.citations?.filter((c) => ancient.has(c.source)) })),
    compounds: verse.compounds
      ? Object.fromEntries(Object.entries(verse.compounds).map(([id, c]) => [id, { ...c, note: undefined }]))
      : undefined,
    words: Object.fromEntries(
      Object.entries(verse.words).map(([id, w]) => [
        id,
        {
          ...w,
          sources: w.sources.filter((src) => ancient.has(src)),
          notes: undefined,
          alternatives: undefined,
          sandhi: undefined,
          components: w.components.map((c) => ({ ...c, root: undefined, formation: undefined })),
        },
      ]),
    ),
  };
}
