// Zod mirror of docs/DATA_FORMAT.md (v0.3). Structural typing for the app and the single schema
// for every checker: exported as JSON Schema (scripts/export-schema.mjs) for the Python checks.
// Cross-reference checks (refs, coverage, sources) live in scripts/validate.mjs; linguistic checks in checks/.
import { z } from "zod";

export const LANGS = ["en", "hi"] as const;
export type Lang = (typeof LANGS)[number];

const Localized = z.object({ en: z.string(), hi: z.string() });
export type Localized = z.infer<typeof Localized>;

const Root = z.object({
  kind: z.enum(["dhatu", "pratipadika"]),
  sa: z.string(),
  iast: z.string(),
  gana: z.number().int().min(1).max(10).optional(),
  prefixes: z.array(z.string()).optional(),
  gloss: Localized.optional(),
});

export const CASES = ["nominative", "accusative", "instrumental", "dative", "ablative", "genitive", "locative", "vocative"] as const;
export const NUMBERS = ["singular", "dual", "plural"] as const;
export const GENDERS = ["masculine", "feminine", "neuter"] as const;
export const LAKARAS = ["laṭ", "liṭ", "luṭ", "lṛṭ", "leṭ", "loṭ", "laṅ", "vidhiliṅ", "āśīrliṅ", "luṅ", "lṛṅ"] as const;
export const PRAYOGAS = ["kartari", "karmaṇi", "bhāve"] as const;
export const SANADI = ["ṇic", "san", "yaṅ", "nāmadhātu"] as const;
// Kāraka and other syntactic roles of a pada towards its head (docs/QUALITY_CHECKS.md T3.3–T3.4).
export const ROLES = [
  "kriyā", // finite verb heading a clause (head: null)
  "kartā",
  "karma",
  "karaṇa",
  "sampradāna",
  "apādāna",
  "adhikaraṇa",
  "sambandha", // genitive relation (not a kāraka)
  "sambodhana", // vocative address
  "viśeṣaṇa", // adjective: agrees in gender, case, number
  "samānādhikaraṇa", // noun in apposition: agrees in case (and number)
  "kriyā-viśeṣaṇa", // adverbial
  "pūrvakāla", // absolutive (ktvā/lyap) preceding the head action
  "nipāta", // particle
] as const;
export const SAMASA_TYPES = [
  "tatpuruṣa",
  "karmadhāraya",
  "dvigu",
  "nañ-tatpuruṣa",
  "upapada",
  "bahuvrīhi",
  "dvandva",
  "avyayībhāva",
] as const;

const Dhatu = z.object({ sa: z.string(), iast: z.string(), gana: z.number().int().min(1).max(10).optional() });

// Morphology of one pada: the analysis the form-generation check (T2.4) regenerates.
const Morph = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("subanta"),
    stem: z.object({ sa: z.string(), iast: z.string() }),
    gender: z.enum(GENDERS).optional(), // omitted for asmad/yuṣmad
    case: z.enum(CASES),
    number: z.enum(NUMBERS),
    // Participles and other kṛdanta stems
    krt: z.object({ dhatu: Dhatu, prefixes: z.array(z.string()).optional(), suffix: z.string() }).optional(),
  }),
  z.object({
    type: z.literal("tinanta"),
    dhatu: Dhatu,
    prefixes: z.array(z.string()).optional(),
    sanadi: z.enum(SANADI).optional(),
    lakara: z.enum(LAKARAS),
    prayoga: z.enum(PRAYOGAS),
    person: z.number().int().min(1).max(3),
    number: z.enum(NUMBERS),
    pada: z.enum(["parasmaipada", "ātmanepada"]),
  }),
  z.object({
    type: z.literal("avyaya"),
    // Absolutives, infinitives: ktvā, lyap, tumun…
    krt: z.object({ dhatu: Dhatu, prefixes: z.array(z.string()).optional(), suffix: z.string() }).optional(),
  }),
]);
export type Morph = z.infer<typeof Morph>;

// A pada is a syntactic unit after sandhi is undone. One display word can hold several padas
// (गलेऽवलम्ब्य = gale + avalambya) and one pada can span several words (a long compound).
const Pada = z.object({
  id: z.string(),
  words: z.array(z.string()).min(1),
  sa: z.string(), // pre-sandhi form
  iast: z.string(),
  morph: Morph,
  role: z.enum(ROLES),
  head: z.string().nullable(), // pada or adhyāhāra id; null for a clause's main verb
  irregular: z.object({ note: z.string() }).optional(), // poetic/ārṣa form the generator can't reproduce
});
export type Pada = z.infer<typeof Pada>;

// A word supplied by the reader to complete the sentence (adhyāhāra), never part of the text.
const Adhyahara = z.object({
  id: z.string(),
  sa: z.string(),
  iast: z.string(),
  morph: Morph.optional(),
  role: z.enum(ROLES),
  head: z.string().nullable(),
  meaning: Localized,
});

const Component = z.object({
  sa: z.string(),
  iast: z.string(),
  pos: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  root: Root.optional(),
  formation: z.string().optional(),
  // Which dictionary sense was chosen (polysemy check T4.2)
  sense: z.object({ dict: z.string(), headword: z.string(), gloss: z.string().optional() }).optional(),
  meaning: Localized,
});
export type WordComponent = z.infer<typeof Component>;

const Sandhi = z.object({ name: z.string(), rule: z.string(), explanation: Localized });

const WordEntry = z.object({
  compound: z.string().optional(),
  padaccheda: z.array(z.object({ sa: z.string(), iast: z.string() })).min(1),
  sandhi: z.array(Sandhi).optional(),
  components: z.array(Component).min(1),
  meaning: Localized, // contextual meaning (lakṣyārtha) in this verse
  literal: Localized.optional(), // vācyārtha, only where it differs (T4.3)
  epithet: z.boolean().optional(), // divine name/epithet: needs a derivation (T4.4)
  notes: Localized.optional(),
  aside: Localized.optional(), // one or two lines of colour shown at the end of the word card (instead of a thin story card)
  alternatives: z.array(z.object({ reading: Localized, note: z.string().optional() })).optional(),
  confidence: z.enum(["high", "medium", "low"]),
  sources: z.array(z.string()).min(1),
});
export type WordEntry = z.infer<typeof WordEntry>;

const Segment = z.object({ refs: z.array(z.string()).min(1), text: z.string() });
export type Segment = z.infer<typeof Segment>;

const Translation = z.object({ lines: z.array(z.array(Segment)), bhavartha: z.string().optional() });

const Citation = z.object({ source: z.string(), locator: z.string().optional(), quote: z.string().optional() });
export type Citation = z.infer<typeof Citation>;

// A theme (concept) shown as a card in the Themes section and as a chip on the verses that tag it.
// `story` is the myth or teaching the theme comes from (rich text). `echoes` are famous lines from other
// texts where the same theme appears: stotrams, itihāsa, purāṇa, Veda, pre-modern bhajans. An echo is shown
// only when its source is `ancient`. Quote the line exactly as printed; a bhajan in another language
// (Gujarati, Braj…) may be given in Devanagari.
const ConceptEcho = z.object({
  text: z.string(),
  // Language of `text`: "sa" Sanskrit, "awa" Avadhi, "hi" Hindi, "gu" Gujarati, …
  lang: z.string(),
  iast: z.string().optional(),
  meaning: Localized,
  source: z.string(),
  locator: z.string().optional(),
});
const Concept = z.object({
  name: Localized,
  description: Localized,
  story: Localized.optional(),
  // Where the story is told (shown under it when the source is ancient).
  story_citations: z.array(Citation).optional(),
  echoes: z.array(ConceptEcho).optional(),
});

export const ANNOTATION_KINDS = [
  "context",
  "mythology",
  "wordplay",
  "sound",
  "theology",
  "grammar",
  "variant",
  "cross-reference",
] as const;

// Genius-style note on a phrase (a contiguous run of words). Bodies are inline markdown, see lib/markdown.tsx.
const Annotation = z.object({
  id: z.string(),
  refs: z.array(z.string()).min(1),
  kind: z.enum(ANNOTATION_KINDS),
  body: Localized,
  citations: z.array(Citation).optional(),
  confidence: z.enum(["high", "medium", "low"]),
});
export type Annotation = z.infer<typeof Annotation>;

const Verse = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  kind: z.enum(["verse", "phalashruti", "dhyana", "refrain"]),
  meter: z.string().optional(), // meter id (data/meters.json) when this verse differs from the stotram's
  concepts: z.array(z.string()).optional(),
  lines: z.array(
    z.object({
      words: z.array(z.object({ id: z.string(), text: z.string(), iast: z.string() })).min(1),
      end: z.string(),
      pada_count: z.number().int().positive().optional(), // metrical pādas on this line (default 1)
      meter_irregular: z.string().min(1).optional(), // why this line doesn't scan in every witness (T3.1 flags instead of failing); data only
    }),
  ),
  compounds: z
    .record(
      z.string(),
      z.object({
        members: z.array(z.string()),
        iast: z.string(),
        type: z.enum(SAMASA_TYPES),
        subtype: z.string().optional(), // e.g. "rūpaka", "ṣaṣṭhī"
        structure: z.string().optional(), // bracketed nesting, required for 3+ members (T2.9)
        vigraha: z.string().optional(),
        meaning: Localized,
        note: Localized.optional(),
      }),
    )
    .optional(),
  padas: z.array(Pada).optional(),
  adhyahara: z.array(Adhyahara).optional(),
  anvaya: z.array(z.string()).optional(), // prose order: pada and adhyāhāra ids
  translations: z.object({ en: Translation, hi: Translation }),
  annotations: z.array(Annotation).optional(),
  words: z.record(z.string(), WordEntry),
  // Text lock (T0.1–T0.2): the frozen text's hash and the sources it was established from.
  lock: z
    .object({
      hash: z.string(),
      sources: z.array(z.string()).min(1),
      variants: z
        .array(z.object({ at: z.string(), reading: z.string(), sources: z.array(z.string()), note: z.string().optional() }))
        .optional(),
      confirmed_by: z.string().nullable(), // a human; null until confirmed
    })
    .optional(),
  review: z.object({
    status: z.enum(["ai_draft", "ai_verified", "reviewed", "scholar_approved"]),
    history: z.array(z.object({ date: z.string(), by: z.string(), action: z.string() })).optional(),
  }),
});
export type Verse = z.infer<typeof Verse>;

export const CREDIT_ROLES = ["composer", "text", "meter", "language", "recension", "commentary", "recording"] as const;

const Credit = z.object({
  role: z.enum(CREDIT_ROLES),
  value: Localized,
  note: Localized.optional(),
  sources: z.array(z.string()).optional(),
});
export type Credit = z.infer<typeof Credit>;

const Faq = z.object({ id: z.string(), q: Localized, a: Localized, sources: z.array(z.string()).optional() });
export type Faq = z.infer<typeof Faq>;

export const RELATIONSHIP_TYPES = ["shares-text", "same-meter", "same-deity", "companion", "quotes", "quoted-in"] as const;

const Relationship = z.object({
  type: z.enum(RELATIONSHIP_TYPES),
  target: z.string().optional(), // stotram id when it is in the library
  name: Localized,
  note: Localized.optional(),
});

export const StotramSchema = z.object({
  schema_version: z.string().startsWith("0.3"),
  language: z.enum(["sa", "awa", "bra", "hi"]),
  tradition: z.object({ id: z.string(), note: Localized.optional() }).optional(),
  id: z.string(),
  type: z.string(),
  title: z.object({ sa: z.string(), iast: z.string(), en: z.string(), hi: z.string() }),
  deities: z.array(z.string()).min(1),
  attribution: Localized.optional(),
  meter: z.object({ id: z.string().optional(), name: z.string(), description: Localized }).optional(),
  summary: Localized,
  about: Localized.optional(),
  tags: z.array(z.string()).optional(),
  credits: z.array(Credit).optional(),
  faq: z.array(Faq).optional(),
  relationships: z.array(Relationship).optional(),
  concepts: z.record(z.string(), Concept).optional(),
  sources: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kind: z.string(),
      url: z.string().optional(),
      note: z.string().optional(),
      // Ancient Hindu texts (śāstra, itihāsa, the hymn itself). Only these are shown on the site;
      // dictionaries, editions and websites stay in the data for the checks and provenance.
      ancient: z.boolean().optional(),
    }),
  ),
  verses: z.array(Verse).min(1),
});
export type Stotram = z.infer<typeof StotramSchema>;
