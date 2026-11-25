"use client";

import type { Annotation, Lang, Stotram, Verse } from "@/lib/schema";
import { UI } from "@/lib/labels";
import { RichText } from "@/lib/markdown";

type Props = {
  verse: Verse;
  annotation: Annotation;
  sources: Stotram["sources"];
  lang: Lang;
  linkBase: string;
  active: boolean;
  onActivate: () => void;
  onHover: (on: boolean) => void;
};

// One Genius-style note: the quoted fragment, then the body. Collapsed cards stay in the HTML
// (crawlable) and fade out after a few lines; the active card shows everything plus citations.
export function AnnotationCard({ verse, annotation: a, sources, lang, linkBase, active, onActivate, onHover }: Props) {
  const t = UI[lang];
  const words = verse.lines.flatMap((l) => l.words).filter((w) => a.refs.includes(w.id));
  const textClass = lang === "hi" ? "font-hindi text-[1.05rem]" : "text-[0.95rem]";
  // Only ancient texts are cited on the site; modern references stay in the data.
  const ancient = new Set(sources.filter((s) => s.ancient).map((s) => s.id));
  const citations = (a.citations ?? []).filter((c) => ancient.has(c.source));

  return (
    <article
      id={`${verse.id}-${a.id}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={active ? undefined : onActivate}
      className={`scroll-mt-24 rounded-2xl border p-4 transition-all duration-200 ${
        active
          ? "border-brand bg-bg shadow-[0_12px_40px_-16px_rgb(0_0_0/0.25)]"
          : "cursor-pointer border-transparent bg-bg-raised hover:border-line"
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <button
          type="button"
          aria-expanded={active}
          aria-controls={`${verse.id}-${a.id}-body`}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
          className="text-left focus-visible:outline-2 focus-visible:outline-brand"
        >
          <span className="block font-sanskrit text-lg leading-snug" lang="sa">
            {words.map((w) => w.text).join(" ")}
          </span>
          <span className="block text-xs italic text-ink-faint" lang="sa-Latn">
            {words.map((w) => w.iast).join(" ")}
          </span>
        </button>
        <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-bg">
          {t.kind[a.kind]}
        </span>
      </header>

      <div
        id={`${verse.id}-${a.id}-body`}
        className={`mt-3 leading-relaxed ${textClass} ${
          active ? "" : "max-h-[4.6rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
        }`}
        lang={lang}
      >
        <RichText text={a.body[lang]} linkBase={linkBase} />
      </div>

      {active && citations.length > 0 && (
        <footer className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">
          <p className="mb-1 font-semibold uppercase tracking-wider text-ink-faint">{t.cited}</p>
          <ul className="flex flex-col gap-1">
            {citations.map((c, i) => (
              <li key={i}>
                <a href={`${linkBase}#source-${c.source}`} className="font-medium text-ink hover:text-brand">
                  {sources.find((s) => s.id === c.source)?.name ?? c.source}
                </a>
                {c.locator && <span>, {c.locator}</span>}
                {c.quote && <span className="italic"> “{c.quote}”</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-ink-faint">
            {t.confidence}: {t.level[a.confidence]} · {t.status[verse.review.status]}
          </p>
        </footer>
      )}
    </article>
  );
}
