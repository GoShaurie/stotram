# v10: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 13/15 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v10 --sources brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,kurma-purana-1-30,linga-purana-1-72,mahanarayana-upanishad-17-23,ramakrishna-math-mantrapushpam,ramayana-bala-1-43,sanskritdocuments-vedasarast,shlokam-vedasara-shiva-stava,shvetashvatara-upanishad,taittiriya-upanishad-3-1,vanivilas-1910-works-17 --confirm "<your name>"`
- T2.1 `words.w10.padaccheda`: Vidyut's sandhi rules can't split 'jagadetadeka' into jagat + etat + ekaḥ; verify by hand
- T2.5 `p10.morph.stem`: stem 'jagat' equals the inflected form; check it is the prātipadika
- T4.9 ``: Outside this check: annotations.a3 body (en and hi) links verse 1 as '(#verse-1)', but every other cross-reference in this verse uses the '#v1-a1' / '#v5-a3' annotation-anchor form. Check that '#verse-1' is a valid anchor. If it isn't, point it at the verse-1 annotation about the elephant hide. The claim itself is already backed by Kūrma Purāṇa 1.30.18 in kurma-purana-1-30.md, so this is not a T4.9 failure.
- T1.9 `v11.p2`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p10`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p17`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p18`: 'etat' is analysed differently in v10 and v11; fine if the context differs, but say why
