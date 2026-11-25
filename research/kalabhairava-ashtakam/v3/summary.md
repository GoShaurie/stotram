# v3: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 8/9 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/kalabhairava-ashtakam.json --verse v3 --sources gitapress-shiv-stotra-ratnakar,greenmesg-kalabhairava,ramakrishna-math-mantrapushpam,sanskritdocuments-kaalabhairava,sanskritdocuments-shivarahasya-kalabhairava,shlokam-kalabhairava,vanivilas-1910-works-18 --confirm "<your name>"`
- T3.5 `translations.hi.bhavartha`: HI bhāvārtha says 'वे सबके आदि कारण हैं' ('the first cause of all'). No pada says 'सबके' (of all): ādikāraṇam is only 'a primary cause' (mw-adikarana.md, MW p. 137,1). The line segment ('जो आदि कारण हैं') and the EN bhāvārtha ('He is the first cause') both leave it out. It is a small addition and a reasonable thing to infer, so a human should decide whether to keep it. (suggested: '…, और वे आदि कारण हैं।')
- T4.9 `verse.annotations.a3.body`: Calling the tāṇḍava 'whirling' ('घूमता' in the Hindi) goes beyond the cited excerpt. mw-tandava.md (MW p. 441,3) gives only 'dancing (esp. with violent gesticulation), frantic dance (of Śiva and his votaries)', and no other evidence file mentions whirling. It is a small descriptive detail, but no source in the evidence supports it. (suggested: EN: 'Tāṇḍava is Śiva's wild, frantic dance'; HI: '*ताण्डव* शिव का उन्मत्त, प्रचण्ड नृत्य है'.)
