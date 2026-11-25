# Text report: rudrashtakam (full text, 8 stanzas + phalaśruti)

Retrieved 2026-11-24. Eight stanzas in bhujaṅgaprayāta (v1–v8) and one closing anuṣṭubh śloka, the phalaśruti (v9). The established text is in `fulltext/text.txt`. Each verse folder `vN/` holds its `text.txt`, its own `text-report.md` (that verse's slice of this report) and per-verse source excerpts (`vN/sources/`). Whole-text excerpts are in `fulltext/sources/`. The narrative frame (Uttarakāṇḍa 104 kha – 108 kha) is saved as a primary passage in `fulltext/sources/ramcharitmanas-uttarakanda-104-108.md`. No dictionary entries were saved; `checks dict` handles those.

## Text witnesses

| siglum | source id | kind | what it is | weight |
|---|---|---|---|---|
| G | `gitapress-ramcharitmanas` | translation (print) | Gita Press *Śrīrāmacaritamānasa* with Hindi translation, Uttarakāṇḍa, pp. 1011–1012. Transcribed by eye from the archive.org page images. Words are spaced Hindi-style (ब्रह्म वेदस्वरूपं, गिरा ग्यान गोतीतमीशं), every pāda ends in ं, and the eight stanzas are unnumbered in the text (the numbers 1–8 are on the Hindi). The śloka is headed "श्लोक—" and numbered ९. | 1 vote |
| K | `kashiraj-ramcharitmanas` | text (print) | Kāśirāja critical edition, ed. Viśvanāthaprasāda Miśra (Sarvabhāratīya Kāśirāja Nyāsa), p. 443, read from the page image. It joins compounds, uses no avagraha (भजेहं, नतोहं) and prints no stanza numbers. Its apparatus (end of volume, read from OCR only) records **no variant inside the 18 lines of the stotra**. The nearest entries are dohā 107 line 12 (स्वर; गिरा in many manuscripts) and the lines after the śloka. Its appendix of additions (परिशिष्ट) lists 13 extra half-lines that a single manuscript (siglum "अल") inserts in this passage, e.g. "नमामी सदासौवरूपं निरीहं", "न जानामि ग्यानं […] भावं न दूजा", "नमामी उमापति पादा सुदंभो". The edition treats them as interpolations, and they are not in any other witness. | 1 vote |
| B | `belvedere-1926-ramcharitmanas` | text (print) | Belvedere Press, Prayāg, 1926, pp. 427–428 (Digital Library of India scan), read from the page images. Worn type. It labels the stanzas **भुजङ्गप्रयात-वृत्त** and the śloka **अनुष्टुप-वृत्त**, the only witness that names the meters. | 1 vote |
| S | `sanskritdocuments-rudra8` | translation | sanskritdocuments.org rudra8.itx (Girish Beeharry; updated 2025-02-21). Read via Wayback (the live site returns 403). Its 2025 text joins compounds. Its 2007 encoding (also read) spaces words exactly like G (गिरा ज्ञान गोतीतमीशं, महाकाल कालं, न यावत् उमानाथ, आपन्नमामीश शम्भो), and its Hindi bhāvārtha expands G's translation. So S probably descends from a Gita Press text and is only partly independent of G. | 1 vote (weak independence from G) |
| E | `greenmesg-rudrashtakam` | translation | greenmesg.org (Wayback 2026-08-12), with a line-by-line English meaning. Its Devanagari has slips: मोङ्कर, गभिरं, त्र्यः, शम्भुतुभ्यम्. | 1 vote |
| F | `shlokam-rudrashtakam` | translation | shlokam.org. Its Devanagari is identical to E, slips included, and its v9 English copies E. It counts with E and is kept for its word meanings. | with E |
| W | `wikisource-sa-rudrashtakam` | text | sa.wikisource रुद्राष्टकम्: unattributed, with many typos. Used only to spot popular readings. | no vote |

So the main text has five votes: G, K, B, S, E (+F). The three printed Mānasa editions (G, K, B) are the independent core.

Checked but not saved:
- `iZxT_shri-rama-charita-manas-by-goswami-tulasi-das-1939-gorakahpur-gita-press` (Gita Press 1939, OCR only). Same publisher as G, so it does not count as independent. Its OCR agrees with G's spacing.
- `PJOh_…vishvanath-prasad-mishra-bhargav-bhushan-press` (another scan of the Kāśirāja text). Not used separately.

Not reached:
- sanskritdocuments live site (403; Wayback used instead).
- hi.wikisource: no Rāmacaritamānasa page was found by search, and the API rate-limited further queries.
- gitasupersite (moved to gitasupersite.in): not tried.
- Manas Piyush (Uttarakāṇḍa volume, which has a variorum commentary): not consulted.

## Count, phalaśruti, meter, context, attribution

- **Count.** Every witness has **8 stanzas + 1 closing śloka = 9**. G, E and F number the śloka ९. S leaves it unnumbered in the text but numbers its Hindi and English "9". K, B and W leave it unnumbered. No witness has a ninth bhujaṅgaprayāta stanza. The only longer form is K's single interpolating manuscript ("अल", 13 extra half-lines), which no witness follows.
- **Phalaśruti.** Only v9: रुद्राष्टकमिदं प्रोक्तं विप्रेण हरतोषये । ये पठन्ति नरा भक्त्या तेषां शम्भुः प्रसीदति ॥. Its wording is **identical in all witnesses** (K prints पठंति). It is in a different meter from the stanzas (anuṣṭubh, labelled so by B; all four pādas are regular pathyā). Note that it speaks of the hymn in the third person, "spoken by the brāhmaṇa (विप्रेण) to please Hara". In the Mānasa it is part of the narrative, not a later appendage.
- **Meter.** v1–v8 are **bhujaṅgaprayāta**: 4 × ya-gaṇa (LGG LGG LGG LGG), 12 syllables per pāda (B: "भुजङ्गप्रयात-वृत्त"). All 32 pādas of the chosen text were scanned with Vidyut. 31 scan regularly; a light final syllable falls on the free last position. **The exception is v7a न यावद् उमानाथपादारविन्दं, which scans LGL LGG LGG LGG.** By Sanskrit syllabification the d of यावद् joins the next vowel, so the third syllable is light. All witnesses have this reading; no variant mends it. G, K, E, F and W print यावद् with a virāma and a space (S-2007 has yAvat.h), which marks a pause in recitation that makes the syllable heavy. S-2025 and B write यावदुमानाथ joined. **Expect check T3.1 to flag v7a.** The irregularity is the poet's (Hindi-style pause), not a corruption. v9 is anuṣṭubh (16 + 16 syllables, pathyā). `data/meters.json` already has `bhujangaprayata` and `anushtubh`.
- **Context.** Rāmacaritamānasa, Uttarakāṇḍa. Kākabhuśuṇḍi tells Garuḍa about an earlier birth. As a śūdra in Ujjain (उजेनी) during a famine, he was taught by a Śiva-worshipping brāhmaṇa guru. Once, while chanting Śiva's name in a Śiva temple (हर मंदिर), he did not rise to greet the guru out of pride (106 ka). Śiva's voice from the sky cursed him to become a serpent (caupāīs after 106 kha). The guru bowed and, with folded hands, sang this hymn for him (107 kha). Śiva granted a boon and softened the curse (108 ka ff.). **Placement**: in G the hymn stands between dohā **107 (kha)** and dohā **108 (ka)**, pp. 1011–1012. In K and B, which number dohā units without ka/kha, it stands after dohā **107** and inside the unit closed by dohā **108**. S says "Uttarkand, Doha 107". So "after Uttarakāṇḍa 107" is correct in both numberings. The text names the temple only as हर मंदिर in Ujjain; it does not name Mahākāla.
- **Attribution.** Gosvāmī Tulasīdāsa, as part of the Rāmacaritamānasa. S's colophon: इति श्रीरामचरितमानसे उत्तरकाण्डे श्रीगोस्वामितुलसीदासकृतं श्रीरुद्राष्टकं सम्पूर्णम्. E and F: इति श्रीगोस्वामितुलसीदासकृतं श्रीरुद्राष्टकं सम्पूर्णम्. Within the story the speaker is the brāhmaṇa guru (विप्रेण, v9). The three Mānasa editions print it with no separate colophon.
- **Language.** S notes non-Pāṇinian ("ārṣa", Hindi-influenced) forms: vocative शम्भु (v8b), बालेन्दु without visarga (v3d), भुजङ्गा feminine to rhyme with गङ्गा (v3), हरतोषये for हरतोषाय (v9), पुरारी and मन्मथारी for °अरिः/°अरे (v6). Others are visible too: त्रयः inside a compound (v5c); दयालं and कृपालं (Hindi दयाल, कृपाल); शान्ति as a bare stem (v7c); the hiatus in पाहि आपन्नमामीश (v8d) and यावद् उमा° (v7a). These are the poet's, not scribal errors, and no witness "corrects" them.

## Conventions

- NFC Devanagari, one pāda per line for v1–v8, " ।" after pāda 2, "॥ N ॥" at the end. v9 is laid out as two half-verse lines, like the anuṣṭubh phalaśruti in `research/shiva-panchakshara-stotram`.
- Compounds are joined (K, S, E), Sanskrit-style. G's and B's word spacing is Hindi print habit and is not counted as a reading, **except** where spacing affects scansion or sense. Those places (v1a, v7a, v7c, v8b, v8d) follow the majority with spaces, as noted below.
- Class nasals are written as conjuncts (ङ्क, ङ्ग, ण्ड, न्त, न्द, म्ब). G, K and W write anusvāra (संकाश, गंगा, कुंडलं, शंकरं, मोंकार). This is orthographic only. ओङ्कार follows this convention (G, K, S write ओंकार; B writes ओङ्कार).
- म् at the end of each half-verse (S, B, E), ं elsewhere. G and K write ं everywhere.
- Avagraha is written (भजेऽहम्, नतोऽहम्, भजेऽहं) with G, S, E and B (v2). K, W and B (v1, v5, v8) omit it. The sandhi is the same either way.

## Variant table

Sigla: G Gita Press, K Kāśirāja, B Belvedere 1926, S sanskritdocuments (2025; S-2007 = 2007 encoding), E greenmesg (+F shlokam), W Wikisource (no vote).

| v | pāda | chosen | witnesses | variant(s) | sense? |
|---|---|---|---|---|---|
| 1 | a | नमामीशमीशान निर्वाणरूपं (space) | G B E S-2007 W | नमामीशमीशाननिर्वाणरूपं K S | **Slight.** With the space, ईशान stands alone (vocative "O Īśāna", or accusative stem) and निर्वाणरूपं is a separate epithet. G's Hindi takes ईशान separately ("ईशान दिशाके ईश्वर"). Joined, it reads as one compound "whose form is Īśāna-nirvāṇa", which is awkward. W's नमामिश is a typo. |
| 1 | b | ब्रह्मवेदस्वरूपम् | K S E | ब्रह्म वेदस्वरूपं G B W | **Slight.** G's Hindi: "ब्रह्म और वेदस्वरूप" (two epithets). The joined form allows both readings ("whose form is Brahman and Veda"). |
| 2 | b | गिराज्ञानगोतीतमीशं | K S E | गिरा ज्ञान गोतीतमीशं B W S-2007; गिरा **ग्यान** गोतीतमीशं G | ग्यान is G's Avadhi spelling of ज्ञान, so there is no difference in sense ("beyond speech, knowledge and the senses"). |
| 2 | a | °मोङ्कार° | (B) | मोंकार G K S W; **मोङ्कर** E F | E/F's short a is unmetrical (a slip). |
| 3 | a | गभीरं | G K S | **गँभीरम्** B, **गंभीरं** W; **गभिरं** E F | **Meter decides.** गम्भीर (nasal) makes syllable 10 heavy, and गभिर makes 11 light. Both break bhujaṅgaprayāta. The sense is the same ("deep"). |
| 3 | b | मनोभूतकोटिप्रभाश्रीशरीरम् | K S | मनोभूत कोटि प्रभा श्री शरीरं G W; …प्रभा श्रीशरीरम् B; …प्रभाश्री शरीरम् E F | Spacing only. G's Hindi pairs प्रभा and श्री ("ज्योति एवं शोभा") as qualities of the body. |
| 3 | c | कल्लोलिनी | all | (B's ो-sign is faint in the scan) | none |
| 4 | a | भ्रूसुनेत्रं | K S E (भ्रू सुनेत्रं G W S-2007) | **सुभ्रनेत्रं** B (possibly a damaged सुभ्रूनेत्रं) | Minor: "brow, fine eyes" vs "fine-browed eyes". B is a single worn witness. सुभ्रूनेत्रं would be unmetrical (su made heavy before bhr). Not adopted. |
| 4 | b | नीलकण्ठं | G K B S E | नीलकंठ W | W unmetrical, typo. |
| 5 | b | परेशं / अखण्डं अजं | G K B E W | परेश**म**खण्ड**म**जं S (sandhi across the pāda break) | Same words. S's sandhi'd अखण्डमजं makes ḍa light (unmetrical if read as written). The majority hiatus scans. |
| 5 | c | त्रयःशूल° | G K B S W | त्र्यःशूल° E F | E/F typo. |
| 6 | c | °मोहापहारी | G K B S E | मोहपहारी W | W unmetrical, typo. |
| 7 | a | न यावद् उमानाथ° | G K E W (यावत् S-2007) | यावदुमानाथ S B | Spelling of the same words; see Meter. The pause is what the virāma and space signal. |
| 7 | c | शान्ति सन्तापनाशं (space) | G S E W | शान्तिसन्तापनाशं K B | **Slight.** Spaced: "no happiness, (no) peace, (no) end of torment", which G's Hindi follows ("न… सुख-शान्ति… और न… तापोंका नाश"). Joined: "happiness, the end of peace-and-torment", which is awkward. The majority and G's sense are chosen. |
| 8 | b | शम्भु तुभ्यम् | G K B S W | शम्भुतुभ्यम् E F | Spacing only. शम्भु is an ārṣa vocative. |
| 8 | c | जराजन्मदुःखौघ° | K B S | जरा जन्म दुःखौघ तातप्यमानं G W S-2007; जराजन्मदुःखौघ तातप्यमानं E | Spacing only. |
| 8 | d | आपन्नमामीश शम्भो | G E W S-2007 | आपन्नमामीशशम्भो K B S | Spacing only: āpannam mām īśa śambho, "protect me, the afflicted, O Lord Śambhu". W's आपन्नमाशीश is a typo. |
| 9 | c | पठन्ति | G B S E W | पठंति K | orthographic |

Not variants (orthographic): anusvāra vs class nasal throughout; बिशालम् (B, b/v); मृगाधीशचर्म्माम्बरं (B, doubled m); avagraha present or absent; ं vs म् at half-verse end.

Narrative-frame variant (not in the hymn): dohā 107 second line स्वर (G, K) vs गिरा (B; K's apparatus lists गिरा in several manuscripts).

## Uncertain / for the human

1. **v7a meter.** It is unmetrical by strict Sanskrit scansion in every witness, and there is nothing to choose between. Decide whether to keep न यावद् उमानाथपादारविन्दं with the virāma and space (as G and K print it) and accept a T3.1 flag, or note it as a pause-scansion.
2. **Spacing that affects sense** (v1a ईशान निर्वाण°, v7c शान्ति सन्ताप°): the chosen readings follow the majority and G's Hindi. K joins both.
3. **v1b and v2b compounding** (ब्रह्मवेदस्वरूपम्, गिराज्ञानगोतीतमीशं): these are joined following K, S and E. G spaces them (and spells ग्यान).
4. **S's independence.** The 2007 encoding mirrors Gita Press spacing, so S is probably a Gita Press descendant. The core independent evidence is G, K and B (plus E).
5. K's apparatus was read from OCR only. The statement "no variant recorded inside the stotra" should be confirmed against the page images of the apparatus before it is cited.
6. B (1926) is badly worn. Its सुभ्रनेत्रं (v4a) and the damaged first akṣaras in v5 rest on a poor scan.
