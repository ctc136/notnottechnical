import { defineConfig } from "astro/config";
import { SITE } from "./src/config";

// Static site. Pages build to flat files (`about.html`) and Vercel serves them
// at clean URLs (`/about`) via `cleanUrls` in vercel.json.
export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  markdown: {
    // A light theme whose token colors all pass 4.5:1 on a white code card.
    shikiConfig: { theme: "github-light-high-contrast" },
  },
});
