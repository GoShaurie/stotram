# v3: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 6/7 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v3 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.4 `p5`: irregular form 'lasadbhālabālendu'; generator gives ['lasadbhālabālenduḥ']. Note: Subject form written without the final visarga (regular: लसद्भालबालेन्दुः). An ārṣa, Hindi-influenced form listed as such by sanskritdocuments-rudra8 (note on ārṣa forms: 'बालेन्दु without विसर्गः'); all witnesses read बालेन्दु. It keeps the rhythm and the Hindi-style ending.
- T2.5 `p4.morph.stem`: stem 'sphuranmaulikallolinīcārugaṅgā' equals the inflected form; check it is the prātipadika
- T4.9 `annotations.a2.body`: 'Bhagīratha brought this river of the sky down to earth' stated as plain fact; mw-ganga hedges it ('is said to have'). Mythological narration; a human should decide.
