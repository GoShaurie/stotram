"""Local Monier-Williams lookups (Cologne csl-orig v02, vendor/mw/mw.txt), replacing per-verse web lookups.

    .venv/bin/python -m checks dict FILE --verse v6 --auto            # guess the verse's stems and save their entries
    .venv/bin/python -m checks dict FILE --verse v6 --stems jaṭā,vilola  # save specific stems (IAST)

Each stem becomes research/<id>/<verse>/sources/mw-<slug>.md in the same header format as the web-fetched files.
"""

from __future__ import annotations

import pickle
import re
from datetime import date
from pathlib import Path

from .core import ROOT

MW = ROOT / "vendor" / "mw" / "mw.txt"
CACHE = ROOT / "vendor" / "mw" / "index.pkl"
MAX_RECORDS = 30
MAX_CHARS = 6000
SLUG = str.maketrans({"ś": "sh", "ṣ": "sh", "ā": "a", "ī": "i", "ū": "u", "ṛ": "r", "ṝ": "r", "ḷ": "l", "ṭ": "t", "ḍ": "d",
                      "ṇ": "n", "ñ": "n", "ṅ": "n", "ṃ": "m", "ḥ": "h", "'": "", "-": ""})


def index() -> dict[str, list[tuple[str, str]]]:
    """SLP1 headword → [(page-col, raw record body)], built once from mw.txt and cached."""
    if CACHE.exists():
        return pickle.loads(CACHE.read_bytes())
    if not MW.exists():
        raise SystemExit("vendor/mw/mw.txt missing; see checks/README.md setup")
    idx: dict[str, list[tuple[str, str]]] = {}
    head = None
    body: list[str] = []
    for line in MW.read_text(encoding="utf-8").splitlines():
        if line.startswith("<L>"):
            m = re.search(r"<pc>([^<]+)<k1>([^<]+)", line)
            head = (m.group(2), m.group(1)) if m else None
            body = []
        elif line.startswith("<LEND>"):
            if head:
                idx.setdefault(head[0], []).append((head[1], "\n".join(body)))
            head = None
        elif head:
            body.append(line)
    CACHE.write_bytes(pickle.dumps(idx))
    return idx


def render(ctx, raw: str) -> str:
    """Readable text: Sanskrit in IAST, markup stripped."""
    text = re.sub(r"<s>(.*?)</s>", lambda m: ctx.slp1_to_iast(m.group(1)), raw, flags=re.S)
    text = re.sub(r"<s1>(.*?)</s1>", r"\1", text)
    text = re.sub(r"<hom>(.*?)</hom>", r"\1 ", text)
    text = re.sub(r"<info[^>]*/>", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"[ \t]+", " ", text.replace("¦", ":")).strip()


def save(ctx, folder: Path, stem_iast: str) -> Path | None:
    key = ctx.iast_to_slp1(stem_iast)
    records = index().get(key)
    if not records:
        return None
    slug = stem_iast.translate(SLUG)
    if _taken(folder, slug, key):  # e.g. lekha vs lekhā: keep long vowels apart
        slug = stem_iast.translate(LONG).translate(SLUG)
    out = folder / f"mw-{slug}.md"
    parts, size = [], 0
    for pc, raw in records[:MAX_RECORDS]:
        entry = f"[p. {pc}] {render(ctx, raw)}"
        if size + len(entry) > MAX_CHARS:
            break
        parts.append(entry)
        size += len(entry)
    out.write_text(
        f"source: mw-{slug}\n"
        f"name: Monier-Williams Sanskrit-English Dictionary (1899), Cologne Digital Sanskrit Dictionaries, entry '{stem_iast}' (SLP1 key: {key})\n"
        f"url: https://www.sanskrit-lexicon.uni-koeln.de/scans/csl-apidev/getword.php?dict=mw&key={key}\n"
        f"kind: dictionary\n"
        f"locator: MW p. {records[0][0]}\n"
        f"retrieved: {date.today().isoformat()} (local copy of csl-orig v02)\n"
        f"---\n" + "\n\n".join(parts) + "\n",
        encoding="utf-8",
    )
    return out


LONG = str.maketrans({"ā": "aa", "ī": "ii", "ū": "uu", "ṝ": "rr"})


def headword_key(path: Path) -> str | None:
    m = re.search(r"SLP1 key: ([^)\s]+)", path.read_text(encoding="utf-8")[:500])
    return m.group(1) if m else None


def _taken(folder: Path, slug: str, key: str) -> bool:
    """Is mw-<slug> already used, in any verse of this stotram, for a different headword?"""
    for f in folder.parent.parent.glob(f"*/sources/mw-{slug}.md"):
        k = headword_key(f)
        if k and k != key:
            return True
    return False


# Final sounds that sandhi changes at a compound boundary (SLP1): try the dictionary form for each.
ENDINGS = [("M", ""), ("m", ""), ("H", ""), ("ayA", "A"), ("e", "a"), ("e", "A"), ("ena", "a"), ("asya", "a"), ("At", "a"), ("Aya", "a")]
FINALS = {"d": "t", "j": "t", "q": "w", "g": "k", "b": "p", "n": "t", "N": "k", "M": "m", "r": "s", "o": "as", "H": "s"}


def guess_stems(ctx, word_deva: str, keys: set[str]) -> list[str]:
    """Split a (compound) word into the fewest Monier-Williams headwords of 3+ letters. A heuristic for
    evidence gathering only: it may over-split; drafters look up anything it misses."""
    s = ctx.deva_to_slp1(word_deva).replace("'", "a")
    n = len(s)
    best: list[tuple[float, list[str]] | None] = [None] * (n + 1)
    best[0] = (0.0, [])
    for i in range(n):
        if best[i] is None:
            continue
        cost, pieces = best[i]
        for j in range(i + 3, n + 1):
            piece = s[i:j]
            cands = [piece]
            if piece[-1] in FINALS:
                cands.append(piece[:-1] + FINALS[piece[-1]])
            if piece[-1] == "A" and j < n:  # savarṇa-dīrgha: ā may hide a + a
                cands.append(piece[:-1] + "a")
            if j == n:  # the last piece carries the case ending: try the stem
                for end, stem_end in ENDINGS:
                    if piece.endswith(end) and len(piece) > len(end) + 1:
                        cands.append(piece[: -len(end)] + stem_end)
            cands += [re.sub(r"[YNRnm](?=[kKgGcCjJwWqQtTdDpPbB])", "M", c) for c in cands]  # MW writes anusvāra
            for c in cands:
                if c in keys and (best[j] is None or cost + 1 < best[j][0]):
                    best[j] = (cost + 1, pieces + [c])
        if best[i + 1] is None or cost + 2 < best[i + 1][0]:  # skip one sound (sandhi residue)
            best[i + 1] = (cost + 2, pieces)
    return [ctx.slp1_to_iast(p) for p in (best[n] or (0, []))[1]]
