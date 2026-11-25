"use client";

import { useCallback, useEffect, useState } from "react";
import { LANGS, type Lang, type Stotram, type Verse } from "@/lib/schema";
import { UI } from "@/lib/labels";
import { usePreference } from "./usePreference";
import { VerseView } from "./VerseView";
import { isWordNote } from "@/lib/annotations";

export type WordRef = { verseId: string; wordId: string };
export type AnnotationRef = { verseId: string; id: string };
export const LAYOUTS = ["reader", "split"] as const;
export type Layout = (typeof LAYOUTS)[number];
export type Hover = { verseId: string; ids: string[]; source: "word" | "segment" | "annotation" } | null;

type Props = {
  verses: Verse[];
  concepts: Stotram["concepts"];
  sources: Stotram["sources"];
  // Prefix for in-page links inside annotation bodies ("" on the stotram page).
  linkBase?: string;
};

const ANNOTATION_HASH = /^#([\w-]+?)-(a\w+)$/;

export function Reader({ verses, concepts, sources, linkBase = "" }: Props) {
  const [lang, setLang] = usePreference<Lang>("stotram:lang", "en", LANGS);
  const [iast, setIast] = usePreference<"on" | "off">("stotram:iast", "off", ["on", "off"]);
  // "split" (the compact two-column view, word card on the right on click) is the default and the server-rendered
  // layout; "reader" is the Genius layout with the notes rail (EDITORIAL_GUIDE, 2026-11-25).
  const [layout, setLayout] = usePreference<Layout>("stotram:layout", "split", LAYOUTS);
  const [hover, setHover] = useState<Hover>(null);
  const [pinned, setPinned] = useState<WordRef | null>(null);
  const [active, setActive] = useState<AnnotationRef | null>(null);

  const close = useCallback(() => {
    setPinned(null);
    setActive(null);
  }, []);

  useEffect(() => {
    if (!pinned && !active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned, active, close]);

  // Annotation permalinks (#v1-a3) open that annotation, like a Genius referent URL.
  useEffect(() => {
    const open = () => {
      const m = ANNOTATION_HASH.exec(window.location.hash);
      if (!m) return;
      const verse = verses.find((v) => v.id === m[1]);
      const note = verse?.annotations?.find((a) => a.id === m[2]);
      if (!verse || !note) return;
      // Word-level notes live in the word card, so open that word.
      setPinned(isWordNote(note) ? { verseId: verse.id, wordId: note.refs[0] } : null);
      setActive({ verseId: verse.id, id: m[2] });
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [verses]);

  const t = UI[lang];
  const split = layout === "split";

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 -mx-4 mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <p className="hidden text-sm text-ink-faint md:block">{t.hint}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle
            label={t.splitView}
            pressed={split}
            onClick={() => setLayout(split ? "reader" : "split")}
          />
          <Toggle
            label={t.transliteration}
            pressed={iast === "on"}
            onClick={() => setIast(iast === "on" ? "off" : "on")}
          />
          <div role="group" aria-label={t.translation} className="flex rounded-full bg-bg-raised p-0.5">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  lang === l ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {l === "en" ? "English" : "हिन्दी"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={
          split
            ? "grid gap-y-12 md:grid-cols-[fit-content(55%)_minmax(0,1fr)] md:gap-x-8 lg:grid-cols-[fit-content(40%)_minmax(0,1fr)_300px] lg:gap-x-8"
            : "flex flex-col gap-24"
        }
      >
        {verses.map((verse) => (
          <VerseView
            key={verse.id}
            verse={verse}
            concepts={concepts}
            sources={sources}
            lang={lang}
            showIast={iast === "on"}
            layout={layout}
            linkBase={linkBase}
            hover={hover?.verseId === verse.id ? hover : null}
            pinnedWordId={pinned?.verseId === verse.id ? pinned.wordId : null}
            activeAnnotationId={active?.verseId === verse.id ? active.id : null}
            onHover={setHover}
            onPin={(wordId) => {
              const isOpen = pinned?.verseId === verse.id && pinned.wordId === wordId;
              setPinned(isOpen ? null : { verseId: verse.id, wordId });
              const annotation = verse.annotations?.find((a) => a.refs.includes(wordId));
              setActive(!isOpen && annotation ? { verseId: verse.id, id: annotation.id } : null);
            }}
            onOpen={(id) => {
              setPinned(null);
              setActive({ verseId: verse.id, id });
              // Bring the opened card into view once the rail has re-rendered.
              requestAnimationFrame(() =>
                document.getElementById(`${verse.id}-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
              );
            }}
            onActivate={(id) => {
              setPinned(null);
              setActive((a) => (a?.verseId === verse.id && a.id === id ? null : id ? { verseId: verse.id, id } : null));
            }}
            onClose={close}
          />
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        pressed ? "bg-ink text-bg" : "bg-bg-raised text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
