# v1: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 10/10 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/kalabhairava-ashtakam.json --verse v1 --sources gitapress-shiv-stotra-ratnakar,greenmesg-kalabhairava,ramakrishna-math-mantrapushpam,sanskritdocuments-kaalabhairava,sanskritdocuments-shivarahasya-kalabhairava,shlokam-kalabhairava,vanivilas-1910-works-18 --confirm "<your name>"`
- T4.2 `words.w3.components[1]`: The component yajña is glossed en 'sacred', and its sense points to the compound headword 'yajña-sūtra' ('the sacrificial thread or cord', mw-yajnasutra.md) instead of a sense of yajña itself. 'Sacred' is not a dictionary sense of yajña, which means sacrifice or worship. The whole-word meaning ('sacred thread') is fine, but the component card shows a sense that yajña does not have on its own. This could be treated as a T4.1 gloss problem instead, so a human should decide. (suggested: Set the component's meaning.en to 'sacrifice, Vedic rite' and its sense to MW headword 'yajña' (mw-yajna). Keep 'sacred thread' as the meaning of the compound yajña-sūtra in c2 and in the word meaning.)
- T4.10 `annotations.a1.body`: Sentence 'These lotus feet are holy, and they make holy whoever comes to them' / 'जो इनके पास आए उसे भी पवित्र कर देते हैं' is given in the site's own voice and reads close to a promise to the reader. The text's word pāvana does mean 'purifying' (mw-pavana, p. 623,2), so this is a gloss and not an invented benefit claim. Still, 'whoever comes to them' goes a little beyond the word. A human should decide whether to tie it explicitly to the word's meaning. (suggested: EN: 'The word calls these lotus feet both holy in themselves and purifying.' HI: 'शब्द के अनुसार ये चरण-कमल स्वयं पवित्र हैं और पवित्र करने वाले भी।')
