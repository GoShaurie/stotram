# Text report: vedasara-shiva-stava (full text, 11 verses)

Retrieved 2026-11-20. The established text is in `fulltext/text.txt`. Each verse folder `vN/` holds that verse's slice of this report, its `text.txt` and its source excerpts (`vN/sources/`).

## Text witnesses

| # | source id | kind | what it is |
|---|-----------|------|------------|
| A | `sanskritdocuments-vedasarast` | text | sanskritdocuments.org vedasarast.itx (Dhrup Chand; proofread Sridhar - Seshagiri; updated 2001, 2018). 11 verses + the Vani Vilas-style colophon. The live site returned HTTP 403 (Cloudflare), so it was read from the Wayback snapshot of 2025-07-22. Typos: भूमिर्नं (v6), स्त्वंहंसि (v10). shlokam.org (`shlokam-vedasara-shiva-stava`) reproduces A's Devanagari exactly, typos and colophon included, so it counts once with A; it is saved for its English translation and word meanings. |
| B | `vanivilas-1910-works-17` | text (print) | *Works of Sri Sankaracharya* vol. 17 (Stotras 1), Sri Vani Vilas Press, Srirangam, 1910, pp. 71–73, 11 verses, title ॥ वेदसारशिवस्तोत्रम् ॥, **no colophon**. Transcribed by eye from the archive.org page images (pages n82–n84). The oldest dated witness. |
| C | `ramakrishna-math-mantrapushpam` | text (print) | *Mantrapushpam*, Ramakrishna Math, Mumbai, 3rd ed. 2007, pp. 464–465, stotra [12] "(श्री शङ्कराचार्य कृतम्)", 11 verses. Transcribed by eye from the page images. Its readings are mixed: with A/B in vv. 2, 3, 4 and with D/E in vv. 6, 11, so it does not copy either group. |
| D | `gitapress-stotraratnavali` | translation (print, prints the text) | *Stotraratnavali*, Gita Press, Gorakhpur, pp. 26–29, ९—वेदसारशिवस्तवः, 11 verses + Hindi translation + colophon. Transcribed by eye from the page images. Gita Press's *Shiv Stotra Ratnakar* (`gitapress-shiv-stotra-ratnakar`, D2, pp. 52–55; images of pp. 52–53 checked, rest OCR) is from the same publisher and counts once with D. It has the same text except v6 (चाकाश आस्ते, शीतो). |
| E | `brihat-stotra-ratnakar-wikisource` | text | *Bṛhatstotraratnākara* vol. 1 (1953), pp. 251–252, as transcribed on Sanskrit Wikisource (वेदसारशिवस्तवः). The scan was not checked. Transcription slips (पञ्चवक्रम्, गवेन्द्रादिरूढं, प्रीष्मो, श्रुविज्ञान) are not counted as readings. |

Five independent text witnesses (A, B, C, D, E). Majority = 3 or more of 5.

Checked but not saved as sources: bhaktibharat.com and mantra.tips (popular pages, not opened), hindupedia.com (P. R. Ramachander's translation, which shlokam.org's English seems to follow; not opened). Not reached: greenmesg.org (bot verification page), vignanam.org (HTTP 202 challenge), stotranidhi.com (no page found at the URLs tried), sanskritdocuments.org live (403).

Conventions: NFC Devanagari, one pāda per line. Class nasals are written as conjuncts (शम्भो, ओङ्कार), not anusvara. The mid-verse mark is " ।" and the end mark "॥ N ॥". Hyphens are kept where a word runs across a pāda break by sandhi (v6 वायु- / र्न, v10 एक- / स्त्वं), as all the witnesses print them.

## Verse count, metre, structure

- **11 verses** in every witness, all in the same order. shlokam.org's introduction says "10-verse hymn" but it prints 11.
- **vv. 1–9: bhujaṅgaprayāta** (12 syllables per pāda, ya-gaṇa ×4: LGG LGG LGG LGG).
- **vv. 10–11: vasantatilakā** (14 syllables per pāda: GGL GLL LGL LGL GG).
- Checked with a syllable-weight scan by vidyut-chandas, using `checks.core` VIDYUT_DATA meters. Verses 1–5 and 7 are classified as bhujaṅgaprayāta directly. Verses 8 and 9 are not named only because of light syllables at the end of a pāda, which are allowed there. Verse 6 is not classified because of ग्रीष्मो (see point 1 below). Every pāda of vv. 10–11 scans as vasantatilakā.
- **No phalaśruti** and no other closing verse. Nothing is to be numbered past v11.

## Two families of readings

The witnesses fall into two groups at five places:

| place | A | B (1910) | C | D (+D2) | E | chosen |
|---|---|---|---|---|---|---|
| v2 सुरा(रा)ति/सुरारार्ति | राति | राति | राति | रार्ति | राति | **सुरारातिनाशं** |
| v3 गुणातीत/गणातीत | गुण | गुण | गुण | गण | गण | **गुणातीतरूपम्** |
| v4 विश्वरूपः/विश्वरूप | रूपः | रूपः | रूपः | रूप | रूप | **विश्वरूपः** |
| v6 न चोष्णं/न ग्रीष्मो | चोष्णं | चोष्णं | ग्रीष्मो | ग्रीष्मो | ग्रीष्मो | **न ग्रीष्मो** (metre favours चोष्णं) |
| v11 लिङ्गात्मके/लिङ्गात्मकं | के | के | कं | कं | कं | **लिङ्गात्मकं** |

A and B agree everywhere except orthography (A and B both write शंभो, मोंकार, शूलिञ्जटा…). A's colophon is the standard Vani Vilas colophon of the *Works*, so A probably descends from the B tradition, though B itself prints no colophon for this stotra. D and E agree everywhere except v2. C sides with A/B in vv. 2–4 and with D/E in vv. 6 and 11.

## Attribution

Every witness attributes the stotra to Śaṅkarācārya. All of these are modern prints or pages; no ancient source was checked:
- A: colophon इति श्रीमत्परमहंसपरिव्राजकाचार्यस्य श्रीगोविन्दभगवत्पूज्यपादशिष्यस्य श्रीमच्छंकरभगवतः कृतौ वेदसारशिवस्तोत्रं सम्पूर्णम् । The file metadata gives "Author: Adi Shankaracharya". shlokam.org repeats the same colophon and says "written by Adi Shankaracharya".
- B (1910): printed in vol. 17 (Stotras) of the *Works of Sri Sankaracharya*, without a colophon of its own.
- C: heading "(श्री शङ्कराचार्य कृतम्)".
- D: colophon इति श्रीमच्छङ्कराचार्यकृतो वेदसारशिवस्तवः सम्पूर्णम्। D2: ॥ इति श्रीमच्छङ्कराचार्यकृतो वेदसारशिवस्तवः सम्पूर्णः ॥
- E: header "शङ्कराचार्यः"; colophon ॥ इति श्रीमच्छङ्कराचार्यविरचितं वेदसारशिवस्तोत्रं सम्पूर्णम् ॥

The attribution is therefore traditional, as transmitted by the Śaṅkara stotra collections (oldest dated print seen: 1910). No manuscript, commentary or pre-modern citation was checked. On the site it should read as the traditional attribution, not as fact.

**Title:** वेदसारशिवस्तोत्रम् (A, B, C, E's colophon) or वेदसारशिवस्तवः (D, D2, E's heading). The project id uses "stava".

## Verse 1

**Witness numbering:** A: 1 | B: 1 | C: 1 | D: 1 | E: 1
**Metre:** Bhujaṅgaprayāta: 12 syllables per pāda, four ya-gaṇas (LGG LGG LGG LGG). vidyut-chandas classifies the chosen text as bhujaṅgaprayāta; pādas 2 and 4 end in a light syllable, which is allowed at the end of a pāda.

**Chosen reading:**

```
पशूनां पतिं पापनाशं परेशं
गजेन्द्रस्य कृत्तिं वसानं वरेण्यम् ।
जटाजूटमध्ये स्फुरद्गाङ्गवारिं
महादेवमेकं स्मरामि स्मरारिम् ॥ १ ॥
```

1. **Text**: all witnesses agree. Orthographic only: E (Wikisource) writes गजेंद्रस्य with anusvara; the archive.org OCR of B, C and D drops the anusvara of कृत्तिं, but the page images all have it.
2. **स्फुरद्गाङ्गवारिं**: all witnesses. In B (1910) the गा of द्गा is faintly inked and the archive.org OCR reads it as …दरा…; the image fits द्गा, and no witness has another reading.
3. **Layout / end mark**: A, B, D and E print one pāda per line; C prints each half-verse on one line with a dash between pādas. End marks vary (A ॥ १॥, D ॥ १॥, B and C ॥ १ ॥, E ।। १). Chosen ॥ १ ॥.

## Verse 2

**Witness numbering:** A: 2 | B: 2 | C: 2 | D: 2 | E: 2
**Metre:** Bhujaṅgaprayāta (LGG LGG LGG LGG). vidyut-chandas classifies the chosen text as bhujaṅgaprayāta. Pāda-final light syllables, where present, are allowed.

**Chosen reading:**

```
महेशं सुरेशं सुरारातिनाशं
विभुं विश्वनाथं विभूत्यङ्गभूषम् ।
विरूपाक्षमिन्द्वर्कवह्नित्रिनेत्रं
सदानन्दमीडे प्रभुं पञ्चवक्त्रम् ॥ २ ॥
```

1. **सुरारातिनाशं vs सुरारार्तिनाशं** (pāda 1, **changes the sense; human check**): सुरारातिनाशं (sura-arāti-nāśa, "destroyer of the gods' enemies") is in A, B, C and E. सुरारार्तिनाशं (sura-ārti-nāśa, "destroyer of the gods' distress") is in D and D2 (both Gita Press; page images checked), and D's Hindi translates it देवदुःखदलन. Chosen **सुरारातिनाशं** (4 of 5 independent witnesses). Both readings scan the same (LGGLGG). Note: shlokam.org prints सुरारातिनाशं but translates and glosses it as "removes the afflictions of the devas (… arāti: affliction)", i.e. with the meaning of the other reading.
2. **विरूपाक्षमिन्द्वर्कवह्नित्रिनेत्रं**: all witnesses (the OCR of B, C and D garbles वह्नि; images are clear).
3. **पञ्चवक्त्रम्**: all, except E पञ्चवक्रम् (a transcription slip on Wikisource; वक्र 'crooked' makes no sense here and it is not counted as a reading).

## Verse 3

**Witness numbering:** A: 3 | B: 3 | C: 3 | D: 3 | E: 3
**Metre:** Bhujaṅgaprayāta (LGG LGG LGG LGG). vidyut-chandas classifies the chosen text as bhujaṅgaprayāta. Pāda-final light syllables, where present, are allowed.

**Chosen reading:**

```
गिरीशं गणेशं गले नीलवर्णं
गवेन्द्राधिरूढं गुणातीतरूपम् ।
भवं भास्वरं भस्मना भूषिताङ्गं
भवानीकलत्रं भजे पञ्चवक्त्रम् ॥ ३ ॥
```

1. **गुणातीतरूपम् vs गणातीतरूपम्** (pāda 2, **changes the sense; human check**): गुणातीतरूपम् ("whose form is beyond the guṇas") is in A, B and C. गणातीतरूपम् ("whose forms are beyond counting") is in D, D2 and E; D's Hindi has अगणित रूपवाले. Chosen **गुणातीतरूपम्** (A, B, C; 3 of 5). Both scan the same. Note: shlokam.org prints गुणातीतरूपम् but translates "whose forms are innumerable", the sense of गणातीत.
2. **गवेन्द्राधिरूढं**: all except E गवेन्द्रादिरूढं (Wikisource slip; not counted).
3. **नीलवर्णं**: all (OCR of some prints drops the anusvara; images have it). E पञ्चवक्रम् again a slip.

## Verse 4

**Witness numbering:** A: 4 | B: 4 | C: 4 | D: 4 | E: 4
**Metre:** Bhujaṅgaprayāta (LGG LGG LGG LGG). vidyut-chandas classifies the chosen text as bhujaṅgaprayāta. Pāda-final light syllables, where present, are allowed.

**Chosen reading:**

```
शिवाकान्त शम्भो शशाङ्कार्धमौले
महेशान शूलिन् जटाजूटधारिन् ।
त्वमेको जगद्व्यापको विश्वरूपः
प्रसीद प्रसीद प्रभो पूर्णरूप ॥ ४ ॥
```

1. **विश्वरूपः vs विश्वरूप** (pāda 3, **slight sense change**): विश्वरूपः (nominative: "you alone, pervading the world, are of all forms") is in A, B and C. विश्वरूप (vocative: "O you of all forms") is in D, D2 and E; D's Hindi has हे विश्वरूप!. Chosen **विश्वरूपः** (3 of 5). Metre unaffected (pāda end).
2. **शूलिन् जटाजूटधारिन् vs शूलिञ्जटाजूटधारिन्** (pāda 2, sandhi spelling only): C, D, D2 and E keep the word boundary (शूलिन् जटा…); A and B write the sandhi form शूलिञ्जटा…. Same words, same sound in recitation. Chosen **शूलिन् जटाजूटधारिन्** (majority).
3. **शम्भो / शंभो**: orthographic (A, B anusvara; C, D, E class nasal). Chosen शम्भो per the class-nasal convention.

## Verse 5

**Witness numbering:** A: 5 | B: 5 | C: 5 | D: 5 | E: 5
**Metre:** Bhujaṅgaprayāta (LGG LGG LGG LGG). vidyut-chandas classifies the chosen text as bhujaṅgaprayāta. Pāda-final light syllables, where present, are allowed.

**Chosen reading:**

```
परात्मानमेकं जगद्बीजमाद्यं
निरीहं निराकारमोङ्कारवेद्यम् ।
यतो जायते पाल्यते येन विश्वं
तमीशं भजे लीयते यत्र विश्वम् ॥ ५ ॥
```

1. **ओङ्कार / ओंकार**: orthographic. A and B write निराकारमोंकारवेद्यम्; C, D, D2 and E write …मोङ्कार…. Chosen **मोङ्कार** (majority and class-nasal convention).
2. **जगद्बीजमाद्यं**: all (the OCR of C and D reads वीज; images have बी). No sense variants.

## Verse 6

**Witness numbering:** A: 6 | B: 6 | C: 6 | D: 6 | E: 6
**Metre:** Bhujaṅgaprayāta (LGG LGG LGG LGG). vidyut-chandas does **not** classify the chosen text: in pāda 3 the conjunct ग्र of ग्रीष्मो makes the preceding न heavy, so the pāda opens GGG instead of LGG. With A/B's **न चोष्णं** every pāda scans regularly (checked). Pāda 1 ends in वायु-, which is heavy before र्न of pāda 2.

**Chosen reading:**

```
न भूमिर्न चापो न वह्निर्न वायु-
र्न चाकाशमास्ते न तन्द्रा न निद्रा ।
न ग्रीष्मो न शीतं न देशो न वेषो
न यस्यास्ति मूर्तिस्त्रिमूर्तिं तमीडे ॥ ६ ॥
```

1. **न ग्रीष्मो vs न चोष्णं** (pāda 3, **sense nearly the same; metre differs; human check**): न ग्रीष्मो ("not summer") is in C, D, D2 and E (E's Wikisource text has the slip प्रीष्मो). न चोष्णं ("nor heat") is in A and B (the 1910 print). Chosen **न ग्रीष्मो** by majority (3 of 5). But ग्रीष्मो makes the preceding न heavy (the cluster ग्र), so pāda 3 opens GGG and breaks the bhujaṅgaprayāta, whereas चोष्णं scans regularly. The metre and the oldest dated print both favour **न चोष्णं**; recommend the human consider adopting it.
2. **शीतं vs शीतो**: शीतं in A, B, C, D and E; शीतो only in D2 (Gita Press Shiv Stotra Ratnakar, page image checked), probably to match masculine ग्रीष्मो. Chosen **शीतं**. Not sense-changing.
3. **चाकाशमास्ते vs चाकाश आस्ते**: चाकाशमास्ते in A, B, C, D and E; चाकाश आस्ते only in D2. Chosen **चाकाशमास्ते**. Not sense-changing; same scansion.
4. **भूमिर्न**: all except A (and its mirror shlokam.org), which print भूमिर्नं (a typo; shlokam even glosses 'नं (naṃ) – not').

## Verse 7

**Witness numbering:** A: 7 | B: 7 | C: 7 | D: 7 | E: 7
**Metre:** Bhujaṅgaprayāta (LGG LGG LGG LGG). vidyut-chandas classifies the chosen text as bhujaṅgaprayāta. Pāda-final light syllables, where present, are allowed.

**Chosen reading:**

```
अजं शाश्वतं कारणं कारणानां
शिवं केवलं भासकं भासकानाम् ।
तुरीयं तमःपारमाद्यन्तहीनं
प्रपद्ये परं पावनं द्वैतहीनम् ॥ ७ ॥
```

1. No variants among the witnesses. shlokam.org (A's mirror) spaces तमः पारम्; A itself and all prints have the compound तमःपारमाद्यन्तहीनं. The archive.org OCR of D reads जयं for तुरीयं; the image has तुरीयं.

## Verse 8

**Witness numbering:** A: 8 | B: 8 | C: 8 | D: 8 | E: 8
**Metre:** Bhujaṅgaprayāta. vidyut-chandas returns no name only because pādas 3–4 end in light syllables (…गम्य), which is allowed at the end of a pāda; every pāda is otherwise LGG LGG LGG LG(G).

**Chosen reading:**

```
नमस्ते नमस्ते विभो विश्वमूर्ते
नमस्ते नमस्ते चिदानन्दमूर्ते ।
नमस्ते नमस्ते तपोयोगगम्य
नमस्ते नमस्ते श्रुतिज्ञानगम्य ॥ ८ ॥
```

1. No variants. E (Wikisource) has श्रुविज्ञानगम्य, a transcription slip for श्रुतिज्ञानगम्य (all others); not counted.

## Verse 9

**Witness numbering:** A: 9 | B: 9 | C: 9 | D: 9 | E: 9
**Metre:** Bhujaṅgaprayāta. vidyut-chandas returns no name only because pādas 1–2 end in light syllables (विश्वनाथ, त्रिनेत्र), which is allowed at the end of a pāda. In pāda 2 the श of महेश is heavy before त्र, as the metre needs.

**Chosen reading:**

```
प्रभो शूलपाणे विभो विश्वनाथ
महादेव शम्भो महेश त्रिनेत्र ।
शिवाकान्त शान्त स्मरारे पुरारे
त्वदन्यो वरेण्यो न मान्यो न गण्यः ॥ ९ ॥
```

1. No variants beyond शम्भो / शंभो (orthographic; A, B, E anusvara; C, D class nasal). Chosen शम्भो.

## Verse 10

**Witness numbering:** A: 10 | B: 10 | C: 10 | D: 10 | E: 10
**Metre:** Vasantatilakā: 14 syllables per pāda, GGL GLL LGL LGL GG. The last syllable of a pāda may be light or heavy. The metre changes here from the bhujaṅgaprayāta of vv. 1–9.

**Chosen reading:**

```
शम्भो महेश करुणामय शूलपाणे
गौरीपते पशुपते पशुपाशनाशिन् ।
काशीपते करुणया जगदेतदेक-
स्त्वं हंसि पासि विदधासि महेश्वरोऽसि ॥ १० ॥
```

1. No variants. A prints स्त्वंहंसि without a space (typo; shlokam copies it); all prints have स्त्वं हंसि. शम्भो / शंभो orthographic (A, B anusvara). The verse ends …जगदेतदेक- / स्त्वं: एकः + त्वं, with the visarga sandhi carried into pāda 4.

## Verse 11

**Witness numbering:** A: 11 | B: 11 | C: 11 | D: 11 | E: 11
**Metre:** Vasantatilakā (GGL GLL LGL LGL GG), as v10. Pāda-final light syllables are allowed.

**Chosen reading:**

```
त्वत्तो जगद्भवति देव भव स्मरारे
त्वय्येव तिष्ठति जगन्मृड विश्वनाथ ।
त्वय्येव गच्छति लयं जगदेतदीश
लिङ्गात्मकं हर चराचरविश्वरूपिन् ॥ ११ ॥
```

1. **लिङ्गात्मकं vs लिङ्गात्मके** (pāda 4, **changes the construction; human check**): लिङ्गात्मकं is in C, D, D2 and E; लिङ्गात्मके in A and B (1910). With लिङ्गात्मकं the word goes with जगत् ("this world, which has the nature of a liṅga"); D's Hindi: यह लिंगस्वरूप समस्त जगत्. With लिङ्गात्मके it goes with त्वयि ("into you, whose nature is the liṅga"); shlokam.org (A's mirror) translates "you who are of the nature of linga". Chosen **लिङ्गात्मकं** (3 of 5). Metre unaffected.

## Summary of points for the human to confirm

1. **v6 pāda 3**: **न ग्रीष्मो** (chosen; C, D, E) vs **न चोष्णं** (A, B 1910). The sense is nearly the same ("summer" vs "heat"), but ग्रीष्मो breaks the bhujaṅgaprayāta (the cluster ग्र makes the preceding न heavy) and चोष्णं scans regularly. Recommend considering चोष्णं.
2. **v2 pāda 1**: सुरारातिनाशं (chosen; A, B, C, E) vs **सुरारार्तिनाशं** (D, D2 Gita Press). The sense changes: "destroyer of the gods' enemies" vs "destroyer of the gods' distress".
3. **v3 pāda 2**: गुणातीतरूपम् (chosen; A, B, C) vs **गणातीतरूपम्** (D, D2, E). The sense changes: "form beyond the guṇas" vs "forms beyond counting".
4. **v11 pāda 4**: लिङ्गात्मकं (chosen; C, D, E) vs **लिङ्गात्मके** (A, B). The construction changes: the word goes with "the world" vs with "you".
5. **v4 pāda 3**: विश्वरूपः (chosen; A, B, C) vs **विश्वरूप** (D, E). This is a statement ("[you] are of all forms") vs an address ("O you of all forms"). Minor.
6. Spelling only: शूलिन् जटा… (chosen) vs शूलिञ्जटा… (A, B); ओङ्कार vs ओंकार; शम्भो vs शंभो. v6 शीतो and चाकाश आस्ते occur only in D2.
7. There is **no phalaśruti** in any witness. All five end at v11 (B with an ornament, the others with a colophon). The colophon is not part of the verse text.

## Gaps

- sanskritdocuments.org (live) returned HTTP 403; A was read from the Wayback snapshot of 2025-07-22 (text last updated 2018).
- B, C, D (and D2 pp. 52–53) were transcribed by eye from archive.org page images; their OCR is unreliable. D2 pp. 54–55 were taken from OCR and only compared with D. The edition year of the Gita Press Stotraratnavali was not seen.
- E is a Wikisource transcription; the 1953 scan itself was not opened.
- Not reached: greenmesg.org, vignanam.org, stotranidhi.com. No South Indian edition other than B (1910) was found, and no commentary.
- No dictionary entries and no primary-text passages were saved in this pass (for example, for the Gaṅgā in Śiva's hair, the elephant hide (gajāsura), Tripura, Kāma, or Māṇḍūkya Upaniṣad 7 for turīya in v7). Save these per verse if an annotation will cite them.

## Owner decision (2026-11-20)
- v6 pāda 3: **न चोष्णं** adopted (A, B; the oldest print; scans as bhujaṅgaprayāta). न ग्रीष्मो (C, D, E) is to be shown as a variant. Other choices as above. Owner will proofread.
