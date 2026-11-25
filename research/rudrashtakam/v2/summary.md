# v2: stotram-refine run, 2026-11-24

**Outcome:** `ai_verified`. Penalty 0 → 0. 7/9 words agreed across 2 drafts. Exit-ready: True.

## Needs a human

1. **Confirm the text lock** after reading `text-report.md`:
   `.venv/bin/python -m checks lock data/stotrams/rudrashtakam.json --verse v2 --sources belvedere-1926-ramcharitmanas,gitapress-ramcharitmanas,greenmesg-rudrashtakam,kashiraj-ramcharitmanas,ramcharitmanas-uttarakanda-104-108,sanskritdocuments-rudra8,shlokam-rudrashtakam,wikisource-sa-rudrashtakam --confirm "<your name>"`
- T2.1 `words.w3.padaccheda`: Vidyut's sandhi rules can't split 'girājñānagotītamīśaṃ' into girā + jñāna + go + atītam + īśam; verify by hand
- T2.8b `compounds.c6.vigraha`: The vigraha puts members and whole in the masculine (गुणागारः, संसारपारः, असौ, तम्) but mw-agara.md gives āgāra as n., w8 components list āgāra and pāra as neuter, and p10 tags the compound neuter accusative. Human should decide which gender is intended. (suggested: Neuter: गुणानाम् आगारम् गुणागारम्, संसारस्य पारम् संसारपारम्; गुणागारं च तत् संसारपारं च. Or make p10 masculine and say so in the note.)
- T4.1 `words.w6.components[2].meaning`: The second kāla is glossed 'Death' but has no sense field; mw-kala.md excerpt shows only 'time (in general)', 'N. of Śiva'. Sources support the idea (gitapress 'महाकालके भी काल', sanskritdocuments 'Devourer even of the great Time-Spirit'). w6.meaning says 'great Death' while components/literal say 'great Time'. Human should confirm. (suggested: Add a sense from MW kāla 2 ('time as destroying all things, death') if present, and make the word meaning use the same term as the components.)
- T4.9 `verse.annotations.a2.citations`: The Ujjain claim in a2 rests on 'Uttarakāṇḍa 104 (kha), caupāī 1 (Ujjain)', whose excerpt in ramcharitmanas-uttarakanda-104-108.md is marked unchecked OCR (p. 1008). Probably right, but a human should confirm against the page image.
