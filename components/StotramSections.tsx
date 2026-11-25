import type { Stotram } from "@/lib/schema";
import { PAGE } from "@/lib/labels";
import { RichText } from "@/lib/markdown";

// Server-rendered companions to the reader, modelled on a Genius song page:
// About, Q&A, Credits, Themes and Sources. All real HTML, crawlable without JS.
// Anchors here (#faq-…, #concept-…, #source-…) are the targets of links inside annotations.

type Props = { s: Stotram; linkBase?: string };

export function About({ s, linkBase = "" }: Props) {
  if (!s.about) return null;
  return (
    <Block id="about" title={PAGE.about}>
      <RichText text={s.about.en} linkBase={linkBase} className="max-w-2xl text-lg leading-relaxed" />
      <details className="mt-4 max-w-2xl">
        <summary className="cursor-pointer text-sm font-semibold text-ink-muted hover:text-ink">हिन्दी में पढ़ें</summary>
        <div lang="hi">
          <RichText text={s.about.hi} linkBase={linkBase} className="mt-3 font-hindi text-lg leading-relaxed" />
        </div>
      </details>
    </Block>
  );
}

export function Faq({ s, linkBase = "" }: Props) {
  if (!s.faq?.length) return null;
  return (
    <Block id="faq" title={PAGE.faq}>
      <div className="flex max-w-2xl flex-col divide-y divide-line border-y border-line">
        {s.faq.map((f) => (
          <details key={f.id} id={`faq-${f.id}`} className="group scroll-mt-24 py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold">
              {f.q.en}
              <span className="mt-1 text-ink-faint transition-transform group-open:rotate-45">+</span>
            </summary>
            <RichText text={f.a.en} linkBase={linkBase} className="mt-3 leading-relaxed text-ink-muted" />
          </details>
        ))}
      </div>
    </Block>
  );
}

export function Credits({ s }: Props) {
  if (!s.credits?.length && !s.tags?.length) return null;
  return (
    <Block id="credits" title={PAGE.credits}>
      <dl className="grid max-w-3xl gap-x-10 gap-y-5 sm:grid-cols-2">
        {s.credits?.map((c, i) => (
          <div key={i}>
            <dt className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">{PAGE.role[c.role]}</dt>
            <dd className="mt-1 font-semibold">{c.value.en}</dd>
            {c.note && <RichText text={c.note.en} className="mt-1 text-sm leading-relaxed text-ink-muted" />}
          </div>
        ))}
      </dl>
      {s.tags && s.tags.length > 0 && (
        <ul aria-label={PAGE.tags} className="mt-8 flex flex-wrap gap-2">
          {s.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-bg-raised px-3 py-1 text-sm text-ink-muted">
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </Block>
  );
}

export function Themes({ s }: Props) {
  const concepts = Object.entries(s.concepts ?? {});
  if (!concepts.length) return null;
  // Only ancient texts are cited on the site; a story citation or echo from anything else stays in the data.
  const ancient = new Map(s.sources.filter((src) => src.ancient).map((src) => [src.id, src.name]));
  return (
    <Block id="themes" title={PAGE.themes}>
      <nav aria-label={PAGE.themes} className="-mt-2 mb-10 flex flex-wrap gap-2">
        {concepts.map(([id, c]) => (
          <a
            key={id}
            href={`#concept-${id}`}
            className="rounded-full border border-line px-3 py-1 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
          >
            {c.name.en}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-6">
        {concepts.map(([id, c], n) => {
          const told = (c.story_citations ?? []).filter((cit) => ancient.has(cit.source));
          const echoes = (c.echoes ?? []).filter((e) => ancient.has(e.source));
          const hasBody = Boolean(c.story) || echoes.length > 0;
          // Two or more lines fill a column beside the story; a single line becomes a pull-quote at the top right.
          const side = echoes.length >= 2;
          const pull = echoes.length === 1;
          const echoList = (
            <ul className="flex flex-col divide-y divide-line">
              {echoes.map((e, i) => (
                <li key={i} className="py-4 first:pt-0 last:pb-0">
                  <p lang={e.lang} className="font-sanskrit text-xl leading-snug">
                    {e.text}
                  </p>
                  {e.iast && (
                    <p lang={`${e.lang}-Latn`} className="mt-1 text-xs italic leading-relaxed text-ink-faint">
                      {e.iast}
                    </p>
                  )}
                  <RichText text={e.meaning.en} className="mt-2 text-sm leading-relaxed text-ink-muted" />
                  <p className="mt-2 text-xs font-medium text-ink-faint">
                    —{" "}
                    <a href={`#source-${e.source}`} className="text-ink-muted hover:text-brand">
                      {ancient.get(e.source)}
                    </a>
                    {e.locator && `, ${e.locator}`}
                  </p>
                </li>
              ))}
            </ul>
          );
          return (
            <article
              key={id}
              id={`concept-${id}`}
              aria-labelledby={`concept-${id}-title`}
              className={`scroll-mt-24 grid overflow-hidden rounded-3xl border border-line bg-bg-raised ${
                side ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" : pull ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""
              }`}
            >
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.2em] text-brand">{String(n + 1).padStart(2, "0")}</p>
                <h3 id={`concept-${id}-title`} className="mt-1 text-2xl font-extrabold tracking-tight">
                  {c.name.en}
                  <span className="ml-3 font-hindi text-lg font-normal text-ink-faint">{c.name.hi}</span>
                </h3>
                <RichText
                  text={c.description.en}
                  className={`mt-3 text-lg leading-relaxed text-ink-muted ${side || pull ? "" : "max-w-3xl"}`}
                />

                {c.story && (
                  <section className={`mt-6 ${side || pull ? "" : "max-w-3xl"}`}>
                    <h4 className={LABEL}>{PAGE.story}</h4>
                    <RichText text={c.story.en} className="leading-relaxed" />
                    {told.length > 0 && (
                      <p className="mt-4 text-xs text-ink-faint">
                        {PAGE.toldIn}{" "}
                        {told.map((cit, i) => (
                          <span key={i}>
                            {i > 0 && "; "}
                            <a href={`#source-${cit.source}`} className="font-medium text-ink-muted hover:text-brand">
                              {ancient.get(cit.source)}
                            </a>
                            {cit.locator && `, ${cit.locator}`}
                          </span>
                        ))}
                      </p>
                    )}
                  </section>
                )}

              </div>

              {pull && (
                <div className="px-6 pb-6 sm:px-8 sm:pb-8 lg:pl-0 lg:pt-8">
                  <section className="rounded-2xl border-l-4 border-brand bg-bg p-6">
                    <h4 className={LABEL}>{PAGE.echoes}</h4>
                    {echoList}
                  </section>
                </div>
              )}

              {side && (
                <section className="border-t border-line bg-bg p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <h4 className={LABEL}>{PAGE.echoes}</h4>
                  {echoList}
                </section>
              )}

              {hasBody && (
                <details className="group border-t border-line px-6 py-4 sm:px-8 lg:col-span-full">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-ink-muted hover:text-ink">
                    <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span> हिन्दी में पढ़ें
                  </summary>
                  <div lang="hi" className="mt-4 grid gap-6 font-hindi leading-relaxed lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                    <div>
                      <RichText text={c.description.hi} className="text-ink-muted" />
                      {c.story && <RichText text={c.story.hi} className="mt-4" />}
                    </div>
                    {echoes.length > 0 && (
                      <ul className="flex flex-col gap-3 text-[0.95rem]">
                        {echoes.map((e, i) => (
                          <li key={i}>
                            <span className="block font-sanskrit text-lg">{e.text}</span>
                            <span className="text-ink-muted">{e.meaning.hi.replace(/\*/g, "")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              )}
            </article>
          );
        })}
      </div>
    </Block>
  );
}

const LABEL = "mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ink-faint";

export function Sources({ s }: Props) {
  return (
    <Block id="sources" title={PAGE.sources}>
      <ol className="flex max-w-3xl flex-col gap-2 text-sm">
        {s.sources.filter((src) => src.ancient).map((src) => (
          <li key={src.id} id={`source-${src.id}`} className="scroll-mt-24">
            {src.url ? (
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand">
                {src.name}
              </a>
            ) : (
              <span className="font-semibold">{src.name}</span>
            )}
            <span className="ml-2 text-xs uppercase tracking-wider text-ink-faint">{src.kind}</span>
            {src.note && <p className="text-ink-faint">{src.note}</p>}
          </li>
        ))}
      </ol>
    </Block>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-14">
      <h2 id={`${id}-title`} className="mb-6 text-3xl font-extrabold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}
