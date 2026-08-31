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
      entry: {
        main: resolve(__dirname, "src/index.ts"),
        react: resolve(__dirname, "src/react.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "@r2wc/core"],
      treeshake: {
        moduleSideEffects: (id) => id.includes("register"),
      },
      output: {
        preserveModules: false,
      },
    },
    emptyOutDir: true,
  },
});
