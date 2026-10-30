import { defineConfig } from "void/config";
import { titleSuffix } from "./src/site";

export default defineConfig({
  output: "static",
  head: {
    titleTemplate: `%s${titleSuffix}`,
    htmlAttrs: { lang: "ja" },
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
    link: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  },
  worker: {
    compatibility_date: "2026-02-24",
  },
});
