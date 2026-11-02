import { defineHead } from "void";
import { heroFontFiles } from "#src/hero-fonts";

export const head = defineHead(() => ({
  title: "つくる人が集まり、つくり続ける場所",
  meta: [
    {
      name: "description",
      content: "つくる人が集まり、つくり続ける場所。完成したものだけでなく、つくっている途中のことも記録していきます。",
    },
  ],
  link: Object.values(heroFontFiles).map((href) => ({
    rel: "preload",
    href,
    as: "font",
    type: "font/woff2",
    crossorigin: "anonymous",
  })),
}));
