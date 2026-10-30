import { defineConfig } from "vite-plus";
import { voidPlugin } from "void";
import { voidReact } from "@void/react/plugin";
import { voidMarkdown } from "@void/md/plugin";

// Void's plugins run tests inside its Cloudflare worker runtime, which fails
// to start; the unit tests only need Node, so they run without them.
const testing = process.env.VITEST === "true";

export default defineConfig({
  plugins: testing ? [] : [voidPlugin(), voidReact(), voidMarkdown()],
  test: {
    include: ["src/**/*.test.ts"],
  },
  fmt: {
    printWidth: 120,
    // AGENTS.md is managed by Void. Records are left as written so a
    // formatting difference never fails a contributor's PR.
    ignorePatterns: ["AGENTS.md", "pages/**/*.md"],
  },
});
