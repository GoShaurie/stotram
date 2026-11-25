# Verse 2: stotram-refine run, 2026-10-20

**Outcome:** `ai_verified`. All blocker and major checks pass, all 15 judges ran, 0 failures. 7 flags need a human (below). The final step, `reviewed`, is yours.

## Trajectory
| Stage | Penalty | Notes |
|---|---|---|
| Evidence | | 6 text/translation/commentary sources (5 independent text witnesses incl. the Ramakrishna Math *Mantrapushpam* print edition), 22 Monier-Williams entries, Vidyut analyses. Meter scan: clean pañcacāmara on all 4 pādas. |
| 3 drafts | A 110 · B 110 (+1 flag) · C 114 | 11/12 words analysed identically by all three; they differed only on w5 (*mūrddhani* vs *mūrdhani* in the split). Draft A kept. |
| Round 1 checks + 15 judges | 100 | 1 fail: w5 confidence must be ≤ medium (drafts disagreed). Judges: 0 fails, 5 flags. |
| Repair (1 op) | **0** | w5 → medium. No regressions. |

Judge calibration: 3/3 planted errors caught (`calibration/results.md`).

## Needs a human
1. **Confirm the text lock** after reading `text-report.md`. The only variant is मूर्द्धनि vs मूर्धनि (the same word; meter unaffected). Then run:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v2 --sources sanskritdocuments-shivtand,sa-wikisource-shivatandava,ramakrishna-math-mantrapushpam,vyakhya-sts-2,shlokam-shiva-tandava --confirm "<your name>"`
2. **w6 *dhagad*: sound or blaze?** The draft says "crackling" (MW *dhagaddhag-iti* "crack! crack!"). vyakhya.org says धधकती and shlokam says "brilliant". Probably both are intended (the onomatopoeia of a blaze), but record the alternative and decide the confidence (T4.1 flag).
3. **c1 note vs structure:** the note reads *virājamāna-mūrdhan* as a unit, but the structure attaches *virājamāna* to the wave-vines. Pick one, or note both (T2.9b flag).
4. **Citation locators:** a3 and a4 cite vyakhya "शब्दार्थ"; the section is the पदच्छेद block (T4.9 flags). Quotes are verbatim.
5. **kiśora sense:** trim the MW gloss to "a youth, lad" (drop "a colt") (T4.2 flag).
6. **Supplied śive (x2):** all three drafts supplied it as the noun the three bahuvrīhis qualify, matching the commentary's paraphrase. A reader could instead take *kiśoracandraśekhare* as a name standing alone. Your call.
7. *kiśoracandraśekhare* is not in Vidyut's lexicon (a long compound; nothing to compare). No action needed.

## Not in the evidence (deliberately left out)
- The forehead fire as Śiva's **third eye**: all three drafters held back because no fetched source says it. Add a source if you want that annotation.
- No Gita Press edition; greenmesg.org (CAPTCHA) and shaivam/vignanam (403) couldn't be fetched.

## Files
`text.txt`, `text-report.md`, `sources/` (evidence) · `analyzer.json` · `drafts/` · `consistency.json` · `report.json`, `report-r1.json` · `judges/` (verdicts, hash-stamped) · `iterations/` (snapshots) · `patches/` · `calibration/`
