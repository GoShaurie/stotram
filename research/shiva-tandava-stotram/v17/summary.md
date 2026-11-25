# v17: stotram-refine run, 2026-11-25

**Outcome:** `ai_draft`. Penalty 0 → 10. 8/14 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v17 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-17 --confirm "<your name>"`
- **FAIL T4.8** `translations.en.lines`: Read as one sentence, the EN lines 3-4 say: 'whoever recites at dusk, for him, steady, rich in chariots, great elephants and horses, Śambhu grants Lakṣmī, good fortune, ever kind-faced.' In English, an adjective phrase placed before the subject attaches to that subject. So 'steady, rich in chariots, great elephants and horses' describes Śambhu, but w8/w9 actually describe Lakṣmī (feminine accusative, agreeing with p10; vyakhya-sts-17 anvaya: 'स्थिरां ... लक्ष्मीं प्रददाति'). The sentence is stilted and misleads the reader about who is 'rich in chariots'. Line 2 is also awkward: 'whoever recites at dusk' has no object, because the hymn was named earlier, before the colon.
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
- T1.9 `v14.p3`: 'naḥ' is analysed differently in v1 and v14; fine if the context differs, but say why
