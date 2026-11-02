import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { heroFontFiles } from "./hero-fonts";
import { tagline } from "./site";

const css = readFileSync("node_modules/@fontsource/zen-maru-gothic/700.css", "utf8");

// Each @font-face in Fontsource's CSS pairs one slice file with the unicode ranges it covers.
const slices = [...css.matchAll(/url\(\.\/files\/([^)]+\.woff2\))[^;]*;\s*unicode-range: ([^;]+);/g)].map((m) => ({
  file: m[1].slice(0, -1),
  ranges: m[2].split(",").map((part) => {
    const [low, high = low] = part.trim().replace("U+", "").split("-");
    return [parseInt(low, 16), parseInt(high, 16)];
  }),
}));

// Some characters, such as Latin letters, are in more than one slice. The browser uses the @font-face declared
// last, so search from the end; the first match would be a slice the page never loads.
const sliceOf = (char: string) => {
  const code = char.codePointAt(0)!;
  return [...slices].reverse().find((slice) => slice.ranges.some(([low, high]) => low <= code && code <= high))?.file;
};

describe("heroFontFiles", () => {
  it("picks the slice the browser uses for characters in more than one slice", () => {
    expect(sliceOf("a")).toBe("zen-maru-gothic-latin-700-normal.woff2");
  });

  it("preloads exactly the slices that hold the tagline's characters", () => {
    // Fontsource slices by code point, so the tagline is split by code point rather than by grapheme.
    const needed = new Set(Array.from(tagline, sliceOf));
    expect(needed.has(undefined)).toBe(false);
    const byName = (a: string | undefined, b: string | undefined) => (a ?? "").localeCompare(b ?? "");
    expect(Object.keys(heroFontFiles).sort(byName)).toEqual([...needed].sort(byName));
  });
});
