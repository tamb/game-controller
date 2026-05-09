import type { Preview } from "@storybook/web-components-vite";

const preview = {
  parameters: {
    layout: "fullscreen",
    docs: {
      toc: true,
    },
  },
} satisfies Preview;

export default preview;
