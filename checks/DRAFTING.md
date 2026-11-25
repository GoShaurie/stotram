# Drafting brief (read this instead of the full docs)

You write ONE verse object for a stotram file, schema 0.3. A complete, loop-verified example is
`checks/example-verse.json`; match its shape. The full spec is `docs/DATA_FORMAT.md`, but you should rarely need it.

**Also read `docs/EDITORIAL_GUIDE.md`** (short): the owner's rules for how the text reads. They override older habits
in the example verse (e.g. everyday English: "golden-brown" not "tawny", "shining" not "resplendent"; word meanings name an implied referent: "…sky-clad Reality, i.e. Śiva"; no grammar labels, no "one commentary says", single-word part meanings, translation lines
in source order, one-word theology notes get `refs` of that single word).

## Inputs
- `research/<id>/<verse>/drafts/skeleton.json`: copy `id`, `number`, `kind`, `meter` (if present) and `lines` **exactly**.
- `research/<id>/<verse>/drafts/context.json`: existing concept ids (use them in `concepts`; propose new ones under
  `_new_concepts`) and earlier verses' notes you can link to (`#v2-a3`).
- `research/<id>/<verse>/text-report.md`: variants; annotate substantive ones (`kind: "variant"`).
- `research/<id>/<verse>/sources/*.md`: the only facts you may use. The header's `source:` value is the id you cite.
- `research/<id>/<verse>/analyzer.json`: Vidyut analyses and splits (hints, not truth).
- Missing a dictionary entry? `.venv/bin/python -m checks dict data/stotrams/<id>.json --verse <v> --stems <iast,iast>`
  (local Monier-Williams, instant). Then cite `mw-<slug>`.

## What to write (keys in this order)
`id, number, kind, [meter], concepts, lines, compounds, padas, adhyahara, anvaya, translations, annotations, words, review`

- **words.wN**: `padaccheda` (pausa forms), `sandhi` (name, rule, en/hi explanation), `components` (sa, iast, pos,
  root {kind dhatu|pratipadika, sa, iast, gana?, prefixes?, gloss?}, formation?, sense {dict, headword, gloss}?, meaning en/hi),
  `meaning` en/hi (contextual), `literal` only if different, `epithet: true` for divine names, `notes`, `alternatives`,
  `confidence`, `sources`.
- **compounds.cN**: members (word ids), iast with hyphens, `type` (tatpuruṣa, karmadhāraya, dvigu, nañ-tatpuruṣa, upapada,
  bahuvrīhi, dvandva, avyayībhāva), `subtype`, `structure` (brackets, required for 3+ members), `vigraha`, meaning, note.
- **padas** (p1…): post-sandhi units, **pausa forms** (-ḥ not -o, -m not -ṃ). A compound = ONE pada spanning its words.
  `morph`: subanta {stem, gender, case, number, krt?} | tinanta {dhatu {sa, iast, gana}, prefixes, lakara, prayoga,
  person, number, pada} | avyaya {krt?}. Plus `role` and `head`. Enums are in IAST: laṭ liṭ loṭ…, kartari, kartā, karma…
- **adhyahara** (x1…): supplied words, with morph, role, head and meaning. Give each its own translation segment.
- **anvaya**: every pada and x id exactly once, in prose order.
- **translations** en/hi: natural sentences cut into segments, `refs` = the word ids each segment translates. Every word
  appears in at least one segment per language. `bhavartha` in both.
  **One translation line per source line, in source order**: the reader prints each meaning line under its
  Sanskrit line. Put the main clause where its words are (usually the last line), not first.
  **Each segment's text may only contain words that translate its own refs.** The most common judge failure: an
  English verb or auxiliary ("made", "be", "may") riding along in a neighbouring noun's segment. Give the verb its own
  segment with the right ref, even if that splits a phrase, as the Hindi side usually already does.
- **annotations** (2–5): `{id, refs (contiguous words, no overlaps), kind, body {en, hi}, citations [{source, locator, quote?}], confidence}`.
  Each note must earn its card: a story, a layered meaning, a variant that changes the sense. If it only explains
  the image the word already gives, write it as a 1–2 line `aside` on that word (≤220 chars) instead.
  Write for a general reader: no grammar labels (locative, accusative, bahuvrīhi, visarga, सप्तमी, द्वितीया …) in
  visible text. Say what the form does ("the *-i* ending means 'on'"). No attributions ("one commentary says").
  Lead with the insight, 50–80 words (≤500 characters per language, like verse 1), our own words. `quote` must be copied verbatim from an excerpt.
  Locators name sections the excerpt really has (vyakhya.org: पदच्छेद (word glosses), अन्वय, भावार्थ, व्याख्या; there is no
  शब्दार्थ). A claim about how the witnesses read ("most witnesses read …") cites those witnesses.
  A claim about another verse links to that verse's note: `[text](#v2-a3)`.
- **review**: `{"status": "ai_draft", "history": [{"date", "by": "ai", "action": "Drafted from evidence pack."}]}`. No `lock`.

## Rules the checks enforce (save yourself a repair round)
- `confidence: "high"` needs at least 2 independent non-AI sources cited on that word, and agreement across drafts.
- **No 8-word run copied from any source** (dictionary definitions included), in translations or annotations.
- Every `role` except kriyā, sambodhana and nipāta needs a `head`. Adjectives (viśeṣaṇa) agree in gender, case and number;
  apposition (samānādhikaraṇa) agrees in case. Role and case must match (kartā is nominative in kartari, and so on).
- lyap needs an upasarga; ktvā has none. Give every dhātu a gaṇa.
- A bahuvrīhi should qualify something (viśeṣaṇa / samānādhikaraṇa). If it stands alone as a name, mark the word `epithet`.
- IAST lowercase, no ISO forms (ṁ, r̥). Devanagari ↔ IAST must transliterate exactly.
- Hindi: natural modern Hindi; write शृ, never श्रृ.
- No benefit or health claims except quoting the phalaśruti.
- A `variant` note cites at least 3 of the verse's text witnesses (the `lock.sources` in the skeleton), each with its reading
  quoted verbatim (T4.9c). Any other note that counts witnesses ("four of five read…") cites them too.

## If a check is wrong
Never bend the data to satisfy a checker (no `irregular` on a regular form, no changed stem). If you're sure the tool is
wrong (e.g. it rejects a correct Pāṇinian form), leave that FAIL, explain it in your report, and the orchestrator fixes the
checker.

## Before you finish
Run `.venv/bin/python -m checks draft-check data/stotrams/<id>.json <your draft path>` and fix every FAIL it prints,
until it reports 0. It runs only the code and tool checks; judges run later. Never edit `data/`.
