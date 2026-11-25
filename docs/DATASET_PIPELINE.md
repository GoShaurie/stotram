# Dataset Creation Pipeline

> The PRD calls this "the best feature of the application". The goal: **every word on screen is correct, traceable, and explained, and every line that hides a story, allusion or pun gets a short, cited note** (the Genius layer). AI does the heavy lifting; sources and rule-based Sanskrit tools keep it honest; humans have the final say.

**Scorecard:** every pass is measured against the check catalog in [QUALITY_CHECKS.md](QUALITY_CHECKS.md) (tiers 0–6, each check marked code / tool / judge and blocker / major / minor).

## The loop, in Claude Code

`/stotram-refine <stotram-id> <verse or range>` runs the pipeline verse by verse, with the next verse drafted while the current one is judged (`.claude/skills/stotram-refine/SKILL.md`):

```
researcher ─► evidence pack (≥3 sources, text.txt, dictionary entries, Vidyut analyses)
          ─► skeleton + text lock (human confirms later)
          ─► 3 drafters in parallel ─► self-consistency (disagreements cap confidence)
          ─► ┌ code + tool checks (checks/) ─► judges in parallel (one per rubric) ─► repair patch ┐
             └─────────────── keep the patch only if nothing regresses; ≤ 4 rounds ───────────────┘
          ─► promote to ai_verified if clean ─► summary for the human reviewer
```

| Piece | File |
|---|---|
| Orchestrator skill | `.claude/skills/stotram-refine/SKILL.md` |
| Subagents | `.claude/agents/stotram-researcher.md`, `stotram-drafter.md`, `stotram-judge.md` |
| Checks + CLI | `checks/` (Python, Vidyut), `scripts/validate.mjs` (Node) |
| Judge rubrics | `checks/judges/*.md` |
| Evidence, drafts, reports, verdicts, iteration snapshots | `research/<id>/<verse>/` |
| Gold set | `data/gold/<id>.json` |
| Validation hook | `.claude/settings.json` (runs the validator after any edit to a dataset file) |

The passes below describe what each stage must achieve; the loop is how they're run.

## Principles

1. **AI drafts, sources decide.** An LLM never is the only authority for a fact. Every word entry cites sources, and disagreements are recorded, not silently resolved.
2. **Multi-pass, not one-shot.** Each pass has one job and a checklist. Quality improves monotonically, and each pass is logged in `review.history`.
3. **Rule-based tools as referees.** Sanskrit morphology is formal (Pāṇini). Use deterministic analysers to check AI claims about sandhi, roots and inflection.
4. **Confidence is explicit.** `high` = sources and tools agree; `medium` = minor disagreement or interpretive; `low` = unresolved → must be human-reviewed.
5. **Interpretations are features.** When commentators differ, keep both (`alternatives`). Users find this fascinating; competitors flatten it.

## Source tiers

| Tier | Type | Examples (to evaluate) | Used for |
|---|---|---|---|
| 1 | Canonical text | sanskritdocuments.org, published stotra collections (Gita Press, etc.) | The exact Devanagari text and recension |
| 1 | Dictionaries | Monier-Williams, Apte, Vācaspatyam (Cologne Digital Sanskrit Dictionaries) | Word meanings, gender, roots |
| 1 | Morphology engines | Sanskrit Heritage Reader (INRIA), Vidyut (Ambuda), DCS (Digital Corpus of Sanskrit) | Sandhi splits, inflection, dhātu identification |
| 2 | Word-by-word translations | greenmesg.org, shlokam.org, published translations with padārtha | Cross-checking meanings and splits |
| 2 | Commentaries | Traditional ṭīkās, scholarly translations | Interpretation, alternatives |
| 3 | General web / blogs / video | Popular sites, YouTube descriptions | Only to spot common readings and misconceptions; never sole source |

Rules: verify licences before copying any translation text. We **cite and cross-check** others' work; our published translations and explanations are our own wording.

## The passes

```
 ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
 │ 0 Text   │→ │ 1 Draft  │→ │1b Annot- │→ │ 2 Cross- │→ │ 3 Grammar│→ │ 4 Adjudi-│→ │ 5 Human  │
 │ fixing   │  │ words    │  │ ate      │  │ check    │  │ verify   │  │ cate     │  │ review   │
 └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
   text lock     ai_draft      notes+about    sources        tools        ai_verified    reviewed
```

### Pass 0: Text fixing
- Gather the text from ≥3 tier-1/2 sources. Diff them character by character after Unicode normalisation (NFC).
- Choose the recension and record variant readings as notes.
- Tokenise into display words and lines (decide compound granularity), assign ids. **Freeze the text.** Later passes cannot change it without restarting.

### Pass 1: AI draft
- Run the `stotram-dataset` skill (see `.claude/skills/stotram-dataset/SKILL.md`) per verse, with the frozen text and fetched source excerpts **in context**. Never ask the model from memory alone.
- Output must validate (`node scripts/validate.mjs`). Status `ai_draft`.

### Pass 1b: Annotate (the Genius layer)
Runs after the word layer exists, because good notes lean on it. Per verse:
1. **Find the referents.** Read the verse with its word meanings and ask: what would a curious reader *not* get from the words alone? Typical hits: a myth or story (Gaṅgā in the hair), an allusion to another text, wordplay or a pun (*śivaḥ śivam*), a sound effect or meter trick (*ḍamaḍ-ḍamaḍ*), a theological claim (what an epithet says about God), a variant reading, a grammar choice that changes the meaning (*liṭ* = unwitnessed past). Skip phrases with nothing to add; a verse usually has 2–5 notes.
2. **Research before writing.** Fetch the primary text for each claim (purāṇa / epic passage, commentary, sūtra) and keep the excerpt in context. Record **source + locator** for every claim; no locator, no claim.
3. **Write the note** to the style guide below, in English and Hindi (Hindi written, not translated word for word).
4. **Link it.** Link to related annotations in this stotram, concepts and, later, other stotrams. Links are cheaper than repetition.
5. After all verses: write `about` (links into the 3–5 best notes), `credits`, 3–6 `faq` items from real search questions, and `relationships`.

#### Annotation style guide (in the spirit of the best Genius annotations)
The owner's current rules are in [`docs/EDITORIAL_GUIDE.md`](EDITORIAL_GUIDE.md) and win over anything here.
- **Lead with the insight**, not a restatement. Bad: "This line describes Śiva's hair." Good: "Why is there a river in Śiva's hair?"
- **50–80 words (≤500 characters).** One idea per note. If it needs more, it's two notes or it belongs in `about`. If it only restates the word's image, it's a one-line `aside` on the word, not a note.
- **Quote the primary text** when it is short and decisive (`> nṛttāvasāne naṭarājarājo…`), with the locator in `citations`.
- **Attribute to tradition, not to sources,** for interpretation: "tradition holds", "the Śiva Purāṇa tells". Never credit a modern commentary, translation or website in the text ("one commentary says" is out); state the sense plainly. Never present devotional belief as historical fact, and never as false either.
- **No grammar labels** (locative, bahuvrīhi, सप्तमी…): say what the form does.
- **No preaching, no benefit claims** beyond quoting the phalaśruti.
- **Don't duplicate the word panel.** Use grammar only when it changes how the line reads.
- **Our own words.** Never copy another site's commentary; cite and rephrase.

### Pass 2: Source cross-check
- For each word: compare the draft meaning/split against every source. Record agreement per word.
- Disagreement → set confidence `medium`/`low` and add `alternatives` with citations.
- Generate a per-verse **diff report** (draft vs each source) for the human reviewer.

### Pass 3: Grammar verification (deterministic)
- Run each surface form through a morphological analyser (Heritage Reader / Vidyut). Check: does the claimed split produce the surface form? Is the claimed case/number/gender among the analyser's candidates? Does the dhātu exist with that gaṇa?
- Any mismatch is a hard flag. AI may propose a fix but must cite the analyser output.

### Pass 4: Adjudication (AI, second model or fresh context)
- An independent "critic" agent reads the entry plus the evidence from passes 2 and 3 and either confirms or rewrites. It cannot see the drafter's reasoning, which avoids self-agreement bias.
- Also checks: translation segments read naturally in order; Hindi is idiomatic; every word is covered; notes are accurate and not preachy.
- For annotations: is every claim backed by a citation with a locator? Does the note lead with an insight? Is it under 150 words? Is anything stated as fact that is only tradition?
- Clean entries → `ai_verified`.

### Pass 5: Human review
- Reviewer UI (Phase 1 can be the real reader with a "review mode" showing confidence and flags).
- Reviewer accepts/edits each word; status → `reviewed`; history entry with reviewer name.
- Optional scholar pass → `scholar_approved`.

### Continuous improvement
- User feedback button on every word ("this seems wrong") → issue with word id.
- Re-run passes 2–4 when new sources are added; a diff shows what changed.
- Track metrics per stotram: annotations per verse, % annotations with a primary-text citation, % words `high` confidence, # alternatives, # human edits per verse (a proxy for AI draft quality; use it to improve prompts).

## Best practices to apply (research summary, to expand)
- **Ground in retrieved evidence** (RAG over fetched sources) instead of model memory; require citations per field.
- **Structured outputs** (JSON schema-constrained generation) so drafts are always machine-checkable.
- **Separate generator and critic** (different context, ideally different model) to reduce correlated errors.
- **Self-consistency:** sample the draft several times; fields where samples disagree get lower confidence automatically.
- **Gold set:** hand-verify ~20 words across tricky categories (long compounds, avagraha sandhi, liṭ forms, onomatopoeia) and score every pipeline change against it.
- **Human-in-the-loop on uncertainty only:** route `low`/`medium` to humans first to get the most out of review time.

## Open research tasks
- [ ] Evaluate Sanskrit Heritage Reader vs Vidyut vs `sanskrit_parser` for automated pass 3 (API availability, accuracy on stotra verse)
- [ ] Confirm licences of candidate sources
- [ ] Build the gold set from Shiva Tandava verses 1–3 (include 5 gold annotations to score the annotate pass)
- [ ] Get digital editions with stable locators for the texts annotations cite most (Rāmāyaṇa, major purāṇas, Aṣṭādhyāyī), so citations can be checked automatically
- [ ] Decide drafting model and critic model; measure on the gold set
