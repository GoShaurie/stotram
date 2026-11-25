# v4: stotram-refine run, 2026-11-20

**Outcome:** `ai_verified`. Penalty 0 → 0. 12/13 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v4 --sources brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,kurma-purana-2-5,mahanarayana-upanishad-17-23,ramakrishna-math-mantrapushpam,ramayana-bala-1-43,sanskritdocuments-vedasarast,shlokam-vedasara-shiva-stava,shvetashvatara-upanishad,vanivilas-1910-works-17 --confirm "<your name>"`
- T2.1 `words.w7.padaccheda`: Vidyut's sandhi rules can't split 'tvameko' into tvam + ekaḥ; verify by hand
- T2.1 `words.w8.padaccheda`: Vidyut's sandhi rules can't split 'jagadvyāpako' into jagat + vyāpakaḥ; verify by hand
- T4.8 `verse.annotations.a1.body.hi`: "यही तीन चिह्न यह श्लोक पुकारता है" reads like a word-for-word copy of the English "the same three marks this verse calls out". In Hindi, पुकारना is used for calling a person or a name, not marks, so the sentence sounds slightly stilted. The rest of the English and Hindi (line translations, bhavartha, annotations, word meanings, asides, notes) is natural and spelled correctly. (suggested: यह श्लोक भी इन्हीं तीन चिह्नों से उन्हें पुकारता है।)
