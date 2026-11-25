"""Quality checks for stotram source files (docs/QUALITY_CHECKS.md).

    .venv/bin/python -m checks run FILE [--verse v2] [--baseline REPORT] [--quiet]
    .venv/bin/python -m checks evidence FILE --verse v2           # Vidyut analyses → research/<id>/<v>/analyzer.json
    .venv/bin/python -m checks lock FILE --verse v2 --sources a,b,c [--confirm NAME]   # --confirm is for humans only
    .venv/bin/python -m checks prepare FILE --verse v3 [--tokens "…|…"] [--kind phalashruti] [--meter id]   # skeleton+sources+lock+analyser
    .venv/bin/python -m checks dict FILE --verse v3 [--auto] [--stems a,b]     # local Monier-Williams entries → sources/mw-*.md
    .venv/bin/python -m checks draft-check FILE DRAFT.json       # code/tool checks on a draft, no side effects (drafters use this)
    .venv/bin/python -m checks autofix FILE --verse v3           # mechanical fixes: confidence caps, known misspellings
    .venv/bin/python -m checks finish FILE --verse v3            # promote if clean, log history, write summary.md
    .venv/bin/python -m checks insert FILE DRAFT.json             # put a drafted verse into the file
    .venv/bin/python -m checks patch FILE PATCH.json --verse v2   # guarded JSON Patch + snapshot
    .venv/bin/python -m checks rollback FILE --verse v2 --to N
    .venv/bin/python -m checks consistency FILE --verse v2 A.json B.json C.json
    .venv/bin/python -m checks judge-tasks FILE --verse v2        # pending judges + their input bundles
    .venv/bin/python -m checks judge-record FILE --verse v2 --check T4.6 < findings.json
    .venv/bin/python -m checks judge-tasks FILE --verse v2 --grouped     # 4 grouped bundles instead of 15
    .venv/bin/python -m checks judge-record FILE --verse v2 --check group < {"T4.1": [...], ...}
    .venv/bin/python -m checks promote FILE --verse v2           # ai_draft → ai_verified when a fresh run is clean
    .venv/bin/python -m checks gold FILE                          # accuracy against data/gold/<id>.json
"""

from __future__ import annotations

import argparse
import copy
import json
import subprocess
import sys
from datetime import date
from pathlib import Path

from . import judges, morph, provenance, syntax, text  # noqa: F401  (registers checks)
from .core import REGISTRY, ROOT, Context, Result, summarize, text_hash, to_json

LOCKED = ("lines", "lock", "id", "number")


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, doc: dict) -> None:
    # Atomic: drafters read the file (draft-check) while the orchestrator prepares the next verse.
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def find_verse(doc: dict, vid: str) -> dict:
    for v in doc["verses"]:
        if v["id"] == vid:
            return v
    raise SystemExit(f"no verse '{vid}' in {doc['id']}")


# --- run ------------------------------------------------------------------------------------


def structural(path: Path) -> dict[str, list[str]]:
    """T1.1: the Node validator (Zod schema + cross-references). Errors grouped by verse id ('' = doc)."""
    proc = subprocess.run(["node", str(ROOT / "scripts" / "validate.mjs"), "--json", str(path)], capture_output=True, text=True)
    try:
        res = json.loads(proc.stdout)[0]
    except (json.JSONDecodeError, IndexError):
        return {"": [f"validator crashed: {proc.stderr.strip()[:300]}"]}
    by: dict[str, list[str]] = {}
    for e in res["errors"]:
        head = e.split(".", 1)[0].split(":", 1)[0]
        by.setdefault(head if head.startswith("v") and head[1:].isdigit() else "", []).append(e)
    return by


def run_checks(path: Path, verse_ids: list[str] | None = None, write: bool = True) -> dict:
    doc = load(path)
    ctx = Context(path)
    lang = doc.get("language", "sa")
    struct = structural(path)
    reports = {}
    doc_results = [Result("T1.1", "fail", e) for e in struct.get("", [])] or [Result("T1.1", "pass")]
    for c in REGISTRY.values():
        if c.scope == "doc" and c.fn and lang in c.languages:
            doc_results += c.fn(ctx, doc) or [Result(c.id, "pass")]
    for verse in doc["verses"]:
        if verse_ids and verse["id"] not in verse_ids:
            continue
        results = [Result("T1.1", "fail", e) for e in struct.get(verse["id"], [])] or [Result("T1.1", "pass")]
        for c in sorted(REGISTRY.values(), key=lambda c: (c.tier, c.id)):
            if c.scope != "verse" or not c.fn or lang not in c.languages:
                continue
            try:
                results += c.fn(ctx, doc, verse) or [Result(c.id, "pass")]
            except (KeyboardInterrupt, SystemExit):
                raise
            except BaseException as e:  # incl. Rust panics from Vidyut; a crash is a finding about the checker, never a pass
                results.append(Result(c.id, "flag", f"check crashed: {type(e).__name__}: {e}"))
        results += judges.judge_results(ctx, doc, verse)
        results += doc_results
        for r in results:
            c = REGISTRY.get(r.check)
            r.severity = r.severity or (c.severity if c else "blocker")
            r.tier, r.method = (c.tier, c.method) if c else (1, "CODE")
        ev = ctx.evidence_dir(doc, verse)
        report = {
            "stotram": doc["id"], "verse": verse["id"], "date": date.today().isoformat(),
            "summary": summarize(results), "results": to_json(results),
        }
        if write:
            ev.mkdir(parents=True, exist_ok=True)
            (ev / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        reports[verse["id"]] = report
    return reports


def failing_keys(report: dict) -> set[tuple[str, str]]:
    return {(r["check"], r.get("path", "")) for r in report["results"] if r["status"] == "fail"}


def print_report(report: dict, quiet: bool) -> None:
    s = report["summary"]
    print(f"{report['stotram']} {report['verse']}: penalty {s['penalty']} · blockers {s['blockers_failed']} · majors {s['majors_failed']} · "
          f"minors {s['minors_failed']} · flags {s['flags']} · judges pending {s['judges_pending']} · exit_ready={s['exit_ready']}")
    if quiet:
        return
    order = {"fail": 0, "flag": 1, "pending": 2, "skip": 3}
    for r in sorted(report["results"], key=lambda r: (order.get(r["status"], 9), r.get("tier", 0), r["check"])):
        if r["status"] == "pass":
            continue
        where = f" [{r['path']}]" if r.get("path") else ""
        print(f"  {r['status']:<7} {r.get('severity', ''):<7} {r['check']:<6}{where} {r.get('message', '')}")


def cmd_run(a):
    reports = run_checks(Path(a.file), [a.verse] if a.verse else None)
    regressions = False
    for vid, rep in reports.items():
        print_report(rep, a.quiet)
        if a.baseline:
            base = json.loads(Path(a.baseline).read_text())
            new = failing_keys(rep) - failing_keys(base)
            fixed = failing_keys(base) - failing_keys(rep)
            print(f"  vs baseline: fixed {len(fixed)}, new failures {len(new)}, penalty {base['summary']['penalty']} → {rep['summary']['penalty']}")
            for k in sorted(new):
                print(f"  REGRESSION {k[0]} {k[1]}")
            regressions |= bool(new) or rep["summary"]["penalty"] > base["summary"]["penalty"]
    sys.exit(3 if regressions else 0)


# --- evidence, lock, insert -----------------------------------------------------------------


def cmd_evidence(a):
    path = Path(a.file)
    doc, ctx = load(path), Context(path)
    verse = find_verse(doc, a.verse)
    words = []
    for line in verse["lines"]:
        for w in line["words"]:
            slp = ctx.deva_to_slp1(w["text"])
            words.append({"id": w["id"], "text": w["text"], "iast": ctx.to_iast(w["text"]),
                          "lexicon": morph.analyses(ctx, ctx.to_iast(w["text"])), "splits": _top_splits(ctx, slp)})
    meter_scan = []
    for line in verse["lines"]:
        t = " ".join(ctx.deva_to_slp1(w["text"]) for w in line["words"])
        meter_scan.append("".join(x.weight for x in ctx.chandas.classify(t).aksharas[0]))
    out = ctx.evidence_dir(doc, verse) / "analyzer.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"tool": "vidyut 0.4", "words": words, "meter_scan": meter_scan}, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {out.relative_to(ROOT)}")


def _top_splits(ctx, slp: str, limit: int = 8) -> list[str]:
    """Two-way splits whose halves are both known words or stems: hints for the drafter, not answers."""
    seen = []
    for i in range(2, len(slp) - 1):
        for s in ctx.splitter.split_at(slp, i):
            if s.is_valid and (s.first in ctx.kosha and s.second in ctx.kosha):
                pair = f"{ctx.slp1_to_iast(s.first)} + {ctx.slp1_to_iast(s.second)}"
                if pair not in seen:
                    seen.append(pair)
    return seen[:limit]


def cmd_lock(a):
    path = Path(a.file)
    doc = load(path)
    verse = find_verse(doc, a.verse)
    ids = {s["id"] for s in doc["sources"]}
    sources = [s for s in a.sources.split(",") if s]
    unknown = [s for s in sources if s not in ids]
    if unknown:
        raise SystemExit(f"unknown sources {unknown}; register them in the file first")
    verse["lock"] = {"hash": text_hash(verse), "sources": sources, "confirmed_by": a.confirm or None}
    if a.confirm:
        verse["review"].setdefault("history", []).append({"date": date.today().isoformat(), "by": a.confirm, "action": "Confirmed the text lock."})
    save(path, doc)
    print(f"locked {a.verse}: {verse['lock']['hash'][:23]}… confirmed_by={verse['lock']['confirmed_by']}")


def cmd_insert(a):
    path = Path(a.file)
    doc, draft = load(path), load(Path(a.draft))
    if (ROOT / "research" / doc["id"] / draft["id"] / "sources").exists():
        register_sources(doc, ROOT / "research" / doc["id"] / draft["id"])
    merge_new(doc, draft)
    existing = next((v for v in doc["verses"] if v["id"] == draft["id"]), None)
    if existing and existing.get("lock"):
        if text_hash(draft) != existing["lock"]["hash"]:
            raise SystemExit("the draft's text differs from the locked text; drafts may not change the text")
        draft["lock"] = existing["lock"]
        old = existing.get("review", {})
        draft["review"] = {"status": old.get("status", "ai_draft"),
                           "history": [*old.get("history", []), *draft.get("review", {}).get("history", [])]}
    if existing:
        doc["verses"][doc["verses"].index(existing)] = draft
    else:
        doc["verses"].append(draft)
        doc["verses"].sort(key=lambda v: v["number"])
    save(path, doc)
    print(f"inserted {draft['id']}")


def register_sources(doc: dict, ev: Path) -> list[str]:
    """Add every evidence file's source (from its header) to the stotram; return the non-dictionary ids."""
    import re
    known = {s_["id"] for s_ in doc["sources"]}
    text_sources = []
    for f in sorted((ev / "sources").glob("*.md")):
        head = f.read_text(encoding="utf-8").split("\n---", 1)[0]
        h = dict(re.findall(r"^(\w+):\s*(.*?)\s*(?:#.*)?$", head, re.M))
        if h.get("kind") not in ("dictionary", "analysis"):
            text_sources.append(h["source"])
        if h["source"] not in known:
            src = {"id": h["source"], "name": h["name"], "kind": h["kind"]}
            if h.get("url", "").startswith("http"):
                src["url"] = h["url"]
            doc["sources"].append(src)
            known.add(h["source"])
    return text_sources


def cmd_dict(a):
    """Save Monier-Williams entries from the local copy: guessed from the verse (--auto) and/or named (--stems)."""
    from . import dictionary as D
    path = Path(a.file)
    doc, ctx = load(path), Context(path)
    verse = find_verse(doc, a.verse)
    folder = ctx.evidence_dir(doc, verse) / "sources"
    folder.mkdir(parents=True, exist_ok=True)
    stems = [x.strip() for x in (a.stems or "").split(",") if x.strip()]
    if a.auto:
        keys = set(D.index())
        for w in (w for line in verse["lines"] for w in line["words"]):
            stems += D.guess_stems(ctx, w["text"], keys)
    saved, missing = [], []
    for st in dict.fromkeys(stems):
        out = D.save(ctx, folder, st)
        (saved if out else missing).append(st)
    if a.register:  # orchestrator only: parallel drafters must not write the stotram file
        register_sources(doc, ctx.evidence_dir(doc, verse))
        save(path, doc)
    print(f"saved {len(saved)}: {', '.join(saved)}")
    if missing:
        print(f"not in MW as headwords: {', '.join(missing)}")


def cmd_draft_check(a):
    """Code and tool checks on a draft verse, without touching the stotram file or the verse's report."""
    import tempfile
    path = Path(a.file)
    doc, draft = load(path), load(Path(a.draft))
    existing = next((v for v in doc["verses"] if v["id"] == draft["id"]), None)
    if existing and existing.get("lock"):
        if text_hash(draft) != existing["lock"]["hash"]:
            print("FAIL T0.1: the draft's lines differ from the locked text; copy lines exactly from the skeleton")
            sys.exit(1)
        draft = {**draft, "lock": existing["lock"]}
    register_sources(doc, ROOT / "research" / doc["id"] / draft["id"])
    merge_new(doc, draft)
    doc["verses"] = [draft if v["id"] == draft["id"] else v for v in doc["verses"]] + ([] if existing else [draft])
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp) / path.name
        save(tmp_path, doc)
        rep_ = run_checks(tmp_path, [draft["id"]], write=False)[draft["id"]]
    fails = [r for r in rep_["results"] if r["status"] == "fail"]
    for r in fails:
        print(f"FAIL {r['check']} [{r.get('path', '')}] {r.get('message', '')}" + (f"  → fix: {r['suggested_fix']}" if r.get("suggested_fix") else ""))
    print(f"{len(fails)} failing code/tool check(s); penalty {rep_['summary']['penalty']} (judged checks are not run here)")
    sys.exit(1 if fails else 0)


AUTOFIX = {"T6.2", "T4.8b"}


def cmd_autofix(a):
    """Apply mechanical fixes (confidence caps, known Hindi misspellings) as a guarded, snapshotted patch."""
    path = Path(a.file)
    rep_ = run_checks(path, [a.verse])[a.verse]
    doc = load(path)
    vi = [v["id"] for v in doc["verses"]].index(a.verse)
    verse = doc["verses"][vi]
    ops = []
    for r in rep_["results"]:
        if r["status"] != "fail" or r["check"] not in AUTOFIX:
            continue
        if r["check"] == "T6.2":
            ops.append({"op": "replace", "path": f"/verses/{vi}/" + r["path"].replace(".", "/"), "value": "medium"})
    if any(r["status"] == "fail" and r["check"] == "T4.8b" for r in rep_["results"]):
        from .text import HINDI_MISSPELLINGS
        fixed = json.loads(json.dumps(verse, ensure_ascii=False))
        def walk(node, ptr):
            if isinstance(node, dict):
                for k, v in node.items():
                    walk(v, f"{ptr}/{k}")
            elif isinstance(node, list):
                for i, v in enumerate(node):
                    walk(v, f"{ptr}/{i}")
            elif isinstance(node, str):
                new = node
                for rx, fix, _ in HINDI_MISSPELLINGS:
                    new = rx.sub(fix, new)
                if new != node and not ptr.startswith(f"/verses/{vi}/lines"):
                    ops.append({"op": "replace", "path": ptr, "value": new})
        walk(fixed, f"/verses/{vi}")
    if not ops:
        print("nothing to autofix")
        return
    ev = Context(path).evidence_dir(doc, verse) / "patches"
    ev.mkdir(parents=True, exist_ok=True)
    out = ev / f"autofix-{len(list(ev.glob('autofix-*.json'))) + 1}.json"
    out.write_text(json.dumps(ops, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    a.patch = str(out)
    cmd_patch(a)


def cmd_finish(a):
    """Promote if eligible, log the run in review.history and write summary.md from the reports."""
    path = Path(a.file)
    doc = load(path)
    verse = find_verse(doc, a.verse)
    ev = Context(path).evidence_dir(doc, verse)
    rep_ = run_checks(path, [a.verse])[a.verse]
    s_ = rep_["summary"]
    penalties = [json.loads(f.read_text())["summary"]["penalty"] for f in sorted(ev.glob("report-r*.json"))] + [s_["penalty"]]
    cons = json.loads((ev / "consistency.json").read_text()) if (ev / "consistency.json").exists() else None
    total = sum(len(l["words"]) for l in verse["lines"])
    agree = f"{total - len(cons['disagreeing_words'])}/{total} words agreed across {len(cons['drafts'])} drafts" if cons else "no consistency run"
    repairs = len(list((ev / "iterations").glob("*.json"))) if (ev / "iterations").exists() else 0
    eligible = s_["exit_ready"] and not s_["majors_failed"]
    if eligible and verse["review"]["status"] == "ai_draft":
        verse["review"]["status"] = "ai_verified"
    action = (f"stotram-refine run: {agree}; {repairs} patch(es); penalty {' → '.join(map(str, penalties))}; "
              f"{s_['flags']} flag(s) for human review; status {verse['review']['status']}.")
    verse["review"].setdefault("history", []).append({"date": date.today().isoformat(), "by": "ai", "action": action})
    save(path, doc)
    flags = [r for r in rep_["results"] if r["status"] == "flag" and r["check"] != "T0.2"
             and "not in Vidyut's lexicon" not in r.get("message", "")]  # no action needed
    fails = [r for r in rep_["results"] if r["status"] == "fail"]
    lock = verse.get("lock") or {}
    lines = [f"# {verse['id']}: stotram-refine run, {date.today().isoformat()}", "",
             f"**Outcome:** `{verse['review']['status']}`. Penalty {' → '.join(map(str, penalties))}. {agree}. Exit-ready: {s_['exit_ready']}.", "",
             "## Needs a human", "",
             f"1. **Confirm the text lock** after reading `text-report.md`:",
             f"   `.venv/bin/python -m checks lock {a.file} --verse {a.verse} --sources {','.join(lock.get('sources', []))} --confirm \"<your name>\"`"]
    for r in fails:
        lines.append(f"- **FAIL {r['check']}** `{r.get('path', '')}`: {r.get('message', '')}")
    for r in flags:
        lines.append(f"- {r['check']} `{r.get('path', '')}`: {r.get('message', '')}" + (f" (suggested: {r['suggested_fix']})" if r.get("suggested_fix") else ""))
    (ev / "summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{a.verse}: {verse['review']['status']}; {len(flags)} flag(s), {len(fails)} fail(s) → {(ev / 'summary.md').relative_to(ROOT)}")


def write_context(doc: dict, ev: Path) -> None:
    """What a drafter may refer to: existing concept ids, and earlier verses' notes it can link to (#vN-aM)."""
    ctx_ = {
        "concepts": {cid: c["name"]["en"] for cid, c in (doc.get("concepts") or {}).items()},
        "annotations": {f"{v['id']}-{a_['id']}": a_["body"]["en"][:90].replace("\n", " ")
                        for v in doc["verses"] for a_ in v.get("annotations", [])},
        "how_to": "Use existing concept ids, or propose new ones in a top-level \"_new_concepts\": {id: {name: {en, hi}, description: {en, hi}}}.",
    }
    (ev / "drafts").mkdir(parents=True, exist_ok=True)
    (ev / "drafts" / "context.json").write_text(json.dumps(ctx_, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def merge_new(doc: dict, draft: dict) -> None:
    """Register sources and concepts a draft proposes (_new_sources, _new_concepts)."""
    known = {s_["id"] for s_ in doc["sources"]}
    doc["sources"] += [s_ for s_ in draft.pop("_new_sources", []) if s_["id"] not in known]
    doc.setdefault("concepts", {})
    for cid, c in draft.pop("_new_concepts", {}).items():
        doc["concepts"].setdefault(cid, c)


def cmd_prepare(a):
    """Per-verse setup in one step: register evidence sources, insert a skeleton from text.txt, lock, run the analyser.
    --tokens is the verse text with '|' marking extra display-word breaks inside long compounds (spaces and line
    breaks already split). Removing the '|' must give text.txt exactly."""
    import re
    path = Path(a.file)
    doc = load(path)
    ev = ROOT / "research" / doc["id"] / a.verse
    text = (ev / "text.txt").read_text(encoding="utf-8").strip()
    tokens = (a.tokens or text).strip()
    if tokens.replace("|", "") != text:
        raise SystemExit("--tokens must equal text.txt once the '|' marks are removed")
    text_sources = register_sources(doc, ev)
    save(path, doc)
    ctx = Context(path)
    lines, n = [], 0
    for raw in tokens.split("\n"):
        m = re.match(r"^(.*?)\s*((?:[।॥]\s*[०-९]*\s*[।॥]?)?)$", raw.strip())
        body, end = m.group(1), m.group(2).strip()
        words = []
        for tok in re.split(r"[\s|]+", body):
            if tok:
                n += 1
                words.append({"id": f"w{n}", "text": tok, "iast": ctx.to_iast(tok)})
        lines.append({"words": words, "end": end})
    skeleton = {"id": a.verse, "number": int(a.verse[1:]), "kind": a.kind, **({"meter": a.meter} if a.meter else {}),
                "lines": lines, "translations": {"en": {"lines": []}, "hi": {"lines": []}}, "words": {},
                "review": {"status": "ai_draft", "history": []}}
    (ev / "drafts").mkdir(parents=True, exist_ok=True)
    (ev / "drafts" / "skeleton.json").write_text(json.dumps(skeleton, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    a.draft = str(ev / "drafts" / "skeleton.json")
    if not any(v["id"] == a.verse for v in doc["verses"]) or not find_verse(doc, a.verse).get("lock"):
        cmd_insert(a)
        a.sources, a.confirm = ",".join(text_sources), None
        cmd_lock(a)
    cmd_evidence(a)
    write_context(load(path), ev)
    a.auto, a.stems, a.register = True, None, True  # local Monier-Williams entries for the verse's stems
    cmd_dict(a)
    print(" ".join(f"{w['id']}={w['iast']}" for l in lines for w in l["words"]))


# --- patch, rollback ------------------------------------------------------------------------


def cmd_patch(a):
    path = Path(a.file)
    doc = load(path)
    verse = find_verse(doc, a.verse)
    vi = doc["verses"].index(verse)
    ops = load(Path(a.patch))
    ev = Context(path).evidence_dir(doc, verse) / "iterations"
    ev.mkdir(parents=True, exist_ok=True)
    n = len(list(ev.glob("*.json")))
    snapshot = {"verse": copy.deepcopy(verse), "sources": copy.deepcopy(doc["sources"])}
    disputes = [op for op in ops if op.get("op") == "test"]
    ops = [op for op in ops if op.get("op") != "test"]
    for op in ops:
        p = op["path"]
        parts = p.strip("/").split("/")
        if p == "/sources/-" and op["op"] == "add":
            doc["sources"].append(op["value"])
            continue
        if parts[:2] != ["verses", str(vi)] or len(parts) < 3:
            raise SystemExit(f"refused {p}: patches may only touch /verses/{vi}/… (this verse) or add /sources/-")
        if parts[2] in LOCKED or parts[2:4] == ["review", "status"]:
            raise SystemExit(f"refused {p}: {parts[2]} is locked (text, lock, ids and review status)")
        _apply(doc, parts, op)
    if getattr(a, "dry_run", False):  # repair drafters validate a patch without changing anything
        import tempfile
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp) / path.name
            save(tmp_path, doc)
            rep_ = run_checks(tmp_path, [a.verse], write=False)[a.verse]
        fails = [r for r in rep_["results"] if r["status"] == "fail"]
        for r in fails:
            print(f"FAIL {r['check']} [{r.get('path', '')}] {r.get('message', '')}")
        print(f"dry run: {len(ops)} op(s) apply cleanly; {len(fails)} failing code/tool check(s) after the patch")
        sys.exit(1 if fails else 0)
    (ev / f"{n:02d}.json").write_text(json.dumps({"before": snapshot, "patch": ops, "disputes": disputes}, ensure_ascii=False, indent=2) + "\n")
    save(path, doc)
    print(f"applied {len(ops)} op(s); snapshot iterations/{n:02d}.json")
    for d in disputes:  # the drafter believes a finding is wrong: a human decides
        print(f"  DISPUTED {d['path']}: {d.get('reason', '')}")


def _apply(doc, parts, op):
    node = doc
    for key in parts[:-1]:
        node = node[int(key)] if isinstance(node, list) else node[key]
    last = parts[-1]
    if isinstance(node, list):
        idx = len(node) if last == "-" else int(last)
        if op["op"] == "add":
            node.insert(idx, op["value"])
        elif op["op"] == "replace":
            node[idx] = op["value"]
        elif op["op"] == "remove":
            del node[idx]
    else:
        if op["op"] in ("add", "replace"):
            node[last] = op["value"]
        elif op["op"] == "remove":
            del node[last]


def cmd_rollback(a):
    path = Path(a.file)
    doc = load(path)
    verse = find_verse(doc, a.verse)
    snap = Context(path).evidence_dir(doc, verse) / "iterations" / f"{a.to:02d}.json"
    before = load(snap)["before"]
    doc["verses"][doc["verses"].index(verse)] = before["verse"]
    doc["sources"] = before["sources"]
    save(path, doc)
    print(f"rolled {a.verse} back to the state before iteration {a.to:02d}")


def cmd_promote(a):
    """ai_draft → ai_verified, only when a fresh run says the verse is clean. Never sets reviewed."""
    path = Path(a.file)
    rep_ = run_checks(path, [a.verse])[a.verse]
    s = rep_["summary"]
    if not s["exit_ready"] or s["majors_failed"]:
        raise SystemExit(f"not eligible: {s}")
    doc = load(path)
    verse = find_verse(doc, a.verse)
    if verse["review"]["status"] != "ai_draft":
        raise SystemExit(f"status is {verse['review']['status']}; promote only moves ai_draft → ai_verified")
    verse["review"]["status"] = "ai_verified"
    verse["review"].setdefault("history", []).append({"date": date.today().isoformat(), "by": "ai", "action": f"All blocker and major checks pass (flags: {s['flags']}); promoted to ai_verified."})
    save(path, doc)
    print(f"{a.verse} → ai_verified")


# --- self-consistency -----------------------------------------------------------------------


def cmd_consistency(a):
    path = Path(a.file)
    doc = load(path)
    verse = find_verse(doc, a.verse)
    drafts = [load(Path(d)) for d in a.drafts]
    words = [w["id"] for line in verse["lines"] for w in line["words"]]
    detail, disagree = {}, []
    for wid in words:
        sigs = [_word_signature(d, wid) for d in drafts]
        if any(s != sigs[0] for s in sigs[1:]):
            disagree.append(wid)
            detail[wid] = sigs
    out = Context(path).evidence_dir(doc, verse) / "consistency.json"
    out.write_text(json.dumps({"drafts": a.drafts, "disagreeing_words": disagree, "detail": detail}, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(words) - len(disagree)}/{len(words)} words agree across {len(drafts)} drafts; disagreements: {disagree}")


def _word_signature(draft: dict, wid: str) -> dict:
    """The structured analysis of one word, comparable across drafts (free-text meanings excluded)."""
    w = draft.get("words", {}).get(wid, {})
    padas = [p for p in draft.get("padas", []) if wid in p["words"]]
    return {
        "split": [p["iast"] for p in w.get("padaccheda", [])],
        "stems": [c["iast"] for c in w.get("components", [])],
        "padas": [{k: p["morph"].get(k) for k in ("type", "case", "number", "gender", "lakara", "person")} | {"role": p["role"]} for p in padas],
        "compound": (draft.get("compounds") or {}).get(w.get("compound") or "", {}).get("type"),
    }


# --- judges ---------------------------------------------------------------------------------


def cmd_judge_tasks(a):
    path = Path(a.file)
    doc, ctx = load(path), Context(path)
    verse = find_verse(doc, a.verse)
    pending = [r.check for r in judges.judge_results(ctx, doc, verse) if r.status == "pending"]
    folder = ctx.evidence_dir(doc, verse) / "judge-inputs"
    folder.mkdir(parents=True, exist_ok=True)
    tasks = []
    evidence = str((ctx.evidence_dir(doc, verse) / "sources").relative_to(ROOT))
    spot = [c for c in (a.spot or "").split(",") if c]
    for cid in spot:  # single-check judges that run alongside the groups (grouped judges miss subtle issues)
        if cid in pending:
            f = folder / f"{cid}.json"
            f.write_text(json.dumps(judges.judge_input(doc, verse, cid), ensure_ascii=False, indent=2) + "\n")
            tasks.append({"check": cid, "rubric": f"checks/judges/{cid}.md", "input": str(f.relative_to(ROOT)), "evidence": evidence})
    if a.grouped:
        for group, members in judges.GROUPS.items():
            todo = [c for c in members if c in pending and c not in spot]
            if not todo:
                continue
            f = folder / f"group-{group}.json"
            f.write_text(json.dumps(judges.group_input(doc, verse, group, todo), ensure_ascii=False, indent=2) + "\n")
            tasks.append({"group": group, "checks": todo, "input": str(f.relative_to(ROOT)), "evidence": evidence})
        print(json.dumps(tasks, indent=2))
        return
    for cid in (c for c in pending if c not in spot):
        f = folder / f"{cid}.json"
        f.write_text(json.dumps(judges.judge_input(doc, verse, cid), ensure_ascii=False, indent=2) + "\n")
        tasks.append({"check": cid, "rubric": f"checks/judges/{cid}.md", "input": str(f.relative_to(ROOT)),
                      "evidence": str((ctx.evidence_dir(doc, verse) / "sources").relative_to(ROOT))})
    print(json.dumps(tasks, indent=2))


def cmd_judge_record(a):
    path = Path(a.file)
    doc, ctx = load(path), Context(path)
    verse = find_verse(doc, a.verse)
    payload = json.loads(sys.stdin.read())
    if a.check == "group":  # {"T4.1": [...], "T4.2": [...]}
        for cid, findings in payload.items():
            out = judges.record(ctx, doc, verse, cid, findings)
            print(f"recorded {cid}: {sum(f['status'] != 'pass' for f in findings)} finding(s)")
        return
    out = judges.record(ctx, doc, verse, a.check, payload)
    print(f"recorded {len(payload)} finding(s) → {out.relative_to(ROOT)}")


# --- gold -----------------------------------------------------------------------------------


def cmd_gold(a):
    path = Path(a.file)
    doc = load(path)
    gold_path = ROOT / "data" / "gold" / f"{doc['id']}.json"
    gold = load(gold_path)
    total = right = 0
    misses = []
    for vid, g in gold["verses"].items():
        verse = find_verse(doc, vid)
        padas = {p["id"]: p for p in verse.get("padas", [])}
        for pid, want in g.get("padas", {}).items():
            got = padas.get(pid, {})
            for k, v in want.items():
                total += 1
                have = got.get("morph", {}) if k == "morph" else got.get(k)
                ok = all(have.get(mk) == mv for mk, mv in v.items()) if k == "morph" else have == v
                right += ok
                if not ok:
                    misses.append(f"{vid}.{pid}.{k}: want {v}, have {have}")
        for cid, want in g.get("compounds", {}).items():
            got = (verse.get("compounds") or {}).get(cid, {})
            for k, v in want.items():
                total += 1
                right += got.get(k) == v
                if got.get(k) != v:
                    misses.append(f"{vid}.{cid}.{k}: want {v!r}, have {got.get(k)!r}")
        for wid, want in g.get("words", {}).items():
            got = verse["words"].get(wid, {})
            if "padaccheda" in want:
                total += 1
                have = [p["iast"] for p in got.get("padaccheda", [])]
                right += have == want["padaccheda"]
                if have != want["padaccheda"]:
                    misses.append(f"{vid}.{wid}.padaccheda: want {want['padaccheda']}, have {have}")
    print(f"gold ({gold.get('status')}): {right}/{total} = {right / max(total, 1):.0%}")
    for m in misses:
        print("  miss", m)


def main():
    ap = argparse.ArgumentParser(prog="checks", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("run"); s.add_argument("file"); s.add_argument("--verse"); s.add_argument("--baseline"); s.add_argument("--quiet", action="store_true"); s.set_defaults(fn=cmd_run)
    s = sub.add_parser("evidence"); s.add_argument("file"); s.add_argument("--verse", required=True); s.set_defaults(fn=cmd_evidence)
    s = sub.add_parser("lock"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("--sources", required=True); s.add_argument("--confirm"); s.set_defaults(fn=cmd_lock)
    s = sub.add_parser("prepare"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("--tokens"); s.add_argument("--kind", default="verse"); s.add_argument("--meter"); s.set_defaults(fn=cmd_prepare)
    s = sub.add_parser("dict"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("--auto", action="store_true"); s.add_argument("--stems"); s.add_argument("--register", action="store_true"); s.set_defaults(fn=cmd_dict)
    s = sub.add_parser("draft-check"); s.add_argument("file"); s.add_argument("draft"); s.set_defaults(fn=cmd_draft_check)
    s = sub.add_parser("autofix"); s.add_argument("file"); s.add_argument("--verse", required=True); s.set_defaults(fn=cmd_autofix)
    s = sub.add_parser("finish"); s.add_argument("file"); s.add_argument("--verse", required=True); s.set_defaults(fn=cmd_finish)
    s = sub.add_parser("insert"); s.add_argument("file"); s.add_argument("draft"); s.set_defaults(fn=cmd_insert)
    s = sub.add_parser("patch"); s.add_argument("file"); s.add_argument("patch"); s.add_argument("--verse", required=True); s.add_argument("--dry-run", action="store_true"); s.set_defaults(fn=cmd_patch)
    s = sub.add_parser("rollback"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("--to", type=int, required=True); s.set_defaults(fn=cmd_rollback)
    s = sub.add_parser("promote"); s.add_argument("file"); s.add_argument("--verse", required=True); s.set_defaults(fn=cmd_promote)
    s = sub.add_parser("consistency"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("drafts", nargs="+"); s.set_defaults(fn=cmd_consistency)
    s = sub.add_parser("judge-tasks"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("--grouped", action="store_true"); s.add_argument("--spot", help="comma-separated checks to judge singly alongside the groups, e.g. T4.1"); s.set_defaults(fn=cmd_judge_tasks)
    s = sub.add_parser("judge-record"); s.add_argument("file"); s.add_argument("--verse", required=True); s.add_argument("--check", required=True); s.set_defaults(fn=cmd_judge_record)
    s = sub.add_parser("gold"); s.add_argument("file"); s.set_defaults(fn=cmd_gold)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
