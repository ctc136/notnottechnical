/**
 * Build-time Open Graph images (1200x630 PNG) in the site's notebook style.
 * Satori lays out a small element tree and turns it into SVG; resvg rasterises it.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const C = {
  paper: "#fbfbf8",
  grid: "#e4ecf6",
  text: "#1c1c1c",
  muted: "#3d3d3d",
  ink: "#1f3a93",
  red: "#b42318",
  highlighter: "#ffe066",
  card: "#ffffff",
};

type Child = Node | string;
interface Node {
  type: string;
  props: { style?: Record<string, string | number>; children?: Child | Child[] };
}

function el(style: Record<string, string | number>, children?: Child | Child[]): Node {
  return { type: "div", props: { style: { display: "flex", ...style }, children } };
}

const fontFile = (pkg: string, file: string) =>
  readFileSync(path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

let fonts: Parameters<typeof satori>[1]["fonts"] | undefined;
function loadFonts() {
  fonts ??= [
    { name: "Space Grotesk", weight: 700, style: "normal", data: fontFile("space-grotesk", "space-grotesk-latin-700-normal.woff") },
    { name: "Inter", weight: 400, style: "normal", data: fontFile("inter", "inter-latin-400-normal.woff") },
    { name: "Inter", weight: 600, style: "normal", data: fontFile("inter", "inter-latin-600-normal.woff") },
    { name: "Kalam", weight: 400, style: "normal", data: fontFile("kalam", "kalam-latin-400-normal.woff") },
    { name: "Kalam", weight: 700, style: "normal", data: fontFile("kalam", "kalam-latin-700-normal.woff") },
  ];
  return fonts;
}

/** Graph-paper lines drawn as thin boxes, so the result doesn't depend on gradient support. */
function gridLines(): Node[] {
  const step = 42;
  const lines: Node[] = [];
  for (let x = step; x < OG_WIDTH; x += step) {
    lines.push(el({ position: "absolute", left: x, top: 0, width: 2, height: OG_HEIGHT, backgroundColor: C.grid }));
  }
  for (let y = step; y < OG_HEIGHT; y += step) {
    lines.push(el({ position: "absolute", left: 0, top: y, width: OG_WIDTH, height: 2, backgroundColor: C.grid }));
  }
  return lines;
}

function logo(): Node {
  return el({ alignItems: "baseline", fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 40, color: C.text }, [
    "not",
    el({ fontFamily: "Kalam", fontWeight: 700, fontSize: 38, color: C.ink, margin: "0 12px" }, "not"),
    "technical",
  ]);
}

/** The shared frame: graph paper, logo and domain on top, an index card below. */
function frame(card: Child[]): Node {
  return el(
    { position: "relative", width: OG_WIDTH, height: OG_HEIGHT, backgroundColor: C.paper, fontFamily: "Inter", color: C.text },
    [
      ...gridLines(),
      el({ position: "absolute", left: 60, top: 44, right: 60, alignItems: "baseline", justifyContent: "space-between" }, [
        logo(),
        el({ fontSize: 26, fontWeight: 600, color: C.muted }, "notnottechnical.com"),
      ]),
      // Hard offset shadow, then the card on top of it.
      el({ position: "absolute", left: 72, top: 142, width: 1080, height: 440, backgroundColor: C.text, borderRadius: 10 }),
      el(
        {
          position: "absolute",
          left: 60,
          top: 130,
          // Satori sizes boxes content-box: 1080x440 outside once padding and border are added.
          width: 1080 - 52 * 2 - 4 * 2,
          height: 440 - 44 * 2 - 4 * 2,
          padding: "44px 52px",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: C.card,
          border: `4px solid ${C.text}`,
          borderRadius: 10,
        },
        card,
      ),
    ],
  );
}

function label(text: string): Node {
  return el({ fontFamily: "Kalam", fontWeight: 400, fontSize: 38, color: C.red, marginBottom: 14 }, text);
}

async function toPng(tree: Node): Promise<Buffer> {
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } }).render().asPng();
}

/** One image per post: entry label, title and summary on an index card. */
export function renderPostOg(post: { label: string; title: string; summary: string }): Promise<Buffer> {
  const size = post.title.length <= 34 ? 72 : post.title.length <= 60 ? 60 : 50;
  return toPng(
    frame([
      label(post.label),
      el({ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: size, lineHeight: 1.12, letterSpacing: -1 }, post.title),
      el({ marginTop: 22, fontSize: 30, lineHeight: 1.4, color: C.muted, lineClamp: 2 }, post.summary),
    ]),
  );
}

/** The home page image: the hero headline, strike and highlighter included. */
export function renderHomeOg(): Promise<Buffer> {
  const word = { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 76, lineHeight: 1.15, letterSpacing: -1.5 };
  const struck = el({ position: "relative", marginRight: 22 }, [
    el(word, "not technical"),
    el({ position: "absolute", left: -6, right: -6, top: 50, height: 8, backgroundColor: C.red, borderRadius: 4 }),
  ]);
  // Highlighter: a band of marker across the lower half of the phrase.
  const highlighted = el(
    { ...word, padding: "0 10px", marginLeft: -10, backgroundImage: `linear-gradient(transparent 56%, ${C.highlighter} 56%)` },
    "not not technical.",
  );
  return toPng(
    frame([
      label("a public build log, est. 2026"),
      el({ flexWrap: "wrap", alignItems: "center" }, [
        el({ ...word, marginRight: 22 }, "Going from"),
        struck,
        el({ ...word, marginRight: 22 }, "to"),
        highlighted,
      ]),
      el(
        { marginTop: 26, fontSize: 30, lineHeight: 1.4, color: C.muted },
        "Every other Sunday: what I built with AI, what broke, and what I learned fixing it.",
      ),
    ]),
  );
}
