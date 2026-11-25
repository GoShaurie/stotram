# Text report: shiva-panchakshara-stotram (full text, 5 verses + phalaśruti)

Retrieved 2026-11-18. There are five akṣara verses (न, म, शि, वा, य), numbered v1–v5, plus the phalaśruti पञ्चाक्षरमिदं पुण्यं…, numbered v6. The established text is in `fulltext/text.txt`. Each verse folder `vN/` holds that verse's slice of this report, its `text.txt` and its source excerpts (`vN/sources/`). No dictionary entries or primary-text passages were saved in this pass.

## Text witnesses

| # | source id | kind | what it is |
|---|-----------|------|------------|
| A | `sanskritdocuments-panch` | translation (prints the text) | sanskritdocuments.org panch.itx (Anand Hudli; updated 2020), 5 verses + unnumbered phalaśruti, English translation. The live site returned HTTP 403 (Cloudflare), so it was read from the Wayback snapshot of 2025-08-01. It records one variant itself ("variation मकारमहिताय" in v2). |
| B | `vanivilas-1910-works-17` | text (print) | *Works of Sri Sankaracharya* vol. 17 (Stotras 1), Sri Vani Vilas Press, Srirangam, 1910, pp. [119]–120, 5 verses, **no phalaśruti**. Transcribed by eye from the archive.org page images. Sanskrit Wikisource's शिवपञ्चाक्षरस्तोत्रम् is a transcription of these same two pages (index still at "OCR" status). It counts once with B, and its slips (वसिष्ट, वकारांय, नम: with an ASCII colon) are not readings. |
| C | `ramakrishna-math-mantrapushpam` | text (print) | *Mantrapushpam*, Ramakrishna Math, Mumbai, 3rd ed. 2007, p. 459, 5 verses + phalaśruti numbered ६. Transcribed by eye from the page image. |
| D | `gitapress-stotraratnavali` | translation (print, prints the text) | *Stotraratnavali*, Gita Press, Gorakhpur (edition year not seen), pp. 33–34, 5 verses + phalaśruti numbered ६, Hindi translation. Transcribed by eye from the page images. Gita Press's *Shiv Stotra Ratnakar* (OCR checked) has the identical text and counts once with D. |
| E | `sringeri-shiva-panchakshara` | text | sringeri.net (Sri Sringeri Sharada Peetham), 5 verses, **no phalaśruti**, Devanagari + IAST. |
| F | `stotranidhi-shiva-panchakshara` | text | stotranidhi.com (their printed *Prabhata Stotranidhi*), 5 verses, **no phalaśruti**. Its colophon is word for word the 1910 colophon of B, and it shares B's बृन्द and मुख्य. But it reads त्रिलोचनाय and मकाराय against B, so it is not a copy of B. It is counted as a separate witness that probably descends from the Vani Vilas text, and is given less weight where it agrees with B. |

These were checked only to see which readings are popular, not saved as sources: drikpanchang.com (the A/D vulgate: त्रिलोचनाय, मन्दारपुष्प, मकाराय, वृन्द, गौतमार्य, यक्ष, phalaśruti ६) and the English Wikipedia article (not a text witness). Not reached: greenmesg.org (bot-verification page), vignanam.org (HTTP 202 challenge, no text), shlokam.org (404 at the URL tried), and sanskritdocuments.org live (403).

Conventions: the text is NFC Devanagari with one pāda per line. Hyphens that mark a compound running across a pāda break (vv. 3, 4) are dropped, because the line break stands for the pāda break. Class nasals are written as conjuncts (ङ्ग, ञ्च, न्द, म्ब), not as anusvara. The end mark is "॥ N ॥" and the mid-verse danda is " ।". The refrain is written नकाराय etc. as one word (D prints ‘न’ काराय with quotes, which is a typographic aid).

## Verse inventory and numbering in each witness

| our # | opening | akṣara | A | B | C | D | E | F |
|---|---|---|---|---|---|---|---|---|
| 1 | नागेन्द्रहाराय… | न | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | मन्दाकिनीसलिल… | म | 2 | 2 | 2 | 2 | 2 | 2 |
| 3 | शिवाय गौरीवदन… | शि | 3 | 3 | 3 | 3 | 3 | 3 |
| 4 | वसिष्ठकुम्भोद्भव… | व(ा) | 4 | 4 | 4 | 4 | 4 | 4 |
| 5 | यक्षस्वरूपाय… | य | 5 | 5 | 5 | 5 | 5 | 5 |
| 6 | पञ्चाक्षरमिदं पुण्यं… (phalaśruti) | — | unnumbered | — | 6 | 6 | — | — |

All six witnesses have the same verse order. Each akṣara verse begins with its syllable, and each ends with the refrain **तस्मै [न/म/शि/व/य]काराय नमः शिवाय** (B: v2 मकारमहिताय).

## Metre (checked by a syllable-weight scan with vidyut-chandas, `checks.core.Context.chandas`)

- **vv. 1, 3, 4, 5**: 11-syllable trisṭubh lines of the indravajrā family. Indravajrā is GGL GGL LGL GG and upendravajrā is LGL GGL LGL GG, so the verses are upajāti where the two mix.
  - v1: indravajrā in pādas 2–4. Pāda 1 with त्रिलोचनाय scans GGLGGGLGLGG (syllable 6 heavy by position before त्र). With B's विलोचनाय it is regular.
  - v3: upajāti (U I I I). v4: upajāti (U U I I). v5: upajāti (I U I I).
- **v2**: pādas 1–3 have 14 syllables, vasantatilakā (GGLGLLLGLLGLGG). The refrain तस्मै मकाराय नमः शिवाय (11 syllables, indravajrā) makes the verse mixed. B's तस्मै मकारमहिताय नमः शिवाय is a 14-syllable vasantatilakā, and this is the main argument for B's reading (see v2, variant 2).
- **v6** (phalaśruti): anuṣṭubh (pathyā śloka).

## Attribution

All witnesses attribute the stotra to Śaṅkarācārya. These attributions are in modern prints or pages, not in any ancient source:
- A: "A Shivastotra by ShankarAchArya … composed by Adi SankarAchArya"; colophon ॥ इति श्रीमच्छंकराचार्यविरचितं शिवपञ्चाक्षरस्तोत्रं समाप्तम् ॥.
- B (1910): the colophon इति श्रीमत्परमहंसपरिव्राजकाचार्यस्य श्रीगोविन्दभगवत्पूज्यपादशिष्यस्य श्रीमच्छंकरभगवतः कृतौ शिवपञ्चाक्षरस्तोत्रं संपूर्णम् ॥ This is the standard colophon of the Vani Vilas *Works*, and the oldest dated print seen.
- C: heading "(श्री शङ्कराचार्य कृतम्)". D: colophon इति श्रीमच्छङ्कराचार्यविरचितं शिवपञ्चाक्षरस्तोत्रं सम्पूर्णम्।. E: listed among the Śaṅkara stotras on the Sringeri Peetham site. F: the B-type colophon.

The attribution is therefore traditional, as transmitted by the Śaṅkara stotra collections. No manuscript, commentary or pre-modern citation was checked in this pass, so nothing here dates the attribution earlier than the 1910 print. On the site this should read as the traditional attribution, not as fact.

## Summary of points for the human to confirm

1. **v1 pāda 1**: त्रिलोचनाय (chosen; A, C, D, E, F) vs **विलोचनाय** (B 1910). The sense changes, and B's reading is metrically regular.
2. **v2 pāda 3**: मन्दारपुष्पबहुपुष्प (chosen; A, C, D) vs **मन्दारमुख्यबहुपुष्प** (B, E, F). The witnesses are split 3–3. The sense is nearly the same.
3. **v2 refrain**: तस्मै मकाराय (chosen; A, C, D, E, F) vs **तस्मै मकारमहिताय** (B; A notes it as a "variation"). Only B's reading keeps v2 in vasantatilakā throughout.
4. **v3 pāda 1**: गौरीवदनाब्जवृन्द (chosen; A, D; बृन्द in B, F) vs **…वदनाब्जबाल** (C) vs **…वदनारविन्द** (E). The sense changes.
5. **v4 pāda 1**: गौतमार्य (chosen; A, B, C, D, F) vs **गौतमादि** (E). The sense changes slightly.
6. **v5 pāda 1**: यक्षस्वरूपाय (chosen; A, B, D, E, F) vs **यज्ञस्वरूपाय** (C). The sense changes.
7. **v6 phalaśruti**: present in A, C and D, absent in B, E and F. It is kept as v6 per the brief.
8. **v6 layout**: one half-verse per line (as the witnesses print it) or split into four pādas.

## Verse 1

**Witness numbering:** A: 1 | B: 1 | C: 1 | D: 1 | E: 1 | F: 1
**Akṣara:** opens with **ना** (नागेन्द्र…), standing for **न**. Refrain: **तस्मै नकाराय नमः शिवाय**.
**Metre:** 11 syllables per pāda. Pādas 2–4 are regular indravajrā (GGL GGL LGL GG). In pāda 1, the chosen त्रिलोचनाय makes syllable 6 (…हारा**य** त्रि…) heavy by position: GGLGG**G**LGLGG. With B's विलोचनाय the pāda is regular indravajrā.

**Chosen reading:**

```
नागेन्द्रहाराय त्रिलोचनाय
भस्माङ्गरागाय महेश्वराय ।
नित्याय शुद्धाय दिगम्बराय
तस्मै नकाराय नमः शिवाय ॥ १ ॥
```

1. **त्रिलोचनाय vs विलोचनाय** (pāda 1, **changes the sense; human check**): त्रिलोचनाय ("the three-eyed one") is in A, C, D, E and F. विलोचनाय is in B (1910 print; the page image is clear, and the OCR's विखोचनाय agrees). Chosen **त्रिलोचनाय** (5 of 6). Note: विलोचनाय is the metrically regular reading (see Metre). त्रिलोचनाय puts a heavy syllable where indravajrā has a light one, unless the conjunct त्र is allowed not to make position. vilocana is usually just "eye", so the epithet would mean "the one with [remarkable] eyes" and would lose the explicit "three".
2. **नकाराय vs ‘न’ काराय / न काराय**: D prints ‘न’ काराय (with quotes). drikpanchang prints न काराय. Typographic only. Chosen **नकाराय** (A, B, C, E, F).
3. **Layout**: A and C print each half-verse on one line (C puts a dash between the pādas). B, D, E and F print one pāda per line. Chosen: one pāda per line.
4. End mark: "॥ १॥" (A, D), "॥ १ ॥" (B, C, E, F; the Wikisource transcription of B has "॥१॥"). Chosen "॥ १ ॥".

## Verse 2

**Witness numbering:** A: 2 | B: 2 | C: 2 | D: 2 | E: 2 | F: 2
**Akṣara:** opens with **म** (मन्दाकिनी…). Refrain: **तस्मै मकाराय नमः शिवाय** (B: तस्मै मकारमहिताय नमः शिवाय).
**Metre:** pādas 1–3 have 14 syllables, vasantatilakā (GGLG LLLG LLGL GG). With the chosen refrain मकाराय, pāda 4 has 11 syllables (indravajrā, like every other refrain). With B's मकारमहिताय, pāda 4 is also vasantatilakā (14 syllables), so the verse is metrically uniform.

**Chosen reading:**

```
मन्दाकिनीसलिलचन्दनचर्चिताय
नन्दीश्वरप्रमथनाथमहेश्वराय ।
मन्दारपुष्पबहुपुष्पसुपूजिताय
तस्मै मकाराय नमः शिवाय ॥ २ ॥
```

1. **मन्दारपुष्पबहुपुष्प vs मन्दारमुख्यबहुपुष्प** (pāda 3, **human decision: the witnesses are split 3–3**): मन्दारपुष्पबहुपुष्पसुपूजिताय is in A, C and D (and drikpanchang and Gita Press *Shiv Stotra Ratnakar*). मन्दारमुख्यबहुपुष्पसुपूजिताय is in B, E and F, but F probably descends from B. Chosen **मन्दारपुष्प…**, the reading of the two independent pan-Indian prints (C, D) and of popular recitation. Sense: "well worshipped with mandāra flowers and many [other] flowers" vs "well worshipped with many flowers, chief among them the mandāra". The difference is slight. Both scan identically. मुख्य avoids repeating पुष्प, which some may consider the better reading.
2. **मकाराय vs मकारमहिताय** (pāda 4, **metre; slight change of sense; human check**): मकाराय is in A (main text), C, D, E and F. मकारमहिताय is in B, and A also records "variation मकारमहिताय". Chosen **मकाराय** (5 of 6). Sense: "to him who is the syllable ma" vs "to him honoured as the syllable ma". As noted under Metre, मकारमहिताय is the only reading that keeps v2 in a single metre. मकाराय makes the refrain identical in form to the other four.
3. **मन्दाकिनी vs मन्दाकिनि-** (pāda 1): मन्दाकिनी is in B, C, D, E and F. A prints मन्दाकिनि- with a short i and a hyphen. Chosen **मन्दाकिनी**. A's short i makes syllable 4 light and breaks the vasantatilakā, so it is an error.
4. **Spacing and hyphens**: A hyphenates (मन्दाकिनि-सलिलचन्दन-चर्चिताय, नन्दीश्वर-प्रमथनाथ- महेश्वराय, मन्दारपुष्प-बहुपुष्प-सुपूजिताय). C spaces the words of pādas 1–2 (मन्दाकिनी सलिल चन्दन चर्चिताय, नन्दीश्वर प्रमथनाथ महेश्वराय). Chosen: unbroken compounds, as in B, D, E and F.
5. **‘म’ काराय** (D): typographic only. See v1.

## Verse 3

**Witness numbering:** A: 3 | B: 3 | C: 3 | D: 3 | E: 3 | F: 3
**Akṣara:** opens with **शि** (शिवाय…). Refrain: **तस्मै शिकाराय नमः शिवाय**.
**Metre:** upajāti. Pāda 1 is upendravajrā (LGL GGL LGL GG) and pādas 2–4 are indravajrā. All four readings at the pāda-1 locus (वृन्द / बृन्द / बाल / अरविन्द) scan as 11 syllables of the same pattern.

**Chosen reading:**

```
शिवाय गौरीवदनाब्जवृन्द
सूर्याय दक्षाध्वरनाशकाय ।
श्रीनीलकण्ठाय वृषध्वजाय
तस्मै शिकाराय नमः शिवाय ॥ ३ ॥
```

1. **गौरीवदनाब्जवृन्दसूर्याय vs …वदनाब्जबृन्द… vs …वदनाब्जबाल… vs …वदनारविन्द…** (pāda 1, **changes the sense; human check**):
   - वदनाब्जवृन्द-: A, D (also drikpanchang and Gita Press *Shiv Stotra Ratnakar*).
   - वदनाब्जबृन्द-: B, F. This is the same word with a different spelling (vṛnda / bṛnda), so वृन्द + बृन्द = 4 of 6.
   - वदनाब्जबाल-: C ("the young, i.e. rising, sun to the lotus of Gaurī's face"). The page image is clear.
   - वदनारविन्द-: E ("the sun to the lotus (aravinda) of Gaurī's face"). It drops वृन्द.
   Chosen **वदनाब्जवृन्द**, with the standard spelling व as in A and D. Sense of the chosen reading: "the sun to the cluster of lotuses that is Gaurī's face" (D's Hindi: पार्वतीजीके मुखकमलको विकसित (प्रसन्न) करनेके लिये जो सूर्यस्वरूप हैं). बाल adds "young or dawn", and अरविन्द simply means "lotus". The core image (Śiva as the sun that makes Gaurī's lotus-face bloom) is the same in all four.
2. **Hyphen across the pāda break**: B, D, E and F end pāda 1 with "-". F also starts pāda 2 with "-सूर्याय". A hyphenates वदनाब्ज-वृन्द-सूर्याय inside its long line. Chosen: no hyphen. The line break stands for the pāda break.
3. **‘शि’ काराय** (D): typographic only.

## Verse 4

**Witness numbering:** A: 4 | B: 4 | C: 4 | D: 4 | E: 4 | F: 4
**Akṣara:** opens with **व** (वसिष्ठ…). The refrain names the syllable as **वकार**: **तस्मै वकाराय नमः शिवाय**. The mantra syllable is वा (नमः शि**वा**य), but every witness writes वकाराय.
**Metre:** upajāti. Pādas 1–2 are upendravajrā and pādas 3–4 are indravajrā.

**Chosen reading:**

```
वसिष्ठकुम्भोद्भवगौतमार्य
मुनीन्द्रदेवार्चितशेखराय ।
चन्द्रार्कवैश्वानरलोचनाय
तस्मै वकाराय नमः शिवाय ॥ ४ ॥
```

1. **गौतमार्य- vs गौतमादि-** (pāda 1, **slight change of sense**): गौतमार्य is in A, B, C, D and F. गौतमादि is in E. Chosen **गौतमार्य** (5 of 6). Sense: "by Vasiṣṭha, Agastya (Kumbhodbhava, 'pot-born'), Gautama, the noble (ārya) lords among sages, and by the gods" vs "by Vasiṣṭha, Agastya, Gautama and other lords among sages…". Both scan the same. D's Hindi (वसिष्ठ, अगस्त्य और गौतम आदि श्रेष्ठ मुनियोंने तथा इन्द्र आदि देवताओंने) renders आर्य as श्रेष्ठ and takes मुनीन्द्रदेव as "sages, and Indra and the gods". A's translation also has "Indra and other Gods". This parsing question for annotators is मुनि + इन्द्र + देव vs मुनीन्द्र + देव.
2. **वसिष्ठ vs वसिष्ट / बसिष्ठ**: every page image reads वसिष्ठ. वसिष्ट is a slip in the Wikisource transcription of B, and बसिष्ठ is an archive.org OCR error for D. Neither is a reading.
3. **वकाराय vs वकारांय**: वकारांय is a slip in the Wikisource transcription of B. The 1910 print has वकाराय.
4. **Hyphenation**: A hyphenates वसिष्ठ-कुम्भोद्भव-गौतमार्यमुनीन्द्र-देवार्चितशेखराय and चन्द्रार्क-वैश्वानरलोचनाय. B, C, D, E and F mark only the pāda-1/2 break. Chosen: unbroken compounds, with no hyphen at the pāda break.
5. **‘व’ काराय** (D): typographic only.

## Verse 5

**Witness numbering:** A: 5 | B: 5 | C: 5 | D: 5 | E: 5 | F: 5
**Akṣara:** opens with **य** (यक्ष…). Refrain: **तस्मै यकाराय नमः शिवाय**.
**Metre:** upajāti. Pāda 1 is indravajrā, pāda 2 upendravajrā, and pādas 3–4 indravajrā. यज्ञ scans the same as यक्ष.

**Chosen reading:**

```
यक्षस्वरूपाय जटाधराय
पिनाकहस्ताय सनातनाय ।
दिव्याय देवाय दिगम्बराय
तस्मै यकाराय नमः शिवाय ॥ ५ ॥
```

1. **यक्षस्वरूपाय vs यज्ञस्वरूपाय** (pāda 1, **changes the sense; human check**): यक्षस्वरूपाय is in A, B, D, E and F (also drikpanchang). यज्ञस्वरूपाय is in C (the page image is clear, and the OCR agrees). Chosen **यक्षस्वरूपाय** (5 of 6). Sense: "who took the form of a yakṣa". D's Hindi reads जिन्होंने यक्षरूप धारण किया है, and A's translation reads "who bears the form of a YakSha". C's reading would mean "whose very form is the sacrifice". Annotators may connect the yakṣa reading with the Kena Upaniṣad (3.1–12), where Brahman appears to the gods as a yakṣa. No passage from it was saved in this pass.
2. **नमः vs नम:**: the Wikisource transcription of B has an ASCII colon. Typographic only.
3. **‘य’ काराय** (D): typographic only.
4. **What follows**: B, E and F end the stotra here with a colophon. A, C and D continue with the phalaśruti (v6).

## Verse 6 (phalaśruti)

**Witness numbering:** A: unnumbered | B: — (absent) | C: 6 | D: 6 | E: — (absent) | F: — (absent)
**Akṣara:** none (this is the phalaśruti, not an akṣara verse).
**Metre:** anuṣṭubh (śloka), 4 × 8 syllables. Syllables 5–7 are LGG in the odd pādas and LGL in the even pādas, so the śloka is regular (pathyā).

**Chosen reading:**

```
पञ्चाक्षरमिदं पुण्यं यः पठेच्छिवसन्निधौ ।
शिवलोकमवाप्नोति शिवेन सह मोदते ॥ ६ ॥
```

(One half-verse per line, as all three witnesses print it. If the dataset needs one pāda per line, split after पुण्यं and अवाप्नोति.)

1. **Presence** (**human check**): the phalaśruti is printed by A, C and D (and drikpanchang and Gita Press *Shiv Stotra Ratnakar*). It is absent from B (1910 Vani Vilas), E (Sringeri) and F (stotranidhi), which end with a colophon after v5. Following the brief, it is kept as v6 because three independent witnesses print it. It should be marked as a phalaśruti that the Vani Vilas/Sringeri tradition does not include.
2. **पञ्चाक्षर vs पंचाक्षर**: A writes an anusvara. Orthographic only. Chosen ञ्च (C, D).
3. **सन्निधौ vs संनिधौ**: सन्निधौ is in A and D. C has संनिधौ. Orthographic only. Chosen **सन्निधौ**.
4. **Number**: C and D print ॥ ६ ॥. A has no number. Chosen "॥ ६ ॥".

## Gaps

- sanskritdocuments.org (live) returned HTTP 403 (Cloudflare). A was read from the Wayback snapshot of 2025-08-01 (web.archive.org/web/20250801111702/…/panch.html), and its text is the 2020-updated file.
- B, C and D were transcribed by eye from archive.org page images (B: jp2 leaves 0130–0131; C: leaf 0475; D: leaves 0030–0031), because the OCR of all three is unreliable. The year of the Gita Press Stotraratnavali edition was not seen.
- The Sanskrit Wikisource page is not proofread (index status "OCR") and was used only as a transcription of B.
- Not reached: greenmesg.org (bot verification), vignanam.org (HTTP 202 challenge page), shlokam.org (404 at the URL tried).
- No manuscript or commentary evidence was found. The attribution and the phalaśruti's status rest on modern prints only.
- No dictionary entries were saved. No primary-text passage was saved (for example Kena Upaniṣad 3 for the yakṣa image in v5, or the Dakṣa-yajña story for v3). Save these per verse if an annotation will cite them.
