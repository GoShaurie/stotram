---
name: stotram-new
description: Add a whole new stotram, mantra or bhajan to the site end to end - text and recension (confirmed with the owner), the source file and registry entry, every verse through the /stotram-refine loop, then the stotram-level layer (theme cards with stories and famous lines, About, Q&A, credits) - following every owner preference in docs/EDITORIAL_GUIDE.md. Use when asked to "add", "create" or "start" a stotram, e.g. "/stotram-new Lingashtakam".
---

# /stotram-new <stotram name>

You orchestrate the whole run. Verse work is delegated to the existing loop (`/stotram-refine`, which uses the
`stotram-researcher`, `stotram-drafter` and `stotram-judge` agents). **You are the only one who writes
`data/stotrams/*.json`**, through the `checks` CLI or small scripted edits, one at a time.
`C` = `.venv/bin/python -m checks`, `F` = `data/stotrams/<id>.json`.

## The owner's preferences (read before starting; they apply to every phase)

`docs/EDITORIAL_GUIDE.md` is the source of truth. Read it in full first; if anything below differs, the guide wins.
The short version, so nothing is missed:

- **Reading:** one translation line per Sanskrit line, in source order. Highlights carry over, so keep segments tight.
- **Plain language:** words a 12-year-old knows; no grammar labels in visible text (no locative, bahuvrīhi, सप्तमी,
  विभक्ति…); say what the form *does*. Natural Hindi, not English glosses in Devanagari.
- **Word card:** word, IAST, meaning, split with one-word part meanings, story preview, `aside`, single-word
  theology note last. Name who is meant ("Him, i.e. Śiva"). No grammar/roots/confidence on the card.
- **Story cards:** must earn the card (story, layered meaning, picture, sense-changing variant); 300–450 chars; help
  the reader *see*; a thin card becomes a 1–2 line `aside`. A theology point on one word gets `refs: ["wN"]`.
- **Sources:** cite everything in the data, but only `ancient: true` sources are shown. Never name a modern source
  in visible text (Monier-Williams, vyakhya.org, Wikisource, Samskrit Academy…), including in public source `note`s.
- **No attributions** ("one commentary says…"). Tradition/school attribution only for interpretations, and **don't
  hedge plain identifications** (the snake is Vāsuki, not "tradition names it Vāsuki").
- **Theme cards:** fuller description, the story behind the theme (≤ ~900 chars), and 2–3 famous lines from other
  stotrams, scripture, classical poetry or pre-modern bhajans (never film/modern songs), quoted exactly and checked
  against a text; a line from memory gets a source `note` saying so.
- **Review:** never set `reviewed` / `scholar_approved`, never pass `C lock --confirm`. The owner reviews cards one
  by one; log every editorial pass in `review.history`.
- **Budget:** token-lean and sequential: one verse at a time with 2 drafters and one grouped judge wave; no big
  fan-outs; one or two lines of chat per verse. Ask before anything workflow-scale.
- **New preference from the owner mid-run:** add it to `docs/EDITORIAL_GUIDE.md` with the date, in the same change.

## Phase 0: preflight (no agents)
- `.venv/bin/python -m checks.selftest` passes; `vendor/vidyut-data/` and `vendor/mw/mw.txt` exist (`checks/README.md`).
- The stotram isn't already in `data/stotrams/` or `lib/stotrams.ts`. Pick the `id`: kebab-case English name
  (`lingashtakam`), which becomes the URL.

## Phase 1: text and recension (one researcher, then STOP for the owner)
1. One **stotram-researcher** whole-text pass → `research/<id>/fulltext/` plus a per-verse folder for every verse
   (`research/<id>/v<n>/text.txt`, `text-report.md`, excerpts). At least 3 independent sources; majority reading;
   variants noted.
2. Show the owner, briefly: the chosen text (all verses), recension and verse count, which verses are phalaśruti,
   meter, traditional attribution, and any variant that changes the sense. **Wait for a clear go-ahead**; the owner
   decides the text.

## Phase 2: source file and registry (no agents)
1. Create `F` with the stotram header only, `verses: []`: `schema_version` (current, see `docs/DATA_FORMAT.md`),
   `id`, `language`, `tradition`, `type`, `title` (sa/iast/en/hi), `deities`, `meter`, `attribution`, `summary`
   (en/hi, plain language), `sources` (the hymn itself and other scripture with `ancient: true`; dictionaries,
   editions and websites without it), `concepts: {}`. Copy the shape from `data/stotrams/shiva-tandava-stotram.json`.
2. Add the import to `lib/stotrams.ts` (`SOURCES` array). Verses without a translation are hidden, so registering
   early is safe.
3. `node scripts/validate.mjs F` (errors about having no verses are expected until Phase 3 starts).

## Phase 3: verses (the /stotram-refine loop)
Run `/stotram-refine <id> v1` and follow that skill exactly (prepare → 2 drafters → pick → autofix/check → one judge
wave → ≤1 repair → finish). Then:
- **After verse 1, stop and show the owner** the verse (one line each: translation, cards kept, asides) and ask for
  a go-ahead. Their edits become editorial-guide entries before the rest of the run.
- Then continue `v2…vN` sequentially (the refine skill's pipelining is fine; nothing wider).
- Collect drafters' `_new_concepts` proposals as you go; don't write theme cards yet.

## Phase 4: stotram-level layer (after the last verse)
1. **Themes:** merge the proposed concepts into 5–10 themes, reusing ids already used elsewhere in the library where
   the theme is the same. Tag each verse's `concepts`. For each theme write `name`, `description`, `story`,
   `story_citations`, `echoes` per the guide's *Theme cards* section. Verify every echo line's exact wording against
   a fetched text before using it; register each source (`ancient: true` for scripture and pre-modern devotional works).
2. **About, Q&A, credits, tags, relationships:** `about` links the 3–5 best notes; 3–6 `faq` from real search
   questions; `credits` (composer/text/meter); `relationships` to stotrams already in the library.
3. Judge the stotram layer: T4.9/T4.10 via the judge agent, one wave.
4. Log a `review.history` entry on the verses you touched.

## Phase 5: checks and hand-over
- `node scripts/validate.mjs F` (0 errors), `C run F --quiet` for the whole stotram (cross-verse consistency),
  `npm run build`.
- Report to the owner in a few lines: verses done and their status, number of human items, unchecked locators or
  memory-quoted lines, open text decisions. Link `/stotram/<id>` (and its split view) for review.

## Cost (typical)
Phase 1: one researcher. Per verse: 2 drafters + 1 wave of ≤5 judges + ≤1 repair (see `/stotram-refine`).
Phase 4: one drafting pass by you + one judge wave. A 10-verse stotram ≈ 10 refine cycles.
