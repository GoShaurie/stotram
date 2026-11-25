# v4: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 12/12 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v4 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T3.5 `translations.en.bhavartha`: '...and still He is dear' (HI 'फिर भी वे प्रिय हैं') reads a contrast no pada states; evidence links priyam to śaṅkaram ('प्रिय है क्योंकि शंकर है'). Mild interpretive addition; human to decide. (suggested: Drop 'still' / 'फिर भी'.)
- T4.9 `annotations.a4.body`: a4 describes verse 3 (no verb; images before bhajāmi) but no v4 excerpt gives v3's text; link is #verse-3 not a v3 annotation. (suggested: Link to a v3 annotation or cite gitapress stanza 3.)
- T4.9 `annotations.a1.citations`: 'Śiva's voice offers a boon' rests on dohā 108 (ka) ('पुनि मंदिर नभबानी भइ द्विजबर बर मागु'), present in the excerpt but not cited. (suggested: Add citation ramcharitmanas-uttarakanda-104-108, 'Uttarakāṇḍa 108 (ka)', quote 'पुनि मंदिर नभबानी भइ द्विजबर बर मागु'.)
