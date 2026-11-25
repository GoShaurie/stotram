# v2: stotram-refine run, 2026-11-18

**Outcome:** `ai_verified`. Penalty 0 → 0. 5/7 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/shiva-panchakshara-stotram.json --verse v2 --sources gitapress-stotraratnavali,ramakrishna-math-mantrapushpam,sanskritdocuments-panch,sringeri-shiva-panchakshara,stotranidhi-shiva-panchakshara,vanivilas-1910-works-17 --confirm "<your name>"`
- T4.2 `words.w3.components[0].sense`: mw-mandara gives two senses that could fit here: 'the coral tree, Erythrina Indica (also regarded as one of the 5 trees of paradise or Svarga)' and 'a white variety of Calotropis Gigantea'. The data picks the coral tree. That reading is defensible, since it pairs well with the heavenly Mandākinī in pāda 1. But the white Calotropis (madār/āk) flower is the one actually offered in Śiva worship, and neither gitapress-stotraratnavali nor sanskritdocuments-panch says which plant is meant. The data does not record the second sense. A human should decide whether to note it. (suggested: Keep 'coral tree', and add a short note or alternative mentioning the white Calotropis (madār) sense listed in mw-mandara, which is the flower commonly offered to Śiva.)
- T4.4 `words.w7.notes`: w7 śivāya is marked epithet: true, but its only gloss is 'to Śiva'. No note explains the name. The meaning 'The Auspicious one' (mw-shiva) appears only in components[0].sense.gloss, which is not visible text. The rubric's pass case is a note saying the name means 'the auspicious one'. This is a refrain word, so that note may already be in v1; it cannot be checked from this bundle. (suggested: If v1 does not already explain the name, add to words.w7.notes: en 'Śiva means "the auspicious one".' / hi 'शिव का अर्थ है "मंगलमय, कल्याणकारी"।')
