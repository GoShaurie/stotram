# v1: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 8/11 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v1 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.9b `compounds.c2.structure`: The grouping ((brahma-veda)-(sva-rūpa)) is defensible, but the evidence also supports (brahma)-(veda-svarūpa), 'Brahman, who has the Veda as his form' (sanskritdocuments-rudra8.md English; gitapress-ramcharitmanas.md prints 'ब्रह्म वेदस्वरूपं' as two words, gloss 'ब्रह्म और वेदस्वरूप'). w5.notes cites Gita Press for the dvandva when it more likely backs the other grouping. A human should decide which grouping goes first. (suggested: Add the alternative grouping to compounds.c2.note and reword w5.notes.)
