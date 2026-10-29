import { describe, expect, it } from "vite-plus/test";
import { addOgTags, decodeVoidEntities, escapeAttr } from "./og";

const site = { name: "makewith", url: "https://makewith.jp", titleSuffix: " | makewith" };

// Builds a head the way Void renders it: titleTemplate applied, and title and
// attributes escaped with the same four entities.
const page = (title: string, description?: string) =>
  `<html><head><title>${escapeAttr(title + site.titleSuffix)}</title>${
    description === undefined ? "" : `<meta name="description" content="${escapeAttr(description)}">`
  }</head><body></body></html>`;

const meta = (html: string, key: string) =>
  html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)">`))?.[1];

describe("decodeVoidEntities", () => {
  it("reverses escapeAttr without decoding entity-like text twice", () => {
    for (const text of ['A & B "q" <x>', "&quot;", "&amp;quot;", "&lt;&gt;"]) {
      expect(decodeVoidEntities(escapeAttr(text))).toBe(text);
    }
  });
});

describe("addOgTags", () => {
  it("adds the canonical link and every tag for an article with an image", () => {
    const html = addOgTags(page("t", "d"), { path: "/making/x/", isArticle: true, image: "/images/a.jpg" }, site);

    expect(html).toContain(
      [
        '<link rel="canonical" href="https://makewith.jp/making/x/">',
        '<meta property="og:site_name" content="makewith">',
        '<meta property="og:type" content="article">',
        '<meta property="og:title" content="t">',
        '<meta property="og:description" content="d">',
        '<meta property="og:url" content="https://makewith.jp/making/x/">',
        '<meta property="og:image" content="https://makewith.jp/images/a.jpg">',
        '<meta property="og:locale" content="ja_JP">',
        '<meta name="twitter:card" content="summary_large_image">',
        "</head>",
      ].join("\n"),
    );
  });

  it("escapes the title and description exactly once", () => {
    const title = 'A & B "q" <x> &quot; and &amp;quot;';
    const description = 'D & "q" <b> &quot;';
    const html = addOgTags(page(title, description), { path: "/making/x/", isArticle: true }, site);

    expect(meta(html, "og:title")).toBe(escapeAttr(title));
    expect(meta(html, "og:description")).toBe(escapeAttr(description));
  });

  it("inserts a title with $ patterns as plain text", () => {
    const html = addOgTags(page("A $' $& B"), { path: "/", isArticle: false }, site);

    expect(meta(html, "og:title")).toBe("A $' $&amp; B");
  });

  it("keeps values built from the path and image inside their attributes", () => {
    const html = addOgTags(
      page("t"),
      { path: '/a"><script>x</script>/', isArticle: false, image: '/i"><script>.jpg' },
      site,
    );

    expect(html).not.toContain("<script>");
    expect(html).toContain('<link rel="canonical" href="https://makewith.jp/a&quot;&gt;&lt;script&gt;x&lt;/script&gt;/">');
  });

  it("uses article for records and website otherwise", () => {
    expect(meta(addOgTags(page("t"), { path: "/making/x/", isArticle: true }, site), "og:type")).toBe("article");
    expect(meta(addOgTags(page("t"), { path: "/", isArticle: false }, site), "og:type")).toBe("website");
  });

  it("falls back to a small card and no og:image without an image", () => {
    const html = addOgTags(page("t", "d"), { path: "/making/", isArticle: false }, site);

    expect(meta(html, "og:image")).toBeUndefined();
    expect(meta(html, "twitter:card")).toBe("summary");
  });

  it("omits og:description when the page has none", () => {
    const html = addOgTags(page("t"), { path: "/", isArticle: false }, site);

    expect(meta(html, "og:description")).toBeUndefined();
  });

  it("takes the site name off the end of og:title only", () => {
    const og = (title: string) => meta(addOgTags(page(title), { path: "/", isArticle: false }, site), "og:title");

    expect(og("t")).toBe("t");
    expect(og("a | makewith b")).toBe("a | makewith b");
    expect(og("a | makewith")).toBe("a | makewith");
  });

  it("fails when <title> does not end with the site name", () => {
    expect(() => addOgTags("<html><head><title>t | other</title></head></html>", { path: "/", isArticle: false }, site)).toThrow(
      '<title> does not end with " | makewith": /',
    );
  });

  it("fails without </head> or <title>", () => {
    expect(() => addOgTags("<html><body></body></html>", { path: "/", isArticle: false }, site)).toThrow("</head>");
    expect(() => addOgTags("<html><head></head></html>", { path: "/", isArticle: false }, site)).toThrow("<title>");
  });
});
