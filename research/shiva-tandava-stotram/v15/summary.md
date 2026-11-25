# v15: stotram-refine run, 2026-10-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 9/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v15 --sources sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,vyakhya-sts-15 --confirm "<your name>"`
- T2.1 `words.w4.padaccheda`: Vidyut's sandhi rules can't split 'janā'vahūtajalpanā' into jana + avahūta + jalpanā; verify by hand
- T2.5 `p1.morph.stem`: stem 'pracaṇḍavāḍavānalaprabhāśubhapracāraṇī' equals the inflected form; check it is the prātipadika
- T2.5 `p2.morph.stem`: stem 'mahāṣṭasiddhikāminījanāvahūtajalpanā' equals the inflected form; check it is the prātipadika
- T2.9b `compounds.c2.vigraha`: The structure and the vigraha group c2 slightly differently. The structure '((((mahā-(aṣṭa-siddhi))-(kāminī-jana))-avahūta)-jalpanā)' and the note equate the siddhis with kāminī-jana as a unit, i.e. siddhi-(kāminī-jana). The vigraha 'महत्यः अष्टौ सिद्धयः एव कामिन्यः, तासां जनेन …' instead equates the siddhis with kāminīs and then takes their jana, i.e. ((siddhi-kāminī)-jana). The meaning is the same either way, and vyakhya-sts-15 splits it as 'महा + अष्टसिद्धि + कामिनीजन + अवहूत', which supports the structure. Even so, the two fields should match. (suggested: Align the vigraha with the structure: 'महत्यः अष्टौ सिद्धयः एव कामिनीजनः, तेन अवहूता जल्पना'.)
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
- T1.9 `v14.p3`: 'naḥ' is analysed differently in v1 and v14; fine if the context differs, but say why
