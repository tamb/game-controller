import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const dir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(dir, "demo"),
  base: process.env.DEMO_BASE_PATH ?? "/game-controller/demo/",
  build: {
    outDir: resolve(dir, "dist-site/demo"),
    emptyOutDir: false,
  },
});
