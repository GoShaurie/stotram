import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStotram, listStotrams } from "@/lib/stotrams";
import { faqJsonLd, stotramJsonLd, stotramPath, versePath } from "@/lib/seo";
import { PAGE } from "@/lib/labels";
import { Reader } from "@/components/reader/Reader";
import { publicSources, publicVerse } from "@/lib/public";
import { WordGlossary } from "@/components/WordGlossary";
import { About, Credits, Faq, Sources, Themes } from "@/components/StotramSections";
import { JsonLd } from "@/components/JsonLd";
import { HeaderPill, StotramHeader } from "@/components/StotramHeader";

export function generateStaticParams() {
  return listStotrams().map((s) => ({ id: s.id }));
}

// Pages are fully prerendered (ensureStatic = "navigation") and their content depends on
// params. Allow navigations to block on that static payload instead of streaming a
// fallback, so the prerendered HTML keeps the text inline (SEO; see CLAUDE.md).
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/stotram/[id]">): Promise<Metadata> {
  const s = getStotram((await params).id);
  if (!s) return {};
  return {
    title: `${s.title.en} Lyrics with Meaning (Word by Word)`,
    description: `${s.title.en} (${s.title.sa}) in Sanskrit with word-by-word meaning in English and Hindi: sandhi split, roots and grammar for every word. ${s.summary.en}`,
    alternates: { canonical: stotramPath(s) },
    openGraph: { title: `${s.title.en}: ${s.title.sa}`, description: s.summary.en, type: "article" },
  };
}

export default async function StotramPage({ params }: PageProps<"/stotram/[id]">) {
  const s = getStotram((await params).id);
  if (!s) notFound();

  const annotationCount = s.verses.reduce((n, v) => n + (v.annotations?.length ?? 0), 0);
  const wordCount = s.verses.reduce((n, v) => n + Object.keys(v.words).length, 0);
  const composer = s.credits?.find((c) => c.role === "composer")?.value.en;

  return (
    <main>
      <JsonLd data={stotramJsonLd(s)} />
      {s.faq?.length ? <JsonLd data={faqJsonLd(s)} /> : null}

      <StotramHeader
        kicker={`${s.type} · ${s.deities.join(" · ")}`}
        sa={s.title.sa}
        title={s.title.en}
        byline={composer ?? s.attribution?.en}
        stats={[
          [String(s.verses.length), s.verses.length === 1 ? "verse" : "verses"],
          [String(wordCount), "words explained"],
          [String(annotationCount), "annotations"],
        ]}
      >
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{s.summary.en}</p>
        <nav aria-label="Jump to" className="mt-8 flex flex-wrap gap-2 text-sm">
          {s.about && <HeaderPill href="#about">{PAGE.about}</HeaderPill>}
          {s.faq?.length ? <HeaderPill href="#faq">Q&amp;A</HeaderPill> : null}
          <HeaderPill href={`${stotramPath(s)}/print`}>Print / PDF</HeaderPill>
          {s.verses.map((v) => (
            <HeaderPill key={v.id} href={versePath(s, v)}>
              {v.number}
            </HeaderPill>
          ))}
        </nav>
      </StotramHeader>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reader verses={s.verses.map((v) => publicVerse(v, s))} concepts={s.concepts} sources={publicSources(s)} />
        <div className="mt-24">
          <About s={s} />
          <Faq s={s} />
          <Credits s={s} />
          <Themes s={s} />
          <WordGlossary verses={s.verses} />
          <Sources s={s} />
        </div>
      </div>
    </main>
  );
}
