# SEO Plan

**Target:** rank top 3 for *"shiva tandava stotram lyrics"*, *"shiva tandava stotram lyrics with meaning"*, *"shiv tandav stotram in hindi"*, and long-tail per-verse and per-word queries.

Our advantages: **fast static pages, unique word-level content, real HTML text, structured data, and engagement** (people stay and interact). The danger: a beautiful JS-heavy site that Google can't read. Every item below guards against that.

---

## 1. Keyword strategy

| Cluster | Example queries | Page that targets it |
|---|---|---|
| Head | shiva tandava stotram, shiv tandav stotram | `/stotram/shiva-tandava-stotram` |
| Lyrics | … lyrics, … lyrics in sanskrit, … lyrics in english | Same page: full text above the fold, IAST toggle server-rendered |
| Meaning | … with meaning, … meaning in hindi, … in hindi | Same page (EN) + `/hi/stotram/shiva-tandava-stotram` (HI) |
| Verse | jatatavi galajjala meaning, shiva tandava verse 1 meaning | `/stotram/shiva-tandava-stotram/verse/1` |
| Word / concept | what does jatatavi mean, damaru meaning, why does shiva wear snakes | Per-verse pages (anchors) → later `/word/…` and `/concept/…` pages |
| Romanised spellings | shiv tandav, shiva thandava, siva tandava | Title/H1 variants, `alternateName` in schema, FAQ |

Actions:
- [ ] Pull volumes and difficulty (Google Keyword Planner, Ahrefs/Semrush, Search Console once live) for EN and HI
- [ ] Capture "People also ask" questions → FAQ section per stotram

## 2. Technical SEO
- **Static generation (SSG)** for every stotram, verse and language page; all text in the initial HTML (verify with JS disabled).
- **Separate URLs per language** (`/` English, `/hi/` Hindi), never a JS-only toggle for indexing; `hreflang` en / hi / x-default; `<html lang>` set correctly.
- Clean URLs, canonical tags, XML sitemap (with hreflang), robots.txt.
- **Core Web Vitals:** LCP < 2.0 s, CLS < 0.05, INP < 200 ms. WebGL hero lazy-loaded *after* LCP; fonts subset and `font-display: swap`, preload the Devanagari font.
- Word panel content rendered in HTML (e.g. `<details>` or hidden-but-present markup) so word meanings are crawlable, or exposed on verse pages.
- Breadcrumbs: Home › Śiva › Shiva Tandava Stotram › Verse 1.
- 404s, redirects for spelling variants (`/shiv-tandav-stotram` → canonical).

## 3. Structured data (JSON-LD)
- `CreativeWork` (or `Book`/`Chapter` for verses) with `name`, `alternateName`, `inLanguage: "sa"`, `translationOfWork` / `workTranslation`, `author` (Rāvaṇa, hedged), `about` (Śiva).
- `BreadcrumbList` on every page.
- `FAQPage` for genuine Q&A content (note: Google limits FAQ rich results; still useful for content structure).
- `DefinedTerm` / `DefinedTermSet` for word glossary pages (Phase 2).
- `AudioObject` once audio exists.
- `WebSite` + `Organization` on the homepage.

## 4. On-page content
- **Title:** `Shiva Tandava Stotram Lyrics with Meaning (Word by Word) | <Brand>`. Hindi: `शिव ताण्डव स्तोत्र अर्थ सहित | <Brand>`.
- **H1** with the name; intro paragraph (what it is, who composed it, meter, why it's chanted).
- Full lyrics in Devanagari + IAST, then meanings. Content beats competitors on depth: word-by-word + grammar + bhāvārtha + concepts.
- FAQ: Who wrote it? When to chant? Benefits (phalaśruti, quoted from the text, not invented claims)? How many verses? Meaning of jaṭāṭavī?
- Internal links: verse ↔ verse (prev/next), concepts, deity hub, related stotrams.
- Unique meta descriptions per verse page, generated from the data.
- **E-E-A-T:** an "About our translations" page explaining the pipeline, sources and reviewers; reviewer credits on pages.

## 5. Shareability and off-page
- Auto-generated **OG images** per verse (verse text over hero art), so shares on WhatsApp look beautiful. WhatsApp is the main distribution channel for this audience.
- "Share this verse" and "copy verse with meaning" buttons.
- Outreach: Sanskrit learning communities, Reddit (r/hinduism, r/sanskrit), Quora answers linking to word explanations, YouTube creators (offer meaning pages for their recitations), temple and university Sanskrit departments.
- Short-form video clips of the hover/split interactions (Instagram/YouTube Shorts): the UI itself is the marketing.
- Seasonal pushes: **Mahāśivarātri** and **Śrāvaṇa month** see big search spikes for Śiva stotrams; publish and promote 4–6 weeks before.

## 6. Measurement
- Google Search Console + Bing Webmaster from day one; GA4 or Plausible.
- KPIs: impressions/clicks for target clusters, average position, CTR, engaged time, word clicks per session, returning users.
- Monthly review: refresh titles/meta for pages with high impressions but low CTR.

## Phase 1 checklist
- [ ] SSG pages for stotram + 15–17 verse pages × 2 languages
- [ ] hreflang, canonical, sitemap, robots
- [ ] JSON-LD: CreativeWork, BreadcrumbList, FAQ
- [ ] Titles/meta from data; spelling-variant redirects
- [ ] OG image generation
- [ ] Lighthouse SEO 100, performance ≥ 95 mobile
- [ ] About-our-translations page
- [ ] Search Console verified, sitemap submitted
- [ ] Launch before the next Śrāvaṇa / Mahāśivarātri window
