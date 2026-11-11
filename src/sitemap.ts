// Kept free of imports so scripts/sitemap.ts can load it with plain Node after the build.

export type BuiltPage = { file: string; html: string };

// Void writes each page as x/index.html (routing.trailingSlash), so only those
// files are pages; 404.html and anything marked noindex stay out.
export function pagePath(file: string): string | undefined {
  if (file === "index.html") return "/";
  if (!file.endsWith("/index.html")) return undefined;
  return `/${file.slice(0, -"index.html".length)}`;
}

const noindex = /<meta name="robots" content="[^"]*noindex/;

export function sitemapXml(siteUrl: string, pages: BuiltPage[]): string {
  const urls = pages
    .filter((page) => !noindex.test(page.html))
    .map((page) => pagePath(page.file))
    .filter((path) => path !== undefined)
    .sort()
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
