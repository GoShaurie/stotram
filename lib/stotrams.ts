// Registry of all stotram source files. Static JSON imports keep every page
// prerendered; to add a stotram, drop its file in data/stotrams/ and list it here.
import { StotramSchema, type Stotram } from "./schema";
import shivaTandava from "@/data/stotrams/shiva-tandava-stotram.json";
import shivaPanchakshara from "@/data/stotrams/shiva-panchakshara-stotram.json";
import vedasaraShivaStava from "@/data/stotrams/vedasara-shiva-stava.json";
import kalabhairavaAshtakam from "@/data/stotrams/kalabhairava-ashtakam.json";
import rudrashtakam from "@/data/stotrams/rudrashtakam.json";

const SOURCES: unknown[] = [shivaTandava, shivaPanchakshara, vedasaraShivaStava, kalabhairavaAshtakam, rudrashtakam];

const stotrams: Stotram[] = SOURCES.map((raw) => {
  const parsed = StotramSchema.safeParse(raw);
  if (!parsed.success) {
    const id = (raw as { id?: string }).id ?? "unknown";
    throw new Error(`Invalid stotram source '${id}':\n${parsed.error.message}`);
  }
  // Verses still being generated (a skeleton with no translation yet) are not shown.
  return { ...parsed.data, verses: parsed.data.verses.filter((v) => v.translations.en.lines.length > 0) };
});

export function listStotrams(): Stotram[] {
  return stotrams;
}

export function getStotram(id: string): Stotram | undefined {
  return stotrams.find((s) => s.id === id);
}
