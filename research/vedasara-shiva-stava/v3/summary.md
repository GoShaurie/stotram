# v3: stotram-refine run, 2026-11-20

**Outcome:** `ai_verified`. Penalty 0 → 0. 11/13 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v3 --sources bhagavata-8-7,brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,mahabharata-karna-8-24,mahanarayana-upanishad-17-23,ramakrishna-math-mantrapushpam,sanskritdocuments-vedasarast,shiva-purana-vidyeshvara,shlokam-vedasara-shiva-stava,shvetashvatara-upanishad,vanivilas-1910-works-17 --confirm "<your name>"`
- T2.1 `words.w5.padaccheda`: Vidyut's sandhi rules can't split 'gavendrādhirūḍhaṃ' into go + indra + adhirūḍham; verify by hand
- T4.9 `annotations.a3.body`: a3 calls Bhava 'an old name of Śiva', citing mw-bhava p. 749. The excerpt (research/vedasara-shiva-stava/v3/sources/mw-bhava.md, p. 749,1) is more careful. In the AV, Bhava is 'a deity attending on Rudra and frequently connected with Śarva', and the excerpt calls it a '(later N. of Śiva or a form of Śiva)'. So the name is old, but the excerpt dates its use for Śiva as later. The claim may be slightly stronger than the source. A human should decide whether the wording needs to change. (suggested: e.g. 'Bhava, an ancient name that came to mean Śiva, from bhū, to be, to become' (hi: 'भव, एक प्राचीन नाम जो आगे चलकर शिव का नाम बना, भू (होना, बनना) से'))
