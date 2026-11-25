# Verse 5: stotram-refine run, 2026-10-21

**Outcome:** `ai_verified`. Penalty 201 → 10 → 0 over 2 repairs; final judging round: 0 fails.

## Needs a human
1. **Confirm the text lock.** Variant: श्रियै (5 of 6 witnesses, chosen) vs श्रिये. MW attests both datives, and the checker now accepts both (Pāṇini 1.4.6).
2. **a1 (EN) wording** suggests the Śiśupālavadha itself says "all the gods, Indra first". Raised by two independent judges; one-line fix suggested in `judges/T4.9.json`.
3. **EN final clause** "long be there for my prosperity" is stilted. Raised by three judges; suggested "may He long uphold my prosperity".
4. **HI bhāvārtha** repeats बँधी.
5. **w3 *lekha*:** "god" (MW) vs "row" (vyakhya, Samskrit Academy). **w7 *jāṭa*:** the long ā, and *-ka* as the *kap* suffix, rest on the drafters' grammar. Pāṇini locators 1.4.6, 5.4.154 and 7.3.79 in word notes are from memory.
6. *cakorabandhuśekharaḥ* (bahuvrīhi) is used as the subject, i.e. as a name (T2.8 flag): confirm.

## What this verse taught the checker
- Vidyut 0.4 needs feminine ā/ī stems marked as ṅyāp (*mālā → mālayā*), misses iyaṅ/uvaṅ for one-syllable ī/ū stems (gives *śryai*), and only generates the nadī forms (*bhuvām*, not *bhuvi*). All three are handled in `checks/morph.py`, with self-tests.
- Judges are non-deterministic: the Hindi "धूल झाड़ते थे" problem was caught on the second pass, not the first. Flags raised by several judges independently are the strongest signal for review.
- A new code check, T4.8b, catches the misspelling श्रृ (for शृ).
