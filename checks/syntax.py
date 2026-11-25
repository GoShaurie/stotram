"""Tier 3: meter, agreement and role–case consistency. Plus T1.9 cross-verse consistency."""

from __future__ import annotations

from .core import all_words, check, fail, flag, skip, units

# Expected case for each role in a kartari (active) sentence. Karmaṇi/bhāve swap kartā and karma.
ROLE_CASE = {
    "kartā": "nominative", "karma": "accusative", "karaṇa": "instrumental", "sampradāna": "dative",
    "apādāna": "ablative", "adhikaraṇa": "locative", "sambandha": "genitive", "sambodhana": "vocative",
}
PERSON_OF_STEM = {"asmad": 1, "yuṣmad": 2}


@check("T3.1", "Meter conformance", tier=3, method="CODE", severity="blocker")
def meter(ctx, doc, verse):
    meter_id = verse.get("meter") or (doc.get("meter") or {}).get("id")
    if not meter_id:
        return [skip("T3.1", "the stotram declares no meter.id")]
    spec = ctx.meters.get(meter_id)
    if not spec:
        return [fail("T3.1", f"meter '{meter_id}' is not defined in data/meters.json", "meter.id")]
    if spec["kind"] == "matra":
        return [skip("T3.1", "mātrā meters are checked for vernacular texts (T5.5)")]
    out = []
    padas = []  # (label, weights)
    irregular = {f"line {li + 1}": line["meter_irregular"] for li, line in enumerate(verse["lines"]) if line.get("meter_irregular")}
    for li, line in enumerate(verse["lines"]):
        text = " ".join(ctx.deva_to_slp1(w["text"]) for w in line["words"])
        weights = [a.weight for a in ctx.chandas.classify(text).aksharas[0]]
        n = line.get("pada_count", 1)
        size = len(weights) // n if n else len(weights)
        if n and len(weights) % n:
            out.append(fail("T3.1", f"line {li + 1} has {len(weights)} syllables, not divisible into {n} pādas", f"lines[{li}]"))
            continue
        for k in range(n):
            padas.append((f"line {li + 1}" + (f" pāda {k + 1}" if n > 1 else ""), "".join(weights[k * size:(k + 1) * size])))
    for i, (label, got) in enumerate(padas):
        want = _expected(spec, i)
        if want is None:
            continue
        if len(got) != len(want):
            out.append(fail("T3.1", f"{label}: {len(got)} syllables, {spec['name']} has {len(want)} ({got})", f"lines[{label}]"))
            continue
        bad = [j + 1 for j, (g, w) in enumerate(zip(got[:-1], want[:-1])) if w != "x" and g != w]
        if bad and irregular.get(label.split(" pāda")[0]):
            # every witness has this reading (lines[].meter_irregular): a human confirms, nothing to fix in the data
            out.append(flag("T3.1", f"{label}: syllable(s) {bad} break {spec['name']} (got {got}); recorded as irregular: {irregular[label.split(' pāda')[0]]}", f"lines[{label}]"))
        elif bad:
            out.append(fail("T3.1", f"{label}: syllable(s) {bad} break {spec['name']} (got {got}, want {want}); check the text for a typo", f"lines[{label}]"))
    return out


def _expected(spec: dict, pada_index: int) -> str | None:
    if "pada_patterns" in spec:  # a fixed pattern per pāda (null = not checked), e.g. a refrain line in another meter
        pats = spec["pada_patterns"]
        return pats[pada_index] if pada_index < len(pats) else None
    if "pattern" in spec:
        return spec["pattern"]
    if spec["kind"] == "anushtubh":
        seventh = "G" if pada_index % 2 == 0 else "L"
        return "xxxxLG" + seventh + "x"
    return None  # upajāti etc.: several allowed patterns, handled below if needed


@check("T3.3", "Agreement (prayoga-aware)", tier=3, method="CODE", severity="blocker")
def agreement(ctx, doc, verse):
    if not verse.get("padas"):
        return [skip("T3.3", "no padas")]
    by_id = units(verse)
    out = []
    for u in by_id.values():
        m, head = u.get("morph"), by_id.get(u.get("head") or "")
        if not m or not head or not head.get("morph"):
            continue
        hm = head["morph"]
        if u["role"] in ("viśeṣaṇa", "samānādhikaraṇa") and m["type"] == "subanta" and hm["type"] == "subanta":
            if m["case"] != hm["case"]:
                out.append(fail("T3.3", f"{u['iast']} ({m['case']}) qualifies {head['iast']} ({hm['case']}): cases differ", u["id"]))
            if m["number"] != hm["number"] and u["role"] == "viśeṣaṇa":
                out.append(fail("T3.3", f"{u['iast']} and {head['iast']} differ in number", u["id"]))
            if u["role"] == "viśeṣaṇa" and m.get("gender") and hm.get("gender") and m["gender"] != hm["gender"]:
                out.append(fail("T3.3", f"adjective {u['iast']} ({m['gender']}) doesn't agree in gender with {head['iast']} ({hm['gender']})", u["id"]))
        if hm["type"] == "tinanta" and m["type"] == "subanta":
            subject_role = "kartā" if hm["prayoga"] == "kartari" else "karma"
            if u["role"] == subject_role and m["case"] == "nominative":
                person = PERSON_OF_STEM.get(m["stem"]["iast"], 3)
                if person != hm["person"] or m["number"] != hm["number"]:
                    out.append(fail("T3.3", f"subject {u['iast']} (person {person}, {m['number']}) vs verb {head['iast']} (person {hm['person']}, {hm['number']})", u["id"]))
    return out


@check("T3.4a", "Role matches case", tier=3, method="CODE", severity="major")
def role_case(ctx, doc, verse):
    by_id = units(verse)
    out = []
    for u in by_id.values():
        m = u.get("morph") or {}
        if m.get("type") != "subanta" or u["role"] not in ROLE_CASE:
            continue
        want = ROLE_CASE[u["role"]]
        head = by_id.get(u.get("head") or "")
        hm = (head or {}).get("morph") or {}
        if hm.get("type") == "tinanta" and hm.get("prayoga") in ("karmaṇi", "bhāve"):
            want = {"kartā": "instrumental", "karma": "nominative"}.get(u["role"], want)
        # A kta participle as predicate (proktam "was spoken") is usually passive, but active with verbs of motion
        # (gataḥ "went"), so either pattern passes.
        passive = {"kartā": "instrumental", "karma": "nominative"}.get(u["role"])
        is_kta = ((hm.get("krt") or {}).get("suffix") if isinstance(hm.get("krt"), dict) else hm.get("krt")) == "kta"
        if is_kta and passive and m["case"] == passive:
            continue
        if m["case"] != want:
            out.append(fail("T3.4a", f"role {u['role']} expects {want}, {u['iast']} is {m['case']} (if this is an upapada-vibhakti, say so in a note)", u["id"]))
    return out


@check("T3.5a", "Adhyāhāra is explicit", tier=3, method="CODE", severity="major")
def adhyahara(ctx, doc, verse):
    out = []
    pada_forms = {p["sa"] for p in verse.get("padas", [])}
    for x in verse.get("adhyahara", []):
        if x["sa"] in pada_forms:
            out.append(fail("T3.5a", f"supplied word '{x['iast']}' is already in the verse; it can't be adhyāhāra", x["id"]))
        for lang in ("en", "hi"):
            used = any(x["id"] in s["refs"] for segs in verse["translations"][lang]["lines"] for s in segs)
            if not used:
                out.append(flag("T3.5a", f"supplied word '{x['iast']}' isn't marked in the {lang} translation", x["id"]))
    # The dependency graph must be a forest: no cycles.
    by_id = units(verse)
    for u in by_id.values():
        seen, cur = set(), u
        while cur and cur.get("head"):
            if cur["id"] in seen:
                out.append(fail("T3.5a", f"head links form a cycle through {cur['id']}", u["id"], severity="blocker"))
                break
            seen.add(cur["id"])
            cur = by_id.get(cur["head"])
    return out


@check("T1.9", "Cross-verse consistency", tier=1, method="CODE", severity="major", scope="doc")
def cross_verse(ctx, doc):
    seen: dict[str, tuple[str, dict]] = {}
    out = []
    for v in doc["verses"]:
        for p in v.get("padas", []):
            if len(p["words"]) > 1:
                continue
            key = p["sa"]
            sig = {k: p["morph"].get(k) for k in ("type", "case", "number", "gender", "lakara", "person")}
            if key in seen and seen[key][1] != sig:
                out.append(flag("T1.9", f"'{p['iast']}' is analysed differently in {seen[key][0]} and {v['id']}; fine if the context differs, but say why", f"{v['id']}.{p['id']}"))
            seen.setdefault(key, (v["id"], sig))
    return out
