---
name: stotram-refine
description: Run the iterative generation loop for stotram verses - evidence, two independent drafts, deterministic and tool checks, independent LLM judges, surgical repair - until each verse passes docs/QUALITY_CHECKS.md or needs a human. Use when asked to create, draft, refine or improve verses with the checks, e.g. "/stotram-refine shiva-tandava-stotram v6" or "… v6-v10".
---

# /stotram-refine <stotram-id> <verse or range>

You orchestrate; the `stotram-drafter` and `stotram-judge` subagents draft and judge, each in a fresh context. **You are the
only one who writes `data/stotrams/*.json`**, always through the CLI and one command at a time, so pipelined verses never race.
`C` = `.venv/bin/python -m checks`, `F` = `data/stotrams/<id>.json`, `R` = `research/<id>/<verse>/`.

Editorial rules for drafts and repairs: `docs/EDITORIAL_GUIDE.md` (drafters get them via `checks/DRAFTING.md`).

Keep chat updates to one or two lines per verse. The user prefers token-lean, sequential runs (never a big fan-out).

## Once per stotram
- Preflight: `.venv/bin/python -m checks.selftest` passes; `vendor/vidyut-data/` and `vendor/mw/mw.txt` exist (`checks/README.md`).
- Evidence: one **stotram-researcher** whole-text pass writes `research/<id>/fulltext/` and every `R/` with text.txt,
  text-report.md and the text/commentary excerpts. No per-verse web research after that: dictionaries are local.

## Per verse (fast path)
1. **Prepare** (seconds): `C prepare F --verse <v> --tokens "<text.txt with | at extra display-word breaks>"`
   (+ `--kind phalashruti`, `--meter <id>` when needed). It inserts the skeleton, registers sources, locks the text
   (never pass `--confirm`), writes analyzer.json and saves local Monier-Williams entries for the stems it can find.
   Breaks must fall on clean boundaries; a sandhi junction can't be split.
2. *(folded into prepare)*: extra stems at any time with `C dict F --verse <v> --stems a,b --register`.
3. **Draft**: two **stotram-drafter** agents in ONE message (mode draft, output `R/drafts/a.json` and `R/drafts/b.json`).
   They read `checks/DRAFTING.md`, look up missing stems themselves and self-validate with `C draft-check`.
4. **Pick**: `C consistency F --verse <v> R/drafts/a.json R/drafts/b.json`, then for each draft
   `C draft-check F R/drafts/<x>.json`; `C insert F` the one with fewer fails (tie: a).
   **Pipeline:** now run steps 1–3 for the NEXT verse, so its drafters work while this verse is judged.
5. **Autofix + check**: `C autofix F --verse <v>`, then `C run F --verse <v> --quiet`; `cp R/report.json R/report-r1.json`.
6. **Judge, one wave**: `C judge-tasks F --verse <v> --grouped --spot T4.1` gives up to 5 tasks (4 groups + a single T4.1).
   Spawn one **stotram-judge** per task in ONE message, passing the bundle path and the evidence folder.
   Record each: groups with `C judge-record F --verse <v> --check group`, singles with `--check <ID>` (JSON on stdin).
7. **Repair, at most once**: if `C run` still shows `fail`s, run `C autofix` first; then, for anything left, one
   **stotram-drafter** in repair mode (with the verse index). Give it the fails, plus flags that two or more judges raised
   independently, plus flags whose fix is concrete and evidence-backed (a missing citation); other flags go to the human → `R/patches/<n>.json` → `C patch`, then
   `C run F --verse <v> --baseline R/report-r1.json` (exit 3 = regression → `C rollback`). Re-judge only the stale tasks
   (`C judge-tasks … --grouped --spot T4.1` lists just those), **once**. Judges aren't deterministic, so don't loop:
   anything still failing after that second judging round is left for the human.
8. **Finish**: `C finish F --verse <v>` promotes to ai_verified when clean, logs history and writes `R/summary.md`.
   Report one line: status, penalty trajectory, number of human items.

## After the last verse
For a brand-new stotram, `/stotram-new` runs this phase (Phase 4); for a refresh of an existing one:
`node scripts/validate.mjs F`, `npm run build`; refresh the stotram-level theme cards (`concepts`: description, story,
famous lines, per the guide's *Theme cards*), `about`, `faq`, `credits` and `relationships` from the verse notes (one drafter-style pass, then judge T4.9/T4.10 on them); `C run F --quiet` for the whole stotram (T1.9
cross-verse consistency).

## Cost and time per verse (typical)
Prepare + dict: seconds, 0 agents. 2 drafters (~6–10 min, in parallel, overlapped with the previous verse's judging).
1 wave of 5 judges (~1 min). 0–1 repair + 0–1 re-judge wave. No per-verse researcher.
