import { defineHead } from "void";

export const head = defineHead(() => ({
  title: "ページが見つかりませんでした",
  meta: [{ name: "robots", content: "noindex" }],
}));
