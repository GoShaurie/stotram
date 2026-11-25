# v7: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 5/7 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/kalabhairava-ashtakam.json --verse v7 --sources gitapress-shiv-stotra-ratnakar,greenmesg-kalabhairava,ramakrishna-math-mantrapushpam,sanskritdocuments-kaalabhairava,sanskritdocuments-shivarahasya-kalabhairava,shlokam-kalabhairava,vanivilas-1910-works-18 --confirm "<your name>"`
- T2.8b `compounds.c5.type`: kapāla-mālikā-dhara is typed 'upapada', and the note says dhara is formed with the affix ac and 'only stands at the end of a compound'. An upapada compound (rule 2.2.19) needs a kṛt affix that a grammar rule attaches only when a specific preceding word is present. The general agent affix ac (the pacādi set, rule 3.1.134) has no such condition. mw-dhara.md also lists dhara as a standalone word: 'mf(ā)n. (√dhṛ) bearing, supporting (scil. the world, said of Kṛṣṇa and Śiva), MBh.' The usual analysis is therefore a tatpuruṣa with the genitive, 'kapālamālikāyāḥ dharaḥ'. The meaning does not change, so I am flagging this rather than failing it. (suggested: Set type 'tatpuruṣa', subtype 'ṣaṣṭhī', vigraha 'कपालानां मालिका कपालमालिका, तस्याः धरः, तम्'. Remove 'only stands at the end of a compound' from c5.note (en/hi), or record upapada as an alternative analysis.)
