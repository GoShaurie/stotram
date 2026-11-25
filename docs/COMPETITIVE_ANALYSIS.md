# Competitive Analysis

> First pass from general knowledge of these sites. **Action:** do a hands-on audit (desktop and mobile, Shiva Tandava page on each) and fill in the scorecard. Features change, so verify before quoting anything externally.

## North-star reference: Genius (genius.com)

**Positioning: we are "Genius for stotrams and bhajans".** Genius isn't a competitor; it's the product pattern to copy. Reference page: [genius.com/2310153](https://genius.com/2310153), an annotation on Eminem's *Rap God* (line: "Look, I was gonna go easy on you not to hurt your feelings"). Audited 2026-10-19 from the page's embedded data and public API.

### What a Genius song page is made of

| Genius element | What it is on *Rap God* | Our equivalent | Status |
|---|---|---|---|
| **Referent** | A highlighted fragment of lyrics (grey background); 114 on this song | `verse.annotations[].refs`: a contiguous run of words | **Done (v0.2)** |
| **Annotation** | Short rich text on the referent: the insight, then links to other annotations, other songs and outside sources. This one cross-references three earlier diss tracks | `annotation.body` (inline markdown with internal links) + `citations[]` | **Done (v0.2)** |
| **Annotation permalink** | Every annotation has its own URL (`/2310153`), shareable and embeddable | `/stotram/<id>#v1-a3` opens that note | **Done**; standalone OG-image pages later |
| **"About" (song description)** | Itself an annotation: what the song is, linked into the best referents ("[references comic books](…)"), plus a primary-source quote (Rolling Stone interview) | Top-level `about` with links to annotations | **Done (v0.2)** |
| **Credits** | Writers, producers, recording location, release date, ~15 custom roles (Mixed at, Publisher…) | `credits[]`: composer, text (scripture it is found in), meter, language, recension, commentary, recordings | **Done (v0.2)**, roles extensible |
| **Q&A** | Pinned questions ("What did Eminem say about Rap God?"), answered with sources | `faq[]` (also emitted as FAQPage JSON-LD) | **Done (v0.2)** |
| **Relationships** | Samples / sampled in / interpolates / covers / remixes / live versions | `relationships[]`: shares-text, same-meter, companion, quotes, quoted-in | Format done; UI when library has >1 stotram |
| **Translations** | 10+ separate translated song pages (incl. हिंदी) | EN/HI toggle on one page, from one file (better) | Done |
| **Tags** | Rap, Detroit Rap, In English… | `tags[]` | Done (display); tag pages later |
| **Media** | YouTube / Spotify / SoundCloud embeds | `audio` (planned) with word timestamps, the karaoke layer Genius lacks | Phase 2 |
| **Trust and community** | States (accepted / pending / verified), votes (928 on this annotation), contributor attribution %, IQ, "verified artist" annotations, edit history, comments | `review.status` per verse, `confidence` and `citations` per note, `review.history`; **scholar_approved** = Genius's "verified" badge | Partial; community layer is Phase 3 |
| **Stats** | 20M pageviews, 2,115 contributors, 107 accepted annotations | Header stats: verses · words explained · annotations | Done |

### What Genius *doesn't* have, which is our moat
- **Word-level layer**: Genius annotates phrases; it can't tell you that *jaṭāṭavī* = *jaṭā* + *aṭavī* by savarṇa-dīrgha sandhi. We have both layers: grey phrase = story/meaning, any word = grammar deep-dive.
- **Bidirectional mapping** between original and translation.
- **Primary-source discipline**: every annotation cites a text and a locator, not just a blog.
- **No ads**. *Rap God* loads 10 ad units (leaderboard, in-read ×3, sidebar, marquee…). This is the single biggest UX difference we keep.

### Design lessons
1. **Text first, notes beside it.** Lyrics left, annotation right, aligned to the line. Nothing else competes.
2. **Highlight = affordance.** Grey background tells you "there's something here" without icons or underlines.
3. **Short notes, many links.** Annotations are 50–150 words; depth comes from linking, not length.
4. **Header as cover art.** Big bold title over the song's art colours; credits and stats right there.
5. **Every unit is a URL.** Annotations, Q&As and verses are shareable on their own; WhatsApp sharing for us.

## Landscape (stotram sites)

| Site | What it does well | Where it falls short |
|---|---|---|
| **sanskritdocuments.org** | Huge, reliable text library; many scripts and transliterations; PDFs | 2000s-era design; mostly text only; little or no meaning; poor mobile |
| **vignanam.org** | Many stotras, many Indian scripts, decent mobile | Text-first; meanings sparse; ads; no word-level learning |
| **stotranidhi.com** | Large catalogue, regional languages, some meanings | Ad-heavy; meanings are paragraph blocks; no interaction |
| **greenmesg.org** | Genuine word-by-word meanings for many stotras (strongest content competitor) | Dated table layout; hard to read on mobile; meaning not linked to the original visually |
| **shlokam.org** | Cleaner design, verse meaning, audio | Verse-level, not word-level; limited grammar |
| **vedabase.io** (Gita/Bhāgavatam) | Best-in-class word-for-word synonyms; clickable words lead to other occurrences | Only ISKCON texts; single interpretive lineage; utilitarian UI |
| **Gita Supersite (IIT Kanpur)** | Many commentaries side by side; scholarly | Very clunky UI; Gita only |
| **wisdomlib.org** | Dictionary and glossary depth | Reference site, not a reading experience |
| **Sanskrit Heritage / Ambuda** | Real morphological analysis; Ambuda is modern and open | Built for scholars; intimidating for devotees |
| **YouTube lyric videos / apps** | Audio and reach; where most people actually learn | Meaning is an afterthought; no lookup |

## Gaps → our UI answers

| # | Gap | Our solution |
|---|---|---|
| 1 | Meaning is separated from the text (paragraph below the verse) | Translation right under the original, notes beside it (Genius layout), **bidirectional hover mapping** |
| 2 | Word meanings in dense tables you have to cross-reference | **Hover to highlight, click to deep-dive**, right where the word is |
| 3 | Sandhi and compounds are never explained; learners can't see *why* जटाटवी = जटा + अटवी | **Animated sandhi split** with the rule in plain language |
| 4 | One flattened interpretation | **Alternatives** shown explicitly, with confidence and sources |
| 5 | No trust signals | **Review badges, source citations** per word |
| 6 | Hindi and English on separate pages or missing | **One toggle**, same layout |
| 7 | Ugly, ad-heavy, slow on mobile | **Premium, fast, ad-free** design; mobile-first bottom sheets |
| 8 | No emotional or devotional atmosphere | Deity "cover art" header band; restrained motion (see UI_DESIGN.md) |
| 9 | No theology layer: what does this epithet say about God? | **Concepts** (Gaṅgā in jaṭā, ḍamaru, nirākāra…) linked across stotrams and deity hubs |
| 10 | No learning path | Grammar primers and flashcards built from the words users actually explore (Phase 3) |
| 11 | No connection between the same word in different hymns | **Cross-stotram word index** |
| 12 | Audio not synced to text | **Karaoke word highlight** (Phase 2) |
| 13 | No context: myths, allusions, wordplay and sound effects go unexplained | **Genius-style phrase annotations** with citations, an About that links into them, and Q&A |

## Scorecard (to fill during audit)

Score 0–3. Our Phase 1 target in the last column.

| Criterion | sanskritdocs | vignanam | stotranidhi | greenmesg | shlokam | vedabase | Genius (pattern) | **Us (target)** |
|---|---|---|---|---|---|---|---|---|
| Visual design | | | | | | | 3 | 3 |
| Mobile UX | | | | | | | 2 | 3 |
| Verse meaning | | | | | | | 2 | 3 |
| Word meaning | | | | | | | 0 | 3 |
| Word ↔ meaning link | | | | | | | 0 | 3 |
| Grammar / sandhi | | | | | | | 0 | 3 |
| Hindi + English | | | | | | | 1 | 3 |
| Sources / trust | | | | | | | 2 | 3 |
| Speed (LCP) | | | | | | | 1 | 3 |
| Ads / clutter (3 = none) | | | | | | | 0 | 3 |
| Context / annotations | | | | | | | 3 | 3 |
| Audio | | | | | | | 2 | 0 (Phase 2) |
| Catalogue size | | | | | | | 3 | 0 (Phase 2+) |

## Takeaways
- **Genius is the template for the page; vedabase/greenmesg are the template for the data depth.** Nobody combines them.
- Content depth exists (greenmesg, vedabase); **experience and trust don't**. We win on both, but only if the data is as good as the best competitor.
- Catalogue size is our weakness for a long time, so **go deep on high-traffic stotrams first** (see SEO_PLAN.md).
- vedabase's "click a word → every occurrence" is the feature to beat; plan the cross-stotram index early in the data model.
