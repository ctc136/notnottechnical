# notnottechnical.com — Build Spec (v1)

> A public build log by Chris, "a dude trying hard to go from not technical to not not technical."
> This spec is the source of truth for v1. Read it fully before writing code. When something here is
> ambiguous, pick the simplest option that satisfies the acceptance criteria and note it in the README.

Design reference (Option B, "Graph-paper notebook"): https://claude.ai/artifact/GkGwrbenqU98b1rdhLhEnG

---

## 1. Goals and non-goals

**Goals**
- A fast, static personal site where Chris publishes a build-log entry every other Sunday.
- Writing a post = adding one markdown file and pushing to GitHub. Nothing else.
- Every page invites readers to subscribe to the email list (Buttondown).
- The site itself is portfolio proof: clean code in a public repo, good SEO, accessible, quick.

**Non-goals for v1** (do not build these)
- Comments, search, user accounts, a CMS or admin screens
- Dark mode, theme toggles, animations beyond tiny hover effects
- Automated email sending (Chris sends each newsletter manually from Buttondown for now)
- A custom newsletter backend (possible v2 project and blog post)

---

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Astro (current stable), static output |
| Content | Astro content collections, markdown, frontmatter validated with zod |
| Styling | Plain CSS with CSS custom properties (no Tailwind, no CSS framework) |
| Hosting | Vercel, deploys on every push to `main` |
| Email | Buttondown embed form (no API calls from the site in v1) |
| Analytics | Vercel Analytics |
| Extras | `@astrojs/rss`, `@astrojs/sitemap`, build-time Open Graph images |
| Repo | Public GitHub repo, `github.com/ctc136/notnottechnical` (rename if Chris prefers) |

Client-side JavaScript should be limited to Vercel Analytics. Everything else ships as HTML and CSS.

---

## 3. Site config

Create `src/config.ts` as the single place for site-wide values:

```ts
export const SITE = {
  name: "Not Not Technical",
  url: "https://notnottechnical.com",
  author: "Chris",
  tagline: "A dude trying hard to go from not technical to not not technical.",
  description:
    "A public build log. Every other Sunday: what I built with AI, what broke, and what I learned fixing it.",
  location: "Pittsburgh",
  xHandle: "TODO",               // Chris fills in
  githubRepo: "https://github.com/ctc136/notnottechnical",
  buttondownUsername: "TODO",    // Chris fills in after creating the account
  cadence: "every other Sunday",
};
```

**Privacy rules:** the site uses the first name "Chris" only. Never add a surname, employer name or
employer-identifying details anywhere: copy, metadata, structured data or image alt text.

---

## 4. Content model

Posts live in `src/content/log/` as `NNN-short-slug.md` (example: `003-penguins-goal-robot.md`).

Frontmatter schema (zod, enforced at build):

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `date` | date | yes | Publish date |
| `entry` | integer | yes | Entry number, shown as "Entry #003" |
| `summary` | string | yes | One line; used on cards, meta description and OG image |
| `tags` | enum[] | yes | One or more of `web`, `hardware`, `ai-tools`, `fails`, `meta` |
| `draft` | boolean | no, default `false` | Drafts render in `astro dev`, are excluded from production builds, RSS and sitemap |
| `scoreboard.hours` | number | no, default 0 | Hours spent on this entry's build |
| `scoreboard.shipped` | integer | no, default 0 | Things shipped |
| `scoreboard.broken` | integer | no, default 0 | Things broken |
| `scoreboard.whatDoesThatMean` | integer | no, default 0 | Times Chris asked "wait, what does that mean?" |

**Scoreboard logic:** the site-wide scoreboard is the **sum of `scoreboard` values across all published
(non-draft) posts**, computed at build time. Chris never edits totals by hand. Each post page also shows
that entry's own numbers at the bottom ("This entry's damage").

**Seed content:** create three posts with `draft: true` so layouts can be built and reviewed with real-looking content:
- `001` "Hi. I'm not technical. Yet." (tag: meta)
- `002` "This website is my homework" (tag: web)
- `003` "I built a robot that dances when the Penguins score" (tag: hardware)

Give each a few paragraphs of obvious placeholder body text marked `TODO: Chris writes this`, one code block,
one image placeholder and sample scoreboard values. Chris replaces these with the real posts.

---

## 5. Pages and routes

| Route | Content |
|---|---|
| `/` | Nav · hero (eyebrow, headline, intro) + sticky-note signup · 3 latest entries as index cards · scoreboard · about teaser card · footer |
| `/log` | All published entries, newest first, as index cards grouped by year. Tag chips on each card. |
| `/log/[slug]` | Entry #, date, tags, title, summary, body · "This entry's damage" scoreboard · signup box · previous/next entry links |
| `/about` | Longer version of the about card, with the 8-bit avatar and a signup box |
| `/404` | On-brand: "This page is not not missing." Link home. |
| `/rss.xml` | Full-content RSS feed of published entries |
| `/sitemap-index.xml` | Via `@astrojs/sitemap` |

Nav links: The log · About · Subscribe (scrolls to or links to the nearest signup box).
Footer: © notnottechnical.com · RSS · X · "Source on GitHub" (links to the public repo) · Subscribe.

---

## 6. Design system (Option B)

Match the design reference closely. Tokens:

```css
:root {
  --paper: #fbfbf8;
  --grid-line: #e4ecf6;      /* 1px lines, 28px squares, on the page background */
  --text: #1c1c1c;
  --text-muted: #3d3d3d;
  --text-soft: #4a4a4a;
  --ink: #1f3a93;            /* primary accent: links, buttons, handwritten "not" */
  --ink-hover: #14286b;
  --red-pen: #b42318;        /* strikethroughs, entry labels, annotations */
  --highlighter: #ffe066;    /* marker highlight behind key words */
  --sticky-yellow: #fff8c5;
  --sticky-green: #dff3e4;
  --sticky-pink: #fde2e1;
  --sticky-blue: #e3ebfa;
  --card: #ffffff;
  --border: 2px solid #1c1c1c;
  --card-shadow: 5px 5px 0 #1c1c1c;
}
```

**Fonts** (Google Fonts, self-host via `@fontsource` packages if easy):
- Space Grotesk 500/700: headings and the logo
- Inter 400/500/600: body and UI
- Kalam 400/700: handwritten annotations only (eyebrows, entry labels, sticky-note numbers, the inserted "not")

**Signature elements**
- **Logo:** "not *not* technical": the middle "not" in Kalam, ink blue, as if handwritten in.
- **Hero headline:** "Going from ~~not technical~~ to **not not technical.**" Red-pen strikethrough
  (4px, `--red-pen`); highlighter band behind the last phrase.
- **Sticky-note signup:** yellow, rotated about 1.5°, soft drop shadow. Reused component (see §7).
- **Index cards:** white, `--border`, `--card-shadow`, Kalam red entry label ("Entry #003 · hardware"),
  Space Grotesk title, Inter summary. Hover: shift shadow 2px.
- **Scoreboard:** four sticky notes in yellow, green, pink and blue, each slightly rotated (−2°, 1.5°, −1°, 2°),
  big Kalam number, small label. "Things broken" number in `--red-pen`.
- **About card:** white bordered card with the 8-bit avatar.

**Avatar:** Chris will supply an 8-bit portrait at `public/images/chris-8bit.png`. Render it with
`image-rendering: pixelated`, square, with the card border style. Alt text: "8-bit portrait of Chris".
Until the file exists, use a neutral placeholder square.

**Post body typography:** max width about 68ch, 18px Inter, 1.7 line height. Headings in Space Grotesk.
Code blocks: white card with border, monospace, horizontal scroll. Inline code with a light highlighter
background. Images full width with optional Kalam caption. Blockquotes styled as a sticky note.

**Responsive:** must work from 360px wide upward. Below 640px: remove all rotations, stack hero and signup,
cards go to one column, scoreboard to a 2×2 grid. Respect `prefers-reduced-motion`.

---

## 7. Email signup (Buttondown)

- One reusable `Signup.astro` component with `variant` = `sticky` (hero) | `inline` (post/about bottom).
- A plain HTML `<form>` that posts to Buttondown's embed-subscribe endpoint for `SITE.buttondownUsername`.
  Use the exact form markup from Buttondown's "embed form" settings so field names match.
- A visible `<label>` for the email field, `type="email"`, `required`, a button reading "Count me in".
- Fine print: "One email every other Sunday. Unsubscribe anytime."
- No client JS. After submitting, Buttondown's own confirmation page is acceptable for v1.

---

## 8. SEO, sharing and feeds

- Per-page `<title>` ("Post title · Not Not Technical") and meta description (the post summary).
- Canonical URLs, Open Graph and Twitter card tags on every page.
- **Build-time OG images (1200×630 PNG)** for every post and the home page, in brand style: graph-paper
  background, logo, Kalam entry label, Space Grotesk title. Use Satori/resvg or an Astro OG library; pick
  whichever is simplest and works on Vercel's static build.
- `robots.txt` that allows everything and points to the sitemap.
- RSS autodiscovery `<link>` in the head.
- Favicon: a small ink-blue handwritten "nn" or a pencil mark on paper, as SVG plus PNG fallbacks.

---

## 9. Accessibility and performance

- Text contrast at least 4.5:1 (the tokens above pass; keep it that way).
- Visible focus styles (2px ink outline, offset 2px) on every interactive element.
- Semantic HTML: one `<h1>` per page, landmark elements, real links and buttons.
- Decorative graph paper and rotations must not hurt readability.
- Lighthouse targets on mobile: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100.

---

## 10. Repo and workflow

- Public repo with a `README.md` covering: what this is, how to run locally, how to write a post
  (copy a template, set `draft: false`, push), and the publishing checklist below.
- Add `src/content/log/_template.md` with every frontmatter field filled with example values and `draft: true`.
- License: code under MIT (`LICENSE`); add a note that post content and images are © Chris, all rights reserved.
- Keep commits small and descriptive; this repo is part of the public story.

**Publishing checklist (README)**
1. Copy `_template.md` to `NNN-slug.md`, write the post, fill in the scoreboard.
2. Preview with `npm run dev`.
3. Set `draft: false`, commit and push to `main`; Vercel deploys.
4. In Buttondown, paste the post (or a teaser plus link) and send.
5. Share on X.

---

## 11. Setup Chris does by hand (not Claude Code)

1. Create the GitHub repo `ctc136/notnottechnical` (public).
2. Import the repo into Vercel; confirm the preview URL works.
3. In Vercel, add `notnottechnical.com` and `www`; in **Porkbun** DNS, add the records Vercel shows. Set
   `www` to redirect to the bare domain.
4. Create the Buttondown account, set `buttondownUsername` in `src/config.ts`, and copy its embed form markup.
5. Optional: set up a custom sending domain in Buttondown (DNS records in Porkbun) so emails come from
   an @notnottechnical.com address. If the plan doesn't include it, launch with Buttondown's default sender.
6. Add the 8-bit avatar to `public/images/chris-8bit.png` and the X handle to config.

---

## 12. Milestones and acceptance criteria

**M1: Skeleton** — Astro project, config, content collection with schema, the three draft seed posts,
base layout, nav and footer. `npm run build` passes with zero errors and zero type errors.

**M2: Design** — All pages built to the Option B design: tokens, fonts, logo, hero, signup component,
index cards, scoreboard (computed), about card, post typography, 404. Works at 360px, 768px and 1280px.

**M3: Plumbing** — RSS, sitemap, robots, meta and OG tags, build-time OG images, favicon, Vercel Analytics,
Buttondown form wired to config.

**M4: Ship** — README and template done, Lighthouse targets met, deployed to Vercel and live on
notnottechnical.com with the seed posts still drafts (so production shows an empty-state message:
"Entry #001 drops soon. Subscribe so you don't miss it.").

**Done means**
- [ ] Adding a markdown file and pushing publishes a post, with no other steps
- [ ] Drafts never appear in production pages, RSS or sitemap
- [ ] Scoreboard totals update automatically from post frontmatter
- [ ] Signup form appears on home, every post and about, and submits to Buttondown
- [ ] Every post has a unique OG image that renders correctly when the link is shared
- [ ] No surname or employer details anywhere in the build output
- [ ] Build has zero errors; Lighthouse targets met
