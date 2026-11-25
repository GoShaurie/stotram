# v5: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 9/9 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/kalabhairava-ashtakam.json --verse v5 --sources gitapress-shiv-stotra-ratnakar,greenmesg-kalabhairava,ramakrishna-math-mantrapushpam,sanskritdocuments-kaalabhairava,sanskritdocuments-shivarahasya-kalabhairava,shlokam-kalabhairava,vanivilas-1910-works-18 --confirm "<your name>"`
- T4.9 `annotations.a3.body`: 'Most printings keep the serpent' / 'अधिकतर मुद्रित पाठ सर्प को ही रखते हैं' generalises beyond the cited evidence. The a3 citations show three texts with śeṣa-pāśa…maṇḍalaṃ (gitapress-shiv-stotra-ratnakar.md, ramakrishna-math-mantrapushpam.md, and the main text of sanskritdocuments-kaalabhairava.md) and two with keśa-pāśa…nirmalaṃ (vanivilas-1910-works-18.md, sanskritdocuments-shivarahasya-kalabhairava.md). Three of five texts does not show that 'most printings' have the serpent. No excerpt makes a claim about printings in general. This is a borderline case of a claim stronger than its source, so a human should decide. (suggested: Soften the wording to something the excerpts support, e.g. en: 'Other printings keep the serpent: …' / hi: 'अन्य मुद्रित पाठ सर्प को ही रखते हैं: …'.)
