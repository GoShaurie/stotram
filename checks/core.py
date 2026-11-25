"""Shared machinery for the quality checks (docs/QUALITY_CHECKS.md).

A check is a function registered with @check. It receives the context, the stotram document and
(for verse-scoped checks) one verse, and returns Results. Returning nothing means "pass".
"""

from __future__ import annotations

import hashlib
import json
import unicodedata
from dataclasses import asdict, dataclass, field
from functools import cached_property
from pathlib import Path
from typing import Callable, Iterable

ROOT = Path(__file__).resolve().parent.parent
VIDYUT_DATA = ROOT / "vendor" / "vidyut-data"
RESEARCH = ROOT / "research"
METERS = ROOT / "data" / "meters.json"

SEVERITIES = ("blocker", "major", "minor")
STATUSES = ("pass", "fail", "flag", "skip", "pending")


@dataclass
class Result:
    check: str
    status: str  # pass | fail | flag (needs a human) | skip (precondition missing) | pending (judge not run)
    message: str = ""
    path: str = ""
    suggested_fix: str | None = None
    evidence: object | None = None
    severity: str = ""
    tier: int = 0
    method: str = ""


@dataclass
class Check:
    id: str
    title: str
    tier: int
    method: str  # CODE | TOOL | JUDGE
    severity: str
    scope: str  # verse | doc
    fn: Callable | None
    languages: tuple[str, ...] = ("sa",)


REGISTRY: dict[str, Check] = {}


def check(id: str, title: str, *, tier: int, method: str, severity: str, scope: str = "verse", languages=("sa",)):
    def register(fn):
        REGISTRY[id] = Check(id, title, tier, method, severity, scope, fn, tuple(languages))
        return fn

    return register


def judge(id: str, title: str, *, tier: int, severity: str, languages=("sa",)):
    """A check decided by an independent LLM judge (rubric in checks/judges/<id>.md)."""
    REGISTRY[id] = Check(id, title, tier, "JUDGE", severity, "verse", None, tuple(languages))


def fail(check_id: str, message: str, path: str = "", **kw) -> Result:
    return Result(check_id, "fail", message, path, **kw)


def flag(check_id: str, message: str, path: str = "", **kw) -> Result:
    return Result(check_id, "flag", message, path, **kw)


def skip(check_id: str, message: str, path: str = "") -> Result:
    return Result(check_id, "skip", message, path)


# --- text helpers ---------------------------------------------------------------------------

def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def canonical_text(verse: dict) -> str:
    """The verse text as locked: words joined by spaces, line end marks kept, lines by newlines."""
    lines = []
    for line in verse.get("lines", []):
        text = " ".join(w["text"] for w in line["words"])
        if line.get("end"):
            text += " " + line["end"]
        lines.append(text)
    return nfc("\n".join(lines))


def text_hash(verse: dict) -> str:
    return "sha256:" + hashlib.sha256(canonical_text(verse).encode("utf-8")).hexdigest()


def strip_marks(s: str) -> str:
    """Devanagari letters only: no whitespace, dandas, digits or avagraha-free punctuation."""
    return "".join(ch for ch in nfc(s) if not ch.isspace() and ch not in "।॥|" and not ("०" <= ch <= "९") and not ch.isdigit())


def all_words(verse: dict) -> list[dict]:
    return [w for line in verse.get("lines", []) for w in line["words"]]


def units(verse: dict) -> dict[str, dict]:
    """Padas and adhyāhāra items by id."""
    return {u["id"]: u for u in [*verse.get("padas", []), *verse.get("adhyahara", [])]}


# --- context: lazily loaded tools -----------------------------------------------------------

class Context:
    def __init__(self, doc_path: Path):
        self.doc_path = doc_path

    def evidence_dir(self, doc: dict, verse: dict) -> Path:
        return RESEARCH / doc["id"] / verse["id"]

    @cached_property
    def lipi(self):
        from vidyut import lipi

        return lipi

    def to_iast(self, deva: str) -> str:
        return self.lipi.transliterate(deva, self.lipi.Scheme.Devanagari, self.lipi.Scheme.Iast)

    def iast_to_slp1(self, iast: str) -> str:
        return self.lipi.transliterate(iast.replace("’", "'"), self.lipi.Scheme.Iast, self.lipi.Scheme.Slp1)

    def slp1_to_iast(self, slp1: str) -> str:
        return self.lipi.transliterate(slp1, self.lipi.Scheme.Slp1, self.lipi.Scheme.Iast)

    def deva_to_slp1(self, deva: str) -> str:
        return self.lipi.transliterate(deva, self.lipi.Scheme.Devanagari, self.lipi.Scheme.Slp1)

    @cached_property
    def prakriya(self):
        from vidyut import prakriya

        return prakriya

    @cached_property
    def vyakarana(self):
        return self.prakriya.Vyakarana()

    @cached_property
    def kosha(self):
        from vidyut.kosha import Kosha

        return Kosha(str(VIDYUT_DATA / "kosha"))

    @cached_property
    def splitter(self):
        from vidyut.sandhi import Splitter

        return Splitter.from_csv(str(VIDYUT_DATA / "sandhi" / "rules.csv"))

    @cached_property
    def chandas(self):
        from vidyut.chandas import Chandas

        return Chandas(str(VIDYUT_DATA / "chandas" / "meters.tsv"))

    @cached_property
    def meters(self) -> dict:
        return json.loads(METERS.read_text(encoding="utf-8"))["meters"]

    @cached_property
    def dhatu_index(self) -> dict[tuple[str, int], list]:
        """(clean SLP1 root, gaṇa number) → Dhātupāṭha Dhatu objects. Built once by derivation, then cached."""
        cache = VIDYUT_DATA.parent / "dhatu-index.json"
        P = self.prakriya
        if cache.exists():
            raw = json.loads(cache.read_text())
        else:
            raw = {}
            for e in P.Data(str(VIDYUT_DATA / "prakriya")).load_dhatu_entries():
                gana = int(e.code.split(".")[0])
                for p in self.vyakarana.derive(e.dhatu):
                    raw.setdefault(f"{p.text}|{gana}", [])
                    if e.dhatu.aupadeshika not in raw[f"{p.text}|{gana}"]:
                        raw[f"{p.text}|{gana}"].append(e.dhatu.aupadeshika)
            cache.write_text(json.dumps(raw, ensure_ascii=False))
        ganas = list(P.Gana.choices())
        index: dict[tuple[str, int], list] = {}
        for key, upadeshas in raw.items():
            clean, gana = key.rsplit("|", 1)
            index[(clean, int(gana))] = [P.Dhatu.mula(u, ganas[int(gana) - 1]) for u in upadeshas]
        return index


# --- reports --------------------------------------------------------------------------------

PENALTY = {"blocker": 100, "major": 10, "minor": 1}


def summarize(results: Iterable[Result]) -> dict:
    results = list(results)
    failed = [r for r in results if r.status == "fail"]
    by = {s: sum(1 for r in failed if r.severity == s) for s in SEVERITIES}
    return {
        "blockers_failed": by["blocker"],
        "majors_failed": by["major"],
        "minors_failed": by["minor"],
        "flags": sum(1 for r in results if r.status == "flag"),
        "skipped": sum(1 for r in results if r.status == "skip"),
        "judges_pending": len({r.check for r in results if r.status == "pending"}),
        # Lower is better. The loop keeps a patch only if this does not go up.
        "penalty": sum(PENALTY[r.severity] for r in failed),
        "exit_ready": by["blocker"] == 0 and not any(r.status == "pending" for r in results),
    }


def to_json(results: list[Result]) -> list[dict]:
    return [{k: v for k, v in asdict(r).items() if v not in (None, "")} for r in results]
