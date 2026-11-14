# notnottechnical.com

A public build log by Chris, a dude trying hard to go from not technical to not not technical.
Every other Sunday: what I built with AI, what broke, and what I learned fixing it.

This repo is the whole site. It is a small static site built with [Astro](https://astro.build):
posts are markdown files, styling is plain CSS, and it deploys to Vercel on every push to `main`.
The full spec it was built from is in [`build-spec/SPEC.md`](build-spec/SPEC.md).

## Run it locally

You need Node.js 22.23 or newer.

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>. Draft posts show up here, so you can preview before publishing.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with live reload. Drafts are visible. |
| `npm run build` | Type-checks, then builds the production site into `dist/`. Drafts are left out. |
| `npm run preview` | Serves the built `dist/` folder, exactly as production will see it. |
| `npm run check` | Type-check only. |
| `npm run favicons` | Regenerates the favicon files in `public/`. |

## Write a post

1. Copy `src/content/log/_template.md` to `src/content/log/NNN-short-slug.md`
   (example: `004-my-first-api.md`). The filename becomes the URL: `/log/004-my-first-api`.
2. Fill in the frontmatter at the top and write the post in markdown below it.
3. Set `draft: false` and push. That's it.

### Frontmatter

Every field is checked at build time. A typo or a missing required field fails the build with a
message that names the file and the field.

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `date` | yes | Publish date, `YYYY-MM-DD` |
| `entry` | yes | Entry number. `3` shows as "Entry #003" |
| `summary` | yes | One line. Used on cards, the meta description and the share image |
| `tags` | yes | One or more of `web`, `hardware`, `ai-tools`, `fails`, `meta` |
| `draft` | no | Defaults to `false`. Drafts only appear in `npm run dev` |
| `scoreboard.hours` | no | Hours spent on this entry's build. Defaults to 0 |
| `scoreboard.shipped` | no | Things shipped. Defaults to 0 |
| `scoreboard.broken` | no | Things broken. Defaults to 0 |
| `scoreboard.whatDoesThatMean` | no | Times I asked "wait, what does that mean?" Defaults to 0 |

To add a new tag, add it to `TAGS` in `src/config.ts` first.

### Writing tips

- **Images:** put the file in `public/images/` and reference it as `![alt text](/images/name.png)`.
- **Captions:** add a line of `*italic text*` directly under an image.
- **Blockquotes** (`> like this`) render as a sticky note.
- **Code blocks** get a white card and scroll sideways rather than wrapping.

### The scoreboard

The scoreboard on the home page is the sum of the `scoreboard` values from every published post.
It is computed at build time, so there are no totals to edit by hand. Each post also shows its own
numbers under "This entry's damage".

## Publishing checklist

1. Copy `_template.md` to `NNN-slug.md`, write the post, fill in the scoreboard.
2. Preview with `npm run dev`.
3. Set `draft: false`, commit and push to `main`; Vercel deploys.
4. In Buttondown, paste the post (or a teaser plus link) and send.
5. Share on X.

## One-time setup

Everything site-wide lives in `src/config.ts`: the site name and URL, the X handle, the Buttondown
username and the list of allowed tags. If a value there is ever left as `TODO`, the build prints a
warning.

The signup forms post to Buttondown's embed endpoint for `buttondownUsername`. If the form ever
stops working, compare `src/components/Signup.astro` with the markup in Buttondown under
Settings > Embedding. The field names (`email`, plus a hidden `embed=1`) should match.

Hosting setup (done by hand, once):

1. Create the public GitHub repo and push `main`.
2. Import the repo into Vercel. It detects Astro; no settings need changing.
3. In Vercel, enable Web Analytics for the project, and add `notnottechnical.com` and `www`
   (redirecting `www` to the bare domain). Add the DNS records Vercel shows at the registrar.

## How it's put together

```
src/
  config.ts            Site-wide values (name, URL, handles, allowed tags)
  content.config.ts    The post frontmatter schema
  content/log/         The posts, one markdown file each (+ _template.md)
  layouts/Base.astro   <head>, meta tags, nav, footer, analytics
  components/          Logo, Nav, Footer, Signup, EntryCard, Scoreboard, FormQuestion, AboutCard, Avatar
  pages/               One file per route (+ rss.xml, robots.txt and og/ image endpoints)
  lib/log.ts           Loads posts, filters drafts, adds up the scoreboard
  lib/og.ts            Draws the share images
  styles/              Design tokens and global styles, post typography
public/                Favicons and images, served as-is
scripts/               The favicon generator
```

- **Styling** is plain CSS with custom properties. The design tokens are at the top of
  `src/styles/global.css`.
- **Fonts** (Space Grotesk, Inter, Kalam) are self-hosted through `@fontsource`.
- **Share images** (1200x630) are drawn at build time for the home page and every post, using
  Satori and resvg.
- **JavaScript:** the only client-side script is Vercel Analytics. Everything else is HTML and CSS.

## Lighthouse

Targets (mobile): Performance 95+, Accessibility 100, Best Practices 95+, SEO 100. To check:

```bash
npm run build
npm run preview
npx lighthouse http://localhost:4321/ --view
```

Run locally, Best Practices reports one console error: the Vercel Analytics script
(`/_vercel/insights/script.js`) only exists on Vercel, so it 404s on your machine. That is expected.

## Decisions made where the spec left room

- **Post URLs use the filename**, number included: `/log/003-penguins-goal-robot`.
- **URLs have no trailing slash or `.html`.** Astro builds flat files and `vercel.json` turns on
  clean URLs, so canonicals, the sitemap and the feed all agree.
- **Drafts are a dev-only thing.** `npm run dev` shows them (and counts them in the scoreboard so
  the layout can be reviewed); production builds drop them from pages, RSS, the sitemap and share
  images. With no published posts, the home page and `/log` show "Entry #001 drops soon."
- **"Subscribe" in the nav** jumps to the signup box on pages that have one (home, posts, about)
  and to the home page's box everywhere else.
- **Card labels:** home page cards show the first tag ("Entry #003 · hardware"), matching the
  design. Cards on `/log` show the date there instead, with every tag as a chip below.
- **The avatar** is `public/images/chris-8bit.png`. If that file is ever missing, a plain
  placeholder square is shown instead of a broken image.
- **The Buttondown form** leaves out the optional "Powered by Buttondown" link from their snippet.
- **`fflate` is pinned** to a patched version in `package.json` overrides. It is a build-time
  dependency of the share-image library.
- **The about page copy** is a first draft built from the home page blurb. Edit it in
  `src/pages/about.astro`.

## License

Code is [MIT](LICENSE). Post content (`src/content/`) and images (`public/images/`) are
© Chris, all rights reserved.
