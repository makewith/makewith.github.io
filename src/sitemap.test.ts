import { describe, expect, it } from "vite-plus/test";
import { pagePath, sitemapXml } from "./sitemap";

describe("pagePath", () => {
  it("maps directory indexes to trailing-slash paths and skips other files", () => {
    expect(pagePath("index.html")).toBe("/");
    expect(pagePath("making/x/index.html")).toBe("/making/x/");
    expect(pagePath("404.html")).toBeUndefined();
  });
});

describe("sitemapXml", () => {
  it("lists indexable pages in path order", () => {
    const xml = sitemapXml("https://makewith.jp", [
      { file: "making/index.html", html: "<head></head>" },
      { file: "index.html", html: "<head></head>" },
      { file: "404.html", html: '<head><meta name="robots" content="noindex"></head>' },
      { file: "hidden/index.html", html: '<head><meta name="robots" content="noindex, nofollow"></head>' },
    ]);

    expect(xml).toContain(
      [
        "  <url><loc>https://makewith.jp/</loc></url>",
        "  <url><loc>https://makewith.jp/making/</loc></url>",
        "</urlset>",
      ].join("\n"),
    );
    expect(xml).not.toContain("404");
    expect(xml).not.toContain("hidden");
  });
});
