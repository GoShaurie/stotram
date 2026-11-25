import Link from "next/link";
import { listStotrams } from "@/lib/stotrams";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  const stotrams = listStotrams();

  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url }} />

      <section className="deity-band text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="font-sanskrit text-xl text-white/60" lang="sa">
            निराकारमोङ्कारमूलं तुरीयम्
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.6rem,8vw,6rem)] font-black leading-[0.95] tracking-tight">
            Understand what you chant.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            Stotrams and bhajans, annotated line by line and explained word by word: the story behind every image, and
            the split, root and grammar of every word. In English and हिन्दी.
          </p>
        </div>
      </section>

      <section id="library" aria-labelledby="library-title" className="mx-auto w-full max-w-6xl scroll-mt-4 px-4 py-16 sm:px-6">
        <h2 id="library-title" className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-ink-faint">
          Library
        </h2>
        <ol className="divide-y divide-line border-y border-line">
          {stotrams.map((s, i) => {
            const annotations = s.verses.reduce((n, v) => n + (v.annotations?.length ?? 0), 0);
            return (
              <li key={s.id}>
                <Link
                  href={`/stotram/${s.id}`}
                  className="group grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-4 py-5 transition-colors hover:bg-bg-raised sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:px-3"
                >
                  <span className="text-2xl font-black text-ink-faint">{i + 1}</span>
                  <span>
                    <span className="block text-xl font-bold group-hover:text-brand">
                      {s.title.en}{" "}
                      <span className="font-sanskrit font-normal text-ink-muted" lang="sa">
                        {s.title.sa}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-ink-muted">{s.summary.en}</span>
                  </span>
                  <span className="col-start-2 text-xs font-semibold uppercase tracking-wider text-ink-faint sm:col-start-3">
                    {s.deities.join(" · ")} · {s.verses.length} {s.verses.length === 1 ? "verse" : "verses"} ·{" "}
                    {annotations} notes
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
