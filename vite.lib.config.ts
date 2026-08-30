import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.build.json",
      exclude: ["**/*.stories.ts", "**/*.test.ts", "**/*.test.tsx", ".storybook/**"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "main",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "@r2wc/core"],
      output: {
        preserveModules: false,
      },
    },
    emptyOutDir: true,
  },
});
