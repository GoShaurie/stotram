"use client";

import { useEffect, useRef } from "react";
import type { Lang, Verse } from "@/lib/schema";
import { UI } from "@/lib/labels";
import { RichText } from "@/lib/markdown";
import { isWordNote } from "@/lib/annotations";

type Props = {
  verse: Verse;
  wordId: string;
  lang: Lang;
  linkBase: string;
  onClose: () => void;
  onOpenAnnotation: (annotationId: string) => void;
};

// Word card: word, IAST, meaning, its parts with their meanings, then the story on this phrase. Bottom sheet on mobile; on desktop it sits in the verse's rail, beside the text.
export function WordPanel({ verse, wordId, lang, linkBase, onClose, onOpenAnnotation }: Props) {
  const t = UI[lang];
  const word = verse.words[wordId];
  const surface = verse.lines.flatMap((l) => l.words).find((w) => w.id === wordId);
  const annotations = verse.annotations?.filter((a) => a.refs.includes(wordId)) ?? [];
  // A theology note on this one word is read here, with the word; a phrase/line note stays a story card.
  const wordNote = annotations.find(isWordNote);
  const annotation = annotations.find((a) => !isWordNote(a));
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, [wordId]);

  if (!word || !surface) return null;
  const textClass = lang === "hi" ? "font-hindi" : "";
  // Long compounds (मन्दाकिनीसलिलचन्दनचर्चिताय) get a smaller heading and may wrap, so the card never scrolls sideways.
  const headSize = surface.text.length > 16 ? "text-2xl" : surface.text.length > 10 ? "text-3xl" : "text-4xl";

  const head = (
    <>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="word-panel-title" className={`font-sanskrit ${headSize} [overflow-wrap:anywhere]`} lang="sa">
            {surface.text}
          </h2>
          <p className="mt-1 text-base italic text-ink-muted [overflow-wrap:anywhere]">{surface.iast}</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="rounded-full bg-bg-raised px-3 py-1 text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          ✕
        </button>
      </div>

      <p className={`-mt-2 mb-6 text-xl font-semibold leading-snug ${textClass}`}>{word.meaning[lang]}</p>

      <Section title={t.split}>
        <ol className="flex flex-wrap items-start gap-x-3 gap-y-4">
          {word.components.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              {i > 0 && <span className="pt-1 font-sanskrit text-2xl text-ink-faint" aria-hidden>+</span>}
              <span className="flex min-w-0 max-w-[9rem] flex-col">
                <span className="font-sanskrit text-2xl leading-snug [overflow-wrap:anywhere]" lang="sa">{c.sa}</span>
                <span className="text-sm italic text-ink-muted [overflow-wrap:anywhere]" lang="sa-Latn">{c.iast}</span>
                <span className={`mt-1 text-sm leading-snug ${textClass}`}>{c.meaning[lang]}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
  const more = (
    <>
      {annotation && (
        <button
          type="button"
          onClick={() => onOpenAnnotation(annotation.id)}
          className="group block w-full rounded-xl bg-bg-raised p-3 text-left focus-visible:outline-2 focus-visible:outline-brand"
        >
          <div className={`max-h-[4.2rem] overflow-hidden text-sm leading-relaxed text-ink-muted [mask-image:linear-gradient(to_bottom,black_45%,transparent)] ${textClass}`}>
            <RichText text={annotation.body[lang]} />
          </div>
          <span className={`mt-2 block text-sm font-semibold text-brand group-hover:underline ${textClass}`}>{t.readStory} →</span>
        </button>
      )}

      {word.aside && (
        <p className={`mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-muted ${textClass}`}>{word.aside[lang]}</p>
      )}

      {wordNote && (
        <section id={`${verse.id}-${wordNote.id}`} className="mt-6 border-t border-line pt-4 scroll-mt-24" aria-label={t.kind[wordNote.kind]}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">{t.kind[wordNote.kind]}</h3>
          <div className={`leading-relaxed text-ink-muted ${lang === "hi" ? "font-hindi text-[1.05rem]" : "text-[0.95rem]"}`} lang={lang}>
            <RichText text={wordNote.body[lang]} linkBase={linkBase} />
          </div>
        </section>
      )}
    </>
  );

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="word-panel-title"
      className={FLOATING}
    >
      {head}
      {more}
    </div>
  );
}

const FLOATING =
  "fixed inset-x-0 bottom-0 z-30 max-h-[78vh] overflow-y-auto overflow-x-hidden rounded-t-3xl border-t border-line bg-bg p-6 shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.35)] animate-[slide-up_0.3s_ease-out] lg:sticky lg:top-20 lg:inset-auto lg:z-auto lg:max-h-[calc(100vh-6rem)] lg:rounded-2xl lg:border lg:shadow-[0_12px_40px_-16px_rgb(0_0_0/0.25)] lg:animate-[fade-in_0.2s_ease-out]";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">{title}</h3>
      {children}
    </section>
  );
}
