"""Tier 1 pada accounting and Tier 2 phonology/morphology checks, backed by Vidyut."""

from __future__ import annotations

import difflib
import re

from .core import all_words, check, fail, flag, skip

CASE = {
    "nominative": "Prathama", "accusative": "Dvitiya", "instrumental": "Trtiya", "dative": "Caturthi",
    "ablative": "Panchami", "genitive": "Sasthi", "locative": "Saptami", "vocative": "Sambodhana",
}
GENDER = {"masculine": "Pum", "feminine": "Stri", "neuter": "Napumsaka"}
NUMBER = {"singular": "Eka", "dual": "Dvi", "plural": "Bahu"}
PERSON = {1: "Uttama", 2: "Madhyama", 3: "Prathama"}
LAKARA = {
    "laṭ": "Lat", "liṭ": "Lit", "luṭ": "Lut", "lṛṭ": "Lrt", "leṭ": "Let", "loṭ": "Lot", "laṅ": "Lan",
    "vidhiliṅ": "VidhiLin", "āśīrliṅ": "AshirLin", "luṅ": "Lun", "lṛṅ": "Lrn",
}
PRAYOGA = {"kartari": "Kartari", "karmaṇi": "Karmani", "bhāve": "Bhave"}
SANADI = {"ṇic": "Ric", "san": "san", "yaṅ": "yaN"}
# Our IAST suffix names → Vidyut's SLP1 Krt names. lyap is generated as ktvā on a prefixed root.
KRT = {
    "kta": "kta", "ktavatu": "ktavatu", "śatṛ": "Satf", "śānac": "SAnac", "ktvā": "ktvA", "lyap": "ktvA",
    "tumun": "tumun", "tavya": "tavya", "anīya": "anIyar", "yat": "yat", "ṇyat": "Ryat", "kyap": "kyap",
    "ṇvul": "Rvul", "lyuṭ": "lyuw", "ghañ": "GaY", "ktin": "ktin", "ac": "ac", "ap": "ap", "kvip": "kvip",
    "ṇini": "Rini", "ṇamul": "Ramul", "tṛc": "tfc", "kānac": "kAnac", "kvasu": "kvasu",
}
# Enclitic pronoun forms (Aṣṭādhyāyī 8.1.20–22) that the generator only gives in their full form.
ENCLITICS = {
    ("asmad", "plural"): {"naḥ"}, ("asmad", "dual"): {"nau"}, ("asmad", "singular"): {"me", "mā"},
    ("yuṣmad", "plural"): {"vaḥ"}, ("yuṣmad", "dual"): {"vām"}, ("yuṣmad", "singular"): {"te", "tvā"},
}
PARTICLES = ("ca", "vā", "api", "hi", "eva", "tu", "iti", "na", "he", "bho", "aho", "khalu", "nu", "sma")


def _padas(verse):
    return verse.get("padas") or []


# --- Tier 1: pada accounting ----------------------------------------------------------------


@check("T1.3", "Lossless pada coverage", tier=1, method="CODE", severity="blocker")
def pada_coverage(ctx, doc, verse):
    if not _padas(verse):
        return [skip("T1.3", "no padas")]
    out = []
    words = {w["id"]: w for w in all_words(verse)}
    for wid, w in words.items():
        covering = [p for p in _padas(verse) if wid in p["words"]]
        surface = w["iast"].replace("'", "a")
        # Every pada that lies wholly inside this word must leave a trace in it (its core, minus sandhi-prone edges).
        pos = 0
        for p in (p for p in covering if p["words"] == [wid]):
            # Drop the first letter (avagraha/vowel sandhi) and the sandhi-prone ending (-aḥ → -o, -m → -ṃ, final stops, vowels).
            core = re.sub(r"(aḥ|āḥ|ḥ|ṃ|m|[tdkgpbcṭḍ]|[aeiouāīūṛ])$", "", p["iast"][1:])
            at = surface.find(core, pos)
            if len(core) >= 2 and at < 0:
                out.append(fail("T1.3", f"pada '{p['iast']}' is not found in word '{w['iast']}'", p["id"]))
            else:
                pos = max(pos, at)
        for particle in PARTICLES:
            # ṭh/ḍh are single aspirated consonants (kaṇṭhe = kaṇṭha + e), so ṭ/ḍ before an h-particle is no boundary.
            before = "[^a-zāīūṭḍ]" if particle.startswith("h") else "[^a-zāīū]"
            if re.search(rf"(^|{before}){particle}[ḥṃ]?$", w["iast"]) and len(w["iast"]) > len(particle) + 1:
                if not any(p["iast"] in (particle, particle + "ḥ") for p in covering):
                    out.append(fail("T1.3", f"'{w['iast']}' seems to end in the particle '{particle}', which has no pada of its own", wid))
    return out


@check("T1.8", "Completeness by part of speech", tier=1, method="CODE", severity="blocker")
def completeness(ctx, doc, verse):
    out = []
    for p in _padas(verse):
        m = p["morph"]
        dhatu = m.get("dhatu") or (m.get("krt") or {}).get("dhatu")
        if dhatu and not dhatu.get("gana"):
            out.append(fail("T1.8", f"√{dhatu['iast']} has no gaṇa", f"{p['id']}.morph"))
        if m["type"] == "subanta" and not m.get("gender") and m["stem"]["iast"] not in ("asmad", "yuṣmad"):
            out.append(fail("T1.8", "subanta without gender (only asmad/yuṣmad may omit it)", f"{p['id']}.morph"))
        if p["role"] not in ("kriyā", "sambodhana", "nipāta") and p.get("head") is None:
            out.append(fail("T1.8", f"role '{p['role']}' needs a head", p["id"]))
    return out


# --- Tier 2 ---------------------------------------------------------------------------------


@check("T2.1", "Sandhi reversibility", tier=2, method="TOOL", severity="blocker")
def sandhi_reversible(ctx, doc, verse):
    out = []
    for wid, w in verse.get("words", {}).items():
        parts = [ctx.iast_to_slp1(p["iast"]) for p in w.get("padaccheda", [])]
        if len(parts) < 2:
            continue
        surface = ctx.deva_to_slp1(next(x["text"] for x in all_words(verse) if x["id"] == wid))
        if not _splits_into(ctx.splitter, surface, parts):
            joined = " + ".join(p["iast"] for p in w["padaccheda"])
            out.append(flag("T2.1", f"Vidyut's sandhi rules can't split '{ctx.slp1_to_iast(surface)}' into {joined}; verify by hand", f"words.{wid}.padaccheda"))
    return out


def _splits_into(splitter, text: str, parts: list[str]) -> bool:
    """Can `text` be split, boundary by boundary, into exactly `parts`?"""
    if len(parts) == 1:
        return text == parts[0] or _final_equivalent(text, parts[0])
    for i in range(1, len(text)):  # Vidyut panics on index == len(text)
        for s in splitter.split_at(text, i):
            if s.first == parts[0] or _final_equivalent(s.first, parts[0]):
                if _splits_into(splitter, s.second, parts[1:]):
                    return True
    # Plain juxtaposition (no sound change at this boundary)
    if text.startswith(parts[0]):
        return _splits_into(splitter, text[len(parts[0]):], parts[1:])
    return False


# Word-final sounds that external sandhi changes (SLP1): stops voice or assimilate (t → d/q/j/n…),
# m becomes anusvāra (M) before a consonant. The next word, which conditions the change, lies outside the word.
FINAL_CLASSES = ("tdkgqwjcnNRYp", "mM", "Hrs")


def _final_equivalent(a: str, b: str) -> bool:
    return a[:-1] == b[:-1] and any(a[-1:] in cls and b[-1:] in cls for cls in FINAL_CLASSES)


@check("T2.2", "Avagraha restoration", tier=2, method="CODE", severity="blocker")
def avagraha(ctx, doc, verse):
    out = []
    for w in all_words(verse):
        if "ऽ" not in w["text"]:
            continue
        parts = verse.get("words", {}).get(w["id"], {}).get("padaccheda", [])
        # Also a + a → ā written with an avagraha (जनाऽवहूत → jana + avahūta).
        dirgha = "ाऽ" in w["text"]
        ok = any(
            parts[i]["iast"].startswith("a")
            and (re.search(r"(e|o|aḥ|ḥ)$", parts[i - 1]["iast"]) or (dirgha and re.search(r"[aā]$", parts[i - 1]["iast"])))
            for i in range(1, len(parts))
        )
        if not ok:
            out.append(fail("T2.2", f"'{w['text']}' has an avagraha but no split restores the elided a (e.g. सोऽहम् → सः + अहम्)", w["id"]))
    return out


@check("T2.3", "Pausa forms restored in padas", tier=2, method="CODE", severity="major")
def pausa_forms(ctx, doc, verse):
    out = []
    for p in _padas(verse):
        f = p["iast"]
        if f.endswith("ṃ"):
            out.append(fail("T2.3", f"pada '{f}' ends in anusvāra; the pausa form ends in -m", p["id"], suggested_fix=f[:-1] + "m"))
        m = p["morph"]
        if m["type"] == "subanta" and m["case"] == "nominative" and m["number"] == "singular" and m["stem"]["iast"].endswith("a") and m.get("gender") == "masculine" and f.endswith("o"):
            out.append(fail("T2.3", f"'{f}' looks like -aḥ before a voiced sound; write the pada as {f[:-1]}aḥ", p["id"]))
    return out


@check("T2.4", "Form-generation round-trip", tier=2, method="TOOL", severity="blocker")
def generation(ctx, doc, verse):
    if not _padas(verse):
        return [skip("T2.4", "no padas")]
    out = []
    for p in [*_padas(verse), *(x for x in verse.get("adhyahara", []) if x.get("morph"))]:
        if p["morph"]["type"] == "avyaya" and not p["morph"].get("krt"):
            continue  # a plain indeclinable has no paradigm to regenerate
        try:
            forms = generate(ctx, p["morph"])
        except Exception as e:  # unsupported combination in the tool
            out.append(flag("T2.4", f"could not generate from the stated analysis: {e}", p["id"]))
            continue
        want = p["iast"].replace("'", "")
        if want in forms or _enclitic_ok(p):
            continue
        if p.get("irregular"):
            out.append(flag("T2.4", f"irregular form '{want}'; generator gives {sorted(forms)}. Note: {p['irregular']['note']}", p["id"]))
        else:
            out.append(fail("T2.4", f"the analysis generates {sorted(forms) or 'nothing'}, not '{want}'", p["id"],
                            suggested_fix="; ".join(analyses(ctx, p["iast"])[:5]) or None))
    return out


def _enclitic_ok(p) -> bool:
    m = p["morph"]
    return m["type"] == "subanta" and p["iast"] in ENCLITICS.get((m["stem"]["iast"], m["number"]), set())


def generate(ctx, morph: dict) -> set[str]:
    P, v = ctx.prakriya, ctx.vyakarana
    t = morph["type"]
    if t == "subanta":
        text = ctx.iast_to_slp1(morph["stem"]["iast"])
        stems = [P.Pratipadika.basic(text)]
        if morph.get("gender") == "feminine" and text[-1:] in "AIU":
            stems.append(P.Pratipadika.nyap(text))  # mālā → mālayā needs the stem marked as ending in ṅyāp
        krt = morph.get("krt")
        if krt and krt.get("suffix") in KRT and krt["suffix"] not in ("ktvā", "lyap", "tumun"):
            # Participles: derive from the root so suffix-specific rules apply (śatṛ: vasat → vasan, 7.1.70).
            # Only when the stem is the bare participle; a compound ending in one is generated from its text.
            try:
                for d in _dhatus(ctx, krt["dhatu"], krt.get("prefixes"), None):
                    stems.append(P.Pratipadika.krdanta(d, getattr(P.Krt, KRT[krt["suffix"]])))
            except ValueError:
                pass
        lingas = [morph["gender"]] if morph.get("gender") else list(GENDER)
        forms = set()
        # 1.4.6: before the ṅit singular endings, nadī treatment is optional for one-syllable ī/ū stems, so the
        # non-nadī forms (śriye, bhuvi) are also correct. Vidyut 0.4 only gives the nadī ones (śriyai, bhuvām).
        # 6.4.77 (iyaṅ/uvaṅ) + 1.4.6 (optional nadī): the regular vowel-initial endings of one-syllable ī/ū stems
        # (śriyam, śriyā, śriye/śriyai, bhuvi/bhuvām…). Vidyut 0.4 gets several of these wrong (e.g. śrīm).
        if _monosyllabic_long(text):
            base = text[:-1] + ("iy" if text.endswith("I") else "uv")
            for ending in IYAN_ENDINGS.get((morph["case"], morph["number"]), ()):
                forms.add(ctx.slp1_to_iast(base + ending))
        for stem in stems:
            for g in lingas:
                pada = P.Pada.Subanta(stem, getattr(P.Linga, GENDER[g]), getattr(P.Vibhakti, CASE[morph["case"]]), getattr(P.Vacana, NUMBER[morph["number"]]))
                forms |= {ctx.slp1_to_iast(_satva(text, _iyan_uvan(text, x.text))) for x in v.derive(pada)}
        return forms
    if t == "tinanta":
        forms = set()
        for d in _dhatus(ctx, morph["dhatu"], morph.get("prefixes"), morph.get("sanadi")):
            pada = P.Pada.Tinanta(
                dhatu=d, prayoga=getattr(P.Prayoga, PRAYOGA[morph["prayoga"]]), lakara=getattr(P.Lakara, LAKARA[morph["lakara"]]),
                purusha=getattr(P.Purusha, PERSON[morph["person"]]), vacana=getattr(P.Vacana, NUMBER[morph["number"]]),
            )
            forms |= {ctx.slp1_to_iast(x.text) for x in v.derive(pada)}
        return forms
    krt = morph.get("krt")
    if not krt:
        return set()  # plain indeclinable: nothing to generate
    forms = set()
    for d in _dhatus(ctx, krt["dhatu"], krt.get("prefixes"), None):
        pada = P.Pada.make_avyaya(P.Pratipadika.krdanta(d, getattr(P.Krt, KRT[krt["suffix"]])))
        forms |= {ctx.slp1_to_iast(x.text) for x in v.derive(pada)}
    return forms


IYAN_ENDINGS = {  # SLP1 endings after iy/uv; two entries where nadī treatment is optional (1.4.6)
    ("nominative", "dual"): ("O",), ("accusative", "dual"): ("O",), ("vocative", "dual"): ("O",),
    ("nominative", "plural"): ("aH",), ("accusative", "plural"): ("aH",), ("vocative", "plural"): ("aH",),
    ("accusative", "singular"): ("am",), ("instrumental", "singular"): ("A",),
    ("dative", "singular"): ("e", "E"), ("ablative", "singular"): ("aH", "AH"), ("genitive", "singular"): ("aH", "AH"),
    ("locative", "singular"): ("i", "Am"), ("genitive", "dual"): ("oH",), ("locative", "dual"): ("oH",),
    ("genitive", "plural"): ("Am",),
}


def _satva(stem: str, form: str) -> str:
    """Aṣṭādhyāyī 8.3.59: the s of an -is/-us stem (an uṇādi suffix: cakṣus, havis, dhanus) becomes ṣ before a vowel
    ending (cakṣuṣā, cakṣuṣoḥ). Vidyut 0.4 treats such stems as plain words and keeps the s."""
    if stem[-2:] in ("is", "us") and form.startswith(stem[:-1] + "s"):
        rest = form[len(stem):]
        if rest[:1] in "aAiIuUfFeEoO":
            return stem[:-1] + "z" + rest
    return form


def _monosyllabic_long(stem: str) -> bool:
    """Stems that take iyaṅ/uvaṅ (6.4.77): one-syllable ī/ū stems (śrī, bhū), and stems whose final ī/ū follows a
    consonant cluster (para-śrī: 6.4.82's glide replacement needs a single preceding consonant, so iyaṅ stays)."""
    vowels = "aAiIuUfFxXeEoO"
    if stem[-1:] not in "IU":
        return False
    if sum(ch in vowels for ch in stem) == 1:
        return True
    return len(stem) >= 3 and stem[-2] not in vowels and stem[-3] not in vowels


def _iyan_uvan(stem: str, form: str) -> str:
    """Aṣṭādhyāyī 6.4.77: one-syllable ī/ū nouns (śrī, dhī, bhū…) take iy/uv before a vowel ending (śriyai, not
    śryai). Vidyut 0.4 misses this, so apply it to its output (SLP1)."""
    vowels = "aAiIuUfFxXeEoO"
    if _monosyllabic_long(stem):
        onset = stem[:-1]
        semivowel = "y" if stem.endswith("I") else "v"
        if form.startswith(onset + semivowel) and form[len(onset) + 1:len(onset) + 2] in vowels:
            return onset + ("iy" if semivowel == "y" else "uv") + form[len(onset) + 1:]
    return form


def _dhatus(ctx, dhatu: dict, prefixes, sanadi):
    found = ctx.dhatu_index.get((ctx.iast_to_slp1(dhatu["iast"]), dhatu.get("gana") or 0), [])
    if not found:
        raise ValueError(f"√{dhatu['iast']} (gaṇa {dhatu.get('gana')}) is not in the Dhātupāṭha")
    out = []
    for d in found:
        if prefixes:
            d = d.with_prefixes([ctx.iast_to_slp1(x) for x in prefixes])
        if sanadi and sanadi in SANADI:
            d = d.with_sanadi([getattr(ctx.prakriya.Sanadi, SANADI[sanadi])])
        out.append(d)
    return out


def analyses(ctx, form_iast: str) -> list[str]:
    """Readable Vidyut lexicon analyses for a pausa form (visarga stored as s in the lexicon)."""
    key = ctx.iast_to_slp1(form_iast)
    key = key[:-1] + "s" if key.endswith("H") else key
    out = []
    for e in ctx.kosha.get(key):
        s = str(e)
        m = re.search(r"pratipadika=Pratipadika\(text='([^']+)'\).*linga=Linga\.(\w+), vibhakti=Vibhakti\.(\w+), vacana=Vacana\.(\w+)", s)
        if m:
            out.append(f"{ctx.slp1_to_iast(m.group(1))} {m.group(2)} {m.group(3)} {m.group(4)}")
            continue
        m = re.search(r"clean_text='([^']+)'.*lakara=Lakara\.(\w+), purusha=Purusha\.(\w+), vacana=Vacana\.(\w+)", s)
        if m:
            out.append(f"√{ctx.slp1_to_iast(m.group(1))} {m.group(2)} {m.group(3)} {m.group(4)}")
    return list(dict.fromkeys(out))


@check("T2.5", "Lemma, not surface", tier=2, method="CODE", severity="blocker")
def lemma(ctx, doc, verse):
    out = []
    for p in _padas(verse):
        m = p["morph"]
        if m["type"] != "subanta":
            continue
        stem = m["stem"]["iast"]
        if stem.endswith(("ḥ", "ṃ")):
            out.append(fail("T2.5", f"stem '{stem}' carries an ending; give the prātipadika", f"{p['id']}.morph.stem"))
        elif stem == p["iast"] and m["case"] != "vocative" and not stem.endswith(("a", "i", "u")):
            out.append(flag("T2.5", f"stem '{stem}' equals the inflected form; check it is the prātipadika", f"{p['id']}.morph.stem"))
    return out


@check("T2.6", "Dhātu validity", tier=2, method="TOOL", severity="blocker")
def dhatu_valid(ctx, doc, verse):
    out = []
    for p in _padas(verse):
        m = p["morph"]
        d = m.get("dhatu") or (m.get("krt") or {}).get("dhatu")
        if not d or not d.get("gana"):
            continue
        clean = ctx.iast_to_slp1(d["iast"])
        if (clean, d["gana"]) not in ctx.dhatu_index:
            other = sorted(g for (c, g) in ctx.dhatu_index if c == clean)
            hint = f"; the Dhātupāṭha has √{d['iast']} in gaṇa {other}" if other else "; not in the Dhātupāṭha at all"
            out.append(fail("T2.6", f"√{d['iast']} gaṇa {d['gana']} not found{hint}", f"{p['id']}.morph"))
    return out


@check("T2.7", "Kṛt suffix", tier=2, method="CODE", severity="major")
def krt_suffix(ctx, doc, verse):
    out = []
    for p in _padas(verse):
        k = p["morph"].get("krt")
        if not k:
            continue
        if k["suffix"] not in KRT:
            out.append(fail("T2.7", f"unknown kṛt suffix '{k['suffix']}' (known: {', '.join(KRT)})", f"{p['id']}.morph.krt"))
        if k["suffix"] == "lyap" and not k.get("prefixes"):
            out.append(fail("T2.7", "lyap needs an upasarga; without one the suffix is ktvā", f"{p['id']}.morph.krt"))
        if k["suffix"] == "ktvā" and k.get("prefixes"):
            out.append(fail("T2.7", "with an upasarga, ktvā is replaced by lyap", f"{p['id']}.morph.krt"))
    return out


@check("T2.8", "Samāsa structure", tier=2, method="CODE", severity="major")
def samasa(ctx, doc, verse):
    out = []
    padas = _padas(verse)
    for cid, c in (verse.get("compounds") or {}).items():
        if padas and not any(set(c["members"]) <= set(p["words"]) for p in padas):
            out.append(fail("T2.8", f"compound {cid} is split across several padas; a compound is one pada", f"compounds.{cid}"))
        if not c.get("vigraha"):
            out.append(fail("T2.8", f"compound {cid} has no vigraha", f"compounds.{cid}"))
        if c["type"] == "bahuvrīhi":
            pada = next((p for p in padas if set(c["members"]) <= set(p["words"])), None)
            if pada and pada["role"] not in ("viśeṣaṇa", "samānādhikaraṇa", "sambodhana"):
                # A bahuvrīhi can stand alone as a name (pītāmbara = Viṣṇu); that's a judgement, not an error.
                is_name = any(verse.get("words", {}).get(w, {}).get("epithet") for w in c["members"])
                out.append((flag if is_name else fail)("T2.8", f"bahuvrīhi {cid} has role '{pada['role']}'; it should qualify something" + (" unless it stands alone as a name: confirm" if is_name else ""), pada["id"]))
    return out


@check("T2.9", "Compound nesting", tier=2, method="CODE", severity="major")
def nesting(ctx, doc, verse):
    out = []
    for cid, c in (verse.get("compounds") or {}).items():
        members = c["iast"].count("-") + 1
        s = c.get("structure")
        if members >= 3 and not s:
            out.append(fail("T2.9", f"compound {cid} has {members} members but no bracketed structure", f"compounds.{cid}"))
            continue
        if not s:
            continue
        depth = 0
        for ch in s:
            depth += {"(": 1, ")": -1}.get(ch, 0)
            if depth < 0:
                break
        if depth != 0:
            out.append(fail("T2.9", f"unbalanced brackets in '{s}'", f"compounds.{cid}.structure"))
        flat = re.sub(r"[()\-\s]", "", s)
        ratio = difflib.SequenceMatcher(None, flat, c["iast"].replace("-", "")).ratio()
        if ratio < 0.8:
            out.append(fail("T2.9", f"structure '{s}' doesn't spell the compound '{c['iast']}' (similarity {ratio:.2f})", f"compounds.{cid}.structure"))
    return out


def _nasal(s):
    return re.sub(r"[ṅñṇnm](?=[kgcjṭḍtdpb])", "ṃ", s)


@check("T2.10", "Analyser agreement", tier=2, method="TOOL", severity="major")
def analyser(ctx, doc, verse):
    out = []
    for p in _padas(verse):
        m = p["morph"]
        if p.get("irregular") or m["type"] == "avyaya" or len(p["words"]) > 1:
            continue  # long compounds and irregular forms aren't in the lexicon
        found = analyses(ctx, p["iast"])
        if not found:
            out.append(flag("T2.10", f"'{p['iast']}' is not in Vidyut's lexicon; nothing to compare", p["id"]))
            continue
        if m["type"] == "subanta":
            # Vidyut spells a nasal before a stop as anusvāra (bhujaṃga); texts often use the class nasal (bhujaṅga).
            found = [_nasal(a.split(" ", 1)[0]) + a[len(a.split(" ", 1)[0]):] for a in found]  # stem only, not the labels
            stem = _nasal(m["stem"]["iast"])
            wants = {f"{stem} "}
            if m.get("gender") == "feminine" and stem.endswith("ā"):
                wants.add(f"{stem[:-1]}a Stri ")  # Vidyut names a ṭāp feminine by its base: tandrā → "tandra Stri"
            ok = any(any(a.startswith(w) for w in wants) and CASE[m["case"]] in a and NUMBER[m["number"]] in a for a in found)
        else:
            tail = f"{LAKARA[m['lakara']]} {PERSON[m['person']]} {NUMBER[m['number']]}"
            # Vidyut names a prefixed root as one string (ava + āp → "√avaāp"); ours keeps them apart.
            roots = {m["dhatu"]["iast"], "".join(m.get("prefixes") or []) + m["dhatu"]["iast"]}
            ok = any(f"√{r} {tail}" in found for r in roots)
        if not ok and not _enclitic_ok(p):
            out.append(fail("T2.10", f"none of the analyser's readings match ours: {found[:6]}", p["id"]))
    return out
