import type { Annotation } from "./schema";

// Kinds whose single-word notes are read inside the word card, right under the word's meaning,
// instead of as a separate card in the rail. Notes on a phrase, a line or an idea stay in the rail.
const WORD_CARD_KINDS: Annotation["kind"][] = ["theology"];

export function isWordNote(a: Annotation): boolean {
  return a.refs.length === 1 && WORD_CARD_KINDS.includes(a.kind);
}
