import type { ReactNode } from "react";

// Tiny renderer for the inline markdown allowed in source files (docs/DATA_FORMAT.md "Rich text"):
// paragraphs, "> " blockquotes, *italic*, **bold**, [text](target). No raw HTML, ever.
// Targets: #<verse>-<annotation>, #faq-<id>, concept:<id>, source:<id>, https://…
// `linkBase` prefixes in-page anchors so verse pages can link back to the full stotram page.

type Props = { text: string; linkBase?: string; className?: string };

export function RichText({ text, linkBase = "", className }: Props) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={className}>
      {blocks.map((block, i) =>
        block.startsWith(">") ? (
          <blockquote key={i} className="my-3 border-l-2 border-brand pl-4 italic text-ink-muted">
            {inline(block.replace(/^>\s?/gm, ""), linkBase)}
          </blockquote>
        ) : (
          <p key={i} className="my-3 first:mt-0 last:mb-0">
            {inline(block, linkBase)}
          </p>
        ),
      )}
    </div>
  );
}

export function resolveHref(target: string, linkBase = ""): string {
  if (target.startsWith("https://")) return target;
  if (target.startsWith("#")) return `${linkBase}${target}`;
  const [kind, id] = target.split(":");
  return `${linkBase}#${kind}-${id}`;
}

const TOKEN = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(text: string, linkBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1] !== undefined) out.push(<strong key={key}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<em key={key}>{m[2]}</em>);
    else {
      const href = resolveHref(m[4], linkBase);
      const external = href.startsWith("https://");
      out.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium underline decoration-brand decoration-2 underline-offset-2 hover:text-brand"
        >
          {inline(m[3], linkBase)}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
