import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../index";
import "../story-event-log/story-event-log";
import { SB_GC_ANCILLARY_EVENTS } from "../story-event-log/story-event-log";

const meta = {
  title: "GC / Ancillary buttons",
  component: "gc-ancillary-buttons",
  parameters: {
    docs: {
      description: {
        component:
          "Standalone `<gc-ancillary-buttons>` row (fullscreen, select, start). Press a button — **`gcancillary:*`** lines appear in the log with full `detail` JSON (`controller` serializes as a tag name).",
      },
    },
  },
  render: () =>
    html`<sb-event-log heading="gcancillary:* events" .eventNames=${SB_GC_ANCILLARY_EVENTS}>
      <gc-ancillary-buttons></gc-ancillary-buttons>
    </sb-event-log>`,
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  name: "With event log",
};
