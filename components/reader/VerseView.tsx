"use client";

import { Fragment } from "react";
import type { Lang, Stotram, Verse } from "@/lib/schema";
import { UI } from "@/lib/labels";
import type { Hover, Layout } from "./Reader";
import { AnnotationCard } from "./AnnotationCard";
import { WordPanel } from "./WordPanel";
import { isWordNote } from "@/lib/annotations";
import { alignToLines } from "@/lib/align";

type Props = {
  verse: Verse;
  concepts: Stotram["concepts"];
  sources: Stotram["sources"];
  lang: Lang;
  showIast: boolean;
  layout: Layout;
  linkBase: string;
  hover: Hover;
  pinnedWordId: string | null;
  activeAnnotationId: string | null;
  onHover: (hover: Hover) => void;
  onPin: (wordId: string) => void;
  onActivate: (annotationId: string | null) => void;
  // Opens a note without toggling: used when the word card hands over to its story card.
  onOpen: (annotationId: string) => void;
  onClose: () => void;
};

// Default (Genius) layout: the text on the left, its notes in a rail on the right (stacked on mobile).
// Split layout: smaller text, Sanskrit left and meaning right, line by line; no rail.
export function VerseView({
  verse,
  concepts,
  sources,
  lang,
  showIast,
  layout,
  linkBase,
  hover,
  pinnedWordId,
  activeAnnotationId,
  onHover,
  onPin,
  onActivate,
  onOpen,
  onClose,
}: Props) {
  const t = UI[lang];
  const lit = new Set(hover?.ids ?? []);
  if (pinnedWordId) lit.add(pinnedWordId);

  const annotations = verse.annotations ?? [];
  // Single-word theology notes are read inside the word card; the rail keeps the rest.
  const railNotes = annotations.filter((a) => !isWordNote(a));
  const annotationOf = (wordId: string) => annotations.find((a) => a.refs.includes(wordId));
  const activeRefs = new Set(annotations.find((a) => a.id === activeAnnotationId)?.refs ?? []);
  // Hovering any word of an annotated phrase lifts the whole phrase, as on Genius.
  const hoveredPhrase = new Set(
    hover?.source === "annotation"
      ? hover.ids
      : hover
        ? (hover.ids.map(annotationOf).find(Boolean)?.refs ?? [])
        : [],
  );

  // Hovering one member of a compound outlines the whole compound.
  const hoveredCompound =
    hover?.source === "word" && hover.ids.length === 1 ? verse.words[hover.ids[0]]?.compound : undefined;
  const compoundMembers = new Set(hoveredCompound ? verse.compounds?.[hoveredCompound]?.members : []);

  const clear = () => onHover(null);
  const translation = verse.translations[lang];
  const meaningRows = alignToLines(verse, translation.lines);
  // A meaning segment joins the phrase of the annotation its words belong to, so highlights carry over.
  const meaningAnnotation = new Map<string, string | undefined>();
  for (const row of meaningRows) {
    const ids = row.map((seg) => seg.refs.map(annotationOf).find(Boolean)?.id);
    // A supplied word between two segments of one phrase ("May [that] Śiva") stays inside it.
    row.forEach((seg, i) => meaningAnnotation.set(seg.id, ids[i] ?? (ids[i - 1] === ids[i + 1] ? ids[i - 1] : undefined)));
  }
  const verseConcepts = (verse.concepts ?? []).flatMap((id) => (concepts?.[id] ? [{ id, ...concepts[id] }] : []));
  const textClass = lang === "hi" ? "font-hindi" : "";

  const compact = layout === "split";

  const sanskritLine = (li: number) => {
    const line = verse.lines[li];
    return (
      <p lang="sa" className={`flex flex-wrap items-end ${compact ? "gap-x-1 gap-y-1" : "gap-x-2 gap-y-2"}`}>
        {phrases(line.words, (id) => annotationOf(id)?.id).map(({ key, annotationId, words }) => {
          const phraseState = !annotationId
            ? ""
            : words.some((w) => activeRefs.has(w.id))
              ? "bg-brand-soft"
              : words.some((w) => hoveredPhrase.has(w.id))
                ? "bg-hl-hover"
                : "bg-hl";
          return (
            <span key={key} className={`flex flex-wrap items-end rounded-md transition-colors duration-150 ${phraseState}`}>
              {words.map((w) => {
                const state = lit.has(w.id)
                  ? "lit"
                  : compoundMembers.has(w.id)
                    ? "outline outline-1 outline-dashed outline-ink-faint"
                    : annotationId
                      ? ""
                      : "hover:bg-hl";
                return (
                  <button
                    key={w.id}
                    type="button"
                    data-word={`${verse.id}:${w.id}`}
                    aria-pressed={pinnedWordId === w.id}
                    aria-label={`${w.text} (${w.iast}): ${verse.words[w.id]?.meaning[lang] ?? ""}`}
                    onMouseEnter={() => onHover({ verseId: verse.id, ids: [w.id], source: "word" })}
                    onMouseLeave={clear}
                    onFocus={() => onHover({ verseId: verse.id, ids: [w.id], source: "word" })}
                    onBlur={clear}
                    onClick={() => onPin(w.id)}
                    className={`flex cursor-pointer flex-col items-start rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand ${
                      compact ? "px-1 py-0" : "px-1.5 py-0.5"
                    } ${state}`}
                  >
                    <span
                      className={`font-sanskrit leading-snug ${compact ? "text-[1.3rem] sm:text-[1.4rem]" : "text-[1.7rem] sm:text-[2rem]"}`}
                    >
                      {w.text}
                    </span>
                    {showIast && (
                      <span className={`italic text-ink-muted ${compact ? "text-xs" : "text-sm"}`} lang="sa-Latn">
                        {w.iast}
                      </span>
                    )}
                  </button>
                );
              })}
            </span>
          );
        })}
        {line.end && (
          <span className={`pl-1 font-sanskrit text-ink-faint ${compact ? "pb-0.5 text-lg" : "pb-1 text-2xl"}`}>{line.end}</span>
        )}
      </p>
    );
  };

  const meaningLine = (li: number) => {
    if (meaningRows[li].length === 0) return null;
    const size = lang === "hi" ? (compact ? "font-hindi text-base" : "font-hindi text-lg") : compact ? "text-[0.95rem]" : "text-[1.08rem]";
    return (
      <p lang={lang} className={`leading-relaxed text-ink-muted ${compact ? "" : "border-l-2 border-line pl-3"} ${size}`}>
        {phrases(meaningRows[li], (id) => meaningAnnotation.get(id)).map(({ key, annotationId, words: segs }) => {
          const refs = segs.flatMap((s) => s.refs);
          const phraseState = !annotationId
            ? ""
            : refs.some((r) => activeRefs.has(r))
              ? "bg-brand-soft text-ink"
              : refs.some((r) => hoveredPhrase.has(r))
                ? "bg-hl-hover text-ink"
                : "bg-hl";
          return (
            <span key={key}>
              <span className={`rounded px-0.5 transition-colors duration-150 [box-decoration-break:clone] ${phraseState}`}>
                {segs.map((seg, si) => (
                  <span key={seg.id}>
                    {si > 0 && " "}
                    {seg.refs.every((r) => !verse.words[r]) ? (
                      // Only adhyāhāra (words the reader supplies): shown, but not linked to the text
                      <span className="italic text-ink-faint" title={t.supplied}>
                        {seg.text}
                      </span>
                    ) : (
                      <span
                        onMouseEnter={() => onHover({ verseId: verse.id, ids: seg.refs, source: "segment" })}
                        onMouseLeave={clear}
                        onClick={() => onPin(seg.refs.find((r) => verse.words[r]) ?? seg.refs[0])}
                        className={`cursor-pointer rounded transition-colors duration-150 ${
                          seg.refs.some((r) => lit.has(r)) ? "lit text-ink" : "hover:text-ink"
                        }`}
                      >
                        {seg.text}
                      </span>
                    )}
                  </span>
                ))}
              </span>{" "}
            </span>
          );
        })}
      </p>
    );
  };

  const heading = (
    <div className={`flex items-baseline justify-between gap-4 ${compact ? "mb-3" : "mb-8"}`}>
      <h2 id={`verse-${verse.number}-title`} className="text-sm font-bold uppercase tracking-[0.2em] text-ink-faint">
        {t.verse} {verse.number}
      </h2>
      <StatusBadge status={verse.review.status} lang={lang} />
    </div>
  );

  const bhavartha = translation.bhavartha && (
    <div className={compact ? "" : "mt-8"}>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">{t.bhavartha}</h3>
      <p
        className={`max-w-2xl leading-relaxed ${lang === "hi" ? (compact ? "font-hindi text-base" : "font-hindi text-lg") : compact ? "text-sm" : "text-base"}`}
        lang={lang}
      >
        {translation.bhavartha}
      </p>
    </div>
  );

  const themes = verseConcepts.length > 0 && (
    <ul aria-label={t.themes} className={`flex flex-wrap gap-2 ${compact ? "mt-4" : "mt-8"}`}>
      {verseConcepts.map((c) => (
        <li key={c.id}>
          <a
            href={`${linkBase}#concept-${c.id}`}
            title={c.description[lang].replace(/\*/g, "")}
            className={`inline-block rounded-full border border-line text-ink-muted transition-colors hover:border-ink hover:text-ink ${
              compact ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
            } ${textClass}`}
          >
            {c.name[lang]}
          </a>
        </li>
      ))}
    </ul>
  );

  // Split view: smaller text, Sanskrit in the left half and its meaning in the right half, each column evenly spaced
  // (hover mapping ties them together). The right column stays empty until a word is clicked; then it shows the
  // same word card as the default view (and the story card, if the reader opens it from there).
  if (compact) {
    const openNote = !pinnedWordId ? annotations.find((a) => a.id === activeAnnotationId) : undefined;
    return (
      // Each verse is a subgrid of the Reader's split grid (Sanskrit | meaning | word card), so the columns line
      // up across every verse instead of each verse sizing its own Sanskrit column.
      <article
        id={`verse-${verse.number}`}
        aria-labelledby={`verse-${verse.number}-title`}
        className="grid scroll-mt-24 md:col-span-2 md:grid-cols-subgrid lg:col-span-3"
      >
        <div className="md:col-span-2">{heading}</div>
        <div className="flex flex-col gap-2 md:col-start-1">
          {verse.lines.map((_, li) => (
            <Fragment key={li}>{sanskritLine(li)}</Fragment>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 md:col-start-2 md:mt-0 md:border-l md:border-line md:pl-6">
          {verse.lines.map((_, li) => (
            <Fragment key={li}>{meaningLine(li)}</Fragment>
          ))}
          {bhavartha && <div className="mt-3">{bhavartha}</div>}
        </div>
        {themes && <div className="md:col-span-2">{themes}</div>}

        <aside aria-label={t.annotations} className="relative md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-3 lg:row-start-1">
          {pinnedWordId ? (
            <WordPanel
              verse={verse}
              wordId={pinnedWordId}
              lang={lang}
              linkBase={linkBase}
              onClose={onClose}
              onOpenAnnotation={onOpen}
            />
          ) : openNote ? (
            <div className="lg:sticky lg:top-20">
              <AnnotationCard
                verse={verse}
                annotation={openNote}
                sources={sources}
                lang={lang}
                linkBase={linkBase}
                active
                onActivate={() => onActivate(openNote.id)}
                onHover={(on) => onHover(on ? { verseId: verse.id, ids: openNote.refs, source: "annotation" } : null)}
              />
            </div>
          ) : null}
        </aside>
      </article>
    );
  }

  return (
    <article
      id={`verse-${verse.number}`}
      aria-labelledby={`verse-${verse.number}-title`}
      className="grid scroll-mt-24 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14"
    >
      <div>
        {heading}

        {/* Original text, each line followed by its meaning so the eye barely moves */}
        <div className="flex flex-col gap-7">
          {verse.lines.map((_, li) => (
            <div key={li} className="flex flex-col gap-2">
              {sanskritLine(li)}
              {meaningLine(li)}
            </div>
          ))}
        </div>

        {bhavartha}
        {themes}
      </div>

      {/* Rail: the clicked word, or this verse's annotations */}
      <aside aria-label={t.annotations} className="relative">
        {pinnedWordId ? (
          <WordPanel
            verse={verse}
            wordId={pinnedWordId}
            lang={lang}
            linkBase={linkBase}
            onClose={onClose}
            onOpenAnnotation={onOpen}
          />
        ) : railNotes.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className={`text-xs text-ink-faint ${textClass}`}>{t.railHint}</p>
            {railNotes.map((a) => (
              <AnnotationCard
                key={a.id}
                verse={verse}
                annotation={a}
                sources={sources}
                lang={lang}
                linkBase={linkBase}
                active={a.id === activeAnnotationId}
                onActivate={() => onActivate(a.id)}
                onHover={(on) => onHover(on ? { verseId: verse.id, ids: a.refs, source: "annotation" } : null)}
              />
            ))}
          </div>
        ) : null}
      </aside>
    </article>
  );
}

// Consecutive words of the same annotation form one highlighted phrase; other words stand alone.
function phrases<W extends { id: string }>(words: W[], annotationOf: (id: string) => string | undefined) {
  const out: { key: string; annotationId?: string; words: W[] }[] = [];
  for (const w of words) {
    const annotationId = annotationOf(w.id);
    const last = out.at(-1);
    if (annotationId && last?.annotationId === annotationId) last.words.push(w);
    else out.push({ key: w.id, annotationId, words: [w] });
  }
  return out;
}

function StatusBadge({ status, lang }: { status: Verse["review"]["status"]; lang: Lang }) {
  const reviewed = status === "reviewed" || status === "scholar_approved";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        reviewed ? "bg-deity/10 text-deity" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
      } ${lang === "hi" ? "font-hindi" : ""}`}
    >
      {UI[lang].status[status]}
    </span>
  );
}
