# Text report: kalabhairava-ashtakam (full text, 8 verses + phalaśruti)

Retrieved 2026-11-21. Eight verses with the refrain काशिकापुराधिनाथकालभैरवं भजे (v1–v8), plus one phalaśruti stanza (v9). The established text is in `fulltext/text.txt`. Each verse folder `vN/` holds its `text.txt`, its own `text-report.md` (that verse's slice of this report) and per-verse source excerpts (`vN/sources/`). Whole-text excerpts are in `fulltext/sources/`. No dictionary entries were saved; `checks dict` handles those.

## Text witnesses

| # | source id | kind | what it is | weight |
|---|-----------|------|------------|--------|
| A | `sanskritdocuments-kaalabhairava` | text | sanskritdocuments.org kaalabhairava.itx: Narayanaswami Pallasena's 2002 encoding, revised 2020 with Sunder Hattangadi. Round brackets after a line give **variants, all of which match B** (the file cites "Complete Works of Shankaracharya, Volume 18, page 89", i.e. B). The live site returned 403, so it was read from Wayback (2025-09-16 html, 2025-09-18 itx). The 2002 version (Wayback 2007-10-14) was also read. It differs in two places (v6, v9), noted below. | 1 vote |
| B | `vanivilas-1910-works-18` | text (print) | *Works of Sri Sankaracharya* vol. 18 (Stotras 2), Vani Vilas Press, Srirangam, 1910, pp. 89–91. Transcribed by eye from the archive.org page images. This is the oldest dated witness. The type **leaves out every anusvāra** and sometimes drops a reph or an e/o-mātrā. These are typesetting losses and are not counted as readings. | 1 vote |
| C | `gitapress-shiv-stotra-ratnakar` | translation (print) | Gita Press *Shiv Stotra Ratnakar* (code 1417), no. 49, pp. 201–204, with Hindi translation. Transcribed by eye from the page images. | 1 vote |
| D | `ramakrishna-math-mantrapushpam` | text (print) | Ramakrishna Math *Mantrapushpam*, 3rd ed. 2007, no. 24, pp. 482–484. Transcribed by eye from the page images. Hyphens are the edition's reading aids. | 1 vote |
| E | `greenmesg-kalabhairava` | translation | greenmesg.org, with an English line-by-line meaning. The live site serves a bot check, so it was read from the Wayback snapshot of 2026-08-08. **Its Devanagari is identical to A's 2002 text**, including the hypermetric phalaśruti line, so it counts with A. It is kept for its translation. | with A |
| F | `shlokam-kalabhairava` | translation | shlokam.org: text, IAST, translation and word meanings. Its text = A's base text, its phalaśruti uses A's bracketed "ते प्रयान्ति" line, and its colophon matches A/B. It counts with A and is kept for its word meanings. | with A |
| S | `sanskritdocuments-shivarahasya-kalabhairava` | text | sanskritdocuments.org kAlabhairavAShTakam1: the **Śivarahasya recension** (aṃśa 11 Mahādevākhya, adhyāya 34, ślokas 53–61, Īśvara to Pārvatī), proofread by Ruma Dewan, 2024. Read from Wayback (2025-02-25). **It is a different recension**: the stanza order differs and many words differ. It is cited for comparison and does not vote. The printed Śivarahasya was not seen, so this is the only evidence for that passage. | recension, no vote |

So the main text has four independent votes: A (+E, F), B, C and D.

Checked but not saved:
- sa.wikisource.org कालभैरवाष्टकम् (oldid 56881, 2016). It is unattributed and full of typos (भवाब्दि, ईप्सिथ, विनिकण्वन्, सेतूपालकं, शेष्पाश, सुशर्मदारकम्, the phalaśruti in 5 lines). Its substantive readings are those of A/E (स्थितं, शेषपाश, मोक्षणम्, मालिकाधरं, नरा ध्रुवम् plus the refrain repeated).

Not reached:
- vignanam.org (HTTP 202 challenge, no Wayback copy)
- stotranidhi.com (URLs tried return 404; no search hit)
- sringeri.net (stotra page now redirects to a generic page)

## Recension, count, attribution, meter

- **Recension.** This is the vulgate Śaṅkara text, the one in the Vani Vilas *Works* vol. 18, Gita Press and Ramakrishna Math. A related Śivarahasya text (S) has the same eight themes in a different order (S stanzas run 1, 4, 2, 3, 6, 5, 7, 8 in our numbering) and has many word variants. B's minority readings (निक्वणन्, केशपाश, -निर्मलं, स्थिरं) partly coincide with S. Do not confuse either with sanskritdocuments' *other* `kAlabhairavAShTakam.itx`. That is a different aṣṭaka (अङ्गसुन्दरत्व…, refrain शृङ्गशैलवासिनं नमामि कालभैरवम्) by Śṛṅgeri Ācārya Saccidānanda Śivābhinava Nṛsiṃha Bhāratī. It was seen, not saved.
- **Verse count.** All four votes have **8 verses + 1 phalaśruti = 9 stanzas**. B, C, D and E/F number the phalaśruti ९. A heads it "॥ फलश्रुतिः ॥" and leaves it unnumbered. S has 9 ślokas (53–61), the last being its phalaśruti. No witness has more stanzas. Wikisource repeats the refrain after the phalaśruti, but that is not a stanza.
- **Phalaśruti.** Only v9. It is in the same meter as the verses and has no refrain.
- **Attribution.** The colophons of B, A and F read इति श्रीमत्परमहंसपरिव्राजकाचार्यस्य श्रीगोविन्दभगवत्पूज्यपादशिष्यस्य श्रीमच्छङ्करभगवतः कृतौ … D reads इति श्रीमच्छंकराचार्यविरचितं …, and E says "Composed by Sri Adi Shankaracharya". So it is traditionally attributed to Ādi Śaṅkarācārya. C's colophon names no author. S presents the same hymn as Śiva's own words in the Śivarahasya. Treat the attribution as traditional. B's inclusion is the basis of the claim, and no witness here argues authorship.
- **Meter.** Every pāda of the established text has 15 syllables in strict guru–laghu alternation, beginning and ending guru: GLGLGLGLGLGLGLG = gaṇas ra-ja-ra-ja-ra. All 36 pādas were scanned with Vidyut. All are 15 syllables with this pattern; the 10 pādas that end in a light syllable fall on the free final position. This is **not pañcacāmara** (ja-ra-ja-ra-ja-ga, 16 syllables starting light), though it is often labelled so online. The ra-ja-ra-ja-ra meter is usually named **tūṇaka** (also called cāmara in some lists). I could not confirm the name against a printed prosody (Vṛttaratnākara / Chandomañjarī) in this pass, and `data/meters.json` has no entry for it yet. A human should confirm the name before a meter id is added. Suggested entry: `tunaka`, gaṇas "ra ja ra ja ra", pattern `GLGLGLGLGLGLGLG`.

## Conventions

- NFC Devanagari, one pāda per line, " ।" after pāda 2, "॥ N ॥" at the end.
- Class nasals are written as conjuncts (ङ्घ्रि, ङ्क, म्ब, ञ्ज, न्त, ङ्घ). A, E and F use anusvāra (पावनांघ्रि, दिगंबरं, निरंजनम्, संततिं, संघ, पठंति). This is orthographic only.
- Final ं before the next pāda follows the majority (C, D, A).
- पठन्ति follows B, C and D. A, E and F write पठंति.
- सन्निधिं follows D and A. C writes संनिधिं.

## Variant table (substantive readings)

Sigla: A = sanskritdocuments (2020 text; "A()" = A's bracketed variant; "A-2002" = the 2002 encoding), B = Vani Vilas 1910, C = Gita Press, D = Mantrapushpam, E/F = greenmesg/shlokam (with A), S = Śivarahasya (recension, no vote).

| v | pāda | chosen | witnesses | variant(s) | sense? |
|---|------|--------|-----------|------------|--------|
| 1 | b | सूत्रमिन्दुशेखरं | A C D E F S | सूत्रबिन्दुशेखर B (as printed) | Taken as a misprint (म→ब, anusvāra lost). If read literally it would mean "crest with a drop/dot". Not adopted. |
| 2 | c | कालकालमम्बुजाक्षमक्षशूलमक्षरं | A B C D E F | S: कालकालमम्बुजाक्षकन्धराहरं शिवं | Recension only. |
| 2 | b | नीलकण्ठमीप्सितार्थ° | A B C D E F | S: नीलकण्ठनीप्सितार्थ° | Recension only (S looks corrupt). |
| 3 | c | भीमविक्रमं प्रभुं | A B C D E F | S: भीमवक्रिमभ्रुवं | Recension only. |
| 4 | b | स्थितं | A C D E F | स्थिरं B, A() | Minor: "abiding" vs "steadfast". C's Hindi has "स्थिर-शिवस्वरूप" although its text reads स्थितं. S: नितान्तभक्तवत्सलं समस्तलोकपालकम् |
| 4 | c | **निक्वणन्**मनोज्ञ° | B, A(), S | **विनिक्वणन्** A C D E F | **Meter decides; this departs from the majority.** विनिक्वणन् makes the pāda 16 syllables (LGLG…, a pañcacāmara line inside a 15-syllable hymn). निक्वणन् gives the regular 15. Sense is the same ("jingling"; vi- only intensifies). Needs human confirmation. |
| 5 | a | त्वधर्ममार्गनाशकं | A B C D E F | नाशनं A(); S: पालनमधर्ममार्गनाशनं | No real difference. |
| 5 | c | स्वर्णवर्ण**शेषपाश**शोभिताङ्ग**मण्डलं** | A C D E F | स्वर्णवर्ण**केशपाश**शोभिताङ्ग**निर्मलं** B, A(); S: सुवर्णवर्णकेशपाशशोभिताङ्गनिर्मलं (hypermetric) | **Yes.** In the chosen reading his whole body is adorned with golden serpent-coils (Śeṣa); C's Hindi has शेषनाग. In B/S his golden locks of hair adorn a spotless body. |
| 6 | c | करालदंष्ट्र**मोक्षणं** | C D E F, A-2002 | **मोक्षदं** A (2020 text); **भूषणं** B, A(); S: करालं दंष्ट्रभीषणं | **Yes.** मोक्षणं: "releasing (from) the terrible fangs" (C's Hindi: "कालके भयंकर दाँतोंसे मोक्ष दिलानेवाले"). मोक्षदं: "giver of liberation". भूषणं: "whose ornament is terrible fangs". भीषणं: "fearsome with fangs". |
| 7 | a | °पद्मजाण्डकोशसन्ततिं | A B C D E F | S: °कोटिसन्ततिं | Recension only. |
| 7 | c | कपाल**मालिकाधरं** | A B E F, S | कपाल**मालिकन्धरं** C D | **Slight.** मालिकाधरं: "wearing a garland of skulls". मालिकन्धरं: "whose neck (कन्धर) bears the skull-garland". It looks like a shortened मालिका + कन्धर, which is irregular, although C's Hindi still renders it "कपालकी माला धारण करनेवाले". The independent votes tie 2–2 (A, B vs C, D). मालिकाधरं is chosen because it is the oldest print, it is regular, and the Śivarahasya agrees. **Human to confirm.** Both readings are metrical. |
| 8 | b | काशिवासलोक° | A C D E F | काशिवासिलोक° B, A(); S: काशिवासकोक° (typo) …शोधनप्रभुम् | Minor: "people of the Kāśī dwelling" vs "people dwelling in Kāśī". |
| 8 | c | जगत्पतिं | A B C D E F | S: जगत्प्रभुं | Recension only. |
| 9 | b | ज्ञानमुक्तिसाधनं | A C D E F S | साधकं B | Minor: "means of" vs "accomplisher of". |
| 9 | b | विचित्रपुण्यवर्धनम् | A B C D E F | S: पवित्र° | Recension only. |
| 9 | c | शोकमोहदैन्यलोभकोप° | A C D E F S | शोकमोहलोभदैन्यकोप° B, A() | Word order only. Both are metrical. |
| 9 | d | **ते प्रयान्ति** कालभैरवाङ्घ्रिसन्निधिं **ध्रुवम्** | B C D F, A() | **प्रयान्ति** कालभैरवाङ्घ्रिसन्निधिं **नरा ध्रुवम्** A (text), A-2002, E; S: ते प्रयान्ति कालभैरवादि सेवितं प्रभुं हरम् | Sense is the same ("men" is added). The A/E line has 16 syllables starting light, so it is unmetrical here. The chosen line is metrical and has the majority. |

Orthographic only (not variants): ङ्घ्रि/ंघ्रि, म्ब/ंब, ङ्क/ंक, ञ्ज/ंज, न्त/ंत, ङ्घ/ंघ, सन्/संनिधि, पठन्ति/पठंति, सम्पूर्णम्/संपूर्णम्.

Print damage in B (not readings): missing anusvāra throughout; भज for भजे (v4, v6); त्वधममागनाशक (v5, = त्वधर्ममार्गनाशक); मृत्युदपनाशन (v6, = दर्प); समस्तलाकाविग्रहम् (v4, = लोक). Other witnesses: GP OCR's सक्षरं (v3), पदाजाण्ड (v7) and कालभेरवं are OCR errors; the images read मक्षरं, पद्मजाण्ड and कालभैरवं.

## Uncertain / for the human

1. **v4c निक्वणन् vs विनिक्वणन्.** The established text follows the meter and B against the majority. If you prefer the majority reading, the pāda becomes hypermetric and check T3.1 will fail.
2. **v7c मालिकाधरं vs मालिकन्धरं.** The votes are tied 2–2. मालिकाधरं is chosen.
3. **v5c शेषपाश…मण्डलं vs केशपाश…निर्मलं, and v6c मोक्षणं vs मोक्षदं/भूषणं.** These follow the majority, but the oldest print (B) differs in both places, and the sense changes.
4. **Meter name.** The pattern ra-ja-ra-ja-ra is certain. The name ("tūṇaka") has not been verified in a printed prosody, and the entry still needs adding to `data/meters.json`.
5. The printed Śivarahasya was not consulted. S is a single digital transcription and looks corrupt in places (कन्धराहरं, काशिवासकोक, पद्द्म).
