# v6: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0 → 0. 16/24 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v6 --sources brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,ramakrishna-math-mantrapushpam,sanskritdocuments-vedasarast,vanivilas-1910-works-17 --confirm "<your name>"`
- T2.1 `words.w3.padaccheda`: Vidyut's sandhi rules can't split 'cāpo' into ca + āpaḥ; verify by hand
- T2.5 `p15.morph.stem`: stem 'tandrā' equals the inflected form; check it is the prātipadika
- T2.5 `p17.morph.stem`: stem 'nidrā' equals the inflected form; check it is the prātipadika
- T2.8 `p30`: bahuvrīhi c1 has role 'kartā'; it should qualify something unless it stands alone as a name: confirm
- T1.9 `v11.p2`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p10`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p17`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p18`: 'etat' is analysed differently in v10 and v11; fine if the context differs, but say why
