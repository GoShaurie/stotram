# v9: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 7/11 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v9 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.4 `p5`: irregular form 'haratoṣaye'; generator gives ['haratoṣāya']. Note: Ārṣa form: the regular dative of haratoṣa is haratoṣāya; every witness reads haratoṣaye, listed among the hymn's ārṣa usages (sanskritdocuments-rudra8). The regular form would also make the 7th syllable of this even pāda heavy.
- T2.5 `p2.morph.stem`: stem 'idam' equals the inflected form; check it is the prātipadika
