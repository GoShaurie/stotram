# Stotram

**Understand what you chant.** Genius for stotrams and bhajans: a modern, minimal website that annotates Sanskrit stotrams, mantras and bhajans line by line (the story, allusion or wordplay behind each phrase, with sources) and explains them word by word, so people can learn what the words say, pick up basic Sanskrit along the way, and understand how each hymn describes the divine.

> Status: **Phase 1, in progress.** Docs, data format 0.2 (with Genius-style annotations), validator, and a working Genius-style reader (annotation rail, hover mapping, word panel, About/Q&A/Credits, EN/HI) on verse 1 of Shiva Tandava. Dataset for verses 2+ not started.

## Why

- Millions recite stotrams daily without knowing what they say.
- Existing sites have the content but are clunky: dense tables, ads, dated layouts, and no link between a Sanskrit word and its meaning.
- Nobody pairs **trustworthy, word-level data** with **an experience that feels divine**. That gap is what we fill.

## Goals (from the PRD)

1. **Meaning:** understand bhajans, mantras and shlokas, verse by verse and word by word.
2. **Learn Sanskrit:** sandhi splits (padaccheda), word roots (dhātu), compounds (samāsa), case/gender/number (shabd-roop), verb forms.
3. **Reach:** increase the number of people who actually know what their stotrams say.
4. **Theology:** understand how God is described (e.g. Śiva as *nirākāram oṅkāra-mūlam turīyam*: formless, the root of Om, the fourth state).
5. **Organise by deity:** Śiva, Viṣṇu, Devī, Gaṇeśa, Hanumān, …

## Core experience

| Feature | Behaviour |
|---|---|
| Annotations | Grey phrases have short, cited notes (story, allusion, wordplay, sound, theology) in a rail beside the text; each note has a permalink |
| Reading layout | Devanagari, then its translation, with notes beside them (Genius layout) |
| Language toggle | English ⇄ Hindi, from the same source file |
| Hover mapping | Hover a Sanskrit word → its translation phrase lights up (and vice versa) |
| Word deep-dive | Click a word → sandhi split, roots, compound type, grammar, meaning, notes |
| About, Q&A, credits | Genius-style song page sections, server-rendered for SEO |
| Add a stotram | Drop in one JSON source file → automated checks → publish |

## Repository map

```
README.md                      ← you are here
CLAUDE.md                      ← orientation for AI coding sessions
docs/
  ROADMAP.md                   ← phases, milestones, Phase 1 task list
  DATA_FORMAT.md               ← the source-file format (living spec, versioned)
  DATASET_PIPELINE.md          ← how we create top-quality data with AI + sources
  QUALITY_CHECKS.md            ← the scorecard the generation loop must pass (tiers 0–6)
  ADDING_A_STOTRAM.md          ← contributor workflow and the automated checks
  UI_DESIGN.md                 ← design language, animation techniques, stack
  COMPETITIVE_ANALYSIS.md      ← Genius teardown (our model), existing sites, gaps
  SEO_PLAN.md                  ← how we rank for "shiva tandava stotram lyrics with meaning"
data/stotrams/
  shiva-tandava-stotram.json   ← Phase 1 dataset (verse 1 fully worked, AI draft)
app/                           ← routes: home, /stotram/[id], /stotram/[id]/verse/[n], sitemap, robots
components/reader/             ← interactive reader (Reader, VerseView, AnnotationCard, WordPanel)
components/StotramSections.tsx ← About, Q&A, Credits, Themes, Sources (server-rendered)
components/WordGlossary.tsx    ← server-rendered word table (SEO, no-JS)
lib/                           ← Zod schema, stotram registry, rich-text renderer, SEO helpers, UI labels
scripts/
  validate.mjs                 ← zero-dependency validator / publish gate
.claude/skills/stotram-dataset/
  SKILL.md                     ← AI skill that drafts and refines a stotram source file
```

## Quick start

```bash
npm install
npm run dev                  # http://localhost:3000
npm run validate             # structural checks on every stotram
npm run validate:publish     # also enforce the human-review publish gate
npm run build                # validate + static production build
```

Stack: Next.js 16 (App Router, Cache Components, every page prerendered), React 19, Tailwind 4, Zod.

## Phase 1 in one line

Ship **Shiva Tandava Stotram** end to end: complete reviewed and annotated dataset → Genius-style reader with hover and click → cover-art header → SEO-ready static pages. See [docs/ROADMAP.md](docs/ROADMAP.md).
