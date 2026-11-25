"""Checks the checkers: plant a known defect in a copy of the reference verse and assert that the
right check fails. Run: .venv/bin/python -m checks.selftest   (also after upgrading Vidyut)."""

from __future__ import annotations

import copy
import json
import sys
import tempfile
from pathlib import Path

from . import judges, morph, provenance, syntax, text  # noqa: F401
from .core import REGISTRY, ROOT, Context

REFERENCE = ROOT / "data" / "stotrams" / "shiva-tandava-stotram.json"


def pada(v, pid):
    return next(p for p in v["padas"] if p["id"] == pid)


def word(v, wid):
    return next(w for line in v["lines"] for w in line["words"] if w["id"] == wid)


# (description, check that must fail, mutation of verse 1)
CASES = [
    ("wrong case in the analysis", "T2.4", lambda d, v: pada(v, "p12")["morph"].update(case="accusative")),
    ("wrong lakāra", "T2.4", lambda d, v: pada(v, "p10")["morph"].update(lakara="laṭ")),
    ("lyap without an upasarga", "T2.7", lambda d, v: pada(v, "p3")["morph"]["krt"].update(prefixes=[])),
    ("root in the wrong gaṇa", "T2.6", lambda d, v: pada(v, "p8")["morph"]["dhatu"].update(gana=4)),
    ("IAST doesn't match Devanagari", "T1.5", lambda d, v: word(v, "w9").update(iast="cakara")),
    ("capitalised IAST", "T1.4", lambda d, v: word(v, "w13").update(iast="Śivaḥ")),
    ("ISO 15919 anusvāra", "T1.4", lambda d, v: word(v, "w10").update(iast="caṇḍatāṇḍavaṁ")),
    ("typo that breaks the meter", "T3.1", lambda d, v: word(v, "w9").update(text="चाकार", iast="cākāra")),
    ("adjective disagrees with its noun", "T3.3", lambda d, v: pada(v, "p4")["morph"].update(gender="masculine")),
    ("subject/verb number mismatch", "T3.3", lambda d, v: pada(v, "p12")["morph"].update(number="plural")),
    ("role contradicts case", "T3.4a", lambda d, v: pada(v, "p13").update(role="karaṇa")),
    ("pada left in sandhi form", "T2.3", lambda d, v: pada(v, "p13").update(iast="śivaṃ")),
    ("avagraha split dropped", "T2.2", lambda d, v: v["words"]["w4"].update(padaccheda=[{"sa": "गलेऽवलम्ब्य", "iast": "gale'valambya"}])),
    ("stem given as inflected form", "T2.5", lambda d, v: pada(v, "p12")["morph"]["stem"].update(sa="शिवः", iast="śivaḥ")),
    ("compound split across padas", "T2.8", lambda d, v: v["compounds"]["c1"].update(members=["w1", "w2", "w3", "w4"])),
    ("long compound without nesting", "T2.9", lambda d, v: v["compounds"]["c1"].pop("structure")),
    ("verb with no gaṇa", "T1.8", lambda d, v: pada(v, "p8")["morph"]["dhatu"].pop("gana")),
    ("archaic English", "T4.8a", lambda d, v: v["translations"]["en"]["lines"][3].append({"refs": ["w11"], "text": "thee"})),
    ("benefit claim", "T4.10a", lambda d, v: v["words"]["w14"]["meaning"].update(en="auspiciousness that cures disease")),
    ("high confidence without sources", "T6.2", lambda d, v: None),  # true of the reference itself today
    ("text changed after lock", "T0.1", lambda d, v: (v.update(lock={"hash": "sha256:0", "sources": ["ai-draft"], "confirmed_by": None}))),
]


def run_one(check_id: str, doc: dict) -> list:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / f"{doc['id']}.json"
        path.write_text(json.dumps(doc, ensure_ascii=False))
        ctx = Context(path)
        c = REGISTRY[check_id]
        return c.fn(ctx, doc, doc["verses"][0]) or []


def main() -> int:
    base = json.loads(REFERENCE.read_text(encoding="utf-8"))
    failures = 0
    for desc, check_id, mutate in CASES:
        doc = copy.deepcopy(base)
        mutate(doc, doc["verses"][0])
        results = run_one(check_id, doc)
        expected = "flag" if check_id == "T4.10a" else "fail"  # benefit language is legitimate when quoting the phalaśruti
        caught = any(r.status == expected for r in results)
        failures += not caught
        print(f"{'ok  ' if caught else 'MISS'} {check_id:<6} {desc}")
    # And the unmutated reference must not trip the deterministic morphology checks.
    # A plain indeclinable must not trip the generator (regression: pratikṣaṇam in v2 draft C).
    doc = copy.deepcopy(base)
    pada(doc["verses"][0], "p11")["morph"] = {"type": "avyaya"}
    bad = [r for r in run_one("T2.4", doc) if r.status == "fail" and r.path == "p11"]
    failures += bool(bad)
    print(f"{'ok  ' if not bad else 'FALSE+'} T2.4   plain avyaya is not generated")
    # Regressions from v3: visarga sandhi (manaḥ → mano) and Hindi n-gram tokenisation.
    from .morph import pada_coverage
    from .provenance import _ngrams
    doc = copy.deepcopy(base)
    v = doc["verses"][0]
    word(v, "w12").update(text="नो", iast="no")
    pada(v, "p11").update(sa="नः", iast="naḥ")
    bad = [r for r in run_one("T1.3", doc) if r.status == "fail" and r.path == "p11"]
    failures += bool(bad)
    print(f"{'ok  ' if not bad else 'FALSE+'} T1.3   visarga sandhi aḥ → o is accepted")
    shredded = len(_ngrams("जिनकी जटाओं से बहती गंगा की धाराओं ने उनके कण्ठ को", 8)) == 4
    failures += not shredded
    print(f"{'ok  ' if shredded else 'MISS'} T6.3   Hindi is split into whole words (11 words → 4 eight-grams)")
    # Regressions from v5: feminine ā-stems need ṅyāp; one-syllable ī/ū stems need iyaṅ (6.4.77).
    from .morph import generate
    ctx = Context(REFERENCE)
    for stem, gender, case, want in (("mālā", "feminine", "instrumental", "mālayā"), ("śrī", "feminine", "dative", "śriyai"), ("śrī", "feminine", "dative", "śriye"), ("śrī", "feminine", "accusative", "śriyam"), ("bhū", "feminine", "instrumental", "bhuvā"),
                                     ("bhū", "feminine", "locative", "bhuvi"), ("śiva", "masculine", "nominative", "śivaḥ"),
                                     ("cakṣus", "neuter", "locative", "cakṣuṣi"), ("havis", "neuter", "instrumental", "haviṣā"),
                                     ("paraśrī", "feminine", "genitive", "paraśriyaḥ"), ("nadī", "feminine", "genitive", "nadyāḥ")):
        got = generate(ctx, {"type": "subanta", "stem": {"sa": "", "iast": stem}, "gender": gender, "case": case, "number": "singular"})
        ok = want in got
        failures += not ok
        print(f"{'ok  ' if ok else 'MISS'} T2.4   generates {want} from {stem}" + ("" if ok else f" (got {sorted(got)})"))
    # Regression from v13: śatṛ participles take num (7.1.70): vasat → vasan.
    got = generate(ctx, {"type": "subanta", "stem": {"sa": "", "iast": "vasat"}, "gender": "masculine", "case": "nominative",
                         "number": "singular", "krt": {"dhatu": {"sa": "", "iast": "vas", "gana": 1}, "suffix": "śatṛ"}})
    ok = "vasan" in got
    failures += not ok
    print(f"{'ok  ' if ok else 'MISS'} T2.4   generates vasan from √vas + śatṛ" + ("" if ok else f" (got {sorted(got)})"))
    for check_id in ("T1.4", "T1.5", "T2.2", "T2.3", "T2.4", "T2.5", "T2.6", "T2.7", "T2.8", "T2.9", "T3.1", "T3.3", "T3.4a"):
        bad = [r for r in run_one(check_id, copy.deepcopy(base)) if r.status == "fail"]
        failures += bool(bad)
        print(f"{'ok  ' if not bad else 'FALSE+'} {check_id:<6} reference passes" + (f": {bad[0].message}" if bad else ""))
    print(f"\n{'all good' if not failures else f'{failures} problem(s)'}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
