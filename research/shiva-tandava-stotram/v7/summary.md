# v7: stotram-refine run, 2026-10-22

**Outcome:** `ai_verified`. Penalty 100 → 0. 8/9 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v7 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-7 --confirm "<your name>"`
- T2.1 `words.w2.padaccheda`: Vidyut's sandhi rules can't split 'dhagaddhagaddhagajjvala' into dhagat + dhagat + dhagat + jvalat; verify by hand
- T2.1 `words.w3.padaccheda`: Vidyut's sandhi rules can't split 'ddhanañjayāhutīkṛta' into dhanañjaya + āhutīkṛta; verify by hand
- T2.8 `p3`: bahuvrīhi c3 has role 'adhikaraṇa'; it should qualify something unless it stands alone as a name: confirm
- T3.5 `translations.en.bhavartha`: Bhāvārtha adds 'bends over Pārvatī' and 'the tenderest of lovers' (HI too); w5–w7 only say he is the peerless artist of the patterns on her breast. (suggested: '…with an artist's care, paints delicate leaf-patterns on the breast of Pārvatī…' (same in HI).)
- T4.9 `annotations.a1.body`: 'Most witnesses read bhāla' has no citation, though Mantrapushpam, Wikisource, sanskritdocuments and vyakhya all print करालभालपट्टिका. (suggested: Cite ramakrishna-math-mantrapushpam and sa-wikisource-shivatandava (quote 'करालभालपट्टिका').)
- T4.9 `annotations.a2.citations`: Locator 'श्लोक ७, शब्दार्थ' names a section vyakhya doesn't have; the glosses are in the पदच्छेद block. (suggested: 'श्लोक ७, पदच्छेद (word glosses)')
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
