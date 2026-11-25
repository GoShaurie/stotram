# Editorial guide

How a stotram should read on the site: the owner's decisions, collected in one place so every new dataset starts
from them. **Read this before drafting or repairing any verse.** `checks/DRAFTING.md`, the `stotram-dataset` and
`stotram-refine` skills, and the drafter agent all point here. The data format is in `docs/DATA_FORMAT.md`; this file
is about what the words say and how they're presented.

When the owner gives a new preference, add it here (with the date) in the same change.

## The reader's experience

- **Line by line.** Each translation line sits directly under its Sanskrit line, so the eye barely moves. Write one
  translation line per source line, **in source order**: a main clause from the last pāda goes last, even if the
  English needs reshaping ("…, in that sky-clad Reality may my mind find its delight."). The validator warns when
  lines are out of order. *(2026-11-17)*
- **True to the text.** The bhāvārtha (verse summary), meanings and asides say only what the verse says. Don't add
  details it doesn't give ("a third eye *on His forehead*" when the verse only says three-eyed) or labels it doesn't
  use ("in an *ascetic's* dress"). Background and interpretation belong in a story card, where they are cited.
  *(2026-11-18)*
- **Highlights carry over.** A meaning phrase whose words belong to a story card is highlighted like the Sanskrit.
  Nothing to write for this, but keep segments tight so the highlight lands on the right words.

- **Two layouts.** **Split view is the default** (and the server-rendered layout): smaller text on the left,
  Sanskrit evenly spaced with its mappable meaning beside it, and nothing on the right until a word is clicked; then
  the word card opens there. Split view doesn't list the story/theology cards up front. Turning the **Split view**
  toggle off gives the Genius layout (text left, notes rail right, word card in the rail). A reader's choice is
  remembered per browser. *(2026-11-18; split made the default 2026-11-25)*

- **Print / PDF sheet** (`/stotram/<id>/print`, linked from the stotram header). Kept deliberately simple: title,
  then every verse with each Sanskrit line on the left and its meaning beside it on the right (under it on phones).
  English or Hindi, Roman script optional. No cards, word notes or meaning-in-flow. One verse never splits across
  a page. *(2026-11-17)*

## Theme cards

*(2026-11-18)* Each theme (concept) card has:

1. **A fuller description**: two or three plain sentences, what the theme is and why it matters in this hymn.
2. **The story** behind it, told in two short paragraphs (≤ ~900 characters): the myth or teaching the theme comes
   from, told as a picture, in everyday words. Note where it's told (`story_citations`), ancient texts only.
3. **Also sung**: two or three famous lines from elsewhere on the same theme: other stotrams, the Veda, epics and
   purāṇas, classical poetry, and well-known **pre-modern bhajans** (Tulsīdās, Narsinh Mehta…). Quote the line
   exactly as printed, with IAST for Sanskrit and a short plain meaning. Never film or modern songs (copyright).
   These devotional works count as `ancient` sources so they can be shown.

Only quote lines whose wording you've checked against a text; a line from memory gets a source `note` saying so.

## The word card

Order, top to bottom *(2026-11-17)*:

1. the word (Devanagari)
2. IAST
3. its meaning in this verse
4. the word split, each part with **its own meaning right under it**
5. a preview of the story card on this phrase, with "Read the story →"
6. an `aside`: one or two lines, if the word has one
7. a **theology note on this single word**, if there is one, **at the end** (see below)

There is no grammar section, compound section, sandhi rules, roots or confidence line on the card. That data stays in
the file for the checks; the card doesn't show it.

- **Part meanings are one word** (or a short phrase when one word would mislead): "falling", not "falling, dripping".
  Pick the sense the verse's translation actually uses. No "(cf. …)" or "here …" notes. *(2026-11-17)*
- **Whole-word meanings** stay as natural phrases ("the forest of matted hair").
- **Name who or what is meant.** When a meaning only implies its referent ("Him", "which", "the Reality", "the bee",
  "may (it)…"), add a short clarifier: "in a certain sky-clad Reality, i.e. Śiva", "(in Him, i.e. Śiva) whose head is
  resplendent", "may (my mind) hold". Hindi: "अर्थात् शिव", matching the case ("…नाशक को, अर्थात् शिव को"). Each card
  is read alone, so repeat it on every word that needs it. *(2026-11-17)*

## Story cards (annotations)

- **Earn the card.** A card needs a story, a layered meaning, a picture worth seeing, or a variant that changes the
  sense. If it only explains the image the word already gives, write a 1–2 line `aside` on that word (≤220 chars)
  instead. Example: the v2 *kaṭāha*-cauldron card became an aside on जटाकटाह. *(2026-11-17)*
- **Length:** like verse 1 of Śiva Tāṇḍava: about 300–450 characters per language, one hook and one insight, at most
  two short paragraphs. The validator warns above 500. *(2026-11-17)*
- **Help the reader see.** Describe the picture, its contrasts and what it shows, not the scholarship around it. The
  model is the v2 moon card *(2026-11-17)*:
  > Picture the head this verse has built. Up in the matted locks the Gaṅgā whirls; at the crest rests a *kiśora*
  > moon, a thin young crescent, cool and pale; and just below, on the forehead, a fire crackles and blazes. Water and
  > moon on one side, fire on the other, all on one head…
- **Placement.** A theology note on **one word** (`refs` = that single word) is shown inside that word's card, at the
  end of the card. Notes on a phrase, a line or a general idea stay as cards beside the verse. So when a theological
  point is really about one word, give it `refs: ["wN"]`. *(2026-11-17)*
- **The owner reviews cards one by one** and says keep, cut or rewrite. A cut card's point moves into an `aside`.
  Retarget any links to it (`#v2-a1` → `#verse-2`) and log the change in `review.history`.

## Plain language

- **Everyday words.** Readers are ordinary devotees, often reading English as a second language. Use words a
  12-year-old knows, while keeping the images vivid: golden-brown, not *tawny*; shining, not *resplendent*; offering,
  not *oblation*; directions, not *quarters*; crowd, not *throng*; unmatched, not *peerless*. This applies to
  translations, meanings, cards and asides alike. *(2026-11-17)*

- **No grammar labels in visible text**, in English or Hindi: no locative, accusative, dative, genitive, nominative,
  vocative, bahuvrīhi, tatpuruṣa, dvandva, visarga, avagraha, imperative, optative, participle, neuter/feminine,
  dual, suffix, sūtra numbers; no सप्तमी, द्वितीया, चतुर्थी, विभक्ति, बहुव्रीहि, विसर्ग, लोट्, प्रत्यय, नपुंसक… Say what
  the form *does*: "the *-i* ending means 'on the head'", "the form used for exactly two", "a wish: 'may he…'".
  Sanskrit words in *italics* are fine. *(2026-11-17)*
- Hindi is natural Hindi, not English glosses dropped into Devanagari ('lined up' → 'पंक्तिबद्ध').

## Sources and attribution

- **Cite everything in the data; show only ancient texts on the site.** Monier-Williams, vyakhya.org, shlokam.org,
  sanskritdocuments (its translation page is "Samskrit Academy"), Wikisource, printed editions and other modern
  sources stay in `sources` and `citations` for the checks and provenance. Only sources with `ancient: true` (the hymn
  itself, itihāsa, purāṇa, śāstra such as Pāṇini) are rendered. `lib/public.ts` strips the rest before pages render.
  *(2026-11-17)*
- **Never name a modern source in visible text** (cards, asides, bhāvārtha, meanings), in either script: no "MW",
  "Monier-Williams" / मोनियर-विलियम्स, "vyakhya.org", "Samskrit Academy" / संस्कृत अकादमी, विकिस्रोत, रामकृष्ण मठ.
  *(2026-11-17)*
- **No attributions at all.** Not "says one commentary", "(one commentary: …)", "one translation", "another gloss",
  "in one reading", "एक व्याख्या के अनुसार". State the interpretation plainly as the meaning. Where a word genuinely
  carries two senses, give both as senses of the word ("*prapañca* can mean a heap or the whole manifest world").
  *(2026-11-17)*
  - Variant cards keep the variant itself ("the text is also found as *X*", "most printings have *X*") but never say
    who reads it.
  - Attributing to a **tradition or school** is still right where a reading isn't the plain sense ("tradition
    holds…", "in Śaiva Siddhānta…"); judge T4.5 expects it. What's banned is crediting a specific commentary,
    translator or website.
  - **Don't hedge a plain identification.** When it's simply who or what is meant (the snake on Śiva's neck is
    Vāsuki), say it outright: "a snake: Vāsuki, king of the snakes", not "tradition names it Vāsuki" /
    "परम्परा इसे वासुकि मानती है". Keep "tradition holds" for interpretations. *(2026-11-18)*

## Review status

AI never sets `reviewed` / `scholar_approved`. Any editorial pass after `ai_verified` (like the ones above) is logged
in `review.history`, and the verse should go back through `/stotram-refine` judges before a human signs it off.
