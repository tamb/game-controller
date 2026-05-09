import type { StorybookConfig } from "@storybook/web-components-vite";

const config = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
} satisfies StorybookConfig;

export default config;
