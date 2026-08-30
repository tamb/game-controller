import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../../index";
import { createEl } from "../../storybook/create-el";
import "../story-event-log/story-event-log";
import type { SbEventLogElement } from "../story-event-log/story-event-log";
import { SB_GC_FACE_EVENTS } from "../story-event-log/story-event-log";
import type { GcFaceButtonsElement } from "./gc-face-buttons";

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
          "Standalone `<gc-face-buttons>` (React `GcFaceButtons`). **`actions`** is `2` (A/B) or `4` (A/B/X/Y). Press a button — **`gcface:*`** lines appear in the log with full `detail` JSON (`controller` serializes as a tag name).",
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
  render: (args: StoryArgs) => {
    const log = createEl<SbEventLogElement>("sb-event-log", {
      heading: "gcface:* events",
      eventNames: SB_GC_FACE_EVENTS,
    });
    log.append(createEl<GcFaceButtonsElement>("gc-face-buttons", { actions: args.actions }));
    return log;
  },
} satisfies Meta<StoryArgs>;

export default meta;

export const Default: StoryObj<StoryArgs> = {
  name: "With event log",
};
