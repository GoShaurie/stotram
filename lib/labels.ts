import type { Lang } from "./schema";

// UI chrome strings. Content strings come from the source files.
export const UI = {
  en: {
    translation: "Translation",
    transliteration: "IAST",
    splitView: "Split view",
    meaning: "Meaning",
    bhavartha: "Meaning in flow",
    split: "Word split",
    sandhi: "Sandhi",
    parts: "Parts and roots",
    grammar: "Grammar",
    notes: "Note",
    alternatives: "Other readings",
    compoundMember: "compound member",
    finalMember: "final member: carries the ending",
    indeclinable: "indeclinable",
    stem: "stem",
    of: "of",
    irregular: "Irregular form",
    supplied: "Supplied by the reader to complete the sentence (adhyāhāra)",
    compound: "Part of compound",
    confidence: "Confidence",
    close: "Close",
    themes: "Themes in this verse",
    verse: "Verse",
    hint: "Hover a word to see its meaning. Grey lines have notes; click any word for the full breakdown.",
    annotations: "Annotations",
    railHint: "Grey phrases have notes. Click one to read what it means and why.",
    onThisLine: "On this line",
    readMore: "Read",
    readStory: "Read the story",
    cited: "Sources",
    kind: {
      context: "Context",
      mythology: "Story",
      wordplay: "Wordplay",
      sound: "Sound",
      theology: "Theology",
      grammar: "Grammar",
      variant: "Variant reading",
      "cross-reference": "Cross-reference",
    },
    root: { dhatu: "verb root", pratipadika: "stem" },
    gana: "class",
    status: {
      ai_draft: "AI draft, not yet reviewed",
      ai_verified: "AI cross-checked, awaiting human review",
      reviewed: "Human reviewed",
      scholar_approved: "Scholar approved",
    },
    level: { high: "high", medium: "medium", low: "low" },
  },
  hi: {
    translation: "अनुवाद",
    transliteration: "IAST",
    splitView: "दो कॉलम",
    meaning: "अर्थ",
    bhavartha: "भावार्थ",
    split: "पदच्छेद",
    sandhi: "सन्धि",
    parts: "पद और मूल",
    grammar: "व्याकरण",
    notes: "टिप्पणी",
    alternatives: "अन्य अर्थ",
    compoundMember: "समास का पूर्वपद",
    finalMember: "अन्तिम पद: विभक्ति इसी में",
    indeclinable: "अव्यय",
    stem: "प्रातिपदिक",
    of: "का",
    irregular: "असामान्य रूप",
    supplied: "वाक्य पूरा करने के लिए जोड़ा गया शब्द (अध्याहार)",
    compound: "समास का भाग",
    confidence: "विश्वसनीयता",
    close: "बन्द करें",
    themes: "इस श्लोक के विषय",
    verse: "श्लोक",
    hint: "किसी शब्द पर कर्सर ले जाएँ, उसका अर्थ चमकेगा। धूसर पंक्तियों पर टिप्पणियाँ हैं; पूरे विवरण के लिए किसी भी शब्द पर क्लिक करें।",
    annotations: "टिप्पणियाँ",
    railHint: "धूसर वाक्यांशों पर टिप्पणियाँ हैं। उनका अर्थ और सन्दर्भ पढ़ने के लिए क्लिक करें।",
    onThisLine: "इस पंक्ति पर",
    readMore: "पढ़ें",
    readStory: "पूरी कथा पढ़ें",
    cited: "स्रोत",
    kind: {
      context: "सन्दर्भ",
      mythology: "कथा",
      wordplay: "शब्द-क्रीड़ा",
      sound: "ध्वनि",
      theology: "दर्शन",
      grammar: "व्याकरण",
      variant: "पाठभेद",
      "cross-reference": "अन्य सन्दर्भ",
    },
    root: { dhatu: "धातु", pratipadika: "प्रातिपदिक" },
    gana: "गण",
    status: {
      ai_draft: "AI प्रारूप, अभी समीक्षा नहीं हुई",
      ai_verified: "AI द्वारा जाँचा गया, मानवीय समीक्षा बाकी",
      reviewed: "मानवीय समीक्षा पूर्ण",
      scholar_approved: "विद्वान द्वारा अनुमोदित",
    },
    level: { high: "उच्च", medium: "मध्यम", low: "निम्न" },
  },
} as const;

// Page chrome for server-rendered sections (stotram and verse pages).
export const PAGE = {
  about: "About",
  credits: "Credits",
  faq: "Questions and answers",
  sources: "Sources",
  themes: "Themes",
  tags: "Tags",
  story: "The story",
  toldIn: "Told in",
  echoes: "Also sung",
  glossary: "Word-by-word meaning",
  role: {
    composer: "Composed by",
    text: "Found in",
    meter: "Meter",
    language: "Language",
    recension: "Recension",
    commentary: "Commentary",
    recording: "Recordings",
  },
} as const;

// Grammar terms: English name plus the traditional Sanskrit/Hindi term.
const CASE_SA: Record<string, string> = {
  nominative: "प्रथमा",
  accusative: "द्वितीया",
  instrumental: "तृतीया",
  dative: "चतुर्थी",
  ablative: "पञ्चमी",
  genitive: "षष्ठी",
  locative: "सप्तमी",
  vocative: "सम्बोधन",
};
const NUMBER_SA: Record<string, string> = { singular: "एकवचन", dual: "द्विवचन", plural: "बहुवचन" };
const GENDER_SA: Record<string, string> = { masculine: "पुंलिङ्ग", feminine: "स्त्रीलिङ्ग", neuter: "नपुंसकलिङ्ग" };
const PERSON_SA: Record<number, string> = { 1: "उत्तम पुरुष", 2: "मध्यम पुरुष", 3: "प्रथम पुरुष" };
const PERSON_EN: Record<number, string> = { 1: "1st person", 2: "2nd person", 3: "3rd person" };

export function grammarTerm(
  kind: "case" | "number" | "gender",
  value: string,
  lang: Lang,
): string {
  const table = kind === "case" ? CASE_SA : kind === "number" ? NUMBER_SA : GENDER_SA;
  const sa = table[value];
  if (kind === "case" && value !== "vocative") {
    return lang === "hi" ? `${sa} विभक्ति` : `${value} (${sa})`;
  }
  return lang === "hi" ? sa : `${value} (${sa})`;
}

// Syntactic roles of a pada (lib/schema.ts ROLES): English gloss and the Hindi/Sanskrit term.
const ROLE_EN: Record<string, string> = {
  "kriyā": "main verb",
  "kartā": "agent",
  "karma": "object",
  "karaṇa": "instrument",
  "sampradāna": "recipient",
  "apādāna": "source",
  "adhikaraṇa": "location",
  "sambandha": "relation (genitive)",
  "sambodhana": "address",
  "viśeṣaṇa": "qualifies",
  "samānādhikaraṇa": "in apposition to",
  "kriyā-viśeṣaṇa": "adverb",
  "pūrvakāla": "prior action",
  "nipāta": "particle",
};
const ROLE_HI: Record<string, string> = {
  "kriyā": "क्रिया",
  "kartā": "कर्ता",
  "karma": "कर्म",
  "karaṇa": "करण",
  "sampradāna": "सम्प्रदान",
  "apādāna": "अपादान",
  "adhikaraṇa": "अधिकरण",
  "sambandha": "सम्बन्ध",
  "sambodhana": "सम्बोधन",
  "viśeṣaṇa": "विशेषण",
  "samānādhikaraṇa": "समानाधिकरण",
  "kriyā-viśeṣaṇa": "क्रियाविशेषण",
  "pūrvakāla": "पूर्वकालिक क्रिया",
  "nipāta": "निपात",
};

export function roleTerm(role: string, lang: Lang): string {
  return lang === "hi" ? ROLE_HI[role] ?? role : `${role} (${ROLE_EN[role] ?? role})`;
}

export function personTerm(person: number, lang: Lang): string {
  return lang === "hi" ? PERSON_SA[person] : PERSON_EN[person];
}
