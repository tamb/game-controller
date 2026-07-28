import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const dir = fileURLToPath(new URL(".", import.meta.url));
const base = process.env.DEMO_BASE_PATH ?? "/game-controller/demo/";

export default defineConfig({
  root: resolve(dir, "demo"),
  base,
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "icons/apple-touch-icon.png"],
      manifest: {
        name: "Game Controller Demo",
        short_name: "Controller",
        description:
          "Interactive demo of @tamb/gamecontroller — a virtual Gameboy-style controller for the web.",
        theme_color: "#020617",
        background_color: "#020617",
        display: "standalone",
        orientation: "any",
        scope: base,
        start_url: base,
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  build: {
    outDir: resolve(dir, "dist-site/demo"),
    emptyOutDir: false,
  },
});
