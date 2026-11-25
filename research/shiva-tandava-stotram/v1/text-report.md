# Text report: shiva-tandava-stotram v1

Retrieved 2026-10-20. This is the verse-1 slice of `fulltext/text-report.md`. Metre: pañcacāmara (16 syllables per pāda, alternating laghu–guru). The chosen text was checked by a syllable count.

## Text witnesses

| # | source id | kind | what it is |
|---|-----------|------|------------|
| A | `sanskritdocuments-shivtand` | text | sanskritdocuments.org shivtAND.itx (Beeharry & Sharma), 17 verses. It prints alternative readings in parentheses. `sanskritdocuments-shivtand-meaning` (A') is on the same site and counts once with A. A' prints 13 + 2 verses, with vv. 14–15 in an appendix. |
| B | `sa-wikisource-shivatandava` | text | Sanskrit Wikisource, "सुसंशुद्धं" edition, 17 verses (the last one unnumbered) |
| C | `ramakrishna-math-mantrapushpam` | text (print) | Mantrapushpam, Ramakrishna Math, Mumbai, 3rd ed. 2007, pp. 468–470, 13 + 2 verses. Transcribed by eye from the page scans. |
| D | `shlokam-shiva-tandava` | translation (prints the text) | shlokam.org, 13 + 2 verses |
| E | `vyakhya-sts-N` | commentary (prints the text) | vyakhya.org Hindi commentary, one page per śloka, 17 verses |

These were checked only to see which readings are popular, not saved as sources: bhaktibharat.com/mantra/shiv-tandav-stotram (17 verses in A's order, probably derived from A) and hindu-blog.com/2020/02/shiva-tandava-stotram-lyrics.html (unnumbered and the same order. It shares bhaktibharat's corruptions in vv. 14–15, such as निर्भक्षरन्म, परिश्रय and मन्त्रभूषगो, so it is not independent of bhaktibharat).

Conventions: the chosen text is NFC Devanagari with one pāda per line. Hyphens that mark a compound running across a pāda break are dropped, because the line break stands for the pāda break (as in v2). Class nasals are written as conjuncts (ङ्ग, ञ्च, न्त), not as anusvara. Zero-width joiners are removed. The end mark is "॥ N ॥" and the mid-verse danda is " ।".

## Verse 1

**Witness numbering:** A: 1 | A': 1 | B: 1 | C: 1 | D: 1 | E: 1

**Chosen reading:**

```
जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥
```

1. **जटाटवी vs जटाऽटवी** (pāda 1): जटाटवी in A, A', C, D, E; जटाऽटवी (with avagraha marking jaṭā + aṭavī) in B only. Chosen **जटाटवी**. Orthographic only: the same jaṭā + aṭavī. This matches the text already in the dataset's v1.
2. **गलेऽवलम्ब्य vs गलेवलम्ब्य** (pāda 2): गलेऽवलम्ब्य in A, B, C, E; गलेवलम्ब्य in D. Chosen **गलेऽवलम्ब्य**. Orthographic only: gale + avalambya.
3. **भुजङ्गतुङ्ग vs भुजंगतुंग**: E writes anusvara for the class nasal. Orthographic only. Chosen ङ्ग, as in A, B, C, D.
4. **Spacing**: E prints "नःशिवः" with no space, which is a typo. D splits the first pāda as "जटाटवी गलज्जल प्रवाह पावितस्थले". Chosen: the A/B/C/E word division.
5. **Print artefact**: the C scan shows a speck above the first ज ("जंटाटवी" in the archive.org OCR). It is not a reading.
6. End mark: "॥ १॥" (A), "॥१॥" (B), "॥ १ ॥" (C, D), "।।" (E). Chosen "॥ १ ॥".

## Gaps

- The verse-text pages (A, A', B, D, E) were each fetched once on 2026-10-20 without problems. C was read from the archive.org page images (leaves 484–486, pp. 468–470), because the OCR is unreliable.
- From the v2 pass, not retried: greenmesg.org returned a reCAPTCHA page, shaivam.org returned HTTP 403, vignanam.org returned 403, and stotranidhi.com and detechter.com returned 404.
- No Gita Press edition was obtained. vv. 14–15 therefore rest on only three independent witnesses (A, B, E).
- No dictionary entries were fetched in this pass.
