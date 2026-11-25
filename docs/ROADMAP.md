# Roadmap

Principle: **data quality is the moat, UI is the hook.** Build the core reader and the data pipeline first, then keep layering visual polish and features.

Positioning (2026-10-19): **Genius for stotrams and bhajans.** Two layers on every page: Genius-style phrase annotations (story, allusion, wordplay, sound, theology, each cited) on top of our word-level grammar layer, which Genius doesn't have. See [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md#north-star-reference-genius-geniuscom).

---

## Phase 0: Foundations (this week)

- [x] Read PRD, create docs and plans
- [x] Data format v0.1 with a fully worked sample verse ([DATA_FORMAT.md](DATA_FORMAT.md))
- [x] Validator with a publish gate (`scripts/validate.mjs`)
- [x] Dataset-creation AI skill, first version (`.claude/skills/stotram-dataset/`)
- [ ] **You:** review the sample verse 1 and the format; confirm or change decisions in *Open questions* below
- [ ] **You:** finish independent research on AI-driven web design and merge findings into [UI_DESIGN.md](UI_DESIGN.md)
- [ ] Hands-on audit of competitor sites, filling the scorecard in [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md)
- [x] Genius teardown and pivot to a Genius-style page; data format 0.2.0 (annotations, about, credits, Q&A, relationships)
- [ ] **You:** review the 5 sample annotations on verse 1 and the new look; confirm or adjust the direction

## Phase 1: Shiva Tandava Stotram end to end

### 1A. Dataset (the hardest and most important part)
- [ ] Pick the canonical recension (15 verses + phalaśruti? see *Open questions*) and record it in the file
- [x] Check catalog for the generation loop ([QUALITY_CHECKS.md](QUALITY_CHECKS.md))
- [x] Format v0.3 for the new checks (padas + anvaya, roles/heads, adhyāhāra, meter patterns, tradition, text lock); vernacular schema still to do
- [x] Build the loop: Python checks (Vidyut) with self-test, 15 judge rubrics, researcher/drafter/judge subagents, `/stotram-refine`, validation hook
- [ ] **You:** verify the gold set (`data/gold/`) and the meter table (`data/meters.json`)
- [ ] Verse 1: build its evidence pack and re-run it through the loop (drafted before the loop existed)
- [x] Verse 2 through the loop: `ai_verified`, penalty 0, 7 flags for review (`research/shiva-tandava-stotram/v2/summary.md`)
- [ ] **You:** review verse 2 (summary.md), confirm its text lock, set `reviewed`
- [ ] Schema v0.4: add a predicate role (vidheya) for predicate nominatives like sukhī in v13 (raised by a drafter)
- [ ] Grow judge calibration into a standing suite (several planted defects per judge)
- [ ] Collect and register sources (≥3 independent per verse; see [DATASET_PIPELINE.md](DATASET_PIPELINE.md))
- [ ] Run the pipeline for all verses: draft → **annotate** → cross-check → grammar verification → adjudication
- [x] Verse 1 annotated (5 notes) + about, credits, FAQ (AI draft)
- [ ] Check every AI-suggested citation locator against a real edition; clear the source notes
- [ ] `about`, `faq` and `relationships` finalised after all verses are annotated
- [ ] Human review of every verse → `review.status = "reviewed"`
- [ ] `node scripts/validate.mjs --publish` passes

### 1B. App skeleton
- [x] Next.js (App Router) + TypeScript + Tailwind, static generation for every stotram/verse page
- [x] Zod schema mirroring DATA_FORMAT.md; build fails on invalid data (`npm run build` runs the validator first)
- [ ] CI pipeline running validate + lint + build
- [x] Routes: `/` · `/stotram/[id]` · `/stotram/[id]/verse/[n]` (`/deity/[deity]` still to do)
- [x] Fonts: a Devanagari serif plus a Latin display and text face (see UI_DESIGN.md)

### 1C. Core reader
- [x] Genius layout: text and translation on the left, annotation rail on the right; stacked on mobile
- [x] Annotated phrases highlighted (grey), notes in cards with citations; annotation permalinks (`#v1-a3`)
- [x] Word panel in the rail (desktop) / bottom sheet (mobile), showing the line's note
- [x] About, Q&A (FAQPage JSON-LD), Credits + tags, Themes, Sources sections (server-rendered)
- [ ] Align the open note level with its line on desktop (Genius behaviour)
- [ ] "Share this note" with per-annotation OG image
- [x] EN ⇄ HI toggle (persisted)
- [x] Bidirectional hover highlight driven by `refs` (one-to-many and many-to-one)
- [x] Click → word panel: padaccheda, sandhi with explanation, components and roots, grammar, meaning, notes, alternatives, confidence
- [x] Compound highlighting: hovering a member shows the whole compound's outline
- [x] Keyboard and touch: tab through words, tap to pin, Esc to close (needs a real-device test on mobile)
- [ ] Separate `/hi/` URLs for Hindi (SEO plan §2); the toggle is client-side only for now
- [x] IAST transliteration toggle under the Devanagari

### 1D. The "wow" layer (revised for the minimal direction)
- [x] Light editorial theme + OS dark mode; black top bar; deity gradient header band
- [ ] Generative cover art per stotram (build-time SVG/PNG), reused as OG image; replaces the full-screen WebGL hero
- [ ] Manual light/dark toggle
- [ ] Micro-interactions polish (card expand, sheet drag-to-close on mobile)

### 1E. SEO and launch
- [ ] Execute Phase 1 items in [SEO_PLAN.md](SEO_PLAN.md) (structured data, per-verse pages, meta, sitemap, Core Web Vitals)
- [ ] Analytics, Search Console, OG images
- [ ] Deploy (Vercel or Cloudflare Pages)

**Exit criteria:** all verses reviewed; Lighthouse ≥ 95 across categories on mobile; hover/click work on touch; indexed by Google.

## Phase 2: Scale the library
- Add 10–20 high-search-volume stotrams (Hanuman Chalisa*, Shiv Rudrashtakam, Lingashtakam, Mahamrityunjaya Mantra, Gayatri Mantra, Ganesha Atharvashirsha, Vishnu Sahasranama (huge), Lalita Sahasranama, Kanakadhara, Bhaja Govindam, Nirvana Shatakam, Shiva Panchakshara)
  - *Hanuman Chalisa is Awadhi, not Sanskrit: the format must allow a non-Sanskrit source language (`language` field, grammar fields optional)
- Deity hub pages with epithet/concept explorer ("how is Śiva described?")
- Cross-stotram word index: click *śiva* → every occurrence across the library
- Relationships UI (shares text / same meter / companion hymns), tag pages, deity pages: the Genius "song relationships" and tag pages
- Cross-stotram annotation links (`[text](stotram:<id>#v3-a2)`), format 0.3
- Audio with word-level timestamps (karaoke highlight)

## Phase 3: Learning and community
- Community layer, Genius-style: suggest an annotation or edit, review queue, accepted/verified states, contributor credit, scholar-verified badge. Needs a backend; keep pages static by publishing accepted changes as data commits

- Sanskrit primers generated from the data: sandhi rules, case endings, common dhātus, each with real examples from the library
- Flashcards / spaced repetition from words the user clicked
- Recitation mode (large text, auto-scroll with audio), meter visualisation (laghu/guru)
- More languages (Marathi, Telugu, Tamil, Bengali…) and scripts

---

## Open questions (need your decision)

| # | Question | Default if you don't decide |
|---|---|---|
| 1 | Which recension of Shiva Tandava (verse count, phalaśruti included?) | 15 verses + 2 phalaśruti verses marked `kind: "phalashruti"` |
| 2 | Token granularity: keep long compounds as several hoverable tokens (as in your example) or one token per compound? | Several tokens + a `compounds` group (implemented in v0.1) |
| 3 | Who is the human reviewer? Is a Sanskrit scholar available for `scholar_approved`? | You review; scholar tier later |
| 4 | Domain name and brand | Needed before SEO launch |
| 5 | Hosting | Vercel |
