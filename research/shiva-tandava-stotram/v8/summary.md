# v8: stotram-refine run, 2026-10-22

**Outcome:** `ai_verified`. Penalty 200 → 0. 10/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v8 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-8 --confirm "<your name>"`
- T2.8b `compounds.c2.type`: Raised again independently: typed upapada, but dhara = √dhṛ + ac (3.1.134) makes it a ṣaṣṭhī tatpuruṣa in strict Pāṇinian terms. Pick a label and make it match the formation. (suggested: type tatpuruṣa, subtype ṣaṣṭhī, vigraha निलिम्पनिर्झर्याः धरः)
- T4.7 `translations.hi.lines[0][3]`: prabandha: EN "unbroken mass" vs HI "घने पुंज" (dense); the component gloss and MW stress continuity. (suggested: अटूट पुंज)
- T4.9 `annotations.a4.body`: a4 places the kuhū night in "the first line", but kuhūniśīthinītamaḥ opens line 2 (and a1 counts that way). (suggested: "the second line" / "दूसरी पंक्ति", or "the first half-verse".)
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
