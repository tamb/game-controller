import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../../index";
import { createEl } from "../../storybook/create-el";
import "../story-event-log/story-event-log";
import type { SbEventLogElement } from "../story-event-log/story-event-log";
import { SB_GC_DPAD_EVENTS } from "../story-event-log/story-event-log";

const meta = {
  title: "GC / D-pad",
  component: "gc-dpad",
  parameters: {
    docs: {
      description: {
        component:
          "Standalone `<gc-dpad>` (React `GcDpad`). Press directions — **`gcdpad:*`** lines appear in the log with full `detail` JSON (`controller` serializes as a tag name).",
      },
    },
  },
  render: () => {
    const log = createEl<SbEventLogElement>("sb-event-log", {
      heading: "gcdpad:* events",
      eventNames: SB_GC_DPAD_EVENTS,
    });
    log.append(document.createElement("gc-dpad"));
    return log;
  },
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  name: "With event log",
};
