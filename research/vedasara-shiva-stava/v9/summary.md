# v9: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 15/18 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v9 --sources bhagavata-8-7,brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,kumarasambhava-3,linga-purana-1-101,linga-purana-1-72,mahabharata-karna-8-24,ramakrishna-math-mantrapushpam,sanskritdocuments-vedasarast,shlokam-vedasara-shiva-stava,shvetashvatara-upanishad,vanivilas-1910-works-17 --confirm "<your name>"`
- T2.1 `words.w13.padaccheda`: Vidyut's sandhi rules can't split 'tvadanyo' into tvad + anyaḥ; verify by hand
