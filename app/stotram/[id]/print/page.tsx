import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStotram, listStotrams } from "@/lib/stotrams";
import { alignToLines } from "@/lib/align";
import { stotramPath } from "@/lib/seo";
import { SITE } from "@/lib/site";
import type { Lang, Verse } from "@/lib/schema";
import { PrintSheet } from "@/components/print/PrintSheet";

// A calm, printable sheet: each Sanskrit line with its meaning beside it, verse after verse.
// No notes, no word cards; the full reading page is one click away.

export function generateStaticParams() {
  return listStotrams().map((s) => ({ id: s.id }));
}

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/stotram/[id]/print">): Promise<Metadata> {
  const s = getStotram((await params).id);
  if (!s) return {};
  return {
    title: `${s.title.en}: printable text with meaning`,
    description: `${s.title.en} (${s.title.sa}): each Sanskrit line with its meaning beside it, ready to print or save as PDF.`,
    alternates: { canonical: `${stotramPath(s)}/print` },
    // Same text as the main page; keep search results pointing there.
    robots: { index: false, follow: true },
  };
}

export default async function PrintPage({ params }: PageProps<"/stotram/[id]/print">) {
  const s = getStotram((await params).id);
  if (!s) notFound();

  return (
    <main className="print-sheet">
      <PrintSheet backHref={stotramPath(s)}>
        <article className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16 sm:px-6 print:max-w-none print:p-0">
          <header className="border-b-2 border-ink pb-5 text-center">
            <p className="font-sanskrit text-4xl leading-tight print:text-3xl" lang="sa">
              {s.title.sa}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight print:text-xl">{s.title.en}</h1>
            <p className="mt-3 text-sm text-ink-muted">
              <Meaning lang="en">Each line of the hymn, with its meaning beside it.</Meaning>
              <Meaning lang="hi">हर पंक्ति के साथ उसका अर्थ।</Meaning>
            </p>
          </header>

          {/* Column heads, so the two sides are named once */}
          <div className="mt-6 hidden grid-cols-[2.25rem_minmax(0,1.15fr)_minmax(0,1fr)] gap-x-6 text-xs font-bold uppercase tracking-[0.2em] text-ink-faint sm:grid print:grid">
            <span />
            <span>Text</span>
            <span>
              <Meaning lang="en">Meaning</Meaning>
              <Meaning lang="hi">अर्थ</Meaning>
            </span>
          </div>

          <div className="mt-2">
            {s.verses.map((v) => (
              <PrintVerse key={v.id} verse={v} />
            ))}
          </div>

          <footer className="mt-10 border-t border-line pt-4 text-center text-xs text-ink-faint">
            Word-by-word meanings and the stories behind each line: {SITE.url.replace(/^https?:\/\//, "")}
            {stotramPath(s)}
          </footer>
        </article>
      </PrintSheet>
    </main>
  );
}

function PrintVerse({ verse }: { verse: Verse }) {
  const rows = { en: alignToLines(verse, verse.translations.en.lines), hi: alignToLines(verse, verse.translations.hi.lines) };

  return (
    <section
      aria-label={`Verse ${verse.number}`}
      className="grid break-inside-avoid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 border-b border-line py-5 sm:grid-cols-[2.25rem_minmax(0,1.15fr)_minmax(0,1fr)] sm:gap-x-6 print:grid-cols-[2.25rem_minmax(0,1.15fr)_minmax(0,1fr)] print:py-3.5"
    >
      <span
        className="font-sanskrit text-lg text-ink-faint sm:row-span-(--rows) print:row-span-(--rows)"
        style={{ "--rows": verse.lines.length } as React.CSSProperties}
        aria-hidden
      >
        {verse.number}
      </span>
      {verse.lines.map((line, li) => (
        <div key={li} className="contents">
          {/* Sanskrit line */}
          <div className={`col-start-2 ${li > 0 ? "mt-3 print:mt-2" : ""}`}>
            <p lang="sa" className="font-sanskrit text-[1.35rem] leading-snug print:text-[13.5pt]">
              {line.words.map((w) => w.text).join(" ")}
              {line.end && <span className="text-ink-faint"> {line.end}</span>}
            </p>
            <p
              lang="sa-Latn"
              className="hidden text-sm italic text-ink-muted group-data-[iast=on]/sheet:block print:text-[9pt]"
            >
              {line.words.map((w) => w.iast).join(" ")}
            </p>
          </div>
          {/* Its meaning: beside it on wide screens and paper, under it on phones */}
          <div
            className={`col-start-2 mt-1 sm:col-start-3 print:col-start-3 ${li > 0 ? "sm:mt-3 print:mt-2" : "sm:mt-0 print:mt-0"}`}
          >
            {(["en", "hi"] as const).map((lang) => (
              <Meaning key={lang} lang={lang} block>
                <span
                  className={`block leading-relaxed text-ink-muted sm:pt-1 print:pt-0.5 print:text-ink ${
                    lang === "hi" ? "font-hindi text-[1.05rem] print:text-[11pt]" : "text-[0.98rem] print:text-[10.5pt]"
                  }`}
                >
                  {rows[lang][li].map((seg, si) => (
                    <span key={seg.id}>
                      {si > 0 && " "}
                      {seg.refs.every((r) => !verse.words[r]) ? <span className="italic">{seg.text}</span> : seg.text}
                    </span>
                  ))}
                </span>
              </Meaning>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

// Text in one meaning language; the other is hidden by the toolbar's choice (and on paper).
function Meaning({ lang, block, children }: { lang: Lang; block?: boolean; children: React.ReactNode }) {
  const shown = block ? "block" : "inline";
  const hide =
    lang === "en"
      ? `${shown} group-data-[lang=hi]/sheet:hidden`
      : `hidden ${block ? "group-data-[lang=hi]/sheet:block" : "group-data-[lang=hi]/sheet:inline"}`;
  return (
    <span lang={lang} className={hide}>
      {children}
    </span>
  );
}
