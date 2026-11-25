import type { Segment, Verse } from "./schema";

// Puts each translation line under the source line most of its words come from (ties: the earlier line).
// Lines that follow the source order land one-to-one; a stray line still sits next to its words.
// Shared by the reader and the print view.
export function alignToLines(verse: Verse, lines: Segment[][]) {
  const lineOf = new Map<string, number>();
  verse.lines.forEach((l, li) => l.words.forEach((w) => lineOf.set(w.id, li)));
  const rows: (Segment & { id: string })[][] = verse.lines.map(() => []);
  lines.forEach((segs, ti) => {
    const counts = new Map<number, number>();
    for (const r of segs.flatMap((s) => s.refs)) {
      const li = lineOf.get(r);
      if (li !== undefined) counts.set(li, (counts.get(li) ?? 0) + 1);
    }
    const best = [...counts].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? Math.min(ti, rows.length - 1);
    rows[best].push(...segs.map((s, si) => ({ ...s, id: `${ti}-${si}` })));
  });
  return rows;
}
