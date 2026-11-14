import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { SITE } from "../config";
import { getEntries } from "../lib/log";

/** Feed readers need absolute URLs, so point root-relative links and images at the site. */
function absolutize(html: string, site: string): string {
  return html.replace(/(\s(?:src|href)=")\/(?!\/)/g, `$1${site}/`);
}

// Full-content feed of every published entry.
export const GET: APIRoute = async (context) => {
  const site = (context.site?.href ?? SITE.url).replace(/\/$/, "");
  const entries = await getEntries();

  return rss({
    title: SITE.name,
    description: SITE.description,
    site,
    trailingSlash: false,
    customData: "<language>en-us</language>",
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/log/${entry.id}`,
      categories: entry.data.tags,
      author: SITE.author,
      content: absolutize(entry.rendered?.html ?? "", site),
    })),
  });
};
