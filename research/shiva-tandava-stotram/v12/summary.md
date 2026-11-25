# v12: stotram-refine run, 2026-10-23

**Outcome:** `ai_verified`. Penalty 0 → 0. 7/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v12 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-12 --confirm "<your name>"`
- T2.1 `words.w2.padaccheda`: Vidyut's sandhi rules can't split 'bhujaṅgamauktikasrajo' into bhujaṅga + mauktika + srajoḥ; verify by hand
- T2.1 `words.w3.padaccheda`: Vidyut's sandhi rules can't split 'rgariṣṭharatnaloṣṭhayoḥ' into gariṣṭha + ratna + loṣṭhayoḥ; verify by hand
- T4.9 `annotations.a5.body`: Implies sanskritdocuments lacks samapravṛttikaḥ … bhajāmy aham; both its pages print it as main text and give the other pāda only as a bracketed variant. (suggested: 'Both sanskritdocuments.org pages, while reading samapravṛttikaḥ … bhajāmy aham in the main text, give a variant last pāda in brackets…')
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
