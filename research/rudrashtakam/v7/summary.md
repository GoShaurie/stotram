# v7: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 11/15 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v7 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.4 `p13`: irregular form 'śānti'; generator gives ['śāntiḥ']. Note: Subject form written without the final visarga (regular: शान्तिः), like बालेन्दु in v3. Every spaced witness (gitapress, sanskritdocuments, greenmesg, wikisource) reads शान्ति; kashiraj and belvedere join it to the next word as a compound member. An ārṣa, Hindi-style form that keeps the rhythm.
- T2.4 `p14`: irregular form 'santāpanāśam'; generator gives ['santāpanāśaḥ']. Note: Subject of the supplied bhavati, but written with -am (regular masculine subject form: सन्तापनाशः), in every witness. The -am matches sukham beside it and the -am ending of the hymn's other lines; gitapress's Hindi reads it as a subject ('न उनके तापोंका नाश होता है'). Ārṣa usage.
- T2.4 `p17`: irregular form 'sarvabhūtādhivāsam'; generator gives ['sarvabhūtādhivāsa']. Note: Addressed to the Lord beside prabho, but written with -am (regular calling-out form: सर्वभूताधिवास), in every witness; gitapress and sanskritdocuments translate it as an address ('हे समस्त जीवोंके अंदर (हृदयमें) निवास करनेवाले प्रभो'). The -am keeps the line-end rhyme of the hymn. Ārṣa usage, like मन्मथारी in v6.
- T3.1 `lines[line 1]`: line 1: syllable(s) [3] break bhujaṅgaprayāta (got LGLLGGLGGLGG); recorded as irregular: Syllable 3 is light: in न यावद् उमा° the d joins the next vowel. Every witness (Gita Press, Kāśirāj, Belvedere 1926, sanskritdocuments, greenmesg) has this reading; Gita Press and Kāśirāj print यावद् with a virāma and a space, marking a pause in recitation.
- T4.5 `annotations.a4.body`: a4 states as plain fact that sarva-bhūta-adhivāsa is both 'the Lord inside every being' and 'the home of all beings'; most translations give one sense and c3's note calls them separate readings. (suggested: Hedge: 'can be heard both ways'; soften 'and holding them all'.)
- T4.8 `translations.en.lines`: Lines 1-3 grammatical but stilted: 'for people,' sits loose between clauses after 'they'. (suggested: line 2: 'people find, here in this world or the next,' / line 3: 'so long, no happiness, no peace, no end of torment.')
