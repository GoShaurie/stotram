# v8: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 12/16 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v8 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.1 `words.w15.padaccheda`: Vidyut's sandhi rules can't split 'āpannamāmīśa' into āpannam + mām + īśa; verify by hand
- T2.4 `p12`: irregular form 'śambhu'; generator gives ['śambho']. Note: Ārṣa form: śambhu used for calling out instead of the regular śambho, in every witness; listed as an ārṣa usage in sanskritdocuments-rudra8's note ('शम्भु in सम्बोधनं instead of शम्भो'). The short -u also gives the light syllable the meter needs at this place; the same name appears in its regular form śambho at the end of the verse.
