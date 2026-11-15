import { defineConfig } from "astro/config";
import type { AstroIntegration } from "astro";
import sitemap from "@astrojs/sitemap";
import { SITE, isSet } from "./src/config";
import { satteri } from "@astrojs/markdown-satteri";
import { imageSize } from "./src/lib/image-size";

/** Warn once per build while placeholder values are still in src/config.ts. */
const configCheck = (): AstroIntegration => ({
  name: "nnt:config-check",
  hooks: {
    "astro:build:start": ({ logger }) => {
      if (!isSet(SITE.buttondownUsername)) {
        logger.warn("SITE.buttondownUsername is still TODO: the signup form will not work until it is set.");
      }
      if (!isSet(SITE.xHandle)) {
        logger.warn("SITE.xHandle is still TODO: the X link and twitter:site tag are left out until it is set.");
      }
    },
  },
});

// Static site. Pages build to flat files (`about.html`) and Vercel serves them
// at clean URLs (`/about`) via `cleanUrls` in vercel.json.
export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  // /thanks is only reached after signing up, so it stays out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith("/thanks") }), configCheck()],
  markdown: {
    // A light theme whose token colors all pass 4.5:1 on a white code card.
    shikiConfig: { theme: "github-light-high-contrast" },
    // Writes each post image's real width and height into the page, so text doesn't jump as images load.
    processor: satteri({ hastPlugins: [imageSize] }),
  },
});
