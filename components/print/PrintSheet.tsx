"use client";

import Link from "next/link";
import type { Lang } from "@/lib/schema";
import { usePreference } from "@/components/reader/usePreference";

const LANGS: readonly Lang[] = ["en", "hi"];

// Wraps the server-rendered print sheet. Both languages and the IAST line are always in the HTML;
// the toolbar only flips data attributes that CSS uses to hide one or the other. Shares the
// reader's saved preferences, and is itself hidden when printing.
export function PrintSheet({ backHref, children }: { backHref: string; children: React.ReactNode }) {
  const [lang, setLang] = usePreference<Lang>("stotram:lang", "en", LANGS);
  const [iast, setIast] = usePreference<"on" | "off">("stotram:iast", "off", ["on", "off"]);

  return (
    <div data-lang={lang} data-iast={iast} className="group/sheet">
      <div className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur print:hidden">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Link href={backHref} className="text-sm font-semibold text-ink-muted hover:text-ink">
            ← Back
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-sm">
            <div role="group" aria-label="Meaning language" className="flex rounded-full bg-bg-raised p-0.5">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                    lang === l ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
                  } ${l === "hi" ? "font-hindi" : ""}`}
                >
                  {l === "en" ? "English" : "हिन्दी"}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={iast === "on"}
              onClick={() => setIast(iast === "on" ? "off" : "on")}
              className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                iast === "on" ? "bg-ink text-bg" : "bg-bg-raised text-ink-muted hover:text-ink"
              }`}
            >
              Roman script
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-brand px-4 py-1 font-bold text-white hover:opacity-90"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
