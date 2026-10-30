import { defineMiddleware } from "void";
import { addOgTags } from "#src/og";
import { records } from "#src/records";
import { placeImage, placeImagePaths, siteName, siteUrl, titleSuffix } from "#src/site";

export default defineMiddleware(async (c, next) => {
  await next();
  // Error pages come from Void, without the site's title suffix, and are not shared.
  if (!c.res.ok || !c.res.headers.get("content-type")?.includes("text/html")) return;

  const path = c.req.path.endsWith("/") ? c.req.path : `${c.req.path}/`;
  const record = records.find((r) => r.path === path);
  const image = record?.image ?? (placeImagePaths.includes(path) ? placeImage : undefined);
  const html = addOgTags(
    await c.res.text(),
    { path, isArticle: Boolean(record), image },
    { name: siteName, url: siteUrl, titleSuffix },
  );

  c.res = new Response(html, c.res);
});
