# v2: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 9/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/kalabhairava-ashtakam.json --verse v2 --sources gitapress-shiv-stotra-ratnakar,greenmesg-kalabhairava,ramakrishna-math-mantrapushpam,sanskritdocuments-kaalabhairava,sanskritdocuments-shivarahasya-kalabhairava,shlokam-kalabhairava,vanivilas-1910-works-18 --confirm "<your name>"`
- T4.9 `annotations.a2.body`: Nearly all of a2's story is backed by mw-nilakantha.md (p. 566,2: 'N. of Śiva (as having a black throat from swallowing the poison produced at the churning of the ocean)'). One detail is not: 'The poison stayed in His throat' / 'वह विष उनके कण्ठ में ठहर गया'. MW says only that the throat turned black from swallowing the poison. None of the other evidence files mentions the throat (mw-halahala.md and mw-amrtamanthana.md say nothing about it). The detail is minor and well known, but no excerpt here supports it. (suggested: Either cite an ancient source that says the poison was held in the throat, or reword to what MW supports. EN: 'Śiva swallowed it, and it stained His throat dark'. HI: 'शिव ने उसे पी लिया, और उससे उनका कण्ठ गहरे रंग का हो गया'.)
