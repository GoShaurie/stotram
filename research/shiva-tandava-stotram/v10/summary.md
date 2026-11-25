# v10: stotram-refine run, 2026-10-23

**Outcome:** `ai_verified`. Penalty 100 → 0. 4/11 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v10 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-10 --confirm "<your name>"`
- T3.5 `translations.hi.lines[0][3].text`: HI 'उमड़ने पर रीझे भँवरे' adds 'charmed', which no pada says (vyakhya calls Śiva रसिक). (suggested: 'उमड़ती मधुरता पर मँडराते भँवरे' or EN 'the bee delighting in the welling-up'.)
- T4.7 `translations.hi.lines[0][3].text`: HI bee is charmed by the welling-up, EN merely 'at' it. (suggested: Align EN and HI.)
- T4.8 `translations.en.lines[1]`: EN line 2 stacks five prepositional phrases plus an appositive; stilted though faithful. (suggested: 'the bee drawn to the sweetness welling up in the nectar that flows from the blossom-cluster of the great Sarvamaṅgalā's arts;')
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
