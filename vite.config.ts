import { defineConfig } from "vitest/config";

/** Root Vite config (Storybook + Vitest). Library builds use `vite.lib.config.ts`. */
export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
    clearMocks: true,
  },
});
