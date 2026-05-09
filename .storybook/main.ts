import type { StorybookConfig } from "@storybook/web-components-vite";
import { mergeConfig } from "vite";

const config = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    const base = process.env.STORYBOOK_BASE_PATH ?? "/";
    return mergeConfig(viteConfig, { base });
  },
} satisfies StorybookConfig;

export default config;
