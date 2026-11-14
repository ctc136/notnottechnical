import { defineConfig } from "astro/config";
import { SITE } from "./src/config";

// Static site. Pages build to flat files (`about.html`) and Vercel serves them
// at clean URLs (`/about`) via `cleanUrls` in vercel.json.
export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
});
