#!/usr/bin/env node
// Exports the Zod schema (lib/schema.ts, the single source of truth) as JSON Schema for the
// Python checks in checks/. Run after any schema change: npm run schema
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { StotramSchema } from "../lib/schema.ts";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "checks", "schema.json");
writeFileSync(out, JSON.stringify(z.toJSONSchema(StotramSchema, { io: "input" }), null, 2) + "\n");
console.log(`wrote ${out}`);
