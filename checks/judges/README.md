# Judge protocol

Judged checks are the ones code can't decide (docs/QUALITY_CHECKS.md, method `JUDGE`). Each is run by the
`stotram-judge` subagent in a **fresh context**: it sees one rubric, one input bundle and the evidence
excerpts, never the drafter's reasoning, other verdicts or earlier reports.

## Inputs
- `research/<stotram>/<verse>/judge-inputs/<CHECK>.json`: only the fields this check reads (from `checks judge-tasks`)
- `research/<stotram>/<verse>/sources/*.md`: evidence excerpts (source texts, translations, dictionary entries)
- `research/<stotram>/<verse>/analyzer.json`: Vidyut analyses (hints, not truth)

## Output
A JSON array of findings and nothing else. An empty array means pass.

```json
[
  { "status": "fail", "path": "words.w3.meaning", "message": "…what is wrong, citing the evidence file…", "suggested_fix": "…" },
  { "status": "flag", "path": "padas.p6", "message": "…genuinely uncertain; a human should decide…" }
]
```

## Rules for every judge
1. **Judge only your check.** Other problems you notice go in at most one `flag` with path `""`.
2. **Evidence or it didn't happen.** A `fail` names the evidence (file name, dictionary entry, rule). If you only have a hunch, `flag`.
3. **Fail the field, not the verse.** One finding per wrong field, with the exact `path` and a concrete `suggested_fix`.
4. **Respect recorded disagreement.** If the data already records an alternative or marks a form `irregular`, that is not a failure.
5. **No style policing outside your rubric.** A different-but-correct wording is a pass.

## Grouped judging
To save tokens, one judge may be given a **group** bundle (`judge-inputs/group-<name>.json`) listing several checks and
their rubrics. Apply each rubric separately, as if you were a different judge for each: a problem belongs to the one
check whose rubric covers it. Answer with ONE JSON object mapping every listed check to its findings array:

```json
{ "T4.1": [], "T4.2": [ { "status": "flag", "path": "…", "message": "…" } ], "T4.3": [], "T4.4": [] }
```
