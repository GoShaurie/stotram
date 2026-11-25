# v14: stotram-refine run, 2026-10-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 9/13 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-tandava-stotram.json --verse v14 --sources sa-wikisource-shivatandava,sanskritdocuments-shivtand-meaning,sanskritdocuments-shivtand,vyakhya-sts-14 --confirm "<your name>"`
- T2.9b `compounds.c1.iast`: Outside this check: compounds.c1.iast spells the member as 'kṣaran' (nilimpa-...-nirbhara-kṣaran-madhūṣṇikā-...), but structure, vigraha and words.w3.padaccheda use the stem kṣarat. The structure grouping itself passes: ((…mallikā-nigumpha)-(nirbhara-kṣarat))-(madhu-uṣṇikā))-manohara matches the vigraha 'तासां निगुम्फात् निर्भरं क्षरन्ती मधूष्णिका, तया मनोहरः'. (suggested: Use 'kṣarat' in compounds.c1.iast to match the structure, or confirm that the iast field is meant to show the surface form.)
- T3.4 `padas.p6`: aharniśam is attached to tanotu (p2) as a kriyā-viśeṣaṇa. vyakhya-sts-14 instead ties it to vinodinīm: its anvaya puts 'अह:निशं विनोदिनीं मनोमुदं' together, and its bhāvārtha reads 'निशि-दिवस हमें प्रसन्न रखने वाली', i.e. 'delighting day and night'. Both attachments are grammatical, but the data does not record the other one as an alternative. A human should decide. (suggested: Either keep head p2 and add a note or alternative that vyakhya.org attaches aharniśam to vinodinīm (head p5), or change the head to p5.)
- T4.8 `verse.translations.hi.lines[3]`: The Hindi sentence ends with one verb pair for both objects: 'हमारे मन का आनन्द, जो दिन-रात प्रसन्न रखे, और परम श्री का सर्वोच्च पद बढ़ाए और प्रदान करे।' Read naturally, both verbs then govern both objects, which gives the odd phrase 'पद बढ़ाए'. The English keeps the two verbs apart ('spread ... joy ... and grant ... seat'). The meaning can still be worked out, so this is a matter of natural style rather than a clear error. A human should decide. (suggested: Split the w5 segment so each verb follows its own object, as the English already does by using w5 three times. Line 3: add {refs:[w5], text:'बढ़ाए,'} after the w8 segment and change that segment to 'जो दिन-रात प्रसन्न रखे,'. Line 4: 'और परम श्री का' (w9) / 'सर्वोच्च' (w10) / 'पद' (w11) / {refs:[w5], text:'प्रदान करे।'}.)
- T1.9 `v6.p10`: 'naḥ' is analysed differently in v1 and v6; fine if the context differs, but say why
- T1.9 `v14.p3`: 'naḥ' is analysed differently in v1 and v14; fine if the context differs, but say why
