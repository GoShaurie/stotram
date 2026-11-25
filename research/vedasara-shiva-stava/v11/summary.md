# v11: stotram-refine run, 2026-11-21

**Outcome:** `ai_verified`. Penalty 0 → 0. 13/16 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/vedasara-shiva-stava.json --verse v11 --sources brihat-stotra-ratnakar-wikisource,gitapress-shiv-stotra-ratnakar,gitapress-stotraratnavali,kumarasambhava-3,linga-purana-1-101,linga-purana-1-3,mahanarayana-upanishad-17-23,mandukya-upanishad,ramakrishna-math-mantrapushpam,sanskritdocuments-vedasarast,shiva-purana-vidyeshvara,shlokam-vedasara-shiva-stava,taittiriya-upanishad-3-1,vanivilas-1910-works-17 --confirm "<your name>"`
- T2.5 `p2.morph.stem`: stem 'jagat' equals the inflected form; check it is the prātipadika
- T2.5 `p10.morph.stem`: stem 'jagat' equals the inflected form; check it is the prātipadika
- T2.5 `p17.morph.stem`: stem 'jagat' equals the inflected form; check it is the prātipadika
- T4.2 `words.w14.meaning`: liṅga has many senses in mw-linga.md: 'mark, sign', Śiva's emblem or icon, '(in Sāṃkhya) = prakṛti', and 'anything having an origin and therefore liable to be destroyed again'. The data picks 'a mark, sign...' as the sense, but the meaning just says 'liṅga' and the c3 note gives 'mark, sign; the liṅga'. Without a gloss, a reader will most likely think of the stone Śiva-liṅga, and that is probably not what 'this world which has the liṅga as its nature' means here. linga-purana-1-3.md (1.3.1-4) treats liṅga as the manifest, marked world (prakṛti) that comes from the unmarked Śiva. That sense, and the MW sense 'having an origin and liable to be destroyed', fit this line. Gita Press leaves it untranslated too, so this is not clearly wrong. A human should decide whether the contextual sense needs spelling out. (suggested: In words.w14 (meaning or notes) and c3.note, say which sense of liṅga is meant, e.g. 'liṅga here is the visible, marked form, the world that arises and dissolves, a sign of the unseen Śiva'.)
- T4.9 ``: Outside this rubric (display only): the a3 citation quotes for Liṅga Purāṇa 1.3.3 and 1.3.4 copy GRETIL markup from linga-purana-1-3.md, a '%' half-verse separator and a double space ('gandhavarṇarasairyuktaṃ  % śabdasparśādilakṣaṇam', 'vigraho jagatāṃ liṅgam  % aliṅgād abhavatsvayam'). The words match the excerpt, but if quotes are shown on the site this markup will show too. A human should decide whether to remove it.
- T1.9 `v11.p2`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p10`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p17`: 'jagat' is analysed differently in v10 and v11; fine if the context differs, but say why
- T1.9 `v11.p18`: 'etat' is analysed differently in v10 and v11; fine if the context differs, but say why
