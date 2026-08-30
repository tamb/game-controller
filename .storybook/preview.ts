import type { Preview } from "@storybook/web-components-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { GC_STORY_VIEWPORTS } from "../src/storybook/gc-viewports";

const preview = {
  parameters: {
    layout: "fullscreen",
    docs: {
      toc: true,
    },
    viewport: {
      options: {
        ...MINIMAL_VIEWPORTS,
        ...GC_STORY_VIEWPORTS,
      },
    },
  },
} satisfies Preview;

export default preview;
