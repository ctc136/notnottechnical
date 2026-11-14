import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { TAGS } from "./config";

const count = z.number().int().nonnegative().default(0);

const log = defineCollection({
  // Files starting with "_" (like _template.md) are never loaded.
  loader: glob({ pattern: "[^_]*.md", base: "./src/content/log" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    entry: z.number().int().positive(),
    summary: z.string(),
    tags: z.array(z.enum(TAGS)).min(1),
    draft: z.boolean().default(false),
    scoreboard: z
      .object({
        hours: z.number().nonnegative().default(0),
        shipped: count,
        broken: count,
        whatDoesThatMean: count,
      })
      .default({ hours: 0, shipped: 0, broken: 0, whatDoesThatMean: 0 }),
  }),
});

export const collections = { log };
