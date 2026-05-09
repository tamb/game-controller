import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../index";
import "../story-event-log/story-event-log";
import { SB_GC_DPAD_EVENTS } from "../story-event-log/story-event-log";

const meta = {
  title: "GC / D-pad",
  component: "gc-dpad",
  parameters: {
    docs: {
      description: {
        component:
          "Standalone `<gc-dpad>`. Press directions — **`gcdpad:*`** lines appear in the log with full `detail` JSON (`controller` serializes as a tag name).",
      },
    },
  },
  render: () =>
    html`<sb-event-log heading="gcdpad:* events" .eventNames=${SB_GC_DPAD_EVENTS}>
      <gc-dpad></gc-dpad>
    </sb-event-log>`,
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  name: "With event log",
};
