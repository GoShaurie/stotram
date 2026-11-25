# v8: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 9/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/kalabhairava-ashtakam.json --verse v8 --sources gitapress-shiv-stotra-ratnakar,greenmesg-kalabhairava,ramakrishna-math-mantrapushpam,sanskritdocuments-kaalabhairava,sanskritdocuments-shivarahasya-kalabhairava,shlokam-kalabhairava,vanivilas-1910-works-18 --confirm "<your name>"`
- T4.9 `annotations.a2.body`: 'Tradition reads this as freedom' / 'परम्परा इसे मुक्ति मानती है' says more than the cited excerpt does. The only support is one modern translator's parenthetical in greenmesg-kalabhairava.md (verse 8, Meaning 8.2): '(thus revealing the Self in its pristine beauty)'. That supports 'nothing is left to hide the Self', but it never mentions freedom or liberation (mukti). It also does not show that a broad 'tradition' holds this reading. No other excerpt in the evidence links clearing both merit and sin to liberation. A human should decide whether 'revealing the Self' is close enough to 'freedom'. (suggested: Either cite an excerpt that ties the clearing of puṇya and pāpa to liberation, or soften the wording to match the source.)
- T4.9 `annotations.a1.body`: The ghosts in 'a night-time band of ghosts' / 'रात में घूमती प्रेतों की टोली' are supported (mw-bhuta.md p. 761,3; mw-samgha 'host'; shlokam and greenmesg verse 8), but none of the evidence says the band roams at night. This is probably harmless imagery, but it is stated as part of the picture rather than marked as interpretation. (suggested: Drop 'night-time' / 'रात में घूमती', e.g. 'a band of ghosts with Him at its head' / 'प्रेतों की टोली, जिसके आगे वे चलते हैं'.)
