// Regenerates the favicon set in public/: a handwritten ink-blue "nn" on paper.
// Run with `npm run favicons`. The outputs are committed, so this only needs
// re-running if the mark changes.
import { readFileSync, writeFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const SIZE = 64;
const kalam = readFileSync("node_modules/@fontsource/kalam/files/kalam-latin-700-normal.woff");

// Satori converts the text to vector paths, so the SVG needs no font at runtime.
const BORDER = 3;
const svg = await satori(
  {
    type: "div",
    props: {
      // Outer square is the dark border; the paper sits inside it.
      // Satori sizes boxes content-box, so padding is subtracted from the width.
      style: { display: "flex", width: SIZE - BORDER * 2, height: SIZE - BORDER * 2, padding: BORDER, backgroundColor: "#1c1c1c", borderRadius: 13 },
      children: {
        type: "div",
        props: {
          style: {
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fbfbf8",
            borderRadius: 10,
            color: "#1f3a93",
            fontFamily: "Kalam",
            fontSize: 44,
            lineHeight: 1,
            paddingTop: 2,
          },
          children: "nn",
        },
      },
    },
  },
  { width: SIZE, height: SIZE, fonts: [{ name: "Kalam", weight: 700, style: "normal", data: kalam }] },
);

const png = (width) => new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();

/** Wrap a PNG in a minimal single-image .ico container. */
function ico(image, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(image.length, 14);
  header.writeUInt32LE(22, 18); // offset of image data
  return Buffer.concat([header, image]);
}

writeFileSync("public/favicon.svg", svg);
writeFileSync("public/favicon-32.png", png(32));
writeFileSync("public/favicon-192.png", png(192));
writeFileSync("public/apple-touch-icon.png", png(180));
writeFileSync("public/favicon.ico", ico(png(32), 32));
console.log("Wrote favicon.svg, favicon.ico, favicon-32.png, favicon-192.png and apple-touch-icon.png to public/");
