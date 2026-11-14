import { getCollection, type CollectionEntry } from "astro:content";

export type LogEntry = CollectionEntry<"log">;
export type Scoreboard = LogEntry["data"]["scoreboard"];

/**
 * Every entry a visitor is allowed to see, newest first.
 * Drafts show up in `astro dev` only; production builds never include them.
 */
export async function getEntries(): Promise<LogEntry[]> {
  const entries = await getCollection("log", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return entries.sort(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() ||
      b.data.entry - a.data.entry,
  );
}

/** Site-wide scoreboard: the sum of every visible entry's numbers. */
export function totalScoreboard(entries: LogEntry[]): Scoreboard {
  const total: Scoreboard = { hours: 0, shipped: 0, broken: 0, whatDoesThatMean: 0 };
  for (const { data } of entries) {
    total.hours += data.scoreboard.hours;
    total.shipped += data.scoreboard.shipped;
    total.broken += data.scoreboard.broken;
    total.whatDoesThatMean += data.scoreboard.whatDoesThatMean;
  }
  return total;
}

/** 3 -> "Entry #003" */
export function entryLabel(entry: number): string {
  return `Entry #${String(entry).padStart(3, "0")}`;
}

/** Dates in frontmatter are plain days, so format them in UTC to avoid off-by-one. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Trim float noise from summed hours: 12.500000001 -> "12.5", 12 -> "12". */
export function formatNumber(value: number): string {
  return String(Math.round(value * 10) / 10);
}
