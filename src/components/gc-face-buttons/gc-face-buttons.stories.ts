import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../index";
import "../story-event-log/story-event-log";
import { SB_GC_FACE_EVENTS } from "../story-event-log/story-event-log";

type StoryArgs = {
  actions: number;
};

const meta = {
  title: "GC / Face buttons",
  component: "gc-face-buttons",
  parameters: {
    docs: {
      description: {
        component:
          "Standalone `<gc-face-buttons>`. **`actions`** is `2` (A/B) or `4` (A/B/X/Y). Press a button — **`gcface:*`** lines appear in the log with full `detail` JSON (`controller` serializes as a tag name).",
      },
    },
  },
  args: {
    actions: 2,
  },
  argTypes: {
    actions: {
      control: "select",
      options: [2, 4],
      description: "Face button count",
    },
  },
  render: (args: StoryArgs) =>
    html`<sb-event-log heading="gcface:* events" .eventNames=${SB_GC_FACE_EVENTS}>
      <gc-face-buttons .actions=${args.actions}></gc-face-buttons>
    </sb-event-log>`,
} satisfies Meta<StoryArgs>;

export default meta;

export const Default: StoryObj<StoryArgs> = {
  name: "With event log",
};
