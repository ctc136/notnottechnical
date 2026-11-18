# CLAUDE.md

Notes for Claude Code sessions working in this repo. README.md has the full details; this file
covers the rules that matter most.

## What this is

notnottechnical.com: a public build log by Chris, a dude trying hard to go from not technical to
not not technical. Static Astro site, posts in markdown, plain CSS, deployed by Vercel.

## Rules

- **Never push to `main`.** Every push to `main` deploys the live site. Work on a branch and open
  a pull request; Chris reviews and merges.
- **New posts start as drafts.** Set `draft: true` in the frontmatter. Chris flips it to `false`
  when he's ready to publish.
- **Run `npm run build` before opening a PR.** It type-checks and validates every post's
  frontmatter; a failing build means the PR isn't ready.
- **Keep it personal-light.** This repo is public. Don't add employer names, other people's names
  or handles, family details, private URLs, or home-network addresses to anything committed.

## Writing posts

- Copy `src/content/log/_template.md` to `src/content/log/NNN-short-slug.md`.
- Allowed tags live in `TAGS` in `src/config.ts`; add one there before using it.
- Post format: what I built, the tech stack, what broke, and tips or resources for others trying
  it.
- **Write outlines, not finished drafts.** Chris fills them in with his own voice. Tone is light,
  breezy and fun, not serious.
- Images go in `public/images/`, exported at about 1600px wide or less.

## Commands

- `npm run dev`: local preview (drafts visible)
- `npm run build`: type-check and production build
- `npm run check`: type-check only
