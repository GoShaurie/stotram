"""Tier 0 (source text) and Tier 1 text/romanisation checks, plus regex checks on prose."""

from __future__ import annotations

import re
import unicodedata

from .core import all_words, check, fail, flag, nfc, skip, strip_marks, text_hash

# --- Tier 0 ---------------------------------------------------------------------------------


@check("T0.1", "Text lock", tier=0, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def text_lock(ctx, doc, verse):
    lock = verse.get("lock")
    if not lock:
        return [fail("T0.1", "No text lock. Run `checks lock` after the text is established (Pass 0).", "lock")]
    if lock["hash"] != text_hash(verse):
        return [fail("T0.1", "The verse text changed after it was locked. Restore the locked text or re-run Pass 0.", "lock.hash")]


@check("T0.2", "Recension consensus", tier=0, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def recension(ctx, doc, verse):
    lock = verse.get("lock")
    if not lock:
        return [skip("T0.2", "no lock")]
    kinds = {s["id"]: s.get("kind") for s in doc.get("sources", [])}
    real = [s for s in lock["sources"] if kinds.get(s) not in (None, "ai")]
    out = []
    if len(real) < 3:
        out.append(fail("T0.2", f"Text established from {len(real)} non-AI source(s); need 3.", "lock.sources"))
    if not lock.get("confirmed_by"):
        out.append(flag("T0.2", "Text lock not yet confirmed by a human.", "lock.confirmed_by"))
    return out


DEVANAGARI = re.compile(r"^[ऀ-ॿ‌‍]+$")


@check("T0.3", "Unicode hygiene", tier=0, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def unicode_hygiene(ctx, doc, verse):
    out = []
    for path, s in _deva_fields(verse):
        if s != unicodedata.normalize("NFC", s):
            out.append(fail("T0.3", f"not NFC: {s}", path))
        if not DEVANAGARI.match(s):
            bad = sorted({ch for ch in s if not re.match(r"[ऀ-ॿ]", ch)})
            out.append(fail("T0.3", f"non-Devanagari characters {bad!r} in '{s}'", path))
        elif "‌" in s or "‍" in s:
            out.append(flag("T0.3", f"zero-width joiner in '{s}': intentional?", path))
    for i, line in enumerate(verse.get("lines", [])):
        end = line.get("end", "")
        if end and not re.fullmatch(r"[।॥०-९\s]+", end):
            out.append(fail("T0.3", f"line end '{end}' must use । ॥ and Devanagari digits", f"lines[{i}].end"))
    return out


def _deva_fields(verse):
    for li, line in enumerate(verse.get("lines", [])):
        for w in line["words"]:
            yield f"{w['id']}.text", w["text"]
    for wid, w in verse.get("words", {}).items():
        for i, p in enumerate(w.get("padaccheda", [])):
            yield f"words.{wid}.padaccheda[{i}]", p["sa"]
        for i, c in enumerate(w.get("components", [])):
            yield f"words.{wid}.components[{i}]", c["sa"]
    for p in verse.get("padas", []):
        yield f"{p['id']}.sa", p["sa"]


# --- Tier 1 ---------------------------------------------------------------------------------


@check("T1.2", "Lossless token coverage", tier=1, method="CODE", severity="blocker", languages=("sa", "awa", "bra", "hi"))
def token_coverage(ctx, doc, verse):
    src = ctx.evidence_dir(doc, verse) / "text.txt"
    if not src.exists():
        return [skip("T1.2", f"no established source text ({src.name} from Pass 0)")]
    want = strip_marks(src.read_text(encoding="utf-8"))
    got = strip_marks("".join(w["text"] for w in all_words(verse)))
    if want != got:
        i = next((i for i, (a, b) in enumerate(zip(want, got)) if a != b), min(len(want), len(got)))
        return [fail("T1.2", f"words differ from the source text at character {i}: source …{want[max(0, i - 6):i + 6]}… vs words …{got[max(0, i - 6):i + 6]}…")]


IAST_OK = set("abcdeghijklmnoprstuvy āīūṛṝḷṃḥṅñṭḍṇśṣ'-")
ISO_FORMS = {"ṁ": "ṃ", "r̥": "ṛ", "ē": "e", "ō": "o", "̥": "ṛ (combining ring)"}


@check("T1.4", "IAST charset", tier=1, method="CODE", severity="blocker")
def iast_charset(ctx, doc, verse):
    out = []
    for path, s in _iast_fields(verse):
        s = nfc(s)
        for iso, std in ISO_FORMS.items():
            if iso in s:
                out.append(fail("T1.4", f"ISO 15919 form '{iso}' in '{s}'; use IAST {std}", path))
        if any(ch.isupper() for ch in s):
            out.append(fail("T1.4", f"capital letters in '{s}'; IAST fields are lowercase", path))
        bad = sorted({ch for ch in s.lower() if ch not in IAST_OK})
        if bad:
            out.append(fail("T1.4", f"characters {bad!r} are not IAST in '{s}'", path))
    return out


def _iast_fields(verse):
    for w in (w for line in verse.get("lines", []) for w in line["words"]):
        yield f"{w['id']}.iast", w["iast"]
    for wid, w in verse.get("words", {}).items():
        for i, p in enumerate(w.get("padaccheda", [])):
            yield f"words.{wid}.padaccheda[{i}].iast", p["iast"]
        for i, c in enumerate(w.get("components", [])):
            yield f"words.{wid}.components[{i}].iast", c["iast"]
            if c.get("root"):
                yield f"words.{wid}.components[{i}].root.iast", c["root"]["iast"]
    for p in verse.get("padas", []):
        yield f"{p['id']}.iast", p["iast"]
        m = p["morph"]
        if m.get("stem"):
            yield f"{p['id']}.morph.stem.iast", m["stem"]["iast"]
        for d in (m.get("dhatu"), (m.get("krt") or {}).get("dhatu")):
            if d:
                yield f"{p['id']}.morph.dhatu.iast", d["iast"]


@check("T1.5", "Devanagari ↔ IAST round-trip", tier=1, method="TOOL", severity="blocker")
def roundtrip(ctx, doc, verse):
    out = []
    for path, sa, iast in _pairs(verse):
        got = ctx.to_iast(sa).replace("’", "'")
        if _norm(got) != _norm(iast):
            out.append(fail("T1.5", f"'{sa}' transliterates to '{got}', but iast says '{iast}'", path, suggested_fix=got))
    return out


def _norm(s: str) -> str:
    return nfc(s).lower().replace("’", "'").replace("-", "").replace(" ", "")


def _pairs(verse):
    for w in (w for line in verse.get("lines", []) for w in line["words"]):
        yield w["id"], w["text"], w["iast"]
    for wid, w in verse.get("words", {}).items():
        for i, p in enumerate(w.get("padaccheda", [])):
            yield f"words.{wid}.padaccheda[{i}]", p["sa"], p["iast"]
        for i, c in enumerate(w.get("components", [])):
            yield f"words.{wid}.components[{i}]", c["sa"], c["iast"]
            if c.get("root"):
                yield f"words.{wid}.components[{i}].root", c["root"]["sa"], c["root"]["iast"]
    for p in [*verse.get("padas", []), *verse.get("adhyahara", [])]:
        yield p["id"], p["sa"], p["iast"]
        m = p.get("morph") or {}
        if m.get("stem"):
            yield f"{p['id']}.morph.stem", m["stem"]["sa"], m["stem"]["iast"]
        for d in (m.get("dhatu"), (m.get("krt") or {}).get("dhatu")):
            if d:
                yield f"{p['id']}.morph.dhatu", d["sa"], d["iast"]


# Common Sanskrit terms whose IAST has diacritics; their ASCII spellings shouldn't appear in prose.
ASCII_TERMS = re.compile(
    r"\b(shiva|shiv|tandava|tatpurusha|karmadharaya|bahuvrihi|ganga|krishna|vishnu|ravana|parvati|kailasa|"
    r"damaru|panini|lakshmi|narayana|shankara|sanskrit\w*ization)\b",
    re.I,
)


@check("T1.10", "No ASCII Sanskrit terms in English prose", tier=1, method="CODE", severity="minor")
def ascii_terms(ctx, doc, verse):
    out = []
    for path, text in _english_prose(verse):
        for m in ASCII_TERMS.finditer(text):
            out.append(fail("T1.10", f"'{m.group(0)}' in English prose; use IAST (e.g. Śiva, tāṇḍava)", path))
    return out


def _english_prose(verse):
    for wid, w in verse.get("words", {}).items():
        for key in ("meaning", "literal", "notes"):
            if w.get(key):
                yield f"words.{wid}.{key}.en", w[key]["en"]
    t = verse.get("translations", {}).get("en", {})
    for li, segs in enumerate(t.get("lines", [])):
        yield f"translations.en.lines[{li}]", " ".join(s["text"] for s in segs)
    if t.get("bhavartha"):
        yield "translations.en.bhavartha", t["bhavartha"]
    for a in verse.get("annotations", []):
        yield f"annotations.{a['id']}.body.en", a["body"]["en"]


# --- regex parts of Tier 4 ------------------------------------------------------------------

ARCHAIC = re.compile(r"\b(thee|thou|thy|thine|hath|doth|ye)\b", re.I)


@check("T4.8a", "No archaic English", tier=4, method="CODE", severity="major")
def archaic(ctx, doc, verse):
    return [
        fail("T4.8a", f"archaic '{m.group(0)}': write clear modern English", path)
        for path, text in _english_prose(verse)
        for m in ARCHAIC.finditer(text)
    ]


RED_FLAGS = re.compile(
    r"\b(cures?|guarantee[ds]?|removes? all|destroys? all (sins|diseases)|grants? all wishes|scientifically|"
    r"proven|will become (rich|wealthy)|heals?)\b",
    re.I,
)


@check("T4.10a", "No benefit or health claims", tier=4, method="CODE", severity="major")
def red_flags(ctx, doc, verse):
    return [
        flag("T4.10a", f"'{m.group(0)}': allowed only when quoting the phalaśruti and attributed to it", path)
        for path, text in _english_prose(verse)
        for m in RED_FLAGS.finditer(text)
    ]


# Hindi misspellings that are mechanical (no judgement needed). Extend as judges find more.
HINDI_MISSPELLINGS = [(re.compile("श्रृ"), "शृ", "श्रृ is never correct: शृंगार, शृंखला, शृंग")]


@check("T4.8b", "Known Hindi misspellings", tier=4, method="CODE", severity="minor")
def hindi_spelling(ctx, doc, verse):
    out = []
    for path, text in _hindi_prose(verse):
        for rx, fix, why in HINDI_MISSPELLINGS:
            if rx.search(text):
                out.append(fail("T4.8b", why, path, suggested_fix=rx.sub(fix, text)[:80]))
    return out


def _hindi_prose(verse):
    for wid, w in verse.get("words", {}).items():
        for key in ("meaning", "literal", "notes"):
            if w.get(key):
                yield f"words.{wid}.{key}.hi", w[key]["hi"]
    t = verse.get("translations", {}).get("hi", {})
    for li, segs in enumerate(t.get("lines", [])):
        yield f"translations.hi.lines[{li}]", " ".join(s["text"] for s in segs)
    if t.get("bhavartha"):
        yield "translations.hi.bhavartha", t["bhavartha"]
    for a in verse.get("annotations", []):
        yield f"annotations.{a['id']}.body.hi", a["body"]["hi"]

