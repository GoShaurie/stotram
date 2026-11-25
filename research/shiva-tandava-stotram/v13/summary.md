# v13: stotram-refine run, 2026-10-24

**Outcome:** `ai_verified`. Penalty 10 → 0. 9/15 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v13 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-13 --confirm "<your name>"`
- T2.1 `words.w9.padaccheda`: Vidyut's sandhi rules can't split 'vilolalolalocano' into vilola + lola + locanaḥ; verify by hand
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
- T1.9 `v14.p3`: 'naḥ' is analysed differently in v1 and v14; fine if the context differs, but say why
