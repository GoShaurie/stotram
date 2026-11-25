# checks/

Quality checks for stotram source files: the implementation of [docs/QUALITY_CHECKS.md](../docs/QUALITY_CHECKS.md).
Deterministic and tool checks run here (Python + [Vidyut](https://github.com/ambuda-org/vidyut)); judged checks are
run by the `stotram-judge` subagent against the rubrics in `judges/`, and recorded here.

## Setup (once)
```bash
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python vidyut indic-transliteration jsonschema
.venv/bin/python -c "import vidyut; vidyut.download_data('vendor/vidyut-data')"   # ~77 MB, from Vidyut's GitHub release
mkdir -p vendor/mw && curl -o vendor/mw/mw.txt https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/mw/mw.txt  # local Monier-Williams (~50 MB)
.venv/bin/python -m checks.selftest                                                 # must print "all good"
```
`.venv/` and `vendor/` are git-ignored.

## Use
```bash
npm run checks -- run data/stotrams/shiva-tandava-stotram.json --verse v1
```
Each run writes `research/<id>/<verse>/report.json` with every result (`pass · fail · flag · skip · pending`), severity,
path and suggested fix, plus a summary: `penalty` (100 per blocker, 10 per major, 1 per minor; lower is better) and
`exit_ready` (no failing blockers and no pending judges). `python -m checks --help` lists the other commands the
`/stotram-refine` loop uses (evidence, lock, insert, patch, rollback, consistency, judge-tasks, judge-record, promote, gold).

## Adding a check
1. Write a function in the right module and register it with `@check("T…", "title", tier=, method=, severity=)`.
   Return `fail(...)`/`flag(...)` results; return nothing for a pass. Use `flag` when the tool can't be sure.
2. Add a planted-defect case to `selftest.py` and make sure the reference verse still passes.
3. Update the table in `docs/QUALITY_CHECKS.md`.
For a judged check: add it to `JUDGES` in `judges.py` with the fields it reads, and write `judges/<ID>.md`.
