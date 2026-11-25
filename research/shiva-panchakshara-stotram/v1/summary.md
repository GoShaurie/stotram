# v1: stotram-refine run, 2026-11-20

**Outcome:** `ai_verified`. Penalty 0 → 0. 10/11 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-panchakshara-stotram.json --verse v1 --sources gitapress-stotraratnavali,ramakrishna-math-mantrapushpam,sanskritdocuments-panch,sringeri-shiva-panchakshara,stotranidhi-shiva-panchakshara,vanivilas-1910-works-17 --confirm "<your name>"`
- T4.1 `words.w2.alternatives`: The alternative reading for vilocanāya is glossed '(to Him) with (striking) eyes' (hi: 'जिनके नेत्र विलक्षण हैं'), and words.w2.notes.hi calls it 'सुन्दर नेत्रों वाले को'. mw-vilocana.md gives only 'the eye, sight' or 'distorting the eyes'. No evidence file supports 'striking' or 'beautiful', and the two Hindi glosses disagree with each other. This is a recorded alternative with medium confidence, so it is not a fail. A human should decide whether to drop the qualifier. (suggested: Gloss the alternative as '(to Him) with eyes, the seeing one', and use the same Hindi wording in notes.hi and alternatives.reading.hi.)
- T4.9 `annotations.a2.body`: The metre claim ('Vilocana also fits the beat of the line exactly, while trilocana puts a heavy syllable where the pattern expects a light one') has no citation. The only evidence is v1 text-report.md, which hedges it. The scansion is correct by standard prosody. A human should decide whether this claim needs its own support and the hedge. (suggested: Soften to 'by the usual counting of the metre, trilocana puts a heavy syllable where the pattern expects a light one', or add a citation that records the scan.)
