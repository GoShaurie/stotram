# UI Design: Genius for Stotrams

> Revised 2026-10-19: the direction moved from "temple at night" (dark, gold glow, full-screen WebGL) to a **modern, minimal, Genius-style** reading page. Reference: [genius.com/2310153](https://genius.com/2310153); teardown in [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md).

## Design north star

**"The text, and the notes beside it."** A stotram page should feel like a great annotated edition: bold, clean, fast. Colour and atmosphere come from one place (the header band, our "cover art"); the reading area is calm, typographic and almost colourless, so highlights mean something.

Three feelings, in order:
1. **Confidence** on arrival: big bold title, deity colour band, credits and stats at a glance.
2. **Clarity** while reading: generous whitespace, beautiful Devanagari, translation right under it, notes in the margin.
3. **Curiosity** on interaction: grey phrases invite a click; every click reveals a story or a grammar insight.

## Visual language

| Element | Direction |
|---|---|
| Base | Light editorial (white / off-white) by default; dark follows the OS (`prefers-color-scheme`). Tokens in `app/globals.css` |
| Brand colour | **Kesar (saffron) `#ff6a13`**, used sparingly: active highlight, links, focus |
| Annotated phrase | Genius grey (`--hl`) background on the whole phrase; darker on hover; saffron tint when its note is open |
| Hover mapping | Saffron tint + saffron underline on the word and its translation segment (`.lit`) |
| Deity accent | One gradient per deity for the header band (Śiva: indigo → night; Devī: kumkum → maroon; Viṣṇu: deep blue → peacock teal) |
| Top bar | Black, uppercase wordmark with a saffron ॐ |
| Latin type | **Inter**, heavy weights (800–900) for titles, tight tracking; small caps-style labels (uppercase, 0.2em tracking) |
| Devanagari type | Tiro Devanagari Sanskrit (verse), Noto Serif Devanagari (Hindi prose) |
| Cards | Flat `bg-raised` blocks, 16px radius, no borders at rest; border or shadow only when active |
| Motion | Short colour transitions (150–200ms), a slide-up for the mobile sheet. No ambient animation in the reading area |

## Page anatomy (stotram page)

```
┌────────────────────────────── black top bar ──────────────────────────────┐
│ ॐ STOTRAM                                                        Library   │
├──────────────────── deity band ("cover art") ─────────────────────────────┤
│ STOTRAM · SHIVA                                                            │
│ शिवताण्डवस्तोत्रम्                                                           │
│ Shiva Tandava Stotram          (big, bold)                                 │
│ Rāvaṇa (traditional attribution)                                           │
│ 1 verse   14 words explained   5 annotations                               │
│ summary · [About] [Q&A] [1] [2] …                                          │
├────────────────────────── sticky toolbar: IAST · English/हिन्दी ───────────┤
│ VERSE 1                    status     │  rail                              │
│ ▓जटाटवी गलज्जलप्रवाह पावितस्थले▓        │  ┌ annotation card (collapsed) ┐   │
│ ▓गलेऽवलम्ब्य लम्बितां …▓ ।              │  ├ annotation card (ACTIVE)    ┤   │
│ …                                     │  │  full note + citations       │   │
│ │ translation, segment-mapped         │  └─────────────────────────────┘   │
│ MEANING IN FLOW  bhāvārtha            │  or: word panel (sticky)           │
│ (theme chips)                         │                                    │
├───────────────────────────────────────┴────────────────────────────────────┤
│ About · Q&A · Credits (+tags) · Themes · Word-by-word table · Sources      │
└────────────────────────────────────────────────────────────────────────────┘
```

## Interactions

| Action | Result |
|---|---|
| Hover a word | Word + its translation segment light up; its whole annotated phrase darkens; compound members get a dashed outline |
| Hover a translation segment | The Sanskrit words it translates light up |
| Hover an annotation card | Its phrase and translation light up |
| Click an annotation card | Expands it (full note, citations, confidence) and tints the phrase |
| Click a word | Word panel replaces the rail (desktop, sticky) or slides up as a bottom sheet (mobile). If the word is in an annotated phrase, the panel opens with "On this line" and a link to the full note |
| Open `/stotram/<id>#v1-a3` | That annotation opens, the Genius permalink pattern. Share links point here |
| Esc | Closes the word panel / note |
| Toggle **Split view** (toolbar) | On by default (the server-rendered layout); off gives the Genius layout with the notes rail. Remembered per browser. Split view: smaller text on the left, Sanskrit lines evenly spaced, in a column sized to the longest line of the whole stotram and shared by every verse (one CSS subgrid), so the columns line up down the page with the mappable meaning lines beside them (stacked on phones). The right column stays empty until a word is clicked, then shows the same word card as the Genius layout; "Read the story" opens the story card there. No annotation cards are listed by default. |

## Non-negotiables (performance and accessibility)
- **Text is real HTML, never canvas.** Verse, translation, every annotation body (collapsed cards are clipped, not removed), About, Q&A, glossary: all server-rendered.
- Every page prerendered (`ensureStatic = "navigation"`); no request-time data.
- LCP < 2.0 s on mid-range Android over 4G; reader JS < 150 KB gz.
- Full keyboard navigation of words and cards; words are buttons with meaningful `aria-label`s; cards use `aria-expanded`.
- Contrast ≥ 4.5:1 in both themes including highlight states; Devanagari ≥ 20px on mobile.
- `prefers-reduced-motion` disables all animation.

## Still to design
- **Generative cover art per stotram**: replace the plain gradient with a small, static, generative image per deity/stotram (sacred-geometry or noise field rendered at build time to SVG/PNG). Doubles as the OG image. This replaces the full-screen WebGL hero from the previous direction.
- **Line-aligned rail on desktop**: Genius places the open note level with its line. Ours keeps cards in reading order; aligning the active card to its line is a nice next step.
- **Annotation share card**: "Share this note" → OG image with the phrase, note excerpt and cover art (WhatsApp first).
- Tag, deity and concept pages (Genius tag pages).
- Audio player in the header band with karaoke word highlight (Phase 2).
- Light/dark manual toggle (currently OS-driven).

## How we'll use AI to build it
- Generate design explorations as artifacts / prototypes and iterate on screenshots.
- Use a browser-driving agent for visual regression and responsive checks (light, dark, mobile, desktop).
- Keep the design tokens in `app/globals.css` as the single source of truth so AI-generated components stay consistent.

## Research inbox (your findings go here)
- …
