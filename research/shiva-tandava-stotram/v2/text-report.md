# Text report: shiva-tandava-stotram v2

Retrieved 2026-10-20. Meter: pañcacāmara (16 syllables per pāda, alternating laghu–guru, as noted in `sanskritdocuments-shivtand-meaning`).

## Text sources (independent witnesses)

| # | source id | kind | what it is |
|---|-----------|------|------------|
| A | `sanskritdocuments-shivtand` | text | sanskritdocuments.org shivtAND.itx (Beeharry & Sharma). `sanskritdocuments-shivtand-meaning` prints the same text on the same site, so it counts once with A. |
| B | `sa-wikisource-shivatandava` | text | Sanskrit Wikisource, "सुसंशुद्धं" edition |
| C | `ramakrishna-math-mantrapushpam` | text (print) | Mantrapushpam, Ramakrishna Math Mumbai, 3rd ed. 2007, p. 468. Transcribed by eye from the page scan; the archive.org OCR is wrong here. |
| D | `shlokam-shiva-tandava` | translation (prints the text) | shlokam.org |
| E | `vyakhya-sts-2` | commentary (prints the text) | vyakhya.org Hindi commentary, śloka 2 |

These pages were checked only to see which readings are popular. They were not saved as sources:
- bhaktibharat.com/mantra/shiv-tandav-stotram: the same as A, including A's parenthetical "(क्वचिच्चिदम्बरे)" in v3, so it is probably derived from A. It has मूर्धनि, and its ॥२॥ has no spaces.
- hindu-blog.com/2020/02/shiva-tandava-stotram-lyrics.html: a blog with typos. Its readings are संभ्रम, निलिंप, किशोरचंद्र, मूर्धनि and ममं.

## Chosen reading (text.txt)

```
जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी
विलोलवीचिवल्लरीविराजमानमूर्द्धनि ।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २ ॥
```

## Character-level comparison

All five witnesses agree letter for letter in every word except the one below. Most variants are in punctuation, spacing and invisible characters.

1. **मूर्द्धनि vs मूर्धनि** (pāda 2, the only lexical-orthographic variant)
   - मूर्द्धनि (र्द्ध, with a doubled dh after r): A, B, C, E (E's verse text)
   - मूर्धनि: D; also E's own word-gloss line ("विराजमानमूर्धनि → विराजमान + मूर्धनि"); also bhaktibharat and hindu-blog
   - Chosen: **मूर्द्धनि**, the majority of the independent printed texts (4 of 5, including the Ramakrishna Math print). This is only a spelling difference: after r, doubling the consonant is optional (the dvitva convention seen in many printed stotra texts). The word is the same: mūrdhan, locative mūrdhani. The meter is not affected, because मू is long either way. Drafters may want the IAST to read mūrdhani and the Devanagari to read मूर्द्धनि. A human should confirm which spelling the dataset prefers. Check whether v1 or other verses already use the doubled spelling (v1 has no such cluster).
2. **Hyphen after निर्झरी**: A, C and E print "निर्झरी-" at the pāda break, which joins it to विलोल… as one compound. B runs the two together with no break. D has no hyphen. Dropped in text.txt, where the pāda break is the line break. Note that निर्झरी…मूर्द्धनि is a single compound across the pāda break.
3. **Spacing inside compounds**: D prints "विलोलवीचिवल्लरी विराजमानमूर्धनि" and "धगद्धगद्धगज्ज्वलल्ललाट पट्‍टपावके" with spaces. All the others write each as one unbroken word. Chosen: no spaces, following the majority.
4. **Zero-width joiner**: D has U+200D inside पट्‍ट. B has U+200D before ॥२॥. Both were removed. text.txt is plain NFC Devanagari.
5. **End-of-verse punctuation**: "॥ २॥" (A), "॥२॥" (B), "॥ २ ॥" (C, D), "।।" written as two single dandas with no numeral (E). Chosen: "॥ २ ॥", which follows the v1 convention in the dataset. Mid-verse danda: "।" after मूर्द्धनि in all of them, with a space before it in A, C, D and E and none in B.
6. Popular-only (blog) forms that were not adopted: anusvara spellings संभ्रम, निलिंप, किशोरचंद्र for the nasal consonants (orthographic only), and ममं, a typo.

No witness shows a substantive lexical variant. For example, none reads सम्भ्रमं for सम्भ्रम or has a different word anywhere.

## Translation and commentary sources

- `sanskritdocuments-shivtand-meaning`: English word-meanings and translation (Dr. Sarasvati Mohan). It glosses कटाह as "a well".
- `shlokam-shiva-tandava`: English word-meanings and translation. Its compound splits are partly unreliable: it glosses paṭṭa as "fire" and pāvake as "daga daga". Judges should weigh it against MW.
- `vyakhya-sts-2`: Hindi padaccheda, anvaya, bhāvārtha and vyākhyā. It glosses कटाह as "कड़ाह या कमंडलु के आकार का पात्र". The excerpt is cut before the quotations from Mahimnaḥ-stotra 17 and Bhāgavata 4.

## Dictionary entries (Monier-Williams, Cologne)

Saved as `sources/mw-*.md`: kaṭāha, nilimpa, nirjhara and nirjharī (one entry, which includes "nir-JarI f. a river, L."), vīci, vallarī, dhagaddhag-iti, dhag-iti, lalāṭa, paṭṭa ("the flat or level surface of anything (cf. lalAwa-…)"), kiśora, śekhara, √bhram, √lul, vilola, √rāj, vi-√rāj, √jval, sambhrama, mūrdhan, pāvaka, rati and pratikṣaṇam.

## Gaps / could not fetch

- **dhagat**: MW has no headword dhagat, dhagaddhagāya or dhagadhagāyate. The nearest entries are `DagadDag-iti` ("ind. (onomat.) crack! crack!") and `Dag-iti`. Both are saved. Apte (ap90) has none of these keys either.
- **vi-√lul**: MW has no separate headword (key `vilul` was not found). The root √lul and the derived adjective vi-lola are saved instead.
- **Apte**: lookups of ap90 kawAha and nilimpa returned "not found" for those keys. ap90 vilola and vallarI did resolve but were not saved. No Apte entries were saved; MW covers all the stems.
- **greenmesg.org** (shiva_tandava_stotram.php) returned a bot-verification (reCAPTCHA) page, so it was not used.
- **shaivam.org** English translation page: HTTP 403. Not used.
- **vignanam.org**: HTTP 403. **stotranidhi.com** and **detechter.com**: 404. Not used.
- **sanskritdocuments.org**: plain curl got HTTP 406. The pages were fetched successfully once browser headers were sent.
- No Gita Press edition was obtained. The Hindi commentary by Dharanidhar Shastri on archive.org (linked from sanskritdocuments) was not consulted.
