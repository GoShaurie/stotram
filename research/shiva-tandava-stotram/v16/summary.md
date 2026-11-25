# v16: stotram-refine run, 2026-10-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 17/19 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v16 --sources ramakrishna-math-mantrapushpam,sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,shlokam-shiva-tandava,vyakhya-sts-16 --confirm "<your name>"`
- T2.1 `words.w6.padaccheda`: Vidyut's sandhi rules can't split 'smaranbruvannaro' into smaran + bruvan + naraḥ; verify by hand
- T2.8b `compounds.c1`: The type tatpuruṣa is correct and the meaning ('best among the best') is right. The vigraha उत्तमानाम् उत्तमः uses a genitive of selection (nirdhāraṇa), and Pāṇini 2.2.10 (na nirdhāraṇe) forbids a ṣaṣṭhī tatpuruṣa from such a genitive. Grammarians usually explain -uttama compounds like puruṣottama as saptamī tatpuruṣa, using the locative of selection allowed by 2.3.41 (e.g. puruṣeṣu uttamaḥ). The meaning does not change, so this is a flag, not a fail. (suggested: subtype: "saptamī", vigraha: "उत्तमेषु उत्तमः, तम्" (or keep ṣaṣṭhī and add a note on 2.2.10))
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
- T1.9 `v14.p3`: 'naḥ' is analysed differently in v1 and v14; fine if the context differs, but say why
