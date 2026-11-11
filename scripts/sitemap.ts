// Void has no sitemap support, so this runs after `vp build` over the written pages.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "#src/site";
import { pagePath, sitemapXml } from "#src/sitemap";

const root = "dist/client";
const files = (await readdir(root, { recursive: true })).filter((file) => file.endsWith(".html"));
const pages = await Promise.all(
  files.map(async (file) => ({ file: file.replaceAll("\\", "/"), html: await readFile(join(root, file), "utf8") })),
);
// If pages stop being written as x/index.html, every page but the top would
// silently drop out of the sitemap while the build still passes.
const unmapped = pages.filter((page) => pagePath(page.file) === undefined && page.file !== "404.html");
if (unmapped.length > 0) {
  throw new Error(`Not a page path the sitemap knows: ${unmapped.map((page) => page.file).join(", ")}`);
}
await writeFile(join(root, "sitemap.xml"), sitemapXml(siteUrl, pages));
