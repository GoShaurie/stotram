# CLAUDE.md

Stotram: "Genius for stotrams". Sanskrit stotrams with Genius-style cited phrase annotations plus word-by-word meanings (EN/HI), hover mapping and grammar deep-dives. Start with README.md, then docs/ROADMAP.md.

- **Data contract:** `docs/DATA_FORMAT.md`. If you change the format, update that doc (and its changelog) and `scripts/validate.mjs` in the same change.
- **Validate data:** `node scripts/validate.mjs` (add `--publish` for the human-review gate). Must pass before any data change is done.
- **Adding a new stotram:** `/stotram-new <name>` (end-to-end: text → file + registry → `/stotram-refine` per verse → theme cards, About, Q&A). One-off manual dataset work: the `stotram-dataset` skill. Never mark data `reviewed`/`scholar_approved`; that's for humans only.
- Reference quality bar: verse 1 of `data/stotrams/shiva-tandava-stotram.json`.
- **Editorial preferences:** `docs/EDITORIAL_GUIDE.md` (how text reads and what the site shows: line-by-line meanings, word card, short visual story cards, no grammar jargon, no attributions, only ancient texts cited on the site). Read it before drafting or repairing; add every new owner preference to it.
- App: Next.js 16 with Cache Components; `ensureStatic = "navigation"` on the root layout keeps every page fully prerendered — don't add request-time data. Read `node_modules/next/dist/docs/` before using Next APIs (see AGENTS.md); `dynamicParams` is unavailable, use `notFound()`.
- New stotram file → also add its import to `lib/stotrams.ts`.
- Text must always be server-rendered HTML (SEO). Visual effects (WebGL etc.) load after content.
- Commands: `npm run dev | build | lint | validate | schema` (re-export JSON Schema after changing `lib/schema.ts`).
- Quality checks (Python, Vidyut): `npm run checks -- run data/stotrams/<id>.json --verse v2`; checker self-test `.venv/bin/python -m checks.selftest`. Setup in `checks/README.md`.
- Generating verses: `/stotram-refine <id> <verse or range>` (orchestrator skill + researcher/drafter/judge subagents). Per verse: `checks prepare` → 2 drafters (brief: `checks/DRAFTING.md`, self-check with `checks draft-check`) → one wave of 5 judges → ≤1 repair → `checks finish`. Never pass `checks lock --confirm`; that's the human's step.
