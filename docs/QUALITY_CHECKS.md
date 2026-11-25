# Quality Checks: the dataset scorecard

The checks every stotram/bhajan file is scored against. The iterative generation loop ([DATASET_PIPELINE.md](DATASET_PIPELINE.md)) drafts, runs these checks, repairs only what fails, and repeats. Started from the founder's 5-tier list (2026-10-20); kept, changed, extended or dropped as marked.

## How to read this

**Method:** how a check is decided. Always use the cheapest method that can actually decide it.

| Method | Meaning |
|---|---|
| `CODE` | Deterministic script. Same input, same verdict. |
| `TOOL` | Sanskrit tooling or dictionary (Vidyut, Sanskrit Heritage, Cologne Monier-Williams/Apte). Deterministic, but the tool can be wrong or silent; "no parse" is a flag, not a fail. |
| `JUDGE` | Independent LLM call: fresh context, one check per call, rubric + evidence pack, never the drafter's reasoning. Calibrated on the gold set. |
| `HUMAN` | Reviewer decision. |

**Severity:** `blocker` must pass before a verse leaves the loop · `major` the loop tries to fix it, leftovers go to the human review queue · `minor` reported only.

**Decision:** ✅ kept as given · ✏️ kept, changed · ➕ added · ❌ dropped (see the end).

**Format:** checks marked **v0.3** use the pada layer added in data format 0.3.0.

---

## Tier 0: Source text ➕
The text must be correct before anything is analysed. A wrong akṣara poisons every later check.

| ID | Check | Method | Severity | |
|---|---|---|---|---|
| T0.1 | **Text lock.** The verse text equals the locked text (hash stored at lock time); no later step may change it | CODE | blocker | ➕ |
| T0.2 | **Recension consensus.** Text diffed across ≥3 independent sources; chosen reading and every variant recorded | CODE + HUMAN | blocker | ➕ |
| T0.3 | **Unicode hygiene.** NFC; no Latin/ASCII lookalikes inside Devanagari; dandas are U+0964/U+0965, not `\|`; no stray ZWJ/ZWNJ; Devanagari digits in verse numbers | CODE | blocker | ➕ |
| T0.4 | **Meter scan at lock time.** Run T3.1 on the raw text: a meter break usually means a typo or a wrong source | CODE | major | ➕ |

## Tier 1: Structure and integrity (all `CODE`)

| ID | Check | Severity | |
|---|---|---|---|
| T1.1 | **Schema validity.** Types, required keys, non-empty strings, enums. One schema definition (Zod in `lib/schema.ts`) exported as JSON Schema for the Python checks, not a second hand-written Pydantic model | blocker | ✏️ |
| T1.2 | **Lossless token coverage.** Display words concatenated in order equal the locked verse with whitespace, dandas and numerals removed | blocker | ✅ |
| T1.3 | **Lossless pada coverage.** The padaccheda parts, re-joined by sandhi (T2.1), reproduce each word, so nothing is silently dropped. Particle watchlist: *ca, vā, api, hi, eva, tu, iti, na, he, bho, aho, khalu, nu, sma*; any present in the surface must be its own pada | blocker | ✅ |
| T1.4 | **Romanisation charset.** IAST only (ā ī ū ṛ ṝ ḷ ṃ ḥ ṅ ñ ṭ ḍ ṇ ś ṣ). No ASCII approximations (sh, ri, ee, aa), no ISO 15919 forms (ṁ, r̥), lowercase except titles | blocker | ✏️ one standard, not "IAST / ISO 15919" |
| T1.5 | **Devanagari ↔ IAST round-trip.** Transliterate every `sa` field (words, padaccheda, components, roots) and compare with its `iast`. Catches typos the charset check can't | blocker | ➕ |
| T1.6 | **Anvaya permutation.** The anvaya is an ordered list of pada ids; its set equals all padas plus the adhyāhāra items, with no duplicates or gaps. **v0.3** | blocker | ✏️ ids instead of integers (the same check with fewer ways to fail) |
| T1.7 | **Reference integrity.** Every ref, compound member, concept, source, link and citation resolves (already in `validate.mjs`) | blocker | ➕ |
| T1.8 | **Completeness by part of speech.** Noun/adjective: stem, gender, case, number. Finite verb: dhātu, gaṇa, lakāra, person, number, pada, prayoga. Participle/absolutive/infinitive: kṛt suffix. Indeclinable: no inflection fields. Compound member: no case | blocker | ➕ |
| T1.9 | **Cross-verse consistency.** The same surface form in the same use (refrains, repeated epithets) gets the same analysis; any difference needs a note | major | ➕ |
| T1.10 | **Terms inside English text.** No `shiva`, `tatpurusha`, `Shankar` in prose fields; Sanskrit terms in IAST | minor | ➕ |

## Tier 2: Phonology and morphology

| ID | Check | Method | Severity | |
|---|---|---|---|---|
| T2.1 | **Sandhi reversibility.** Applying sandhi to the padaccheda parts regenerates the surface form, and the recorded `sandhi.rule` is the rule actually applied. Tool first, rule table as fallback (savarṇa-dīrgha, guṇa, vṛddhi, yaṇ, ayādi, pūrvarūpa, visarga, anusvāra, consonant assimilation); an undecidable case is flagged | TOOL + CODE | blocker | ✅ |
| T2.2 | **Avagraha restoration.** Every ऽ: the next part starts with अ, and the previous part shows its pre-sandhi ending (सोऽहम् → सः + अहम्), or, for ाऽ, a + a merged to ā (जनाऽवहूत → jana + avahūta) | CODE | blocker | ✅ |
| T2.3 | **Visarga / anusvāra / final-consonant restoration.** -o before a voiced sound restored to -aḥ; anusvāra before a consonant restored to -m; assimilated finals restored (ḍamaḍ → ḍamat) | CODE + TOOL | major | ➕ |
| T2.4 | **Form-generation round-trip (the keystone check).** Generate the form from the stated analysis (stem + gender + case + number, or dhātu + gaṇa + lakāra + person + number + pada + prayoga) with Vidyut's Pāṇinian derivation engine; it must equal the padaccheda form. On a mismatch, report the analyser's candidates as the suggested fix. One check that verifies most of the "stem vs inflection" and "dhātu" items at once | TOOL | blocker | ➕ |
| T2.5 | **Lemma, not surface.** The stem is the uninflected prātipadika and exists as a dictionary headword (*rāma*, not *rāmāt*) | TOOL | blocker | ✅ |
| T2.6 | **Dhātu validity.** Dhātu + gaṇa exists in the Dhātupāṭha; upasargas listed separately; derived stems marked (ṇic causative, san desiderative, yaṅ intensive, nāmadhātu) | TOOL | blocker | ✏️ derived roots added |
| T2.7 | **Kṛt / taddhita suffix.** Non-finite forms carry a suffix from an enum (kta, ktavatu, śatṛ, śānac, ktvā, lyap, tumun, tavya, anīya, yat, ṇvul, lyuṭ…); derived nominals carry their taddhita. Rule: *lyap* only with an upasarga, *ktvā* only without | CODE + TOOL | major | ✏️ taddhita and the lyap/ktvā rule added |
| T2.8 | **Samāsa typing.** Type from enum: tatpuruṣa (vibhakti-tatpuruṣa, karmadhāraya, dvigu, nañ, upapada), bahuvrīhi, dvandva (itaretara / samāhāra), avyayībhāva. Vigraha present; only the final member inflected; a bahuvrīhi agrees with the noun it qualifies | CODE (structure) + JUDGE (type) | major | ✏️ sub-types added |
| T2.9 | **Compound structure.** Compounds of 3 or more members carry a bracketed structure, e.g. `((jaṭā-aṭavī)-(galat-jala-pravāha))-pāvita-sthala`, so nesting is explicit. **v0.3** | JUDGE | major | ✏️ replaces "show intermediate stems" |
| T2.10 | **Analyser agreement.** Each pada's analysis is among the analyser's candidates; a poetic or irregular form (ārṣa-prayoga) with no parse is marked `irregular: true` with a note | TOOL | major | ➕ |

## Tier 3: Syntax and prosody

| ID | Check | Method | Severity | |
|---|---|---|---|---|
| T3.1 | **Meter conformance.** Syllabify, mark laghu/guru (long vowel, anusvāra, visarga or a following conjunct makes guru; the pāda-final syllable is free) and compare with the declared meter's pattern per pāda. Meter definitions in `data/meters.json`; a meter may give `pada_patterns` (one pattern per pāda, `null` = unchecked) for a verse whose refrain pāda is in another meter (`vasantatilaka-refrain`, Śivapañcākṣara v2). Upajāti is not scanned yet (several allowed patterns). **v0.3** | CODE | blocker | ✅ promoted to deterministic |
| T3.2 | **Pāda boundaries.** Lines map to pādas; a compound running across a pāda boundary is allowed but flagged | CODE | major | ✅ |
| T3.3 | **Agreement, prayoga-aware.** Kartari: finite verb agrees with the nominative kartā in person and number. Karmaṇi/bhāve: with the nominative karma, or 3rd singular. Adjectives agree with their head in gender, case and number; *yad/tad* pairs agree. Deterministic once each pada has a `head`. **v0.3** | CODE | blocker | ✏️ the given "kartā = nominative" breaks on passives |
| T3.4 | **Kāraka assignment.** Each pada has a role (kartā, karma, karaṇa, sampradāna, apādāna, adhikaraṇa; plus non-kāraka sambandha, sambodhana, viśeṣaṇa, kriyā-viśeṣaṇa) and a head. Case matches role given the prayoga, allowing upapada-vibhakti (*namaḥ* + dative, *saha* + instrumental). **v0.3** | JUDGE + CODE | major | ✏️ |
| T3.5 | **Adhyāhāra flagged and grounded.** Supplied words exist only as anvaya items with `adhyahara: true`. The translation adds no content word that isn't grounded in a pada or an adhyāhāra item. Covers verbless verses of epithets, where the implied *namāmi / bhaje / namaḥ* is adhyāhāra, not invented meaning. **v0.3** | CODE + JUDGE | blocker | ✅ |
| T3.6 | **Anvaya is good prose.** Read in anvaya order, it is grammatical Sanskrit a paṇḍita would accept | JUDGE | major | ➕ |

## Tier 4: Meaning, mapping and theology

| ID | Check | Method | Severity | |
|---|---|---|---|---|
| T4.1 | **Meaning accuracy.** Each word meaning is supported by a dictionary sense and agrees with at least one published word-by-word source; conflicts become `alternatives` | JUDGE + CODE | blocker | ➕ |
| T4.2 | **Polysemy.** The chosen sense is recorded (dictionary + headword/sense) and fits the deity and context (*hari* in a Śaiva hymn ≠ "monkey"). **v0.3** | JUDGE | major | ✅ made checkable |
| T4.3 | **Literal vs contextual.** Required only where they differ (metaphor, epithet, bahuvrīhi, rūpaka/upamā): `literal` (vācyārtha) beside the contextual meaning (lakṣyārtha). Suggested sense (vyaṅgyārtha) goes in an annotation. **v0.3** | JUDGE | major | ✏️ not for every word |
| T4.4 | **Epithet deconstruction.** Words flagged `epithet` carry a vigraha/derivation and meaning (*tripurāntaka* = destroyer of the three cities), not just "Śiva". **v0.3** | CODE (present) + JUDGE (quality) | major | ✅ |
| T4.5 | **Tradition handling.** The file declares its `tradition`. Base meanings follow the plain textual sense; school-specific readings (Advaita, Viśiṣṭādvaita, Gauḍīya, Śaiva Siddhānta…) go in `alternatives` or annotations, attributed to that school or commentator. **v0.3** | JUDGE | major | ✏️ attribute rather than "align"; we don't impose one school |
| T4.6 | **Segment mapping precision.** Each translation segment actually translates the words in its `refs`, so hover never lights the wrong word. Core to our UI | JUDGE | blocker | ➕ |
| T4.7 | **EN ↔ HI parity.** Both translations carry the same content at comparable granularity | JUDGE | major | ➕ |
| T4.8 | **Fluency and register.** Natural English with no archaic forms (`thee`/`thou`/`thy`, checked by regex); natural modern Hindi, not Sanskritised word salad; correct Hindi spelling | CODE + JUDGE | major | ➕ |
| T4.9 | **Annotation grounding.** Every claim in an annotation is entailed by its cited evidence excerpt; every `quote` appears verbatim in the evidence pack | CODE (quotes) + JUDGE (claims) | blocker | ➕ |
| T4.10 | **Neutrality.** Tradition stated as tradition; no health or benefit claims beyond quoting the phalaśruti (red-flag phrase regex plus judge) | CODE + JUDGE | major | ➕ |

## Tier 5: Vernacular bhajans (Awadhi, Braj, Old Hindi)
Active when `language ≠ sa`. Needs the vernacular word schema (**v0.3**); first real use is the Hanuman Chalisa.

| ID | Check | Method | Severity | |
|---|---|---|---|---|
| T5.1 | **Language tagging.** Language/dialect per file and per line (Awadhi, Braj, Khaṛī Bolī; Sanskrit ślokas inside a bhajan are tagged `sa` and get Tiers 2–3) | CODE | blocker | ➕ |
| T5.2 | **Etymon.** Each word records its relation (tatsama · ardhatatsama · tadbhava · deśaja · videśī (Perso-Arabic)) and the source form (*Kanhā* ← *kṛṣṇa*, *bhagati* ← *bhakti*) | JUDGE + dictionary | major | ✏️ deśaja and videśī added |
| T5.3 | **Oblique forms and postpositions.** Dialect case markers (*kau, ko, sõ, mahi̐/mahu̐, te, pai, ke, kī*) and dialect verb forms parsed | JUDGE | major | ✅ |
| T5.4 | **Bhaṇitā / chhāp.** The signature line is marked `kind: "bhanita"`; the poet is never made the deity's agent in the prose (poet-name list + judge) | CODE + JUDGE | blocker | ✅ |
| T5.5 | **Mātrā meter.** Mātrā counts per caraṇa match the declared meter (dohā 13+11, chaupāī 16, …); lengthening or shortening for rhyme or meter flagged on the word (`metri_causa`) | CODE | major | ✏️ deterministic, includes tuk |
| T5.6 | **Spelling variants.** Manuscript/regional spellings normalised with the original kept (e.g. ष read as kh) | CODE + JUDGE | minor | ➕ |

## Tier 6: Provenance and process ➕
What makes "highly accurate" provable rather than claimed.

| ID | Check | Method | Severity |
|---|---|---|---|
| T6.1 | **Evidence before drafting.** An evidence pack (source texts, dictionary entries, analyser output) exists for the verse before any draft | CODE | blocker |
| T6.2 | **Confidence calibration.** `high` only if ≥2 independent sources agree, the tool checks passed and the 3 independent drafts agreed; otherwise capped at `medium`/`low` automatically | CODE | blocker |
| T6.3 | **No copying.** 8-word overlap between our EN/HI text and any source translation in the evidence pack stays under the threshold | CODE | blocker |
| T6.4 | **Audit trail.** Every iteration appends to `review.history`; the locked text never changes | CODE | major |
| T6.5 | **Gold-set regression.** A pipeline or prompt change may not lower accuracy on the hand-verified gold set (applies to pipeline changes, not to data) | CODE | blocker |

---

## Dropped or replaced ❌

| From the original list | Why | Replaced by |
|---|---|---|
| Pydantic validation as its own model | Two schemas drift apart | T1.1: one Zod schema, exported as JSON Schema |
| "IAST / ISO 15919" | Mixing standards is itself a defect | T1.4 IAST only; ISO accepted as input and converted |
| Integer `anvaya_index` per word | Same guarantee, more failure modes (renumbering on every edit) | T1.6 ordered id list |
| "Kartā = nominative, karma = accusative" as a rule | False in karmaṇi/bhāve prayoga, with participles and with upapada-vibhakti | T3.3 + T3.4, prayoga-aware |
| "Sampradāya alignment" | Forcing one school on the base meaning is itself sectarian, and attribution of many stotras (Śaṅkara's included) is debated | T4.5 attribute readings |
| Literal + contextual meaning for every word | Doubles the work and adds noise where they're identical | T4.3 only where they differ |
| "Show intermediate stems" as a flat list | Loses the nesting that makes long compounds readable | T2.9 bracketed structure |

**Deliberately not checked:**
- Svara (Vedic accent) marks: out of scope for stotras; revisit for Vedic sūktas (Rudram, Puruṣa-sūkta).
- "Devotional beauty" of the translation: subjective; covered only as fluency (T4.8).

## How the loop uses this
1. Order: Tier 0 → 1 → 2 → 3 → 4 (→ 5) → 6. A failed blocker in an earlier tier stops later tiers for that verse, because judging the meaning of a mis-parsed word wastes calls.
2. Every check emits `{ check, verse, path, verdict, evidence, suggested_fix }` into `data/reports/<id>/<verse>.json`.
3. Repair receives only failing items plus their evidence, and returns patches to those paths. A patch is kept only if no other check gets worse.
4. A verse exits when all blockers pass and judge scores meet the threshold, after at most 4 rounds, or when 2 rounds pass without improvement. What's left goes to the human review queue.
5. Judges are calibrated: each `JUDGE` check is run on the gold set, and its agreement with the human verdicts is tracked. A judge below ~90% agreement is reworded before it's trusted.

## Implementation status (2026-10-20)

Run with `npm run checks -- run data/stotrams/<id>.json --verse v2`; the self-test `.venv/bin/python -m checks.selftest` plants a defect for each deterministic check and asserts it is caught.

| Where | Checks |
|---|---|
| `scripts/validate.mjs` (Zod + cross-references; also T1.1 in reports) | T1.1, T1.6, T1.7 |
| `checks/text.py` | T0.1, T0.2, T0.3, T1.2, T1.4, T1.5, T1.10, T4.8a (archaic English), T4.10a (benefit claims, flag) |
| `checks/morph.py` (Vidyut) | T1.3, T1.8, T2.1–T2.10 |
| `checks/syntax.py` | T1.9, T3.1, T3.3, T3.4a (role ↔ case), T3.5a (adhyāhāra structure, cycles) |
| `checks/provenance.py` | T4.9a (quotes verbatim), T6.1–T6.4 |
| `checks/judges/*.md` + `stotram-judge` agent | T2.8b, T2.9b, T3.4, T3.5, T3.6, T4.1–T4.10 |
| covered elsewhere | T0.4 = T3.1 run at lock time; T3.2 is enforced by T3.1 (lines are pādas, `pada_count` splits them) |
| **not yet** | Tier 5 (vernacular): activates with the first Awadhi/Braj file; T6.5 gold regression needs a human-verified gold set (`data/gold/`, currently unverified) |

### What the tools taught us
- **Vidyut's meter table differs from the classical definitions** (pañcacāmara listed with 12 syllables, not 16), so meters live in our `data/meters.json`; Vidyut only supplies syllable weights.
- **lyap** is generated as *ktvā* on a prefixed root; **enclitic pronouns** (naḥ, me, te…) aren't generated, so they're whitelisted (Aṣṭādhyāyī 8.1.20–22).
- **The lexicon has gaps** (e.g. *aṭavī*, *lambitām*), so "not in the lexicon" is a flag, never a fail.
- The sandhi splitter panics on an end-of-string index; the runner turns any tool crash into a flag rather than a pass.
