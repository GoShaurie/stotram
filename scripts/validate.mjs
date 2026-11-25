#!/usr/bin/env node
// Validates stotram source files against the data contract in docs/DATA_FORMAT.md.
// Usage: node scripts/validate.mjs [--publish] [--json] [file.json ...]
//   no files  -> validates every file in data/stotrams/
//   --publish -> also enforces the publish gate (every verse reviewed or better)
//   --json    -> machine-readable output (used by the Python checks in checks/)
// Structure comes from the Zod schema in lib/schema.ts (the single schema); this file adds the
// cross-reference checks the schema can't express. Linguistic quality checks live in checks/ (Python).

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { StotramSchema } from "../lib/schema.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = join(ROOT, "data", "stotrams");

const SUPPORTED_SCHEMA = "0.3";
const LANGS = ["en", "hi"];
const REVIEW_ORDER = ["ai_draft", "ai_verified", "reviewed", "scholar_approved"];
const PUBLISHABLE = REVIEW_ORDER.slice(REVIEW_ORDER.indexOf("reviewed"));
const CONFIDENCE = ["high", "medium", "low"];
const ANNOTATION_KINDS = ["context", "mythology", "wordplay", "sound", "theology", "grammar", "variant", "cross-reference"];
const CREDIT_ROLES = ["composer", "text", "meter", "language", "recension", "commentary", "recording"];
const RELATIONSHIP_TYPES = ["shares-text", "same-meter", "same-deity", "companion", "quotes", "quoted-in"];
const ANNOTATION_MAX_CHARS = 500;
const ASIDE_MAX_CHARS = 220; // word-card aside: one or two lines // Genius-style notes are short; long essays belong in "about"
// Markdown link targets: [text](target). See docs/DATA_FORMAT.md "Rich text".
const MD_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
// Devanagari block, avagraha, zero-width joiners. Words must not carry punctuation.
const DEVANAGARI_WORD = /^[ऀ-ॣ०-ॿ‌‍]+$/;

function validateFile(path, { publish }) {
  const errors = [];
  const warnings = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

  let doc;
  try {
    doc = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    return { errors: [`invalid JSON: ${e.message}`], warnings };
  }

  // Structure and enums: the Zod schema. Report the first few issues with their paths.
  const parsed = StotramSchema.safeParse(doc);
  if (!parsed.success)
    for (const issue of parsed.error.issues.slice(0, 25)) err(issue.path.join(".") || "(root)", `schema: ${issue.message}`);

  const requireLangs = (obj, where, langs = LANGS) => {
    if (!obj || typeof obj !== "object") return err(where, "missing localized object");
    for (const l of langs) if (!obj[l]?.trim?.()) err(where, `missing '${l}'`);
  };

  // --- top level ---
  if (!String(doc.schema_version ?? "").startsWith(SUPPORTED_SCHEMA))
    err("schema_version", `expected ${SUPPORTED_SCHEMA}.x, got '${doc.schema_version}'`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(doc.id ?? "")) err("id", "must be a kebab-case slug");
  if (basename(path, ".json") !== doc.id) err("id", `must match file name (${basename(path, ".json")})`);
  requireLangs(doc.title, "title", ["sa", "iast", "en", "hi"]);
  if (!Array.isArray(doc.deities) || doc.deities.length === 0) err("deities", "at least one deity required");
  requireLangs(doc.summary, "summary");

  const sourceIds = new Set();
  for (const [i, s] of (doc.sources ?? []).entries()) {
    if (!s.id) err(`sources[${i}]`, "missing id");
    else if (sourceIds.has(s.id)) err(`sources[${i}]`, `duplicate id '${s.id}'`);
    sourceIds.add(s.id);
  }
  if (sourceIds.size === 0) err("sources", "at least one source required");

  const conceptIds = new Set(Object.keys(doc.concepts ?? {}));
  for (const [id, c] of Object.entries(doc.concepts ?? {})) {
    requireLangs(c.name, `concepts.${id}.name`);
    requireLangs(c.description, `concepts.${id}.description`);
  }

  if (!Array.isArray(doc.verses) || doc.verses.length === 0) err("verses", "at least one verse required");

  // Rich-text bodies are checked after the verses, once every annotation anchor is known.
  const richText = [];
  const rich = (obj, where) => {
    requireLangs(obj, where);
    for (const l of LANGS) if (typeof obj?.[l] === "string") richText.push([obj[l], `${where}.${l}`]);
  };

  // Theme stories and echoes (0.3.4). Echo sources must be registered; only ancient ones are shown.
  const ancientIds = new Set((doc.sources ?? []).filter((s) => s.ancient).map((s) => s.id));
  for (const [id, c] of Object.entries(doc.concepts ?? {})) {
    const C = `concepts.${id}`;
    if (c.story) {
      rich(c.story, `${C}.story`);
      for (const l of LANGS) if ((c.story[l] ?? "").length > 900) warn(`${C}.story.${l}`, `${c.story[l].length} chars (aim for ≤ 900)`);
    }
    for (const [i, cit] of (c.story_citations ?? []).entries())
      if (!sourceIds.has(cit.source)) err(`${C}.story_citations[${i}]`, `unknown source '${cit.source}'`);
    for (const [i, e] of (c.echoes ?? []).entries()) {
      const E = `${C}.echoes[${i}]`;
      if (!e.text?.trim()) err(E, "missing text");
      requireLangs(e.meaning, `${E}.meaning`);
      if (!sourceIds.has(e.source)) err(E, `unknown source '${e.source}'`);
      else if (!ancientIds.has(e.source)) warn(E, `source '${e.source}' is not ancient, so this echo won't be shown`);
      if (e.lang === "sa" && !e.iast) warn(E, "Sanskrit echo without iast");
    }
  }

  if (doc.about) rich(doc.about, "about");
  else warn("about", "missing (the Genius-style intro that links to the best annotations)");

  for (const [i, c] of (doc.credits ?? []).entries()) {
    const C = `credits[${i}]`;
    if (!CREDIT_ROLES.includes(c.role)) err(C, `role '${c.role}' not in ${CREDIT_ROLES.join("|")}`);
    requireLangs(c.value, `${C}.value`);
    if (c.note) rich(c.note, `${C}.note`);
    for (const s of c.sources ?? []) if (!sourceIds.has(s)) err(C, `unknown source '${s}'`);
  }

  const faqIds = new Set();
  for (const [i, f] of (doc.faq ?? []).entries()) {
    const F = `faq[${i}]`;
    if (!f.id) err(F, "missing id");
    else if (faqIds.has(f.id)) err(F, `duplicate id '${f.id}'`);
    faqIds.add(f.id);
    requireLangs(f.q, `${F}.q`);
    rich(f.a, `${F}.a`);
    for (const s of f.sources ?? []) if (!sourceIds.has(s)) err(F, `unknown source '${s}'`);
  }

  const libraryIds = new Set(readdirSync(DATA_DIR).filter((f) => f.endsWith(".json")).map((f) => basename(f, ".json")));
  for (const [i, r] of (doc.relationships ?? []).entries()) {
    const R = `relationships[${i}]`;
    if (!RELATIONSHIP_TYPES.includes(r.type)) err(R, `type '${r.type}' not in ${RELATIONSHIP_TYPES.join("|")}`);
    requireLangs(r.name, `${R}.name`);
    if (r.target && !libraryIds.has(r.target)) warn(R, `target '${r.target}' is not in the library yet`);
  }

  const annotationAnchors = new Set();

  // --- verses ---
  const verseIds = new Set();
  for (const [vi, verse] of (doc.verses ?? []).entries()) {
    const V = verse.id ?? `verses[${vi}]`;
    if (!verse.id) err(V, "missing id");
    else if (verseIds.has(verse.id)) err(V, "duplicate verse id");
    verseIds.add(verse.id);
    if (verse.number !== vi + 1) warn(V, `number ${verse.number} is not sequential (expected ${vi + 1})`);

    for (const c of verse.concepts ?? []) if (!conceptIds.has(c)) err(V, `unknown concept '${c}'`);

    // layout words
    const wordIds = new Set();
    for (const [li, line] of (verse.lines ?? []).entries()) {
      if (!line.words?.length) err(`${V}.lines[${li}]`, "line has no words");
      // 0.3.5: a line that doesn't scan in any witness; the note must say why (T3.1 then flags, a human confirms)
      if ("meter_irregular" in line && !String(line.meter_irregular ?? "").trim())
        err(`${V}.lines[${li}].meter_irregular`, "empty note: say why the line doesn't scan, or drop the field");
      for (const w of line.words ?? []) {
        const W = `${V}.${w.id ?? "?"}`;
        if (!w.id) err(W, "word missing id");
        else if (wordIds.has(w.id)) err(W, "duplicate word id");
        wordIds.add(w.id);
        if (!DEVANAGARI_WORD.test(w.text ?? "")) err(W, `text '${w.text}' must be Devanagari only (put dandas in line.end)`);
        if (!w.iast?.trim()) err(W, "missing iast");
      }
    }
    if (wordIds.size === 0) err(V, "verse has no words");

    // compounds
    const compoundIds = new Set(Object.keys(verse.compounds ?? {}));
    for (const [cid, c] of Object.entries(verse.compounds ?? {})) {
      for (const m of c.members ?? []) if (!wordIds.has(m)) err(`${V}.compounds.${cid}`, `unknown member '${m}'`);
      requireLangs(c.meaning, `${V}.compounds.${cid}.meaning`);
      if ((c.iast?.split("-").length ?? 0) >= 3 && !c.structure)
        warn(`${V}.compounds.${cid}`, "3+ members: add a bracketed structure (T2.9)");
    }

    // padas, adhyāhāra and anvaya (schema 0.3): ids in separate namespaces, every reference resolves
    const padaIds = new Set();
    const supplied = new Set();
    for (const [pi, pada] of (verse.padas ?? []).entries()) {
      const P = `${V}.padas[${pada.id ?? pi}]`;
      if (!/^p\d+$/.test(pada.id ?? "")) err(P, "pada id must look like p1, p2…");
      else if (padaIds.has(pada.id)) err(P, "duplicate pada id");
      padaIds.add(pada.id);
      for (const w of pada.words ?? []) if (!wordIds.has(w)) err(P, `unknown word '${w}'`);
    }
    for (const [xi, x] of (verse.adhyahara ?? []).entries()) {
      const X = `${V}.adhyahara[${x.id ?? xi}]`;
      if (!/^x\d+$/.test(x.id ?? "")) err(X, "adhyāhāra id must look like x1, x2…");
      else if (supplied.has(x.id)) err(X, "duplicate adhyāhāra id");
      supplied.add(x.id);
      requireLangs(x.meaning, `${X}.meaning`);
    }
    const syntaxIds = new Set([...padaIds, ...supplied]);
    for (const unit of [...(verse.padas ?? []), ...(verse.adhyahara ?? [])]) {
      if (unit.head === undefined || unit.head === null) continue;
      if (!syntaxIds.has(unit.head)) err(`${V}.${unit.id}`, `head '${unit.head}' does not exist`);
      if (unit.head === unit.id) err(`${V}.${unit.id}`, "a pada cannot be its own head");
    }
    if (verse.padas) {
      const inPada = new Set(verse.padas.flatMap((pd) => pd.words ?? []));
      for (const id of wordIds) if (!inPada.has(id)) err(V, `word '${id}' belongs to no pada`);
      // T1.6: the anvaya is an exact permutation of all padas and supplied words
      const anvaya = verse.anvaya ?? [];
      if (!verse.anvaya) err(V, "padas present but no anvaya");
      const seen = new Set();
      for (const id of anvaya) {
        if (seen.has(id)) err(`${V}.anvaya`, `'${id}' appears twice`);
        seen.add(id);
        if (!syntaxIds.has(id)) err(`${V}.anvaya`, `'${id}' is not a pada or adhyāhāra id`);
      }
      for (const id of syntaxIds) if (!seen.has(id)) err(`${V}.anvaya`, `'${id}' is missing`);
    } else {
      warn(V, "no padas/anvaya yet (schema 0.3 analysis layer)");
    }

    // translations: every segment ref resolves, every word is covered in every language
    for (const lang of LANGS) {
      const t = verse.translations?.[lang];
      const T = `${V}.translations.${lang}`;
      if (!t) { err(T, "missing"); continue; }
      const covered = new Set();
      for (const [li, segs] of (t.lines ?? []).entries()) {
        for (const [si, seg] of (segs ?? []).entries()) {
          const S = `${T}.lines[${li}][${si}]`;
          if (!Array.isArray(seg.refs) || seg.refs.length === 0) err(S, "segment needs non-empty refs[]");
          for (const r of seg.refs ?? []) {
            if (!wordIds.has(r) && !supplied.has(r)) err(S, `ref '${r}' is not a word or adhyāhāra id`);
            covered.add(r);
          }
          if (!seg.text?.trim()) err(S, "empty text");
        }
      }
      for (const id of wordIds) if (!covered.has(id)) err(T, `word '${id}' has no translation segment (hover would be dead)`);
      // The reader shows each translation line under the source line most of its words come from,
      // so lines should follow the source order and every source line should get its meaning.
      const lineOf = new Map();
      (verse.lines ?? []).forEach((l, i) => (l.words ?? []).forEach((w) => lineOf.set(w.id, i)));
      const homes = (t.lines ?? []).map((segs) => {
        const n = new Map();
        for (const r of (segs ?? []).flatMap((s) => s.refs ?? [])) if (lineOf.has(r)) n.set(lineOf.get(r), (n.get(lineOf.get(r)) ?? 0) + 1);
        return [...n].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0];
      });
      if (homes.length && homes.some((h, i) => i > 0 && h !== undefined && homes[i - 1] !== undefined && h < homes[i - 1]))
        warn(T, `lines out of source order (they sit under source lines ${homes.map((h) => (h ?? -1) + 1).join(",")}); follow the original`);
      const missing = (verse.lines ?? []).map((_, i) => i + 1).filter((i) => homes.length && !homes.includes(i - 1));
      if (missing.length) warn(T, `no meaning line sits under source line(s) ${missing.join(",")}`);
      if (!t.bhavartha?.trim()) warn(T, "missing bhavartha (free-flowing meaning)");
    }

    // word dictionary
    const dict = verse.words ?? {};
    for (const id of wordIds) if (!dict[id]) err(V, `word '${id}' has no dictionary entry`);
    for (const [id, w] of Object.entries(dict)) {
      const W = `${V}.words.${id}`;
      if (!wordIds.has(id)) { err(W, "dictionary entry for a word not in the layout"); continue; }
      if (!w.padaccheda?.length) err(W, "missing padaccheda");
      for (const [pi, p] of (w.padaccheda ?? []).entries())
        if (!p.sa || !p.iast) err(`${W}.padaccheda[${pi}]`, "needs sa and iast");
      if (!w.components?.length) err(W, "missing components");
      for (const [ci, c] of (w.components ?? []).entries()) {
        const C = `${W}.components[${ci}]`;
        if (!c.sa || !c.iast) err(C, "needs sa and iast");
        requireLangs(c.meaning, `${C}.meaning`);
      }
      requireLangs(w.meaning, `${W}.meaning`);
      if (w.compound && !compoundIds.has(w.compound)) err(W, `unknown compound '${w.compound}'`);
      if (w.notes) requireLangs(w.notes, `${W}.notes`);
      if (w.aside) {
        requireLangs(w.aside, `${W}.aside`);
        for (const l of LANGS) if ((w.aside[l]?.length ?? 0) > ASIDE_MAX_CHARS) warn(`${W}.aside`, `${l} over ${ASIDE_MAX_CHARS} chars; an aside is one or two lines`);
      }
      if (w.literal) requireLangs(w.literal, `${W}.literal`);
      for (const s of w.sandhi ?? []) {
        if (!s.name || !s.rule) err(W, "sandhi needs name and rule");
        requireLangs(s.explanation, `${W}.sandhi(${s.name}).explanation`);
      }
      if (!CONFIDENCE.includes(w.confidence)) err(W, `confidence must be ${CONFIDENCE.join("|")}`);
      if (w.confidence === "low") warn(W, "low confidence — flag for human review");
      if (!w.sources?.length) err(W, "at least one source required");
      for (const s of w.sources ?? []) if (!sourceIds.has(s)) err(W, `unknown source '${s}'`);
    }

    // annotations: contiguous word runs in reading order, no overlaps, cited
    const order = (verse.lines ?? []).flatMap((l) => (l.words ?? []).map((w) => w.id));
    const annotated = new Map();
    const annotationIds = new Set();
    for (const [ai, a] of (verse.annotations ?? []).entries()) {
      const A = `${V}.annotations[${a.id ?? ai}]`;
      if (!a.id) err(A, "missing id");
      else if (annotationIds.has(a.id)) err(A, "duplicate annotation id");
      annotationIds.add(a.id);
      annotationAnchors.add(`${verse.id}-${a.id}`);
      if (!ANNOTATION_KINDS.includes(a.kind)) err(A, `kind '${a.kind}' not in ${ANNOTATION_KINDS.join("|")}`);
      const positions = (a.refs ?? []).map((r) => order.indexOf(r));
      if (!a.refs?.length) err(A, "needs non-empty refs[]");
      if (positions.some((p) => p < 0)) err(A, "ref to a word that does not exist");
      else if (positions.some((p, i) => i > 0 && p !== positions[i - 1] + 1))
        err(A, "refs must be a contiguous run of words in reading order");
      for (const r of a.refs ?? []) {
        if (annotated.has(r)) err(A, `word '${r}' is already annotated by '${annotated.get(r)}' (no overlaps)`);
        annotated.set(r, a.id);
      }
      rich(a.body, `${A}.body`);
      for (const l of LANGS)
        if ((a.body?.[l]?.length ?? 0) > ANNOTATION_MAX_CHARS) warn(A, `${l} body over ${ANNOTATION_MAX_CHARS} chars; tighten it`);
      if (!a.citations?.length) warn(A, "no citations");
      for (const c of a.citations ?? []) if (!sourceIds.has(c.source)) err(A, `unknown citation source '${c.source}'`);
      if (!CONFIDENCE.includes(a.confidence)) err(A, `confidence must be ${CONFIDENCE.join("|")}`);
    }
    if (!verse.annotations?.length) warn(V, "no annotations (phrase-level context notes)");

    // review gate
    const status = verse.review?.status;
    if (!REVIEW_ORDER.includes(status)) err(`${V}.review.status`, `must be one of ${REVIEW_ORDER.join("|")}`);
    else if (publish && !PUBLISHABLE.includes(status)) err(`${V}.review.status`, `'${status}' is not publishable (needs ${PUBLISHABLE.join(" or ")})`);
    if (publish && !verse.lock?.confirmed_by) err(`${V}.lock`, "text lock must be confirmed by a human before publishing");
    if (publish && !verse.padas) err(V, "publish requires the pada/anvaya analysis");
  }

  // links inside rich text: #<verse>-<annotation>, #verse-<n>, #faq-<id>, concept:<id>, source:<id>, https://…
  for (const [text, where] of richText) {
    for (const [, , target] of text.matchAll(MD_LINK)) {
      if (target.startsWith("https://")) continue;
      const [kind, id] = target.startsWith("#faq-")
        ? ["faq", target.slice(5)]
        : /^#verse-\d+$/.test(target)
          ? ["verse", target.slice(7)]
          : target.startsWith("#")
          ? ["annotation", target.slice(1)]
          : target.split(":");
      const ok =
        (kind === "annotation" && annotationAnchors.has(id)) ||
        (kind === "faq" && faqIds.has(id)) ||
        (kind === "verse" && (doc.verses ?? []).some((v) => String(v.number) === id)) ||
        (kind === "concept" && conceptIds.has(id)) ||
        (kind === "source" && sourceIds.has(id));
      if (!ok) err(where, `link target '${target}' does not resolve (or use an https:// URL)`);
    }
  }

  if (publish && [...sourceIds].every((id) => doc.sources.find((s) => s.id === id)?.kind === "ai"))
    err("sources", "publish requires at least one non-AI source");

  return { errors, warnings };
}

const args = process.argv.slice(2);
const publish = args.includes("--publish");
const asJson = args.includes("--json");
let files = args.filter((a) => !a.startsWith("--"));
if (files.length === 0) files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json")).map((f) => join(DATA_DIR, f));

let failed = false;
if (asJson) {
  const results = files.map((file) => ({ file, ...validateFile(file, { publish }) }));
  console.log(JSON.stringify(results));
  process.exit(results.some((r) => r.errors.length) ? 1 : 0);
}
for (const file of files) {
  const { errors, warnings } = validateFile(file, { publish });
  const label = basename(file);
  if (errors.length) failed = true;
  console.log(`${errors.length ? "✗" : "✓"} ${label}  (${errors.length} errors, ${warnings.length} warnings)`);
  for (const e of errors) console.log(`   error  ${e}`);
  for (const w of warnings) console.log(`   warn   ${w}`);
}
process.exit(failed ? 1 : 0);
