import { Fragment } from "react";
import type { Verse } from "@/lib/schema";
import { isWordNote } from "@/lib/annotations";
import { RichText } from "@/lib/markdown";

// Server-rendered word-by-word table: crawlable, works without JavaScript, and
// answers "<word> meaning" searches. The interactive reader shows the same data.
export function WordGlossary({ verses }: { verses: Verse[] }) {
  return (
    <section aria-labelledby="glossary-title" className="border-t border-line py-14">
      <h2 id="glossary-title" className="mb-2 text-3xl font-extrabold tracking-tight">
        Word-by-word meaning
      </h2>
      <p className="mb-8 text-ink-muted">Every word with its split, English and Hindi meaning.</p>
      {verses.map((verse) => (
        <details key={verse.id} className="mb-3 rounded-2xl bg-bg-raised">
          <summary className="cursor-pointer px-5 py-4 font-semibold">Verse {verse.number}</summary>
          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink-faint">
                <tr>
                  <th className="py-2 pr-4 font-normal">Word</th>
                  <th className="py-2 pr-4 font-normal">Split</th>
                  <th className="py-2 pr-4 font-normal">English</th>
                  <th className="py-2 font-normal">हिन्दी</th>
                </tr>
              </thead>
              <tbody>
                {verse.lines
                  .flatMap((l) => l.words)
                  .map((w) => {
                    const entry = verse.words[w.id];
                    // Word-level notes and asides, which the reader shows inside the word card.
                    const note = verse.annotations?.find((a) => isWordNote(a) && a.refs[0] === w.id);
                    const extra = [note?.body, entry.aside].filter((x) => x !== undefined);
                    return (
                      <Fragment key={w.id}>
                      <tr className="border-t border-line align-top">
                        <td className="py-2 pr-4">
                          <span className="font-sanskrit text-lg" lang="sa">{w.text}</span>
                          <br />
                          <span className="italic text-ink-muted">{w.iast}</span>
                        </td>
                        <td className="py-2 pr-4 font-sanskrit text-base" lang="sa">
                          {entry.padaccheda.map((p) => p.sa).join(" + ")}
                        </td>
                        <td className="py-2 pr-4">{entry.meaning.en}</td>
                        <td className="py-2 font-hindi" lang="hi">{entry.meaning.hi}</td>
                      </tr>
                      {extra.length > 0 && (
                        <tr className="align-top">
                          <td />
                          <td colSpan={3} className="pb-3 text-ink-muted">
                            {extra.map((x, i) => (
                              <div key={i} className="mb-2 grid gap-2 sm:grid-cols-2">
                                <RichText text={x.en} className="leading-relaxed" />
                                <div lang="hi" className="font-hindi">
                                  <RichText text={x.hi} className="leading-relaxed" />
                                </div>
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </section>
  );
}
