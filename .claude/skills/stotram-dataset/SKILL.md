---
name: stotram-dataset
description: Create or improve a stotram/mantra/bhajan source file (data/stotrams/<id>.json) with word-by-word Sanskrit analysis, Genius-style cited phrase annotations, English and Hindi translations, and hover mappings. Use when asked to add a stotram, draft verses, cross-check translations, or raise the review status of a dataset.
---

# Stotram dataset skill

You produce data for a site that is "Genius for stotrams", and whose differentiator is **data quality**. Accuracy beats speed. Never invent a fact you can't support; lower the confidence and say why instead.

## Read first
- `docs/DATA_FORMAT.md`: the format (authoritative)
- `docs/EDITORIAL_GUIDE.md`: the owner's editorial preferences (overrides anything below that conflicts)
- `data/stotrams/shiva-tandava-stotram.json`, verse 1: the quality bar to match
- `docs/DATASET_PIPELINE.md`: which pass you're running, and the **annotation style guide** (Pass 1b)

## Prefer the loop
For creating or improving verses, use **`/stotram-refine <id> <verse>`**: it runs research, three independent drafts,
the checks in `docs/QUALITY_CHECKS.md`, independent judges and repair. The modes below are for one-off manual work, and
everything they produce must still pass `npm run checks -- run data/stotrams/<id>.json --verse <v>`.

## Modes

### `draft <stotram name>` (Pass 0 + 1)
1. **Text:** fetch the text from ≥3 independent sources (e.g. sanskritdocuments.org plus two others). Normalise to NFC and diff. Pick the majority reading; note variants in the verse or word `notes`. Show the user the chosen text and recension, and **wait for confirmation** before continuing.
2. **Tokenise:** one display word per space-separated unit in the source. For very long compounds, split into meaningful members (like w1–w3 in the reference) and add a `compounds` group.
3. **Per verse** (batch 1–3 verses at a time to keep quality high):
   - Fetch word-by-word meanings for that verse from the sources and keep them in context.
   - Fill every field per DATA_FORMAT.md (schema 0.3): iast, padaccheda, sandhi (name + rule + en/hi explanation), components with roots (dhātu with gaṇa and prefixes, or prātipadika), meaning en/hi, notes where they teach something, alternatives where sources disagree.
   - Grammar goes on **padas** (post-sandhi units: morph, role, head), plus `adhyahara` and `anvaya`. Words carry no `grammar` field.
   - Write `translations.en` and `translations.hi` as natural sentences broken into segments; every word id must appear in ≥1 segment per language. Don't create filler segments like "and".
   - Add `bhavartha` in both languages and tag `concepts`.
   - `confidence`: high only if sources agree and the grammar is unambiguous.
   - Register every source used in top-level `sources` and cite it on the words.
   - `review.status = "ai_draft"`, append a history entry.
4. Run `node scripts/validate.mjs <file>` and fix all errors before reporting.

### `annotate <id> [verses]` (Pass 1b)
Needs the word layer first.
1. Per verse, list candidate referents (story, allusion, wordplay, sound/meter, theology, variant, meaning-changing grammar) and say why each matters. Usually 2–5; skip phrases with nothing to add.
2. Fetch the primary text for each claim and keep the excerpt in context. No locator, no claim.
3. Write `annotations[]` per DATA_FORMAT.md: contiguous `refs`, no overlaps, `kind`, `body` en+hi (50–80 words, ≤500 chars, lead with the insight; see docs/EDITORIAL_GUIDE.md, rich-text links to other notes/concepts), `citations` with `locator` (and a short `quote` when decisive), `confidence`.
4. If a locator comes from memory rather than a fetched text, add or keep a `note` on that source saying it needs checking.
5. When all verses are done: `about` (link the 3–5 best notes), `credits`, 3–6 `faq` from real search questions, `relationships`, `tags`.
6. Append to `review.history`; run the validator.

### `crosscheck <id> [verses]` (Pass 2)
For each word compare against every registered source. Produce a table: word · our meaning · each source's meaning · verdict. Update confidence/alternatives. Do not rewrite agreed entries.

### `verify-grammar <id> [verses]` (Pass 3)
Check each split and inflection against a Sanskrit morphological analyser (Sanskrit Heritage Reader, Vidyut, or similar) when reachable; otherwise reason explicitly from Pāṇinian rules and mark confidence no higher than `medium`. Report mismatches; never silently change.

### `critique <id> [verses]` (Pass 4)
Act as an independent reviewer. Without trusting existing values, re-derive each word and flag disagreements, unnatural translations, non-idiomatic Hindi, missing coverage, wrong enums. Also check every annotation: claim ↔ citation, insight-first, length, tradition stated as tradition. If clean and passes 2–3 are done, set `ai_verified`.

## Quality rules
- Hindi must be natural modern Hindi. English is clear and reverent, not archaic ("thee/thou") and not casual.
- Compound members carry no case. Only the final member is inflected (see `c1` in the reference).
- Respect sandhi in surface forms: anusvāra/ṃ, avagraha ऽ, assimilated consonants (ḍamat → ḍamaḍ).
- Theological notes: describe what the tradition says ("is said to", "tradition holds"); don't preach and don't make health or benefit claims beyond quoting the phalaśruti.
- Never set status `reviewed` or `scholar_approved`; only humans do that.
- Don't copy other sites' translation or commentary text verbatim. Use sources to verify, and write our own wording.
- Annotations explain; they don't repeat the word panel. Grammar appears in a note only when it changes how the line reads.

## Output to the user
After each run: verses processed, validator result, count of words by confidence, annotations added (with any unchecked locators), list of open disagreements needing a human decision.
