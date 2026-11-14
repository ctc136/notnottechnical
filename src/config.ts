export const SITE = {
  name: "Not Not Technical",
  url: "https://notnottechnical.com",
  author: "Chris",
  tagline: "A dude trying hard to go from not technical to not not technical.",
  description:
    "A public build log. Every other Sunday: what I built with AI, what broke, and what I learned fixing it.",
  location: "Pittsburgh",
  xHandle: "TODO", // Chris fills in
  githubRepo: "https://github.com/ctc136/notnottechnical",
  buttondownUsername: "TODO", // Chris fills in after creating the account
  cadence: "every other Sunday",
};

/** The only tags a post may use. Add a tag here before using it in frontmatter. */
export const TAGS = ["web", "hardware", "ai-tools", "fails", "meta"] as const;
export type Tag = (typeof TAGS)[number];

/** True once a "TODO" placeholder in SITE has been replaced with a real value. */
export function isSet(value: string): boolean {
  return value.trim() !== "" && value.trim().toUpperCase() !== "TODO";
}
