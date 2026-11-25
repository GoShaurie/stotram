# v5: stotram-refine run, 2026-11-20

**Outcome:** `ai_verified`. Penalty 0 → 0. 10/14 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v5 --sources brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,katha-upanishad,linga-purana-1-3,mandukya-upanishad,ramakrishna-math-mantrapushpam,sanskritdocuments-vedasarast,shiva-purana-vidyeshvara,shlokam-vedasara-shiva-stava,shvetashvatara-upanishad,taittiriya-upanishad-3-1,vanivilas-1910-works-17 --confirm "<your name>"`
- T4.8 `annotations.a3.body.hi`: The Hindi is fluent overall, with two small inconsistencies. The story starts in the present tense ('भृगु ... कहता है', 'वरुण ... देते हैं') and then drops into the past ('भृगु ने तप किया'). The closing line also uses the plain 'जिसे मैं भजता हूँ' for the Lord, while the rest of the verse uses the respectful plural ('उन ईश्वर को', 'जिनसे', 'जिनमें'). Neither is a real grammar error, so a human should decide whether to smooth them out. (suggested: Keep the tense the same, e.g. 'भृगु ने तप किया' -> 'भृगु तप करने लगता है', and end with 'वही ईश्वर, जिन्हें मैं भजता हूँ।')
