# v6: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 8/9 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v6 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.4 `p4`: irregular form 'purārī'; generator gives ['purāriḥ']. Note: Ārṣa form: purārī for purāriḥ (or purāre), in every witness; listed as an ārṣa usage in sanskritdocuments-rudra8's note.
- T2.4 `p9`: irregular form 'manmathārī'; generator gives ['manmathāre']. Note: Ārṣa form: manmathārī for manmathāre (or manmathāriḥ), in every witness; listed as an ārṣa usage in sanskritdocuments-rudra8's note.
