# v6: stotram-refine run, 2026-10-22

**Outcome:** `ai_verified`. Penalty 110 → 0. 10/11 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v6 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-6 --confirm "<your name>"`
- T2.8b `compounds.c1.vigraha`: Bahuvrīhi is right, but the vigraha has two agents: '…भया निपीतः' plus 'येन तत्'. With bhā as agent, the relative should be यस्य/यस्मिन्; or keep येन and treat bhā as the means. (suggested: …स्फुलिङ्गानां भया निपीतः पञ्चसायकः यस्य (यस्मिन्) तत्)
- T4.6 `translations.en.lines[1][0]`: 'that head which drank up the five-arrowed god of love' refs only w3 though 'that head' restates w9. (suggested: Split: {refs:[w9], 'that head'} + {refs:[w3], 'which drank up the five-arrowed god of love'}.)
- T4.8 `translations.en.lines[2][0]`: '…of its forehead, before which the lords of the gods bow' attaches to 'forehead', but w4 describes the head. (suggested: 'the head before which the lords of the gods bow')
- T4.9 ``: Registry entry mw-lekha points to MW lekha (leKa) but v6 evidence mw-lekha.md is lekhā (leKA): slug collision.
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
