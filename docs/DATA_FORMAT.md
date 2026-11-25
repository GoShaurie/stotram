# Data Format: Stotram Source File

**Current version: `0.3.0`** · Living document. Update it whenever the format changes and add a changelog entry at the bottom.

One JSON file per stotram, stored at `data/stotrams/<id>.json`. This single file is the **only** thing needed to add a stotram to the site. Everything the UI shows (both languages, hover mapping, word details) comes from it.

Reference example: [`data/stotrams/shiva-tandava-stotram.json`](../data/stotrams/shiva-tandava-stotram.json) (verse 1 fully worked, including annotations).

The file has **three layers**:
- **Word layer** (`lines`, `words`, `compounds`, `translations`): what the reader sees and hovers. Display words, split, roots, meaning.
- **Pada layer** (`padas`, `adhyahara`, `anvaya`; new in 0.3): the grammar, in machine-checkable form. Post-sandhi units with morphology, syntactic role and head; this is what the form-generation, agreement and meter checks verify.
- **Annotation layer** (`annotations`, `about`, `faq`, `credits`, `relationships`): what a phrase *means and why*. Story, allusion, wordplay, sound, theology, with citations.
Enforced by: the Zod schema [`lib/schema.ts`](../lib/schema.ts) (the single schema, also exported as JSON Schema to `checks/schema.json` with `npm run schema`), cross-references in [`scripts/validate.mjs`](../scripts/validate.mjs), and quality checks in [`checks/`](../checks) ([QUALITY_CHECKS.md](QUALITY_CHECKS.md)).

---

## What changed from the PRD example, and why

| PRD example | v0.1 | Why |
|---|---|---|
| One object per verse, `title` repeated | One file per stotram with `verses[]` | Metadata lives once; one file = one stotram matches the "single source file" requirement |
| `translation_lines` in English only | `translations.en` / `translations.hi`, same shape | The EN/HI toggle reads from the same structure |
| `meaning` etc. as English strings | Localized objects `{ "en": …, "hi": … }` | Word panel must also switch language |
| `ref_id` (single) | `refs` (array) | A phrase can translate several words ("streams of falling water" ← galat + jala + pravāha), and a word can appear in several phrases (Hindi "गले में … धारण करके") |
| Danda inside word text (`"भुजङ्गतुङ्गमालिकाम् \|"`) | `line.end: "।"` | Words stay clean for lookup and indexing; uses real Devanagari dandas |
| No transliteration | `iast` on every word and component | Learners and SEO ("jatatavi galajjala…") |
| `padacheda` as a free string | `padaccheda[]` + `sandhi[]` with rule and explanation | The UI can animate the split and teach the rule |
| `root` / `root_type` / `grammar` as free strings | `components[]` with `root` (dhātu vs prātipadika, gaṇa, prefixes), and a structured `grammar` with enums | Enables filters, cross-stotram word index, and grammar lessons |
| Every token labelled as if a full word (e.g. w1 "Feminine") | `compounds` group; members get `pos: "compound-member"` | Fix: in *jaṭāṭavī-galaj-jala-pravāha-pāvita-sthale* only the last member has a case ending. Teaching this is the point |
| w5 mapped to the English word "and" | Every segment carries real meaning | "and" isn't in the Sanskrit; padding words go into the nearest meaningful segment |
| None | `confidence`, `sources`, `alternatives`, `review` | Data quality is the product's differentiator: every claim is traceable and reviewable |
| None | `concepts` + `verse.concepts` | Serves the "how is God described" goal and deity categorisation |

---

## Top level

```jsonc
{
  "schema_version": "0.3.0",
  "language": "sa",                        // sa | awa (Awadhi) | bra (Braj) | hi
  "tradition": { "id": "shaiva", "note": {…} },   // optional; school-specific readings are attributed against this (T4.5)
  "id": "shiva-tandava-stotram",          // kebab-case, == file name, == URL slug
  "type": "stotram",                       // stotram | mantra | bhajan | sukta | ashtakam | chalisa | …
  "title": { "sa": "…", "iast": "…", "en": "…", "hi": "…" },
  "deities": ["shiva"],                    // ids from a shared deity list (Phase 2)
  "attribution": { "en": "…", "hi": "…" }, // traditional author, hedged where uncertain
  "meter": { "id": "pancacamara", "name": "pañcacāmara", "description": { "en": "…", "hi": "…" } },  // id → data/meters.json
  "summary": { "en": "…", "hi": "…" },        // one or two plain sentences (cards, meta description)
  "about": { "en": "rich text", "hi": "…" },   // Genius "About": what it is, origin, why it matters; links into annotations
  "tags": ["shiva", "tandava", "mahashivaratri"],
  "credits": [ { "role": "composer", "value": {…}, "note": {…}, "sources": ["…"] } ],
  "faq": [ { "id": "who-wrote", "q": {…}, "a": { "en": "rich text", "hi": "…" }, "sources": ["…"] } ],
  "relationships": [ { "type": "same-meter", "target": "<stotram-id>", "name": {…}, "note": {…} } ],
  "concepts": { "<concept-id>": {
    "name": {…}, "description": {…},                 // description may use rich text (*italics*, links)
    "story": {…},                                     // optional: the myth or teaching behind the theme (rich text, ≤ ~900 chars)
    "story_citations": [ { "source": "valmiki-ramayana", "locator": "Bālakāṇḍa 42–44" } ],
    "echoes": [ {                                     // optional: famous lines elsewhere on the same theme
      "text": "नागेन्द्रहाराय त्रिलोचनाय …", "lang": "sa", "iast": "nāgendrahārāya …",
      "meaning": {…}, "source": "shiva-panchakshara", "locator": "verse 1"
    } ]
  } },
  "sources": [ { "id": "…", "name": "…", "kind": "ai|text|commentary|dictionary|website|scholar", "url": "…", "note": "…", "ancient": true } ],
  "verses": [ … ]
}
```

## Verse

```jsonc
{
  "id": "v1", "number": 1,
  "kind": "verse",                // verse | phalashruti | dhyana | refrain
  "meter": "vasantatilaka",       // optional: meter id when this verse's meter differs from the stotram's
  "concepts": ["damaru", "tandava"],
  "lines": [                      // display lines of the original text (usually = pādas or half-verses)
    { "words": [ { "id": "w1", "text": "जटाटवी", "iast": "jaṭāṭavī" } ], "end": "।", "pada_count": 1 }   // pada_count: metrical pādas on the line; optional meter_irregular: "why it doesn't scan" (0.3.5)
  ],
  "compounds": { "c1": { "members": ["w1","w2","w3"], "iast": "…", "type": "karmadhāraya", "subtype": "…",
                         "structure": "((((jaṭā-aṭavī)-(galat-(jala-pravāha)))-pāvita)-sthala)", "vigraha": "…", "meaning": {…}, "note": {…} } },
  "padas": [ { "id": "p1", "words": ["w1","w2","w3"], "sa": "…", "iast": "…", "morph": {…}, "role": "samānādhikaraṇa", "head": "p2" } ],
  "adhyahara": [ { "id": "x1", "sa": "सः", "iast": "saḥ", "morph": {…}, "role": "viśeṣaṇa", "head": "p12", "meaning": {…} } ],
  "anvaya": ["p7", "p6", "p1", …, "x1", "p12", "p11", "p13", "p10"],
  "translations": {
    "en": { "lines": [ [ { "refs": ["w3"], "text": "On the spot made holy" } ] ], "bhavartha": "free-flowing meaning" },
    "hi": { "lines": [ … ], "bhavartha": "…" }
  },
  "annotations": [ { "id": "a1", "refs": ["w1","w2","w3"], "kind": "mythology", "body": {…}, "citations": [ … ], "confidence": "high" } ],
  "words": { "w1": { /* word entry */ } },
  "lock": { "hash": "sha256:…", "sources": ["src-a","src-b","src-c"], "variants": [ … ], "confirmed_by": null },
  "review": { "status": "ai_draft", "history": [ { "date": "…", "by": "…", "action": "…" } ] }
}
```

Rules:
- Word ids are **verse-scoped** (`w1…wn`). Globally a word is `<stotram>/<verse>/<word>`, which is also its URL anchor.
- `text` is Devanagari only: letters, matras, virāma, avagraha (ऽ). No spaces, dandas or digits.
- Translation `lines` follow the source lines: the reader shows each one under the source line most of its words come from, so write one translation line per source line, in source order, even if that means reshaping the English (a main clause from the last pāda goes last). Hover mapping is still by `refs` only. The validator warns when lines are out of order or a source line gets no meaning.
- **Every word must be referenced by at least one segment in every language**, or hover would be dead on that word. A segment may also reference adhyāhāra ids (`x1`); a segment with only adhyāhāra refs is shown as supplied text.
- `lock` is written by `checks lock` once the text is established from ≥3 sources; `confirmed_by` is set only by a human. Nothing may change `lines` after that (T0.1).

## Pada (the grammar layer)

A **pada** is a syntactic unit after sandhi is undone, in its pausa form. One display word can hold several padas (`गलेऽवलम्ब्य` = `gale` + `avalambya`) and one pada can span several display words (a long compound). Every display word belongs to at least one pada.

```jsonc
{
  "id": "p8", "words": ["w9"], "sa": "चकार", "iast": "cakāra",
  "morph": { "type": "tinanta", "dhatu": { "sa": "कृ", "iast": "kṛ", "gana": 8 }, "lakara": "liṭ", "prayoga": "kartari",
             "person": 3, "number": "singular", "pada": "parasmaipada" },
  "role": "kriyā", "head": null
}
```

| `morph.type` | Fields |
|---|---|
| `subanta` | `stem {sa, iast}` (the prātipadika; for a compound, the whole compound stem), `gender` (omit only for asmad/yuṣmad), `case`, `number`, optional `krt {dhatu, prefixes, suffix}` for participles |
| `tinanta` | `dhatu {sa, iast, gana}`, `prefixes`, `sanadi` (ṇic · san · yaṅ · nāmadhātu), `lakara` (laṭ liṭ luṭ lṛṭ leṭ loṭ laṅ vidhiliṅ āśīrliṅ luṅ lṛṅ), `prayoga` (kartari · karmaṇi · bhāve), `person`, `number`, `pada` (parasmaipada · ātmanepada) |
| `avyaya` | optional `krt {dhatu, prefixes, suffix}` for absolutives and infinitives (ktvā, lyap, tumun…) |

- `role`: kriyā · kartā · karma · karaṇa · sampradāna · apādāna · adhikaraṇa · sambandha · sambodhana · viśeṣaṇa (adjective, agrees in gender/case/number) · samānādhikaraṇa (apposition, agrees in case) · kriyā-viśeṣaṇa · pūrvakāla (absolutive) · nipāta. `head` is the pada or adhyāhāra id it depends on; `null` only for kriyā, sambodhana and nipāta.
- `irregular: { "note": "…" }` marks a poetic/ārṣa form the generator can't reproduce; the checks then flag instead of fail.
- **Adhyāhāra** items are words the reader supplies (an implied *asti*, *namaḥ*, a correlative *saḥ*). They never appear in the text, are declared with their own morphology/role/head, and get their own translation segment.
- **Anvaya** lists every pada and adhyāhāra id exactly once, in prose order.

## Word entry

```jsonc
{
  "compound": "c1",                                     // optional: member of a compound group
  "padaccheda": [ { "sa": "जटा", "iast": "jaṭā" }, { "sa": "अटवी", "iast": "aṭavī" } ],
  "sandhi": [ { "name": "savarṇa-dīrgha", "rule": "ā + a → ā", "explanation": { "en": "…", "hi": "…" } } ],
  "components": [
    {
      "sa": "गलत्", "iast": "galat", "pos": "participle",
      "root": { "kind": "dhatu", "sa": "गल्", "iast": "gal", "gana": 1, "prefixes": [], "gloss": { "en": "to drip", "hi": "टपकना" } },
      "formation": "śatṛ (present active participle)",
      "sense": { "dict": "mw", "headword": "gal", "gloss": "to drip" },   // optional: the dictionary sense chosen (T4.2)
      "meaning": { "en": "falling", "hi": "गिरता हुआ" }
    }
  ],
  // no "grammar" here since 0.3: inflection lives on the padas; the word panel derives it from them
  "meaning": { "en": "…", "hi": "…" },                  // contextual meaning in this verse (lakṣyārtha)
  "literal": { "en": "…", "hi": "…" },                  // optional: vācyārtha, only where it differs (T4.3)
  "epithet": true,                                      // optional: a divine name/epithet; needs a derivation (T4.4)
  "notes": { "en": "…", "hi": "…" },                    // optional teaching / theological note
  "aside": { "en": "…", "hi": "…" },                    // optional: one or two lines shown at the end of the word card (≤220 chars)
  "alternatives": [ { "reading": { "en": "…", "hi": "…" }, "note": "…" } ],  // competing interpretations
  "confidence": "high",                                 // high | medium | low
  "sources": ["ai-draft"]                               // ids from top-level sources
}
```

## Annotation (Genius-style note on a phrase)

```jsonc
{
  "id": "a3",                          // verse-scoped; permalink anchor is #<verse-id>-<id>, e.g. #v1-a3
  "refs": ["w7", "w8"],                // contiguous words in reading order (may cross a line break)
  "kind": "sound",                     // context | mythology | wordplay | sound | theology | grammar | variant | cross-reference
  "body": { "en": "rich text", "hi": "rich text" },
  "citations": [ { "source": "nandikeshvara-kashika", "locator": "verse 1", "quote": "nṛttāvasāne…" } ],
  "confidence": "high"
}
```

Rules:
- A word belongs to **at most one** annotation (no overlaps), like Genius referents.
- Not every phrase needs a note. Annotate where there is something a reader wouldn't get from the word meanings alone: a story, an allusion, wordplay, a sound effect, a theological claim, a variant reading, an echo of another text.
- Word-level facts (split, root, case) belong in the word entry, not the annotation. The annotation may *use* them to make a point (e.g. why *liṭ* matters here).
- Body length: aim for 50–80 words (about 300–450 characters, like verse 1 of Śiva Tāṇḍava): one hook, one insight, at most two short paragraphs. The validator warns above 500 characters. Depth comes from links.
- Every factual claim needs a citation with a **locator** (chapter/verse, sūtra number, page). Until a human has checked an AI-suggested locator against the actual text, say so in that source's `note`. The reviewer clears the note.

## Rich text

`about`, `faq[].a`, `credits[].note` and `annotations[].body` use a tiny markdown subset (rendered by `lib/markdown.tsx`, never as raw HTML):

| Syntax | Use |
|---|---|
| blank line | new paragraph |
| `> text` | quotation of a primary text (Sanskrit in IAST or Devanagari) |
| `*italic*`, `**bold**` | Sanskrit terms, titles; emphasis |
| `[text](#v1-a3)` | link to an annotation (verse id + annotation id) |
| `[text](#verse-2)` | link to a verse |
| `[text](#faq-who-wrote)` | link to a Q&A |
| `[text](concept:damaru)` / `[text](source:valmiki-ramayana)` | link to a concept / a source |
| `[text](https://…)` | external link (https only) |

The validator checks every internal link resolves.

## Credits, Q&A, relationships

| Field | Values | Notes |
|---|---|---|
| `credits[].role` | composer · text · meter · language · recension · commentary · recording | `text` = the scripture/collection it is found in. Hedge attributions in `value` ("traditional attribution") and explain in `note` |
| `faq[]` | `id`, `q`, `a`, `sources` | Real questions people search ("People also ask"). Short answer, then link to the annotation that goes deeper. Emitted as FAQPage JSON-LD |
| `relationships[].type` | shares-text · same-meter · same-deity · companion · quotes · quoted-in | `target` = stotram id when it's in the library (validator warns otherwise) |

## Review status (publish gate)

| Status | Meaning | Publishable |
|---|---|---|
| `ai_draft` | Generated by AI, unchecked | no |
| `ai_verified` | Passed automated cross-checks (sources agree, grammar tools agree) | no |
| `reviewed` | A human has checked every word | **yes** |
| `scholar_approved` | A Sanskrit scholar has signed off | **yes** (badge in UI) |

`--publish` also requires at least one non-AI source in the file.

## Conventions
- Transliteration: **IAST** (ā ī ū ṛ ṝ ḷ ṃ ḥ ṅ ñ ṭ ḍ ṇ ś ṣ). Anusvāra written as in the source text.
- Sanskrit technical terms in IAST inside English text (*tatpuruṣa*, *liṭ*).
- Hindi in Devanagari, natural modern Hindi, not Sanskritised word salad.
- Dates are ISO `YYYY-MM-DD`.

## Planned (not yet in the format)
- `audio`: `{ src, words: { w1: [start, end] } }` for karaoke highlight
- Per-annotation review state and contributor attribution (Genius-style accepted/verified), once there is a community layer
- `language` at the top level (`sa`, `awa` for Awadhi, …) with grammar fields optional for non-Sanskrit texts
- Shared registries: `data/deities.json`, `data/concepts.json` (so concepts are reused across stotrams), `data/sources.json`
- Per-field source attribution (currently per word)
- Generated JSON Schema / Zod types from one definition

## Changelog
- **0.3.5** (2026-11-24): optional `lines[].meter_irregular` (plain string, data only): why a line doesn't scan when every witness has the same reading (e.g. Rudrāṣṭakam 7a, *na yāvad umā°*). T3.1 then flags the line for a human instead of failing it. The validator rejects an empty note.
- **0.3.4** (2026-11-18): optional `concepts.*.story` (rich text, en/hi), `story_citations` and `echoes` (famous lines from other stotrams, scripture and pre-modern bhajans on the same theme: `text` exactly as printed, `lang`, `iast` for Sanskrit, `meaning` en/hi, `source`, `locator`). Shown on the theme cards; a story citation or echo appears only when its source is `ancient`. Concept descriptions may now use rich text. The validator checks echo/story sources and warns on a story over 900 characters or a Sanskrit echo without IAST.
- **0.3.3** (2026-11-17): optional `words.*.aside` (en/hi, ≤220 chars), shown at the end of the word card. A thin story card that adds little goes here as a line or two instead. Rich-text links may target a verse (`#verse-2`).
- **0.3.2** (2026-11-17): optional `sources[].ancient`. The site shows only ancient Hindu texts (the hymn itself, itihāsa, śāstra) in citations and the sources list; dictionaries (Monier-Williams), commentaries like vyakhya.org, printed editions and websites stay in the data for the checks and provenance but aren't rendered.
- **0.3.1** (2026-11-17): translation `lines` should follow the source lines (one per source line, in order); the reader now shows each meaning line under its source line, with annotation highlights carried over. Validator warns on out-of-order or missing lines. No shape change. Annotation bodies tightened: the validator now warns above 500 characters (was 900).
- **0.3.0** (2026-10-20): the pada layer, for the quality checks. Added `language`, `tradition`, `meter.id` (→ `data/meters.json`), `lines[].pada_count`, `padas` (morphology, role, head), `adhyahara`, `anvaya`, `lock`, compound `type` enum + `subtype` + `structure`, component `sense`, word `literal` and `epithet`. **Removed** `words.*.grammar` and `components[].grammar` (grammar now lives once, on padas; free-text grammar notes moved to `notes`). Translation segments may reference adhyāhāra ids. Verses may override the stotram meter with `meter` (added during the full run: the closing phalaśruti is in vasantatilakā). The Zod schema is now the single schema: the validator runs it, and it's exported as JSON Schema for the Python checks.
- **0.2.0** (2026-10-19): Genius-style annotation layer. Added `about`, `tags`, `credits`, `faq`, `relationships`, `sources[].note`, `verse.annotations` and the rich-text subset. All new fields are optional, but the validator warns when `about` or a verse's annotations are missing. `schema_version` must be `0.2.x`.
- **0.1.0** (2026-10-19): first version, derived from the PRD example. See the table at the top.
