# v5: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 12/12 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v5 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T4.8 `words.w8.aside.en`: English aside is hard to follow ('inside the word' separated from 'keeps' by an appositive). (suggested: Everyday Sanskrit would say *tri-* here. The poet instead puts *trayaḥ*, the form 'three' takes when it stands alone, inside the word: one of this hymn's old-style liberties.)
