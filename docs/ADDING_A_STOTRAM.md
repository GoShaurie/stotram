# Adding a Stotram

**One requirement:** a valid source file at `data/stotrams/<id>.json`. If it passes the checks, it ships.

## Steps

**Recommended: run `/stotram-new <stotram name>` in Claude Code.** It does all of the below, follows every owner
preference in [EDITORIAL_GUIDE.md](EDITORIAL_GUIDE.md), and stops twice for you: to confirm the text, and to review
verse 1 before the rest is generated. (`.claude/skills/stotram-new`; verses go through `/stotram-refine`.)

What it does, if you'd rather drive it yourself:

1. **Text:** research the full text from ≥3 sources and confirm the recension.
2. **Source file:** create `data/stotrams/<id>.json` with the header (titles, deities, meter, summary, sources),
   following [DATA_FORMAT.md](DATA_FORMAT.md) and the structure of `shiva-tandava-stotram.json`, and add its import to
   `lib/stotrams.ts` (verses without a translation stay hidden).
3. **Verses:** `/stotram-refine <id> v1`, then the rest one at a time. Each verse ends at `ai_verified` or with a
   list of items for you.
4. **Stotram layer:** theme cards (description, story, famous lines elsewhere), About, Q&A, credits, relationships.
5. **Validate:** `node scripts/validate.mjs data/stotrams/<id>.json` and `npm run build`.
6. **Human review → publish:** you mark verses `reviewed`; `node scripts/validate.mjs --publish …` must pass before
   it goes live.

## What the checks enforce

| Check | Why |
|---|---|
| `id` is a kebab-case slug equal to the file name | It's the URL |
| Title in sa / iast / en / hi; summary in en / hi; ≥1 deity | Page header, SEO, deity hubs |
| Word ids unique per verse; text is pure Devanagari | Clean mapping and lookups |
| Every word has `iast` and a dictionary entry, and every entry has a word | No dead clicks, no orphans |
| Every translation segment's `refs` exist | No broken highlights |
| Every word is covered in **every** language | No dead hovers |
| Padaccheda, components, meaning (en+hi), valid enums; grammar on padas | Word panel always complete |
| Sandhi has name, rule, en+hi explanation | Teaching value |
| Confidence set; sources exist | Traceability |
| Compound and concept references resolve | Integrity |
| Annotations: unique ids, contiguous `refs`, no overlapping phrases, valid `kind`, en+hi body, citations resolve | Clean Genius-style highlights, every note traceable |
| Rich-text links (`#v1-a3`, `#faq-…`, `concept:…`, `source:…`, `https://…`) resolve | No dead links in notes, About or Q&A |
| Credits roles, FAQ ids, relationship types valid | Header credits, FAQ rich results |
| `--publish`: every verse `reviewed`+, ≥1 non-AI source | Nothing unreviewed goes live |

Warnings (non-blocking): missing bhāvārtha, non-sequential verse numbers, low-confidence words, missing `about`, verses without annotations, annotations without citations or over 500 characters, relationship targets not yet in the library.

## Adding a check
Edit `scripts/validate.mjs`, document it in the table above, and bump the changelog in DATA_FORMAT.md if the format itself changed.
