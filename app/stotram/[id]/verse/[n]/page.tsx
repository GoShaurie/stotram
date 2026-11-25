import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStotram, listStotrams } from "@/lib/stotrams";
import { breadcrumbs, stotramPath, verseIncipit, versePath } from "@/lib/seo";
import { Reader } from "@/components/reader/Reader";
import { publicSources, publicVerse } from "@/lib/public";
import { WordGlossary } from "@/components/WordGlossary";
import { JsonLd } from "@/components/JsonLd";
import { HeaderPill, StotramHeader } from "@/components/StotramHeader";

export function generateStaticParams() {
  return listStotrams().flatMap((s) => s.verses.map((v) => ({ id: s.id, n: String(v.number) })));
}

// Pages are fully prerendered (ensureStatic = "navigation") and their content depends on
// params. Allow navigations to block on that static payload instead of streaming a
// fallback, so the prerendered HTML keeps the text inline (SEO; see CLAUDE.md).
export const instant = false;

async function resolve(params: PageProps<"/stotram/[id]/verse/[n]">["params"]) {
  const { id, n } = await params;
  const s = getStotram(id);
  const index = s?.verses.findIndex((v) => String(v.number) === n) ?? -1;
  if (!s || index < 0) return null;
  return { s, verse: s.verses[index], prev: s.verses[index - 1], next: s.verses[index + 1] };
}

export async function generateMetadata({ params }: PageProps<"/stotram/[id]/verse/[n]">): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const incipit = verseIncipit(r.verse);
  return {
    title: `${r.s.title.en} Verse ${r.verse.number} Meaning: ${incipit.iast}`,
    description: `${incipit.sa}: word-by-word meaning of verse ${r.verse.number} of ${r.s.title.en} in English and Hindi. ${r.verse.translations.en.bhavartha ?? ""}`.trim(),
    alternates: { canonical: versePath(r.s, r.verse) },
  };
}

export default async function VersePage({ params }: PageProps<"/stotram/[id]/verse/[n]">) {
  const r = await resolve(params);
  if (!r) notFound();
  const { s, verse, prev, next } = r;
  const incipit = verseIncipit(verse);

  return (
    <main>
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          [s.title.en, stotramPath(s)],
          [`Verse ${verse.number}`, versePath(s, verse)],
        ])}
      />
      <StotramHeader
        kicker={`${s.title.en} · verse ${verse.number} of ${s.verses.length}`}
        sa={incipit.sa}
        title={`${s.title.en}, verse ${verse.number}: meaning`}
        byline={incipit.iast}
      >
        <nav aria-label="Breadcrumb" className="mt-6 flex flex-wrap gap-2 text-sm">
          <HeaderPill href={stotramPath(s)}>← Full stotram</HeaderPill>
        </nav>
      </StotramHeader>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reader verses={[publicVerse(verse, s)]} concepts={s.concepts} sources={publicSources(s)} linkBase={stotramPath(s)} />

        <nav aria-label="Verse navigation" className="mt-16 flex justify-between gap-4 border-t border-line pt-6 font-semibold">
          {prev ? (
            <Link href={versePath(s, prev)} className="text-ink-muted hover:text-brand">
              ← Verse {prev.number}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={versePath(s, next)} className="text-ink-muted hover:text-brand">
              Verse {next.number} →
            </Link>
          )}
        </nav>

        <div className="mt-16">
          <WordGlossary verses={[verse]} />
        </div>
      </div>
    </main>
  );
}
