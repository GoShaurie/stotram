# v9: stotram-refine run, 2026-10-22

**Outcome:** `ai_verified`. Penalty 100 → 0. 8/11 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v9 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-9 --confirm "<your name>"`
- T2.1 `words.w3.padaccheda`: Vidyut's sandhi rules can't split 'valambikaṇṭhakandalī' into avalambi + kaṇṭha + kandalī; verify by hand
- T4.8 `translations.hi.lines[0][2].text`: "धारण करने वाले कण्ठ-नाल की": नाल is usually feminine (as in w3.literal.hi), so वाली. (suggested: धारण करने वाली कण्ठ-नाल की (and w3.meaning.hi))
- T4.9 `annotations.a2.body`: Says the Ramakrishna print starts line 2 with valambi; it actually hyphenates prabhā-valambi mid-line (breaks after रुचि-). shlokam and vyakhya do start line 2 with valambi. (suggested: 'The Ramakrishna Math print hyphenates prabhā-valambi, and shlokam.org and vyakhya.org start line 2 with valambi…' (HI to match))
- T4.10 `annotations.a3.body`: 'also cuts the devotee free' states a saving benefit as fact, unattributed (vyakhya calls him भवभयहारी). (suggested: Attribute: '…(vyakhya.org: भवभयहारी)'.)
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
