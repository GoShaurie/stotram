"""Tier 6 provenance checks and the evidence-based parts of Tier 4 (quotes, copying)."""

from __future__ import annotations

import json
import re
from datetime import date

from .core import check, fail, flag, nfc, skip

MIN_SOURCES = 3
NGRAM = 8


def _evidence_texts(ctx, doc, verse) -> dict[str, str]:
    d = ctx.evidence_dir(doc, verse) / "sources"
    return {f.stem: f.read_text(encoding="utf-8") for f in sorted(d.glob("*.md"))} if d.exists() else {}


@check("T6.1", "Evidence before drafting", tier=6, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def evidence(ctx, doc, verse):
    d = ctx.evidence_dir(doc, verse)
    out = []
    texts = _evidence_texts(ctx, doc, verse)
    if len(texts) < MIN_SOURCES:
        out.append(fail("T6.1", f"{len(texts)} source excerpt(s) in {d.name}/sources/; need {MIN_SOURCES} (run the research step)"))
    if doc.get("language") == "sa" and not (d / "analyzer.json").exists():
        out.append(fail("T6.1", "no analyzer.json (run `checks evidence`)"))
    return out


@check("T6.2", "Confidence is earned", tier=6, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def confidence(ctx, doc, verse):
    kinds = {s["id"]: s.get("kind") for s in doc.get("sources", [])}
    disagree = set()
    cons = ctx.evidence_dir(doc, verse) / "consistency.json"
    if cons.exists():
        disagree = set(json.loads(cons.read_text())["disagreeing_words"])
    out = []
    for wid, w in verse.get("words", {}).items():
        if w["confidence"] != "high":
            continue
        real = {s for s in w.get("sources", []) if kinds.get(s) not in (None, "ai")}
        if len(real) < 2:
            out.append(fail("T6.2", f"'high' needs ≥2 independent non-AI sources; {wid} cites {len(real)}", f"words.{wid}.confidence", suggested_fix="medium"))
        elif wid in disagree:
            out.append(fail("T6.2", f"the independent drafts disagreed on {wid}; cap confidence at medium", f"words.{wid}.confidence", suggested_fix="medium"))
    return out


def _ngrams(text: str, n: int = NGRAM) -> set[tuple[str, ...]]:
    # Split on whitespace and punctuation only: \w doesn't match Devanagari vowel signs and would shred Hindi words.
    words = [w for w in re.split(r"[\s।॥,.;:!?\"'“”‘’()\[\]{}\-—–/*_|=]+", nfc(text).lower()) if w]
    return {tuple(words[i:i + n]) for i in range(len(words) - n + 1)}


@check("T6.3", "No copying from sources", tier=6, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def copying(ctx, doc, verse):
    texts = _evidence_texts(ctx, doc, verse)
    if not texts:
        return [skip("T6.3", "no evidence excerpts to compare with")]
    ours = []
    for lang in ("en", "hi"):
        t = verse["translations"][lang]
        ours.append((f"translations.{lang}", " ".join(s["text"] for segs in t["lines"] for s in segs)))
        if t.get("bhavartha"):
            ours.append((f"translations.{lang}.bhavartha", t["bhavartha"]))
    for a in verse.get("annotations", []):
        quotes = {nfc(c.get("quote", "")).lower() for c in a.get("citations", [])}
        for lang in ("en", "hi"):
            body = a["body"][lang]
            for q in quotes:  # quoting a cited primary text is fine
                body = nfc(body).lower().replace(q, " ")
            ours.append((f"annotations.{a['id']}.body.{lang}", body))
    out = []
    for path, text in ours:
        mine = _ngrams(text)
        for name, src in texts.items():
            shared = mine & _ngrams(src)
            if shared:
                out.append(fail("T6.3", f"{len(shared)} shared {NGRAM}-word run(s) with source '{name}', e.g. “{' '.join(next(iter(shared)))}”; rewrite in our own words", path))
    return out


@check("T4.9a", "Quotes appear in the evidence", tier=4, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def quotes(ctx, doc, verse):
    texts = _evidence_texts(ctx, doc, verse)
    corpus = re.sub(r"\s+", " ", nfc(" ".join(texts.values())).lower())
    out = []
    for a in verse.get("annotations", []):
        for c in a.get("citations", []):
            q = c.get("quote")
            if not q:
                continue
            if not texts:
                out.append(fail("T4.9a", f"quote “{q[:40]}…” can't be verified: no evidence excerpts", f"annotations.{a['id']}"))
            elif re.sub(r"\s+", " ", nfc(q).lower()) not in corpus:
                out.append(fail("T4.9a", f"quote “{q[:40]}…” is not in any evidence excerpt; add the source excerpt or drop the quote", f"annotations.{a['id']}"))
    return out


@check("T6.4", "Audit trail", tier=6, method="CODE", severity="major", languages=("sa", "awa", "bra", "hi"))
def audit(ctx, doc, verse):
    out = []
    history = verse.get("review", {}).get("history", [])
    if not history:
        out.append(fail("T6.4", "no review history", "review.history"))
    for i, h in enumerate(history):
        try:
            date.fromisoformat(h["date"])
        except (KeyError, ValueError):
            out.append(fail("T6.4", f"history entry {i} has no ISO date", f"review.history[{i}]"))
    if verse.get("review", {}).get("status") in ("reviewed", "scholar_approved") and not any(h.get("by") not in ("ai", "") for h in history):
        out.append(flag("T6.4", "status says human-reviewed, but no human appears in the history", "review"))
    return out


@check("T6.6", "Source ids name one headword", tier=6, method="CODE", severity="blocker", scope="doc", languages=("sa", "awa", "bra", "hi"))
def source_collisions(ctx, doc):
    """The same dictionary source id must not point to different headwords in different verses' evidence."""
    keys: dict[str, dict[str, str]] = {}
    for f in (ctx.doc_path.parent.parent.parent / "research" / doc["id"]).glob("*/sources/mw-*.md"):
        m = re.search(r"^source: (\S+).*?SLP1 key: ([^)\s]+)", f.read_text(encoding="utf-8")[:600], re.S | re.M)
        if m:
            keys.setdefault(m.group(1), {})[m.group(2)] = f.parent.parent.name
    return [fail("T6.6", f"source id '{sid}' points to different headwords: {by}", "sources") for sid, by in keys.items() if len(by) > 1]


@check("T4.9c", "Variant notes cite the witnesses", tier=4, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def variant_witnesses(ctx, doc, verse):
    """A note about how the witnesses read must cite the witnesses: at least 3 of the verse's locked text sources
    (or all of them, if fewer). Quotes are already checked verbatim by T4.9a."""
    witnesses = set((verse.get("lock") or {}).get("sources", []))
    if not witnesses:
        return [skip("T4.9c", "no text lock")]
    need = min(3, len(witnesses))
    out = []
    for a in verse.get("annotations", []):
        if a["kind"] != "variant":
            continue
        cited = {c["source"] for c in a.get("citations", [])} & witnesses
        if len(cited) < need:
            out.append(fail("T4.9c", f"variant note {a['id']} cites {len(cited)} text witness(es); cite at least {need} of {sorted(witnesses)} with their readings", f"annotations.{a['id']}.citations"))
    return out

