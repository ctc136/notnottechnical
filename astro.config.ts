import { defineConfig } from "astro/config";
import type { AstroIntegration } from "astro";
import sitemap from "@astrojs/sitemap";
import { SITE, isSet } from "./src/config";

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
  integrations: [sitemap(), configCheck()],
  markdown: {
    // A light theme whose token colors all pass 4.5:1 on a white code card.
    shikiConfig: { theme: "github-light-high-contrast" },
  },
});
