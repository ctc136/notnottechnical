import { readFile } from "node:fs/promises";
import path from "node:path";
import { imageMetadata } from "astro/assets/utils";
import { defineHastPlugin } from "satteri";

/**
 * Markdown images that live in public/ get their real width and height written
 * into the HTML, plus lazy loading. Without this the text jumps down the page
 * as each screenshot loads.
 */
export const imageSize = defineHastPlugin({
  name: "nnt-image-size",
  element: {
    filter: ["img"],
    async visit(node, ctx) {
      const src = node.properties?.src;
      if (typeof src !== "string" || !src.startsWith("/") || src.startsWith("//")) return;
      try {
        const file = path.join(process.cwd(), "public", decodeURIComponent(src));
        const { width, height } = await imageMetadata(await readFile(file), src);
        ctx.setProperty(node, "width", width);
        ctx.setProperty(node, "height", height);
        ctx.setProperty(node, "loading", "lazy");
        ctx.setProperty(node, "decoding", "async");
      } catch {
        // Missing or unreadable file: leave the image tag as written.
      }
    },
  },
});
