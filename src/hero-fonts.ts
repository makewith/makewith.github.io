import f113 from "@fontsource/zen-maru-gothic/files/zen-maru-gothic-113-700-normal.woff2?url";
import f115 from "@fontsource/zen-maru-gothic/files/zen-maru-gothic-115-700-normal.woff2?url";
import f116 from "@fontsource/zen-maru-gothic/files/zen-maru-gothic-116-700-normal.woff2?url";
import f117 from "@fontsource/zen-maru-gothic/files/zen-maru-gothic-117-700-normal.woff2?url";
import f119 from "@fontsource/zen-maru-gothic/files/zen-maru-gothic-119-700-normal.woff2?url";

// The Zen Maru Gothic 700 slices that hold the home page heading's characters. The heading is the largest text on
// the first screen, so a swap from the fallback face shows there most; preloading just these slices lets it arrive
// in time. hero-fonts.test.ts fails when the tagline or the font version changes which slices are needed.
export const heroFontFiles: Record<string, string> = {
  "zen-maru-gothic-113-700-normal.woff2": f113,
  "zen-maru-gothic-115-700-normal.woff2": f115,
  "zen-maru-gothic-116-700-normal.woff2": f116,
  "zen-maru-gothic-117-700-normal.woff2": f117,
  "zen-maru-gothic-119-700-normal.woff2": f119,
};
