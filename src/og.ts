// Void gives Markdown pages only <title> and a description, so the Open Graph
// tags are derived from the rendered HTML rather than written on every page.
// Values read back from the HTML are decoded to plain text, and every value
// is escaped once when the tags are built.

export const escapeAttr = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// Exact inverse of the four entities Void's head renderer emits; one pass so
// text such as "&amp;quot;" is not decoded twice.
const entities: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' };
export const decodeVoidEntities = (value: string) => value.replace(/&(?:amp|lt|gt|quot);/g, (e) => entities[e]);

export interface OgPage {
  // Canonical path with a trailing slash, such as "/about/".
  path: string;
  isArticle: boolean;
  // A site path, such as "/images/a.jpg".
  image?: string;
}

export interface OgSite {
  name: string;
  url: string;
  // What titleTemplate appends to every <title>.
  titleSuffix: string;
}

export function addOgTags(html: string, page: OgPage, site: OgSite): string {
  if (!html.includes("</head>")) throw new Error(`No </head> to add Open Graph tags to: ${page.path}`);
  const titleHtml = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (titleHtml === undefined) throw new Error(`No <title> for Open Graph tags: ${page.path}`);
  const fullTitle = decodeVoidEntities(titleHtml);
  if (!fullTitle.endsWith(site.titleSuffix)) {
    throw new Error(`<title> does not end with "${site.titleSuffix}": ${page.path}`);
  }
  const title = fullTitle.slice(0, fullTitle.length - site.titleSuffix.length);
  // A page without a description just omits og:description.
  const descriptionHtml = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const description = descriptionHtml && decodeVoidEntities(descriptionHtml);
  const url = site.url + page.path;
  const imageUrl = page.image && site.url + page.image;

  const tags: [string, string, string | undefined][] = [
    ["property", "og:site_name", site.name],
    ["property", "og:type", page.isArticle ? "article" : "website"],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["property", "og:image", imageUrl],
    ["property", "og:locale", "ja_JP"],
    ["name", "twitter:card", imageUrl ? "summary_large_image" : "summary"],
  ];
  const meta = tags
    .flatMap(([attr, key, content]) => (content ? [`<meta ${attr}="${key}" content="${escapeAttr(content)}">`] : []))
    .join("\n");
  const canonical = `<link rel="canonical" href="${escapeAttr(url)}">`;

  // A function, so "$&" or "$'" in a title is not read as a replacement pattern.
  return html.replace("</head>", () => `${canonical}\n${meta}\n</head>`);
}
