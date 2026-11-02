import { defineMiddleware } from "void";
import { brandFontFiles } from "#src/brand-fonts";

// Middleware head defaults reach Markdown pages too, which have no head() of their own.
export default defineMiddleware(async (c, next) => {
  c.set("headDefaults", {
    link: brandFontFiles.map((href) => ({
      rel: "preload",
      href,
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    })),
  });
  await next();
});
