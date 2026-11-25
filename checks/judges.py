"""LLM-judged checks. Python never calls a model: it lists pending judge tasks, and records verdicts
that a judge subagent (.claude/agents/stotram-judge.md) returns. Each verdict is stamped with a hash
of exactly the verse fields that judge reads, so editing a translation re-opens only the judges that
look at translations."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from .core import REGISTRY, ROOT, Result, judge

RUBRICS = ROOT / "checks" / "judges"

# check id → (title, tier, severity, verse fields it reads, doc fields it reads)
JUDGES = {
    "T2.8b": ("Samāsa type is right", 2, "major", ["compounds", "words", "padas"], []),
    "T2.9b": ("Compound nesting is right", 2, "major", ["compounds", "words"], []),
    "T3.4": ("Roles and heads are right", 3, "major", ["padas", "adhyahara", "anvaya", "words"], []),
    "T3.5": ("Translation is grounded", 3, "blocker", ["padas", "adhyahara", "translations", "words"], []),
    "T3.6": ("Anvaya reads as good prose", 3, "major", ["padas", "adhyahara", "anvaya"], []),
    "T4.1": ("Meanings match the evidence", 4, "blocker", ["words", "padas", "compounds"], ["sources"]),
    "T4.2": ("Polysemy resolved for this context", 4, "major", ["words", "padas"], ["deities", "tradition"]),
    "T4.3": ("Literal vs contextual where they differ", 4, "major", ["words", "compounds"], []),
    "T4.4": ("Epithets deconstructed", 4, "major", ["words", "compounds"], ["deities"]),
    "T4.5": ("Tradition attributed, not imposed", 4, "major", ["words", "annotations", "translations"], ["tradition", "attribution"]),
    "T4.6": ("Segments translate their words", 4, "blocker", ["translations", "words", "adhyahara"], []),
    "T4.7": ("English and Hindi say the same", 4, "major", ["translations"], []),
    "T4.8": ("Fluent, natural EN and HI", 4, "major", ["translations", "words", "annotations"], []),
    "T4.9": ("Annotation claims are supported", 4, "blocker", ["annotations"], ["sources"]),
    "T4.10": ("Neutral, attributed, no benefit claims", 4, "major", ["annotations", "translations", "words"], []),
}
for cid, (title, tier, severity, *_rest) in JUDGES.items():
    judge(cid, title, tier=tier, severity=severity)


# Metadata a judge's verdict doesn't depend on: changing these must not re-open judges (T6.2 caps confidence often).
VOLATILE = {"confidence"}


def _strip(node):
    if isinstance(node, dict):
        return {k: _strip(v) for k, v in node.items() if k not in VOLATILE}
    if isinstance(node, list):
        return [_strip(v) for v in node]
    return node


def cited_sources(doc: dict, verse: dict) -> list[dict]:
    """Only the stotram sources this verse cites: registering sources for other verses must not re-open its judges."""
    ids = set((verse.get("lock") or {}).get("sources", []))
    for w in verse.get("words", {}).values():
        ids |= set(w.get("sources", []))
    for a in verse.get("annotations", []):
        ids |= {c["source"] for c in a.get("citations", [])}
    return [s for s in doc.get("sources", []) if s["id"] in ids]


def _doc_field(doc: dict, verse: dict, key: str):
    return cited_sources(doc, verse) if key == "sources" else doc.get(key)


def fields_hash(doc: dict, verse: dict, check_id: str) -> str:
    _, _, _, vfields, dfields = JUDGES[check_id]
    payload = _strip({"verse": {k: verse.get(k) for k in vfields}, "doc": {k: _doc_field(doc, verse, k) for k in dfields}})
    return hashlib.sha256(json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def verdict_path(evidence_dir: Path, check_id: str) -> Path:
    return evidence_dir / "judges" / f"{check_id}.json"


def judge_results(ctx, doc, verse) -> list[Result]:
    """Recorded verdicts that are still fresh; everything else is pending."""
    out = []
    ev = ctx.evidence_dir(doc, verse)
    for cid in JUDGES:
        c = REGISTRY[cid]
        if doc.get("language", "sa") not in c.languages:
            continue
        f = verdict_path(ev, cid)
        rec = json.loads(f.read_text()) if f.exists() else None
        if not rec or rec["fields_hash"] != fields_hash(doc, verse, cid):
            reason = "stale: the fields it judged have changed" if rec else "not run yet"
            out.append(Result(cid, "pending", f"judge {reason}; rubric checks/judges/{cid}.md"))
            continue
        findings = rec["findings"]
        if not findings:
            out.append(Result(cid, "pass"))
        for f_ in findings:
            out.append(Result(cid, f_["status"], f_.get("message", ""), f_.get("path", ""), suggested_fix=f_.get("suggested_fix")))
    return out


def record(ctx, doc, verse, check_id: str, findings: list[dict]) -> Path:
    if check_id not in JUDGES:
        raise SystemExit(f"{check_id} is not a judge check")
    for f in findings:
        if f.get("status") not in ("fail", "flag", "pass"):
            raise SystemExit(f"finding status must be fail|flag|pass: {f}")
    findings = [f for f in findings if f["status"] != "pass"]
    path = verdict_path(ctx.evidence_dir(doc, verse), check_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"check": check_id, "fields_hash": fields_hash(doc, verse, check_id), "findings": findings}, ensure_ascii=False, indent=2) + "\n")
    return path


def judge_input(doc: dict, verse: dict, check_id: str) -> dict:
    """Exactly what a judge may see: the fields it reads. Never drafts, reports or other verdicts."""
    _, _, _, vfields, dfields = JUDGES[check_id]
    return {
        "check": check_id,
        "rubric": f"checks/judges/{check_id}.md",
        "stotram": {"id": doc["id"], "title": doc["title"], **{k: _doc_field(doc, verse, k) for k in dfields}},
        "verse": {"id": verse["id"], "lines": verse["lines"], **{k: verse.get(k) for k in vfields}},
    }


# Grouped judging (default in /stotram-refine to save tokens): one judge agent applies several rubrics
# to one bundle and answers {"<check>": [findings], ...}. Verdicts are still recorded and hash-stamped per check.
GROUPS = {
    "structure": ["T2.8b", "T2.9b", "T3.4", "T3.6"],
    "meaning": ["T4.1", "T4.2", "T4.3", "T4.4"],
    "translation": ["T3.5", "T4.6", "T4.7", "T4.8"],
    "annotations": ["T4.5", "T4.9", "T4.10"],
}


def group_input(doc: dict, verse: dict, group: str, checks: list[str]) -> dict:
    vfields = sorted({f for c in checks for f in JUDGES[c][3]})
    dfields = sorted({f for c in checks for f in JUDGES[c][4]})
    return {
        "group": group,
        "checks": {c: f"checks/judges/{c}.md" for c in checks},
        "stotram": {"id": doc["id"], "title": doc["title"], **{k: _doc_field(doc, verse, k) for k in dfields}},
        "verse": {"id": verse["id"], "lines": verse["lines"], **{k: verse.get(k) for k in vfields}},
    }

