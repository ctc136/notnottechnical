import type { APIRoute, GetStaticPaths } from "astro";
import { getEntries, entryLabel, type LogEntry } from "../../lib/log";
import { renderHomeOg, renderPostOg } from "../../lib/og";

// /og/home.png for the home page, plus /og/<post-slug>.png for every visible entry.
export const getStaticPaths = (async () => {
  const entries = await getEntries();
  return [
    { params: { slug: "home" }, props: {} },
    ...entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry?: LogEntry }> = async ({ props }) => {
  const { entry } = props;
  const png = entry
    ? await renderPostOg({
        label: `${entryLabel(entry.data.entry)} · ${entry.data.tags[0]}`,
        title: entry.data.title,
        summary: entry.data.summary,
      })
    : await renderHomeOg();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
  });
};
