import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidReact } from "@void/react/plugin";
import { voidMarkdown } from "@void/md/plugin";

// Void's plugins run tests inside its Cloudflare worker runtime, which fails
// to start; the unit tests only need Node, so they run without them.
const testing = process.env.VITEST === "true";

export default defineConfig({
  plugins: testing ? [] : [voidPlugin(), voidReact({ react: { compiler: true } }), voidMarkdown()],
  test: {
    include: ["src/**/*.test.ts"],
  },
});
