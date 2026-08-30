import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../../index";
import { createEl } from "../../storybook/create-el";
import "../story-event-log/story-event-log";
import type { SbEventLogElement } from "../story-event-log/story-event-log";
import { SB_GC_ANCILLARY_EVENTS } from "../story-event-log/story-event-log";

const meta = {
  title: "GC / Ancillary buttons",
  component: "gc-ancillary-buttons",
  parameters: {
    docs: {
      description: {
        component:
          "Standalone `<gc-ancillary-buttons>` (React `GcAncillaryButtons`) row (fullscreen, select, start). Press a button — **`gcancillary:*`** lines appear in the log with full `detail` JSON (`controller` serializes as a tag name).",
      },
    },
  },
  render: () => {
    const log = createEl<SbEventLogElement>("sb-event-log", {
      heading: "gcancillary:* events",
      eventNames: SB_GC_ANCILLARY_EVENTS,
    });
    log.append(document.createElement("gc-ancillary-buttons"));
    return log;
  },
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  name: "With event log",
};
