# v11: stotram-refine run, 2026-10-23

**Outcome:** `ai_verified`. Penalty 0 → 100 → 0. 10/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v11 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-11 --confirm "<your name>"`
- T2.1 `words.w3.padaccheda`: Vidyut's sandhi rules can't split 'bhujaṅgamaśvasa' into bhujaṅgama + śvasat; verify by hand
- T2.1 `words.w4.padaccheda`: Vidyut's sandhi rules can't split 'dvinirgamatkrama' into vinirgamat + krama; verify by hand
- T2.9b `compounds.c1.structure`: Groups (karāla-bhāla)-havyavāh; vyakhya-sts-11 reads karāla-(bhāla-havyavāh) (भालहव्यवाट् = ललाटाग्नि, the fire is fierce). Only one grouping is mentioned. (suggested: Mention the other grouping in c1.note, or switch.)
- T4.2 `words.w7.components[2].sense`: maṅgala is adjectival here but sense cites the neuter noun 'anything auspicious'; MW's mfn. 'auspicious, lucky' fits. (suggested: sense.gloss 'auspicious, lucky')
- T4.9 `annotations.a3.body`: MW records havya-vāha (a-stem), not havya-vāh, as 'Agni or fire'. (suggested: '…Monier-Williams records the related havya-vāha as a name of Agni or fire.')
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
